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
  const [selectedUser, setSelectedUser] = useState(null); // Track selected user/recipient
  const [selectedConversationId, setSelectedConversationId] = useState(null); // Track selected conversation
  const [newMessage, setNewMessage] = useState(""); // Track new message content
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [inboxMessages, setInboxMessages] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch available users (for the "New" tab)
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

  // Fetch messages for the selected conversation
  const fetchInboxMessagesHandler = useCallback(async () => {
    if (!selectedConversationId) {
      setError("Conversation ID not found.");
      return;
    }

    try {
      setLoadingMessages(true);
      console.log(
        "Fetching messages for conversation ID:",
        selectedConversationId
      ); // Log conversationId

      const messages = await fetchInboxMessages(selectedConversationId); // Fetch messages by conversation ID
      setInboxMessages(messages || []);
      console.log("Fetched messages:", messages); // Log fetched messages
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

  // Handle selecting a conversation to view messages
  const handleMessageClick = (message) => {
    setSelectedConversationId(message.conversation._id); // Set the conversation ID for fetching messages
    setIsModalOpen(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedConversationId(null); // Clear selected conversation
  };

  // Handle sending a new message to a selected user
  const handleSendMessageToUser = async () => {
    if (!selectedUser?._id || !newMessage.trim()) {
      console.error("Recipient and content are required to send a message.");
      toast.error("Recipient and message content are required.");
      return;
    }

    try {
      const messageData = {
        recipientId: selectedUser._id,
        content: newMessage,
      };

      console.log("Message Data being sent:", messageData);
      await handleSendMessage(messageData); // Send new message

      toast.success("Message sent successfully!");
      setNewMessage(""); // Clear message input
    } catch (error) {
      toast.error("Failed to send the message.");
      console.error("Error sending message:", error);
    }
  };

  return (
    <motion.div className="MessagingDashboard-Container">
      <div className="MessagingDashboard-Header">
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
                handleMessageClick={handleMessageClick} // Open modal on message click
              />
            ) : (
              <p>No messages found.</p>
            )}
          </motion.div>
        )}

        {/* New message tab */}
        {activeTab === "New" && (
          <motion.div className="NewMessageContainer">
            <h3>Select a User to Send a Message</h3>
            <Conversations
              availableUsers={availableUsers}
              onConversationSelect={(user) => setSelectedUser(user)} // Select a user
            />

            {selectedUser && (
              <div className="MessageInput">
                <p>
                  Sending message to: <strong>{selectedUser.username}</strong>
                </p>
                <textarea
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)} // Update the message content
                />
                <button onClick={handleSendMessageToUser}>Send Message</button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal for viewing and replying to messages */}
      {isModalOpen && selectedConversationId && (
        <MessageModal
          conversationId={selectedConversationId} // Pass conversationId to modal
          handleCloseModal={handleCloseModal}
          handleReplySend={handleReplyMessage}
        />
      )}
    </motion.div>
  );
};

export default MessagingDashboard;
