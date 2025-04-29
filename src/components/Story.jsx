import React, { useRef, useEffect, useState } from 'react';
import AnimatedTitle from './AnimatedTitle';
import { gsap } from 'gsap';
import RoundedCorners from './RoundedConers';
import BentoTilt from './BentoTilt'; 
import Button from './Button';
import { FaArrowRight, FaCompass } from "react-icons/fa";

const Story = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const frameRef = useRef(null);
    const containerRef = useRef(null);
    const contentRef = useRef(null);
    const leftCardRef = useRef(null);
    const rightCardRef = useRef(null);
    const featuresRef = useRef([]);
    const buttonWrapperRef = useRef(null);
    const buttonIconRef = useRef(null);

    useEffect(() => {
        // Add a small delay for image load/animation timing
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    // Initialize GSAP animations for content elements when loaded
    useEffect(() => {
        if (isLoaded && contentRef.current) {
            // Create staggered entrance animation for cards
            gsap.fromTo(
                [leftCardRef.current, rightCardRef.current],
                { 
                    y: 40, 
                    opacity: 0
                },
                { 
                    y: 0, 
                    opacity: 1, 
                    duration: 0.9, 
                    stagger: 0.2,
                    ease: "power3.out",
                    clearProps: "all"
                }
            );
            
            // Animate heading elements with split text effect
            const headingElements = document.querySelectorAll('.animated-heading');
            headingElements.forEach(heading => {
                const text = heading.textContent;
                heading.textContent = '';
                
                // Create spans for each character
                [...text].forEach((char, i) => {
                    const span = document.createElement('span');
                    span.textContent = char;
                    span.style.opacity = '0';
                    span.style.display = 'inline-block';
                    span.style.transform = 'translateY(20px) rotateX(45deg)';
                    span.style.transformOrigin = 'center bottom';
                    heading.appendChild(span);
                    
                    // Animate each character
                    gsap.to(span, {
                        y: 0,
                        opacity: 1,
                        rotateX: 0,
                        duration: 0.5,
                        delay: 0.8 + (i * 0.03),
                        ease: "back.out(1.7)"
                    });
                });
            });
            
            // Initialize floating particles
            initParticles();
            
            // Create hover effect for feature cards
            featuresRef.current.forEach((card, i) => {
                card.addEventListener('mouseenter', () => {
                    gsap.to(card, {
                        y: -5,
                        boxShadow: '0 15px 30px rgba(237, 255, 102, 0.2)',
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                    
                    // Highlight card title
                    const cardTitle = card.querySelector('.feature-title');
                    if (cardTitle) {
                        gsap.to(cardTitle, {
                            scale: 1.05,
                            color: '#edff66',
                            duration: 0.3
                        });
                    }
                });
                
                card.addEventListener('mouseleave', () => {
                    gsap.to(card, {
                        y: 0,
                        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                    
                    // Reset card title
                    const cardTitle = card.querySelector('.feature-title');
                    if (cardTitle) {
                        gsap.to(cardTitle, {
                            scale: 1,
                            color: '#edff66',
                            duration: 0.3
                        });
                    }
                });
            });
            
            // Animate the gradient divider
            gsap.fromTo(
                ".gradient-divider",
                { 
                    width: "0%", 
                    opacity: 0
                },
                { 
                    width: "100%", 
                    opacity: 1, 
                    duration: 1.2, 
                    delay: 1.1,
                    ease: "power2.inOut"
                }
            );
            
            // Animate the glow orbs with continuous motion
            gsap.to('.glow-orb-1', {
                x: '10%',
                y: '15%',
                duration: 8,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
            
            gsap.to('.glow-orb-2', {
                x: '-15%',
                y: '-10%',
                duration: 9,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: 0.5
            });
            
            // Start the background animation
            animateCardBackground();
        }
    }, [isLoaded]);
    
    // Initialize floating particles for the card background
    const initParticles = () => {
        if (!leftCardRef.current) return;
        
        const particlesContainer = document.querySelector('.particles-container');
        if (!particlesContainer) return;
        
        // Clear any existing particles
        particlesContainer.innerHTML = '';
        
        // Create particles
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'absolute rounded-full bg-white/20 pointer-events-none';
            
            // Random size
            const size = Math.random() * 4 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // Random initial position
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            particle.style.left = `${x}%`;
            particle.style.top = `${y}%`;
            
            // Append to container
            particlesContainer.appendChild(particle);
            
            // Animate each particle
            gsap.to(particle, {
                x: (Math.random() - 0.5) * 50,
                y: (Math.random() - 0.5) * 50,
                opacity: Math.random() * 0.5 + 0.3,
                duration: Math.random() * 15 + 10,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: Math.random() * 5
            });
        }
    };
    
    // Animate the background pattern
    const animateCardBackground = () => {
        if (!leftCardRef.current) return;
        
        const backgroundPattern = document.querySelector('.background-pattern');
        if (!backgroundPattern) return;
        
        gsap.to(backgroundPattern, {
            backgroundPosition: '100% 100%',
            duration: 30,
            ease: 'none',
            repeat: -1
        });
    };

    // Set up button animation hooks - This is crucial for proper hover effect
    useEffect(() => {
        if (!buttonWrapperRef.current) return;
        
        // Create button hover animation
        const buttonWrapper = buttonWrapperRef.current;
        
        const onMouseEnter = () => {
            if (buttonIconRef.current) {
                gsap.to(buttonIconRef.current, {
                    x: 5,
                    scale: 1.2,
                    duration: 0.3,
                    ease: "back.out(1.7)",
                    color: "#000"
                });
            }
            gsap.to(buttonWrapper, {
                backgroundColor: "rgba(237, 255, 102, 1)", // Full yellow color on hover
                scale: 1.02,
                duration: 0.3,
                ease: "power2.out",
                boxShadow: "0 8px 20px rgba(237, 255, 102, 0.3)"
            });
        };
        
        const onMouseLeave = () => {
            if (buttonIconRef.current) {
                gsap.to(buttonIconRef.current, {
                    x: 0,
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out",
                    color: "#000"
                });
            }
            gsap.to(buttonWrapper, {
                backgroundColor: "rgba(237, 255, 102, 0.95)",
                scale: 1,
                duration: 0.3,
                ease: "power2.out",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)"
            });
        };
        
        // Add event listeners
        buttonWrapper.addEventListener("mouseenter", onMouseEnter);
        buttonWrapper.addEventListener("mouseleave", onMouseLeave);
        
        // Cleanup
        return () => {
            buttonWrapper.removeEventListener("mouseenter", onMouseEnter);
            buttonWrapper.removeEventListener("mouseleave", onMouseLeave);
        };
    }, [isLoaded]);

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
    
        const rotateX = ((yPos - centerY) / centerY) * -8;
        const rotateY = ((xPos - centerX) / centerX) * 8;
    
        gsap.to(element, {
          duration: 0.3,
          rotateX,
          rotateY,
          transformPerspective: 600,
          ease: "power1.out",
        });
    };

    const handleDiscoverClick = () => {
        // Click animation effect
        if (buttonIconRef.current) {
            gsap.timeline()
                .to(buttonIconRef.current, {
                    x: 5, 
                    scale: 0.8,
                    duration: 0.1,
                    ease: "power2.in"
                })
                .to(buttonIconRef.current, {
                    x: 15,
                    scale: 1.2, 
                    duration: 0.3,
                    ease: "back.out(1.7)"
                })
                .to(buttonIconRef.current, {
                    x: 5,
                    scale: 1,
                    duration: 0.2,
                    delay: 0.1,
                    ease: "power1.out"
                });
        }
        
        if (buttonWrapperRef.current) {
            gsap.timeline()
                .to(buttonWrapperRef.current, {
                    scale: 0.97,
                    duration: 0.1,
                    ease: "power2.in"
                })
                .to(buttonWrapperRef.current, {
                    scale: 1.03,
                    duration: 0.2,
                    ease: "back.out"
                })
                .to(buttonWrapperRef.current, {
                    scale: 1,
                    duration: 0.2,
                    ease: "power1.out"
                });
        }
        
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

                {/* LOWERED POSITION: Reduced negative margins to move content down */}
                <div 
                    ref={contentRef}
                    className="w-full px-4 md:px-8 lg:px-16 -mt-60 sm:-mt-52 md:-mt-48 lg:-mt-64"
                >
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
                        
                        {/* Left content card - Taking more space on desktop - MODERNIZED */}
                        <div 
                            ref={leftCardRef}
                            className="md:col-span-7 lg:col-span-8"
                        >
                            <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-6 md:p-8 lg:p-10
                                shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative overflow-hidden group
                                hover:shadow-[0_10px_40px_rgb(76,29,149,0.15)] transition-all duration-500
                                border border-white/5 perspective-1000">
                                
                                {/* Corner ambient glows with animation */}
                                <div className="glow-orb-1 absolute -top-20 -right-20 w-60 h-60 bg-blue-500/20 blur-3xl rounded-full opacity-70"></div>
                                <div className="glow-orb-2 absolute -bottom-20 -left-20 w-60 h-60 bg-purple-500/20 blur-3xl rounded-full opacity-70"></div>
                                
                                {/* Animated background pattern */}
                                <div className="background-pattern absolute inset-0 opacity-5 mix-blend-overlay pointer-events-none"
                                     style={{
                                        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM36 4V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                                        backgroundSize: '180px 180px'
                                     }}></div>
                                
                                {/* Floating particles container */}
                                <div className="particles-container absolute inset-0 overflow-hidden pointer-events-none"></div>
                                
                                {/* Subtle edge glow effect */}
                                <div className="absolute inset-0 rounded-3xl opacity-50 pointer-events-none"
                                     style={{
                                         boxShadow: 'inset 0 0 30px rgba(120, 80, 220, 0.3)'
                                     }}></div>
                                
                                {/* Section header with 3D animated text */}
                                <div className="flex items-center justify-between mb-6 relative z-10">
                                    <h2 className="animated-heading text-2xl md:text-3xl lg:text-4xl font-black font-zentry text-white">
                                        Zentry<span className="text-yellow-300">World</span>
                                    </h2>
                                    
                                    <div className="inline-flex px-3 py-1 bg-gradient-to-r from-indigo-600/90 to-purple-600/90 
                                        rounded-full text-xs font-bold text-white uppercase tracking-wider
                                        shadow-[0_2px_10px_rgba(120,80,220,0.3)] backdrop-blur-sm
                                        animate-pulse-slow relative overflow-hidden">
                                        <span className="mix-blend-plus-lighter relative z-10">Exclusive Universe</span>
                                        
                                        {/* Moving light effect */}
                                        <div className="absolute top-0 -left-3/4 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent
                                                      animate-shine-slow pointer-events-none"></div>
                                    </div>
                                </div>
                                
                                {/* Main content with animated gradient text */}
                                <div className="perspective-1000 my-6 relative z-10">
                                    <p className="text-lg md:text-xl leading-relaxed text-white/90 transform transition-all duration-300
                                                group-hover:scale-[1.02] group-hover:text-white">
                                        Where dimensions <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-purple-400 to-purple-300
                                                             animate-gradient-x">
                                        converge</span>, explorers discover Zentry—a nexus of boundless realms and infinite possibility.
                                    </p>
                                </div>
                                
                                {/* 3D hovering feature cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 relative z-10">
                                    {/* Features with individual refs for staggered animation and enhanced hover effects */}
                                    <div 
                                        ref={el => featuresRef.current[0] = el}
                                        className="bg-white/5 rounded-2xl p-5 backdrop-blur-sm transform transition-all duration-300
                                                 border border-white/5 hover:border-white/10 shadow-lg"
                                    >
                                        <div className="flex items-center mb-2">
                                            <div className="w-8 h-8 rounded-full bg-yellow-300/20 flex items-center justify-center mr-3">
                                                <div className="w-2 h-2 bg-yellow-300 rounded-full animate-ping-slow"></div>
                                            </div>
                                            <h3 className="feature-title text-lg font-zentry text-yellow-300">Ancient Secrets</h3>
                                        </div>
                                        
                                        <p className="text-white/80 pl-11">Uncover hidden knowledge and forgotten technologies across the boundless pillar.</p>
                                        
                                        {/* Corner decoration */}
                                        <div className="absolute -bottom-2 -right-2 w-16 h-16 opacity-20">
                                            <div className="absolute bottom-0 right-0 w-4 h-8 border-r-2 border-b-2 border-yellow-300/50 rounded-br-lg"></div>
                                        </div>
                                    </div>
                                    
                                    <div 
                                        ref={el => featuresRef.current[1] = el}
                                        className="bg-white/5 rounded-2xl p-5 backdrop-blur-sm transform transition-all duration-300
                                                 border border-white/5 hover:border-white/10 shadow-lg"
                                    >
                                        <div className="flex items-center mb-2">
                                            <div className="w-8 h-8 rounded-full bg-yellow-300/20 flex items-center justify-center mr-3">
                                                <div className="w-2 h-2 bg-yellow-300 rounded-full animate-ping-slow delay-1000"></div>
                                            </div>
                                            <h3 className="feature-title text-lg font-zentry text-yellow-300">Infinite Realms</h3>
                                        </div>
                                        
                                        <p className="text-white/80 pl-11">Shape your destiny across countless dimensions, each with unique rules and opportunities.</p>
                                        
                                        {/* Corner decoration */}
                                        <div className="absolute -bottom-2 -right-2 w-16 h-16 opacity-20">
                                            <div className="absolute bottom-0 right-0 w-4 h-8 border-r-2 border-b-2 border-yellow-300/50 rounded-br-lg"></div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Animated stats counter section */}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 relative z-10">
                                    <div className="p-3 bg-white/5 rounded-xl backdrop-blur-sm">
                                        <p className="text-white/60 text-xs uppercase tracking-wider">Worlds</p>
                                        <h4 className="text-xl md:text-2xl font-zentry text-white/90 flex items-baseline">
                                            <span className="counter" data-count="104">104</span>
                                            <span className="text-yellow-300 text-sm ml-1">+</span>
                                        </h4>
                                    </div>
                                    
                                    <div className="p-3 bg-white/5 rounded-xl backdrop-blur-sm">
                                        <p className="text-white/60 text-xs uppercase tracking-wider">Explorers</p>
                                        <h4 className="text-xl md:text-2xl font-zentry text-white/90 flex items-baseline">
                                            <span className="counter" data-count="25">25</span>
                                            <span className="text-yellow-300 text-sm ml-1">K+</span>
                                        </h4>
                                    </div>
                                    
                                    <div className="hidden md:block p-3 bg-white/5 rounded-xl backdrop-blur-sm">
                                        <p className="text-white/60 text-xs uppercase tracking-wider">Artifacts</p>
                                        <h4 className="text-xl md:text-2xl font-zentry text-white/90 flex items-baseline">
                                            <span className="counter" data-count="376">376</span>
                                            <span className="text-yellow-300 text-sm ml-1">+</span>
                                        </h4>
                                    </div>
                                </div>
                                
                                {/* Dynamic divider with GSAP animation */}
                                <div className="h-px w-full mb-6 bg-gradient-to-r from-transparent via-white/20 to-transparent gradient-divider relative z-10"></div>
                                
                                {/* Status updates */}
                                <div className="flex items-center gap-2 relative z-10">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    <p className="text-white/60 text-sm">Metaverse connected • <span className="text-green-400">Live</span></p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Right content card with button - FULLY MODERNIZED ADVENTURE BOX */}
                        <div 
                            ref={rightCardRef}
                            className="md:col-span-5 lg:col-span-4 md:self-end"
                        >
                            <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-6 md:p-8
                                shadow-[0_8px_30px_rgb(0,0,0,0.15)] relative overflow-hidden group
                                hover:shadow-[0_10px_40px_rgb(237,255,102,0.15)] transition-all duration-500
                                border border-white/5 transform perspective-1000">
                                
                                {/* Modern geometric background patterns */}
                                <div className="absolute inset-0 overflow-hidden">
                                    {/* Abstract decorative elements */}
                                    <div className="absolute top-[30%] right-[10%] w-32 h-32 rotate-45 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-lg"></div>
                                    <div className="absolute bottom-[20%] left-[20%] w-40 h-40 rotate-12 border border-white/5 rounded-full"></div>
                                    
                                    {/* Gradient background */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-black/0 to-purple-900/10 opacity-100
                                                group-hover:opacity-80 transition-opacity duration-1000 ease-out"></div>
                                </div>
                                
                                {/* Yellow corner glow with enhanced animation */}
                                <div className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-300/10 blur-3xl rounded-full opacity-70
                                    group-hover:opacity-100 group-hover:w-60 group-hover:h-60 transition-all duration-700"></div>
                                
                                {/* Modern header with icon and badge */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center">
                                        <div className="mr-3 w-10 h-10 rounded-xl bg-gradient-to-tr from-yellow-300/40 to-amber-500/40 flex items-center justify-center
                                                     shadow-lg transform transition-transform duration-500 group-hover:rotate-12">
                                            <FaCompass className="text-yellow-300 text-lg" />
                                        </div>
                                        <div>
                                            <h3 className="animated-heading text-xl md:text-2xl font-zentry text-white">Begin Your Adventure</h3>
                                            <div className="h-1 w-12 bg-gradient-to-r from-yellow-300 to-yellow-200 rounded mt-1 transform origin-left transition-all duration-500 group-hover:scale-x-125"></div>
                                        </div>
                                    </div>
                                    
                                    {/* Interactive badge */}
                                    <div className="px-2 py-1 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 backdrop-blur-sm
                                                  rounded-full border border-white/10 transform transition-transform duration-300 
                                                  hover:scale-105 hover:border-white/20">
                                        <p className="text-white/90 text-[10px] uppercase tracking-wider">New</p>
                                    </div>
                                </div>
                                
                                {/* Modern glass message panel */}
                                <div className="relative mb-8 bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-4 md:p-5
                                              border-l-2 border-yellow-300/50 backdrop-blur-sm">
                                    {/* Top corner accent */}
                                    <div className="absolute -top-1.5 -right-1.5 w-6 h-6">
                                        <div className="absolute top-0 right-0 w-3 h-6 border-t-2 border-r-2 border-yellow-300/30 rounded-tr-lg"></div>
                                    </div>
                                    
                                    {/* Message content with enhanced styling */}
                                    <div className="flex">
                                        <div className="mt-1 mr-3 min-w-[0.25rem] h-16 bg-gradient-to-b from-yellow-300/70 via-yellow-200/40 to-yellow-300/10 rounded-full"></div>
                                        <div>
                                            <p className="typewriter-text text-white/90 text-base font-circular-web mb-2">
                                                Start your journey through the infinite worlds of Zentry.
                                            </p>
                                            <p className="typewriter-text text-white/70 text-sm font-circular-web">
                                                Discover secrets and shape your fate among countless possibilities.
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Animated cursor */}
                                    <div className="h-4 w-[2px] bg-yellow-300 absolute right-5 bottom-4 animate-blink"></div>
                                    
                                    {/* Bottom corner accent */}
                                    <div className="absolute -bottom-1.5 -left-1.5 w-6 h-6">
                                        <div className="absolute bottom-0 left-0 w-6 h-3 border-l-2 border-b-2 border-yellow-300/30 rounded-bl-lg"></div>
                                    </div>
                                </div>
                                
                                {/* Modern access level indicator with hover effect */}
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-3 h-3 bg-gradient-to-r from-yellow-300 to-amber-400 rounded-full 
                                                         shadow-glow-sm animate-pulse-slow"></div>
                                            <div className="w-1.5 h-1.5 bg-yellow-300/60 rounded-full"></div>
                                            <div className="w-1.5 h-1.5 bg-yellow-300/40 rounded-full"></div>
                                        </div>
                                        <p className="text-white/70 text-xs tracking-wider font-medium">ACCESS GRANTED</p>
                                    </div>
                                    
                                    <div className="px-3 py-1.5 bg-gradient-to-r from-yellow-300/20 to-amber-500/20 backdrop-blur-sm
                                                  rounded-md border border-yellow-300/20 transition-all duration-300 
                                                  group-hover:border-yellow-300/40 group-hover:shadow-glow-xs">
                                        <p className="text-yellow-300 text-xs font-bold">EXPLORER</p>
                                    </div>
                                </div>
                                
                                {/* Custom button wrapper with improved styling */}
                                <div 
                                    ref={buttonWrapperRef} 
                                    className="relative rounded-full overflow-hidden shadow-md mb-5"
                                    style={{
                                        backgroundColor: "rgba(237, 255, 102, 0.95)",
                                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)"
                                    }}
                                >
                                    {/* Enhanced glow effects */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
                                                 bg-gradient-to-r from-yellow-200/30 via-transparent to-yellow-100/30 
                                                 blur-md"></div>
                                                 
                                    {/* Pulse ring animation */}
                                    <div className="absolute inset-0 rounded-full border-2 border-yellow-300/30 
                                                  scale-[1.15] opacity-0 group-hover:opacity-100 group-hover:scale-[1.25]
                                                  transition-all duration-1000 ease-out"></div>
                                                  
                                    {/* Background glow effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/90 via-yellow-100 to-yellow-300/90 
                                         opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                    
                                    {/* Button with improved contrast for visibility */}
                                    <Button
                                        id="prologue-btn"
                                        title="discover prologue"
                                        rightIcon={
                                            <span ref={buttonIconRef} className="relative flex items-center justify-center">
                                                <FaArrowRight size={18} className="text-black z-20" />
                                                {/* Icon highlight effect */}
                                                <span className="absolute w-6 h-6 bg-white/20 rounded-full -z-10 
                                                               scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100
                                                               transition-all duration-300 ease-out"></span>
                                            </span>
                                        }
                                        containerClass="w-full !bg-transparent font-bold text-black flex items-center 
                                                     justify-center gap-3 px-8 py-4 font-medium text-sm md:text-base"
                                        onClick={handleDiscoverClick}
                                    />
                                    
                                    {/* Improved animated indicator */}
                                    <div className="absolute right-7 top-1/2 w-1.5 h-1.5 rounded-full bg-black/70 
                                                   transform -translate-y-1/2 animate-ping-slow"></div>
                                </div>
                                
                                {/* Modern info carousel with improved transitions */}
                                <div className="relative overflow-hidden h-7 rounded-full bg-white/5 px-4 py-1.5 backdrop-blur-sm">
                                    {/* First text option */}
                                    <p className="text-white/60 text-xs text-center absolute inset-0 flex items-center justify-center transform
                                               transition-transform duration-500 translate-y-0 group-hover:-translate-y-7">
                                        Experience the full story in the prologue chapter
                                    </p>
                                    
                                    {/* Second text option that appears on hover */}
                                    <p className="text-white/80 text-xs text-center absolute inset-0 flex items-center justify-center transform
                                               transition-transform duration-500 translate-y-7 group-hover:translate-y-0">
                                        <span className="text-yellow-300 font-medium mr-1">New:</span> Interactive journeys available
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            
            {/* CSS Animations */}
            <style jsx="true">{`
                @keyframes shine-slow {
                    0% { left: -75%; }
                    100% { left: 150%; }
                }
                
                @keyframes gradient-x {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                
                @keyframes ping-slow {
                    0% { transform: scale(0.8); opacity: 0.8; }
                    50% { transform: scale(1.5); opacity: 0; }
                    100% { transform: scale(0.8); opacity: 0; }
                }
                
                @keyframes pulse-slow {
                    0% { opacity: 0.6; }
                    50% { opacity: 1; }
                    100% { opacity: 0.6; }
                }
                
                @keyframes blink {
                    0%, 100% { opacity: 0; }
                    50% { opacity: 1; }
                }
                
                .animate-shine-slow {
                    animation: shine-slow 3s infinite;
                }
                
                .animate-gradient-x {
                    background-size: 200% 100%;
                    animation: gradient-x 8s ease infinite;
                }
                
                .animate-ping-slow {
                    animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
                }
                
                .animate-pulse-slow {
                    animation: pulse-slow 3s infinite;
                }
                
                .perspective-1000 {
                    perspective: 1000px;
                }
                
                .typewriter-text {
                    overflow: hidden;
                    border-right: 0px solid transparent;
                    width: 100%;
                    display: inline-block;
                }
                
                .delay-1000 {
                    animation-delay: 1s;
                }
                
                .shadow-glow-xs {
                    box-shadow: 0 0 10px rgba(237, 255, 102, 0.2);
                }
                
                .shadow-glow-sm {
                    box-shadow: 0 0 15px rgba(237, 255, 102, 0.3);
                }
            `}</style>
        </section>
    );
};

export default Story;