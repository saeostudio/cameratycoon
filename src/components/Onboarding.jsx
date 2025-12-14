import React, { useState } from 'react';
import { useGame } from '../context/GameContext';

const Onboarding = () => {
  const { setCompany, saveGame } = useGame();
  const [name, setName] = useState('');
  const [selectedLogo, setSelectedLogo] = useState('📷');

  const logos = ['📷', '🎥', '📹', '🎞️', '📽️', '🎬', '📸', '🧿'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      setCompany({ name: name.trim(), logo: selectedLogo });
      // Trigger a save immediately so reload doesn't show onboarding again
      setTimeout(() => saveGame(), 100);
    }
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d)',
    color: 'white',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  };

  const formStyle = {
    background: 'rgba(0,0,0,0.6)',
    padding: '40px',
    borderRadius: '15px',
    textAlign: 'center',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    backdropFilter: 'blur(4px)',
    border: '1px solid rgba(255, 255, 255, 0.18)'
  };

  const inputStyle = {
    padding: '10px',
    fontSize: '1.2rem',
    borderRadius: '5px',
    border: 'none',
    marginTop: '20px',
    marginBottom: '20px',
    width: '100%',
    boxSizing: 'border-box'
  };

  const logoGridStyle = {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    marginBottom: '20px'
  };

  const logoOptionStyle = (isActive) => ({
    fontSize: '2rem',
    cursor: 'pointer',
    padding: '10px',
    borderRadius: '50%',
    background: isActive ? 'rgba(255,255,255,0.3)' : 'transparent',
    transition: 'all 0.2s'
  });

  const buttonStyle = {
    padding: '12px 24px',
    fontSize: '1.1rem',
    background: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold'
  };

  return (
    <div style={containerStyle}>
      <div style={formStyle}>
        <h1>Welcome, CEO!</h1>
        <p>Start your journey to become a Camera Tycoon.</p>

        <form onSubmit={handleSubmit}>
          <div style={logoGridStyle}>
            {logos.map(l => (
              <span
                key={l}
                style={logoOptionStyle(selectedLogo === l)}
                onClick={() => setSelectedLogo(l)}
              >
                {l}
              </span>
            ))}
          </div>

          <input
            type="text"
            placeholder="Enter Company Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
            maxLength={20}
            required
          />

          <button type="submit" style={buttonStyle}>Start Business</button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
