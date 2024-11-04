import React from 'react';
import './FeaturesSection.css'

const FeaturesSection = ()=>{
 return (
   <>
     <section id="features" class="features-section">
       <h2>
         Features of <span>We Elect</span>
       </h2>
       <div class="features-container">
         <div class="feature-item">
           <img src="candidate-selection-icon.png" alt="Candidate Selection" />
           <h3>Candidate Selection</h3>
           <p>Select internal candidates for key roles with ease.</p>
         </div>
         <div class="feature-item">
           <img src="voting-topics-icon.png" alt="Voting on Topics" />
           <h3>Voting on Topics</h3>
           <p>
             Engage employees by allowing them to vote on key company topics.
           </p>
         </div>
         <div class="feature-item">
           <img src="news-voting-icon.png" alt="News Voting" />
           <h3>News and Announcements</h3>
           <p>Keep your team informed and let them vote on important news.</p>
         </div>
       </div>
     </section>
   </>
 );
}
export default FeaturesSection;
