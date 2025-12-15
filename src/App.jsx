import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import Lab from './components/Lab';
import Factory from './components/Factory';
import Sales from './components/Sales';
import Staff from './components/Staff';
import Research from './components/Research';
import Onboarding from './components/Onboarding';
import Events from './components/Events';
import './index.css';

function TopBar() {
  const { date, money, researchPoints, fans, company } = useGame();

  const formatDate = (dateObj) => {
    return dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' });
  };

  return (
    <header className="top-bar">
      <div className="status-group">
        <div className="status-item">
            <span className={`status-value money ${money < 0 ? 'red-text' : ''}`}>${money.toLocaleString()}</span>
            <span>Cash</span>
        </div>
        <div className="status-item">
            <span className="status-value rp">{Math.floor(researchPoints).toLocaleString()}</span>
            <span>RP</span>
        </div>
        <div className="status-item">
            <span className="status-value fans">{fans.toLocaleString()}</span>
            <span>Fans</span>
        </div>
      </div>

      <div className="status-group">
          <div className="status-item">
              <span className="status-value">{formatDate(date)}</span>
              <span>Date</span>
          </div>
      </div>

      <div className="company-info">
        <span>{company.name}</span>
        <span className="company-logo">{company.logo}</span>
      </div>
    </header>
  );
}

function BottomNav({ currentView, setView }) {
    const navItems = [
        { id: 'lab', label: 'Lab', icon: '🔬' },
        { id: 'factory', label: 'Factory', icon: '🏭' },
        { id: 'sales', label: 'Sales', icon: '🛒' },
        { id: 'research', label: 'Research', icon: '🧪' },
        { id: 'staff', label: 'Staff', icon: '👥' },
    ];

    return (
        <nav className="bottom-nav">
            {navItems.map(item => (
                <button
                    key={item.id}
                    className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                    onClick={() => setView(item.id)}
                >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                </button>
            ))}
        </nav>
    );
}

function GameOverScreen() {
    const { company, hardReset, softReset } = useGame();
    return (
        <div className="game-over-overlay">
            <div className="game-over-modal">
                <h1>BANKRUPTCY DECLARED</h1>
                <p>The {company.name} legacy ends here.</p>
                <div className="game-over-actions">
                    <button className="reset-btn" onClick={hardReset}>Start Fresh (Hard Reset)</button>
                    <button className="reset-btn soft" onClick={softReset}>Try Again (Keep Name & Logo)</button>
                </div>
            </div>
        </div>
    );
}

function AppContent() {
    const [view, setView] = useState('lab');
    const { company, addProduct, gameStatus, activeEvent, setActiveEvent, handleEventAction } = useGame();

    // If no company name, show onboarding
    if (!company || !company.name) {
        return <Onboarding />;
    }

    if (gameStatus === 'game_over') {
        return <GameOverScreen />;
    }

    const renderView = () => {
        switch(view) {
            case 'lab':
                return <Lab />;
            case 'factory':
                // Auto-redirect to Sales on finish
                return <Factory onFinish={(product) => {
                    addProduct(product);
                    setView('sales');
                }} />;
            case 'sales':
                return <Sales />;
            case 'staff':
                return <Staff />;
            case 'research':
                return <Research />;
            default:
                return <Lab />;
        }
    };

    return (
        <div className="app-container">
            <TopBar />
            <main>
                {renderView()}
            </main>
            <BottomNav currentView={view} setView={setView} />

            <Events
                event={activeEvent}
                onClose={() => setActiveEvent(null)}
                onAction={handleEventAction}
            />
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
