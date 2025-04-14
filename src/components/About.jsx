import { useGSAP } from '@gsap/react';
import React from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedTitle from './AnimatedTitle';

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
                trigger: '#clip',
                start: 'top center', // Start animation when top of section reaches bottom of viewport
                end: '+=800 center', // Changed: animation completes later in the scroll
                scrub: 0.5, // Increased: creates smoother, more gradual animation
                pin: false, // Don't pin during initial animation
                pinSpacing: true,
            },
        });
        
        // Animate the image expanding
        clipAnimation.to('.mask-clip-path', {
            width: '100vw',
            height: '100vh',
            borderRadius: 0,
            ease: 'power2.inout' // Changed: less aggressive easing function
        });
        
        // Add pinning after the image is expanded
        gsap.timeline({
            scrollTrigger: {
                trigger: '#clip',
                start: 'center center', // Pin when the image reaches the top
                end: '+=800 center', // Pin for a longer duration
                pin: true,
                pinSpacing: true,
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

                <AnimatedTitle title="Disc<b>o</b>ver the world's<br/>l<b>a</b>rgest shared adventure"
                containerClass='mt-5 !text-black text-center'/>

                

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