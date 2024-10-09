import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Messages from "./Messages";
import Conversations from "./Conversations";
import { useAuth } from "../AuthContext/AuthContext";
import "./MessagingDashboard.css";

const MessagingDashboard = () => {
  const { user, fetchAdminUsers, fetchUserByCompanyCode } = useAuth();
  const [activeTab, setActiveTab] = useState("Inbox");
  const [availableUsers, setAvailableUsers] = useState([]);
  const [inboxMessages, setInboxMessages] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="MessagingDashboard-Container"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
    >
      <div className="MessagingDashboard-Tabs">
        <button
          className={`TabButton ${activeTab === "Inbox" ? "active" : ""}`}
          onClick={() => handleTabClick("Inbox")}
        >
          Inbox
        </button>
        <button
          className={`TabButton ${activeTab === "New" ? "active" : ""}`}
          onClick={() => handleTabClick("New")}
        >
          New
        </button>
        <button
          className={`TabButton ${activeTab === "Outlook" ? "active" : ""}`}
          onClick={() => handleTabClick("Outlook")}
        >
          Outlook
        </button>
      </div>

      <AnimatePresence>
        {activeTab === "Inbox" && (
          <motion.div
            className="MessagingTabContent"
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.5 }}
          >
            <Conversations
              onConversationSelect={() => console.log("Conversation selected")}
              availableUsers={availableUsers}
            />
          </motion.div>
        )}

        {activeTab === "New" && (
          <motion.div
            className="MessagingTabContent"
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.5 }}
          >
            <h3>New Message</h3>
            <ul className="AvailableUsersList">
              {availableUsers.length > 0 ? (
                availableUsers.map((user) => (
                  <li key={user._id} className="UserItem">
                    {user.username}
                  </li>
                ))
              ) : (
                <p>No users available to message.</p>
              )}
            </ul>
          </motion.div>
        )}

        {activeTab === "Outlook" && (
          <motion.div
            className="MessagingTabContent"
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.5 }}
          >
            <h3>Sent Messages</h3>
            <ul className="SentMessagesList">
              {sentMessages.length > 0 ? (
                sentMessages.map((message) => (
                  <li key={message._id} className="SentMessageItem">
                    To: {message.receiver.username} - {message.content}
                  </li>
                ))
              ) : (
                <p>No sent messages available.</p>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MessagingDashboard;
