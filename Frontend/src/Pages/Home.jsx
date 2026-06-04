import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

const Home = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [brandSlideIndex, setBrandSlideIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const navItems = ['HOME', 'ABOUT US', 'OUR SERVICES', 'CONTACT US'];

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

  // Brand slideshow navigation
  const totalBrandSlides = 3;
  const nextBrandSlide = () => {
    setBrandSlideIndex((prev) => (prev + 1) % totalBrandSlides);
  };

  const prevBrandSlide = () => {
    setBrandSlideIndex((prev) => (prev - 1 + totalBrandSlides) % totalBrandSlides);
  };

  // Handle navigation - Check if on home page or need to navigate
  const handleNavigation = (item) => {
    const itemLower = item.toLowerCase();
    
    // Check if we're on the home page (path is '/' or '/home')
    const isOnHomePage = window.location.pathname === '/' || window.location.pathname === '/home';
    
    if (itemLower === 'about us') {
      // Navigate to about page
      navigate('/about');
    } else if (itemLower === 'home') {
      // Navigate to home page
      navigate('/');
      // Scroll to home section after navigation
      setTimeout(() => {
        const element = document.getElementById('home');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // For other sections, check if we're on home page
      if (isOnHomePage) {
        // Already on home page, just scroll
        setActiveSection(itemLower);
        const element = document.getElementById(itemLower);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // Navigate to home page first, then scroll
        navigate('/');
        setTimeout(() => {
          setActiveSection(itemLower);
          const element = document.getElementById(itemLower);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handle brand click - navigate to products page with brand filter
  const handleBrandClick = (brandName) => {
    navigate(`/products?brand=${brandName.toLowerCase()}`);
  };

  // Brand data (12 cartridge brands)
  const brands = [
    { name: 'HP', description: 'High-quality HP cartridges', image: 'https://picsum.photos/id/0/300/200', discount: '-24%' },
    { name: 'Canon', description: 'Original Canon cartridges', image: 'https://picsum.photos/id/1/300/200', discount: '-38%' },
    { name: 'Epson', description: 'Epson genuine cartridges', image: 'https://picsum.photos/id/2/300/200', discount: '-61%' },
    { name: 'Brother', description: 'Brother compatible cartridges', image: 'https://picsum.photos/id/3/300/200', discount: '-37%' },
    { name: 'Samsung', description: 'Samsung printer cartridges', image: 'https://picsum.photos/id/4/300/200', discount: '-25%' },
    { name: 'Lexmark', description: 'Lexmark original cartridges', image: 'https://picsum.photos/id/5/300/200', discount: '-17%' },
    { name: 'Xerox', description: 'Xerox high-yield cartridges', image: 'https://picsum.photos/id/6/300/200', discount: '-20%' },
    { name: 'Dell', description: 'Dell printer cartridges', image: 'https://picsum.photos/id/7/300/200', discount: '-26%' },
    { name: 'Kyocera', description: 'Kyocera toner cartridges', image: 'https://picsum.photos/id/8/300/200', discount: '-24%' },
    { name: 'Ricoh', description: 'Ricoh genuine cartridges', image: 'https://picsum.photos/id/9/300/200', discount: '-38%' },
    { name: 'Konica Minolta', description: 'Konica Minolta cartridges', image: 'https://picsum.photos/id/10/300/200', discount: '-61%' },
    { name: 'Sharp', description: 'Sharp printer cartridges', image: 'https://picsum.photos/id/11/300/200', discount: '-37%' },
  ];

  // Split brands into groups of 4 for slideshow
  const brandGroups = [];
  for (let i = 0; i < brands.length; i += 4) {
    brandGroups.push(brands.slice(i, i + 4));
  }

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo" style={{color: "#1b2937"}}>PAGE</div>
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
                  onClick={() => handleNavigation(item)}
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
        scrollToSection={handleNavigation}
      />

      {/* Hero Section with Slider - Banner */}
      <section id="home" className="hero">
        <div className="slider-container">
         <div className="slides" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
  <div className="slide">
    <div className="slide-image" style={{ backgroundImage: "url('/banner1.jpg')" }}></div>
  </div>
  <div className="slide">
    <div className="slide-image" style={{ backgroundImage: "url('/Untitled-1.jpg')" }}></div>
  </div>
  <div className="slide">
    <div className="slide-image" style={{ backgroundImage: "url('/Untitled.jpg')" }}></div>
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
          <h1 className="hero-title">Covenant print solution</h1>
          <p className="hero-text">
            Covenant Print Solution delivers high-quality, affordable printing services for businesses and individuals.
          </p>
          <button className="cta-button">View Services</button>
        </div>
      </section>

<section className="welcome-section">
  <div className="welcome-content">
    <h2 className="welcome-title">Welcome to Covenant Print Solution</h2>
    <p className="welcome-text">
      Covenant Print Solution is your trusted partner for high-quality printer cartridges and printing solutions in South Africa. 
      We specialize in providing original and compatible cartridges for all major printer brands including HP, Canon, Epson, Brother, 
      and Lexmark. Our commitment to quality and affordability ensures that you get the best value for your money.
    </p>
    <div className="welcome-features">
      <div className="feature">
        <h3>Quality Products</h3>
        <p>We supply only tested and reliable printer cartridges that deliver sharp, clear prints every time.</p>
      </div>
      <div className="feature">
        <h3>Affordable Prices</h3>
        <p>Get premium quality cartridges at competitive prices, helping you save on printing costs.</p>
      </div>
      <div className="feature">
        <h3>Fast Delivery</h3>
        <p>Quick and reliable shipping across South Africa, so you never run out of supplies.</p>
      </div>
    </div>
  </div>
</section>

      {/* Our Services Section with Brand Slideshow */}
      <section id="our services" className="section">
        <div className="section-content">
          <h2 style={{color: "#fff", textAlign: "center"}}>Our Services</h2>
          <p style={{color: "#ccc", textAlign: "center", marginBottom: "3rem"}}>
            We offer high-quality printer cartridges from all major brands
          </p>
          
          {/* Brand Slideshow */}
          <div className="brand-slideshow">
            <button className="brand-arrow brand-prev" onClick={prevBrandSlide}>
              ❮
            </button>
            
            <div className="brand-slides-container">
              <div 
                className="brand-slides" 
                style={{ transform: `translateX(-${brandSlideIndex * 100}%)` }}
              >
                {brandGroups.map((group, groupIdx) => (
                  <div key={groupIdx} className="brand-slide">
                    {group.map((brand, idx) => (
                      <div key={idx} className="brand-card" onClick={() => handleBrandClick(brand.name)}>
                        {brand.discount && <div className="discount-badge">{brand.discount}</div>}
                        <div className="brand-image">
                          <img src={brand.image} alt={brand.name} />
                        </div>
                        <h3 className="brand-name">{brand.name}</h3>
                        <p className="brand-description">{brand.description}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            
            <button className="brand-arrow brand-next" onClick={nextBrandSlide}>
              ❯
            </button>
          </div>
          
          {/* Slide indicators for brands */}
          <div className="brand-indicators">
            {brandGroups.map((_, idx) => (
              <button
                key={idx}
                className={`brand-indicator ${brandSlideIndex === idx ? 'active' : ''}`}
                onClick={() => setBrandSlideIndex(idx)}
              />
            ))}
          </div>
        </div>
      </section>
   
      <section id="contact us" className="section">
        <div className="section-content">
          <h2 style={{color: "#fff", textAlign: "center"}}>Contact Us</h2>
          <p style={{color: "#ccc", textAlign: "center", marginBottom: "3rem"}}>
            Get in touch with us for any inquiries, support, or feedback
          </p>
          
          <div className="contact-container">
            {/* Contact Information */}
            <div className="contact-info">
              <h3>Contact Information</h3>
              
              <div className="contact-detail">
                <div>
                  <strong>Phone:</strong>
                  <p>Tel: 078 780 3035</p>
                  <p>WhatsApp: 078 780 3035</p>
                </div>
              </div>
              
              <div className="contact-detail">
                <div>
                  <strong>Address:</strong>
                  <p>115 Blairgowrie Dr, Blairgowrie, Randburg, 2194</p>
                  <p>Gauteng, South Africa</p>
                </div>
              </div>
              
              <div className="contact-detail">
                <div>
                  <strong>Email:</strong>
                  <p>Covenantprintsolution@gmail.com</p>
                  <p>Response within 24 hours</p>
                </div>
              </div>
              
              <div className="contact-detail">
                <div>
                  <strong>Business Hours:</strong>
                  <p>Monday – Friday: 08:00 – 16:30</p>
                  <p>Saturday: 08:00 – 13:00</p>
                  <p>Sunday: Closed</p>
                  <p>Public Holidays: Closed</p>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="contact-form">
              <h3>Send Us a Message</h3>
              <form>
                <div className="form-group">
                  <input type="text" placeholder="Your Name" required />
                </div>
                <div className="form-group">
                  <input type="email" placeholder="Your Email" required />
                </div>
                <div className="form-group">
                  <input type="tel" placeholder="Phone Number (optional)" />
                </div>
                <div className="form-group">
                  <select>
                    <option>Subject: General Inquiry</option>
                    <option>Product Support</option>
                    <option>Order Status</option>
                    <option>Return/Refund</option>
                    <option>Wholesale Inquiry</option>
                  </select>
                </div>
                <div className="form-group">
                  <textarea rows="5" placeholder="Your Message..."></textarea>
                </div>
                <button type="submit" className="submit-btn">Send Message</button>
              </form>
            </div>
          </div>
          
          {/* Map Section */}
          <div className="map-section">
            <h3>Find Us Here</h3>
            <div className="map-container">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3586.456789012345!2d28.01234567890123!3d-26.12345678901234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e957123456789ab%3A0x123456789abcdef!2s115%20Blairgowrie%20Dr%2C%20Blairgowrie%2C%20Randburg%2C%202194!5e0!3m2!1sen!2sza!4v1234567890123!5m2!1sen!2sza" 
                width="100%" 
                height="300" 
                style={{border: 0, borderRadius: "8px"}} 
                allowFullScreen="" 
                loading="lazy"
                title="Our Location Map"
              ></iframe>
            </div>
          </div>
          
          {/* Policies Section */}
          <div className="policies-section">
            <h3>Our Policies</h3>
            <div className="policies-grid">
              <a href="#About" className="policy-link"> About Us</a>
              <a href="#payment" className="policy-link"> Payment Methods</a>
              <a href="#shipping" className="policy-link"> Shipping Policy</a>
              <a href="#returns" className="policy-link"> Return Policy</a>
              <a href="#terms" className="policy-link"> Terms & Conditions</a>
              <a href="#privacy" className="policy-link"> Privacy Policy</a>
            </div>
          </div>
        </div>
      </section>

      {/* Styles - Same as before with added discount badge */}
      <style jsx>{`
        /* Add discount badge styles */
        .brand-card {
          cursor: pointer;
          position: relative;
        }
        
        .discount-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #ff4444;
          color: white;
          padding: 5px 10px;
          border-radius: 5px;
          font-size: 0.8rem;
          font-weight: bold;
          z-index: 1;
        }
        
        /* Rest of the styles remain the same as previous */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .app {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
          overflow-x: hidden;
        }

        .navbar {
          background: #1b2937;
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
          color: #fff;
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
          color: #fff;
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
          background: #fff;
          transition: 0.3s;
        }

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
          background: #1b2937;
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
          color: #fff;
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
          color: #fff;
          transition: color 0.3s;
          font-weight: 500;
        }

        .sidebar-nav-link:hover {
          color: #007bff;
        }

        .sidebar-nav-link.active {
          color: #007bff;
        }

        .hero {
          margin-top: 70px;
          position: relative;
          height: 80vh;
          min-height: 600px;
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


        .slide-image::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.4);
        }

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

        .welcome-section {
          padding: 5rem 2rem;
          background: #f8f9fa;
        }

        .welcome-content {
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
        }

        .welcome-title {
          font-size: 2.5rem;
          color: #333;
          margin-bottom: 1.5rem;
        }

        .welcome-text {
          font-size: 1.1rem;
          color: #666;
          line-height: 1.8;
          max-width: 800px;
          margin: 0 auto 3rem auto;
        }

        .welcome-features {
          display: flex;
          gap: 2rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .feature {
          flex: 1;
          min-width: 250px;
          padding: 2rem;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          transition: transform 0.3s;
        }

        .feature:hover {
          transform: translateY(-5px);
        }

        .feature h3 {
          font-size: 1.5rem;
          color: #007bff;
          margin-bottom: 1rem;
        }

        .feature p {
          color: #666;
          line-height: 1.6;
        }

        .brand-slideshow {
          position: relative;
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 2rem 0;
        }

        .brand-slides-container {
          flex: 1;
          overflow: hidden;
        }

        .brand-slides {
          display: flex;
          transition: transform 0.5s ease;
        }

        .brand-slide {
          min-width: 100%;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          padding: 0.5rem;
        }

        .brand-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          transition: transform 0.3s, box-shadow 0.3s;
          text-align: center;
          padding-bottom: 1.5rem;
          cursor: pointer;
          position: relative;
        }

        .brand-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }

        .discount-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #ff4444;
          color: white;
          padding: 5px 10px;
          border-radius: 5px;
          font-size: 0.8rem;
          font-weight: bold;
          z-index: 1;
        }

        .brand-image {
          width: 100%;
          height: 200px;
          overflow: hidden;
          background: #f0f0f0;
        }

        .brand-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }

        .brand-card:hover .brand-image img {
          transform: scale(1.05);
        }

        .brand-name {
          font-size: 1.3rem;
          font-weight: bold;
          color: #333;
          margin: 1rem 0 0.5rem;
        }

        .brand-description {
          font-size: 0.9rem;
          color: #666;
          padding: 0 1rem;
          line-height: 1.4;
        }

        .brand-arrow {
          background: #007bff;
          border: none;
          font-size: 1.8rem;
          padding: 0.5rem 1rem;
          cursor: pointer;
          color: white;
          border-radius: 50%;
          transition: background 0.3s;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .brand-arrow:hover {
          background: #0056b3;
        }

        .brand-indicators {
          display: flex;
          justify-content: center;
          gap: 0.8rem;
          margin-top: 2rem;
        }

        .brand-indicator {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(255,255,255,0.4);
          border: none;
          cursor: pointer;
          transition: background 0.3s;
        }

        .brand-indicator.active {
          background: #007bff;
          width: 25px;
          border-radius: 5px;
        }

        .section {
          min-height: 60vh;
          padding: 4rem 2rem;
          background: #1b2937;
        }

        .section-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-content h2 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        /* Contact Section Styles */
        .contact-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          margin-bottom: 3rem;
        }

        .contact-info h3,
        .contact-form h3,
        .map-section h3,
        .policies-section h3 {
          color: #fff;
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #007bff;
          display: inline-block;
        }

        .contact-detail {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: rgba(255,255,255,0.05);
          border-radius: 8px;
          transition: transform 0.3s;
        }

        .contact-detail:hover {
          transform: translateX(5px);
          background: rgba(255,255,255,0.1);
        }

        .contact-icon {
          font-size: 1.8rem;
        }

        .contact-detail strong {
          color: #007bff;
          display: block;
          margin-bottom: 0.5rem;
        }

        .contact-detail p {
          color: #ccc;
          margin: 0.2rem 0;
          line-height: 1.5;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.8rem;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 5px;
          color: #fff;
          font-size: 1rem;
          transition: all 0.3s;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #007bff;
          background: rgba(255,255,255,0.15);
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: #999;
        }

        .submit-btn {
          width: 100%;
          padding: 0.8rem;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.3s;
        }

        .submit-btn:hover {
          background: #0056b3;
        }

        .map-section {
          margin-bottom: 3rem;
        }

        .map-container {
          margin-top: 1rem;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .policies-section {
          text-align: center;
        }

        .policies-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .policy-link {
          background: rgba(255,255,255,0.05);
          padding: 0.8rem;
          border-radius: 5px;
          color: #ccc;
          text-decoration: none;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .policy-link:hover {
          background: #007bff;
          color: white;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .contact-container {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          
          .policies-grid {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          }
          
          .contact-detail {
            padding: 0.8rem;
          }
        }

        @media (max-width: 1024px) {
          .brand-slide {
            grid-template-columns: repeat(2, 1fr);
          }
        }

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

          .welcome-title {
            font-size: 2rem;
          }

          .welcome-text {
            font-size: 1rem;
          }

          .feature h3 {
            font-size: 1.3rem;
          }

          .section {
            padding: 3rem 1.5rem;
          }

          .section-content h2 {
            font-size: 2rem;
          }

          .brand-slide {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }

          .brand-arrow {
            width: 40px;
            height: 40px;
            font-size: 1.4rem;
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

          .welcome-section {
            padding: 3rem 1rem;
          }

          .welcome-title {
            font-size: 1.5rem;
          }

          .feature {
            min-width: 100%;
          }

          .brand-slide {
            grid-template-columns: 1fr;
          }

          .brand-image {
            height: 180px;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;