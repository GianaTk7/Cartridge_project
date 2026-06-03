import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const navItems = ['HOME', 'ABOUT US', 'OUR SERVICES', 'OUR PORTFOLIO', 'CONTACT US'];

  // Auto slide images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const scrollToSection = (section) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo" style={{ color: '#fff' }}>
            PAGE
          </div>
          <button className="hamburger" onClick={toggleSidebar}>
            <span></span>
            <span></span>
            <span></span>
          </button>
          <ul className="nav-links">
            {navItems.map((item, idx) => (
              <li key={idx}>
                <button 
                  className={`nav-link ${activeSection === item.toLowerCase() ? 'active' : ''}`}
                  onClick={() => scrollToSection(item.toLowerCase())}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Sidebar Component */}
      <Sidebar 
        isOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar}
        navItems={navItems}
        activeSection={activeSection}
        scrollToSection={scrollToSection}
      />

      {/* Hero Section with Slider */}
      <section id="home" className="hero">
        <div className="slider-container">
          <div className="slides" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            <div className="slide slide-1">
              {/* Image placeholder - replace with your image */}
              <div className="slide-image"></div>
            </div>
            <div className="slide slide-2">
              {/* Image placeholder - replace with your image */}
              <div className="slide-image"></div>
            </div>
            <div className="slide slide-3">
              {/* Image placeholder - replace with your image */}
              <div className="slide-image"></div>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="slide-indicators">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                className={`indicator ${currentSlide === idx ? 'active' : ''}`}
                onClick={() => goToSlide(idx)}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <button className="arrow prev" onClick={() => setCurrentSlide((prev) => (prev - 1 + 3) % 3)}>❮</button>
          <button className="arrow next" onClick={() => setCurrentSlide((prev) => (prev + 1) % 3)}>❯</button>
        </div>

        <div className="hero-content">
          <h1 className="hero-title">Game Development</h1>
          <p className="hero-text">
            Lorem Ipsum is simply dummy text of the printing and<br />
            typesetting industry
          </p>
          <button className="cta-button">GET STARTED</button>
        </div>
      </section>

    

      {/* Styles */}
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .app {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
          overflow-x: hidden;
        }

        /* Navbar Styles */
        .navbar {
          background: white;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          position: fixed;
          top: 0;
          width: 100%;
          z-index: 1000;
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          font-size: 1.5rem;
          font-weight: bold;
          letter-spacing: 1px;
          color: #333;
        }

        .nav-links {
          display: flex;
          list-style: none;
          gap: 2rem;
        }

        .nav-link {
          background: none;
          border: none;
          font-size: 0.9rem;
          cursor: pointer;
          padding: 0.5rem 0;
          color: #666;
          transition: color 0.3s;
          font-weight: 500;
        }

        .nav-link:hover {
          color: #007bff;
        }

        .nav-link.active {
          color: #007bff;
          border-bottom: 2px solid #007bff;
        }

        .hamburger {
          display: none;
          flex-direction: column;
          gap: 4px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
        }

        .hamburger span {
          width: 25px;
          height: 3px;
          background: #333;
          transition: 0.3s;
        }

        /* Sidebar Styles */
        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          z-index: 1001;
        }

        .sidebar {
          position: fixed;
          top: 0;
          right: -280px;
          width: 280px;
          height: 100%;
          background: white;
          box-shadow: -2px 0 10px rgba(0,0,0,0.1);
          transition: right 0.3s ease;
          z-index: 1002;
          padding: 2rem 1.5rem;
        }

        .sidebar.open {
          right: 0;
        }

        .close-sidebar {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          font-size: 2rem;
          cursor: pointer;
          color: #666;
        }

        .sidebar-nav {
          list-style: none;
          margin-top: 3rem;
        }

        .sidebar-nav li {
          margin-bottom: 1.5rem;
        }

        .sidebar-nav-link {
          background: none;
          border: none;
          font-size: 1.1rem;
          cursor: pointer;
          color: #333;
          transition: color 0.3s;
          font-weight: 500;
        }

        .sidebar-nav-link:hover {
          color: #007bff;
        }

        .sidebar-nav-link.active {
          color: #007bff;
        }

        /* Hero Section */
        .hero {
          margin-top: 70px;
          position: relative;
          height: calc(100vh - 70px);
          min-height: 500px;
          overflow: hidden;
        }

        .slider-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .slides {
          display: flex;
          width: 100%;
          height: 100%;
          transition: transform 0.5s ease;
        }

        .slide {
          min-width: 100%;
          height: 100%;
          position: relative;
        }

        .slide-image {
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }

        /* Slide image placeholders - REPLACE THESE WITH YOUR IMAGES */
        .slide-1 .slide-image {
          background-image: url('https://picsum.photos/id/104/1920/1080');
        }
        .slide-2 .slide-image {
          background-image: url('https://picsum.photos/id/106/1920/1080');
        }
        .slide-3 .slide-image {
          background-image: url('https://picsum.photos/id/15/1920/1080');
        }

        .slide-image::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.4);
        }

        /* Arrow buttons */
        .arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.3);
          border: none;
          font-size: 2rem;
          padding: 0.5rem 1rem;
          cursor: pointer;
          color: white;
          border-radius: 4px;
          transition: background 0.3s;
          z-index: 10;
        }

        .arrow:hover {
          background: rgba(255,255,255,0.5);
        }

        .prev {
          left: 20px;
        }

        .next {
          right: 20px;
        }

        /* Slide indicators */
        .slide-indicators {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 10px;
          z-index: 10;
        }

        .indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(255,255,255,0.5);
          border: none;
          cursor: pointer;
          transition: background 0.3s;
        }

        .indicator.active {
          background: white;
        }

        /* Hero Content */
        .hero-content {
          position: relative;
          z-index: 5;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          color: white;
          padding: 0 2rem;
          background: rgba(0,0,0,0.3);
        }

        .hero-title {
          font-size: 4rem;
          margin-bottom: 1rem;
          font-weight: bold;
        }

        .hero-text {
          font-size: 1.2rem;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .cta-button {
          background: #007bff;
          color: white;
          border: none;
          padding: 1rem 2rem;
          font-size: 1rem;
          font-weight: bold;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.3s;
        }

        .cta-button:hover {
          background: #0056b3;
        }

        /* Other sections */
        .section {
          min-height: 100vh;
          padding: 4rem 2rem;
          background: #f8f9fa;
        }

        .section:nth-child(even) {
          background: white;
        }

        .section-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-content h2 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: #333;
        }

        .section-content p {
          font-size: 1.1rem;
          color: #666;
          line-height: 1.6;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }

          .hamburger {
            display: flex;
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .hero-text {
            font-size: 1rem;
          }

          .arrow {
            font-size: 1.5rem;
            padding: 0.3rem 0.8rem;
          }

          .section {
            padding: 3rem 1.5rem;
          }

          .section-content h2 {
            font-size: 2rem;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 1.8rem;
          }

          .hero-text {
            font-size: 0.9rem;
          }

          .cta-button {
            padding: 0.8rem 1.5rem;
            font-size: 0.9rem;
          }

          .arrow {
            font-size: 1.2rem;
            padding: 0.2rem 0.6rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;