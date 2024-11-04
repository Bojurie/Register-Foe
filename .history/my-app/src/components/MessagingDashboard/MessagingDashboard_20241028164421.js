import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../AuthContext/AuthContext";
import { toast } from "react-toastify";
import Messages from "./Messages";
import MessageModal from "./MessageModal";
import Conversations from "./Conversations";
import "./MessagingDashboard.css";

const MessagingDashboard = () => {
  const {
    user,
    fetchAdminUsers,
    fetchUserByCompanyCode,
    handleSendMessage,
    fetchInboxMessages,
    handleReplyMessage,
  } = useAuth();

  const [activeTab, setActiveTab] = useState("Inbox");
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [inboxMessages, setInboxMessages] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAvailableUsers = useCallback(async () => {
    try {
      const users =
        user?.role === "Admin" || user?.isCompany
          ? await fetchUserByCompanyCode(user.companyCode)
          : await fetchAdminUsers(user.companyCode);

      setAvailableUsers(users || []);
    } catch (error) {
      toast.error("Failed to fetch available users.");
      console.error("Error fetching available users:", error);
    }
  }, [user, fetchAdminUsers, fetchUserByCompanyCode]);

  useEffect(() => {
    if (user) {
      fetchAvailableUsers();
    }
  }, [user, fetchAvailableUsers]);

  const fetchInboxMessagesHandler = useCallback(async () => {
    if (!selectedConversationId) {
      setError("Conversation ID not found.");
      return;
    }

    try {
      setLoadingMessages(true);
      const messages = await fetchInboxMessages(selectedConversationId); // Fetch filtered messages
      setInboxMessages(messages || []);
    } catch (error) {
      setError("Failed to load inbox messages.");
      console.error("Error fetching inbox messages:", error);
    } finally {
      setLoadingMessages(false);
    }
  }, [selectedConversationId, fetchInboxMessages]);

  useEffect(() => {
    if (activeTab === "Inbox") {
      fetchInboxMessagesHandler();
    }
  }, [activeTab, fetchInboxMessagesHandler]);

  const handleMessageClick = (message) => {
    setSelectedConversationId(message.conversation._id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedConversationId(null);
  };

  const handleSendMessageToUser = async () => {
    if (!selectedUser?._id || !newMessage.trim()) {
      toast.error("Recipient and message content are required.");
      return;
    }

    try {
      const messageData = {
        recipientId: selectedUser._id,
        content: newMessage,
      };

      await handleSendMessage(messageData);
      toast.success("Message sent successfully!");
      setNewMessage("");
    } catch (error) {
      toast.error("Failed to send the message.");
      console.error("Error sending message:", error);
    }
  };

  return (
    <motion.div className="MessagingDashboard-Container">
      <div className="MessagingDashboard-Header sticky-header">
        <h2>Messaging Dashboard</h2>
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
      </div>

      <AnimatePresence>
        {activeTab === "Inbox" && (
          <motion.div className="InboxMessagesContainer">
            <h3>Inbox Messages</h3>
            {loadingMessages ? (
              <p>Loading messages...</p>
            ) : inboxMessages.length > 0 ? (
              <Messages
                messages={inboxMessages}
                handleMessageClick={handleMessageClick}
              />
            ) : (
              <p>No messages found.</p>
            )}
          </motion.div>
        )}

        {activeTab === "New" && (
          <motion.div className="NewMessageContainer">
            <h3>Select a User to Send a Message</h3>
            <Conversations
              availableUsers={availableUsers}
              onConversationSelect={(user) => setSelectedUser(user)}
            />

            {selectedUser && (
              <div className="MessageInput">
                <p>
                  Sending message to: <strong>{selectedUser.username}</strong>
                </p>
                <textarea
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button onClick={handleSendMessageToUser}>Send Message</button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {isModalOpen && selectedConversationId && (
        <MessageModal
          conversationId={selectedConversationId}
          handleCloseModal={handleCloseModal}
          handleReplySend={handleReplyMessage}
        />
      )}
    </motion.div>
  );
};

export default MessagingDashboard;
