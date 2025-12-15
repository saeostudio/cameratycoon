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

  useEffect(() => {
      if (gameStatus !== 'playing') return;

      const timer = setInterval(() => {
        setDate(prev => {
            const next = new Date(prev);
            next.setMonth(next.getMonth() + 1);
            return next;
        });

        setProducts(curr => {
            let rev = 0;
            let newFans = 0;
            const currentFans = fansRef.current;

            const nextProds = curr.map(p => {
                if (!p.onSale) return p;

                const idealPrice = p.quality * 15;
                const priceFactor = idealPrice / (p.price || 1);
                const reviewFactor = p.rating ? (p.rating / 5) : 0.5;
                const fanBoost = 1 + (currentFans / 1000000);

                let monthlySales = Math.floor(100 * priceFactor * reviewFactor * fanBoost * Math.random());

                let sold = Math.min(p.stock, monthlySales);

                const r = sold * p.price;
                rev += r;

                if (p.rating > 3 && sold > 0) {
                    newFans += Math.floor(sold * (p.rating - 2));
                }

                return {
                    ...p,
                    stock: p.stock - sold,
                    totalSold: (p.totalSold || 0) + sold,
                    revenueLastMonth: r,
                    monthsOnMarket: (p.monthsOnMarket || 0) + 1
                };
            });

            if (rev > 0) setMoney(m => m + rev);
            if (newFans > 0) setFans(f => f + newFans);

            return nextProds;
        });

      }, 10000);
      return () => clearInterval(timer);
  }, [gameStatus]); // Add gameStatus dependency to stop loop on game over


  // Effect for Monthly Expenses (Staff)
  useEffect(() => {
      if (gameStatus !== 'playing') return;

      const totalStaffCost = staff.reduce((acc, s) => acc + s.cost, 0);
      if (totalStaffCost > 0) {
          setMoney(m => m - totalStaffCost);
      }
  }, [date, staff, gameStatus]);


  const addProduct = (product) => {
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
    gameStatus
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};
