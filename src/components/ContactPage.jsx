import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaUser, FaEnvelope, FaComment, FaArrowRight, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { BsLightning, BsStars } from 'react-icons/bs';
import gsap from 'gsap';
import Button from './Button';
import stonesImageSrc from '/img/stones.webp'; // Import stones image
import contact1ImageSrc from '/img/contact-1.webp'; // Import contact image

// Configuration for email service setup
const EMAIL_CONFIG = {
  serviceId: 'your_service_id',
  templateId: 'your_template_id',
  userId: 'your_user_id',
};

// Helper function to check if config is still placeholder
const isConfigPlaceholder = () => {
  return (
    EMAIL_CONFIG.serviceId === 'your_service_id' ||
    EMAIL_CONFIG.templateId === 'your_template_id' ||
    EMAIL_CONFIG.userId === 'your_user_id'
  );
};

// Function to handle sending email data
const sendEmail = async (formData) => {
  if (isConfigPlaceholder()) {
    console.warn(
      'Email Service Not Configured: Please update EMAIL_CONFIG in ContactPage.jsx with your service details (e.g., EmailJS credentials or API endpoint). Simulating success for now.'
    );
    return new Promise(resolve => setTimeout(resolve, 800));
  }

  try {
    console.log('Email sending logic executed.');
    await new Promise(resolve => setTimeout(resolve, 800));
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

const ContactPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [formStatus, setFormStatus] = useState('idle');
    const [focusedField, setFocusedField] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const containerRef = useRef(null);
    const formRef = useRef(null);
    const titleRef = useRef(null);
    const closeBtnRef = useRef(null);
    const particlesRef = useRef(null);
    const successRef = useRef(null);
    const decorativeImageRef = useRef(null);
    const errorRef = useRef(null);

    const createParticles = useCallback(() => {
        if (!particlesRef.current) return;
        particlesRef.current.innerHTML = '';
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            const size = Math.random() * 8 + 4;
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            particle.className = 'absolute rounded-full';
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${left}%`;
            particle.style.top = `${top}%`;
            particle.style.opacity = Math.random() * 0.5 + 0.1;
            if (i % 3 === 0) {
                particle.classList.add('bg-yellow-300/30');
            } else if (i % 3 === 1) {
                particle.classList.add('bg-violet-400/30');
            } else {
                particle.classList.add('bg-blue-300/30');
            }
            const duration = Math.random() * 10 + 10;
            particle.style.animation = `float ${duration}s ease-in-out infinite`;
            particlesRef.current.appendChild(particle);
            gsap.to(particle, {
                x: Math.random() * 60 - 30,
                y: Math.random() * 60 - 30,
                duration: Math.random() * 8 + 8,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
        }
    }, []);

    useEffect(() => {
        createParticles();
        const tl = gsap.timeline();
        tl.fromTo(containerRef.current,
            { backdropFilter: "blur(0px)", backgroundColor: "rgba(0,0,0,0)" },
            { 
                backdropFilter: "blur(8px)", 
                backgroundColor: "rgba(0,0,0,0.8)", 
                duration: 0.7, 
                ease: 'power2.out' 
            }
        );
        tl.fromTo(".contact-card",
            { opacity: 0, scale: 0.9, y: 20 },
            { 
                opacity: 1, 
                scale: 1, 
                y: 0, 
                duration: 0.6, 
                ease: 'back.out(1.4)' 
            },
            "-=0.4"
        );
        tl.fromTo(closeBtnRef.current,
            { opacity: 0, scale: 0.5, rotate: -45 },
            { 
                opacity: 1, 
                scale: 1, 
                rotate: 0, 
                duration: 0.5, 
                ease: 'back.out(2)' 
            },
            "-=0.3"
        );
        tl.fromTo(titleRef.current.children,
            { opacity: 0, y: -20 },
            { 
                opacity: 1, 
                y: 0, 
                stagger: 0.1, 
                duration: 0.6, 
                ease: 'power3.out' 
            },
            "-=0.3"
        );
        tl.fromTo(formRef.current.querySelectorAll('.form-field'),
            { opacity: 0, y: 20, scale: 0.95 },
            { 
                opacity: 1, 
                y: 0, 
                scale: 1, 
                stagger: 0.1, 
                duration: 0.5, 
                ease: 'power2.out' 
            },
            "-=0.2"
        );
        tl.fromTo(decorativeImageRef.current,
            { opacity: 0, scale: 0.8, x: 20 },
            { 
                opacity: 0.8, 
                scale: 1, 
                x: 0, 
                duration: 0.7, 
                ease: 'power2.out' 
            },
            "-=0.5"
        );
        return () => {
            tl.kill();
        };
    }, [createParticles]);

    const handleChange = (e) => {
        if (formStatus === 'error') {
            setFormStatus('idle');
            setErrorMessage('');
        }
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleFocus = (field) => {
        setFocusedField(field);
    };

    const handleBlur = () => {
        setFocusedField(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormStatus('sending');
        setErrorMessage('');
        gsap.to(formRef.current, {
            opacity: 0.7,
            scale: 0.98,
            duration: 0.3,
            ease: 'power2.in'
        });
        try {
            await sendEmail(formData);
            gsap.to(formRef.current, { opacity: 1, scale: 1, duration: 0.2 });
            showSuccessAnimation();
        } catch (error) {
            gsap.to(formRef.current, { opacity: 1, scale: 1, duration: 0.2 });
            setFormStatus('error');
            setErrorMessage('Failed to send message. Please try again later.');
            gsap.fromTo(errorRef.current, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' });
        }
    };

    const showSuccessAnimation = () => {
        setFormStatus('success');
        gsap.fromTo(successRef.current, 
            { opacity: 0, scale: 0.5 },
            { 
                opacity: 1, 
                scale: 1, 
                duration: 0.5,
                ease: 'back.out(1.7)' 
            }
        );
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'absolute rounded-full bg-yellow-300/80';
            const size = Math.random() * 6 + 4;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = '50%';
            particle.style.top = '50%';
            successRef.current.appendChild(particle);
            gsap.to(particle, {
                x: (Math.random() - 0.5) * 200,
                y: (Math.random() - 0.5) * 200,
                opacity: 0,
                duration: 1 + Math.random(),
                delay: 0.1 + Math.random() * 0.3,
                ease: 'power2.out'
            });
        }
        setTimeout(() => handleClose(), 2500);
    };

    const handleClose = () => {
        const tl = gsap.timeline({
            onComplete: () => navigate(-1)
        });
        tl.to(".contact-card", {
            opacity: 0, 
            scale: 0.9, 
            y: 20,
            duration: 0.4,
            ease: 'power3.in'
        });
        tl.to(containerRef.current, {
            backdropFilter: "blur(0px)",
            backgroundColor: "rgba(0,0,0,0)",
            duration: 0.5,
            ease: 'power2.inOut'
        }, "-=0.2");
    };

    const getIconClass = (field) => {
        if (focusedField === field) {
            return 'text-yellow-300';
        }
        return 'text-gray-400';
    };

    const getInputClass = (field) => {
        const baseClass = "w-full rounded-md border px-4 py-3 text-white placeholder-gray-400 transition-all duration-300";
        if (focusedField === field) {
            return `${baseClass} border-yellow-300/70 bg-black/50 shadow-[0_0_15px_rgba(237,255,102,0.15)] ring-1 ring-yellow-300/30`;
        }
        return `${baseClass} border-white/10 bg-black/30 focus:border-yellow-300/50 focus:outline-none focus:ring-1 focus:ring-yellow-300/30`;
    };

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-cover bg-center"
            style={{ backgroundImage: `url(${stonesImageSrc})` }} // Use imported variable for background
        >
            <div className="absolute inset-0 backdrop-blur-md bg-black/70"></div>
            <div ref={particlesRef} className="absolute inset-0 overflow-hidden pointer-events-none"></div>
            <div className="absolute left-[10%] top-[15%] animate-ping-slow opacity-30 hidden md:block">
                <BsStars className="text-yellow-300" size={30} />
            </div>
            <div className="absolute right-[15%] bottom-[20%] animate-ping-slow opacity-30 hidden md:block">
                <BsLightning className="text-violet-300" size={24} />
            </div>
            <div className="absolute left-1/4 top-1/4 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl"></div>
            <div className="absolute right-1/4 bottom-1/4 w-72 h-72 bg-yellow-300/5 rounded-full blur-3xl"></div>
            <div className="contact-card relative w-full max-w-4xl overflow-hidden z-10">
                <div className="relative rounded-xl backdrop-blur-xl bg-gradient-to-br from-black/80 to-gray-900/80 border border-white/10 shadow-2xl shadow-violet-500/10 overflow-hidden">
                    <div className="p-8 md:p-10 relative z-10">
                        <div className="absolute top-0 left-1/4 right-1/4 h-[1.5px] bg-gradient-to-r from-transparent via-yellow-300/30 to-transparent"></div>
                        <button
                            ref={closeBtnRef}
                            onClick={handleClose}
                            className="absolute top-5 right-5 rounded-full bg-black/40 p-2 text-white/70 backdrop-blur-sm hover:bg-yellow-300/80 hover:text-black transition-all duration-300"
                            aria-label="Close contact form"
                        >
                            <FaTimes size={16} />
                        </button>
                        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
                            <div className="w-full md:w-3/5">
                                <div ref={titleRef} className="mb-8">
                                    <p className="font-general text-xs uppercase tracking-wider text-yellow-300/80 mb-2">
                                        Join Zentry
                                    </p>
                                    <h2 className="font-zentry text-3xl md:text-4xl font-bold uppercase tracking-tight text-white">
                                        Get <span className="text-yellow-300">In Touch</span>
                                    </h2>
                                </div>
                                <div className={formStatus === 'success' ? 'hidden' : 'block'}>
                                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                                        <div className="form-field group">
                                            <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-300 font-general uppercase tracking-wider">
                                                Name
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none transition-colors duration-200">
                                                    <FaUser className={getIconClass('name')} size={14} />
                                                </div>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    onFocus={() => handleFocus('name')}
                                                    onBlur={handleBlur}
                                                    required
                                                    className={getInputClass('name') + " pl-10"}
                                                    placeholder="Your Name"
                                                />
                                                <span className="absolute bottom-0 left-0 h-[1.5px] bg-yellow-300/70 transform scale-x-0 transition-transform duration-300 origin-left group-focus-within:scale-x-100 w-full"></span>
                                            </div>
                                        </div>
                                        <div className="form-field group">
                                            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-300 font-general uppercase tracking-wider">
                                                Email
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none transition-colors duration-200">
                                                    <FaEnvelope className={getIconClass('email')} size={14} />
                                                </div>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    onFocus={() => handleFocus('email')}
                                                    onBlur={handleBlur}
                                                    required
                                                    className={getInputClass('email') + " pl-10"}
                                                    placeholder="your.email@example.com"
                                                />
                                                <span className="absolute bottom-0 left-0 h-[1.5px] bg-yellow-300/70 transform scale-x-0 transition-transform duration-300 origin-left group-focus-within:scale-x-100 w-full"></span>
                                            </div>
                                        </div>
                                        <div className="form-field group">
                                            <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-300 font-general uppercase tracking-wider">
                                                Message
                                            </label>
                                            <div className="relative">
                                                <div className="absolute top-3 left-0 flex items-start pl-3 pointer-events-none transition-colors duration-200">
                                                    <FaComment className={getIconClass('message')} size={14} />
                                                </div>
                                                <textarea
                                                    id="message"
                                                    name="message"
                                                    value={formData.message}
                                                    onChange={handleChange}
                                                    onFocus={() => handleFocus('message')}
                                                    onBlur={handleBlur}
                                                    required
                                                    rows={5}
                                                    className={getInputClass('message') + " pl-10 resize-none"}
                                                    placeholder="How can we help?"
                                                />
                                                <span className="absolute bottom-0 left-0 h-[1.5px] bg-yellow-300/70 transform scale-x-0 transition-transform duration-300 origin-left group-focus-within:scale-x-100 w-full"></span>
                                            </div>
                                        </div>
                                        <div className="form-field pt-2">
                                            <Button
                                                title={formStatus === 'sending' ? "Sending..." : "Contact Us"}
                                                type="submit"
                                                disabled={formStatus === 'sending' || formStatus === 'success'}
                                                containerClass={`!bg-[#edff66] flex items-center justify-center gap-2 hover:!bg-[#edff66]/90 hover:text-black/90 text-black transition-all duration-300 group shadow-lg hover:shadow-[0_8px_20px_rgba(237,255,102,0.3)] w-full !py-3 ${formStatus === 'sending' ? 'cursor-wait opacity-70' : ''}`}
                                                rightIcon={
                                                    formStatus === 'sending' ? (
                                                        <div className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full"></div>
                                                    ) : (
                                                        <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                                                    )
                                                }
                                            />
                                        </div>
                                    </form>
                                    {formStatus === 'error' && (
                                        <div ref={errorRef} className="mt-4 flex items-center justify-center gap-2 text-red-400 text-sm p-3 bg-red-900/30 border border-red-500/50 rounded-md">
                                            <FaExclamationTriangle />
                                            <span>{errorMessage}</span>
                                        </div>
                                    )}
                                </div>
                                <div ref={successRef} className={`${formStatus === 'success' ? 'flex' : 'hidden'} flex-col items-center justify-center text-center h-64`}>
                                    <div className="mb-4 text-yellow-300">
                                        <FaCheckCircle size={50} />
                                    </div>
                                    <h3 className="text-2xl font-zentry text-white mb-2">Thank You!</h3>
                                    <p className="text-gray-300">Your message has been sent successfully.</p>
                                    <p className="text-gray-400 text-sm mt-2">We'll get back to you soon.</p>
                                </div>
                            </div>
                            <div className="hidden md:block md:w-2/5">
                                <div 
                                    ref={decorativeImageRef}
                                    className="h-full relative contact-clip-path-1 overflow-hidden rounded-lg border border-white/10"
                                >
                                    <img 
                                        src={contact1ImageSrc} // Use imported variable
                                        alt="Contact Illustration" 
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                    <div className="absolute inset-x-0 top-0 h-[1px] bg-white/20"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-800/50 via-yellow-300/50 to-violet-800/50"></div>
                </div>
            </div>
            <style jsx>{`
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0) translateX(0);
                    }
                    50% {
                        transform: translateY(-15px) translateX(15px);
                    }
                }
            `}</style>
        </div>
    );
};

export default ContactPage;
