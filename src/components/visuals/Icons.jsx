import React from 'react';

// Common Gradients
const DEFS = (
    <defs>
        <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="50%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#475569" />
        </linearGradient>
        <linearGradient id="lensGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.9" />
        </linearGradient>
        <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
            <feOffset dx="2" dy="2" result="offsetblur"/>
            <feComponentTransfer>
                <feFuncA type="linear" slope="0.3"/>
            </feComponentTransfer>
            <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
    </defs>
);

export const FilmIcon = ({ color = '#facc15', size = 50, type = '35mm' }) => {
    // 120mm is taller/fatter
    const is120 = type === '120';
    const width = is120 ? 40 : 30;
    const height = 60;
    const x = 50 - (width/2);

    return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {DEFS}
            <g filter="url(#dropShadow)">
                {/* Spool Top */}
                <ellipse cx="50" cy="20" rx={width/2 + 2} ry="5" fill="#333" />
                {/* Body */}
                <rect x={x} y="20" width={width} height={height} fill={color} stroke="#333" strokeWidth="1"/>
                {/* Spool Bottom */}
                <ellipse cx="50" cy="80" rx={width/2 + 2} ry="5" fill="#333" />
                {/* Label */}
                <rect x={x+2} y="30" width={width-4} height={40} fill="rgba(255,255,255,0.7)" />
                <text x="50" y="55" fontSize="8" textAnchor="middle" fill="black" fontWeight="bold">
                    {is120 ? '120' : '35mm'}
                </text>
            </g>
        </svg>
    );
};

export const LensIcon = ({ color = '#333', size = 50 }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {DEFS}
        <g filter="url(#dropShadow)">
            {/* Top Ring (Perspective) */}
            <ellipse cx="50" cy="25" rx="20" ry="8" fill="#555" stroke="#222" strokeWidth="1"/>
            {/* Body */}
            <path d="M30 25 L30 75 A 20 8 0 0 0 70 75 L70 25" fill={color} stroke="#222" strokeWidth="1"/>
            {/* Glass */}
            <ellipse cx="50" cy="25" rx="16" ry="6" fill="url(#lensGrad)" />
            {/* Reflection */}
            <ellipse cx="45" cy="22" rx="5" ry="2" fill="white" fillOpacity="0.4" />
        </g>
    </svg>
);

export const CameraIcon = ({ bodyColor = '#333', gripColor = '#111', type = 'camera_type_film', size = 50 }) => {

    // Helper for Isometric/3D look
    // Using simple shapes with perspective-like drawing

    // 1. Film Camera (Classic SLR look)
    const renderFilm = () => (
        <g filter="url(#dropShadow)">
            {/* Grip (New) */}
            <path d="M75 30 L85 30 L85 70 L75 70 Z" fill={gripColor} stroke="#111" strokeWidth="1" />
            {/* Prism */}
            <path d="M40 30 L50 20 L60 30 Z" fill="#222" stroke="#111" strokeWidth="1"/>
            {/* Main Body */}
            <rect x="15" y="30" width="60" height="40" rx="2" fill={bodyColor} stroke="#111" strokeWidth="1" />
            {/* Lens Mount */}
            <circle cx="45" cy="50" r="16" fill="#333" stroke="#555" strokeWidth="2" />
            <circle cx="45" cy="50" r="12" fill="#111" />
            <circle cx="48" cy="47" r="4" fill="white" fillOpacity="0.2" />
            {/* Dials */}
            <rect x="20" y="25" width="8" height="5" fill="#888" />
            <rect x="65" y="25" width="10" height="5" fill="#888" />
        </g>
    );

    // 1.5 Medium Format (Boxy)
    const renderMedium = () => (
        <g filter="url(#dropShadow)">
            {/* Main Body Box */}
            <rect x="25" y="25" width="50" height="50" rx="1" fill={bodyColor} stroke="#111" strokeWidth="1" />
             {/* Grip Side */}
             <rect x="75" y="30" width="10" height="40" fill={gripColor} stroke="#111" />
            {/* Lens */}
            <circle cx="50" cy="50" r="18" fill="#111" stroke="#333" strokeWidth="2" />
            <circle cx="50" cy="50" r="14" fill="url(#lensGrad)" />
            {/* Viewfinder Top */}
            <path d="M25 25 L35 15 L65 15 L75 25 Z" fill="#222" />
        </g>
    );

    // 2. Compact (Small, rectangular, offset lens)
    const renderCompact = () => (
        <g filter="url(#dropShadow)">
            <rect x="20" y="35" width="60" height="35" rx="4" fill={bodyColor} stroke="#111" strokeWidth="1" />
            <circle cx="40" cy="52" r="10" fill="#222" stroke="#555" strokeWidth="1" />
            <circle cx="40" cy="52" r="6" fill="url(#lensGrad)" />
            <rect x="65" y="38" width="10" height="4" fill="#888" />
        </g>
    );

    // 3. DSLR (Big grip, chunky prism)
    const renderDSLR = () => (
        <g filter="url(#dropShadow)">
             {/* Grip Side */}
            <path d="M20 30 L30 30 L30 75 L15 75 Q 10 75 10 65 L 12 40 Z" fill={gripColor} stroke="#111" />
            {/* Main Block */}
            <rect x="28" y="30" width="60" height="45" fill={bodyColor} stroke="#111" />
            {/* Prism bump */}
            <path d="M45 30 L50 20 L65 20 L70 30" fill={bodyColor} stroke="#111" />
            {/* Lens */}
            <circle cx="58" cy="52" r="18" fill="#222" stroke="#444" strokeWidth="3" />
            <circle cx="58" cy="52" r="14" fill="url(#lensGrad)" />
            <circle cx="62" cy="48" r="5" fill="white" fillOpacity="0.3" />
        </g>
    );

    // 4. Mirrorless (Flat top, EVF optional, big lens)
    const renderMirrorless = () => (
        <g filter="url(#dropShadow)">
            {/* Body */}
            <rect x="15" y="30" width="70" height="40" rx="1" fill={bodyColor} stroke="#111" strokeWidth="1" />
            {/* EVF Hump (smaller) */}
            <rect x="42" y="22" width="16" height="8" fill="#222" />
            {/* Grip (smaller) */}
            <rect x="15" y="30" width="10" height="40" fill={gripColor} />
            {/* Large Lens */}
            <circle cx="50" cy="50" r="19" fill="#111" stroke="#888" strokeWidth="1" />
            <circle cx="50" cy="50" r="15" fill="url(#lensGrad)" />
        </g>
    );

    // Dispatch
    if (type === 'camera_type_compact') return <svg width={size} height={size} viewBox="0 0 100 100">{DEFS}{renderCompact()}</svg>;
    if (type === 'camera_type_dslr') return <svg width={size} height={size} viewBox="0 0 100 100">{DEFS}{renderDSLR()}</svg>;
    if (type === 'camera_type_mirrorless') return <svg width={size} height={size} viewBox="0 0 100 100">{DEFS}{renderMirrorless()}</svg>;
    if (type === 'camera_type_medium') return <svg width={size} height={size} viewBox="0 0 100 100">{DEFS}{renderMedium()}</svg>;

    // Default Film
    return <svg width={size} height={size} viewBox="0 0 100 100">{DEFS}{renderFilm()}</svg>;
};
