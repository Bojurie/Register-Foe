import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../AuthContext/AuthContext";
import axiosInstance from "../axiosInstance"; // Assuming axiosInstance is set up for API calls
import "./MessagingDashboard.css";
import { toast } from "react-toastify";
import Conversations from "./Conversations";
import Messages from "./Messages";

const MessagingDashboard = () => {
  const { user, fetchAdminUsers, fetchUserByCompanyCode, handleSendMessage } =
    useAuth();

  const [activeTab, setActiveTab] = useState("New");
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isDashboardVisible, setIsDashboardVisible] = useState(true);
  const [showMessageInput, setShowMessageInput] = useState(false);

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

  // Fetch users on component mount
  useEffect(() => {
    if (user) {
      fetchAvailableUsers();
    }
  }, [user, fetchAvailableUsers]);

  // Handle selecting a user to start a conversation
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setShowMessageInput(true);
  };

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    setShowMessageInput(true);
  };

  const handleMessageSend = async (message) => {
    if (selectedUser || selectedConversation) {
      await handleSendMessage(selectedConversation._id, message);
      toast.success("Message sent successfully!");
    }
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

            {activeTab === "New" && (
              <Conversations
                availableUsers={availableUsers}
                onConversationSelect={handleUserSelect}
              />
            )}

            {activeTab === "Inbox" && selectedConversation && (
              <Messages conversation={selectedConversation} />
            )}

            {showMessageInput && (
              <div className="MessageInput">
                <input
                  type="text"
                  placeholder="Type your message..."
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleMessageSend(e.target.value);
                      e.target.value = "";
                    }
                  }}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MessagingDashboard;
