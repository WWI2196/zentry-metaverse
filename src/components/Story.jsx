import React, { useRef, useEffect, useState } from 'react';
import AnimatedTitle from './AnimatedTitle';
import { gsap } from 'gsap';
import RoundedCorners from './RoundedConers';
import BentoTilt from './BentoTilt'; 
import Button from './Button';
import { TiLocationArrow } from "react-icons/ti"; // Import the icon

const Story = () => {
    // ...existing state, useEffect, and handlers...
    const [isLoaded, setIsLoaded] = useState(false);
    const frameRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        // Add a small delay for image load/animation timing
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 300); // Shorter delay
        return () => clearTimeout(timer);
    }, []);

    const handleMouseLeave = () => {
        const element = frameRef.current;
    
        if (element) {
          gsap.to(element, {
            duration: 0.3,
            rotateX: 0,
            rotateY: 0,
            ease: "power1.inOut",
          });
        }
    };

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const element = frameRef.current;
    
        if (!element) return;
    
        const rect = element.getBoundingClientRect();
        const xPos = clientX - rect.left;
        const yPos = clientY - rect.top;
    
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
    
        const rotateX = ((yPos - centerY) / centerY) * -8; // Reduced rotation
        const rotateY = ((xPos - centerX) / centerX) * 8; // Reduced rotation
    
        gsap.to(element, {
          duration: 0.3,
          rotateX,
          rotateY,
          transformPerspective: 600, // Increased perspective
          ease: "power1.out", // Smoother ease
        });
      };

    const handleDiscoverClick = () => {
        console.log("Navigate to prologue page (from Story component)...");
        // Later: window.location.href = '/prologue'; or use react-router navigate
    };

  return (
    <section id='story' className="min-h-dvh w-screen bg-black text-blue-50 overflow-hidden">
        <div className='flex size-full flex-col items-center py-16 pb-24'> 
            {/* ... existing paragraph, title, image container ... */}
            <p className='font-general text-sm uppercase tracking-wider animate-fade-up' style={{ animationDelay: '0.2s' }}>The multiverse ip world</p>

            <div className='relative size-full mt-8'> 
                {/* ... existing AnimatedTitle ... */}
                <AnimatedTitle 
                    title="The st<b>o</b>ry of <br/> a hidden real<b>m</b>"
                    sectionID="#story"
                    containerClass="pointer-events-none mix-blend-difference relative z-10 animate-fade-up"
                    style={{ animationDelay: '0.4s' }}
                 />

                 <div 
                    ref={containerRef}
                    className={`story-img-container transition-opacity duration-1000 ease-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                    style={{ filter: "url('#FLT_TAG')", animationDelay: '0.6s' }}
                 >
                    {/* ... existing image mask and BentoTilt ... */}
                    <div className="story-img-mask glass-effect shadow-ios rounded-[2rem]"> 
                        <BentoTilt
                            className="story-img-content relative overflow-hidden rounded-[1.8rem] neo-border"
                            tiltMaxAngleX={7}
                            tiltMaxAngleY={7}
                            glareEnable={false} // Disable glare specifically for this instance
                            glareMaxOpacity={0.15}
                            scale={1.03}
                            style={{ filter: "url('#soft-shadow')" }}
                        >
                            {/* ... existing inner divs and img ... */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-purple-900/10 mix-blend-plus-lighter opacity-70 z-[1]"></div>
                            <img
                                ref={frameRef}
                                src="/img/entrance.webp" 
                                alt="entrance"
                                className='object-cover h-full w-full transition-transform duration-500 ease-out group-hover:scale-105'
                                onLoad={() => setIsLoaded(true)}
                            />
                            <div className="absolute inset-0 bg-black/40 mix-blend-multiply z-[2]"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-black/90 to-transparent z-[3]">
                                <h3 className="text-xl md:text-2xl font-bold text-white font-zentry mb-2 opacity-95 animate-fade-up" style={{ animationDelay: '0.8s' }}>Explore The Realm</h3>
                                <div className="h-[1.5px] w-16 bg-gradient-to-r from-blue-400 to-purple-500 mb-3 animate-[line-appear_1s_ease-out_forwards]" style={{ animationDelay: '1s' }}></div>
                                <p className="text-sm md:text-base text-blue-100/90 font-circular-web max-w-md animate-fade-up" style={{ animationDelay: '1.2s' }}>
                                    Discover secrets hidden within the ancient walls and uncover the story of a civilization lost to time.
                                </p>
                            </div>
                        </BentoTilt>
                    </div>

                    <RoundedCorners /> 

                 </div>

            </div>

            {/* Adjusted Button Section Margins & Styles */}
            {/* Changed mt-4 to mt-0 for small screens, kept md:-mt-48 for medium+ */}
            <div className="mt-0 flex w-full justify-center px-4 md:-mt-48 md:me-44 md:justify-end md:px-0">
              <div className="flex h-full w-fit flex-col items-center md:items-start">
                {/* Increased text size and adjusted color */}
                <p className="mt-3 max-w-sm text-center font-circular-web text-base text-gray-300 md:text-start">
                  Where realms converge, lies Zentry and the boundless pillar.
                  Discover its secrets and shape your fate amidst infinite
                  opportunities.
                </p>

                {/* Increased button padding via containerClass */}
                <Button
                  id="realm-btn"
                  title="discover prologue"
                  rightIcon={<TiLocationArrow className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />}
                  containerClass="!bg-yellow-300/90 hover:!bg-yellow-300 text-black flex items-center mt-5 px-8 py-3" // Added px-8 py-3
                  onClick={handleDiscoverClick}
                />
              </div>
            </div>

        </div>
    </section>
  )
}

export default Story