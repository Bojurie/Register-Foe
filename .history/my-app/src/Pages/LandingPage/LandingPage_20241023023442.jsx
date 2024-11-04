import React from "react";
import Hero from "../../components/Hero/Hero";
import FeaturesSection from "../../components/FeaturesSection/FeaturesSection";
import HowItWorks from "../../HowItWork/HowItWorks";
import Testimonials from "../../Testimonials/Testimonials";
import CallToAction from "../../CallToAction/CallToAction";
// import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap for layout and responsiveness

const LandingPage = () => {
  return (
    <div className="LandingPage">
      <Hero />
      <FeaturesSection />
      <HowItWorks />
      <Testimonials />
      <CallToAction />
    </div>
  );
};

export default LandingPage;
