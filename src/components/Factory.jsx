import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { CameraIcon } from './visuals/Icons';
import './Factory.css';

const CAMERA_TYPES = [
    { id: 'compact', name: 'Compact', type: 'digital', unlocked: true },
    { id: 'slr', name: 'SLR', type: 'film', unlocked: true },
    { id: 'dslr', name: 'DSLR', type: 'digital', unlocked: true },
    { id: 'mirrorless', name: 'Mirrorless', type: 'digital', unlocked: true },
];

const BODY_STYLES = Array.from({ length: 10 }, (_, i) => ({ id: i + 1, name: `Body Style ${i + 1}`, unlocked: i === 0 }));

const BATTERIES = [
    { id: 'aa', name: 'AA Batteries', capacity: 100, cost: 5 },
    { id: '2cr5', name: '2CR5', capacity: 300, cost: 15 },
    { id: 'np-w126s', name: 'NP-W126S', capacity: 800, cost: 30 },
    { id: 'np-w235', name: 'NP-W235', capacity: 1500, cost: 50 },
];

const SCREENS = [
    { id: 'none', name: 'No Screen', cost: 0, type: 'fixed' },
    { id: 'fixed_3', name: '3" Fixed LCD', cost: 20, type: 'fixed' },
    { id: 'tilt', name: '3" Tilt Screen', cost: 40, type: 'tilt' },
    { id: 'fully_articulated', name: '3" Fully Articulated', cost: 60, type: 'articulated' },
];

function Factory({ onBack, onFinish }) {
    const { inventory, setInventory, setResearchPoints, staff } = useGame();
    const [step, setStep] = useState(0); // 0 = Product Line Selection
    const [productLine, setProductLine] = useState('camera'); // camera, film, lens
    const [isManufacturing, setIsManufacturing] = useState(false);
    const [progress, setProgress] = useState(0);

    // Configuration State
    const [config, setConfig] = useState({
        name: 'New Product',
        // Camera specific
        type: 'compact',
        body: 1,
        sensorId: '',
        processorId: '',
        mountId: 'fixed',
        screenId: 'fixed_3',
        batteryId: 'aa',

        // Visuals
        bodyColor: '#333333',
        gripColor: '#111111',

        // Film/Lens specific
        designId: '', // ID of the lab design to manufacture

        hasFlash: true,
        features: []
    });

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
                    // +10 RP per second. If interval is 100ms, that's +1 RP per tick
                    setResearchPoints(rp => rp + 1);
                    return prev + (100 / 300); // 100% in 300 ticks (30s) -> 0.33% per tick
                });
            }, 100);
        }
        return () => clearInterval(interval);
    }, [isManufacturing]);

    const finishManufacturing = () => {
        setIsManufacturing(false);

        // Finalize Product Data
        const quality = calculateQuality();

        let extraProps = {};
        // If it's a design-based product, copy visual props from the design
        if (productLine !== 'camera' && config.designId) {
             const list = productLine === 'film' ? inventory.films : inventory.lenses;
             const design = list.find(i => i.id === config.designId);
             if (design) {
                 extraProps = {
                     color: design.color,
                     // Copy other relevant props if needed
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
            reviews: []
        };

        onFinish(finalProduct);
    };

    const calculateQuality = () => {
        // Base quality
        let base = 50;

        // Add staff bonus
        const staffBonus = staff.reduce((acc, s) => acc + (s.skill || 0), 0);

        return Math.min(100, Math.floor(base + (staffBonus * 0.5) + (Math.random() * 10)));
    };

    const handleStartManufacturing = () => {
        if (!config.name) return alert("Please name your product.");

        if (productLine === 'camera') {
            if (config.type !== 'slr' && !config.sensorId) return alert("Digital cameras need a sensor!");
            if (config.type !== 'slr' && !config.processorId) return alert("Digital cameras need a processor!");
        } else {
            if (!config.designId) return alert(`Please select a ${productLine} design!`);
        }

        setIsManufacturing(true);
    };

    const renderStep0_Line = () => (
        <div className="factory-step">
             <h3>Select Production Line</h3>
             <div className="grid-options">
                 <button className={`option-card ${productLine === 'camera' ? 'selected' : ''}`} onClick={() => setProductLine('camera')}>Camera</button>
                 <button className={`option-card ${productLine === 'film' ? 'selected' : ''}`} onClick={() => setProductLine('film')}>Film</button>
                 <button className={`option-card ${productLine === 'lens' ? 'selected' : ''}`} onClick={() => setProductLine('lens')}>Lens</button>
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

                    <label>Type:</label>
                    <div className="grid-options">
                        {CAMERA_TYPES.map(t => (
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
                            styleId={config.body} // We use 'body' ID for style variation
                            bodyColor={config.bodyColor}
                            gripColor={config.gripColor}
                            size={120}
                        />
                    </div>

                    <button className="next-btn" onClick={() => setStep(2)}>Next: Components</button>
                </div>
            );
        } else {
            // Film or Lens Selection
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
                                    {item.name}
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
        const isDigital = config.type !== 'slr';

        return (
            <div className="factory-step">
                <h3>Step 2: Internals</h3>

                <label>Body Style:</label>
                <div className="scroll-options">
                    {BODY_STYLES.map(b => (
                        <button
                            key={b.id}
                            disabled={!b.unlocked}
                            className={`mini-card ${config.body === b.id ? 'selected' : ''}`}
                            onClick={() => setConfig({...config, body: b.id})}
                        >
                            {b.name}
                        </button>
                    ))}
                </div>

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
                    {BATTERIES.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>

                <button className="next-btn" onClick={() => setStep(3)}>Next: Review & Build</button>
            </div>
        );
    };

    const renderStep3_Build = () => (
        <div className="factory-step">
            <h3>Step 3: Manufacture</h3>
            <div className="summary">
                <p><strong>Product:</strong> {config.name}</p>
                <p><strong>Line:</strong> {productLine.toUpperCase()}</p>
            </div>
            {!isManufacturing ? (
                <button className="start-build-btn" onClick={handleStartManufacturing}>Start Production (30s)</button>
            ) : (
                <div className="manufacturing-status">
                    <p>Manufacturing... (+10 RP/sec)</p>
                    <progress value={progress} max="100"></progress>
                </div>
            )}
        </div>
    );

    return (
        <div className="factory-container">
            <div className="factory-header">
                <button onClick={onBack} disabled={isManufacturing}>← Exit</button>
                <h2>Factory</h2>
            </div>
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
