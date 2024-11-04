import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../AuthContext/AuthContext";
import axiosInstance from "../axiosInstance";
import "./MessagingDashboard.css";
import { toast } from "react-toastify";
import Conversations from "./Conversations"; // Conversations component for user list
import Messages from "./Messages"; // Reusable Messages component

const MessagingDashboard = () => {
  const { user, fetchAdminUsers, fetchUserByCompanyCode, handleSendMessage } =
    useAuth();

  const [activeTab, setActiveTab] = useState("New");
  const [availableUsers, setAvailableUsers] = useState([]); // For users in "New" tab
  const [selectedUser, setSelectedUser] = useState(null); // Selected user for new message
  const [selectedConversation, setSelectedConversation] = useState(null); // Conversation for Inbox
  const [messages, setMessages] = useState([]); // Messages in the selected conversation
  const [newMessage, setNewMessage] = useState(""); // New message content
  const [loadingMessages, setLoadingMessages] = useState(false); // Loading indicator for messages
  const [isDashboardVisible, setIsDashboardVisible] = useState(true); // Toggle visibility
  const [showMessageInput, setShowMessageInput] = useState(false); // Control message input display

  // Fetch available users based on user role
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

  // Fetch messages by conversationId for inbox
  const fetchMessagesByConversationId = useCallback(async (conversationId) => {
    if (!conversationId) return;
    setLoadingMessages(true);
    try {
      const response = await axiosInstance.get(
        `/message/messages/${conversationId}`
      );
      if (response.status === 200) {
        setMessages(response.data || []);
      } else {
        toast.error("Failed to fetch messages.");
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Error fetching messages.");
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  // Initialize by fetching users when component mounts
  useEffect(() => {
    if (user) {
      fetchAvailableUsers();
    }
  }, [user, fetchAvailableUsers]);

  // Handle sending a message in the "New" or "Inbox" tab
  const handleMessageSend = async () => {
    const recipientId =
      selectedUser?._id || selectedConversation?.recipient._id;
    if (!recipientId || !newMessage.trim()) {
      toast.error("A recipient and message content are required.");
      return;
    }

    try {
      await handleSendMessage(recipientId, newMessage);
      setNewMessage(""); // Clear input field
      if (selectedConversation) {
        fetchMessagesByConversationId(selectedConversation._id); // Refresh messages in the current conversation
      }
      toast.success("Message sent successfully!");
    } catch (error) {
      toast.error("Failed to send the message.");
    }
  };

  // Select user for a new conversation (in the "New" tab)
  const handleUserSelect = (user) => {
    setSelectedUser(user); // Set selected user for new conversation
    setShowMessageInput(true); // Show input field for the new message
  };

  // Select a conversation (in the "Inbox" tab) to fetch messages
  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    fetchMessagesByConversationId(conversation._id);
    setShowMessageInput(true); // Show input for replying to this conversation
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
            </div>

            {/* New Tab - Send a message to a new user */}
            {activeTab === "New" && (
              <motion.div className="NewMessageContainer">
                <h3>Available Users</h3>
                <Conversations
                  availableUsers={availableUsers}
                  onConversationSelect={handleUserSelect}
                />
                {showMessageInput && selectedUser && (
                  <div className="MessageInput">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={`Message ${selectedUser.username}`}
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

            {/* Inbox Tab - Display existing conversations and messages */}
            {activeTab === "Inbox" && (
              <motion.div className="InboxContainer">
                <Messages
                  conversation={selectedConversation}
                  onConversationSelect={handleConversationSelect}
                  messages={messages}
                  loadingMessages={loadingMessages}
                />
                {showMessageInput && selectedConversation && (
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
