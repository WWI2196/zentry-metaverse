import React, { useEffect, useRef, useState } from 'react';
import { GiClick } from "react-icons/gi";
import { IoMdRefresh } from "react-icons/io";
import { FaPlayCircle } from "react-icons/fa";
import Button from './Button';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const Hero = () => {
    const [currentIndex, setCurrentIndex] = useState(1);
    const [isAnimating, setIsAnimating] = useState(false);
    const [loadedVideos, setLoadedVideos] = useState(0);

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
        
        console.log("Mini video clicked - starting animation");
        // Start the animation
        setIsAnimating(true);
    };

    const handleVideoLoad = () => {
        setLoadedVideos((prevCount) => prevCount + 1);
    };

    // Initial setup
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
            console.error("Video refs not available for animation start!");
            setIsAnimating(false); // Reset state if refs are missing
            return;
        }

        // Store the current upcoming index value that we're animating to
        const targetIndex = upcomingVideoIndex;
        console.log(`[Animation Start] Target Index: ${targetIndex}`);

        // Set up transition video from the upcoming source
        nextVideoElement.src = getVideoSrc(targetIndex);
        nextVideoElement.load();
        
        // --- Make it visible AND reset opacity before starting ---
        gsap.set(nextVideoElement, { 
            visibility: "visible", 
            scale: 1, 
            opacity: 1 // Explicitly reset opacity to 1
        });
        console.log("[Animation Start] nextVideoElement visibility and opacity reset.");

        // Hide the preview container immediately
        if (previewContainerRef.current) {
            gsap.to(previewContainerRef.current, { autoAlpha: 0, duration: 0.3 });
        }
        
        const playPromise = nextVideoElement.play();
        if (playPromise !== undefined) {
            playPromise.catch(e => console.error("Transition video play failed:", e));
        } else {
            console.warn("nextVideoElement.play() did not return a promise.");
        }

        const tl = gsap.timeline({
            onComplete: () => {
                console.log("[Animation Timeline] Zoom animation part complete.");
                // Get the current time of the transition video to sync with main video later
                const transitionVideoTime = nextVideoElement.currentTime;
                console.log("[Animation Timeline] Transition video time:", transitionVideoTime);
                
                // Update the main video source to match what was just animated
                mainVideoElement.src = getVideoSrc(targetIndex);
                mainVideoElement.load();
                
                // Create an opacity overlay for smooth transition
                const overlayDiv = document.createElement('div');
                overlayDiv.className = 'absolute left-0 top-0 z-10 size-full bg-blue-75';
                // Ensure parentNode exists before appending
                if (nextVideoElement.parentNode) {
                    nextVideoElement.parentNode.appendChild(overlayDiv);
                } else {
                    console.error("Cannot find parent node for overlayDiv!");
                }
                
                // Make main video initially invisible
                gsap.set(mainVideoElement, { opacity: 0 });
                
                // When main video can play
                const canPlayHandler = () => {
                    console.log("[Animation Timeline] Main video can play.");
                    try {
                        // Start at a specific time to avoid the "restart" feeling - use a higher value
                        mainVideoElement.currentTime = 3.0; // Try 3 seconds in instead of 1
                        
                        // Cross-fade between videos with longer duration
                        gsap.to(mainVideoElement, { 
                            opacity: 1, 
                            duration: 0.8,
                            onStart: () => console.log("[Animation Timeline] Main video fade-in start.")
                        });
                        gsap.to(nextVideoElement, { 
                            opacity: 0, 
                            duration: 0.8,
                            onStart: () => console.log("[Animation Timeline] Transition video fade-out start.")
                        });
                        gsap.to(overlayDiv, { 
                            opacity: 0, 
                            duration: 1.0, 
                            onComplete: () => {
                                console.log("[Animation Timeline] Overlay fade complete.");
                                // Play the main video
                                mainVideoElement.play().catch(e => console.error("Main video play failed:", e));
                                
                                // Remove the overlay once fade is complete
                                if (overlayDiv.parentNode) {
                                    overlayDiv.remove();
                                }
                                
                                // After animation completes, update the current index
                                setCurrentIndex(targetIndex);
                                console.log(`[Animation End] Index updated to: ${targetIndex}`);
                                
                                // Reset the transition video element to initial state
                                // Ensure ref is still valid
                                if (nextVideoRef.current) {
                                    gsap.set(nextVideoRef.current, { 
                                        ...nextVideoInitialStyles,
                                        // Ensure visibility is hidden explicitly after fade out
                                        visibility: 'hidden' 
                                    });
                                    console.log("[Animation End] Transition video reset to initial styles.");
                                }
                                
                                // Clear video source AFTER setting styles and allow UI to update
                                setTimeout(() => {
                                    if (nextVideoRef.current) {
                                        console.log("[Animation End] Clearing transition video src.");
                                        nextVideoRef.current.pause(); // Stop playback
                                        nextVideoRef.current.src = ""; // Clear src
                                        nextVideoRef.current.load(); // Reset video state
                                    }
                                    
                                    // Make preview container visible again
                                    if (previewContainerRef.current) {
                                        console.log("[Animation End] Making preview container visible.");
                                        gsap.to(previewContainerRef.current, { 
                                            autoAlpha: 1, 
                                            scale: 1, 
                                            duration: 0.5,
                                            ease: 'power2.out'
                                        });
                                    }
                                    
                                    // End animation state
                                    console.log("[Animation End] Setting isAnimating to false.");
                                    setIsAnimating(false);
                                }, 150); // Increased timeout slightly
                            }
                        });
                    } catch (error) {
                        console.error("Error in video transition:", error);
                        // Simple fallback if the approach above fails
                        mainVideoElement.play().catch(e => console.error("Fallback main video play failed:", e));
                        setIsAnimating(false);
                    }
                };
                
                mainVideoElement.addEventListener('canplay', canPlayHandler, { once: true }); // Only run this handler once
            }
        });

        // Animation: expand the preview video to full screen
        console.log("[Animation Start] Starting zoom animation tween.");
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

    // Update preview video when currentIndex changes
    useEffect(() => {
        // Only run if NOT animating and the ref exists
        if (!previewVideoRef.current || isAnimating) return; 
        
        // Delay this update slightly to ensure the main animation cleanup has finished
        const updateTimeout = setTimeout(() => {
            // Double-check isAnimating flag inside timeout
            if (isAnimating || !previewVideoRef.current) return; 

            console.log(`[Preview Update] Updating preview to index: ${upcomingVideoIndex}`);
            
            // Manually update the preview video source
            previewVideoRef.current.src = getVideoSrc(upcomingVideoIndex);
            previewVideoRef.current.load();
            previewVideoRef.current.play()
                .catch(e => console.error("Preview video play failed:", e));
        }, 300); // Delay update slightly

        // Cleanup function for the timeout
        return () => clearTimeout(updateTimeout);

    }, [currentIndex, upcomingVideoIndex, isAnimating]); // Add isAnimating dependency

    return (
        <div className='relative h-dvh w-screen overflow-x-hidden'>
            <div id='video-frame' className='relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75'>

                {/* Main Background Video */}
                <video
                    ref={mainVideoRef}
                    key={`bg-${currentIndex}`} // Key helps React replace the element if needed, but src update handles the video change
                    src={getVideoSrc(currentIndex)}
                    autoPlay loop muted playsInline
                    className='absolute left-0 top-0 z-0 size-full object-cover object-center'
                    onLoadedData={handleVideoLoad}
                />

                {/* Preview Video Container */}
                <div
                    ref={previewContainerRef}
                    onClick={handleMiniVdClick}
                    // Apply initial styles directly for GSAP control
                    style={{ visibility: 'hidden', scale: 0.9, opacity: 0 }} 
                    // Update the size classes here
                    className='group absolute top-4 right-4 sm:top-6 sm:right-6 z-50 flex items-center justify-center
                               size-20 sm:size-24 md:size-28 
                               cursor-pointer overflow-hidden rounded-full bg-black/30 backdrop-blur-sm
                               shadow-lg 
                               transition-all duration-300 ease-out hover:shadow-xl hover:bg-black/50
                               hover:ring-2 hover:ring-yellow-300 hover:ring-opacity-80'
                >
                    {/* Preview Video Element */}
                    <video
                        ref={previewVideoRef}
                        // No need for src here initially, it's set in useEffect
                        loop muted playsInline
                        className='absolute inset-0 size-full origin-center rounded-full object-cover object-center transition-transform duration-300 ease-out group-hover:scale-105'
                        onLoadedData={handleVideoLoad}
                    />
                    {/* Refresh Icon Overlay */}
                    <div className='absolute z-10 text-white/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                        <FaPlayCircle size={40} className='drop-shadow-md' />
                    </div>
                </div>

                {/* Hidden Video Element for Transition Animation */}
                <video 
                    ref={nextVideoRef}
                    loop muted playsInline // Loop might not be strictly necessary here but doesn't hurt
                    className='absolute object-cover object-center'
                    style={nextVideoInitialStyles} // Apply initial styles
                    onLoadedData={handleVideoLoad}
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