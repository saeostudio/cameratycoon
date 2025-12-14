import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { CameraIcon, FilmIcon, LensIcon } from './visuals/Icons';
import './Factory.css';

const CAMERA_TYPES = [
    { id: 'camera_type_film', name: 'Film SLR', type: 'film', cost: 100 },
    { id: 'camera_type_medium', name: 'Medium Format', type: 'film', cost: 250 },
    { id: 'camera_type_compact', name: 'Compact', type: 'digital', cost: 150 },
    { id: 'camera_type_dslr', name: 'DSLR', type: 'digital', cost: 300 },
    { id: 'camera_type_mirrorless', name: 'Mirrorless', type: 'digital', cost: 500 },
];

const BATTERIES = [
    { id: 'aa', name: 'AA Batteries', capacity: 100, cost: 5, unlockId: null },
    { id: '2cr5', name: '2CR5', capacity: 300, cost: 15, unlockId: 'battery_high_cap' },
    { id: 'np-w126s', name: 'NP-W126S', capacity: 800, cost: 30, unlockId: 'battery_high_cap' },
    { id: 'np-w235', name: 'NP-W235', capacity: 1500, cost: 50, unlockId: 'battery_high_cap' },
];

const SCREENS = [
    { id: 'none', name: 'No Screen', cost: 0, type: 'fixed' },
    { id: 'fixed_3', name: '3" Fixed LCD', cost: 20, type: 'fixed' },
    { id: 'tilt', name: '3" Tilt Screen', cost: 40, type: 'tilt' },
    { id: 'fully_articulated', name: '3" Fully Articulated', cost: 60, type: 'articulated' },
];

