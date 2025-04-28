import React from 'react';
import Tilt from 'react-parallax-tilt';

// Reduce default tilt angles
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
      glareMaxOpacity={0.45}
      glareColor="#ffffff"
      glarePosition="all"
      glareBorderRadius="1rem" // Matches the rounded-2xl class
      {...props} // Pass any other props down to Tilt
    >
      {children}
    </Tilt>
  );
};

export default BentoTilt;