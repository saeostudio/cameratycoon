import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import Lab from './components/Lab';
import Factory from './components/Factory';
import Sales from './components/Sales';
import Staff from './components/Staff';
import Shop from './components/Shop';
import './index.css';

function GameStatus() {
  const { date, money, researchPoints } = useGame();

  const formatDate = (dateObj) => {
    return dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="status-bar">
      <div className="status-item date">{formatDate(date)}</div>
      <div className="status-item money">${money.toLocaleString()}</div>
      <div className="status-item rp">{Math.floor(researchPoints)} RP</div>
    </div>
  );
}

function MainMenu({ setView }) {
    return (
        <div className="main-menu">
            <h2>Dashboard</h2>
            <div className="menu-grid">
                <button className="menu-btn" onClick={() => setView('factory')}>🏭 Manufacture</button>
                <button className="menu-btn" onClick={() => setView('lab')}>🔬 Lab</button>
                <button className="menu-btn" onClick={() => setView('sales')}>🛒 Sales</button>
                <button className="menu-btn" onClick={() => setView('staff')}>💼 Staff</button>
                <button className="menu-btn" onClick={() => setView('shop')}>🧪 Research</button>
            </div>
        </div>
    )
}

function AppContent() {
    const [view, setView] = useState('dashboard');
    const { addProduct } = useGame();

    const renderView = () => {
        switch(view) {
            case 'lab':
                return <Lab onBack={() => setView('dashboard')} />;
            case 'factory':
                return <Factory onBack={() => setView('dashboard')} onFinish={(product) => {
                    addProduct(product);
                    setView('sales');
                }} />;
            case 'sales':
                return <Sales onBack={() => setView('dashboard')} />;
            case 'staff':
                return <Staff onBack={() => setView('dashboard')} />;
            case 'shop':
                return <Shop onBack={() => setView('dashboard')} />;
            default:
                return <MainMenu setView={setView} />;
        }
    };

    return (
        <div className="app-container">
            <header>
                <h1>Camera Tycoon</h1>
                <GameStatus />
            </header>
            <main>
                {renderView()}
            </main>
        </div>
    );
}

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

export default App;
