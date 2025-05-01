import React, { useRef, useEffect, useState } from 'react';
import AnimatedTitle from './AnimatedTitle';
import { gsap } from 'gsap';
import RoundedCorners from './RoundedConers';
import BentoTilt from './BentoTilt'; 
import Button from './Button';
import { FaArrowRight, FaCompass } from "react-icons/fa";
import { BsShieldCheck, BsStars, BsInfinity } from "react-icons/bs"; 
import entranceImageSrc from '/img/entrance.webp'; 

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
        //delay for image load
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 300);
        
        return () => {
            clearTimeout(timer);
        };
    }, []);

    useEffect(() => {
        if (isLoaded && contentRef.current) {
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
            
            const headingElements = document.querySelectorAll('.animated-heading');
            headingElements.forEach(heading => {
                const text = heading.textContent;
                heading.textContent = '';
                
                [...text].forEach((char, i) => {
                    const span = document.createElement('span');
                    span.textContent = char;
                    span.style.opacity = '0';
                    span.style.display = 'inline-block';
                    span.style.transform = 'translateY(20px) rotateX(45deg)';
                    span.style.transformOrigin = 'center bottom';
                    heading.appendChild(span);

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

            initParticles();
            
            // hover effect 
            featuresRef.current.forEach((card, i) => {
                const iconWrapper = card.querySelector('.feature-icon-wrapper');
                const icon = card.querySelector('.feature-icon');
                const cardTitle = card.querySelector('.feature-title');

                gsap.to(card, {
                    y: -2,
                    duration: 2,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                    delay: i * 0.3,
                });

                card.addEventListener('mouseenter', () => {
                    gsap.to(card, {
                        y: -6, 
                        scale: 1.02, 
                        boxShadow: '0 18px 35px rgba(237, 255, 102, 0.25)', 
                        backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                        duration: 0.2, 
                        ease: 'back.out(2)' 
                    });
                    if (iconWrapper) {
                        gsap.to(iconWrapper, {
                            scale: 1.15,
                            rotate: -5, 
                            boxShadow: '0 6px 15px rgba(237, 255, 102, 0.2)',
                            duration: 0.15, 
                            ease: 'back.out(2)'
                        });
                    }
                     if (icon) { 
                        gsap.to(icon, {
                            scale: 1.1,
                            rotate: 10,
                            duration: 0.15, 
                            ease: 'power2.out'
                        });
                    }
                    if (cardTitle) {
                        gsap.to(cardTitle, {
                            scale: 1.05,
                            color: '#f0ff8f', 
                            duration: 0.15, 
                            ease: 'power2.out'
                        });
                    }
                });

                card.addEventListener('mouseleave', () => {
                    gsap.to(card, {
                        y: -2,
                        scale: 1,
                        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)', 
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        duration: 0.2, 
                        ease: 'back.out(1.5)'
                    });
                     if (iconWrapper) {
                        gsap.to(iconWrapper, {
                            scale: 1,
                            rotate: 0,
                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                            duration: 0.15,
                            ease: 'back.out(1.5)'
                        });
                    }
                    if (icon) { // Reset icon animation
                        gsap.to(icon, {
                            scale: 1,
                            rotate: 0,
                            duration: 0.15, 
                            ease: 'power2.out'
                        });
                    }
                    if (cardTitle) {
                        gsap.to(cardTitle, {
                            scale: 1,
                            color: '#edff66', 
                            duration: 0.15, 
                            ease: 'power2.out'
                        });
                    }
                });
            });
            
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
            
            animateCardBackground();
            
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
            
            const exclusiveUniverseTag = document.querySelector('.ios-tag.exclusive-universe');
            if (exclusiveUniverseTag) {

                gsap.to(exclusiveUniverseTag.querySelector('.auto-shine'), {
                    x: '300%', 
                    duration: 3,
                    repeat: -1,
                    repeatDelay: 2.5,
                    ease: 'power2.inOut',
                    delay: 1
                });
                
                gsap.to(exclusiveUniverseTag, {
                    boxShadow: '0 2px 15px rgba(120,80,220,0.4)',
                    duration: 2,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut'
                });
            }
            
            const convergeWordElement = document.querySelector('.converge-word');
            if (convergeWordElement) {
                const chars = convergeWordElement.querySelectorAll('.converge-char');
                
                gsap.to(chars, {
                    backgroundPosition: '200% center',
                    stagger: {
                        each: 0.2,
                        repeat: -1,
                        repeatDelay: 3
                    },
                    duration: 1.5,
                    ease: 'power1.out',
                    delay: 2
                });
            }
        }
    }, [isLoaded]);
    
    const initParticles = () => {
        if (!leftCardRef.current) return;
        
        const particlesContainer = document.querySelector('.particles-container');
        if (!particlesContainer) return;

        particlesContainer.innerHTML = '';
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'absolute rounded-full bg-white/20 pointer-events-none';
            
            const size = Math.random() * 4 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;

            const x = Math.random() * 100;
            const y = Math.random() * 100;
            particle.style.left = `${x}%`;
            particle.style.top = `${y}%`;
            
            particlesContainer.appendChild(particle);
            
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

    useEffect(() => {
        if (!buttonWrapperRef.current) return;

        const buttonWrapper = buttonWrapperRef.current;
        const gradientOverlay = buttonWrapper.querySelector('.button-gradient-overlay'); // Target the overlay

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
                backgroundColor: "rgba(237, 255, 102, 1)",
                scale: 1.02,
                duration: 0.3,
                ease: "back.out(1.2)",
                boxShadow: "0 8px 20px rgba(237, 255, 102, 0.3)"
            });
            // Make gradient overlay slightly less opaque on hover to avoid darkening
            if (gradientOverlay) {
                gsap.to(gradientOverlay, { opacity: 0.85, duration: 0.3 });
            }
        };

        const onMouseLeave = () => {
            if (buttonIconRef.current) {
                gsap.to(buttonIconRef.current, {
                    x: 0,
                    scale: 1,
                    duration: 0.3,
                    ease: "back.out(1)",
                    color: "#000"
                });
            }
            gsap.to(buttonWrapper, {
                backgroundColor: "rgba(237, 255, 102, 0.95)",
                scale: 1,
                duration: 0.3,
                ease: "back.out(1)",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)"
            });
             // Reset gradient overlay opacity
            if (gradientOverlay) {
                gsap.to(gradientOverlay, { opacity: 0, duration: 0.3 });
            }
        };

        buttonWrapper.addEventListener("mouseenter", onMouseEnter);
        buttonWrapper.addEventListener("mouseleave", onMouseLeave);

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
        if (buttonIconRef.current) {
            gsap.timeline()
                .to(buttonIconRef.current, {
                    x: 5, 
                    scale: 0.8,
                    duration: 0.08, 
                    ease: "power2.in"
                })
                .to(buttonIconRef.current, {
                    x: 15,
                    scale: 1.2, 
                    duration: 0.3,
                    ease: "elastic.out(1.2, 0.5)" 
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
                    duration: 0.08, 
                    ease: "power2.in"
                })
                .to(buttonWrapperRef.current, {
                    scale: 1.03,
                    duration: 0.2,
                    ease: "elastic.out(1, 0.3)" 
                })
                .to(buttonWrapperRef.current, {
                    scale: 1,
                    duration: 0.2,
                    ease: "power1.out"
                });
        }
        
        console.log("Navigate to prologue page (from Story component)...");
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
                                    src={entranceImageSrc} // Use the imported image source
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

                <div 
                    ref={contentRef}
                    className="w-full px-4 md:px-8 lg:px-12 xl:px-16 -mt-52 sm:-mt-40 md:-mt-36 lg:-mt-48"
                >
                    <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 lg:gap-12">
                        
                        {/* Left content card - ZENTRY WORLD*/}
                        <div 
                            ref={leftCardRef}
                            className="md:col-span-6 lg:col-span-6 xl:col-span-7"
                        >
                            <div className="ios-card bg-black/30 backdrop-blur-xl rounded-3xl p-6 md:p-8 lg:p-10
                                shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative overflow-hidden group
                                hover:shadow-[0_10px_40px_rgb(76,29,149,0.15)] transition-all duration-500
                                border border-white/5 perspective-1000">
                                
                                <div className="absolute inset-0 border border-white/10 rounded-3xl opacity-30 pointer-events-none"></div>
                                
                                <div className="absolute inset-x-4 top-0 h-[1px] bg-white/20"></div>

                                <div className="glow-orb-1 absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 blur-3xl rounded-full opacity-60"></div>
                                <div className="glow-orb-2 absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/20 blur-3xl rounded-full opacity-60"></div>

                                <div className="background-pattern absolute inset-0 opacity-5 mix-blend-overlay pointer-events-none"
                                     style={{
                                        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM36 4V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                                        backgroundSize: '200px 200px'
                                     }}></div>

                                <div className="particles-container absolute inset-0 overflow-hidden pointer-events-none"></div>

                                <div className="absolute inset-0 rounded-3xl opacity-50 pointer-events-none"
                                     style={{
                                         boxShadow: 'inset 0 0 40px rgba(120, 80, 220, 0.3)'
                                     }}></div>
                                
                               
                                <div className="flex items-center justify-between mb-12 relative z-10">
                                    <div className="relative">
                                        <h2 className="animated-heading text-3xl md:text-4xl lg:text-5xl font-black font-zentry text-white
                                                    tracking-tight">
                                            Zentry<span className="text-yellow-300">World</span>
                                        </h2>
                                        <div className="h-1.5 w-24 bg-gradient-to-r from-yellow-300 to-yellow-100 rounded-full mt-3
                                                    animate-width-expand"></div>
                                    </div>
                                    
                                    <div className="ios-tag exclusive-universe inline-flex px-4 py-2 bg-gradient-to-r from-indigo-600/90 to-purple-600/90
                                        rounded-full text-xs font-bold text-white uppercase tracking-wider
                                        shadow-[0_2px_10px_rgba(120,80,220,0.3)] backdrop-blur-sm
                                        relative overflow-hidden group/tag">
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/5 to-purple-400/5 opacity-0
                                                    group-hover/tag:opacity-100 transition-opacity duration-700"></div>
                                        <span className="mix-blend-plus-lighter relative z-10 flex items-center">
                                            <BsShieldCheck className="mr-1.5" />
                                            <span>Exclusive Universe</span>
                                        </span>

                                        <div className="auto-shine absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent
                                                    pointer-events-none"></div>
                                        
                                        <div className="absolute inset-0 rounded-full bg-indigo-400/10 opacity-0 animate-pulse-slow"></div>
                                    </div>
                                </div>
                                
                                <div className="ios-message perspective-1000 my-8 relative z-10">
                                    <p className="text-xl md:text-2xl leading-relaxed text-white/90 transform transition-all duration-300
                                                group-hover:scale-[1.02] group-hover:text-white">
                                        Where dimensions <span className="relative inline-block font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-purple-400 to-purple-300
                                                             animate-gradient-x">
                                            converge
                                        </span>, explorers discover Zentry—a nexus of boundless realms and infinite possibility.
                                    </p>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 relative z-10">
                                    <div
                                        ref={el => featuresRef.current[0] = el}
                                        className="ios-feature-card bg-white/5 rounded-2xl p-5 backdrop-blur-sm transform transition-all duration-200
                                                 border border-white/5 hover:border-white/10 shadow-lg relative overflow-hidden"
                                    >
                                        <div className="flex items-start mb-3"> 
                                            <div className="feature-icon-wrapper mr-4 flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-tr from-yellow-300/30 to-amber-500/20 flex items-center justify-center
                                                        shadow-md transition-all duration-500 group-hover:scale-110 group-hover:shadow-yellow-300/20"> {/* Adjusted shadow */}
                                                <BsStars className="feature-icon text-yellow-300 text-xl transition-transform duration-300" /> {/* Modern Icon */}
                                            </div>
                                            <div> 
                                                <h3 className="feature-title text-lg font-medium text-yellow-300 mb-1">Ancient Secrets</h3> {/* Added mb-1 */}
                                                <p className="text-white/80 text-sm">Uncover hidden knowledge and forgotten technologies across the boundless pillar.</p> {/* Adjusted text size */}
                                            </div>
                                        </div>
                                        
                                        <div className="absolute -bottom-1 -right-1 w-10 h-10 opacity-20 group-hover:opacity-40 transition-opacity">
                                            <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-yellow-300/50 rounded-br group-hover:border-yellow-300/80 transition-colors"></div>
                                        </div>
                                    </div>

                                    
                                    <div
                                        ref={el => featuresRef.current[1] = el}
                                        className="ios-feature-card bg-white/5 rounded-2xl p-5 backdrop-blur-sm transform transition-all duration-200
                                                 border border-white/5 hover:border-white/10 shadow-lg relative overflow-hidden"
                                    >
                                        <div className="flex items-start mb-3"> 
                                             <div className="feature-icon-wrapper mr-4 flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-tr from-yellow-300/30 to-amber-500/20 flex items-center justify-center
                                                        shadow-md transition-all duration-500 group-hover:scale-110 group-hover:shadow-yellow-300/20"> {/* Adjusted shadow */}
                                                <BsInfinity className="feature-icon text-yellow-300 text-xl transition-transform duration-300" /> {/* Modern Icon */}
                                            </div>
                                             <div> 
                                                <h3 className="feature-title text-lg font-medium text-yellow-300 mb-1">Infinite Realms</h3> {/* Added mb-1 */}
                                                <p className="text-white/80 text-sm">Shape your destiny across countless dimensions, each with unique rules and opportunities.</p> {/* Adjusted text size */}
                                            </div>
                                        </div>
                                        
                                        <div className="absolute -bottom-1 -right-1 w-10 h-10 opacity-20 group-hover:opacity-40 transition-opacity">
                                            <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-yellow-300/50 rounded-br group-hover:border-yellow-300/80 transition-colors"></div>
                                        </div>
                                    </div>
                                </div>
                                
                            
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 relative z-10">
                                    <div className="ios-stat-card p-3 bg-white/5 rounded-xl backdrop-blur-sm transition-all duration-300 group/stat"> {/* Added group/stat */}
                                        <p className="text-white/60 text-xs uppercase tracking-wider font-medium mb-1">Worlds</p> {/* Added mb-1 */}
                                        <div className="flex items-baseline">
                                            <h4 className="text-xl md:text-2xl font-zentry text-white/90 transition-colors duration-300 group-hover/stat:text-white">
                                                <span className="counter" data-count="104">104</span>
                                            </h4>
                                            <span className="text-yellow-300 text-sm ml-1 transition-transform duration-300 group-hover/stat:scale-110">+</span>
                                        </div>
                                    </div>
                                    
                                    <div className="ios-stat-card p-3 bg-white/5 rounded-xl backdrop-blur-sm transition-all duration-300 group/stat"> {/* Added group/stat */}
                                        <p className="text-white/60 text-xs uppercase tracking-wider font-medium mb-1">Explorers</p> {/* Added mb-1 */}
                                        <div className="flex items-baseline">
                                            <h4 className="text-xl md:text-2xl font-zentry text-white/90 transition-colors duration-300 group-hover/stat:text-white">
                                                <span className="counter" data-count="25">25</span>
                                            </h4>
                                            <span className="text-yellow-300 text-sm ml-1 transition-transform duration-300 group-hover/stat:scale-110">K+</span>
                                        </div>
                                    </div>
                                    
                                    <div className="hidden md:block ios-stat-card p-3 bg-white/5 rounded-xl backdrop-blur-sm transition-all duration-300 group/stat"> {/* Added group/stat */}
                                        <p className="text-white/60 text-xs uppercase tracking-wider font-medium mb-1">Artifacts</p> {/* Added mb-1 */}
                                        <div className="flex items-baseline">
                                            <h4 className="text-xl md:text-2xl font-zentry text-white/90 transition-colors duration-300 group-hover/stat:text-white">
                                                <span className="counter" data-count="376">376</span>
                                            </h4>
                                            <span className="text-yellow-300 text-sm ml-1 transition-transform duration-300 group-hover/stat:scale-110">+</span>
                                        </div>
                                    </div>
                                </div>
                                
                            
                                <div className="h-px w-full mb-6 bg-gradient-to-r from-transparent via-white/20 to-transparent gradient-divider relative z-10"></div>
                                
                             
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
                        
                        
                        <div 
                            ref={rightCardRef}
                            className="md:col-span-6 lg:col-span-6 xl:col-span-5 md:self-start"
                        >
                            <div className="ios-card bg-black/40 backdrop-blur-xl rounded-3xl p-6 md:p-8 lg:p-10
                                shadow-[0_8px_30px_rgb(0,0,0,0.15)] relative overflow-hidden group
                                hover:shadow-[0_10px_40px_rgb(237,255,102,0.15)] transition-all duration-500
                                border border-white/5 transform perspective-1000">
                                
                              
                                <div className="absolute inset-0 border border-white/10 rounded-3xl opacity-30 pointer-events-none"></div>
                                
                               
                                <div className="absolute inset-x-4 top-0 h-[1px] bg-white/20"></div>
                                
                                
                                <div className="absolute inset-0 overflow-hidden">
                                    
                                    <div className="absolute top-[30%] right-[10%] w-48 h-48 rotate-45 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-2xl"></div>
                                    <div className="absolute bottom-[20%] left-[20%] w-60 h-60 rotate-12 border border-white/5 rounded-full"></div>
                                    
                                    
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-black/0 to-purple-900/10 opacity-100
                                                group-hover:opacity-80 transition-opacity duration-1000 ease-out"></div>
                                </div>
                                
                                
                                <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-300/10 blur-3xl rounded-full opacity-60
                                    group-hover:opacity-90 group-hover:w-96 group-hover:h-96 transition-all duration-700"></div>
                                
                                
                                <div className="flex items-center justify-between mb-10">
                                    <div className="flex items-center">
                                        <div className="mr-4 w-12 h-12 rounded-xl bg-gradient-to-tr from-yellow-300/30 to-amber-500/20 flex items-center justify-center
                                                     shadow-sm transform transition-transform duration-500 group-hover:rotate-12">
                                            <FaCompass className="text-yellow-300 text-xl" />
                                        </div>
                                        <div className="min-w-0 flex-shrink">
                                            <h3 className="animated-heading text-xl md:text-2xl lg:text-3xl font-semibold text-white tracking-tight whitespace-nowrap">Begin Your Adventure</h3>
                                            <div className="h-1.5 w-16 bg-gradient-to-r from-yellow-300 to-yellow-200 rounded-full mt-2 transform origin-left transition-all duration-500 group-hover:scale-x-125"></div>
                                        </div>
                                    </div>
                                    
                                    
                                    <div className="ios-badge px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 backdrop-blur-sm
                                                  rounded-full border border-white/10 transform transition-transform duration-300 
                                                  hover:scale-105 hover:border-white/20">
                                        <p className="text-white/90 text-xs uppercase tracking-wider font-medium">New</p>
                                    </div>
                                </div>
                                
                              
                                <div className="ios-message-bubble relative mb-10 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-5 md:p-6
                                              border-l-2 border-yellow-300/50 backdrop-blur-sm">
                                    
                                    <div className="absolute -top-1.5 -right-1.5 w-6 h-6">
                                        <div className="absolute top-0 right-0 w-3 h-6 border-t-2 border-r-2 border-yellow-300/30 rounded-tr-lg"></div>
                                    </div>
                                    
                                    
                                    <div className="flex">
                                        <div className="mt-1 mr-4 min-w-[0.25rem] h-20 bg-gradient-to-b from-yellow-300/70 via-yellow-200/40 to-yellow-300/10 rounded-full"></div>
                                        <div>
                                            <p className="typewriter-text text-white/90 text-lg font-medium mb-3">
                                                Start your journey through the infinite worlds of Zentry.
                                            </p>
                                            <p className="typewriter-text text-white/70 text-base">
                                                Discover secrets and shape your fate among countless possibilities.
                                            </p>
                                        </div>
                                    </div>
                                    
                                    
                                    <div className="h-5 w-[2px] bg-yellow-300 absolute right-6 bottom-5 animate-blink"></div>
                                    
                                   
                                    <div className="absolute -bottom-1.5 -left-1.5 w-6 h-6">
                                        <div className="absolute bottom-0 left-0 w-6 h-3 border-l-2 border-b-2 border-yellow-300/30 rounded-bl-lg"></div>
                                    </div>
                                </div>
                                
                                
                                <div className="ios-access-level flex items-center justify-between mb-10">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-3.5 h-3.5 bg-gradient-to-r from-yellow-300 to-amber-400 rounded-full 
                                                         shadow-glow-sm animate-pulse-slow"></div>
                                            <div className="w-2 h-2 bg-yellow-300/60 rounded-full"></div>
                                            <div className="w-2 h-2 bg-yellow-300/40 rounded-full"></div>
                                        </div>
                                        <p className="text-white/70 text-sm tracking-wider font-medium">ACCESS GRANTED</p>
                                    </div>
                                    
                                    <div className="ios-tag px-3.5 py-2 bg-gradient-to-r from-yellow-300/20 to-amber-500/20 backdrop-blur-sm
                                                  rounded-md border border-yellow-300/20 transition-all duration-300 
                                                  group-hover:border-yellow-300/40 group-hover:shadow-glow-xs">
                                        <p className="text-yellow-300 text-sm font-bold">EXPLORER</p>
                                    </div>
                                </div>
                                
                                
                                <div 
                                    ref={buttonWrapperRef} 
                                    className="ios-button relative rounded-full overflow-hidden shadow-md mb-6"
                                    style={{
                                        backgroundColor: "rgba(237, 255, 102, 0.95)",
                                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)"
                                    }}
                                >
                                   
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
                                                 bg-gradient-to-r from-yellow-200/30 via-transparent to-yellow-100/30 
                                                 blur-md"></div>
                                                 
                                    
                                    <div className="absolute inset-0 rounded-full border-2 border-yellow-300/30 
                                                  scale-[1.15] opacity-0 group-hover:opacity-100 group-hover:scale-[1.25]
                                                  transition-all duration-1000 ease-out"></div>

                                    
                                    <div className="button-gradient-overlay absolute inset-0 bg-gradient-to-r from-yellow-300/80 via-yellow-100/90 to-yellow-300/80
                                         opacity-0 transition-opacity duration-300 pointer-events-none"></div>

                                    
                                    <div className="absolute inset-x-0 top-0 h-[1px] bg-white/30"></div>
                                    
                                   
                                    <Button
                                        id="prologue-btn"
                                        title="discover prologue"
                                        rightIcon={
                                            <span ref={buttonIconRef} className="relative flex items-center justify-center">
                                                <FaArrowRight size={20} className="text-black z-20" />
                                               
                                                <span className="absolute w-8 h-8 bg-white/20 rounded-full -z-10 
                                                               scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100
                                                               transition-all duration-300 ease-out"></span>
                                            </span>
                                        }
                                        containerClass="w-full !bg-transparent font-bold text-black flex items-center 
                                                     justify-center gap-3 px-8 py-5 font-medium text-base md:text-lg relative z-10"
                                        onClick={handleDiscoverClick}
                                    />
                                    
                                   
                                    <div className="absolute right-7 top-1/2 w-2 h-2 rounded-full bg-black/70 
                                                   transform -translate-y-1/2 animate-ping-slow"></div>
                                </div>
                                
                                
                                <div className="ios-slide-container relative overflow-hidden h-8 rounded-full bg-white/5 px-4 py-1.5 backdrop-blur-sm">
                                   
                                    <p className="text-white/60 text-sm text-center absolute inset-0 flex items-center justify-center transform
                                               transition-transform duration-500 translate-y-0 group-hover:-translate-y-8">
                                        Experience the full story in the prologue chapter
                                    </p>
                                    
                                 
                                    <p className="text-white/80 text-sm text-center absolute inset-0 flex items-center justify-center transform
                                               transition-transform duration-500 translate-y-8 group-hover:translate-y-0">
                                        <span className="text-yellow-300 font-medium mr-1">New:</span> Interactive journeys available
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </section>
    );
};

export default Story;