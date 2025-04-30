import React, { useRef, useState, useEffect } from 'react'
import Button from './Button';
import { TiLocationArrow } from 'react-icons/ti';
import { FaVolumeMute, FaBars, FaTimes } from 'react-icons/fa';
import { useWindowScroll } from 'react-use';
import gsap from 'gsap';

const navItems = [
  { label: 'Nexus', href: '#nexus' },
  { label: 'Vaukt', href: '#vaukt' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

const isSafeHash = (hash) => {
  return navItems.some(item => item.href === hash);
};

const Navbar = () => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [lastScrollY, setlastScrollY] = useState(0);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [menuItemsVisible, setMenuItemsVisible] = useState(false);
  const [audioPosition, setAudioPosition] = useState(0);

  const navContainerRef = useRef(null);
  const audioElementRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const menuItemsRef = useRef(null);
  const observerRef = useRef(null);
  const observedElementsRef = useRef(new Map());

  const { y: currentScrollY } = useWindowScroll();

  useEffect(() => {
    if (!navContainerRef.current) return;

    const glassStyles = "bg-black/25 backdrop-blur-md";
    
    if (currentScrollY === 0) {
      setIsNavVisible(true);
      navContainerRef.current.className = `fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6 rounded-xl ${glassStyles}`;
    }
    else if (currentScrollY > lastScrollY) {
      setIsNavVisible(false);
      navContainerRef.current.className = `fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6 rounded-xl ${glassStyles} shadow-lg`;
    }
    else if (currentScrollY < lastScrollY) {
      setIsNavVisible(true);
      navContainerRef.current.className = `fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6 rounded-xl ${glassStyles} shadow-lg`;
    }
    setlastScrollY(currentScrollY);
  }, [currentScrollY, lastScrollY]);

  useEffect(() => {
    if (!navContainerRef.current) return;
    
    gsap.to(navContainerRef.current, {
      y: isNavVisible ? 0 : -100,
      opacity: isNavVisible ? 1 : 0,
      ease: 'power2.out',
      duration: 0.5,
    });
  }, [isNavVisible]);

  useEffect(() => {
    if (!mobileMenuRef.current) return;
    
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
      
      gsap.to(mobileMenuRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: 'power2.out',
        display: 'flex',
        onComplete: () => {
          setMenuItemsVisible(true);
        }
      });
    } else {
      document.body.style.overflow = '';
      
      setMenuItemsVisible(false);
      
      setTimeout(() => {
        if (mobileMenuRef.current) {
          gsap.to(mobileMenuRef.current, {
            opacity: 0,
            y: -20,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
              if (mobileMenuRef.current) {
                mobileMenuRef.current.style.display = 'none';
              }
            }
          });
        }
      }, 200);
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observedElementsRef.current.clear();

    const options = {
      root: null,
      rootMargin: "-80px 0px -40% 0px",
      threshold: 0.1,
    };

    const handleIntersect = (entries) => {
      let currentActiveSection = '';
      let highestVisibleEntry = null;

      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!highestVisibleEntry || entry.boundingClientRect.top < highestVisibleEntry.boundingClientRect.top) {
            highestVisibleEntry = entry;
          }
        }
      });

      if (highestVisibleEntry) {
        currentActiveSection = observedElementsRef.current.get(highestVisibleEntry.target) || '';
      }
      
      const bottomThreshold = document.body.offsetHeight - window.innerHeight - 150;
      if (window.scrollY >= bottomThreshold) {
          const contactSection = document.querySelector('#contact');
          if (contactSection && observedElementsRef.current.has(contactSection)) {
              const contactEntry = entries.find(entry => entry.target === contactSection);
              if (contactEntry && contactEntry.isIntersecting) {
                  currentActiveSection = 'Contact';
              }
          }
      }
      
      if (window.scrollY < 100) {
          currentActiveSection = '';
      }

      setActiveSection(currentActiveSection);
    };

    observerRef.current = new IntersectionObserver(handleIntersect, options);
    const { current: observer } = observerRef;

    navItems.forEach(item => {
      const section = document.querySelector(item.href);
      if (section) {
        observer.observe(section);
        observedElementsRef.current.set(section, item.label);
      }
    });

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [mobileOpen]);

  const handleNavClick = (e, href) => {
    if (!isSafeHash(href)) {
      e.preventDefault();
      return;
    }
    setMobileOpen(false);
    const section = document.querySelector(href);
    if (section) {
      e.preventDefault();
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleAudioIndicator = () => {
    if (audioError) {
      console.warn("Audio cannot be played due to an error");
      return;
    }
    setIsAudioPlaying((prev) => !prev);
    setIsIndicatorActive((prev) => !prev);
  }

  useEffect(() => {
    const audioEl = audioElementRef.current;
    if (!audioEl) return;
    const handleError = (e) => {
      console.error("Audio error:", e);
      setAudioError(true);
      setIsAudioPlaying(false);
      setIsIndicatorActive(false);
    };
    audioEl.addEventListener("error", handleError);

    const handleTimeUpdate = () => {
      setAudioPosition(audioEl.currentTime);
    };
    audioEl.addEventListener("timeupdate", handleTimeUpdate);

    if (isAudioPlaying) {
      try {
        audioEl.currentTime = audioPosition;
        audioEl.play().catch(e => {
          console.error("Failed to play audio:", e);
          setAudioError(true);
          setIsAudioPlaying(false);
          setIsIndicatorActive(false);
        });
      } catch (e) {
        console.error("Exception when playing audio:", e);
        setAudioError(true);
        setIsAudioPlaying(false);
        setIsIndicatorActive(false);
      }
    } else if (audioEl) {
      try {
        setAudioPosition(audioEl.currentTime);
        audioEl.pause();
      } catch (e) {
        console.error("Exception when pausing audio:", e);
      }
    }
    return () => {
      if (audioEl) {
        audioEl.removeEventListener("error", handleError);
        audioEl.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, [isAudioPlaying]);

  return (
    <>
      <div
        ref={navContainerRef}
        className="fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6 bg-black/25 backdrop-blur-md shadow-lg rounded-xl"
        style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)' }}
        aria-label="Main navigation"
      >
        <header className='absolute top-1/2 w-full -translate-y-1/2'>
          <nav className='flex size-full items-center justify-between px-4 py-2'>
            <div className='flex items-center gap-4'>
              <img
                src="/img/logo.png"
                alt="logo"
                className="w-10 transition-transform duration-300 hover:scale-110"
                tabIndex={0}
              />
              <Button
                id='product-button'
                title='Products'
                rightIcon={<TiLocationArrow className="transition-transform duration-300 group-hover:translate-x-1" />}
                containerClass='bg-white/90 text-black lg:flex hidden items-center justify-center gap-1 hover:!bg-[#edff66] transition-colors duration-300'
              />
            </div>

            <div className='hidden h-full items-center lg:flex ml-auto'>
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`relative font-general text-sm uppercase mx-3 transition-all duration-200 ease-in-out ${
                    activeSection === item.label
                      ? 'text-[#edff66]/80 font-medium'
                      : 'text-white'
                  } hover:text-[#edff66]/80`}
                  style={{ textShadow: '0px 1px 2px rgba(0, 0, 0, 0.3)' }}
                  aria-current={activeSection === item.label ? "page" : undefined}
                  onClick={e => handleNavClick(e, item.href)}
                >
                  {item.label}
                  {activeSection === item.label && (
                    <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-[#edff66]
                                   animate-[pulse_2s_ease-in-out_infinite]"></span>
                  )}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3 md:ml-6">
              <div className="relative group">
                <button
                  className={`flex items-center justify-center gap-2 rounded-full p-2 transition-all duration-300
                    ${isAudioPlaying
                      ? 'bg-[#edff66]/30 ring-2 ring-[#edff66]'
                      : 'bg-blue-200/10 backdrop-blur-sm text-white hover:bg-[#edff66]/20'}`}
                  onClick={toggleAudioIndicator}
                  aria-label="Toggle music"
                  disabled={audioError}
                >
                  {!isAudioPlaying ? (
                    <FaVolumeMute className="text-xl text-white" />
                  ) : (
                    <div className='flex h-4 items-center space-x-0.5 px-1'>
                      <audio
                        ref={audioElementRef}
                        src="/audio/loop.mp3"
                        preload="auto"
                        className='hidden'
                        loop
                      />
                      {[1, 2, 3, 4, 5, 6].map((bar) => (
                        <div
                          key={bar}
                          className="indicator-line active"
                          style={{
                            animationDelay: `${bar * 0.1}s`,
                            backgroundColor: '#edff66',
                            height: '12px',
                            width: '2px',
                            borderRadius: '1px'
                          }}
                        />
                      ))}
                    </div>
                  )}
                </button>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-xs font-general text-white/70">
                  {audioError ? 'Audio Unavailable' : isAudioPlaying ? 'Music On' : 'Music Off'}
                </div>
              </div>

              <button
                className={`lg:hidden p-2 rounded-full transition-all duration-300 ${
                  mobileOpen
                    ? 'bg-[#edff66]/80 text-black'
                    : 'bg-blue-200/10 backdrop-blur-sm text-white hover:bg-[#edff66]/50'
                }`}
                onClick={() => setMobileOpen((v) => !v)}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
              </button>
            </div>
          </nav>
        </header>
      </div>

      <div
        ref={mobileMenuRef}
        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md overflow-y-auto"
        style={{
          display: 'none',
          opacity: 0
        }}
        aria-modal="true"
        role="dialog"
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-6 right-6 p-3 rounded-full bg-[#edff66]/80 text-black hover:bg-[#edff66] shadow-lg transition-all duration-300 hover:scale-105 z-50"
          aria-label="Close mobile menu"
        >
          <FaTimes size={24} />
        </button>

        <div
          ref={menuItemsRef}
          className="flex min-h-[100dvh] w-full flex-col items-center justify-center px-6 py-16"
        >
          {menuItemsVisible && navItems.map((item, index) => (
            <a
              key={item.label}
              href={item.href}
              className={`relative text-xl sm:text-2xl md:text-3xl font-zentry my-3 sm:my-4 py-2 px-4 transition-all duration-300
                ${activeSection === item.label ? 'text-[#edff66]' : 'text-white'}
                hover:text-[#edff66] hover:scale-110`}
              style={{
                animation: `fadeInUp 0.5s ease-out ${index * 0.1}s forwards`,
                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
              }}
              onClick={e => handleNavClick(e, item.href)}
              aria-current={activeSection === item.label ? "page" : undefined}
            >
              {item.label}
              {activeSection === item.label && (
                <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-[#edff66]
                              animate-[pulse_2s_ease-in-out_infinite]"></span>
              )}
            </a>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </>
  );
}

export default Navbar