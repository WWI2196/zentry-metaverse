import AnimatedTitle from "./AnimatedTitle";
import Button from "./Button";
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap'; // Import gsap
import { ScrollTrigger } from 'gsap/ScrollTrigger'; // Import ScrollTrigger
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const ImageClipBox = ({ src, clipClass }) => (
  <div className={clipClass}>
    <img src={src} />
  </div>
);

const Contact = () => {
  const swordmanRef = useRef(null);
  const navigate = useNavigate(); // Initialize useNavigate

  // Add animations for the swordman image
  useEffect(() => {
    if (swordmanRef.current) {
      // Create a subtle floating animation
      gsap.to(swordmanRef.current, {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }
  }, []);

  // Add useEffect to refresh ScrollTrigger specifically for this component
  useEffect(() => {
    // Delay refresh slightly to ensure layout is stable
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
      console.log("ScrollTrigger refreshed from Contact.jsx"); // Optional: for debugging
    }, 150); // Slightly longer delay than App.jsx

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <div id="contact" className="relative my-20 min-h-96 w-screen px-10"> {/* Added id="contact" */}
      {/* Swordman Image */}
      <div
        ref={swordmanRef}
        className="absolute -top-60 right-2 z-30 w-64 transition-all duration-500
                 sm:top-[-8rem]
                 lg:-top-16 lg:right-32 lg:w-96
                 hover:drop-shadow-[0_0_30px_rgba(237,255,102,0.3)]"
      > {/* Moved '>' to correct position */}
        {/* Glow effect that appears on hover */}
        <div className="absolute inset-0 rounded-full bg-yellow-300/0 blur-xl transition-opacity duration-500
                      opacity-0 lg:group-hover:opacity-30 pointer-events-none"></div>

        <ImageClipBox
          src="/img/swordman-partial.webp"
          clipClass="absolute md:scale-125" // Keep partial image absolute within this container
        />
        <ImageClipBox
          src="/img/swordman.webp"
          clipClass="sword-man-clip-path md:scale-150 transition-transform duration-500 lg:hover:scale-[1.55]"
        />
      </div>

      <div className="relative overflow-visible rounded-lg bg-black py-24 text-blue-50">
        {/* Left side images - Hidden on small screens */}
        <div className="absolute -left-20 top-0 hidden h-full w-72 overflow-hidden sm:block lg:left-20 lg:w-96">
          <ImageClipBox
            src="/img/contact-1.webp"
            clipClass="contact-clip-path-1"
          />
          <ImageClipBox
            src="/img/contact-2.webp"
            clipClass="contact-clip-path-2 lg:translate-y-40 translate-y-60"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col items-center text-center">
          <p className="mb-10 font-general text-[10px] uppercase tracking-wider animate-fade-up">
            Join Zentry
          </p>

          {/* Animated title */}
          <AnimatedTitle
            title="let's b<b>u</b>ild the <br/> new era of <br/> g<b>a</b>ming t<b>o</b>gether."
            className="special-font !md:text-[6.2rem] w-full font-zentry !text-3xl !font-black !leading-[.9]"
          />

          {/* Button - Updated to navigate */}
          <Button
            title="contact us"
            onClick={() => navigate('/contact-us')} // Add onClick handler to navigate
            containerClass="mt-10 cursor-pointer !bg-[#edff66] flex items-center justify-center gap-2 hover:!bg-[#edff66]/90 hover:text-black/90 text-black transition-all duration-300 group shadow-lg hover:shadow-[0_8px_20px_rgba(237,255,102,0.3)]"
            rightIcon={<FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1"/>}
          />
        </div>
      </div>
    </div>
  );
};

export default Contact;