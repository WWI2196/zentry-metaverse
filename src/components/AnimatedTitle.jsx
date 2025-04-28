import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AnimatedTitle = ({title, containerClass}) => {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const titleAnimation = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top bottom-=50px',
                    // Further adjust end point: reverse animation when bottom hits 150px below the top of viewport
                    end: 'bottom top+=150px', 
                    toggleActions: 'play none none reverse',
                    // markers: true, // Uncomment for debugging trigger points
                },
            });

            titleAnimation.to('.animated-word', {
                opacity: 1,
                transform: 'translate3d(0,0,0) rotateY(0deg) rotateX(0deg)',
                ease: 'power2.inOut',
                stagger: 0.02
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className={`animated-title ${containerClass}`}>
            {title.split('<br/>').map((line, index) => (
                <div
                    key={index}
                    className='flex-center max-w-full flex-wrap gap-2 px-10 md:gap-3'>
                    {line.split(' ').map((word,i) => (
                        <span key={i} className='animated-word' 
                        dangerouslySetInnerHTML={{__html: word}}/>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default AnimatedTitle;