import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GiClick } from "react-icons/gi";
import { FaPlayCircle } from "react-icons/fa";
import Button from './Button';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger'; // Import ScrollTrigger

gsap.registerPlugin(ScrollTrigger); // Register ScrollTrigger plugin

const Hero = () => {
    const [currentIndex, setCurrentIndex] = useState(1);
    const [isAnimating, setIsAnimating] = useState(false);
    const [loading, setLoading] = useState(true); // Define loading state, initially true

    const totalVideos = 4;
    const nextVideoRef = useRef(null);
    const previewVideoRef = useRef(null);
    const previewContainerRef = useRef(null);
    const mainVideoRef = useRef(null);

    // Calculate upcoming video index
    const upcomingVideoIndex = (currentIndex % totalVideos) + 1;
    const getVideoSrc = useCallback((index) => `videos/hero-${index}.mp4`, []);

    const nextVideoInitialStyles = {
        top: '6rem', // Adjusted back as per original code before refactoring
        right: '1.5rem',
        width: '4rem',
        height: '4rem',
        borderRadius: '9999px',
        visibility: 'hidden',
        scale: 1,
        zIndex: 20,
    };

    // Click handler that only triggers animation when user clicks
    const handleMiniVdClick = () => {
        if (isAnimating || loading) return; // Prevent click during animation or initial load
        setIsAnimating(true);
    };

    // Initial setup - run once on mount
    useEffect(() => {
        const mainVid = mainVideoRef.current;
        const previewVid = previewVideoRef.current;
        const previewCont = previewContainerRef.current;

        if (previewCont) {
            gsap.to(previewCont, { 
                autoAlpha: 1, 
                scale: 1, 
                duration: 0.7, 
                ease: 'power2.out', 
                delay: 0.5 
            });
        }

        if (previewVid) {
            previewVid.src = getVideoSrc(upcomingVideoIndex);
            previewVid.load();
            // Muted loop for preview
            previewVid.muted = true; 
            previewVid.loop = true;
            previewVid.play().catch(e => console.error("Initial preview video play failed:", e));
        }

        if (mainVid) {
            const handleCanPlay = () => {
                mainVid.play().catch(e => console.error("Initial BG video play failed", e));
                setLoading(false); // Set loading to false when video can play
            };
            mainVid.addEventListener('canplay', handleCanPlay, { once: true });
            // Load the initial video
            mainVid.src = getVideoSrc(currentIndex);
            mainVid.load();

            // Cleanup function
            return () => {
                mainVid.removeEventListener('canplay', handleCanPlay);
            };
        } else {
            // If no main video ref, stop loading immediately
            setLoading(false);
        }
    }, [getVideoSrc, upcomingVideoIndex, currentIndex]); // Added currentIndex dependency

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
                // Use theme color variable if defined, otherwise fallback
                overlayDiv.className = 'absolute left-0 top-0 z-10 size-full bg-blue-75'; 
                
                if (nextVideoElement.parentNode) {
                    nextVideoElement.parentNode.appendChild(overlayDiv);
                }
                
                gsap.set(mainVideoElement, { opacity: 0 });
                
                const canPlayHandler = () => {
                    try {
                        // Optional: Adjust start time if needed
                        // mainVideoElement.currentTime = 3.0; 
                        
                        gsap.to(mainVideoElement, { opacity: 1, duration: 0.8 });
                        gsap.to(nextVideoElement, { opacity: 0, duration: 0.8 });
                        gsap.to(overlayDiv, { 
                            opacity: 0, 
                            duration: 1.0, 
                            onComplete: () => {
                                mainVideoElement.play().catch(e => console.error("Main video play after transition failed:", e));
                                
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
                                
                                // Short delay before resetting animation state and cleaning up
                                setTimeout(() => {
                                    if (nextVideoRef.current) {
                                        nextVideoRef.current.pause();
                                        nextVideoRef.current.src = ""; // Clear src
                                        nextVideoRef.current.load(); // Reset
                                    }
                                    setIsAnimating(false);
                                    // Restore preview container visibility after animation
                                    if (previewContainerRef.current) {
                                        gsap.to(previewContainerRef.current, { 
                                            autoAlpha: 1, 
                                            scale: 1, 
                                            duration: 0.5, 
                                            ease: 'power2.out'
                                        });
                                    }
                                }, 150); 
                            }
                        });
                    } catch (error) {
                        console.error("Error in video transition:", error);
                        // Fallback: ensure main video plays and reset state
                        mainVideoElement.style.opacity = '1'; // Force visible
                        mainVideoElement.play().catch(e => console.error("Fallback play failed:", e));
                        if (overlayDiv.parentNode) overlayDiv.remove();
                        if (nextVideoRef.current) gsap.set(nextVideoRef.current, { opacity: 0, visibility: 'hidden' });
                        setCurrentIndex(targetIndex); // Still update index on error
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

    }, { dependencies: [isAnimating, upcomingVideoIndex, getVideoSrc] }); // Added dependencies

    // Scroll-based animation for the video frame shape
    useGSAP(() => {
        gsap.set('#video-frame', {
                clipPath: 'polygon(14% 0%, 72% 0%, 90% 90%, 0 100%)',
                borderRadius: '0 0 40% 10%'
        })

        gsap.from('#video-frame', {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0 100%)',
            borderRadius: '0 0 0 0',
            ease: 'power1.out',
            scrollTrigger: {
                trigger: '#video-frame', // Trigger based on the video frame itself
                start: 'top top', // Start animation when the top of the frame hits the top of the viewport
                end: 'bottom top', // End animation when the bottom of the frame hits the top of the viewport
                scrub: true, // Smooth scrubbing effect
            },
        });
    }, []); // Runs once on mount

    // Update preview video source when currentIndex changes AND animation is NOT running
    useEffect(() => {
        if (!previewVideoRef.current || isAnimating || loading) return; // Also check loading state
        
        const updateTimeout = setTimeout(() => {
            // Double check conditions before updating src
            if (isAnimating || loading || !previewVideoRef.current) return; 
            
            previewVideoRef.current.src = getVideoSrc(upcomingVideoIndex);
            previewVideoRef.current.load();
            previewVideoRef.current.play().catch(e => console.error("Preview video update play failed:", e)); // Ensure it plays

            // Ensure preview container is visible if it was hidden during animation
            if (previewContainerRef.current && !isAnimating) {
                 gsap.to(previewContainerRef.current, { 
                     autoAlpha: 1, 
                     scale: 1, 
                     duration: 0.5, 
                     ease: 'power2.out'
                 });
            }
        }, 300); // Delay before updating

        return () => clearTimeout(updateTimeout);
    }, [currentIndex, upcomingVideoIndex, isAnimating, loading, getVideoSrc]); // Added loading and getVideoSrc

    return (
        <div className='relative h-dvh w-screen overflow-x-hidden'>
                
        {/* Loading Indicator */}
        {loading && (
        <div className="flex-center absolute left-0 top-0 z-[100] h-dvh w-screen overflow-hidden bg-blue-50"> {/* Use theme color */}
          <div className="three-body">
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
          </div>
        </div>
        )}

            {/* Video Frame Container */}
            <div id='video-frame' className='relative z-10 h-dvh w-screen overflow-hidden bg-blue-75'> {/* Use theme color */}
                {/* Main Background Video */}
                <video
                    ref={mainVideoRef}
                    // key added to force re-render on src change, might help with loading issues
                    key={`main-vid-${currentIndex}`} 
                    autoPlay loop muted playsInline
                    className='absolute left-0 top-0 z-0 size-full object-cover object-center'
                />

                {/* Preview Video Container */}
                <div
                    ref={previewContainerRef}
                    onClick={handleMiniVdClick}
                    // Initial style set here, GSAP controls autoAlpha later
                    style={{ visibility: 'hidden', scale: 0.9, opacity: 0 }} 
                    className='group absolute top-24 right-4 sm:right-6 z-50 flex items-center justify-center
                               size-16 sm:size-20 md:size-24 
                               cursor-pointer overflow-hidden rounded-full bg-black/30 backdrop-blur-sm
                               shadow-lg transition-all duration-300 ease-out hover:shadow-xl hover:bg-black/50
                               hover:ring-2 hover:ring-yellow-300 hover:ring-opacity-80' // Use theme color
                >
                    {/* Preview Video Element */}
                    <video
                        ref={previewVideoRef}
                        playsInline // Keep playsInline
                        // Muted and loop added here for clarity, already set in useEffect
                        muted 
                        loop 
                        className='absolute inset-0 size-full origin-center rounded-full object-cover object-center 
                                 transition-transform duration-300 ease-out group-hover:scale-105'
                    />
                    {/* Play Icon Overlay */}
                    <div className='absolute z-10 text-white/90 transition-opacity duration-300'>
                        <FaPlayCircle size={30} className='drop-shadow-md' /> 
                    </div>
                </div>

                {/* Hidden Video Element for Transition Animation */}
                <video 
                    ref={nextVideoRef}
                    loop muted playsInline
                    className='absolute object-cover object-center'
                    style={nextVideoInitialStyles} // Apply initial styles
                />

                {/* Text & Button Overlays */}
                <h1 className='special-font hero-heading absolute bottom-5 right-5 z-40 text-blue-75'> {/* Use theme color */}
                    <b>Gaming</b>
                </h1>
                <div className='absolute left-0 top-0 z-40 size-full'>
                    <div className='mt-24 px-5 sm:px-10'>
                        <h1 className='special-font hero-heading text-blue-100'> {/* Use theme color */}
                            <b>redifine</b>
                        </h1>
                        <p className='mb-5 max-w-64 font-robert-regular text-blue-100'> {/* Use theme color */}
                            Enter the Metagame Layer <b />
                            <br />
                            Unleash the Play Economy
                        </p>
                        <Button
                            id='watch-trailer'
                            title='Watch Trailer'
                            leftIcon={<GiClick size={20} />}
                            // Use theme color for button background
                            containerClass='!bg-yellow-300 flex items-center justify-center gap-2 px-10 py-4 text-sm' 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;