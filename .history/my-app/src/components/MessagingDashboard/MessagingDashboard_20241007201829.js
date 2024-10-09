import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Messages from "./Messages";
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

  // Fetch available users based on user type
  const fetchAvailableUsers = useCallback(async () => {
    try {
      const users =
        user?.role === "Admin" || user?.isCompany
          ? await fetchUserByCompanyCode(user.companyCode)
          : await fetchAdminUsers(user.companyCode);

      setAvailableUsers(users || []);
    } catch (error) {
      console.error("Error fetching available users:", error);
    }
  }, [user, fetchAdminUsers, fetchUserByCompanyCode]);

  // Fetch inbox messages
  const fetchInbox = useCallback(async () => {
    try {
      const messages = await fetchInboxMessages(user?._id);
      setInboxMessages(messages || []);
    } catch (error) {
      console.error("Error fetching inbox messages:", error);
    }
  }, [user, fetchInboxMessages]);

  // Fetch sent messages
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

  return (
    <motion.div className="MessagingDashboard-Container">
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
          {/* Similarly, handle "Inbox" and "Outbox" tabs by displaying messages */}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default MessagingDashboard;
