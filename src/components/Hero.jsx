import React, { useEffect, useRef, useState } from 'react';
import { GiClick } from "react-icons/gi";
import { IoMdRefresh } from "react-icons/io";
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
        width: '7rem',
        height: '7rem',
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

        if (!nextVideoElement || !mainVideoElement) return;

        // Set up transition video from the upcoming source
        nextVideoElement.src = getVideoSrc(upcomingVideoIndex);
        nextVideoElement.load();
        
        // Make it visible and start playing
        gsap.set(nextVideoElement, { visibility: "visible", scale: 1 });
        nextVideoElement.play().catch(e => console.error("Transition video play failed:", e));

        const tl = gsap.timeline({
            onComplete: () => {
                // After animation completes, update the current index
                setCurrentIndex(upcomingVideoIndex);
                
                // Reset the transition video element
                gsap.set(nextVideoElement, nextVideoInitialStyles);
                
                // End animation state
                setIsAnimating(false);
            }
        });

        // Animation: expand the preview video to full screen
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

    }, { dependencies: [isAnimating] }); // Only depend on isAnimating

    // Update preview video when currentIndex changes
    useEffect(() => {
        if (!previewVideoRef.current) return;
        
        // Manually update the preview video source
        previewVideoRef.current.src = getVideoSrc(upcomingVideoIndex);
        previewVideoRef.current.load();
        previewVideoRef.current.play()
            .catch(e => console.error("Preview video play failed:", e));

    }, [currentIndex, upcomingVideoIndex]);

    return (
        <div className='relative h-dvh w-screen overflow-x-hidden'>
            <div id='video-frame' className='relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75'>

                {/* Main Background Video */}
                <video
                    ref={mainVideoRef}
                    key={`bg-${currentIndex}`}
                    src={getVideoSrc(currentIndex)}
                    autoPlay loop muted playsInline
                    className='absolute left-0 top-0 z-0 size-full object-cover object-center'
                    onLoadedData={handleVideoLoad}
                />

                {/* Preview Video Container */}
                <div
                    ref={previewContainerRef}
                    onClick={handleMiniVdClick}
                    className='group absolute top-4 right-4 sm:top-6 sm:right-6 z-50 flex items-center justify-center
                               size-24 sm:size-28 md:size-32
                               cursor-pointer overflow-hidden rounded-full bg-black/30 backdrop-blur-sm
                               shadow-lg invisible scale-90
                               transition-all duration-300 ease-out hover:shadow-xl hover:bg-black/50
                               hover:ring-2 hover:ring-yellow-300 hover:ring-opacity-80'
                >
                    {/* Preview Video Element */}
                    <video
                        ref={previewVideoRef}
                        src={getVideoSrc(upcomingVideoIndex)}
                        loop muted playsInline
                        className='absolute inset-0 size-full origin-center rounded-full object-cover object-center transition-transform duration-300 ease-out group-hover:scale-105'
                        onLoadedData={handleVideoLoad}
                    />
                    {/* Refresh Icon Overlay */}
                    <div className='absolute z-10 text-white/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                        <IoMdRefresh size={30} className='drop-shadow-md' />
                    </div>
                </div>

                {/* Hidden Video Element for Transition Animation */}
                <video 
                    ref={nextVideoRef}
                    loop muted playsInline
                    className='absolute object-cover object-center'
                    style={nextVideoInitialStyles}
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