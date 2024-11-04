import React from "react";
import { motion } from "framer-motion";
import "./Testimonials.css";

const Testimonials = () => {
  const testimonialData = [
    {
      text: "We Elect has revolutionized the way we manage internal elections. Easy to use and secure!",
      author: "John Doe",
      position: "CEO of XYZ Company",
    },
    {
      text: "Our team loves the transparency and engagement the platform brings. Voting on topics is a game changer.",
      author: "Jane Smith",
      position: "HR Manager",
    },
    {
      text: "We Elect provided the best experience for our internal polls. The UI is sleek and intuitive!",
      author: "Michael Lee",
      position: "CTO of ABC Corp",
    },
  ];

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
          {testimonialData.map((testimonial, index) => (
            <motion.div
              className="testimonial-card"
              key={index}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <p className="testimonial-text">"{testimonial.text}"</p>
              <div className="testimonial-author">
                <h4>{testimonial.author}</h4>
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
