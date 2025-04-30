import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import About from './components/About';
import Hero from './components/Hero';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './components/Navbar';
import Features from './components/Features';
import ComingSoon from './components/ComingSoon';
import Story from './components/Story';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ContactPage from './components/ContactPage'; // Import the new ContactPage component

// Register ScrollTrigger at the app level
gsap.registerPlugin(ScrollTrigger);

// Main HomePage component that contains all the current sections
const HomePage = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Features />
      <Story />
      <Contact />
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <Router basename="/zentry-metaverse">
      <main className="relative min-h-screen w-screen overflow-x-hidden">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/contact-us" element={<ContactPage />} /> {/* Add route for ContactPage */}
        </Routes>
      </main>
    </Router>
  );
};

export default App;