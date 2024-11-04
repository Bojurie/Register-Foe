import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../AuthContext/AuthContext";
import { toast } from "react-toastify";
import Messages from "./Messages";
import Conversations from "./Conversations";
import "./MessagingDashboard.css";

const MessagingDashboard = () => {
  const {
    user,
    fetchAdminUsers,
    fetchUserByCompanyCode,
    handleSendMessage,
    fetchInboxMessages,
  } = useAuth();

  const [activeTab, setActiveTab] = useState("Inbox");
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // Track selected recipient
  const [newMessage, setNewMessage] = useState(""); // Track new message content
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [inboxMessages, setInboxMessages] = useState([]);
  const [error, setError] = useState(null);

  // Fetch available users for the "New" tab
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
      const messages = await fetchInboxMessages(user._id);
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

 const handleSendMessageToUser = async () => {
   if (!selectedUser?._id) {
     console.error("Recipient ID is required to send a message.");
     toast.error("Please select a recipient.");
     return;
   }

   if (!newMessage || !newMessage.trim()) {
     console.error("Message content is required.");
     toast.error("Message content cannot be empty.");
     return;
   }

   try {
     const messageData = {
       recipientId: selectedUser._id, // Use selected user's ID as the recipient
       content: newMessage.trim(), // Ensure content is trimmed and valid
     };

     const response = await handleSendMessage(messageData); // Send the new message
     toast.success("Message sent to user!");

     // Clear the message input after sending
     setNewMessage("");
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
              <Messages messages={inboxMessages} />
            ) : (
              <p>No messages found.</p>
            )}
          </motion.div>
        )}

        {/* New Message Tab */}
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
    </motion.div>
  );
};

export default MessagingDashboard;
