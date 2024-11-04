import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../AuthContext/AuthContext";
import axiosInstance from "../axiosInstance"; // Assuming axiosInstance is set up for API calls
import "./MessagingDashboard.css";
import { toast } from "react-toastify";

const MessagingDashboard = () => {
  const { user, fetchAdminUsers, fetchUserByCompanyCode, handleSendMessage } =
    useAuth();

  // State management
  const [activeTab, setActiveTab] = useState("New");
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null); // Selected conversation for messages
  const [messages, setMessages] = useState([]); // Messages for the selected conversation
  const [newMessage, setNewMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false); // Loading state for fetching messages
  const [isDashboardVisible, setIsDashboardVisible] = useState(true); // Define the missing state
  const [showMessageInput, setShowMessageInput] = useState(false); // Control message input display

  // Fetch available users based on role
  const fetchAvailableUsers = useCallback(async () => {
    try {
      const users =
        user?.role === "Admin" || user?.isCompany
          ? await fetchUserByCompanyCode(user.companyCode)
          : await fetchAdminUsers(user.companyCode);

      setAvailableUsers(users || []);
    } catch (error) {
      console.error("Error fetching available users:", error);
      toast.error("Failed to fetch available users.");
    }
  }, [user, fetchAdminUsers, fetchUserByCompanyCode]);

  // Fetch messages by conversationId
  const fetchMessagesByConversationId = useCallback(async (conversationId) => {
    if (!conversationId) return;

    setLoadingMessages(true);

    try {
      const response = await axiosInstance.get(`/messages/${conversationId}`);

      if (response.status !== 200) {
        toast.error("Failed to fetch messages.");
        return;
      }

      const fetchedMessages = response.data;
      setMessages(fetchedMessages || []);
    } catch (error) {
      console.error("Error fetching messages by conversation:", error);
      toast.error("Error fetching messages.");
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  // Fetch users and initial messages (if necessary) on mount
  useEffect(() => {
    if (user) {
      fetchAvailableUsers();
    }
  }, [user, fetchAvailableUsers]);

  // Handle sending a message
  const handleMessageSend = async () => {
    if (!selectedConversation || !newMessage.trim()) {
      toast.error("A conversation and message content are required.");
      return;
    }

    try {
      await handleSendMessage(selectedConversation._id, newMessage);
      setNewMessage(""); // Clear input field
      fetchMessagesByConversationId(selectedConversation._id); // Fetch updated messages
      toast.success("Message sent successfully!");
    } catch (error) {
      toast.error("Failed to send the message.");
    }
  };

  // When clicking a message, capture conversation ID and open reply section
  const handleMessageClick = (conversation) => {
    if (!conversation?._id) {
      toast.error("Invalid conversation.");
      return;
    }

    setSelectedConversation(conversation);
    setShowMessageInput(true); // Show message input for replying
    fetchMessagesByConversationId(conversation._id); // Fetch messages for the selected conversation
  };

  // Render sender's name or company
  const renderSender = (message) => {
    const sender = message?.sender;
    if (!sender) return "Unknown Sender";
    return sender.firstName
      ? `${sender.firstName} ${sender.lastName}`
      : sender.username || "Unknown Sender";
  };

  return (
    <motion.div className="MessagingDashboard-Container">
      <div className="MessagingDashboard-Header">
        <h2 onClick={() => setIsDashboardVisible((prev) => !prev)}>
          {isDashboardVisible ? "Hide" : "Show"} Messaging Dashboard
        </h2>
      </div>

      <AnimatePresence>
        {isDashboardVisible && (
          <motion.div className="MessagingDashboard-Content">
            <div className="MessagingDashboard-Tabs">
              <button
                className={`MessagingTab ${
                  activeTab === "New" ? "active" : ""
                }`}
                onClick={() => setActiveTab("New")}
              >
                New
              </button>
              <button
                className={`MessagingTab ${
                  activeTab === "Inbox" ? "active" : ""
                }`}
                onClick={() => setActiveTab("Inbox")}
              >
                Inbox
              </button>
              <button
                className={`MessagingTab ${
                  activeTab === "Outbox" ? "active" : ""
                }`}
                onClick={() => setActiveTab("Outbox")}
              >
                Outbox
              </button>
            </div>

            {/* Inbox Messages */}
            {activeTab === "Inbox" && (
              <motion.div className="InboxContainer MessagesScrollable">
                <h3>Inbox Messages</h3>
                {availableUsers.length > 0 ? (
                  availableUsers.map((conversation) => (
                    <motion.div
                      key={conversation._id}
                      className="MessageItem"
                      onClick={() => handleMessageClick(conversation)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <p>
                        <strong>
                          From:{" "}
                          {conversation?.sender?.firstName || "Unknown Sender"}
                        </strong>
                      </p>
                    </motion.div>
                  ))
                ) : (
                  <p>No inbox messages found.</p>
                )}

                {/* Show messages when a conversation is clicked */}
                {showMessageInput && selectedConversation && (
                  <div className="MessagesContent">
                    {loadingMessages ? (
                      <p>Loading messages...</p>
                    ) : (
                      messages.map((message) => (
                        <div key={message._id}>
                          <p>
                            <strong>{renderSender(message)}</strong>
                          </p>
                          <p>{message.content}</p>
                        </div>
                      ))
                    )}
                    <div className="MessageInput">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your reply..."
                      />
                      <button
                        onClick={handleMessageSend}
                        disabled={!newMessage.trim()}
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MessagingDashboard;
