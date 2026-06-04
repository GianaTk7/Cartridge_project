import React from 'react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="about-page">
      {/* Return Home Button */}
      <div className="return-home">
        <button onClick={() => navigate('/')} className="home-btn">
          ← Return to Home
        </button>
      </div>

      {/* Hero Section */}
      <div className="about-hero">
        <h1>About Us</h1>
        <p>Your trusted partner for quality printer cartridges</p>
      </div>

      {/* Main Content */}
      <div className="about-container">
        {/* Who We Are */}
        <div className="about-section">
          <h2>Who We Are</h2>
          <p>
            Covenant Print Solution is a leading supplier of high-quality printer cartridges 
            and printing solutions in South Africa. We are dedicated to providing affordable, 
            reliable printing products for homes and businesses.
          </p>
        </div>

        {/* What We Do */}
        <div className="about-section">
          <h2>What We Do</h2>
          <p>
            We supply original and compatible cartridges for all major printer brands including 
            HP, Canon, Epson, Brother, Samsung, and Lexmark. Our products are carefully selected 
            to ensure the best quality and value for our customers.
          </p>
        </div>

        {/* Our Promise */}
        <div className="about-section">
          <h2>Our Promise</h2>
          <div className="promise-grid">
            <div className="promise-item">
              <span className="promise-icon">✓</span>
              <h3>Quality Products</h3>
              <p>All cartridges are tested for reliability</p>
            </div>
            <div className="promise-item">
              <span className="promise-icon">✓</span>
              <h3>Best Prices</h3>
              <p>Competitive pricing without compromise</p>
            </div>
            <div className="promise-item">
              <span className="promise-icon">✓</span>
              <h3>Fast Delivery</h3>
              <p>Quick shipping across South Africa</p>
            </div>
            <div className="promise-item">
              <span className="promise-icon">✓</span>
              <h3>Customer Support</h3>
              <p>Friendly and knowledgeable team</p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="contact-box">
          <h3>Get in Touch</h3>
          <p>📞 078 780 3035</p>
          <p>✉️ Covenantprintsolution@gmail.com</p>
          <p>📍 115 Blairgowrie Dr, Blairgowrie, Randburg, 2194</p>
        </div>
      </div>

      <style jsx>{`
        .about-page {
          background: #1b2937;
          color: #fff;
          min-height: 100vh;
        }

        /* Return Home Button */
        .return-home {
          padding: 1rem 2rem;
          background: #1b2937;
        }

        .home-btn {
          background: #007bff;
          color: white;
          border: none;
          padding: 0.6rem 1.2rem;
          border-radius: 5px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: background 0.3s;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .home-btn:hover {
          background: #0056b3;
        }

        /* Hero Section */
        .about-hero {
          text-align: center;
          padding: 2rem 2rem;
          background: #1b2937;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .about-hero h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: #fff;
        }

        .about-hero p {
          font-size: 1.1rem;
          color: #ccc;
        }

        /* Container */
        .about-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem 2rem 4rem 2rem;
        }

        /* Sections */
        .about-section {
          margin-bottom: 3rem;
        }

        .about-section h2 {
          font-size: 1.8rem;
          color: #007bff;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid rgba(0,123,255,0.3);
          display: inline-block;
        }

        .about-section p {
          color: #ccc;
          line-height: 1.8;
          font-size: 1rem;
          margin-top: 1rem;
        }

        /* Promise Grid */
        .promise-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-top: 1.5rem;
        }

        .promise-item {
          background: rgba(255,255,255,0.05);
          padding: 1.5rem;
          border-radius: 10px;
          text-align: center;
          transition: transform 0.3s;
        }

        .promise-item:hover {
          transform: translateY(-3px);
          background: rgba(255,255,255,0.08);
        }

        .promise-icon {
          font-size: 2rem;
          color: #007bff;
          display: block;
          margin-bottom: 0.8rem;
        }

        .promise-item h3 {
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
          color: #fff;
        }

        .promise-item p {
          font-size: 0.85rem;
          color: #aaa;
          margin: 0;
        }

        /* Contact Box */
        .contact-box {
          background: rgba(0,123,255,0.1);
          padding: 2rem;
          border-radius: 12px;
          text-align: center;
          margin-top: 2rem;
          border: 1px solid rgba(0,123,255,0.3);
        }

        .contact-box h3 {
          font-size: 1.3rem;
          color: #007bff;
          margin-bottom: 1rem;
        }

        .contact-box p {
          color: #ccc;
          margin: 0.5rem 0;
          line-height: 1.6;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .return-home {
            padding: 0.8rem 1rem;
          }

          .home-btn {
            padding: 0.5rem 1rem;
            font-size: 0.85rem;
          }

          .about-hero {
            padding: 1.5rem 1rem;
          }

          .about-hero h1 {
            font-size: 2rem;
          }

          .about-container {
            padding: 1.5rem 1.5rem 3rem 1.5rem;
          }

          .about-section h2 {
            font-size: 1.5rem;
          }

          .promise-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }

          .promise-item {
            padding: 1rem;
          }
        }

        @media (max-width: 480px) {
          .about-hero h1 {
            font-size: 1.8rem;
          }

          .about-hero p {
            font-size: 1rem;
          }

          .promise-grid {
            grid-template-columns: 1fr;
          }

          .contact-box {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default About;