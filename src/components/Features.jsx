import React from 'react'
import BentoCard from './BentoCard'; // Import BentoCard

const Features = () => {
  return (
    <section className='bg-black pb-52'>
        <div className='container mx-auto px-4 md:px-10'>
            <div className='px-5 py-32'>
                <p className='font-circular-web text-lg text-blue-50'>
                    Into the Metaverse, we are building

                </p>

            </div>
            <p className='max-w-md font-circular-web text-lg text-blue-50 opacity-50'>
                Immerse yourself in a world of endless possibilities with our cutting-edge metaverse platform. Experience the future of virtual reality, where you can connect, create, and explore like never before. Join us on this exciting journey and unlock the full potential of the metaverse.
            </p>

        </div>

        <div className='border-hsla relative mb-7 h-96 w-full overflow-hidden rounded-md md:h-[65vh]'>
            <BentoCard 
            src='videos/feature-1.mp4'
            title={<>radi<b>n</b>t</>}
            description="A cross-platform metagame app, turning your activities across Web2 and Web3 games into a rewarding adventure."
            isComingSoon={true}/>
        </div>

    </section>
  )
}

export default Features