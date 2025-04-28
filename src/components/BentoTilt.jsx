import React from 'react';
import Tilt from 'react-parallax-tilt';

// Reduce default tilt angles and glare intensity
const BentoTilt = ({ children, className = '', tiltMaxAngleX = 5, tiltMaxAngleY = 5, ...props }) => {
  return (
    <Tilt
      className={`parallax-effect-glare-scale ${className}`}
      tiltMaxAngleX={tiltMaxAngleX}
      tiltMaxAngleY={tiltMaxAngleY}
      perspective={800}
      transitionSpeed={1500}
      scale={1.02} // Matches the hover scale effect
      gyroscope={true}
      glareEnable={true}
      glareMaxOpacity={0.15} // Reduced glare intensity
      glareColor="rgba(255, 255, 255, 0.5)" // Made glare slightly transparent white
      glarePosition="all"
      glareBorderRadius="1.8rem" // Match the inner image rounding
      {...props} // Pass any other props down to Tilt
    >
      {children}
    </Tilt>
  );
};

export default BentoTilt;