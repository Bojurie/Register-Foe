import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WeatherWidget from "../WeatherWidget/WeatherWidget";
import PastElectionList from "../PastElectionList/PastElectionList";
import ElectionList from "../ElectionList /ElectionList";
import ElectionRegistration from "../ElectionRegistration/ElectionRegistration"; // Assuming this is your form component
import "./CompanyDashboard.css";

function CompanyDashboard({ user }) {
  const [upcomingElections, setUpcomingElections] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <div>
      <motion.div
        className="Dashboard"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <h1>Welcome, {user ? `${user.companyName}` : "Guest"}!</h1>
        <WeatherWidget user={user} />
        <div className="Middle-Dashboard">
          <PastElectionList userId={user?._id} />
        </div>
        <ElectionList elections={upcomingElections} userId={user?._id} />

        {/* Button to open modal */}
        <button onClick={() => setIsModalOpen(true)}>Register Election</button>

        {/* Modal for election registration */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              className="ModalBackdrop"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div
                className="ModalContent"
                onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
              >
                <ElectionRegistration />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default CompanyDashboard;
