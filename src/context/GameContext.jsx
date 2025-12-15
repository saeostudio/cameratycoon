import React, { createContext, useContext, useState, useEffect } from 'react';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

const SAVE_KEY = 'camera_tycoon_save_v1';

export const GameProvider = ({ children }) => {
  // --- State Initialization ---

  // Load from local storage or use defaults
  const loadState = () => {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Convert date string back to object
        if (parsed.date) parsed.date = new Date(parsed.date);
        return parsed;
      }
    } catch (e) {
      console.error("Failed to load save:", e);
    }
    return null;
  };

  const initialState = loadState();

  // Core Stats
  const [date, setDate] = useState(initialState?.date || new Date('1980-01-01T00:00:00')); // Start in 80s
  const [money, setMoney] = useState(initialState?.money ?? 500000);
  const [researchPoints, setResearchPoints] = useState(initialState?.researchPoints ?? 0);
  const [fans, setFans] = useState(initialState?.fans ?? 0);
  const [gameStatus, setGameStatus] = useState(initialState?.gameStatus || 'playing'); // 'playing', 'game_over'

  // Company Identity
  const [company, setCompany] = useState(initialState?.company || { name: '', logo: '' });

  // Progression
  const [unlocks, setUnlocks] = useState(initialState?.unlocks || ['camera_type_film', 'film_type_35mm', 'sensor_standard']);

  // Inventory & Products
  const [inventory, setInventory] = useState(initialState?.inventory || {
    sensors: [],
    processors: [],
    lenses: [],
    bodies: [],
    films: []
  });

  const [products, setProducts] = useState(initialState?.products || []);
  const [staff, setStaff] = useState(initialState?.staff || []);

  // Events & Notifications
  const [activeEvent, setActiveEvent] = useState(null);

  // Game Loop Constants
  const MS_PER_DAY = 5000;

  // --- Persistence ---

  // Auto-save function
  const saveGame = () => {
    const stateToSave = {
      date,
      money,
      researchPoints,
      fans,
      company,
      unlocks,
      inventory,
      products,
      staff,
      gameStatus
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(stateToSave));
    console.log("Game Saved");
  };

  // Save every month
  useEffect(() => {
    saveGame();
  }, [date]);


  // --- Game Loop ---

  // Bankruptcy Check Loop
  useEffect(() => {
      if (money <= 0 && gameStatus === 'playing') {
          setGameStatus('game_over');
      }
  }, [money, gameStatus]);


  const fansRef = React.useRef(fans);
  useEffect(() => { fansRef.current = fans; }, [fans]);

  // Ref for products to use inside intervals without dependency loops
  const productsRef = React.useRef(products);
  useEffect(() => { productsRef.current = products; }, [products]);


  useEffect(() => {
      if (gameStatus !== 'playing') return;

      const timer = setInterval(() => {
        setDate(prev => {
            const next = new Date(prev);
            next.setMonth(next.getMonth() + 1);
            return next;
        });

        // --- Monthly Logic ---
        setProducts(curr => {
            let rev = 0;
            let newFans = 0;
            const currentFans = fansRef.current;

            const nextProds = curr.map(p => {
                // Skip logic if product is just a blueprint (not launched) or sold out
                if (!p.onSale) return p;

                // Debuffs
                let salesMultiplier = 1;
                if (p.salesDebuff) salesMultiplier = 0.5;

                const idealPrice = p.quality * 15;
                const priceFactor = idealPrice / (p.price || 1);
                const reviewFactor = p.rating ? (p.rating / 5) : 0.5;
                const fanBoost = 1 + (currentFans / 1000000);

                let monthlySales = Math.floor(100 * priceFactor * reviewFactor * fanBoost * salesMultiplier * Math.random());

                let sold = Math.min(p.stock, monthlySales);

                const r = sold * p.price;
                rev += r;

                // Fan Impact
                if (sold > 0) {
                    if (p.rating > 3) {
                        newFans += Math.floor(sold * (p.rating - 2));
                    } else if (p.rating < 2) {
                        // Bad products lose fans
                        newFans -= Math.floor(sold * (2 - p.rating));
                    }
                }

                const updated = {
                    ...p,
                    stock: p.stock - sold,
                    totalSold: (p.totalSold || 0) + sold,
                    revenueLastMonth: r,
                    monthsOnMarket: (p.monthsOnMarket || 0) + 1
                };

                // Auto-Finish Logic (Sold Out)
                if (updated.stock <= 0) {
                     setActiveEvent({
                         type: 'positive',
                         title: `${p.name} Sold Out!`,
                         description: `Great job! You sold ${updated.totalSold.toLocaleString()} units. The production run is complete.`,
                         date: new Date().toLocaleDateString()
                     });
                     // Mark for removal by filtering below
                     return { ...updated, _remove: true };
                }

                return updated;
            });

            // Filter out sold-out products
            const filteredProds = nextProds.filter(p => !p._remove);

            if (rev > 0) setMoney(m => m + rev);
            // Allow fans to go negative? No, min 0.
            if (newFans !== 0) setFans(f => Math.max(0, f + newFans));

            return filteredProds;
        });

        // --- Random Events ---
        triggerRandomEvents();

      }, 10000); // 1 Month = 10 Seconds
      return () => clearInterval(timer);
  }, [gameStatus]);


  // Effect for Monthly Expenses (Staff)
  useEffect(() => {
      if (gameStatus !== 'playing') return;

      const totalStaffCost = staff.reduce((acc, s) => acc + s.cost, 0);
      if (totalStaffCost > 0) {
          setMoney(m => m - totalStaffCost);
      }
  }, [date, staff, gameStatus]);


  const triggerRandomEvents = () => {
      // 10% Chance per month for an event check
      if (Math.random() > 0.1) return;
      if (activeEvent) return; // Don't stack events

      const roll = Math.random();
      const currentProducts = productsRef.current.filter(p => p.onSale);

      // Lawsuit (Only if you have products)
      if (roll < 0.1 && currentProducts.length > 0) {
           const target = currentProducts[Math.floor(Math.random() * currentProducts.length)];
           setActiveEvent({
               type: 'lawsuit',
               title: 'Patent Lawsuit!',
               description: `A competitor claims your ${target.name} infringes on their patent. Pay the settlement or cease production immediately.`,
               cost: 500000,
               targetId: target.id,
               date: new Date().toLocaleDateString()
           });
           return;
      }

      // Natural Disaster (Factory Hit)
      if (roll < 0.2) {
          const dmg = Math.floor(Math.random() * 50000) + 10000;
          setMoney(m => m - dmg);
          setActiveEvent({
              type: 'negative',
              title: 'Natural Disaster',
              description: `A storm hit the factory! Repairs cost $${dmg.toLocaleString()}.`,
              date: new Date().toLocaleDateString()
          });
          return;
      }

      // Copycat
      if (roll < 0.3 && currentProducts.length > 0) {
          const target = currentProducts[Math.floor(Math.random() * currentProducts.length)];
          // Apply debuff
          setProducts(prev => prev.map(p => p.id === target.id ? { ...p, salesDebuff: true } : p));

          setActiveEvent({
              type: 'negative',
              title: 'Copycat Detected',
              description: `Cheap knockoffs of ${target.name} are flooding the market. Sales will slow down.`,
              date: new Date().toLocaleDateString()
          });
      }
  };

  const handleEventAction = (action) => {
      if (!activeEvent) return;

      if (activeEvent.type === 'lawsuit') {
          if (action === 'pay') {
              if (money >= activeEvent.cost) {
                  setMoney(m => m - activeEvent.cost);
                  setActiveEvent(null);
              } else {
                  alert("Not enough money! You must withdraw the product.");
              }
          } else if (action === 'giveup') {
              // User surrendered. Remove product AND design.
              const targetP = products.find(p => p.id === activeEvent.targetId);

              if (targetP) {
                   // 1. Remove from Sales (The Product Batch)
                   setProducts(prev => prev.filter(p => p.id !== activeEvent.targetId));

                   // 2. Remove Design from Inventory (The Blueprint)
                   // Only works if we can identify the design.
                   // Films and Lenses have 'designId' in their config/product object.
                   if (targetP.designId) {
                       setInventory(prev => ({
                           ...prev,
                           // Filter both just to be safe, though usually ID is unique across both or specific
                           films: prev.films.filter(f => f.id !== targetP.designId),
                           lenses: prev.lenses.filter(l => l.id !== targetP.designId)
                       }));
                       console.log(`Deleted design ${targetP.designId} from inventory.`);
                   } else {
                       console.log("Product has no linked designId (likely a Camera), so only the active batch was destroyed.");
                   }
              }
              setActiveEvent(null);
          }
      }
  };


  const addProduct = (product) => {
      // Missing Shipment Check (1/1000)
      if (Math.random() < 0.001) {
          setActiveEvent({
              type: 'negative',
              title: 'Shipment Lost at Sea',
              description: `Tragedy! The entire batch of ${product.name} was lost in transit. Insurance does not cover this.`,
              date: new Date().toLocaleDateString()
          });
          return; // Do not add to products
      }
      setProducts(prev => [...prev, product]);
  };

  const unlockTech = (techKey) => {
      if (!unlocks.includes(techKey)) {
          setUnlocks(prev => [...prev, techKey]);
      }
  };

  // Hard Reset (Factory Reset)
  const hardReset = () => {
      localStorage.removeItem(SAVE_KEY);
      window.location.reload();
  }

  // Soft Reset (Play Again)
  const softReset = () => {
      // Preserve Company, Reset everything else
      const freshState = {
          date: new Date('1980-01-01T00:00:00'),
          money: 500000,
          researchPoints: 0,
          fans: 0,
          company: company, // Keep company
          unlocks: ['camera_type_film', 'film_type_35mm', 'sensor_standard'],
          inventory: {
            sensors: [],
            processors: [],
            lenses: [],
            bodies: [],
            films: []
          },
          products: [],
          staff: [],
          gameStatus: 'playing'
      };

      // Save immediatley and reload to ensure clean state
      localStorage.setItem(SAVE_KEY, JSON.stringify(freshState));
      window.location.reload();
  };

  const value = {
    date,
    money,
    researchPoints,
    fans,
    company,
    setCompany,
    unlocks,
    unlockTech,
    inventory,
    setInventory,
    products,
    setProducts,
    addProduct,
    staff,
    setStaff,
    setMoney,
    setResearchPoints,
    setFans,
    hardReset,
    softReset,
    saveGame,
    gameStatus,
    activeEvent,
    setActiveEvent,
    handleEventAction
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};
