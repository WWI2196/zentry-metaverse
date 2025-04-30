import { useState } from "react";
import { 
  FaDiscord, 
  FaTwitter, 
  FaYoutube, 
  FaMedium, 
  FaChevronUp, 
  FaEnvelope,
  FaInstagram,
  FaTiktok,
  FaArrowRight
} from "react-icons/fa";
import Button from "./Button";

const socialLinks = [
  { href: "https://discord.com", icon: <FaDiscord size={20} />, label: "Discord" },
  { href: "https://twitter.com", icon: <FaTwitter size={20} />, label: "Twitter" },
  { href: "https://youtube.com", icon: <FaYoutube size={20} />, label: "YouTube" },
  { href: "https://medium.com", icon: <FaMedium size={20} />, label: "Medium" },
  { href: "https://instagram.com", icon: <FaInstagram size={20} />, label: "Instagram" },
  { href: "https://tiktok.com", icon: <FaTiktok size={20} />, label: "TikTok" },
];

const footerLinks = [
  {
    title: "About",
    links: [
      { href: "#about", text: "Our Story" },
      { href: "#features", text: "Features" },
      { href: "/coming-soon", text: "Roadmap" },
      { href: "/contact-us", text: "Contact" },
    ]
  },
  {
    title: "Resources",
    links: [
      { href: "#", text: "Documentation" },
      { href: "#", text: "Support" },
      { href: "#", text: "Blog" },
      { href: "#", text: "Community" },
    ]
  },
  {
    title: "Legal",
    links: [
      { href: "#privacy-policy", text: "Privacy Policy" },
      { href: "#", text: "Terms of Service" },
      { href: "#", text: "Cookie Policy" },
      { href: "#", text: "GDPR" },
    ]
  }
];

const Footer = () => {
  const [email, setEmail] = useState("");
  
  const handleSubscribe = (e) => {
    e.preventDefault();
    // Implementation for newsletter subscription
    console.log("Subscribed with:", email);
    setEmail("");
    // You could add a toast notification here
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <footer className="relative w-screen bg-gradient-to-b from-[#5542ff] to-[#4335dc] pt-16 text-white">
      {/* Back to top button */}
      <button 
        onClick={scrollToTop} 
        className="absolute -top-6 left-1/2 -translate-x-1/2 size-12 rounded-full bg-[#edff66] flex-center transform transition-transform hover:scale-110 shadow-glow-sm"
        aria-label="Scroll to top"
      >
        <FaChevronUp size={20} className="text-[#5542ff]" />
      </button>

      <div className="container mx-auto px-4">
        {/* Main footer content */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand section */}
          <div className="flex flex-col space-y-4">
            <h2 className="special-font text-xl font-bold uppercase">
              N<b>o</b>va
            </h2>
            <p className="font-circular-web text-sm text-white/80 max-w-xs">
              Building the next generation of immersive digital experiences. Join us on our journey to redefine the future of technology.
            </p>
            
            {/* Social links */}
            <div className="flex flex-wrap gap-3 mt-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="group size-10 rounded-full border border-white/20 bg-white/10 flex-center transition-all duration-300 hover:bg-[#edff66] hover:border-[#edff66] hover:text-[#5542ff] hover:shadow-glow-xs"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link categories */}
          {footerLinks.map((category, idx) => (
            <div key={idx} className="flex flex-col space-y-4">
              <h3 className="font-general text-md uppercase tracking-wider">{category.title}</h3>
              <ul className="space-y-2">
                {category.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <a 
                      href={link.href} 
                      className="text-sm text-white/70 transition-colors duration-300 hover:text-[#edff66]"
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-general text-md uppercase tracking-wider">Newsletter</h3>
            <p className="text-sm text-white/70">Stay updated with our latest developments</p>
            
            <form onSubmit={handleSubscribe} className="mt-2 flex flex-col space-y-2">
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="w-full rounded-lg border border-white/20 bg-white/5 py-2 pl-10 pr-4 text-sm placeholder-white/40 backdrop-blur-sm focus:border-[#edff66]/50 focus:outline-none focus:ring-1 focus:ring-[#edff66]/20"
                />
              </div>
              <Button
                title={<span className="inline-flex items-center">Subscribe <FaArrowRight className="ml-2" size={12} /></span>}
                containerClass="!bg-[#edff66] text-[#5542ff] hover:shadow-glow-sm self-start"
                onClick={handleSubscribe}
              />
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

        {/* Bottom footer */}
        <div className="py-6 flex flex-col-reverse items-center gap-4 md:flex-row md:justify-between">
          <p className="text-center text-xs font-light text-white/70 md:text-left">
            ©Nova {new Date().getFullYear()}. All rights reserved
          </p>
          
          <div className="flex items-center space-x-4 text-xs text-white/70">
            <span className="hidden md:inline-block">Made with ❤️ in the Digital Universe</span>
            <span className="hidden md:inline-block">•</span>
            <a href="#privacy-policy" className="hover:text-white transition-colors">Privacy</a>
            <a href="#terms" className="hover:text-white transition-colors">Terms</a>
            <a href="#cookies" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;