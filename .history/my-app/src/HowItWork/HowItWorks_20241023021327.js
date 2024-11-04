import React from 'react'
import './HowitWorks.css'

const HowItWorks = () => {
    return (
      
        <section id="how-it-works" class="how-it-works-section">
          <h2>
            How <span>We Elect</span> Works
          </h2>
          <div class="steps-container">
            <div class="step">
              <h3>Step 1: Create Elections</h3>
              <p>
                Set up elections or polls for positions and key topics with
                ease.
              </p>
            </div>
            <div class="step">
              <h3>Step 2: Invite Participants</h3>
              <p>
                Invite employees or members to vote in secure, private
                elections.
              </p>
            </div>
            <div class="step">
              <h3>Step 3: Cast Votes and View Results</h3>
              <p>
                Let participants vote from any device and track results in
                real-time.
              </p>
            </div>
          </div>
        </section>

    );
}

export default HowItWorks
