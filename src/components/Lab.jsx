import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { FilmIcon, LensIcon } from './visuals/Icons';
import './Lab.css';

// Tech Tree helpers
const SENSOR_SIZES = [
  { id: '1/2.55', name: '1/2.55"', baseCost: 500, unlockId: null }, // Always available
  { id: '1inch', name: '1 Inch', baseCost: 2000, unlockId: 'sensor_standard' },
  { id: 'apsc', name: 'APS-C', baseCost: 5000, unlockId: 'sensor_advanced' },
  { id: 'fullframe', name: 'Full Frame', baseCost: 10000, unlockId: 'sensor_advanced' },
  { id: 'medium', name: 'Medium Format', baseCost: 20000, unlockId: 'sensor_advanced' },
];

const PROCESSOR_ARCHITECTURES = [
    { id: 'basic_8bit', name: 'Basic 8-bit', speed: 10, cost: 1000 },
    { id: 'adv_16bit', name: 'Advanced 16-bit', speed: 25, cost: 3000 },
];

const APERTURES = [
    { id: 'f4', name: 'f/4.0 (Standard)', cost: 0, unlockId: null },
    { id: 'f2_8', name: 'f/2.8 (Fast)', cost: 50, unlockId: 'aperture_f2_8' },
    { id: 'f1_8', name: 'f/1.8 (Very Fast)', cost: 150, unlockId: 'aperture_f1_8' },
    { id: 'f1_4', name: 'f/1.4 (Pro)', cost: 300, unlockId: 'aperture_f1_4' },
    { id: 'f1_2', name: 'f/1.2 (Legendary)', cost: 600, unlockId: 'aperture_f1_2' },
];

const GLASS_QUALITY = [
    { id: 'standard', name: 'Standard Glass', cost: 0, unlockId: null },
    { id: 'ed', name: 'ED Glass', cost: 100, unlockId: 'glass_ed' },
    { id: 'aspherical', name: 'Aspherical', cost: 250, unlockId: 'glass_aspherical' },
    { id: 'fluorite', name: 'Fluorite', cost: 500, unlockId: 'glass_fluorite' },
];

