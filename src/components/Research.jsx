import React from 'react';
import { useGame } from '../context/GameContext';
import './Research.css';

// Tech Tree Definition
export const TECH_TREE = {
    // --- Camera Types ---
    'camera_type_film': {
        name: 'Film Camera',
        description: 'The classic analog experience.',
        cost: 0,
        type: 'camera_type',
        requires: []
    },
    'camera_type_medium': {
        name: 'Medium Format',
        description: 'Professional film camera.',
        cost: 800,
        type: 'camera_type',
        requires: ['camera_type_film']
    },
    'camera_type_compact': {
        name: 'Compact Digital',
        description: 'Point and shoot convenience.',
        cost: 500,
        type: 'camera_type',
        requires: ['camera_type_film']
    },
    'camera_type_dslr': {
        name: 'DSLR',
        description: 'Professional quality with mirrors.',
        cost: 1500,
        type: 'camera_type',
        requires: ['camera_type_compact']
    },
    'camera_type_mirrorless': {
        name: 'Mirrorless',
        description: 'The future of photography.',
        cost: 4000,
        type: 'camera_type',
        requires: ['camera_type_dslr']
    },

    // --- Film Types ---
    'film_type_35mm': {
        name: '35mm Film',
        description: 'Standard format.',
        cost: 0,
        type: 'film_type',
        requires: []
    },
    'film_type_120mm': {
        name: '120mm Film',
        description: 'Medium format for higher detail.',
        cost: 1000,
        type: 'film_type',
        requires: ['film_type_35mm']
    },

    // --- Components (Batteries, Sensors, Screens) ---
    'sensor_standard': {
        name: 'Standard Sensor',
        description: 'Basic CMOS sensor.',
        cost: 0,
        type: 'component',
        requires: []
    },
    'sensor_advanced': {
        name: 'Advanced Sensor',
        description: 'Low light performance.',
        cost: 800,
        type: 'component',
        requires: ['sensor_standard']
    },
    'battery_liion': {
        name: 'Li-Ion Battery',
        description: 'Rechargeable power.',
        cost: 600,
        type: 'component',
        requires: []
    },
    'battery_high_cap': {
        name: 'High Capacity Batteries',
        description: 'Longer life for modern cameras.',
        cost: 300,
        type: 'component',
        requires: []
    },
    'screen_tilt': {
        name: 'Tilt Screen',
        description: 'Angled viewing for creative shots.',
        cost: 300,
        type: 'component',
        requires: []
    },
    'screen_articulated': {
        name: 'Articulating Screen',
        description: 'Flip out screen for vlogging.',
        cost: 800,
        type: 'component',
        requires: ['screen_tilt']
    },

    // --- Body Designs ---
    'body_design_2': { name: 'Modern Body', description: 'Sleeker grip design.', cost: 200, type: 'body_style', requires: [] },
    'body_design_3': { name: 'Retro Body', description: 'Vintage appeal.', cost: 400, type: 'body_style', requires: ['body_design_2'] },
    'body_design_4': { name: 'Ergonomic Body', description: 'Improved handling comfort.', cost: 600, type: 'body_style', requires: ['body_design_3'] },
    'body_design_5': { name: 'Compact Body', description: 'Minimalist footprint.', cost: 800, type: 'body_style', requires: ['body_design_4'] },
    'body_design_6': { name: 'Pro Body', description: 'Weather sealed magnesium.', cost: 1200, type: 'body_style', requires: ['body_design_5'] },
    'body_design_7': { name: 'Futuristic Body', description: 'Cutting edge aesthetics.', cost: 2000, type: 'body_style', requires: ['body_design_6'] },
    'body_design_8': { name: 'Titanium Body', description: 'Premium material finish.', cost: 3500, type: 'body_style', requires: ['body_design_7'] },
    'body_design_9': { name: 'Skeleton Body', description: 'See-through engineering.', cost: 5000, type: 'body_style', requires: ['body_design_8'] },
    'body_design_10': { name: 'Masterpiece Body', description: 'The ultimate camera form.', cost: 10000, type: 'body_style', requires: ['body_design_9'] },

    // --- Lens Tech (Optics) ---
    'aperture_f2_8': { name: 'Fast Aperture f/2.8', description: 'Better low light performance.', cost: 500, type: 'lens_tech', requires: [] },
    'aperture_f1_8': { name: 'Fast Aperture f/1.8', description: 'Great background blur.', cost: 1500, type: 'lens_tech', requires: ['aperture_f2_8'] },
    'aperture_f1_4': { name: 'Pro Aperture f/1.4', description: 'Professional standard.', cost: 3000, type: 'lens_tech', requires: ['aperture_f1_8'] },
    'aperture_f1_2': { name: 'Legendary f/1.2', description: 'The master of light.', cost: 6000, type: 'lens_tech', requires: ['aperture_f1_4'] },

    'glass_ed': { name: 'ED Glass', description: 'Extra-low Dispersion elements.', cost: 1000, type: 'lens_tech', requires: [] },
    'glass_aspherical': { name: 'Aspherical Elements', description: 'Sharp corners, less distortion.', cost: 2500, type: 'lens_tech', requires: ['glass_ed'] },
    'glass_fluorite': { name: 'Fluorite Elements', description: 'Ultimate optical clarity.', cost: 5000, type: 'lens_tech', requires: ['glass_aspherical'] },
};

const Research = () => {
    const { researchPoints, setResearchPoints, unlocks, unlockTech } = useGame();

    const handleUnlock = (key, cost) => {
        if (researchPoints >= cost) {
            setResearchPoints(prev => prev - cost);
            unlockTech(key);
        }
    };

    const isUnlocked = (key) => unlocks.includes(key);

    const canUnlock = (tech) => {
        if (isUnlocked(tech)) return false;
        // Check requirements
        return tech.requires.every(req => unlocks.includes(req));
    };

    // Group by Type
    const groups = {
        'Camera Types': [],
        'Body Styles': [],
        'Film Types': [],
        'Components': [],
        'Optics': []
    };

    Object.entries(TECH_TREE).forEach(([key, tech]) => {
        if (tech.type === 'camera_type') groups['Camera Types'].push({key, ...tech});
        else if (tech.type === 'film_type') groups['Film Types'].push({key, ...tech});
        else if (tech.type === 'body_style') groups['Body Styles'].push({key, ...tech});
        else if (tech.type === 'lens_tech') groups['Optics'].push({key, ...tech});
        else groups['Components'].push({key, ...tech});
    });

    return (
        <div className="research-container">
            <h2>Research & Development</h2>
            <div className="rp-display">
                Available RP: <span>{Math.floor(researchPoints)}</span>
            </div>

            <div className="tech-groups">
                {Object.entries(groups).map(([groupName, items]) => (
                    <div key={groupName} className="tech-group">
                        <h3>{groupName}</h3>
                        <div className="tech-grid">
                            {items.map(tech => {
                                const unlocked = isUnlocked(tech.key);
                                const available = canUnlock(tech);

                                return (
                                    <div
                                        key={tech.key}
                                        className={`tech-card ${unlocked ? 'unlocked' : ''} ${available ? 'available' : 'locked'}`}
                                        onClick={() => available && handleUnlock(tech.key, tech.cost)}
                                    >
                                        <h4>{tech.name}</h4>
                                        <p>{tech.description}</p>
                                        {!unlocked && (
                                            <div className="cost">
                                                {available ? `${tech.cost} RP` : 'Locked'}
                                            </div>
                                        )}
                                        {unlocked && <div className="status-badge">Owned</div>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Research;
