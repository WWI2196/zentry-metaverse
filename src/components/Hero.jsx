import React, { useRef, useState } from 'react'; // Removed unused 'use' import
import { GiClick } from "react-icons/gi";
import Button from './Button';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const Hero = () => {
    const [currentIndex, setCurrentIndex] = useState(1);
    const [hasClicked, setHasClicked] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [loadedVideos, setLoadedVideos] = useState(0);

    const totalVideos = 4; // Total number of videos to load
    const nextVideoRef = useRef(null);

    const upcomingVideoIndex = (currentIndex % totalVideos) + 1; // Calculate the next video index
    const getVideoSrc = (index) => `videos/hero-${index}.mp4`;

    const handleMiniVdClick = () => {
        setHasClicked(true);
        setCurrentIndex(upcomingVideoIndex);
    }

    const handleVideoLoad = () => {
        setLoadedVideos((prevCount) => prevCount + 1);
    }

    // Corrected GSAP animation hook
    useGSAP(() => {
        if (hasClicked) {
            // Set the initially hidden video to visible before animating
            gsap.set("#next-video", { visibility: "visible" });

            // Animate the hidden video to fill the screen
            gsap.to("#next-video", {
                transformOrigin: "center center",
                scale: 1, // Scale to 1 (original size, but width/height make it fill)
                width: "100%",
                height: "100%",
                duration: 1,
                ease: "power.inOut",
                onStart: () => {
                    // Ensure the ref is current and play the video
                    if (nextVideoRef.current) {
                        nextVideoRef.current.play();
                    }
                },
            });

            // Animate the small preview video scaling down (from scale 0 implies it appears from nothing, maybe scale down *to* 0?)
            // Using the desired 'from' logic:
            gsap.from("#current-video", {
                transformOrigin: "center center",
                scale: 0, // Start from scale 0
                duration: 1.5,
                ease: "power1.inOut",
            });

            // Alternative: Animate the small preview video *to* scale 0 (shrinking away)
            // gsap.to("#current-video", {
            //   transformOrigin: "center center",
            //   scale: 0,
            //   opacity: 0, // Fade out as it shrinks
            //   duration: 1,
            //   ease: "power1.inOut",
            // });
        }
    }, {
        dependencies: [currentIndex], // Corrected typo: dependencies
        revertOnUpdate: true, // Revert previous animation state on update
    });

    return (
        <div className='realtive h-dvh w-screen overflow-x-hidden'>

            {/* Video frame container */}
            <div id='video-frame' className='relative z-10 h-dvh w-screen overflow-hidden rounnded-lg bg-blue-75'>
                <div>
                    {/* Masked container for the small preview video */}
                    <div className='mask-clip-path absolute-center absolute z-50 size-64 cursor-pointer overflow-hidden rounded-lg'>
                        {/* Clickable area */}
                        <div onClick={handleMiniVdClick}
                            className='origin-center scale-50 opacity-0 transition-all duration-500 ease-in hover:scale-100 hover:opacity-100'>
                            {/* Small preview video element */}
                            <video
                                src={getVideoSrc(upcomingVideoIndex)}
                                loop
                                muted
                                id='current-video' // This is the element animated with gsap.from/to scale: 0
                                className='size-64 origin-center scale-150 object-cover object-center'
                                onLoadedData={handleVideoLoad} />
                        </div>
                    </div>

                    {/* Hidden video element for transition */}
                    <video ref={nextVideoRef} // This ref is used in the onStart callback
                        src={getVideoSrc(currentIndex)}
                        loop
                        muted
                        id='next-video' // This is the element animated to fill the screen
                        className='absolute-center invisible absolute z-20 size-64 object-cover object-center'
                        onLoadedData={handleVideoLoad} />

                    {/* Main background video element */}
                    <video src={getVideoSrc(currentIndex === totalVideos - 1 ? 1 : currentIndex)}
                        autoPlay
                        loop
                        muted
                        className='absolute left-0 top-0 size-full object-cover object-center'
                        onLoadedData={handleVideoLoad} />
                </div>

                <h1 className='special-font hero-heading absolute bottom-5 right-5 z-40 text-blue-75'>
                    <b>Gaming</b>
                </h1>

                {/* Overlay container for the top heading */}
                <div className='absolute left-0 top-0 z-40 size-full'>
                    {/* Inner container for padding */}
                    <div className='mt-24 px-5 sm:px-10'>
                        {/* Main heading positioned towards the top with specific font and color */}
                        <h1 className='special-font hero-heading text-blue-100'>
                            <b>redifine</b>
                        </h1>
                        <p className='mb-5 max-w-64 font-robert-regular text-blue-100'>
                            Enter the Metagame Layer <b />
                            <br /> {/* Added line break */}
                            Unleash the Play Economy
                        </p>

                        {/* Button container with specific styling */}
                        <Button
                            id='watch-trailer'
                            title='Watch Trailer'
                            leftIcon={<GiClick size={20} />} // Added size prop to icon
                            containerClass='!bg-yellow-300 flex items-center justify-center gap-2 px-10 py-4 text-sm' // Added text-sm and adjusted gap
                        />
                    </div>
                </div>
            </div>
            <h1 className='special-font hero-heading absolute bottom-5 right-5 text-blue-75'>
                <b>Gaming</b>
            </h1>
        </div>
    );
}

export default Hero;