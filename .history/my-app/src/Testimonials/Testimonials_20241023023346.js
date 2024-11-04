import React from "react";
import { Container, Row, Col } from "react-bootstrap"; // Bootstrap grid
import "./Testimonials.css";

const Testimonials = () => {
  return (
    <section id="testimonials" className="testimonials-section py-5">
      <Container>
        <h2 className="text-center mb-5">What Our Clients Say</h2>
        <Row>
          <Col md={6}>
            <blockquote className="blockquote text-center">
              "We Elect has revolutionized the way we manage internal elections.
              Easy to use and secure!"
              <footer className="blockquote-footer">
                John Doe, CEO of XYZ Company
              </footer>
            </blockquote>
          </Col>
          <Col md={6}>
            <blockquote className="blockquote text-center">
              "Our team loves the transparency and engagement the platform
              brings. Voting on topics is a game changer."
              <footer className="blockquote-footer">
                Jane Smith, HR Manager
              </footer>
            </blockquote>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Testimonials;
