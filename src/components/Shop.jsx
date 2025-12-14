import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import './Shop.css';

const RESEARCH_ITEMS = [
    { id: 'tech_sensor_1inch', name: '1 Inch Sensor Tech', cost: 1000, type: 'unlock', unlockId: '1inch', category: 'sensor' },
    { id: 'tech_sensor_apsc', name: 'APS-C Sensor Tech', cost: 5000, type: 'unlock', unlockId: 'apsc', category: 'sensor' },
    { id: 'tech_sensor_fullframe', name: 'Full Frame Tech', cost: 20000, type: 'unlock', unlockId: 'fullframe', category: 'sensor' },
    { id: 'tech_sensor_medium', name: 'Medium Format Tech', cost: 50000, type: 'unlock', unlockId: 'medium', category: 'sensor' },
    { id: 'tech_factory_upgrade', name: 'Factory Automation', cost: 2000, type: 'upgrade', category: 'factory', desc: 'Faster production' },
    { id: 'tech_lens_coating', name: 'Advanced Lens Coating', cost: 1500, type: 'upgrade', category: 'lens', desc: '+10 Quality for Lenses' }
];

function Shop({ onBack }) {
    const { researchPoints, setResearchPoints, inventory, setInventory } = useGame();
    const [purchased, setPurchased] = useState([]); // Track IDs of bought tech

    // In a real app, 'purchased' should be in global state to persist.
    // I should move this to GameContext. But for now, I'll just check if the item is unlocked in inventory logic.
    // Actually, let's add `unlockedTech` to GameContext.
    // For now, I will simulate it by checking if the sensor size is unlocked in the Lab.
    // Wait, the Lab has `locked: true` in `SENSOR_SIZES`. I need to be able to modify that constant or state.

    // Correction: `SENSOR_SIZES` in `Lab.jsx` is a constant. I should make it state or read from context.
    // To fix this without refactoring everything, I'll store 'unlockedItems' in context and have Lab read it.

    // For this step, I'll assume we update context.

    const handleBuy = (item) => {
        if (researchPoints < item.cost) {
            alert("Not enough Research Points!");
            return;
        }

        setResearchPoints(rp => rp - item.cost);

        // Apply Effect
        if (item.category === 'sensor') {
             // We need to tell the game this size is unlocked.
             // Since I can't easily modify the constant in Lab.jsx,
             // I will add a `unlockedTech` array to Context and update Lab to check it.
             setInventory(prev => ({
                 ...prev,
                 unlockedTech: [...(prev.unlockedTech || []), item.unlockId]
             }));
        } else {
             setInventory(prev => ({
                 ...prev,
                 unlockedTech: [...(prev.unlockedTech || []), item.id]
             }));
        }
    };

    const isUnlocked = (item) => {
        const unlocked = inventory.unlockedTech || [];
        if (item.category === 'sensor') return unlocked.includes(item.unlockId);
        return unlocked.includes(item.id);
    };

    return (
        <div className="shop-container">
            <div className="shop-header">
                <button onClick={onBack}>← Back</button>
                <h2>Research Center</h2>
            </div>
            <div className="shop-content">
                <div className="rp-display">
                    You have <span className="rp-count">{Math.floor(researchPoints)} RP</span>
                </div>

                <div className="tech-list">
                    {RESEARCH_ITEMS.map(item => {
                        const bought = isUnlocked(item);
                        return (
                            <div key={item.id} className={`tech-card ${bought ? 'bought' : ''}`}>
                                <div className="tech-info">
                                    <h4>{item.name}</h4>
                                    <p>{item.desc || 'Unlocks new component size'}</p>
                                </div>
                                {bought ? (
                                    <button disabled className="bought-btn">Researched</button>
                                ) : (
                                    <button className="buy-btn" onClick={() => handleBuy(item)}>
                                        Research ({item.cost} RP)
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Shop;
