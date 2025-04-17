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
  const [activeSection, setActiveSection] = useState('Nexus');

  const navContainerRef = useRef(null);
  const audioElementRef = useRef(null);

  const { y: currentScrollY } = useWindowScroll();

  useEffect(() => {
    if ((currentScrollY === 0)) {
      setIsNavVisible(true);
      navContainerRef.current.classList.remove('floating-nav');
    }
    else if (currentScrollY > lastScrollY) {
      setIsNavVisible(false);
      navContainerRef.current.classList.add('floating-nav');
    }
    else if (currentScrollY < lastScrollY) {
      setIsNavVisible(true);
      navContainerRef.current.classList.add('floating-nav');
    }
    setlastScrollY(currentScrollY);
  }, [currentScrollY, lastScrollY]);

  useEffect(() => {
    gsap.to(navContainerRef.current, {
      y: isNavVisible ? 0 : -100,
      opacity: isNavVisible ? 1 : 0,
      ease: 'power2.out',
    });
  }, [isNavVisible]);

  useEffect(() => {
    const handleScroll = () => {
      let found = navItems[0].label;
      navItems.forEach(item => {
        const section = document.querySelector(item.href);
        if (section && window.scrollY >= section.offsetTop - 80) {
          found = item.label;
        }
      });
      setActiveSection(found);
    };
    window.addEventListener('scroll', handleScroll);
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
      className="fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6 bg-white/20 backdrop-blur-md shadow-lg rounded-xl"
      style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)' }}
      aria-label="Main navigation"
    >
      <header className='absolute top-1/2 w-full -translate-y-1/2'>
        <nav className='flex size-full items-center justify-between p-4'>
          <div className='flex items-center gap-7'>
            <img
              src="/img/logo.png"
              alt="logo"
              className="w-10 transition-transform duration-300 hover:scale-110"
              tabIndex={0}
            />
            <Button
              id='product-button'
              title='Products'
              rightIcon={<TiLocationArrow />}
              containerClass='bg-blue-50 md:flex hidden items-center justify-center gap-1'
            />
          </div>

          <div className='hidden h-full items-center gap-5 md:flex'>
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`nav-hover-btn transition-colors duration-200 ${
                  activeSection === item.label
                    ? 'text-yellow-300 after:bg-yellow-300'
                    : ''
                }`}
                aria-current={activeSection === item.label ? "page" : undefined}
                onClick={e => handleNavClick(e, item.href)}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="relative ml-6 group">
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
            className="md:hidden ml-4 p-2 rounded-full bg-white/20 backdrop-blur hover:bg-yellow-300/30 transition"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </nav>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center transition-all">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`text-2xl font-zentry my-4 transition-colors ${
                activeSection === item.label ? 'text-yellow-300' : 'text-white'
              }`}
              onClick={e => handleNavClick(e, item.href)}
              aria-current={activeSection === item.label ? "page" : undefined}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default Navbar