import React from "react";
import Hero from "../../components/Hero/Hero";
import FeaturesSection from "../../components/FeaturesSection/FeaturesSection";
import HowItWorks from "../../HowItWork/HowItWorks";
import Testimonials from "../../Testimonials/Testimonials";
import CallToAction from "../../CallToAction/CallToAction";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer"; // For scroll effects

const sectionVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const LandingPage = () => {
  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const [featuresRef, featuresInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const [howItWorksRef, howItWorksInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const [testimonialsRef, testimonialsInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const [ctaRef, ctaInView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <motion.div
      className="LandingPage"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <motion.div
        ref={heroRef}
        initial="hidden"
        animate={heroInView ? "visible" : "hidden"}
        variants={sectionVariant}
      >
        <Hero />
      </motion.div>

      {/* Features Section */}
      <motion.div
        ref={featuresRef}
        initial="hidden"
        animate={featuresInView ? "visible" : "hidden"}
        variants={sectionVariant}
      >
        <FeaturesSection />
      </motion.div>

      {/* How It Works Section */}
      <motion.div
        ref={howItWorksRef}
        initial="hidden"
        animate={howItWorksInView ? "visible" : "hidden"}
        variants={sectionVariant}
      >
        <HowItWorks />
      </motion.div>

      {/* Testimonials Section */}
      <motion.div
        ref={testimonialsRef}
        initial="hidden"
        animate={testimonialsInView ? "visible" : "hidden"}
        variants={sectionVariant}
      >
        <Testimonials />
      </motion.div>

      {/* Call to Action Section */}
      <motion.div
        ref={ctaRef}
        initial="hidden"
        animate={ctaInView ? "visible" : "hidden"}
        variants={sectionVariant}
      >
        <CallToAction />
      </motion.div>
    </motion.div>
  );
};

export default LandingPage;
