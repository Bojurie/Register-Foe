import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Messages from "./Messages";
import { useAuth } from "../AuthContext/AuthContext";
import "./MessagingDashboard.css";
import { toast } from "react-toastify";

const MessagingDashboard = () => {
  const {
    user,
    fetchAdminUsers,
    fetchUserByCompanyCode,
    handleSendMessage,
    fetchInboxMessages,
    getSentMessages,
  } = useAuth();
  const [activeTab, setActiveTab] = useState("New");
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [inboxMessages, setInboxMessages] = useState([]);
  const [outboxMessages, setOutboxMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const fetchAvailableUsers = useCallback(async () => {
    try {
      let users = [];
      if (user?.role === "Admin" || user?.isCompany) {
        users = await fetchUserByCompanyCode(user.companyCode);
      } else {
        users = await fetchAdminUsers(user.companyCode);
      }
      setAvailableUsers(users || []);
    } catch (error) {
      console.error("Error fetching available users:", error);
    }
  }, [user, fetchAdminUsers, fetchUserByCompanyCode]);

  const fetchInbox = useCallback(async () => {
    try {
      const messages = await fetchInboxMessages(user?._id);
      setInboxMessages(messages || []);
    } catch (error) {
      console.error("Error fetching inbox messages:", error);
    }
  }, [user, fetchInboxMessages]);

  const fetchOutbox = useCallback(async () => {
    try {
      const messages = await getSentMessages(user?._id);
      setOutboxMessages(messages || []);
    } catch (error) {
      console.error("Error fetching sent messages:", error);
    }
  }, [user, getSentMessages]);

  useEffect(() => {
    if (user) {
      fetchAvailableUsers();
      fetchInbox();
      fetchOutbox();
    }
  }, [user, fetchAvailableUsers, fetchInbox, fetchOutbox]);

  const handleMessageSend = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      await handleSendMessage({
        conversationId: selectedConversation._id,
        content: newMessage,
      });
      setNewMessage("");
      fetchOutbox();
      toast.success("Message sent successfully!");
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again.");
    }
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
      <div className="MessagingDashboard-Header">
        <h1>Messaging</h1>
      </div>

      <div className="MessagingDashboard-Tabs">
        <button
          className={`MessagingTab ${activeTab === "New" ? "active" : ""}`}
          onClick={() => setActiveTab("New")}
        >
          New
        </button>
        <button
          className={`MessagingTab ${activeTab === "Inbox" ? "active" : ""}`}
          onClick={() => setActiveTab("Inbox")}
        >
          Inbox
        </button>
        <button
          className={`MessagingTab ${activeTab === "Outbox" ? "active" : ""}`}
          onClick={() => setActiveTab("Outbox")}
        >
          Outbox
        </button>
      </div>

      <div className="MessagingDashboard-Content">
        <AnimatePresence>
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
                  availableUsers.map(
                    (user) =>
                      user && (
                        <li
                          key={user._id}
                          className={`UserItem ${
                            selectedConversation?._id === user._id
                              ? "selected"
                              : ""
                          }`}
                          onClick={() => setSelectedConversation(user)}
                        >
                          {`${user.username} (${user.firstName} ${user.lastName})`}
                        </li>
                      )
                  )
                ) : (
                  <p>No users available to message.</p>
                )}
              </ul>
              {selectedConversation && (
                <div className="NewMessageForm">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={`Message ${selectedConversation.username}`}
                  />
                  <button
                    onClick={handleMessageSend}
                    disabled={!newMessage.trim()}
                  >
                    Send
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "Inbox" && (
            <motion.div
              className="InboxContainer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3>Inbox Messages</h3>
              {inboxMessages.length > 0 ? (
                inboxMessages.map(
                  (message) =>
                    message &&
                    message.sender && (
                      <div
                        key={message._id}
                        className={`MessageItem ${
                          message.isNew ? "new-message" : ""
                        }`}
                        onClick={() => {
                          setSelectedConversation(message);
                        }}
                      >
                        <strong>
                          From:{" "}
                          {`${message.sender.username} (${message.sender.firstName} ${message.sender.lastName})`}
                        </strong>
                        <p>{message.content}</p>
                        <span>{new Date(message.date).toLocaleString()}</span>
                        {message.isNew && (
                          <span className="new-indicator">New</span>
                        )}
                      </div>
                    )
                )
              ) : (
                <p>No messages in your Inbox.</p>
              )}
            </motion.div>
          )}

          {activeTab === "Outbox" && (
            <motion.div
              className="OutboxContainer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3>Outbox Messages</h3>
              {outboxMessages.length > 0 ? (
                outboxMessages.map(
                  (message) =>
                    message &&
                    message.recipient && (
                      <div key={message._id} className="MessageItem">
                        <strong>
                          To:{" "}
                          {`${message.recipient.username} (${message.recipient.firstName} ${message.recipient.lastName})`}
                        </strong>
                        <p>{message.content}</p>
                        <span>{new Date(message.date).toLocaleString()}</span>
                      </div>
                    )
                )
              ) : (
                <p>No messages in your Outbox.</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default MessagingDashboard;
