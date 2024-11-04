import React from "react";
import "./LandingPage.css";
import LandingLogo from "../../components/images/image2vector.svg";
import { motion } from "framer-motion";
import Hero from "../../components/Hero/Hero";
import FeaturesSection from "../../components/FeaturesSection/FeaturesSection";
import HowItWorks from "../../HowItWork/HowItWorks";

const LandingPage = () => {
  const headerVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 1.5 } },
  };

  const subHeaderVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 1.5, delay: 0.5 } },
  };

  const logoVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 2, ease: "easeInOut" },
    },
  };

  return (
    <div className="LandingPage">
    <Hero />
       <FeaturesSection />
       <HowItWorks />
      
    </div>
  );
};

export default LandingPage;
