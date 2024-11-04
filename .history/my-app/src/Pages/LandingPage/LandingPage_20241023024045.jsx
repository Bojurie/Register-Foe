import React from "react";
import Hero from "../../components/Hero/Hero";
import FeaturesSection from "../../components/FeaturesSection/FeaturesSection";
import HowItWorks from "../../HowItWork/HowItWorks";
import Testimonials from "../../Testimonials/Testimonials";
import CallToAction from "../../CallToAction/CallToAction";
import { motion } from "framer-motion";

const LandingPage = () => {
  return (
    <motion.div
      className="LandingPage"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Hero />
      <FeaturesSection />
      <HowItWorks />
      <Testimonials />
      <CallToAction />
    </motion.div>
  );
};

export default LandingPage;