function Factory({ onFinish }) {
    const { inventory, unlocks, setResearchPoints, staff, money, setMoney } = useGame();
    const [step, setStep] = useState(0); // 0 = Product Line Selection
    const [productLine, setProductLine] = useState('camera'); // camera, film, lens
    const [isManufacturing, setIsManufacturing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [quantity, setQuantity] = useState(100);

    // Configuration State
    const [config, setConfig] = useState({
        name: 'New Product',
        // Camera specific
        type: 'camera_type_film',
        sensorId: '',
        processorId: '',
        screenId: 'fixed_3',
        batteryId: 'aa',

        // Visuals
        bodyColor: '#333333',
        gripColor: '#111111',

        // Film/Lens specific
        designId: '',

        hasFlash: true,
    });

    // Check unlocks
    const availableCameraTypes = CAMERA_TYPES.filter(t => unlocks.includes(t.id));

    // Manufacturing Loop
    useEffect(() => {
        let interval;
        if (isManufacturing) {
            interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        finishManufacturing();
                        return 100;
                    }
                    setResearchPoints(rp => rp + 1);
                    return prev + (100 / 50); // Speed up: 100% in 50 ticks (5s) for testing
                });
            }, 100);
        }
        return () => clearInterval(interval);
    }, [isManufacturing]);

    const calculateUnitCost = () => {
        let unitCost = 50;
        if (productLine === 'camera') {
            const camType = CAMERA_TYPES.find(c => c.id === config.type);
            unitCost += camType ? camType.cost : 0;
            if (config.batteryId) {
                 const bat = BATTERIES.find(b => b.id === config.batteryId);
                 if (bat) unitCost += bat.cost;
            }
            if (config.screenId) {
                 const scr = SCREENS.find(s => s.id === config.screenId);
                 if (scr) unitCost += scr.cost;
            }
            // Add component costs (simplified)
        } else if (productLine === 'film' && config.designId) {
             const design = inventory.films.find(i => i.id === config.designId);
             unitCost = 2; // Drastically lower base cost for film
             if (design && design.format === '120') unitCost += 3;
        } else if (productLine === 'lens') {
            unitCost = 30; // Base lens cost
        }
        return unitCost;
    };

    const finishManufacturing = () => {
        setIsManufacturing(false);

        // Finalize Product Data
        const quality = calculateQuality();
        const unitCost = calculateUnitCost();

        let extraProps = {};
        if (productLine !== 'camera' && config.designId) {
             const list = productLine === 'film' ? inventory.films : inventory.lenses;
             const design = list.find(i => i.id === config.designId);
             if (design) {
                 extraProps = {
                     color: design.color,
                     type: design.type,
                     format: design.format,
                     iso: design.iso,
                     lensType: design.lensType,
                     focalLength: design.focalLength
                 };
             }
        }

        let finalProduct = {
            ...config,
            ...extraProps,
            productLine,
            id: Date.now(),
            quality,
            price: unitCost * 3, // Default markup
            reviews: [],
            stock: quantity, // Use selected quantity
            monthsOnMarket: 0
        };

        onFinish(finalProduct);
    };

    const calculateQuality = () => {
        let base = 50;
        const staffBonus = staff.reduce((acc, s) => acc + (s.skill || 0), 0);
        return Math.min(100, Math.floor(base + (staffBonus * 0.5) + (Math.random() * 10)));
    };

    const handleStartManufacturing = () => {
        if (!config.name) return alert("Please name your product.");

        if (productLine === 'camera') {
            const isDigital = config.type !== 'camera_type_film';
            if (isDigital && !config.sensorId) return alert("Digital cameras need a sensor!");
            if (isDigital && !config.processorId) return alert("Digital cameras need a processor!");
        } else {
            if (!config.designId) return alert(`Please select a ${productLine} design!`);
        }

        // Calculate and Deduct Cost
        const unitCost = calculateUnitCost();
        const totalCost = unitCost * quantity;

        if (money < totalCost) {
            return alert(`Not enough cash! You need $${totalCost.toLocaleString()}.`);
        }

        setMoney(prev => prev - totalCost);
        setIsManufacturing(true);
    };

    const isLocked = (unlockId) => {
        if (!unlockId) return false;
        return !unlocks.includes(unlockId);
    };

    const renderStep0_Line = () => (
        <div className="factory-step centered">
             <h3>Select Production Line</h3>
             <div className="grid-options big-icons">
                 <button className={`option-card huge ${productLine === 'camera' ? 'selected' : ''}`} onClick={() => setProductLine('camera')}>
                    <CameraIcon size={80} />
                    <span>Camera</span>
                 </button>
                 <button className={`option-card huge ${productLine === 'film' ? 'selected' : ''}`} onClick={() => setProductLine('film')}>
                    <FilmIcon size={80} />
                    <span>Film</span>
                 </button>
                 <button className={`option-card huge ${productLine === 'lens' ? 'selected' : ''}`} onClick={() => setProductLine('lens')}>
                    <LensIcon size={80} />
                    <span>Lens</span>
                 </button>
             </div>
             <button className="next-btn" onClick={() => setStep(1)}>Next</button>
        </div>
    );

    const renderStep1_Configuration = () => {
        if (productLine === 'camera') {
            return (
                <div className="factory-step">
                    <h3>Step 1: Camera Design</h3>
                    <label>Model Name: <input value={config.name} onChange={e => setConfig({...config, name: e.target.value})} /></label>

                    <label>Body Chassis Type:</label>
                    <div className="grid-options">
                        {availableCameraTypes.map(t => (
                            <button
                                key={t.id}
                                className={`option-card ${config.type === t.id ? 'selected' : ''}`}
                                onClick={() => setConfig({...config, type: t.id})}
                            >
                                {t.name}
                            </button>
                        ))}
                    </div>

                    <div className="color-config">
                        <label>Body Color:
                            <input type="color" value={config.bodyColor} onChange={e => setConfig({...config, bodyColor: e.target.value})} />
                        </label>
                         <label>Grip Color:
                            <input type="color" value={config.gripColor} onChange={e => setConfig({...config, gripColor: e.target.value})} />
                        </label>
                    </div>

                    <div className="preview-container">
                        <p>Preview:</p>
                        <CameraIcon
                            type={config.type}
                            bodyColor={config.bodyColor}
                            gripColor={config.gripColor}
                            size={120}
                        />
                    </div>

                    <button className="next-btn" onClick={() => setStep(2)}>Next: Components</button>
                </div>
            );
        } else {
            const list = productLine === 'film' ? inventory.films : inventory.lenses;
            return (
                <div className="factory-step">
                    <h3>Step 1: Select Design</h3>
                    <label>Product Name: <input value={config.name} onChange={e => setConfig({...config, name: e.target.value})} /></label>

                    {list.length === 0 ? <p className="error">No {productLine} designs found! Go to Lab first.</p> : (
                        <div className="scroll-options">
                            {list.map(item => (
                                <button
                                    key={item.id}
                                    className={`mini-card ${config.designId === item.id ? 'selected' : ''}`}
                                    onClick={() => setConfig({...config, designId: item.id, name: item.name})}
                                >
                                    {productLine === 'film' ? (
                                        <FilmIcon color={item.color} type={item.format} size={30} />
                                    ) : (
                                        <LensIcon color={item.color} size={30} />
                                    )}
                                    <span>{item.name}</span>
                                </button>
                            ))}
                        </div>
                    )}
                     <button className="next-btn" onClick={() => setStep(3)} disabled={!config.designId}>Next: Manufacture</button>
                </div>
            );
        }
    };

    const renderStep2_Components = () => {
        const isDigital = config.type !== 'camera_type_film';

        return (
            <div className="factory-step">
                <h3>Step 2: Internals</h3>

                {isDigital && (
                    <>
                        <label>Sensor:</label>
                        <select value={config.sensorId} onChange={e => setConfig({...config, sensorId: e.target.value})}>
                            <option value="">Select Sensor...</option>
                            {inventory.sensors.map(s => <option key={s.id} value={s.id}>{s.name} ({s.size})</option>)}
                        </select>

                        <label>Processor:</label>
                        <select value={config.processorId} onChange={e => setConfig({...config, processorId: e.target.value})}>
                             <option value="">Select Processor...</option>
                             {inventory.processors.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>

                        <label>Screen:</label>
                        <select value={config.screenId} onChange={e => setConfig({...config, screenId: e.target.value})}>
                            {SCREENS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </>
                )}

                <label>Battery:</label>
                <select value={config.batteryId} onChange={e => setConfig({...config, batteryId: e.target.value})}>
                    {BATTERIES.map(b => {
                         const locked = isLocked(b.unlockId);
                         return (
                            <option key={b.id} value={b.id} disabled={locked}>
                                {b.name} {locked ? '(Locked)' : ''}
                            </option>
                         );
                    })}
                </select>

                <button className="next-btn" onClick={() => setStep(3)}>Next: Review & Build</button>
            </div>
        );
    };

    const renderStep3_Build = () => {
        const unitCost = calculateUnitCost();
        const totalCost = unitCost * quantity;

        return (
            <div className="factory-step">
                <h3>Step 3: Manufacture</h3>
                <div className="summary">
                    <p><strong>Product:</strong> {config.name}</p>
                    <p><strong>Line:</strong> {productLine.toUpperCase()}</p>
                    <p><strong>Unit Cost:</strong> ${unitCost}</p>
                </div>

                <div className="quantity-control">
                    <label>Batch Size: {quantity.toLocaleString()}</label>
                    <input
                        type="range"
                        min="100"
                        max="100000"
                        step="100"
                        value={quantity}
                        onChange={e => setQuantity(Number(e.target.value))}
                        disabled={isManufacturing}
                    />
                    <p>Total Cost: ${totalCost.toLocaleString()}</p>
                </div>

                <div className="factory-visuals-grid" style={{
                    backgroundImage: 'linear-gradient(to bottom, #2c3e50, #000000)',
                    backgroundSize: 'cover'
                }}>
                    <div className="grid-cell" style={{opacity: 0.5}}>📦</div>
                    <div className="grid-cell"></div>
                    <div className="grid-cell" style={{opacity: 0.5}}>📦</div>
                    <div className="grid-cell"></div>
                    <div className="grid-cell">👷</div>
                    <div className="grid-cell"></div>
                </div>

                {!isManufacturing ? (
                    <button className="start-build-btn" onClick={handleStartManufacturing}>
                        Start Production (5s)
                    </button>
                ) : (
                    <div className="manufacturing-status">
                        <p>Manufacturing... (+10 RP/sec)</p>
                        <progress value={progress} max="100"></progress>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="factory-container">
            <div className="factory-content">
                {step === 0 && renderStep0_Line()}
                {step === 1 && renderStep1_Configuration()}
                {step === 2 && renderStep2_Components()}
                {step === 3 && renderStep3_Build()}
            </div>
        </div>
    );
}

export default Factory;
