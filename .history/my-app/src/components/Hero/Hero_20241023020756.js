import React from 'react'
import './Hero.css'


const Hero = () => { 
    return (
      <section id="hero" class="hero-section">
        <div class="hero-container">
          <h1 class="hero-title">
            Empower Your Team with <span>We Elect</span>
          </h1>
          <p class="hero-description">
            The ultimate platform for voting, selecting candidates, and engaging
            with company news and topics.
          </p>
          <a href="#features" class="cta-button">
            Learn More
          </a>
        </div>
        <div class="hero-image">
          <img src="we-elect-illustration.png" alt="We Elect App" />
        </div>
      </section>
    );
  
}

export default Hero
