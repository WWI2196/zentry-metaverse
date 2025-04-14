import React, { use, useRef, useState } from 'react'
import { GiClick } from "react-icons/gi";
import Button from './Button';


const Hero= () => {

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


return (
    // Main container for the hero section, taking full viewport height and width
    <div className='realtive h-dvh w-screen overflow-x-hidden'>

            {/* Video frame container with relative positioning and overflow hidden */}
            <div id='video-frame' className='relative z-10 h-dvh w-screen overflow-hidden rounnded-lg bg-blue-75'>
                    <div >

                            {/* Masked container for the small preview video, centered absolutely */}
                            <div className='mask-clip-path absolute-center absolute z-50 size-64 cursor-pointer overflow-hidden rounded-lg'>

                                    {/* Clickable area for the preview video, handles changing the main video */}
                                    <div onClick={handleMiniVdClick}
                                            // Styling for hover effect: scales up and becomes opaque on hover
                                            className='origin-center scale-50 opacity-0 transition-all duration-500 ease-in hover:scale-100 hover:opacity-100'>

                                            {/* Small preview video element showing the next video */}
                                            <video
                                            ref={nextVideoRef} // Ref for potential future use
                                            src={getVideoSrc(upcomingVideoIndex)} // Source determined by the next video index
                                            loop // Video loops automatically
                                            muted // Video is muted
                                            id='current-video' // ID for the preview video
                                            className='size-64 origin-center scale-150 object-cover object-center' // Styling for the preview video
                                            onLoadedData={handleVideoLoad}/> {/* Callback function when video data is loaded */}
                                    </div>
                            </div>

                            {/* Hidden video element, potentially for preloading or smoother transitions */}
                            <video ref={nextVideoRef} // Ref for potential future use
                            src={getVideoSrc(currentIndex)} // Source determined by the current video index
                            loop // Video loops automatically
                            muted // Video is muted
                            id='next-video' // ID for this hidden video
                            className='absolute-center invisible absolute z-20 size-64 object-cover object-center' // Styling, making it invisible and positioned centrally
                            onLoadedData={handleVideoLoad}/> {/* Callback function when video data is loaded */}

                            {/* Main background video element */}
                            <video src={getVideoSrc(currentIndex === totalVideos - 1 ? 1:currentIndex)} // Source determined by the current index, loops back to the first video if at the end
                            autoPlay // Video plays automatically on load
                            loop // Video loops automatically
                            muted // Video is muted
                            className='absolute left-0 top-0 size-full object-cover object-center' // Styling to cover the entire container
                            onLoadedData={handleVideoLoad}/> {/* Callback function when video data is loaded */}


                    </div>

                    {/* Heading positioned at the bottom right with specific font and color */}
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
                                    <Button id='watch-trailer' title='Watch Trailer' leftIcon={<GiClick />}
                                    containerClass='!bg-yellow-300 flex items-center justify-center gap-1'/>

                            </div>

                    </div>
            </div>
            <h1 className='special-font hero-heading absolute bottom-5 right-5 text-blue-75'>
                    <b>Gaming</b>
            </h1>
    </div>
)
}

export default Hero