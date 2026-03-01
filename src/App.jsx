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


function AlertsOverlay() {
    const { activeAlerts, removeAlert } = useGame();
    if (!activeAlerts || activeAlerts.length === 0) return null;

    return (
        <div className="alerts-overlay" style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 3000,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
        }}>
            {activeAlerts.map(alert => (
                <div key={alert.id} className={`alert-box alert-${alert.type}`} style={{
                    background: '#333',
                    color: '#fff',
                    padding: '15px 20px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minWidth: '250px',
                    borderLeft: `4px solid ${alert.type === 'error' ? '#ef4444' : '#3b82f6'}`
                }}>
                    <span>{alert.message}</span>
                    <button onClick={() => removeAlert(alert.id)} style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#aaa',
                        cursor: 'pointer',
                        fontSize: '18px',
                        marginLeft: '15px'
                    }}>✕</button>
                </div>
            ))}
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

            <AlertsOverlay />
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
