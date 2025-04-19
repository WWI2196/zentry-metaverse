import React from 'react'
import BentoCard from './BentoCard'; // Import BentoCard

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
        
            <div className='border-modern relative mb-7 mx-3 md:mx-6 h-96 w-auto overflow-hidden rounded-2xl md:h-[65vh] backdrop-blur-sm shadow-glow bento-card-container'>
                <BentoCard 
                src='videos/feature-1.mp4'
                title={<>radi<b>n</b>t</>}
                description="A cross-platform metagame app, turning your activities across Web2 and Web3 games into a rewarding adventure."
                isComingSoon={true}/>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-7 px-3 md:px-6'>
                <div className='border-modern relative overflow-hidden rounded-2xl backdrop-blur-sm shadow-glow bento-card-container h-100 md:h-[40rem] hover:scale-[1.02] transition-transform duration-300'>
                    <BentoCard
                    src='videos/feature-2.mp4'
                    title={<>zig<b>m</b>a</>}
                    description='An anime and gaming-inspired NFT collection - the IP primed for expansion.'/>
                </div>

                <div className='border-modern relative overflow-hidden rounded-2xl backdrop-blur-sm shadow-glow bento-card-container h-100 md:h-[40rem] hover:scale-[1.02] transition-transform duration-300'>
                    <BentoCard
                    src='videos/feature-3.mp4'
                    title={<>n<b>e</b>xus</>}
                    description='A decentralized social network that rewards you for your time and attention.'/>
                </div>
            </div>
        </div>
    </section>
  )
}

export default Features