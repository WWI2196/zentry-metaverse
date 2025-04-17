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
  const [activeSection, setActiveSection] = useState(''); // No section active initially

  const navContainerRef = useRef(null);
  const audioElementRef = useRef(null);

  const { y: currentScrollY } = useWindowScroll();

  // Updated scroll logic to maintain semi-transparent navbar
  useEffect(() => {
    if (!navContainerRef.current) return;

    // Improved glass-morphism styles with better opacity
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
    const handleScroll = () => {
      let found = '';
      // Only set active section when user has scrolled to a section
      navItems.forEach(item => {
        const section = document.querySelector(item.href);
        if (section && window.scrollY >= section.offsetTop - 80) {
          found = item.label;
        }
      });
      setActiveSection(found);
    };
    window.addEventListener('scroll', handleScroll);
    // Initial check to set active section if page loaded at a specific position
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    if (isAudioPlaying) {
      try {
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
        audioEl.pause();
      } catch (e) {
        console.error("Exception when pausing audio:", e);
      }
    }
    return () => {
      if (audioEl) {
        audioEl.removeEventListener("error", handleError);
      }
    };
  }, [isAudioPlaying]);

  return (
    <div
      ref={navContainerRef}
      className="fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6 bg-black/25 backdrop-blur-md shadow-lg rounded-xl"
      style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)' }}
      aria-label="Main navigation"
    >
      <header className='absolute top-1/2 w-full -translate-y-1/2'>
        <nav className='flex size-full items-center justify-between px-4 py-2'>
          {/* Logo and Products Button */}
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
              containerClass='bg-blue-50/90 md:flex hidden items-center justify-center gap-1 hover:bg-yellow-300/80 hover:text-black/80 transition-colors duration-300'
            />
          </div>

          {/* Navigation Items - Right aligned with proper spacing */}
          <div className='hidden h-full items-center md:flex ml-auto'>
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`relative font-general text-xs uppercase mx-3 transition-all duration-200 ease-in-out ${
                  activeSection === item.label
                    ? 'text-yellow-300 font-medium'
                    : 'text-white'
                } hover:text-yellow-300/80`}
                style={{ textShadow: '0px 1px 2px rgba(0, 0, 0, 0.3)' }}
                aria-current={activeSection === item.label ? "page" : undefined}
                onClick={e => handleNavClick(e, item.href)}
              >
                {item.label}
                {activeSection === item.label && (
                  <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-yellow-300 
                                 animate-[pulse_2s_ease-in-out_infinite]"></span>
                )}
              </a>
            ))}
          </div>

          {/* Audio Controls and Mobile Menu Button */}
          <div className="flex items-center gap-3 md:ml-6">
            <div className="relative group">
              <button
                className={`flex items-center justify-center gap-2 rounded-full p-2 transition-all duration-300 
                  ${isAudioPlaying
                    ? 'bg-yellow-300/30 ring-2 ring-yellow-300'
                    : 'bg-blue-200/10 backdrop-blur-sm text-white hover:bg-yellow-300/20'}`}
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
              className="md:hidden p-2 rounded-full bg-white/20 backdrop-blur hover:bg-yellow-300/30 transition-all duration-300"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu with improved animations */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center transition-all">
          <div className="flex flex-col items-center justify-center w-full gap-6 animate-[fadeIn_0.3s_ease-out]">
            {navItems.map((item, index) => (
              <a
                key={item.label}
                href={item.href}
                className={`text-2xl font-zentry my-1 transition-all opacity-0 animate-[slideUp_0.5s_ease-out_forwards]`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={e => handleNavClick(e, item.href)}
                aria-current={activeSection === item.label ? "page" : undefined}
              >
                <span className={activeSection === item.label ? 'text-yellow-300' : 'text-white'}>
                  {item.label}
                </span>
                {activeSection === item.label && (
                  <span className="block h-0.5 w-full bg-yellow-300 mt-1 animate-[width_0.3s_ease-in-out]"></span>
                )}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar