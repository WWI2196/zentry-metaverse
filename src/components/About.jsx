import { useGSAP } from '@gsap/react';
import React from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const About = () => {
    // Use GSAP to create the animation
    useGSAP(() => {
        // Create a unique ID for this ScrollTrigger instance
        const aboutAnimationId = "about-clip-animation";
        
        // Kill only this specific ScrollTrigger instance if it exists
        const existingTrigger = ScrollTrigger.getById(aboutAnimationId);
        if (existingTrigger) {
            existingTrigger.kill();
        }
        
        // Create the timeline for the About section
        const clipAnimation = gsap.timeline({
            scrollTrigger: {
                trigger: '#about',
                start: 'top bottom', // Start animation when top of section reaches bottom of viewport
                end: 'center center', // End animation when center of section reaches center of viewport
                scrub: 0.5,
                pin: false, // Don't pin during initial animation
                pinSpacing: true,
                markers: false,
                id: aboutAnimationId // Set a unique ID
            },
        });
        
        // Animate the image expanding
        clipAnimation.to('.mask-clip-path', {
            width: '100vw',
            height: '100vh',
            borderRadius: 0,
            ease: 'power2.inOut'
        });
        
        // Add pinning after the image is expanded
        gsap.timeline({
            scrollTrigger: {
                trigger: '#clip',
                start: 'top top', // Pin when the image reaches the top
                end: '+=500', 
                pin: true,
                pinSpacing: true,
                id: "about-pin-animation"
            }
        });
        
        // Clean up only our scroll triggers on unmount
        return () => {
            const ourTrigger = ScrollTrigger.getById(aboutAnimationId);
            const pinTrigger = ScrollTrigger.getById("about-pin-animation");
            if (ourTrigger) ourTrigger.kill();
            if (pinTrigger) pinTrigger.kill();
        };
    }, []);

    return (
        <div id='about' className='relative min-h-screen w-screen'>
            <div className='relative mb-8 mt-36 flex flex-col items-center gap-5'>
                <h2 className='font-general text-sm uppercase md:text-[10px]'>
                    Welcome to Zentry
                </h2>

                <div className='mt-5 text-center text-4xl uppercase leading-[0.8] md:text-[6rem]'>
                    Disc<b>o</b>ver the world's<br/>l<b>a</b>rgest shared adventure
                </div>

                <div className='about-subtext'>
                    <p>
                        The Game of games begins-your life, now an epic MMORPG
                    </p>
                    <p>
                        Join a community of players, and embark on an adventure of a lifetime.
                    </p>
                </div>
            </div>

            <div className='relative h-dvh w-screen' id='clip'>
                <div className='mask-clip-path about-image'>
                    <img 
                        src="img/about.webp" 
                        alt="Background"
                        className='absolute left-0 top-0 size-full object-cover' 
                    />
                </div>
            </div>
        </div>
    );
};

export default About;