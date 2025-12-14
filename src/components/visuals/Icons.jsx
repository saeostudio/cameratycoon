import React from 'react';

export const FilmIcon = ({ color = '#facc15', size = 50 }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Canister Body */}
        <rect x="25" y="20" width="50" height="60" rx="5" fill={color} stroke="#333" strokeWidth="2"/>
        {/* Cap Top */}
        <rect x="22" y="15" width="56" height="10" rx="2" fill="#555" stroke="#333" strokeWidth="2"/>
        {/* Cap Bottom */}
        <rect x="22" y="75" width="56" height="10" rx="2" fill="#555" stroke="#333" strokeWidth="2"/>
        {/* Label Area */}
        <rect x="30" y="35" width="40" height="30" fill="white" fillOpacity="0.5"/>
        {/* Film Strip sticking out */}
        <path d="M75 30 L90 30 L90 50 L75 50" fill="#333" stroke="#333" strokeWidth="2"/>
        <rect x="78" y="32" width="4" height="6" fill="white"/>
        <rect x="85" y="32" width="4" height="6" fill="white"/>
        <rect x="78" y="42" width="4" height="6" fill="white"/>
        <rect x="85" y="42" width="4" height="6" fill="white"/>
    </svg>
);

export const LensIcon = ({ color = '#333', size = 50 }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Lens Barrel */}
        <rect x="30" y="20" width="40" height="60" fill={color} stroke="#111" strokeWidth="2"/>
        {/* Glass Reflection */}
        <circle cx="50" cy="50" r="15" fill="#3b82f6" fillOpacity="0.3" stroke="#222" strokeWidth="2"/>
        {/* Rings */}
        <rect x="28" y="25" width="44" height="5" fill="#444"/>
        <rect x="28" y="65" width="44" height="5" fill="#444"/>
        {/* Highlight */}
        <path d="M35 30 L35 70" stroke="white" strokeOpacity="0.2" strokeWidth="2"/>
    </svg>
);

export const CameraIcon = ({ bodyColor = '#333', gripColor = '#111', styleId = 1, size = 50 }) => {
    // Basic switch for styles (just variations in shape/viewfinder)

    // Style 1: Generic Rangefinder/Compact
    const renderStyle1 = () => (
        <>
            <rect x="10" y="30" width="80" height="50" rx="5" fill={bodyColor} stroke="#111" strokeWidth="2"/>
            {/* Grip */}
            <rect x="15" y="30" width="10" height="50" fill={gripColor} fillOpacity="0.8"/>
            {/* Lens Mount Area */}
            <circle cx="50" cy="55" r="18" fill="#222" stroke="#444" strokeWidth="2"/>
            <circle cx="50" cy="55" r="12" fill="#111"/>
            <circle cx="55" cy="50" r="4" fill="white" fillOpacity="0.2"/>
            {/* Viewfinder / Flash */}
            <rect x="65" y="35" width="15" height="10" fill="#444"/>
            <rect x="25" y="35" width="20" height="8" fill="#333"/>
             {/* Shutter Button */}
            <rect x="70" y="25" width="8" height="5" fill="#555"/>
        </>
    );

    // Style 2: SLR bump
    const renderStyle2 = () => (
        <>
             {/* Prism Bump */}
            <path d="M35 30 L45 15 L55 15 L65 30 Z" fill={bodyColor} stroke="#111" strokeWidth="2"/>
            {/* Body */}
            <rect x="10" y="30" width="80" height="50" rx="4" fill={bodyColor} stroke="#111" strokeWidth="2"/>
            {/* Grip */}
            <path d="M10 30 L20 30 L20 80 L10 80 Z" fill={gripColor}/>
            {/* Lens */}
            <circle cx="50" cy="55" r="20" fill="#222" stroke="#444" strokeWidth="2"/>
            <circle cx="50" cy="55" r="15" fill="#111"/>
            {/* Shutter */}
            <rect x="70" y="28" width="6" height="4" fill="silver"/>
        </>
    );

    // Style 3: Modern Mirrorless (Sharper edges)
    const renderStyle3 = () => (
         <>
             {/* EVF Bump */}
            <rect x="40" y="20" width="20" height="10" fill={bodyColor} stroke="#111" strokeWidth="2"/>
            {/* Body */}
            <rect x="10" y="30" width="80" height="50" rx="2" fill={bodyColor} stroke="#111" strokeWidth="2"/>
             {/* Grip */}
            <rect x="75" y="35" width="10" height="40" rx="2" fill={gripColor}/>
             {/* Lens */}
            <circle cx="45" cy="55" r="18" fill="#222" stroke="silver" strokeWidth="1"/>
            <circle cx="45" cy="55" r="14" fill="#000"/>
        </>
    );

    // Style 4+: Retro / Other variations (Mapped to 1-3 for simplicity for now, but rotated colors/shapes?)
    // Let's just cycle the renderers based on ID modulo 3

    if ((styleId % 3) === 0) return <svg width={size} height={size} viewBox="0 0 100 100">{renderStyle3()}</svg>;
    if ((styleId % 3) === 2) return <svg width={size} height={size} viewBox="0 0 100 100">{renderStyle2()}</svg>;
    return <svg width={size} height={size} viewBox="0 0 100 100">{renderStyle1()}</svg>;
};
