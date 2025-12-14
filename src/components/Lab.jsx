import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import './Lab.css';

const SENSOR_SIZES = [
  { id: '1/2.55', name: '1/2.55"', cost: 500, locked: false },
  { id: '1inch', name: '1 Inch', cost: 2000, locked: true },
  { id: 'apsc', name: 'APS-C', cost: 5000, locked: true },
  { id: 'fullframe', name: 'Full Frame', cost: 10000, locked: true },
  { id: 'medium', name: 'Medium Format', cost: 20000, locked: true },
];

const PROCESSOR_ARCHITECTURES = [
    { id: 'basic_8bit', name: 'Basic 8-bit', speed: 10, cost: 1000 },
    { id: 'adv_16bit', name: 'Advanced 16-bit', speed: 25, cost: 3000 },
];

function Lab({ onBack }) {
  const { inventory, setInventory, money, setMoney } = useGame();
  const [activeTab, setActiveTab] = useState('sensor'); // sensor, film, lens, processor

  // Forms State
  const [sensorName, setSensorName] = useState('');
  const [selectedSensorSize, setSelectedSensorSize] = useState(SENSOR_SIZES[0].id);

  const isLocked = (size) => {
      if (!size.locked) return false;
      const unlockedTech = inventory.unlockedTech || [];
      return !unlockedTech.includes(size.id);
  };

  const [filmName, setFilmName] = useState('');
  const [filmType, setFilmType] = useState('35mm');
  const [filmISO, setFilmISO] = useState(400);
  const [filmContrast, setFilmContrast] = useState(50); // 0-100
  const [filmColor, setFilmColor] = useState(50); // 0-100 (B&W to Vibrant)

  const [lensName, setLensName] = useState('');
  const [lensType, setLensType] = useState('prime'); // prime, zoom
  const [focalLength, setFocalLength] = useState(50);
  const [zoomRange, setZoomRange] = useState('24-70'); // Just a string for now

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
      quality: Math.floor(Math.random() * 10) + 10, // Base quality
    };

    setInventory(prev => ({ ...prev, sensors: [...prev.sensors, newSensor] }));
    setActiveTab('overview');
  };

  const handleCreateFilm = () => {
    if (!filmName) return alert("Please name your film.");

    const newFilm = {
      id: Date.now(),
      name: filmName,
      type: 'film',
      format: filmType,
      iso: filmISO,
      contrast: filmContrast,
      color: filmColor,
    };

    setInventory(prev => ({ ...prev, films: [...prev.films, newFilm] }));
    setActiveTab('overview');
  };

  const handleCreateLens = () => {
      if (!lensName) return alert("Please name your lens.");
      const newLens = {
          id: Date.now(),
          name: lensName,
          type: 'lens',
          lensType: lensType,
          focalLength: lensType === 'prime' ? `${focalLength}mm` : zoomRange,
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
              <ul>{inventory.lenses.map(i => <li key={i.id}>{i.name} ({i.focalLength})</li>)}</ul>

              <h4>Films ({inventory.films.length})</h4>
              <ul>{inventory.films.map(i => <li key={i.id}>{i.name} ({i.format}, ISO {i.iso})</li>)}</ul>
          </div>
      </div>
  );

  return (
    <div className="lab-container">
      <div className="lab-header">
        <button onClick={onBack}>← Back</button>
        <h2>R&D Lab</h2>
      </div>

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
                  const locked = isLocked(s);
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
                <button className="action-btn" onClick={handleCreateLens}>Develop Lens</button>
             </div>
        )}

        {activeTab === 'film' && (
             <div className="design-form">
                <h3>Design Film</h3>
                <label>Name: <input value={filmName} onChange={e => setFilmName(e.target.value)} /></label>
                <label>Format:</label>
                <select value={filmType} onChange={e => setFilmType(e.target.value)}>
                    <option value="35mm">35mm</option>
                    <option value="120">120 (Medium Format)</option>
                </select>
                <label>ISO: {filmISO}
                    <input type="range" min="50" max="3200" step="50" value={filmISO} onChange={e => setFilmISO(e.target.value)} />
                </label>
                <label>Contrast: {filmContrast}%
                    <input type="range" min="0" max="100" value={filmContrast} onChange={e => setFilmContrast(e.target.value)} />
                </label>
                 <label>Color: {filmColor}% (0=B&W)
                    <input type="range" min="0" max="100" value={filmColor} onChange={e => setFilmColor(e.target.value)} />
                </label>
                <button className="action-btn" onClick={handleCreateFilm}>Develop Film</button>
             </div>
        )}

        {activeTab === 'overview' && renderOverview()}
      </div>
    </div>
  );
}

export default Lab;
