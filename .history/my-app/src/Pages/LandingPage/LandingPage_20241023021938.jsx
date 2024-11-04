import React from "react";
import "./LandingPage.css";
import Hero from "../../components/Hero/Hero";
import FeaturesSection from "../../components/FeaturesSection/FeaturesSection";
import HowItWorks from "../../HowItWork/HowItWorks";
import Testimonials from "../../Testimonials/Testimonials";
import CallToAction from "../../CallToAction/CallToAction";

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
