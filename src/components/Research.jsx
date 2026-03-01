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
        cost: 400,
        type: 'camera_type',
        requires: ['camera_type_film']
    },
    'camera_type_compact': {
        name: 'Compact Digital',
        description: 'Point and shoot convenience.',
        cost: 250,
        type: 'camera_type',
        requires: ['camera_type_film']
    },
    'camera_type_dslr': {
        name: 'DSLR',
        description: 'Professional quality with mirrors.',
        cost: 750,
        type: 'camera_type',
        requires: ['camera_type_compact']
    },
    'camera_type_mirrorless': {
        name: 'Mirrorless',
        description: 'The future of photography.',
        cost: 2000,
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
        cost: 500,
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
        cost: 400,
        type: 'component',
        requires: ['sensor_standard']
    },
    'battery_liion': {
        name: 'Li-Ion Battery',
        description: 'Rechargeable power.',
        cost: 300,
        type: 'component',
        requires: []
    },
    'battery_high_cap': {
        name: 'High Capacity Batteries',
        description: 'Longer life for modern cameras.',
        cost: 150,
        type: 'component',
        requires: []
    },
    'screen_tilt': {
        name: 'Tilt Screen',
        description: 'Angled viewing for creative shots.',
        cost: 150,
        type: 'component',
        requires: []
    },
    'screen_articulated': {
        name: 'Articulating Screen',
        description: 'Flip out screen for vlogging.',
        cost: 400,
        type: 'component',
        requires: ['screen_tilt']
    },

    // --- Megapixels ---
    'sensor_mp_3': { name: '3 Megapixels', description: 'Early digital resolution.', cost: 100, type: 'sensor_tech', requires: [] },
    'sensor_mp_10': { name: '10 Megapixels', description: 'Standard digital resolution.', cost: 250, type: 'sensor_tech', requires: ['sensor_mp_3'] },
    'sensor_mp_18': { name: '18 Megapixels', description: 'High detail.', cost: 500, type: 'sensor_tech', requires: ['sensor_mp_10'] },
    'sensor_mp_24': { name: '24 Megapixels', description: 'Industry standard.', cost: 1000, type: 'sensor_tech', requires: ['sensor_mp_18'] },
    'sensor_mp_48': { name: '48 Megapixels', description: 'Ultra high resolution.', cost: 2000, type: 'sensor_tech', requires: ['sensor_mp_24'] },
    'sensor_mp_72': { name: '72 Megapixels', description: 'Professional studio quality.', cost: 4000, type: 'sensor_tech', requires: ['sensor_mp_48'] },
    'sensor_mp_100': { name: '100 Megapixels', description: 'Medium format territory.', cost: 7500, type: 'sensor_tech', requires: ['sensor_mp_72'] },

    // --- Body Designs ---
    'body_design_2': { name: 'Modern Body', description: 'Sleeker grip design.', cost: 100, type: 'body_style', requires: [] },
    'body_design_3': { name: 'Retro Body', description: 'Vintage appeal.', cost: 200, type: 'body_style', requires: ['body_design_2'] },
    'body_design_4': { name: 'Ergonomic Body', description: 'Improved handling comfort.', cost: 300, type: 'body_style', requires: ['body_design_3'] },
    'body_design_5': { name: 'Compact Body', description: 'Minimalist footprint.', cost: 400, type: 'body_style', requires: ['body_design_4'] },
    'body_design_6': { name: 'Pro Body', description: 'Weather sealed magnesium.', cost: 600, type: 'body_style', requires: ['body_design_5'] },
    'body_design_7': { name: 'Futuristic Body', description: 'Cutting edge aesthetics.', cost: 1000, type: 'body_style', requires: ['body_design_6'] },
    'body_design_8': { name: 'Titanium Body', description: 'Premium material finish.', cost: 1750, type: 'body_style', requires: ['body_design_7'] },
    'body_design_9': { name: 'Skeleton Body', description: 'See-through engineering.', cost: 2500, type: 'body_style', requires: ['body_design_8'] },
    'body_design_10': { name: 'Masterpiece Body', description: 'The ultimate camera form.', cost: 5000, type: 'body_style', requires: ['body_design_9'] },

    // --- Lens Tech (Optics) ---
    'aperture_f2_8': { name: 'Fast Aperture f/2.8', description: 'Better low light performance.', cost: 250, type: 'lens_tech', requires: [] },
    'aperture_f1_8': { name: 'Fast Aperture f/1.8', description: 'Great background blur.', cost: 750, type: 'lens_tech', requires: ['aperture_f2_8'] },
    'aperture_f1_4': { name: 'Pro Aperture f/1.4', description: 'Professional standard.', cost: 1500, type: 'lens_tech', requires: ['aperture_f1_8'] },
    'aperture_f1_2': { name: 'Legendary f/1.2', description: 'The master of light.', cost: 3000, type: 'lens_tech', requires: ['aperture_f1_4'] },

    'glass_ed': { name: 'ED Glass', description: 'Extra-low Dispersion elements.', cost: 500, type: 'lens_tech', requires: [] },
    'glass_aspherical': { name: 'Aspherical Elements', description: 'Sharp corners, less distortion.', cost: 1250, type: 'lens_tech', requires: ['glass_ed'] },
    'glass_fluorite': { name: 'Fluorite Elements', description: 'Ultimate optical clarity.', cost: 2500, type: 'lens_tech', requires: ['glass_aspherical'] },

    // --- Sensor Structures ---
    'sensor_cmos': { name: 'CMOS Sensor', description: 'Standard structure.', cost: 0, type: 'sensor_tech', requires: [] },
    'sensor_bsi': { name: 'BSI-CMOS', description: 'Back-illuminated, better low light.', cost: 500, type: 'sensor_tech', requires: ['sensor_cmos'] },
    'sensor_xtrans': { name: 'X-Trans Sensor', description: 'Unique color filter array, sharper.', cost: 1000, type: 'sensor_tech', requires: ['sensor_bsi'] },
    'sensor_stacked': { name: 'Stacked CMOS', description: 'Ultra-fast readout speed.', cost: 2000, type: 'sensor_tech', requires: ['sensor_bsi'] },

    // --- Video Tech ---
    'video_1080p': { name: '1080p Video', description: 'Full HD recording.', cost: 200, type: 'video_tech', requires: ['camera_type_compact'] },
    'video_4k': { name: '4K Video', description: 'Ultra HD recording.', cost: 1000, type: 'video_tech', requires: ['video_1080p'] },
    'video_8k': { name: '8K Video', description: 'Cinematic resolution.', cost: 3000, type: 'video_tech', requires: ['video_4k'] },

    'video_fps_24': { name: '24fps Cinematic', description: 'Standard movie framerate.', cost: 100, type: 'video_tech', requires: ['video_1080p'] },
    'video_fps_60': { name: '60fps Smooth', description: 'Smooth motion video.', cost: 400, type: 'video_tech', requires: ['video_fps_24'] },
    'video_fps_120': { name: '120fps Slow-Mo', description: 'High framerate for slow motion.', cost: 1200, type: 'video_tech', requires: ['video_fps_60'] },

    // --- Flash & Lights ---
    'flash_builtin': { name: 'Built-in Flash', description: 'Basic illumination.', cost: 100, type: 'component', requires: [] },
    'flash_popup': { name: 'Pop-up Flash', description: 'Concealed flash mechanism.', cost: 300, type: 'component', requires: ['flash_builtin'] },
    'tally_light': { name: 'Tally Light', description: 'Recording indicator light.', cost: 150, type: 'component', requires: ['video_1080p'] },

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
        'Optics': [],
        'Sensor Tech': [],
        'Video Tech': []
    };



    Object.entries(TECH_TREE).forEach(([key, tech]) => {
        if (tech.type === 'camera_type') groups['Camera Types'].push({key, ...tech});
        else if (tech.type === 'film_type') groups['Film Types'].push({key, ...tech});
        else if (tech.type === 'body_style') groups['Body Styles'].push({key, ...tech});
        else if (tech.type === 'lens_tech') groups['Optics'].push({key, ...tech});
        else if (tech.type === 'sensor_tech') groups['Sensor Tech'].push({key, ...tech});
        else if (tech.type === 'video_tech') groups['Video Tech'].push({key, ...tech});
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
