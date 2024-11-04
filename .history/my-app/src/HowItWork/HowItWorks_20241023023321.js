import React from "react";
import { Container, Row, Col } from "react-bootstrap"; // Bootstrap grid

import './HowitWorks.css'
const HowItWorks = () => {
  return (
    <section id="how-it-works" className="how-it-works-section py-5 bg-light">
      <Container>
        <h2 className="text-center mb-5">
          How <span>We Elect</span> Works
        </h2>
        <Row>
          <Col md={4} className="text-center">
            <h3>Step 1: Create Elections</h3>
            <p>
              Set up elections or polls for positions and key topics with ease.
            </p>
          </Col>
          <Col md={4} className="text-center">
            <h3>Step 2: Invite Participants</h3>
            <p>
              Invite employees or members to vote in secure, private elections.
            </p>
          </Col>
          <Col md={4} className="text-center">
            <h3>Step 3: Cast Votes and View Results</h3>
            <p>
              Let participants vote from any device and track results in
              real-time.
            </p>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default HowItWorks;
