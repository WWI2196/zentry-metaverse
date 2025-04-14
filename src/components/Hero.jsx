import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GiClick } from "react-icons/gi";
import { FaPlayCircle } from "react-icons/fa";
import Button from './Button';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
    const [currentIndex, setCurrentIndex] = useState(1);
    const [isAnimating, setIsAnimating] = useState(false);
    const [loading, setLoading] = useState(true);

    const totalVideos = 4;
    const nextVideoRef = useRef(null);
    const previewVideoRef = useRef(null);
    const previewContainerRef = useRef(null);
    const mainVideoRef = useRef(null);

    const upcomingVideoIndex = (currentIndex % totalVideos) + 1;
    const getVideoSrc = useCallback((index) => `videos/hero-${index}.mp4`, []);

    const nextVideoInitialStyles = {
        top: '6rem',
        right: '1.5rem',
        width: '4rem',
        height: '4rem',
        borderRadius: '9999px',
        visibility: 'hidden',
        scale: 1,
        zIndex: 20,
    };

    const handleMiniVdClick = () => {
        if (isAnimating || loading) return;
        setIsAnimating(true);
    };

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
            previewVid.muted = true; 
            previewVid.loop = true;
            previewVid.play().catch(e => console.error("Initial preview video play failed:", e));
        }

        if (mainVid) {
            const handleCanPlay = () => {
                mainVid.play().catch(e => console.error("Initial BG video play failed", e));
                setLoading(false);
            };
            mainVid.addEventListener('canplay', handleCanPlay, { once: true });
            mainVid.src = getVideoSrc(currentIndex);
            mainVid.load();

            return () => {
                mainVid.removeEventListener('canplay', handleCanPlay);
            };
        } else {
            setLoading(false);
        }
    }, [getVideoSrc, upcomingVideoIndex, currentIndex]);

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
                                
                                setTimeout(() => {
                                    if (nextVideoRef.current) {
                                        nextVideoRef.current.pause();
                                        nextVideoRef.current.src = "";
                                        nextVideoRef.current.load();
                                    }
                                    setIsAnimating(false);
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
                        mainVideoElement.style.opacity = '1';
                        mainVideoElement.play().catch(e => console.error("Fallback play failed:", e));
                        if (overlayDiv.parentNode) overlayDiv.remove();
                        if (nextVideoRef.current) gsap.set(nextVideoRef.current, { opacity: 0, visibility: 'hidden' });
                        setCurrentIndex(targetIndex);
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

    }, { dependencies: [isAnimating, upcomingVideoIndex, getVideoSrc] });

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
                trigger: '#video-frame',
                start: 'top top',
                end: 'bottom top',
                scrub: true,
            },
        });
    }, []);

    useEffect(() => {
        if (!previewVideoRef.current || isAnimating || loading) return;
        
        const updateTimeout = setTimeout(() => {
            if (isAnimating || loading || !previewVideoRef.current) return; 
            
            previewVideoRef.current.src = getVideoSrc(upcomingVideoIndex);
            previewVideoRef.current.load();
            previewVideoRef.current.play().catch(e => console.error("Preview video update play failed:", e));

            if (previewContainerRef.current && !isAnimating) {
                 gsap.to(previewContainerRef.current, { 
                     autoAlpha: 1, 
                     scale: 1, 
                     duration: 0.5, 
                     ease: 'power2.out'
                 });
            }
        }, 300);

        return () => clearTimeout(updateTimeout);
    }, [currentIndex, upcomingVideoIndex, isAnimating, loading, getVideoSrc]);

    return (
        <div className='relative h-dvh w-screen overflow-x-hidden'>
                
        {loading && (
        <div className="flex-center absolute left-0 top-0 z-[100] h-dvh w-screen overflow-hidden bg-blue-50">
          <div className="three-body">
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
          </div>
        </div>
        )}

            <div id='video-frame' className='relative z-10 h-dvh w-screen overflow-hidden bg-blue-75'>
                <video
                    ref={mainVideoRef}
                    key={`main-vid-${currentIndex}`} 
                    autoPlay loop muted playsInline
                    className='absolute left-0 top-0 z-0 size-full object-cover object-center'
                />

                <div
                    ref={previewContainerRef}
                    onClick={handleMiniVdClick}
                    style={{ visibility: 'hidden', scale: 0.9, opacity: 0 }} 
                    className='group absolute top-24 right-4 sm:right-6 z-50 flex items-center justify-center
                               size-16 sm:size-20 md:size-24 
                               cursor-pointer overflow-hidden rounded-full bg-black/30 backdrop-blur-sm
                               shadow-lg transition-all duration-300 ease-out hover:shadow-xl hover:bg-black/50
                               hover:ring-2 hover:ring-yellow-300 hover:ring-opacity-80'
                >
                    <video
                        ref={previewVideoRef}
                        playsInline
                        muted 
                        loop 
                        className='absolute inset-0 size-full origin-center rounded-full object-cover object-center 
                                 transition-transform duration-300 ease-out group-hover:scale-105'
                    />
                    <div className='absolute z-10 text-white/90 transition-opacity duration-300'>
                        <FaPlayCircle size={30} className='drop-shadow-md' /> 
                    </div>
                </div>

                <video 
                    ref={nextVideoRef}
                    loop muted playsInline
                    className='absolute object-cover object-center'
                    style={nextVideoInitialStyles}
                />

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