import React, { createContext, useContext, useState, useEffect } from 'react';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  // Game State
  const [date, setDate] = useState(new Date('1970-01-01T00:00:00'));
  const [money, setMoney] = useState(500000); // Starting capital
  const [researchPoints, setResearchPoints] = useState(0);

  // Inventory & Products
  const [inventory, setInventory] = useState({
    sensors: [],
    processors: [],
    lenses: [],
    bodies: [], // Unlocked bodies
    films: []   // Designed films
  });

  const [products, setProducts] = useState([]); // Products currently on sale
  const [staff, setStaff] = useState([]);

  // Game Loop settings
  const MS_PER_DAY = 10000; // 10 seconds real time = 1 day game time

  useEffect(() => {
    const timer = setInterval(() => {
      // Increment date by 1 day
      setDate(prevDate => {
        const nextDate = new Date(prevDate);
        nextDate.setDate(nextDate.getDate() + 1);
        return nextDate;
      });

      // Here we will eventually add logic for sales, expenses, etc.
      // For now, it's just the clock ticking.
      setProducts(currentProducts => {
        return currentProducts.map(p => {
            if (!p.onSale) return p;

            // Simple Sales Logic
            // Base sales on Quality vs Price ratio + Review Score
            const ageInMonths = (new Date() - new Date(p.launchDate)) / MS_PER_DAY; // Rough approx
            // Better: store launchTick or just decrement a 'monthsLeft' counter.

            // Let's use a simpler approach: calculate sales this month
            // Ideal Price ~ Quality * 10
            const idealPrice = p.quality * 10;
            const priceFactor = idealPrice / (p.price || 1);
            const reviewFactor = p.rating ? (p.rating / 5) : 0.5;

            // Random variation
            let monthlySales = Math.floor(100 * priceFactor * reviewFactor * Math.random());

            // Cap sales by stock (if we tracked stock, but for now we produce on demand or assume stock)
            // The prompt says "pick how many get produced based on how much money the user has"
            // So we should track stock.
            let sold = 0;
            if (p.stock >= monthlySales) {
                sold = monthlySales;
            } else {
                sold = p.stock;
            }

            return {
                ...p,
                stock: p.stock - sold,
                totalSold: (p.totalSold || 0) + sold,
                revenueLastMonth: sold * p.price,
                monthsOnMarket: (p.monthsOnMarket || 0) + 1
            };
        });
      });

    }, MS_PER_DAY);

    return () => clearInterval(timer);
  }, []);

  // Separate effect to collect revenue
  useEffect(() => {
     let totalRevenue = 0;
     products.forEach(p => {
         if (p.revenueLastMonth) {
             totalRevenue += p.revenueLastMonth;
         }
     });

     if (totalRevenue > 0) {
         setMoney(m => m + totalRevenue);
     }
  }, [products]);

  // Effect for Monthly Expenses (Staff)
  // We need to trigger this when date changes (monthly)
  useEffect(() => {
      // Calculate staff costs
      const totalStaffCost = staff.reduce((acc, s) => acc + s.cost, 0);
      if (totalStaffCost > 0) {
          setMoney(m => m - totalStaffCost);
      }
  }, [date]); // This runs every month (every 10s)


  const addProduct = (product) => {
      setProducts(prev => [...prev, product]);
  };

  const value = {
    date,
    money,
    researchPoints,
    inventory,
    setInventory,
    products,
    setProducts,
    addProduct,
    staff,
    setStaff,
    setMoney,
    setResearchPoints
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};
