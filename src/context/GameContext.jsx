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
  const MS_PER_DAY = 5000; // Speed up a bit? 5s per month for smoother gameplay? Original was 10s. keeping 10s for now.
  // Actually original was 10s for 1 month.

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
      staff
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(stateToSave));
    console.log("Game Saved");
  };

  // Save every month
  useEffect(() => {
    saveGame();
  }, [date]);


  // --- Game Loop ---

  useEffect(() => {
    const timer = setInterval(() => {
      // Increment date by 1 Month
      setDate(prevDate => {
        const nextDate = new Date(prevDate);
        nextDate.setMonth(nextDate.getMonth() + 1);
        return nextDate;
      });

      // Process Sales & Revenue
      setProducts(currentProducts => {
        let totalRevenueThisTick = 0;
        let totalNewFans = 0;

        const updatedProducts = currentProducts.map(p => {
            if (!p.onSale) return p;

            // Simple Sales Logic
            const idealPrice = p.quality * 15; // Increased multiplier slightly
            const priceFactor = idealPrice / (p.price || 1);
            const reviewFactor = p.rating ? (p.rating / 5) : 0.5;

            // Random variation
            // Sales impacted by Fans count? Maybe slightly.
            let fanBoost = 1 + (fans / 1000000);

            let monthlySales = Math.floor(100 * priceFactor * reviewFactor * fanBoost * Math.random());

            // Cap sales by stock
            let sold = 0;
            if (p.stock >= monthlySales) {
                sold = monthlySales;
            } else {
                sold = p.stock;
            }

            const revenue = sold * p.price;
            totalRevenueThisTick += revenue;

            // Fans growth based on sales of good products
            if (p.rating > 3 && sold > 0) {
                totalNewFans += Math.floor(sold * (p.rating - 2));
            }

            return {
                ...p,
                stock: p.stock - sold,
                totalSold: (p.totalSold || 0) + sold,
                revenueLastMonth: revenue,
                monthsOnMarket: (p.monthsOnMarket || 0) + 1
            };
        });

        if (totalRevenueThisTick > 0) {
            setMoney(m => m + totalRevenueThisTick);
        }
        if (totalNewFans > 0) {
            setFans(f => f + totalNewFans);
        }

        return updatedProducts;
      });

    }, 10000); // 10s per month

    return () => clearInterval(timer);
  }, [fans]); // Add fans to dependency if used in calc, but careful of re-triggering interval.
  // Actually, using functional state updates inside the interval is safer to avoid resetting the timer.
  // The 'fans' usage above inside the interval callback refers to the closure value.
  // If I don't restart the timer, 'fans' will be stale (0).
  // Fix: Use functional setProducts and pass fans in via ref or just restart timer?
  // Restarting timer every render is bad.
  // Best practice: Use a Ref for mutable values accessed inside interval, OR functional updates only.
  // Since 'fans' affects sales, I need the current value.

  // Let's refactor the Interval to not depend on 'fans' directly or use a Ref.

  const fansRef = React.useRef(fans);
  useEffect(() => { fansRef.current = fans; }, [fans]);

  useEffect(() => {
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
  }, []);


  // Effect for Monthly Expenses (Staff)
  useEffect(() => {
      const totalStaffCost = staff.reduce((acc, s) => acc + s.cost, 0);
      if (totalStaffCost > 0) {
          setMoney(m => m - totalStaffCost);
      }
  }, [date, staff]);


  const addProduct = (product) => {
      setProducts(prev => [...prev, product]);
  };

  const unlockTech = (techKey) => {
      if (!unlocks.includes(techKey)) {
          setUnlocks(prev => [...prev, techKey]);
      }
  };

  const resetGame = () => {
      localStorage.removeItem(SAVE_KEY);
      window.location.reload();
  }

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
    resetGame,
    saveGame
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};
