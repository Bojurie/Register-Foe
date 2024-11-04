import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../AuthContext/AuthContext";
import { toast } from "react-toastify";
import Messages from "./Messages";
import MessageModal from "./MessageModal";
import "./MessagingDashboard.css";

const MessagingDashboard = () => {
  const {
    user, // Current logged-in user
    fetchAdminUsers,
    fetchUserByCompanyCode,
    handleSendMessage,
    fetchInboxMessages,
    handleReplyMessage,
  } = useAuth();

  const [activeTab, setActiveTab] = useState("Inbox");
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [inboxMessages, setInboxMessages] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch available users for "New" message tab
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

  // Fetch inbox messages
  const fetchInboxMessagesHandler = useCallback(async () => {
    if (!user?._id) {
      setError("User not found.");
      return;
    }

    try {
      setLoadingMessages(true);
      const messages = await fetchInboxMessages(user._id); // Use the logged-in user as recipient
      setInboxMessages(messages || []);
    } catch (error) {
      setError("Failed to load inbox messages.");
      console.error("Error fetching inbox messages:", error);
    } finally {
      setLoadingMessages(false);
    }
  }, [user, fetchInboxMessages]);

  useEffect(() => {
    if (activeTab === "Inbox") {
      fetchInboxMessagesHandler();
    }
  }, [activeTab, fetchInboxMessagesHandler]);

  // Handle clicking a message to open the modal for reply
  const handleMessageClick = (message) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMessage(null);
  };

  // Handle sending a reply to a message
  const handleReplySend = async (conversationId, content) => {
    try {
      await handleReplyMessage(conversationId, user._id, content); // Use current user's _id as sender
      toast.success("Reply sent successfully!");
      handleCloseModal();
    } catch (error) {
      toast.error("Failed to send the reply.");
      console.error("Error sending reply:", error);
    }
  };

  // Handle sending a new message to a user
const handleSendMessageToUser = async (recipientId, content) => {
  if (!recipientId || !content.trim()) {
    console.error("Recipient and content are required to send a message.");
    toast.error("Recipient and message content are required.");
    return;
  }

  try {
    const messageData = {
      conversationId: null, // Null since this is a new conversation
      recipientId, // The ID of the user you are sending the message to
      content, // The message content
    };

    // Send the message using the handleSendMessage function (from context)
    await handleSendMessage(messageData);

    toast.success("Message sent successfully!");
    setNewMessage(""); // Clear the input field after sending
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
                handleMessageClick={handleMessageClick}
              />
            ) : (
              <p>No messages found.</p>
            )}
          </motion.div>
        )}

        {activeTab === "New" && (
          <div className="NewMessageContainer">
            <h3>Select a User to Send a Message</h3>
            {availableUsers.length > 0 ? (
              <ul>
                {availableUsers.map((user) => (
                  <li
                    key={user._id}
                    onClick={() =>
                      handleSendMessageToUser(user._id, newMessage)
                    }
                  >
                    {user.username} ({user.firstName} {user.lastName})
                  </li>
                ))}
              </ul>
            ) : (
              <p>No available users</p>
            )}
            <textarea
              placeholder="Enter your message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button
              onClick={() =>
                handleSendMessageToUser(availableUsers[0]?._id, newMessage)
              }
              disabled={!newMessage.trim()}
            >
              Send
            </button>
          </div>
        )}
      </AnimatePresence>

      {isModalOpen && selectedMessage && (
        <MessageModal
          message={selectedMessage}
          handleCloseModal={handleCloseModal}
          handleReplySend={handleReplySend}
        />
      )}
    </motion.div>
  );
};

export default MessagingDashboard;
