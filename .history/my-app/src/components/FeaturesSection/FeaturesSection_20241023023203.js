import React from "react";
import { Row, Col } from "react-bootstrap"; // Bootstrap grid system
import "./FeaturesSection.css";

const FeaturesSection = () => {
  return (
    <section id="features" className="features-section py-5">
      <div className="container">
        <h2 className="text-center mb-5">
          Features of <span>We Elect</span>
        </h2>
        <Row>
          <Col md={4} className="text-center">
            <img
              src="candidate-selection-icon.png"
              alt="Candidate Selection"
              className="feature-icon"
            />
            <h3>Candidate Selection</h3>
            <p>Select internal candidates for key roles with ease.</p>
          </Col>
          <Col md={4} className="text-center">
            <img
              src="voting-topics-icon.png"
              alt="Voting on Topics"
              className="feature-icon"
            />
            <h3>Voting on Topics</h3>
            <p>
              Engage employees by allowing them to vote on key company topics.
            </p>
          </Col>
          <Col md={4} className="text-center">
            <img
              src="news-voting-icon.png"
              alt="News Voting"
              className="feature-icon"
            />
            <h3>News and Announcements</h3>
            <p>Keep your team informed and let them vote on important news.</p>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default FeaturesSection;
