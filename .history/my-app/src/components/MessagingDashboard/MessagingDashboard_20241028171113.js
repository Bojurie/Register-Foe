import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../AuthContext/AuthContext";
import { toast } from "react-toastify";
import Messages from "./Messages";
import MessageModal from "./MessageModal";
import Conversations from "./Conversations";

const DashboardContainer = styled(motion.div)`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
`;

const TabButton = styled.button`
  background: ${({ isActive }) => (isActive ? "#007bff" : "#fff")};
  color: ${({ isActive }) => (isActive ? "#fff" : "#007bff")};
  border: none;
  padding: 10px 15px;
  margin: 0 5px;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

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
    }
  }, [user, fetchAdminUsers, fetchUserByCompanyCode]);

  useEffect(() => {
    if (user) fetchAvailableUsers();
  }, [user, fetchAvailableUsers]);

  const fetchInboxMessagesHandler = useCallback(async () => {
    if (!selectedConversationId)
      return toast.error("Conversation ID not found.");

    try {
      setLoadingMessages(true);
      const messages = await fetchInboxMessages(selectedConversationId);
      setInboxMessages(messages || []);
    } catch (error) {
      toast.error("Failed to load inbox messages.");
    } finally {
      setLoadingMessages(false);
    }
  }, [selectedConversationId, fetchInboxMessages]);

  useEffect(() => {
    if (activeTab === "Inbox") fetchInboxMessagesHandler();
  }, [activeTab, fetchInboxMessagesHandler]);

  const handleMessageClick = (message) => {
    setSelectedConversationId(message.conversation._id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSendMessageToUser = async () => {
    if (!selectedUser?._id || !newMessage.trim())
      return toast.error("Recipient and message content are required.");

    try {
      await handleSendMessage({
        recipientId: selectedUser._id,
        content: newMessage,
      });
      toast.success("Message sent successfully!");
      setNewMessage("");
    } catch {
      toast.error("Failed to send the message.");
    }
  };

  return (
    <DashboardContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <header>
        <h2>{activeTab === "Inbox" ? "Inbox Messages" : "New Message"}</h2>
      </header>
      <nav>
        <TabButton
          isActive={activeTab === "Inbox"}
          onClick={() => setActiveTab("Inbox")}
        >
          Inbox
        </TabButton>
        <TabButton
          isActive={activeTab === "New"}
          onClick={() => setActiveTab("New")}
        >
          New
        </TabButton>
      </nav>

      <AnimatePresence>
        {activeTab === "Inbox" ? (
          <motion.div
            key="inbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {loadingMessages ? (
              <p>Loading messages...</p>
            ) : (
              <Messages
                messages={inboxMessages}
                handleMessageClick={handleMessageClick}
              />
            )}
          </motion.div>
        ) : (
          <motion.div
            key="new"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Conversations
              availableUsers={availableUsers}
              onConversationSelect={(user) => setSelectedUser(user)}
            />
            {selectedUser && (
              <div>
                <p>
                  Sending message to: <strong>{selectedUser.username}</strong>
                </p>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                />
                <button onClick={handleSendMessageToUser}>Send Message</button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {isModalOpen && (
        <MessageModal
          conversationId={selectedConversationId}
          handleCloseModal={handleCloseModal}
        />
      )}
    </DashboardContainer>
  );
};

export default MessagingDashboard;
