import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Conversations from "./Conversations";
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
  const [loadingOutbox, setLoadingOutbox] = useState(false);

  // Fetch users to start a new conversation
  const fetchAvailableUsers = useCallback(async () => {
    try {
      let users =
        user?.role === "Admin" || user?.isCompany
          ? await fetchUserByCompanyCode(user.companyCode)
          : await fetchAdminUsers(user.companyCode);

      setAvailableUsers(users || []);
    } catch (error) {
      console.error("Error fetching available users:", error);
    }
  }, [user, fetchAdminUsers, fetchUserByCompanyCode]);

  // Fetch inbox messages for the user
  const fetchInbox = useCallback(async () => {
    try {
      const messages = await fetchInboxMessages(user?._id);
      setInboxMessages(messages || []);
    } catch (error) {
      console.error("Error fetching inbox messages:", error);
    }
  }, [user, fetchInboxMessages]);

  // Fetch sent messages for the user
  const fetchOutbox = useCallback(async () => {
    setLoadingOutbox(true);
    try {
      const messages = await getSentMessages(user?._id);
      setOutboxMessages(messages || []);
    } catch (error) {
      console.error("Error fetching sent messages:", error);
    } finally {
      setLoadingOutbox(false);
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
      fetchOutbox(); // Refresh outbox after sending a message
      toast.success("Message sent successfully!");
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <motion.div
      className="MessagingDashboard-Container"
      initial="hidden"
      animate="visible"
      exit="exit"
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
            <motion.div className="NewMessageContainer">
              <h3>Available Users</h3>
              <Conversations
                availableUsers={availableUsers}
                onConversationSelect={setSelectedConversation}
              />
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

          {activeTab === "Outbox" && (
            <motion.div className="OutboxContainer MessagesScrollable">
              <h3>Outbox Messages</h3>
              {loadingOutbox ? (
                <p>Loading outbox messages...</p>
              ) : outboxMessages.length > 0 ? (
                outboxMessages.map((message) => (
                  <div key={message._id} className="MessageItem">
                    <p>
                      <strong>
                        To:{" "}
                        {message.recipient?.firstName &&
                        message.recipient?.lastName
                          ? `${message.recipient.firstName} ${message.recipient.lastName}`
                          : "Unknown Recipient"}
                      </strong>
                    </p>
                    <p>{message.content || "No content"}</p>
                    <p>
                      <small>
                        {new Date(message.createdAt).toLocaleString()}
                      </small>
                    </p>
                  </div>
                ))
              ) : (
                <p>No sent messages found.</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default MessagingDashboard;
