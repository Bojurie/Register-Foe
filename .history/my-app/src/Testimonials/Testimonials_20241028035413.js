import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./Testimonials.css";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);

  // Fetch testimonials from the backend
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch("/testimonies"); // Adjust path if needed
        const data = await response.json();
        setTestimonials(data);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <section id="testimonials" className="testimonials-section">
      <motion.div
        className="testimonials-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">What Our Clients Say</h2>
        <div className="testimonial-cards">
          {testimonials.map((testimonial, index) => (
            <motion.div
              className="testimonial-card"
              key={testimonial._id || index} // Use a unique key if possible
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <p className="testimonial-text">"{testimonial.testimony}"</p>
              <div className="testimonial-author">
                <h4>{testimonial.name}</h4>
                <p className="author-position">{testimonial.position}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Testimonials;
