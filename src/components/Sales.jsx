import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { CameraIcon, FilmIcon, LensIcon } from './visuals/Icons';
import './Sales.css';

function Sales({ onBack }) {
    const { products, setProducts, money, setMoney, date } = useGame();
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Launch Form State
    const [launchPrice, setLaunchPrice] = useState(500);
    const [marketingBudget, setMarketingBudget] = useState(0);

    const handleSelectProduct = (product) => {
        setSelectedProduct(product);
        if (!product.onSale) {
            // Defaults
            // If price was already set in factory (which it is now), use that as base
            setLaunchPrice(product.price || product.quality * 10);
        }
    };

    const handleLaunch = () => {
        if (!selectedProduct) return;

        // Marketing cost
        if (money < marketingBudget) {
            alert(`Not enough money for marketing! Need $${marketingBudget}`);
            return;
        }
        if (marketingBudget > 0) {
            setMoney(m => m - marketingBudget);
        }

        // Generate Reviews (Initial buzz)
        const reviews = generateReviews(selectedProduct, launchPrice);
        const avgRating = reviews.reduce((a, b) => a + b.rating, 0) / reviews.length;

        const updatedProduct = {
            ...selectedProduct,
            onSale: true,
            price: launchPrice,
            launchDate: new Date(date),
            reviews,
            rating: avgRating,
            marketingBudget: marketingBudget // Could affect sales logic in Context
        };

        setProducts(prev => prev.map(p => p.id === selectedProduct.id ? updatedProduct : p));
        setSelectedProduct(null); // Return to list
    };

    const generateReviews = (p, price) => {
        // Value = Quality / Price ratio
        // Ideal price is roughly Quality * 15 (updated logic)
        const idealPrice = p.quality * 15;
        const value = idealPrice / price;

        let baseRating = 3;
        if (value > 1.2) baseRating += 1.5; // Good deal
        if (value > 0.9 && value <= 1.2) baseRating += 0.5; // Fair
        if (value < 0.7) baseRating -= 1; // Overpriced
        if (value < 0.5) baseRating -= 2; // Ripoff

        // Clamp
        baseRating = Math.max(1, Math.min(5, baseRating));

        // Randomize slightly
        const reviews = [];
        const commentsPositive = ["Great camera!", "Love the colors.", "Best purchase.", "Solid build.", "Excellent value."];
        const commentsNegative = ["Too expensive.", "Broke after a week.", "Poor battery.", "Focus is slow.", "Not worth it."];
        const commentsNeutral = ["It's okay.", "Good for beginners.", "Average performance.", "Nice design but slow."];

        for (let i = 0; i < 4; i++) {
            let rating = baseRating + (Math.random() - 0.5); // +/- 0.5 variation
            rating = Math.max(1, Math.min(5, rating));

            let pool = commentsNeutral;
            if (rating > 4) pool = commentsPositive;
            if (rating < 2.5) pool = commentsNegative;

            reviews.push({
                id: i,
                rating: Math.round(rating * 10) / 10,
                text: pool[Math.floor(Math.random() * pool.length)]
            });
        }
        return reviews;
    };

    const renderLaunchForm = () => {
        // Estimated Unit Cost (reverse engineering or we should save it on product)
        // Let's assume we want margin.
        const recommendedMin = 100;
        const recommendedMax = 5000;

        return (
            <div className="launch-form">
                <h3>Launch {selectedProduct.name}</h3>
                <p>Quality Score: {selectedProduct.quality}</p>
                <p>Stock: {selectedProduct.stock}</p>

                <div className="form-group">
                    <label>Set Retail Price: ${launchPrice}</label>
                    <input type="range" min={recommendedMin} max={recommendedMax} step="10" value={launchPrice} onChange={e => setLaunchPrice(Number(e.target.value))} />
                    <input type="number" value={launchPrice} onChange={e => setLaunchPrice(Number(e.target.value))} />
                </div>

                <div className="form-group">
                    <label>Marketing Budget: ${marketingBudget}</label>
                    <input type="range" min="0" max="50000" step="1000" value={marketingBudget} onChange={e => setMarketingBudget(Number(e.target.value))} />
                    <p className="hint">Marketing boosts initial awareness.</p>
                </div>

                <button className="launch-btn" onClick={handleLaunch}>LAUNCH TO MARKET</button>
            </div>
        );
    };

    const renderIcon = (p, size=50) => {
        if (p.productLine === 'film') return <FilmIcon color={p.color} size={size} type={p.format} />;
        if (p.productLine === 'lens') return <LensIcon color={p.color} size={size} />;
        // Camera
        return <CameraIcon bodyColor={p.bodyColor} gripColor={p.gripColor} type={p.type} size={size} />;
    };

    const renderActiveProduct = () => (
        <div className="product-details">
            <div className="product-header-visual">
                {renderIcon(selectedProduct, 80)}
                <div className="header-text">
                    <h3>{selectedProduct.name}</h3>
                    <span className="badge">ON SALE</span>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-box">
                    <span className="label">Price</span>
                    <span className="value">${selectedProduct.price}</span>
                </div>
                <div className="stat-box">
                    <span className="label">Stock</span>
                    <span className="value">{selectedProduct.stock}</span>
                </div>
                <div className="stat-box">
                    <span className="label">Total Sold</span>
                    <span className="value">{selectedProduct.totalSold || 0}</span>
                </div>
                <div className="stat-box">
                    <span className="label">Rating</span>
                    <span className="value">{selectedProduct.rating?.toFixed(1) || '-'} ★</span>
                </div>
            </div>

            <div className="reviews-section">
                <h4>Market Feedback</h4>
                {selectedProduct.reviews.length === 0 ? <p>No reviews yet.</p> : (
                    <div className="reviews-list">
                        {selectedProduct.reviews.map(r => (
                            <div key={r.id} className="review-card">
                                <span className="stars">{'★'.repeat(Math.round(r.rating))}</span>
                                <p>"{r.text}"</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button className="back-btn" onClick={() => setSelectedProduct(null)}>Back to List</button>
        </div>
    );

    return (
        <div className="sales-container">
            {/*
             <div className="sales-header">
                <button onClick={onBack}>← Back</button>
                <h2>Sales & Marketing</h2>
            </div>
            */}

            <div className="sales-content">
                {selectedProduct ? (
                    selectedProduct.onSale ? renderActiveProduct() : renderLaunchForm()
                ) : (
                    <div className="product-list">
                        <h3>Inventory & Active Products</h3>
                        {products.length === 0 && <p className="empty-msg">No products manufactured yet. Go to the Factory!</p>}
                        {products.map(p => (
                            <div key={p.id} className="product-card" onClick={() => handleSelectProduct(p)}>
                                <div className="p-icon">
                                    {renderIcon(p, 50)}
                                </div>
                                <div className="p-details-col">
                                    <div className="p-info">
                                        <span className="p-name">{p.name}</span>
                                        {p.onSale ? (
                                            <span className="p-tag sale">Selling</span>
                                        ) : (
                                            <span className="p-tag new">Ready to Launch</span>
                                        )}
                                    </div>
                                    <div className="p-metrics">
                                        <span>Qty: {p.stock}</span>
                                        {p.onSale && <span>Revenue: ${p.revenueLastMonth?.toLocaleString() || 0}/mo</span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Sales;
