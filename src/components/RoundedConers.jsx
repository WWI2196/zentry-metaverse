import React from 'react';

const RoundedCorners = () => {
  return (
    <svg
      className="invisible absolute size-0"
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
    >
      <defs>
        {/* Modern blur effect with softer edges */}
        <filter id="FLT_TAG" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur
            in="SourceGraphic"
            stdDeviation="12"  // Increased blur
            result="blur"
          />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -8" // Adjusted alpha contrast
            result="flt_tag"
          />
          <feComposite
            in="SourceGraphic"
            in2="flt_tag"
            operator="atop"
          />
        </filter>
        
        {/* Additional modern glow effect */}
        <filter id="modern-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="15" result="blur" />
          <feFlood floodColor="rgba(70, 100, 255, 0.3)" result="color"/>
          <feComposite in="color" in2="blur" operator="in" result="glow"/>
          <feComposite in="SourceGraphic" in2="glow" operator="over"/>
        </filter>
        
        {/* Soft shadow effect */}
        <filter id="soft-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="10" stdDeviation="15" floodColor="rgba(0,0,0,0.35)"/>
        </filter>
      </defs>
    </svg>
  );
};

export default RoundedCorners;
