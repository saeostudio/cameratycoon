import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import './Sales.css';

function Sales({ onBack }) {
    const { products, setProducts, money, setMoney, date } = useGame();
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Launch Form State
    const [launchPrice, setLaunchPrice] = useState(500);
    const [productionQty, setProductionQty] = useState(100);

    const handleSelectProduct = (product) => {
        setSelectedProduct(product);
        if (!product.onSale) {
            // Defaults
            setLaunchPrice(product.quality * 10); // Simple default
            setProductionQty(100);
        }
    };

    const handleLaunch = () => {
        if (!selectedProduct) return;

        const costPerUnit = calculateUnitCost(selectedProduct);
        const totalProductionCost = costPerUnit * productionQty;

        if (money < totalProductionCost) {
            alert(`Not enough money! Need $${totalProductionCost}`);
            return;
        }

        setMoney(m => m - totalProductionCost);

        // Generate Reviews
        const reviews = generateReviews(selectedProduct, launchPrice);
        const avgRating = reviews.reduce((a, b) => a + b.rating, 0) / reviews.length;

        const updatedProduct = {
            ...selectedProduct,
            onSale: true,
            price: launchPrice,
            stock: productionQty,
            launchDate: new Date(date),
            costPerUnit,
            reviews,
            rating: avgRating,
            totalSold: 0,
            revenueLastMonth: 0,
            monthsOnMarket: 0
        };

        setProducts(prev => prev.map(p => p.id === selectedProduct.id ? updatedProduct : p));
        setSelectedProduct(null); // Return to list
    };

    const calculateUnitCost = (p) => {
        // A placeholder cost calculation
        // Real implementation would sum component costs
        return Math.floor(p.quality * 5);
    };

    const generateReviews = (p, price) => {
        // Logic:
        // Quality vs Price
        // Component balance (e.g. Good sensor but bad lens = mixed review)

        // Simplified for now
        const value = (p.quality * 10) / price; // 1.0 is fair value
        let baseRating = 3;
        if (value > 1.2) baseRating += 1; // Good deal
        if (value > 1.5) baseRating += 1; // Great deal
        if (value < 0.8) baseRating -= 1; // Overpriced
        if (value < 0.5) baseRating -= 1; // Ripoff

        // Randomize slightly
        const reviews = [];
        const comments = [
            "Great camera for the price!",
            "Battery life could be better.",
            "Amazing image quality.",
            "Too expensive for what you get.",
            "Solid build quality.",
            "The lens is a bit soft."
        ];

        for (let i = 0; i < 4; i++) {
            let rating = baseRating + (Math.random() > 0.5 ? 1 : -1) * Math.random();
            rating = Math.max(1, Math.min(5, rating)); // Clamp 1-5
            reviews.push({
                id: i,
                rating: Math.round(rating * 10) / 10,
                text: comments[Math.floor(Math.random() * comments.length)]
            });
        }
        return reviews;
    };

    const renderLaunchForm = () => {
        const cost = calculateUnitCost(selectedProduct);
        return (
            <div className="launch-form">
                <h3>Launch {selectedProduct.name}</h3>
                <p>Quality Score: {selectedProduct.quality}</p>
                <p>Unit Cost: ${cost}</p>

                <div className="form-group">
                    <label>Price: ${launchPrice}</label>
                    <input type="range" min={cost} max={cost * 5} value={launchPrice} onChange={e => setLaunchPrice(Number(e.target.value))} />
                </div>

                <div className="form-group">
                    <label>Production Qty: {productionQty}</label>
                    <input type="range" min="10" max="1000" step="10" value={productionQty} onChange={e => setProductionQty(Number(e.target.value))} />
                </div>

                <p>Total Cost: ${cost * productionQty}</p>
                <button className="launch-btn" onClick={handleLaunch}>RELEASE PRODUCT</button>
            </div>
        );
    };

    const renderActiveProduct = () => (
        <div className="product-details">
            <h3>{selectedProduct.name} (On Market)</h3>
            <div className="stats-grid">
                <div className="stat">Price: ${selectedProduct.price}</div>
                <div className="stat">Stock: {selectedProduct.stock}</div>
                <div className="stat">Sold: {selectedProduct.totalSold}</div>
                <div className="stat">Rating: {selectedProduct.rating} ★</div>
            </div>

            <h4>Recent Reviews</h4>
            <div className="reviews-list">
                {selectedProduct.reviews.map(r => (
                    <div key={r.id} className="review-card">
                        <span className="stars">{'★'.repeat(Math.round(r.rating))}</span>
                        <p>"{r.text}"</p>
                    </div>
                ))}
            </div>
            <button onClick={() => setSelectedProduct(null)}>Back to List</button>
        </div>
    );

    return (
        <div className="sales-container">
             <div className="sales-header">
                <button onClick={onBack}>← Back</button>
                <h2>Sales & Marketing</h2>
            </div>

            <div className="sales-content">
                {selectedProduct ? (
                    selectedProduct.onSale ? renderActiveProduct() : renderLaunchForm()
                ) : (
                    <div className="product-list">
                        <h3>Inventory</h3>
                        {products.length === 0 && <p>No products manufactured yet.</p>}
                        {products.map(p => (
                            <div key={p.id} className="product-card" onClick={() => handleSelectProduct(p)}>
                                <div className="p-info">
                                    <span className="p-name">{p.name}</span>
                                    <span className="p-status">{p.onSale ? '🟢 Selling' : '🔴 Unreleased'}</span>
                                </div>
                                {p.onSale && <span className="p-revenue">+${p.revenueLastMonth?.toLocaleString()} last month</span>}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Sales;
