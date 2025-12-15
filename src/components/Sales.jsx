import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { CameraIcon, FilmIcon, LensIcon } from './visuals/Icons';
import './Sales.css';

function Sales({ onBack }) {
    const { products, setProducts, money, setMoney, date, inventory } = useGame();
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Launch Form State
    const [launchPrice, setLaunchPrice] = useState(500);
    const [marketingBudget, setMarketingBudget] = useState(0);
    const [selectedKitLens, setSelectedKitLens] = useState(''); // ID of lens design to bundle

    const handleSelectProduct = (product) => {
        setSelectedProduct(product);
        if (!product.onSale) {
            // Defaults
            let defaultPrice = product.price || product.quality * 10;
            if (product.productLine === 'film') {
                 defaultPrice = Math.max(5, Math.min(20, Math.round(product.quality / 5)));
            }
            setLaunchPrice(defaultPrice);
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
        const reviews = generateReviews(selectedProduct, launchPrice, selectedKitLens);
        const avgRating = reviews.reduce((a, b) => a + b.rating, 0) / reviews.length;

        const updatedProduct = {
            ...selectedProduct,
            onSale: true,
            price: launchPrice,
            launchDate: new Date(date),
            reviews,
            rating: avgRating,
            marketingBudget: marketingBudget,
            kitLensId: selectedKitLens || null
        };

        setProducts(prev => prev.map(p => p.id === selectedProduct.id ? updatedProduct : p));
        setSelectedProduct(null);
    };

    const generateReviews = (p, price, kitLensId) => {
        // Value Logic
        let idealPrice = p.quality * 15;

        // Kit Value Bonus
        if (kitLensId) {
            idealPrice += 300; // Arbitrary value add for a kit
        }

        if (p.productLine === 'film') {
            idealPrice = p.quality * 0.25;
        }

        const value = idealPrice / price;

        let baseRating = 3;
        if (value > 1.2) baseRating += 1.5;
        if (value > 0.9 && value <= 1.2) baseRating += 0.5;
        if (value < 0.7) baseRating -= 1;
        if (value < 0.5) baseRating -= 2;

        // Clamp
        baseRating = Math.max(1, Math.min(5, baseRating));

        // Detailed Feedback Logic
        const getFeedback = (r) => {
             const isPositive = r > 3.5;
             const isNegative = r < 2.5;

             // Tech aspects
             if (p.productLine === 'camera') {
                 if (isPositive) return [
                     p.batteryId ? "Great battery life." : "Power management is good.",
                     p.screenId === 'fully_articulated' ? "Love the flip screen!" : "Screen is sharp.",
                     p.sensorId ? "Image quality is stunning." : "Colors are perfect.",
                     kitLensId ? "The kit lens is surprisingly sharp." : "Good ergonomics.",
                     "Autofocus nails it every time."
                 ];
                 if (isNegative) return [
                     p.batteryId === 'aa' ? "Eats batteries like crazy." : "Battery life is weak.",
                     p.screenId === 'none' ? "Really miss having a screen." : "Screen washes out in sun.",
                     "Images are too noisy.",
                     "Colors look oversaturated.",
                     "Menu system is confusing."
                 ];
             }
             if (p.productLine === 'film') {
                 if (isPositive) return [
                     "Beautiful grain structure.",
                     "Colors really pop.",
                     "Great latitude.",
                     "My new favorite stock.",
                     "Classic look."
                 ];
                 if (isNegative) return [
                     "Too grainy for my taste.",
                     "Colors look muddy.",
                     "Base is too thin.",
                     "Scanned poorly.",
                     "Not worth the price."
                 ];
             }
             if (p.productLine === 'lens') {
                 if (isPositive) return [
                     "Sharp corner to corner.",
                     "Creamy bokeh.",
                     "Fast aperture is a lifesaver.",
                     "No chromatic aberration.",
                     "Solid metal construction."
                 ];
                 if (isNegative) return [
                     "Soft wide open.",
                     "Too much vignetting.",
                     "Focus ring is gritty.",
                     "Heavy distortion.",
                     "Autofocus motor is loud."
                 ];
             }
             return isPositive ? ["Excellent product.", "Recommend it."] : ["Waste of money.", "Avoid."];
        };

        // Randomize
        const reviews = [];

        for (let i = 0; i < 4; i++) {
            let rating = baseRating + (Math.random() - 0.5);
            rating = Math.max(1, Math.min(5, rating));

            let pool = getFeedback(rating);
            let text = pool[Math.floor(Math.random() * pool.length)];

            reviews.push({
                id: i,
                rating: Math.round(rating * 10) / 10,
                text
            });
        }
        return reviews;
    };

    const handleDeleteProduct = (e, productId) => {
        e.stopPropagation(); // Prevent clicking the card
        if (confirm("Are you sure you want to delete this product? You cannot undo this.")) {
            setProducts(prev => prev.filter(p => p.id !== productId));
        }
    };

    const renderLaunchForm = () => {
        const isFilm = selectedProduct.productLine === 'film';
        const isCamera = selectedProduct.productLine === 'camera';
        const recommendedMin = isFilm ? 1 : 100;
        const recommendedMax = isFilm ? 50 : 5000;
        const step = isFilm ? 0.5 : 10;

        return (
            <div className="launch-form">
                <h3>Launch {selectedProduct.name}</h3>
                <p>Quality Score: {selectedProduct.quality}</p>
                <p>Stock: {selectedProduct.stock}</p>

                <div className="form-group">
                    <label>Set Retail Price: ${launchPrice}</label>
                    <input type="range" min={recommendedMin} max={recommendedMax} step={step} value={launchPrice} onChange={e => setLaunchPrice(Number(e.target.value))} />
                    <input type="number" value={launchPrice} onChange={e => setLaunchPrice(Number(e.target.value))} />
                </div>

                {isCamera && (
                    <div className="form-group">
                        <label>Sell as Kit (Bundle Lens):</label>
                        <select value={selectedKitLens} onChange={e => setSelectedKitLens(e.target.value)}>
                            <option value="">Body Only</option>
                            {inventory.lenses.map(l => (
                                <option key={l.id} value={l.id}>{l.name} ({l.focalLength})</option>
                            ))}
                        </select>
                        <p className="hint">Bundling a lens increases perceived value.</p>
                    </div>
                )}

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
                                <button className="delete-btn" onClick={(e) => handleDeleteProduct(e, p.id)}>🗑️</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Sales;
