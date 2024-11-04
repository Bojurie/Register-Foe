import React from "react";
import { Button, Container } from "react-bootstrap"; // Bootstrap Button and Container
import "./CallToAction.css";

const CallToAction = () => {
  return (
    <section
      id="cta"
      className="cta-section text-center py-5 bg-primary text-white"
    >
      <Container>
        <h2>
          Ready to Get Started with <span>We Elect</span>?
        </h2>
        <p className="lead">
          Take your company’s voting process to the next level.
        </p>
        <Button href="#contact" variant="light" size="lg" className="mt-3">
          Request a Demo
        </Button>
      </Container>
    </section>
  );
};

export default CallToAction;
