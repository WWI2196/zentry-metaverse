import React from 'react'
import BentoCard from './BentoCard'; // Import BentoCard
import { TiLocationArrow } from "react-icons/ti";

const Features = () => {
  return (
    <section className='bg-black pb-52 w-full'>
        <div className='w-full px-5 md:px-10'>
            <div className='py-32 px-3'>
                <p className='font-circular-web text-lg text-blue-50'>
                    Into the Metaverse, we are building
                </p>
            
                <p className='font-circular-web text-lg text-blue-50 opacity-50'>
                    Immerse yourself in a world of endless possibilities with our cutting-edge metaverse platform. Experience the future of virtual reality, where you can connect, create, and explore like never before. Join us on this exciting journey and unlock the full potential of the metaverse.
                </p>
            </div>
        
            <div className='border-modern relative mb-7 mx-3 md:mx-6 h-96 w-auto overflow-hidden rounded-2xl md:h-[65vh] backdrop-blur-sm shadow-glow bento-card-container hover:scale-[1.02] transition-transform duration-300'>
                <BentoCard 
                src='videos/feature-1.mp4'
                title={<>radi<b>n</b>t</>}
                description="A cross-platform metagame app, turning your activities across Web2 and Web3 games into a rewarding adventure."
                isComingSoon={true}/>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-7 px-3 md:px-6'>
                {/* First row */}
                {/* Zigma card - left side, full height */}
                <div className='border-modern relative overflow-hidden rounded-2xl backdrop-blur-sm shadow-glow bento-card-container h-120 md:h-[52rem] hover:scale-[1.02] transition-transform duration-300'>
                    <BentoCard
                    src='videos/feature-2.mp4'
                    title={<>zig<b>m</b>a</>}
                    description='An anime and gaming-inspired NFT collection - the IP primed for expansion.'/>
                </div>

                {/* Right column with Nexus and Azul stacked */}
                <div className='flex flex-col gap-7'>
                    {/* Nexus card */}
                    <div className='border-modern relative overflow-hidden rounded-2xl backdrop-blur-sm shadow-glow bento-card-container h-100 hover:scale-[1.02] transition-transform duration-300'>
                        <BentoCard
                        src='videos/feature-3.mp4'
                        title={<>n<b>e</b>xus</>}
                        description='A decentralized social network that rewards you for your time and attention.'/>
                    </div>
                    
                    {/* Azul card */}
                    <div className='border-modern relative overflow-hidden rounded-2xl backdrop-blur-sm shadow-glow bento-card-container h-100 hover:scale-[1.02] transition-transform duration-300'>
                        <BentoCard
                        src='videos/feature-4.mp4'
                        title={<>az<b>u</b>l</>}
                        description='A cross-world AI agent - elevating your gameplay to be more fun and productive.'/>
                    </div>
                </div>
            </div>

            {/* Second row in a separate grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-7 px-3 md:px-6 mt-7'>
                {/* More coming soon - on right */}
                <div className='bento-tilt_2 hover:scale-[1.02] transition-transform duration-300 h-64 md:h-80 rounded-2xl overflow-hidden'>
                    <div className='flex size-full flex-col justify-between bg-violet-300 p-5'>
                        <h1 className="bento-title special-font max-w-64 text-black">
                            M<b>o</b>re co<b>m</b>ing s<b>o</b>on.
                        </h1>

                        <div className="self-end">
                            <button 
                                className="group bg-transparent border-none p-0 cursor-pointer m-5"
                                onClick={() => {
                                    // This will be connected to the project link in the future
                                    // Navigate to project details or registration page
                                }}
                            >
                                <TiLocationArrow 
                                    className="scale-[5] transition-all duration-300 text-black group-hover:text-yellow-300 group-hover:translate-x-1 group-hover:translate-y-1" 
                                />
                            </button>
                        </div>
                    </div>
                </div>
                {/* Video card - on left */}
                <div className='bento-tilt_2 hover:scale-[1.02] transition-transform duration-300 h-64 md:h-80 rounded-2xl overflow-hidden'>
                    <video
                        src="videos/feature-5.mp4"
                        loop
                        muted
                        autoPlay
                        className="size-full object-cover object-center"
                    />
                </div>
            </div>
        </div>
    </section>
  )
}

export default Features