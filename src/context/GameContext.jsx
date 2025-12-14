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
      // Increment date by 1 Month
      setDate(prevDate => {
        const nextDate = new Date(prevDate);
        nextDate.setMonth(nextDate.getMonth() + 1);
        return nextDate;
      });

      // Process Sales & Revenue
      setProducts(currentProducts => {
        let totalRevenueThisTick = 0;

        const updatedProducts = currentProducts.map(p => {
            if (!p.onSale) return p;

            // Simple Sales Logic
            // Base sales on Quality vs Price ratio + Review Score

            // Ideal Price ~ Quality * 10
            const idealPrice = p.quality * 10;
            const priceFactor = idealPrice / (p.price || 1);
            const reviewFactor = p.rating ? (p.rating / 5) : 0.5;

            // Random variation
            let monthlySales = Math.floor(100 * priceFactor * reviewFactor * Math.random());

            // Cap sales by stock
            let sold = 0;
            if (p.stock >= monthlySales) {
                sold = monthlySales;
            } else {
                sold = p.stock;
            }

            const revenue = sold * p.price;
            totalRevenueThisTick += revenue;

            return {
                ...p,
                stock: p.stock - sold,
                totalSold: (p.totalSold || 0) + sold,
                revenueLastMonth: revenue,
                monthsOnMarket: (p.monthsOnMarket || 0) + 1
            };
        });

        // Add revenue directly here to avoid double-counting in effects
        if (totalRevenueThisTick > 0) {
            setMoney(m => m + totalRevenueThisTick);
        }

        return updatedProducts;
      });

    }, MS_PER_DAY);

    return () => clearInterval(timer);
  }, []);


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
