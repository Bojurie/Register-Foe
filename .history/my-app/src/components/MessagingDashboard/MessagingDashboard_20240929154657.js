import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Messages from "./Messages";
import Conversations from "./Conversations";
import { useAuth } from "../AuthContext/AuthContext";
import "./MessagingDashboard.css";

const MessagingDashboard = () => {
  const { user, fetchAdminUsers, fetchUserByCompanyCode } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [availableUsers, setAvailableUsers] = useState([]);

  // Toggle collapse state for the messaging dashboard
  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  // Fetch users available for messaging based on user role
  const fetchAvailableUsers = useCallback(async () => {
    try {
      let users = [];
      if (user?.role === "Admin" || user?.isCompany) {
        // If admin or company user, fetch all users within the company
        users = await fetchUserByCompanyCode(user.companyCode);
      } else {
        // If regular user, fetch only admins
        users = await fetchAdminUsers(user.companyCode);
      }
      setAvailableUsers(users);
    } catch (error) {
      console.error("Error fetching available users:", error);
    }
  }, [user, fetchAdminUsers, fetchUserByCompanyCode]);

  useEffect(() => {
    if (user) {
      fetchAvailableUsers();
    }
  }, [user, fetchAvailableUsers]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className={`MessagingDashboard-Container ${
        isCollapsed ? "collapsed" : ""
      }`}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
    >
      <div className="MessagingDashboard-Header" onClick={toggleCollapse}>
        <h2>{isCollapsed ? "Show Messaging" : "Hide Messaging"}</h2>
      </div>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            className="MessagingDashboard-Content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="ConversationsContainer"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <Conversations
                onConversationSelect={setSelectedConversation}
                availableUsers={availableUsers}
              />
            </motion.div>

            <motion.div
              className="MessagesContainer"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <AnimatePresence>
                {selectedConversation ? (
                  <Messages conversation={selectedConversation} />
                ) : (
                  <motion.div
                    className="PlaceholderText"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { opacity: 1, transition: { duration: 0.5 } },
                    }}
                  >
                    Select a conversation to view messages
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MessagingDashboard;
