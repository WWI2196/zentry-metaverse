import React, { useEffect, useRef, useState } from 'react';
import { GiClick } from "react-icons/gi";
import { FaPlayCircle } from "react-icons/fa";
import Button from './Button';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const Hero = () => {
    const [currentIndex, setCurrentIndex] = useState(1);
    const [isAnimating, setIsAnimating] = useState(false);

    const totalVideos = 4;
    const nextVideoRef = useRef(null);
    const previewVideoRef = useRef(null);
    const previewContainerRef = useRef(null);
    const mainVideoRef = useRef(null);

    // Calculate upcoming video index
    const upcomingVideoIndex = (currentIndex % totalVideos) + 1;
    const getVideoSrc = (index) => `videos/hero-${index}.mp4`;

    const nextVideoInitialStyles = {
        top: '1.5rem',
        right: '1.5rem',
        width: '5rem', 
        height: '5rem',
        borderRadius: '9999px',
        visibility: 'hidden',
        scale: 1,
        zIndex: 20,
    };

    // Click handler that only triggers animation when user clicks
    const handleMiniVdClick = () => {
        if (isAnimating) return;
        setIsAnimating(true);
    };

    // Initial setup - run once on mount
    useEffect(() => {
        if (previewContainerRef.current) {
            gsap.to(previewContainerRef.current, { 
                autoAlpha: 1, 
                scale: 1, 
                duration: 0.7, 
                ease: 'power2.out', 
                delay: 0.5 
            });
        }

        if (previewVideoRef.current) {
            previewVideoRef.current.src = getVideoSrc(upcomingVideoIndex);
            previewVideoRef.current.load();
            previewVideoRef.current.play().catch(e => console.error("Initial preview video play failed:", e));
        }

        if (mainVideoRef.current) {
            mainVideoRef.current.play().catch(e => console.error("Initial BG video play failed", e));
        }
    }, []);

    // Animation timeline - ONLY runs when isAnimating is true (user clicked)
    useGSAP(() => {
        if (!isAnimating) return;

        const nextVideoElement = nextVideoRef.current;
        const mainVideoElement = mainVideoRef.current;

        if (!nextVideoElement || !mainVideoElement) {
            setIsAnimating(false);
            return;
        }

        const targetIndex = upcomingVideoIndex;

        nextVideoElement.src = getVideoSrc(targetIndex);
        nextVideoElement.load();
        
        gsap.set(nextVideoElement, { 
            visibility: "visible", 
            scale: 1, 
            opacity: 1
        });

        if (previewContainerRef.current) {
            gsap.to(previewContainerRef.current, { autoAlpha: 0, duration: 0.3 });
        }
        
        nextVideoElement.play().catch(e => console.error("Transition video play failed:", e));

        const tl = gsap.timeline({
            onComplete: () => {
                mainVideoElement.src = getVideoSrc(targetIndex);
                mainVideoElement.load();
                
                const overlayDiv = document.createElement('div');
                overlayDiv.className = 'absolute left-0 top-0 z-10 size-full bg-blue-75';
                
                if (nextVideoElement.parentNode) {
                    nextVideoElement.parentNode.appendChild(overlayDiv);
                }
                
                gsap.set(mainVideoElement, { opacity: 0 });
                
                const canPlayHandler = () => {
                    try {
                        mainVideoElement.currentTime = 3.0;
                        
                        gsap.to(mainVideoElement, { opacity: 1, duration: 0.8 });
                        gsap.to(nextVideoElement, { opacity: 0, duration: 0.8 });
                        gsap.to(overlayDiv, { 
                            opacity: 0, 
                            duration: 1.0, 
                            onComplete: () => {
                                mainVideoElement.play().catch(e => console.error("Main video play failed:", e));
                                
                                if (overlayDiv.parentNode) {
                                    overlayDiv.remove();
                                }
                                
                                setCurrentIndex(targetIndex);
                                
                                if (nextVideoRef.current) {
                                    gsap.set(nextVideoRef.current, { 
                                        ...nextVideoInitialStyles,
                                        visibility: 'hidden' 
                                    });
                                }
                                
                                // Clean up transition video state, but DO NOT make preview visible here
                                setTimeout(() => {
                                    if (nextVideoRef.current) {
                                        nextVideoRef.current.pause();
                                        nextVideoRef.current.src = "";
                                        nextVideoRef.current.load();
                                    }
                                    
                                    setIsAnimating(false);
                                }, 150); // Keep a short delay for cleanup
                            }
                        });
                    } catch (error) {
                        console.error("Error in video transition:", error);
                        mainVideoElement.play().catch(e => console.error("Fallback play failed:", e));
                        setIsAnimating(false);
                    }
                };
                
                mainVideoElement.addEventListener('canplay', canPlayHandler, { once: true });
            }
        });

        tl.to(nextVideoElement, {
            top: 0,
            right: 0,
            width: "100%",
            height: "100%",
            scale: 1,
            borderRadius: 0,
            duration: 1.2,
            ease: "power2.inOut",
        });

    }, { dependencies: [isAnimating] });

    useEffect(() => {
        if (!previewVideoRef.current || isAnimating) return; 
        
        const updateTimeout = setTimeout(() => {
            // Double check conditions inside timeout
            if (isAnimating || !previewVideoRef.current) return; 
            
            // Update the preview video source
            previewVideoRef.current.src = getVideoSrc(upcomingVideoIndex);
            previewVideoRef.current.load();
            previewVideoRef.current.play()
                .catch(e => console.error("Preview video play failed:", e));

            // Make preview container visible AFTER updating the source
            if (previewContainerRef.current) {
                gsap.to(previewContainerRef.current, { 
                    autoAlpha: 1, 
                    scale: 1, 
                    duration: 0.5, // Can adjust duration as needed
                    ease: 'power2.out'
                });
            }
        }, 300); // Keep the delay or adjust as needed

        return () => clearTimeout(updateTimeout);
    }, [currentIndex, upcomingVideoIndex, isAnimating]);

    return (
        <div className='relative h-dvh w-screen overflow-x-hidden'>
            <div id='video-frame' className='relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75'>
                {/* Main Background Video */}
                <video
                    ref={mainVideoRef}
                    src={getVideoSrc(currentIndex)}
                    autoPlay loop muted playsInline
                    className='absolute left-0 top-0 z-0 size-full object-cover object-center'
                />

                {/* Preview Video Container */}
                <div
                    ref={previewContainerRef}
                    onClick={handleMiniVdClick}
                    style={{ visibility: 'hidden', scale: 0.9, opacity: 0 }}
                    className='group absolute top-4 right-4 sm:top-6 sm:right-6 z-50 flex items-center justify-center
                               size-20 sm:size-24 md:size-28 
                               cursor-pointer overflow-hidden rounded-full bg-black/30 backdrop-blur-sm
                               shadow-lg transition-all duration-300 ease-out hover:shadow-xl hover:bg-black/50
                               hover:ring-2 hover:ring-yellow-300 hover:ring-opacity-80'
                >
                    {/* Preview Video Element */}
                    <video
                        ref={previewVideoRef}
                        loop muted playsInline
                        className='absolute inset-0 size-full origin-center rounded-full object-cover object-center 
                                 transition-transform duration-300 ease-out group-hover:scale-105'
                    />
                    {/* Play Icon Overlay */}
                    <div className='absolute z-10 text-white/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                        <FaPlayCircle size={40} className='drop-shadow-md' />
                    </div>
                </div>

                {/* Hidden Video Element for Transition Animation */}
                <video 
                    ref={nextVideoRef}
                    loop muted playsInline
                    className='absolute object-cover object-center'
                    style={nextVideoInitialStyles}
                />

                {/* Text & Button Overlays */}
                <h1 className='special-font hero-heading absolute bottom-5 right-5 z-40 text-blue-75'>
                    <b>Gaming</b>
                </h1>
                <div className='absolute left-0 top-0 z-40 size-full'>
                    <div className='mt-24 px-5 sm:px-10'>
                        <h1 className='special-font hero-heading text-blue-100'>
                            <b>redifine</b>
                        </h1>
                        <p className='mb-5 max-w-64 font-robert-regular text-blue-100'>
                            Enter the Metagame Layer <b />
                            <br />
                            Unleash the Play Economy
                        </p>
                        <Button
                            id='watch-trailer'
                            title='Watch Trailer'
                            leftIcon={<GiClick size={20} />}
                            containerClass='!bg-yellow-300 flex items-center justify-center gap-2 px-10 py-4 text-sm'
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;