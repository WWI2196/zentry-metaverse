import AnimatedTitle from "./AnimatedTitle";
import Button from "./Button";
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap'; // Import gsap
import { ScrollTrigger } from 'gsap/ScrollTrigger'; 
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from 'react-router-dom'; 
import swordmanPartialSrc from '/img/swordman-partial.webp'; 
import swordmanSrc from '/img/swordman.webp'; 
import contact1Src from '/img/contact-1.webp'; 
import contact2Src from '/img/contact-2.webp'; 

const ImageClipBox = ({ src, clipClass }) => (
  <div className={clipClass}>
    <img src={src} />
  </div>
);

const Contact = () => {
  const swordmanRef = useRef(null);
  const navigate = useNavigate(); 

  // animations for the swordman image
  useEffect(() => {
    if (swordmanRef.current) {
      gsap.to(swordmanRef.current, {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
      console.log("ScrollTrigger refreshed from Contact.jsx"); 
    }, 150); 

    return () => clearTimeout(timer); 
  }, []); 

  return (
    <div id="contact" className="relative my-20 min-h-96 w-screen px-10"> 
      {/* Swordman Image */}
      <div
        ref={swordmanRef}
        className="absolute -top-60 right-2 z-30 w-64 transition-all duration-500
                 sm:top-[-8rem]
                 lg:-top-16 lg:right-32 lg:w-96
                 hover:drop-shadow-[0_0_30px_rgba(237,255,102,0.3)]"
      > 
        {/* Glow effect that appears on hover */}
        <div className="absolute inset-0 rounded-full bg-yellow-300/0 blur-xl transition-opacity duration-500
                      opacity-0 lg:group-hover:opacity-30 pointer-events-none"></div>

        <ImageClipBox
          src={swordmanPartialSrc} 
          clipClass="absolute md:scale-125" 
        />
        <ImageClipBox
          src={swordmanSrc} 
          clipClass="sword-man-clip-path md:scale-150 transition-transform duration-500 lg:hover:scale-[1.55]"
        />
      </div>

      <div className="relative overflow-visible rounded-lg bg-black py-24 text-blue-50">
        {/* Left side images */}
        <div className="absolute -left-20 top-0 hidden h-full w-72 overflow-hidden sm:block lg:left-20 lg:w-96">
          <ImageClipBox
            src={contact1Src} 
            clipClass="contact-clip-path-1"
          />
          <ImageClipBox
            src={contact2Src} 
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

          {/* Button*/}
          <Button
            title="contact us"
            onClick={() => navigate('/contact-us')}
            containerClass="mt-10 cursor-pointer !bg-[#edff66] flex items-center justify-center gap-2 hover:!bg-[#edff66]/90 hover:text-black/90 text-black transition-all duration-300 group shadow-lg hover:shadow-[0_8px_20px_rgba(237,255,102,0.3)]"
            rightIcon={<FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1"/>}
          />
        </div>
      </div>
    </div>
  );
};

export default Contact;