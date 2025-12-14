import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import Lab from './components/Lab';
import Factory from './components/Factory';
import Sales from './components/Sales';
import Staff from './components/Staff';
import Research from './components/Research';
import Onboarding from './components/Onboarding';
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
            <span className="status-value money">${money.toLocaleString()}</span>
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
        { id: 'research', label: 'Research', icon: '🧪' }, // Was 'shop'
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

function AppContent() {
    const [view, setView] = useState('lab'); // Default to Lab? Or Factory?
    const { company, addProduct } = useGame();

    // If no company name, show onboarding
    if (!company || !company.name) {
        return <Onboarding />;
    }

    const renderView = () => {
        switch(view) {
            case 'lab':
                return <Lab />;
            case 'factory':
                // Factory needs onFinish to redirect to Sales or Inventory?
                // Old logic: setView('sales') on finish.
                // New logic: Just add to inventory. User manually goes to Sales.
                return <Factory onFinish={(product) => {
                    addProduct(product);
                    // Optional: Notification?
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