function Lab({ onBack }) {
  const { inventory, setInventory, unlocks } = useGame();
  const [activeTab, setActiveTab] = useState('sensor'); // sensor, film, lens, processor

  // Forms State
  const [sensorName, setSensorName] = useState('');
  const [selectedSensorSize, setSelectedSensorSize] = useState(SENSOR_SIZES[0].id);

  const isLocked = (unlockId) => {
      if (!unlockId) return false;
      return !unlocks.includes(unlockId);
  };

  // Film State
  const [filmName, setFilmName] = useState('');
  const [filmType, setFilmType] = useState('35mm');
  const [filmColorMode, setFilmColorMode] = useState('color'); // 'color' or 'bw'
  const [filmISO, setFilmISO] = useState(400);
  const [filmContrast, setFilmContrast] = useState(50);
  const [filmVib, setFilmVib] = useState(50);
  const [filmGrain, setFilmGrain] = useState(20);
  const [canisterColor, setCanisterColor] = useState('#facc15');

  // Lens State
  const [lensName, setLensName] = useState('');
  const [lensType, setLensType] = useState('prime'); // prime, zoom
  const [focalLength, setFocalLength] = useState(50);
  const [zoomRange, setZoomRange] = useState('24-70');
  const [lensColor, setLensColor] = useState('#333333');
  const [lensAperture, setLensAperture] = useState('f4');
  const [lensGlass, setLensGlass] = useState('standard');

  // Processor State
  const [procName, setProcName] = useState('');
  const [procArch, setProcArch] = useState(PROCESSOR_ARCHITECTURES[0].id);


  const handleCreateSensor = () => {
    if (!sensorName) return alert("Please name your sensor.");
    const sizeData = SENSOR_SIZES.find(s => s.id === selectedSensorSize);

    const newSensor = {
      id: Date.now(),
      name: sensorName,
      type: 'sensor',
      size: sizeData.name,
      sizeId: sizeData.id,
      quality: Math.floor(Math.random() * 10) + 10,
    };

    setInventory(prev => ({ ...prev, sensors: [...prev.sensors, newSensor] }));
    setActiveTab('overview');
  };

  const handleCreateFilm = () => {
    if (!filmName) return alert("Please name your film.");

    // Cost logic adjustments
    const is120 = filmType === '120';
    // Base production cost could be stored here or calculated in Factory

    const newFilm = {
      id: Date.now(),
      name: filmName,
      type: 'film',
      format: filmType,
      colorMode: filmColorMode,
      iso: filmISO,
      contrast: filmContrast,
      vibrance: filmVib,
      grain: filmGrain,
      color: canisterColor,
    };

    setInventory(prev => ({ ...prev, films: [...prev.films, newFilm] }));
    setActiveTab('overview');
  };

  const handleCreateLens = () => {
      if (!lensName) return alert("Please name your lens.");

      const apertureData = APERTURES.find(a => a.id === lensAperture);
      const glassData = GLASS_QUALITY.find(g => g.id === lensGlass);

      const newLens = {
          id: Date.now(),
          name: lensName,
          type: 'lens',
          lensType: lensType,
          focalLength: lensType === 'prime' ? `${focalLength}mm` : zoomRange,
          aperture: apertureData.name,
          glass: glassData.name,
          color: lensColor
      };
      setInventory(prev => ({ ...prev, lenses: [...prev.lenses, newLens] }));
      setActiveTab('overview');
  };

  const handleCreateProcessor = () => {
      if (!procName) return alert("Please name your processor.");
      const arch = PROCESSOR_ARCHITECTURES.find(a => a.id === procArch);
      const newProc = {
          id: Date.now(),
          name: procName,
          type: 'processor',
          arch: arch.name,
          speed: arch.speed
      };
      setInventory(prev => ({ ...prev, processors: [...prev.processors, newProc] }));
      setActiveTab('overview');
  };

  const renderOverview = () => (
      <div className="lab-overview">
          <h3>Inventory</h3>
          <div className="inventory-list">
              <h4>Sensors ({inventory.sensors.length})</h4>
              <ul>{inventory.sensors.map(i => <li key={i.id}>{i.name} ({i.size})</li>)}</ul>

              <h4>Processors ({inventory.processors.length})</h4>
              <ul>{inventory.processors.map(i => <li key={i.id}>{i.name} ({i.arch})</li>)}</ul>

              <h4>Lenses ({inventory.lenses.length})</h4>
              <ul>{inventory.lenses.map(i => (
                  <li key={i.id} className="inv-item">
                      <LensIcon color={i.color} size={30} />
                      <span>{i.name} ({i.focalLength}, {i.aperture})</span>
                  </li>
              ))}</ul>

              <h4>Films ({inventory.films.length})</h4>
              <ul>{inventory.films.map(i => (
                  <li key={i.id} className="inv-item">
                      <FilmIcon color={i.color} size={30} type={i.format} />
                      <span>{i.name} ({i.format}, ISO {i.iso})</span>
                  </li>
              ))}</ul>
          </div>
      </div>
  );

  // Dynamic Photo Preview Styles
  // B&W uses grayscale(100%).
  // Color uses Sepia + Saturation to simulate the warm/retro look of the vacation photo
  const isBW = filmColorMode === 'bw';

  const photoPreviewStyle = {
      width: '100%',
      height: '200px',
      objectFit: 'cover',
      borderRadius: '8px',
      // Placeholder background if image not loaded
      backgroundColor: '#888',
      // Dynamic filters
      filter: isBW
        ? `grayscale(100%) contrast(${50 + (filmContrast / 2)}%) brightness(${100 + (filmISO > 800 ? (filmISO-800)/100 : 0)}%)`
        : `sepia(20%) saturate(${80 + filmVib}%) contrast(${80 + (filmContrast / 3)}%) brightness(${100 + (filmISO > 800 ? (filmISO-800)/200 : 0)}%)`
  };

  const grainOverlayStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '200px',
      pointerEvents: 'none',
      opacity: filmGrain / 200, // 0 to 0.5
      background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
      borderRadius: '8px'
  };

  return (
    <div className="lab-container">
      {/*
      <div className="lab-header">
        {onBack && <button onClick={onBack}>← Back</button>}
        <h2>R&D Lab</h2>
      </div>
      */}

      <div className="lab-tabs">
        <button className={activeTab === 'sensor' ? 'active' : ''} onClick={() => setActiveTab('sensor')}>Sensor</button>
        <button className={activeTab === 'processor' ? 'active' : ''} onClick={() => setActiveTab('processor')}>Chip</button>
        <button className={activeTab === 'lens' ? 'active' : ''} onClick={() => setActiveTab('lens')}>Lens</button>
        <button className={activeTab === 'film' ? 'active' : ''} onClick={() => setActiveTab('film')}>Film</button>
        <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>Stock</button>
      </div>

      <div className="lab-content">
        {activeTab === 'sensor' && (
          <div className="design-form">
            <h3>Design Sensor</h3>
            <label>Name: <input value={sensorName} onChange={e => setSensorName(e.target.value)} /></label>
            <label>Size:</label>
            <select value={selectedSensorSize} onChange={e => setSelectedSensorSize(e.target.value)}>
              {SENSOR_SIZES.map(s => {
                  const locked = isLocked(s.unlockId);
                  return (
                    <option key={s.id} value={s.id} disabled={locked}>
                        {s.name} {locked ? '(Locked)' : ''}
                    </option>
                  );
              })}
            </select>
            <button className="action-btn" onClick={handleCreateSensor}>Develop Sensor</button>
          </div>
        )}

        {activeTab === 'processor' && (
            <div className="design-form">
                <h3>Design Processor</h3>
                <label>Name: <input value={procName} onChange={e => setProcName(e.target.value)} /></label>
                <label>Architecture:</label>
                <select value={procArch} onChange={e => setProcArch(e.target.value)}>
                    {PROCESSOR_ARCHITECTURES.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
                <button className="action-btn" onClick={handleCreateProcessor}>Develop Processor</button>
            </div>
        )}

        {activeTab === 'lens' && (
             <div className="design-form">
                <h3>Design Lens</h3>
                <label>Name: <input value={lensName} onChange={e => setLensName(e.target.value)} /></label>
                <div className="radio-group">
                    <label><input type="radio" checked={lensType === 'prime'} onChange={() => setLensType('prime')} /> Prime</label>
                    <label><input type="radio" checked={lensType === 'zoom'} onChange={() => setLensType('zoom')} /> Zoom</label>
                </div>
                {lensType === 'prime' ? (
                     <label>Focal Length: {focalLength}mm
                        <input type="range" min="14" max="200" value={focalLength} onChange={e => setFocalLength(e.target.value)} />
                     </label>
                ) : (
                    <label>Range:
                        <select value={zoomRange} onChange={e => setZoomRange(e.target.value)}>
                            <option value="18-55">18-55mm (Kit)</option>
                            <option value="24-70">24-70mm (Standard)</option>
                            <option value="70-200">70-200mm (Tele)</option>
                        </select>
                    </label>
                )}

                <label>Max Aperture:
                    <select value={lensAperture} onChange={e => setLensAperture(e.target.value)}>
                        {APERTURES.map(a => {
                             const locked = isLocked(a.unlockId);
                             return (
                                 <option key={a.id} value={a.id} disabled={locked}>
                                     {a.name} {locked ? '(Locked)' : ''}
                                 </option>
                             );
                        })}
                    </select>
                </label>

                <label>Glass Element:
                    <select value={lensGlass} onChange={e => setLensGlass(e.target.value)}>
                        {GLASS_QUALITY.map(g => {
                             const locked = isLocked(g.unlockId);
                             return (
                                 <option key={g.id} value={g.id} disabled={locked}>
                                     {g.name} {locked ? '(Locked)' : ''}
                                 </option>
                             );
                        })}
                    </select>
                </label>

                <label>Lens Housing Color:
                    <input type="color" value={lensColor} onChange={e => setLensColor(e.target.value)} style={{width: '100%', height: '40px'}}/>
                </label>

                <div className="preview-box">
                    <p>Preview:</p>
                    <LensIcon color={lensColor} size={100} />
                </div>

                <button className="action-btn" onClick={handleCreateLens}>Develop Lens</button>
             </div>
        )}

        {activeTab === 'film' && (
             <div className="design-form two-col">
                <div className="form-col">
                    <h3>Design Film</h3>
                    <label>Name: <input value={filmName} onChange={e => setFilmName(e.target.value)} /></label>
                    <label>Format:</label>
                    <select value={filmType} onChange={e => setFilmType(e.target.value)}>
                        <option value="35mm">35mm</option>
                        <option value="120" disabled={isLocked('film_type_120mm')}>
                            120 (Medium Format) {isLocked('film_type_120mm') ? '(Locked)' : ''}
                        </option>
                    </select>

                    <label>Type:</label>
                    <div className="radio-group">
                         <label>
                             <input type="radio" checked={filmColorMode === 'color'} onChange={() => setFilmColorMode('color')} />
                             Color
                         </label>
                         <label>
                             <input type="radio" checked={filmColorMode === 'bw'} onChange={() => setFilmColorMode('bw')} />
                             B&W
                         </label>
                    </div>

                    <label>ISO: {filmISO}
                        <input type="range" min="50" max="3200" step="50" value={filmISO} onChange={e => setFilmISO(e.target.value)} />
                    </label>
                    <label>Contrast: {filmContrast}%
                        <input type="range" min="0" max="100" value={filmContrast} onChange={e => setFilmContrast(e.target.value)} />
                    </label>

                    {filmColorMode === 'color' && (
                         <label>Vibrance: {filmVib}%
                            <input type="range" min="0" max="100" value={filmVib} onChange={e => setFilmVib(e.target.value)} />
                        </label>
                    )}

                     <label>Grain: {filmGrain}%
                        <input type="range" min="0" max="100" value={filmGrain} onChange={e => setFilmGrain(e.target.value)} />
                    </label>

                    <label>Canister Color:
                        <input type="color" value={canisterColor} onChange={e => setCanisterColor(e.target.value)} style={{width: '100%', height: '40px'}}/>
                    </label>
                    <button className="action-btn" onClick={handleCreateFilm}>Develop Film</button>
                </div>

                <div className="form-col preview-col">
                    <p>Photo Preview</p>
                    <div style={{position: 'relative'}}>
                        {/*
                            Try to load the user provided asset.
                        */}
                        <img
                            src="/assets/20240925-collectie2.jpg"
                            alt="Lab Simulation Preview"
                            style={photoPreviewStyle}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = 'none'; // Hide broken image
                            }}
                        />
                         {/* Fallback div if image fails/is missing */}
                        <div className="fallback-preview" style={{
                            ...photoPreviewStyle,
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            zIndex: -1,
                            background: 'linear-gradient(135deg, #a8c0ff 0%, #3f2b96 100%)' // Generic vacation-y gradient
                        }}></div>

                        <div style={grainOverlayStyle}></div>
                    </div>
                    <div className="preview-box">
                        <p>Canister</p>
                        <FilmIcon color={canisterColor} size={60} type={filmType} />
                    </div>
                </div>
             </div>
        )}

        {activeTab === 'overview' && renderOverview()}
      </div>
    </div>
  );
}

export default Lab;
