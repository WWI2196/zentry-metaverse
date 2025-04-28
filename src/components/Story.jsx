import React, { useRef, useEffect, useState } from 'react';
import AnimatedTitle from './AnimatedTitle';
import { gsap } from 'gsap';
import RoundedCorners from './RoundedConers';
import BentoTilt from './BentoTilt'; 
import Button from './Button';
import { FaArrowCircleRight } from "react-icons/fa"; // Changed to a more suitable icon

const Story = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const frameRef = useRef(null);
    const containerRef = useRef(null);
    const buttonIconRef = useRef(null);

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
            <p className='font-general text-sm uppercase tracking-wider animate-fade-up' 
               style={{ animationDelay: '0.2s' }}>
                The multiverse ip world
            </p>

            <div className='relative size-full mt-8'> 
                <AnimatedTitle 
                    title="The st<b>o</b>ry of <br/> a hidden real<b>m</b>"
                    sectionID="#story"
                    containerClass="pointer-events-none mix-blend-difference relative z-10 animate-fade-up"
                    style={{ animationDelay: '0.4s' }}
                />

                {/* Main image container with new positioning */}
                <div 
                    ref={containerRef}
                    className={`story-img-container transition-opacity duration-1000 ease-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                    style={{ filter: "url('#FLT_TAG')", animationDelay: '0.6s' }}
                >
                    <div className="story-img-mask glass-effect shadow-ios rounded-[2rem]"> 
                        <BentoTilt
                            className="story-img-content relative overflow-hidden rounded-[1.8rem] neo-border"
                            tiltMaxAngleX={7}
                            tiltMaxAngleY={7}
                            glareEnable={false}
                            glareMaxOpacity={0.15}
                            scale={1.03}
                            style={{ filter: "url('#soft-shadow')" }}
                        >
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

            {/* COMPLETELY REDESIGNED: Modern content layout with cards and spacious design */}
            <div className="w-full px-4 md:px-8 lg:px-16 -mt-72 sm:-mt-64 md:-mt-60 lg:-mt-80">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
                    
                    {/* Left content card - Taking more space on desktop */}
                    <div className="md:col-span-7 lg:col-span-8">
                        <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-6 md:p-8 lg:p-10
                            shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative overflow-hidden group
                            hover:shadow-[0_10px_40px_rgb(76,29,149,0.15)] transition-all duration-500
                            border border-white/5">
                            
                            {/* Corner ambient glows */}
                            <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 blur-3xl rounded-full opacity-70"></div>
                            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/20 blur-3xl rounded-full opacity-70"></div>
                            
                            {/* Section header */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl md:text-3xl lg:text-4xl font-black font-zentry text-white">
                                    Zen<span className="text-yellow-300">try</span> <span className="font-medium text-white/60">World</span>
                                </h2>
                                
                                <div className="inline-flex px-3 py-1 bg-gradient-to-r from-indigo-600/90 to-purple-600/90 
                                    rounded-full text-xs font-bold text-white uppercase tracking-wider
                                    shadow-[0_2px_10px_rgba(120,80,220,0.3)] backdrop-blur-sm">
                                    <span className="mix-blend-plus-lighter">Exclusive Universe</span>
                                </div>
                            </div>
                            
                            {/* Main content */}
                            <p className="text-lg md:text-xl leading-relaxed text-white/90 mb-6">
                                Where dimensions <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
                                converge</span>, explorers discover Zentry—a nexus of boundless realms and infinite possibility.
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="bg-white/5 rounded-2xl p-4 backdrop-blur-sm">
                                    <h3 className="text-lg font-zentry text-yellow-300 mb-2">Ancient Secrets</h3>
                                    <p className="text-white/80">Uncover hidden knowledge and forgotten technologies across the boundless pillar.</p>
                                </div>
                                
                                <div className="bg-white/5 rounded-2xl p-4 backdrop-blur-sm">
                                    <h3 className="text-lg font-zentry text-yellow-300 mb-2">Infinite Realms</h3>
                                    <p className="text-white/80">Shape your destiny across countless dimensions, each with unique rules and opportunities.</p>
                                </div>
                            </div>
                            
                            {/* Dynamic divider */}
                            <div className="h-px w-full mb-6 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                        </div>
                    </div>
                    
                    {/* Right content card with button - Taking less space on desktop */}
                    <div className="md:col-span-5 lg:col-span-4 md:self-end">
                        <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-6 md:p-8
                            shadow-[0_8px_30px_rgb(0,0,0,0.15)] relative overflow-hidden group
                            hover:shadow-[0_10px_40px_rgb(237,255,102,0.15)] transition-all duration-500
                            border border-white/5">
                            
                            {/* Yellow corner glow */}
                            <div className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-300/10 blur-3xl rounded-full opacity-70
                                group-hover:opacity-100 transition-opacity duration-700"></div>
                            
                            <h3 className="text-xl md:text-2xl font-zentry text-white mb-4">Begin Your Adventure</h3>
                            
                            <p className="text-white/80 mb-6">
                                Start your journey through the infinite worlds of Zentry. 
                                Discover secrets and shape your fate among countless possibilities.
                            </p>
                            
                            {/* Custom button with proper hover animation */}
                            <button 
                                onClick={handleDiscoverClick}
                                className="group w-full bg-yellow-300/95 hover:bg-yellow-300 text-black flex 
                                    items-center justify-center gap-3 px-8 py-5 rounded-full
                                    shadow-md transition-all duration-300 font-medium text-base
                                    hover:shadow-[0_5px_15px_rgba(250,204,21,0.4)] relative overflow-hidden"
                            >
                                <span className="uppercase font-general tracking-wider z-10">Discover Prologue</span>
                                
                                {/* Icon with hover animation that works correctly */}
                                <span className="flex items-center justify-center relative z-10">
                                    <FaArrowCircleRight 
                                        size={24} 
                                        className="transform transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:scale-110" 
                                    />
                                </span>
                                
                                {/* Background hover effect */}
                                <span className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-200 
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </section>
  )
}

export default Story