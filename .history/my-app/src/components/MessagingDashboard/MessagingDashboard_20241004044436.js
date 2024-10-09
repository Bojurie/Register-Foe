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
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [outboxMessages, setOutboxMessages] = useState([]); // Placeholder for outbox messages

  const fetchAvailableUsers = useCallback(async () => {
    try {
      let users = [];
      if (user?.role === "Admin" || user?.isCompany) {
        users = await fetchUserByCompanyCode(user.companyCode);
      } else {
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
      className="MessagingDashboard-Container"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
    >
      <div className="MessagingDashboard-Header">
        <h1>Messaging</h1>
      </div>

      <div className="MessagingDashboard-Tabs">
        <button
          className={`MessagingTab ${activeTab === "Inbox" ? "active" : ""}`}
          onClick={() => setActiveTab("Inbox")}
        >
          Inbox
        </button>
        <button
          className={`MessagingTab ${activeTab === "New" ? "active" : ""}`}
          onClick={() => setActiveTab("New")}
        >
          New
        </button>
        <button
          className={`MessagingTab ${activeTab === "Outlook" ? "active" : ""}`}
          onClick={() => setActiveTab("Outlook")}
        >
          Outbox
        </button>
      </div>

      <div className="MessagingDashboard-Content">
        <AnimatePresence>
          {activeTab === "Inbox" && (
            <motion.div
              className="MessagesContainer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Conversations
                onConversationSelect={setSelectedConversation}
                availableUsers={availableUsers}
              />
              <div className="MessageDetailsContainer">
                {selectedConversation ? (
                  <Messages conversation={selectedConversation} />
                ) : (
                  <div className="PlaceholderText">
                    Select a conversation to view messages
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "New" && (
            <motion.div
              className="NewMessageContainer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3>Available Users</h3>
              <ul className="UserList">
                {availableUsers.length > 0 ? (
                  availableUsers.map((user) => (
                    <li
                      key={user._id}
                      className="UserItem"
                      onClick={() => setSelectedConversation(user)}
                    >
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
              className="OutboxContainer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3>Outbox Messages</h3>
              {outboxMessages.length > 0 ? (
                outboxMessages.map((message) => (
                  <div key={message._id} className="MessageItem">
                    <strong>To: {message.recipient.username}</strong>
                    <p>{message.content}</p>
                    <span>{new Date(message.date).toLocaleString()}</span>
                  </div>
                ))
              ) : (
                <p>No messages found in Outbox.</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default MessagingDashboard;
