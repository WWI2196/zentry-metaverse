import React, { useRef, useEffect, useState } from 'react';
import AnimatedTitle from './AnimatedTitle';
import { gsap } from 'gsap';
import RoundedCorners from './RoundedConers';
import BentoTilt from './BentoTilt'; 
import Button from './Button';
import { FaArrowRight, FaCompass } from "react-icons/fa";
import { BsShieldCheck, BsStars } from "react-icons/bs";

const Story = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [dynamicIslandActive, setDynamicIslandActive] = useState(false);
    const frameRef = useRef(null);
    const containerRef = useRef(null);
    const contentRef = useRef(null);
    const leftCardRef = useRef(null);
    const rightCardRef = useRef(null);
    const featuresRef = useRef([]);
    const buttonWrapperRef = useRef(null);
    const buttonIconRef = useRef(null);
    const dynamicIslandRef = useRef(null);

    useEffect(() => {
        // Add a small delay for image load/animation timing
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 300);
        
        // Trigger Dynamic Island notification after 2 seconds
        const notificationTimer = setTimeout(() => {
            setDynamicIslandActive(true);
            
            // Auto hide after 5 seconds
            setTimeout(() => {
                setDynamicIslandActive(false);
            }, 5000);
        }, 2000);
        
        return () => {
            clearTimeout(timer);
            clearTimeout(notificationTimer);
        };
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
                        ease: "back.out(1.7)" // iOS-like springy animation
                    });
                });
            });
            
            // Initialize floating particles
            initParticles();
            
            // Create hover effect for feature cards
            featuresRef.current.forEach((card, i) => {
                card.addEventListener('mouseenter', () => {
                    // iOS-style springy animation
                    gsap.to(card, {
                        y: -5,
                        boxShadow: '0 15px 30px rgba(237, 255, 102, 0.2)',
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        duration: 0.3,
                        ease: 'back.out(1.7)'
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
                    // iOS-style spring return
                    gsap.to(card, {
                        y: 0,
                        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        duration: 0.3,
                        ease: 'back.out(1.7)'
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
            
            // Animate counter numbers (iOS style)
            document.querySelectorAll('.counter').forEach(counter => {
                const target = parseInt(counter.getAttribute('data-count'));
                gsap.fromTo(
                    counter,
                    { innerText: 0 },
                    {
                        innerText: target,
                        duration: 2.5,
                        delay: 1.5,
                        ease: "power2.out",
                        snap: { innerText: 1 },
                        onUpdate: function() {
                            counter.innerText = Math.floor(counter.innerText);
                        }
                    }
                );
            });
        }
    }, [isLoaded]);
    
    // Handle Dynamic Island animation
    useEffect(() => {
        if (!dynamicIslandRef.current) return;
        
        if (dynamicIslandActive) {
            gsap.to(dynamicIslandRef.current, {
                width: "230px",
                height: "55px",
                borderRadius: "25px",
                duration: 0.4,
                ease: "back.out(1.7)"
            });
        } else {
            gsap.to(dynamicIslandRef.current, {
                width: "90px",
                height: "30px",
                borderRadius: "15px",
                duration: 0.3,
                delay: 0.1,
                ease: "back.out(1)"
            });
        }
    }, [dynamicIslandActive]);
    
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
        
        // Create button hover animation - iOS style with spring effect
        const buttonWrapper = buttonWrapperRef.current;
        
        const onMouseEnter = () => {
            if (buttonIconRef.current) {
                gsap.to(buttonIconRef.current, {
                    x: 5,
                    scale: 1.2,
                    duration: 0.3,
                    ease: "back.out(1.7)", // iOS spring-like effect
                    color: "#000"
                });
            }
            gsap.to(buttonWrapper, {
                backgroundColor: "rgba(237, 255, 102, 1)", // Full yellow color on hover
                scale: 1.02,
                duration: 0.3,
                ease: "back.out(1.2)", // iOS spring-like effect
                boxShadow: "0 8px 20px rgba(237, 255, 102, 0.3)"
            });
        };
        
        const onMouseLeave = () => {
            if (buttonIconRef.current) {
                gsap.to(buttonIconRef.current, {
                    x: 0,
                    scale: 1,
                    duration: 0.3,
                    ease: "back.out(1)", // iOS spring-like effect
                    color: "#000"
                });
            }
            gsap.to(buttonWrapper, {
                backgroundColor: "rgba(237, 255, 102, 0.95)",
                scale: 1,
                duration: 0.3,
                ease: "back.out(1)", // iOS spring-like effect
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

    // iOS-style click effect with haptic-like timing
    const handleDiscoverClick = () => {
        // Click animation effect with iOS-like spring timing
        if (buttonIconRef.current) {
            gsap.timeline()
                .to(buttonIconRef.current, {
                    x: 5, 
                    scale: 0.8,
                    duration: 0.08, // Faster for haptic feel
                    ease: "power2.in"
                })
                .to(buttonIconRef.current, {
                    x: 15,
                    scale: 1.2, 
                    duration: 0.3,
                    ease: "elastic.out(1.2, 0.5)" // iOS elastic spring
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
                    duration: 0.08, // Very quick for haptic feel
                    ease: "power2.in"
                })
                .to(buttonWrapperRef.current, {
                    scale: 1.03,
                    duration: 0.2,
                    ease: "elastic.out(1, 0.3)" // iOS elastic spring
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
    
    // iOS Dynamic Island tap handler
    const handleDynamicIslandClick = () => {
        setDynamicIslandActive(!dynamicIslandActive);
    };

    return (
        <section id='story' className="min-h-dvh w-screen bg-black text-blue-50 overflow-hidden">
            {/* iOS Dynamic Island style notification */}
            <div 
                ref={dynamicIslandRef}
                onClick={handleDynamicIslandClick}
                className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-black rounded-[15px] 
                         shadow-lg border border-white/10 flex items-center justify-center
                         w-[90px] h-[30px] cursor-pointer transition-colors hover:bg-black/90"
            >
                {!dynamicIslandActive ? (
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse" 
                             style={{animationDelay: '0.5s'}}></div>
                    </div>
                ) : (
                    <div className="flex items-center justify-between w-full px-4">
                        <div className="flex items-center gap-3">
                            <BsStars className="text-yellow-300 text-lg" />
                            <div>
                                <p className="text-white text-xs font-semibold">Zentry World</p>
                                <p className="text-white/60 text-[10px]">Explorer access granted</p>
                            </div>
                        </div>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                )}
            </div>

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
                        
                        {/* Left content card - ZENTRY WORLD - iOS REDESIGN */}
                        <div 
                            ref={leftCardRef}
                            className="md:col-span-7 lg:col-span-8"
                        >
                            <div className="ios-card bg-black/30 backdrop-blur-xl rounded-3xl p-6 md:p-8 lg:p-10
                                shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative overflow-hidden group
                                hover:shadow-[0_10px_40px_rgb(76,29,149,0.15)] transition-all duration-500
                                border border-white/5 perspective-1000">
                                
                                {/* iOS-style corner radius highlight */}
                                <div className="absolute inset-0 border border-white/10 rounded-3xl opacity-30 pointer-events-none"></div>
                                
                                {/* iOS-style top edge highlight */}
                                <div className="absolute inset-x-4 top-0 h-[1px] bg-white/20"></div>
                                
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
                                
                                {/* iOS-style subtle edge glow effect */}
                                <div className="absolute inset-0 rounded-3xl opacity-50 pointer-events-none"
                                     style={{
                                         boxShadow: 'inset 0 0 30px rgba(120, 80, 220, 0.3)'
                                     }}></div>
                                
                                {/* Section header with iOS-style SF Pro like design */}
                                <div className="flex items-center justify-between mb-8 relative z-10">
                                    <div className="relative">
                                        <h2 className="animated-heading text-2xl md:text-3xl lg:text-4xl font-black font-zentry text-white
                                                    tracking-tight">
                                            Zentry<span className="text-yellow-300">World</span>
                                        </h2>
                                        <div className="h-1 w-16 bg-gradient-to-r from-yellow-300 to-yellow-100 rounded-full mt-2 
                                                    animate-width-expand"></div>
                                    </div>
                                    
                                    {/* iOS SF Symbols style tag */}
                                    <div className="ios-tag inline-flex px-3 py-1.5 bg-gradient-to-r from-indigo-600/90 to-purple-600/90 
                                        rounded-full text-xs font-bold text-white uppercase tracking-wider
                                        shadow-[0_2px_10px_rgba(120,80,220,0.3)] backdrop-blur-sm
                                        relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/5 to-purple-400/5 opacity-0
                                                    group-hover:opacity-100 transition-opacity duration-700"></div>
                                        <span className="mix-blend-plus-lighter relative z-10 flex items-center">
                                            <BsShieldCheck className="mr-1.5" />
                                            <span>Exclusive Universe</span>
                                        </span>
                                        
                                        {/* iOS-style shine effect */}
                                        <div className="absolute top-0 -left-3/4 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent
                                                      animate-shine-slow pointer-events-none"></div>
                                    </div>
                                </div>
                                
                                {/* iOS-style messaging - Main content with animated gradient text */}
                                <div className="ios-message perspective-1000 my-6 relative z-10">
                                    <p className="text-lg md:text-xl leading-relaxed text-white/90 transform transition-all duration-300
                                                group-hover:scale-[1.02] group-hover:text-white">
                                        Where dimensions <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-purple-400 to-purple-300
                                                             animate-gradient-x">
                                        converge</span>, explorers discover Zentry—a nexus of boundless realms and infinite possibility.
                                    </p>
                                </div>
                                
                                {/* iOS-style feature cards with SF Pro design language */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 relative z-10">
                                    {/* Features with individual refs for staggered animation and enhanced hover effects */}
                                    <div 
                                        ref={el => featuresRef.current[0] = el}
                                        className="ios-feature-card bg-white/5 rounded-2xl p-5 backdrop-blur-sm transform transition-all duration-300
                                                 border border-white/5 hover:border-white/10 shadow-lg"
                                    >
                                        <div className="flex items-center mb-3">
                                            <div className="mr-3 w-10 h-10 rounded-xl bg-gradient-to-tr from-yellow-300/30 to-amber-500/20 flex items-center justify-center
                                                        shadow-sm transition-transform duration-500 group-hover:scale-110">
                                                <div className="w-2 h-2 bg-yellow-300 rounded-full animate-ping-slow"></div>
                                            </div>
                                            <h3 className="feature-title text-lg font-medium text-yellow-300">Ancient Secrets</h3>
                                        </div>
                                        
                                        <p className="text-white/80 ml-[3.25rem]">Uncover hidden knowledge and forgotten technologies across the boundless pillar.</p>
                                        
                                        {/* iOS-style corner decoration */}
                                        <div className="absolute -bottom-1 -right-1 w-10 h-10 opacity-20">
                                            <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-yellow-300/50 rounded-br"></div>
                                        </div>
                                    </div>
                                    
                                    <div 
                                        ref={el => featuresRef.current[1] = el}
                                        className="ios-feature-card bg-white/5 rounded-2xl p-5 backdrop-blur-sm transform transition-all duration-300
                                                 border border-white/5 hover:border-white/10 shadow-lg"
                                    >
                                        <div className="flex items-center mb-3">
                                            <div className="mr-3 w-10 h-10 rounded-xl bg-gradient-to-tr from-yellow-300/30 to-amber-500/20 flex items-center justify-center
                                                        shadow-sm transition-transform duration-500 group-hover:scale-110">
                                                <div className="w-2 h-2 bg-yellow-300 rounded-full animate-ping-slow delay-1000"></div>
                                            </div>
                                            <h3 className="feature-title text-lg font-medium text-yellow-300">Infinite Realms</h3>
                                        </div>
                                        
                                        <p className="text-white/80 ml-[3.25rem]">Shape your destiny across countless dimensions, each with unique rules and opportunities.</p>
                                        
                                        {/* iOS-style corner decoration */}
                                        <div className="absolute -bottom-1 -right-1 w-10 h-10 opacity-20">
                                            <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-yellow-300/50 rounded-br"></div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* iOS-style stats counter section with SF Pro inspired metrics */}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 relative z-10">
                                    <div className="ios-stat-card p-3 bg-white/5 rounded-xl backdrop-blur-sm">
                                        <p className="text-white/60 text-xs uppercase tracking-wider font-medium">Worlds</p>
                                        <div className="flex items-baseline">
                                            <h4 className="text-xl md:text-2xl font-zentry text-white/90">
                                                <span className="counter" data-count="104">104</span>
                                            </h4>
                                            <span className="text-yellow-300 text-sm ml-1">+</span>
                                        </div>
                                    </div>
                                    
                                    <div className="ios-stat-card p-3 bg-white/5 rounded-xl backdrop-blur-sm">
                                        <p className="text-white/60 text-xs uppercase tracking-wider font-medium">Explorers</p>
                                        <div className="flex items-baseline">
                                            <h4 className="text-xl md:text-2xl font-zentry text-white/90">
                                                <span className="counter" data-count="25">25</span>
                                            </h4>
                                            <span className="text-yellow-300 text-sm ml-1">K+</span>
                                        </div>
                                    </div>
                                    
                                    <div className="hidden md:block ios-stat-card p-3 bg-white/5 rounded-xl backdrop-blur-sm">
                                        <p className="text-white/60 text-xs uppercase tracking-wider font-medium">Artifacts</p>
                                        <div className="flex items-baseline">
                                            <h4 className="text-xl md:text-2xl font-zentry text-white/90">
                                                <span className="counter" data-count="376">376</span>
                                            </h4>
                                            <span className="text-yellow-300 text-sm ml-1">+</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* iOS SF Pro style divider with GSAP animation */}
                                <div className="h-px w-full mb-6 bg-gradient-to-r from-transparent via-white/20 to-transparent gradient-divider relative z-10"></div>
                                
                                {/* iOS SF Pro style status indicator */}
                                <div className="ios-status flex items-center gap-3 relative z-10">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
                                        <p className="text-white/70 text-sm font-medium">Metaverse connected</p>
                                    </div>
                                    <div className="h-3 w-[1px] bg-white/20"></div>
                                    <span className="text-green-400 text-sm font-medium">Live</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Right content card - BEGIN YOUR ADVENTURE - iOS REDESIGN */}
                        <div 
                            ref={rightCardRef}
                            className="md:col-span-5 lg:col-span-4 md:self-end"
                        >
                            <div className="ios-card bg-black/40 backdrop-blur-xl rounded-3xl p-6 md:p-8
                                shadow-[0_8px_30px_rgb(0,0,0,0.15)] relative overflow-hidden group
                                hover:shadow-[0_10px_40px_rgb(237,255,102,0.15)] transition-all duration-500
                                border border-white/5 transform perspective-1000">
                                
                                {/* iOS-style corner radius highlight */}
                                <div className="absolute inset-0 border border-white/10 rounded-3xl opacity-30 pointer-events-none"></div>
                                
                                {/* iOS-style top edge highlight */}
                                <div className="absolute inset-x-4 top-0 h-[1px] bg-white/20"></div>
                                
                                {/* iOS-style glass morphism background patterns */}
                                <div className="absolute inset-0 overflow-hidden">
                                    {/* Abstract decorative elements - SF Pro inspired */}
                                    <div className="absolute top-[30%] right-[10%] w-32 h-32 rotate-45 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-2xl"></div>
                                    <div className="absolute bottom-[20%] left-[20%] w-40 h-40 rotate-12 border border-white/5 rounded-full"></div>
                                    
                                    {/* iOS-style gradient background */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-black/0 to-purple-900/10 opacity-100
                                                group-hover:opacity-80 transition-opacity duration-1000 ease-out"></div>
                                </div>
                                
                                {/* iOS-style ambient light */}
                                <div className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-300/10 blur-3xl rounded-full opacity-70
                                    group-hover:opacity-100 group-hover:w-60 group-hover:h-60 transition-all duration-700"></div>
                                
                                {/* iOS-style header with SF Pro like typography */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center">
                                        <div className="mr-3 w-10 h-10 rounded-xl bg-gradient-to-tr from-yellow-300/30 to-amber-500/20 flex items-center justify-center
                                                     shadow-sm transform transition-transform duration-500 group-hover:rotate-12">
                                            <FaCompass className="text-yellow-300 text-lg" />
                                        </div>
                                        <div>
                                            <h3 className="animated-heading text-xl md:text-2xl font-semibold text-white tracking-tight">Begin Your Adventure</h3>
                                            <div className="h-1 w-12 bg-gradient-to-r from-yellow-300 to-yellow-200 rounded-full mt-1 transform origin-left transition-all duration-500 group-hover:scale-x-125"></div>
                                        </div>
                                    </div>
                                    
                                    {/* iOS SF Symbols style badge */}
                                    <div className="ios-badge px-2 py-1 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 backdrop-blur-sm
                                                  rounded-full border border-white/10 transform transition-transform duration-300 
                                                  hover:scale-105 hover:border-white/20">
                                        <p className="text-white/90 text-[10px] uppercase tracking-wider font-medium">New</p>
                                    </div>
                                </div>
                                
                                {/* iOS Message style glass panel */}
                                <div className="ios-message-bubble relative mb-8 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-4 md:p-5
                                              border-l-2 border-yellow-300/50 backdrop-blur-sm">
                                    {/* iOS-style message corner */}
                                    <div className="absolute -top-1.5 -right-1.5 w-6 h-6">
                                        <div className="absolute top-0 right-0 w-3 h-6 border-t-2 border-r-2 border-yellow-300/30 rounded-tr-lg"></div>
                                    </div>
                                    
                                    {/* iOS-style message content */}
                                    <div className="flex">
                                        <div className="mt-1 mr-3 min-w-[0.25rem] h-16 bg-gradient-to-b from-yellow-300/70 via-yellow-200/40 to-yellow-300/10 rounded-full"></div>
                                        <div>
                                            <p className="typewriter-text text-white/90 text-base font-medium mb-2">
                                                Start your journey through the infinite worlds of Zentry.
                                            </p>
                                            <p className="typewriter-text text-white/70 text-sm">
                                                Discover secrets and shape your fate among countless possibilities.
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* iOS-style cursor */}
                                    <div className="h-4 w-[2px] bg-yellow-300 absolute right-5 bottom-4 animate-blink"></div>
                                    
                                    {/* iOS-style message corner */}
                                    <div className="absolute -bottom-1.5 -left-1.5 w-6 h-6">
                                        <div className="absolute bottom-0 left-0 w-6 h-3 border-l-2 border-b-2 border-yellow-300/30 rounded-bl-lg"></div>
                                    </div>
                                </div>
                                
                                {/* iOS-style access level with SF Pro styling */}
                                <div className="ios-access-level flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-3 h-3 bg-gradient-to-r from-yellow-300 to-amber-400 rounded-full 
                                                         shadow-glow-sm animate-pulse-slow"></div>
                                            <div className="w-1.5 h-1.5 bg-yellow-300/60 rounded-full"></div>
                                            <div className="w-1.5 h-1.5 bg-yellow-300/40 rounded-full"></div>
                                        </div>
                                        <p className="text-white/70 text-xs tracking-wider font-medium">ACCESS GRANTED</p>
                                    </div>
                                    
                                    <div className="ios-tag px-3 py-1.5 bg-gradient-to-r from-yellow-300/20 to-amber-500/20 backdrop-blur-sm
                                                  rounded-md border border-yellow-300/20 transition-all duration-300 
                                                  group-hover:border-yellow-300/40 group-hover:shadow-glow-xs">
                                        <p className="text-yellow-300 text-xs font-bold">EXPLORER</p>
                                    </div>
                                </div>
                                
                                {/* iOS-style button wrapper with enhanced haptic-feeling animations */}
                                <div 
                                    ref={buttonWrapperRef} 
                                    className="ios-button relative rounded-full overflow-hidden shadow-md mb-5"
                                    style={{
                                        backgroundColor: "rgba(237, 255, 102, 0.95)",
                                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)"
                                    }}
                                >
                                    {/* iOS-style button highlight */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
                                                 bg-gradient-to-r from-yellow-200/30 via-transparent to-yellow-100/30 
                                                 blur-md"></div>
                                                 
                                    {/* iOS SF Symbols animation - pulse ring */}
                                    <div className="absolute inset-0 rounded-full border-2 border-yellow-300/30 
                                                  scale-[1.15] opacity-0 group-hover:opacity-100 group-hover:scale-[1.25]
                                                  transition-all duration-1000 ease-out"></div>
                                                  
                                    {/* iOS-style gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/90 via-yellow-100 to-yellow-300/90 
                                         opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                    
                                    {/* iOS-style inner button highlight */}
                                    <div className="absolute inset-x-0 top-0 h-[1px] bg-white/30"></div>
                                    
                                    {/* Button with improved contrast for visibility */}
                                    <Button
                                        id="prologue-btn"
                                        title="discover prologue"
                                        rightIcon={
                                            <span ref={buttonIconRef} className="relative flex items-center justify-center">
                                                <FaArrowRight size={18} className="text-black z-20" />
                                                {/* iOS-style icon highlight */}
                                                <span className="absolute w-6 h-6 bg-white/20 rounded-full -z-10 
                                                               scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100
                                                               transition-all duration-300 ease-out"></span>
                                            </span>
                                        }
                                        containerClass="w-full !bg-transparent font-bold text-black flex items-center 
                                                     justify-center gap-3 px-8 py-4 font-medium text-sm md:text-base"
                                        onClick={handleDiscoverClick}
                                    />
                                    
                                    {/* iOS-style indicator dot */}
                                    <div className="absolute right-7 top-1/2 w-1.5 h-1.5 rounded-full bg-black/70 
                                                   transform -translate-y-1/2 animate-ping-slow"></div>
                                </div>
                                
                                {/* iOS-style slide-up messaging container */}
                                <div className="ios-slide-container relative overflow-hidden h-7 rounded-full bg-white/5 px-4 py-1.5 backdrop-blur-sm">
                                    {/* First message */}
                                    <p className="text-white/60 text-xs text-center absolute inset-0 flex items-center justify-center transform
                                               transition-transform duration-500 translate-y-0 group-hover:-translate-y-7">
                                        Experience the full story in the prologue chapter
                                    </p>
                                    
                                    {/* Second message that appears on hover */}
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
            
            {/* iOS-style CSS animations */}
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
                
                @keyframes width-expand {
                    0% { width: 0; opacity: 0; }
                    100% { width: 16rem; opacity: 1; }
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
                
                .animate-width-expand {
                    animation: width-expand 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
                    animation-delay: 1s;
                }
                
                /* iOS-style effects */
                .ios-card {
                    transform: translateZ(0);
                    -webkit-font-smoothing: subpixel-antialiased;
                }
                
                .ios-feature-card:hover {
                    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1), 
                                0 5px 15px rgba(237, 255, 102, 0.07);
                    transform: translateY(-2px);
                }
                
                .ios-stat-card:hover {
                    background-color: rgba(255, 255, 255, 0.08);
                    transform: scale(1.02);
                    transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
                }
                
                .ios-button:active {
                    transform: scale(0.98);
                    transition: transform 0.1s cubic-bezier(0.2, 0.8, 0.2, 1);
                }
                
                .ios-tag {
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
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