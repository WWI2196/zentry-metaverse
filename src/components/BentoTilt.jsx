import React from 'react';
import Tilt from 'react-parallax-tilt';

const BentoTilt = ({ children, className = '', tiltMaxAngleX = 5, tiltMaxAngleY = 5, ...props }) => {
  return (
    <Tilt
      className={`parallax-effect-glare-scale ${className}`}
      tiltMaxAngleX={tiltMaxAngleX}
      tiltMaxAngleY={tiltMaxAngleY}
      perspective={800}
      transitionSpeed={1500}
      scale={1.02}
      gyroscope={true}
      glareEnable={true}
      glareMaxOpacity={0.15} 
      glareColor="rgba(255, 255, 255, 0.5)" 
      glarePosition="all"
      glareBorderRadius="1.8rem" // Match inner image rounding
      {...props} 
    >
      {children}
    </Tilt>
  );
};

export default BentoTilt;