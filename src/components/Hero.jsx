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
    };

    const handleMiniVdClick = () => {
        if (isAnimating) {
            return;
        }
        setIsAnimating(true);
    }

    const handleVideoLoad = () => {
        setLoadedVideos((prevCount) => prevCount + 1);
    }

    useEffect(() => {
        if (previewContainerRef.current) {
            gsap.to(previewContainerRef.current, { autoAlpha: 1, scale: 1, duration: 0.7, ease: 'power2.out', delay: 0.5 });
        }
        if (previewVideoRef.current) {
            previewVideoRef.current.load();
        }
        const initialBgVideo = document.getElementById('initial-bg-video');
        if (initialBgVideo) {
            initialBgVideo.play().catch(e => console.error("Initial BG video play failed", e));
        }
    }, []);

    useGSAP(() => {
        if (!isAnimating) return;

        const nextVideoElement = nextVideoRef.current;
        const previewContainerElement = previewContainerRef.current;

        if (!nextVideoElement || !previewContainerElement) return;

        nextVideoElement.src = getVideoSrc(upcomingVideoIndex);
        nextVideoElement.load();

        gsap.set(nextVideoElement, { visibility: "visible", scale: 1 });

        const tl = gsap.timeline({
            onComplete: () => {
                setCurrentIndex(upcomingVideoIndex);
                gsap.set(nextVideoElement, nextVideoInitialStyles);
                setIsAnimating(false);
                gsap.set(previewContainerElement, { display: 'flex', scale: 1, autoAlpha: 1 });
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
            onStart: () => {
                nextVideoElement.play().catch(error => console.error("Zooming video play failed:", error));
            },
        })
        .to(previewContainerElement, {
            scale: 0,
            autoAlpha: 0,
            duration: 0.8,
            ease: "power1.in",
        }, "<");

    }, { dependencies: [isAnimating] });

    return (
        <div className='relative h-dvh w-screen overflow-x-hidden'>

            <div id='video-frame' className='relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75'>
                <video
                    key={`bg-${currentIndex}`}
                    src={getVideoSrc(currentIndex)}
                    autoPlay loop muted playsInline
                    id='initial-bg-video'
                    className='absolute left-0 top-0 z-0 size-full object-cover object-center'
                    onLoadedData={handleVideoLoad}
                />

                <div
                    ref={previewContainerRef}
                    onClick={handleMiniVdClick}
                    className='group absolute top-4 right-4 sm:top-6 sm:right-6 z-50 flex items-center justify-center
                               size-24 sm:size-28 md:size-32
                               cursor-pointer overflow-hidden rounded-full bg-black/30 backdrop-blur-sm
                               shadow-lg
                               invisible scale-90
                               transition-all duration-300 ease-out hover:shadow-xl hover:bg-black/50
                               hover:ring-2 hover:ring-yellow-300 hover:ring-opacity-80'
                >
                    <video
                        ref={previewVideoRef}
                        src={getVideoSrc(upcomingVideoIndex)}
                        loop muted playsInline
                        id='current-video'
                        className='absolute inset-0 size-full origin-center rounded-full object-cover object-center transition-transform duration-300 ease-out group-hover:scale-105'
                        onLoadedData={handleVideoLoad}
                    />
                    <div className='absolute z-10 text-white/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                        <IoMdRefresh size={30} className='drop-shadow-md' />
                    </div>
                </div>

                <video ref={nextVideoRef}
                    key={`next-transition`}
                    src={getVideoSrc(currentIndex)}
                    loop muted playsInline
                    id='next-video'
                    className='absolute top-6 right-6 invisible z-20
                               size-24 sm:size-28 md:size-32
                               origin-center rounded-full object-cover object-center'
                    onLoadedData={handleVideoLoad} />

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
}

export default Hero;