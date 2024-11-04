import React from "react";
import "./Hero.css"; // Custom styles for hero section
// import { Button } from "react-bootstrap"; // Bootstrap Button

const Hero = () =>  {
  return (
    <section className="hero-section text-center d-flex align-items-center justify-content-center">
      <div className="container">
        <h1 className="display-4">
          Empower Your Team with <span>We Elect</span>
        </h1>
        <p className="lead">
          The ultimate platform for voting, selecting candidates, and engaging
          with company news and topics.
        </p>
        <Button variant="primary" href="#features" size="lg" className="mt-4">
          Learn More
        </Button>
      </div>
    </section>
  );
};

export default Hero;
