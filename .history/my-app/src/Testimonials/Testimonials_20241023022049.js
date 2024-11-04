import React from 'react'
import './Testimonials.css'

const Testimonials = () => {
  return (
    <section id="testimonials" class="testimonials-section">
      <h2>What Our Clients Say</h2>
      <div class="testimonial-container">
        <blockquote>
          "We Elect has revolutionized the way we manage internal elections.
          Easy to use and secure!"
          <cite>- John Doe, CEO of XYZ Company</cite>
        </blockquote>
        <blockquote>
          "Our team loves the transparency and engagement the platform brings.
          Voting on topics is a game changer."
          <cite>- Jane Smith, HR Manager</cite>
        </blockquote>
      </div>
    </section>
  );
}

export default Testimonials
