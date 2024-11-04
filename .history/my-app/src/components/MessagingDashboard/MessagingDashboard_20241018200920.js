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
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDashboardVisible, setIsDashboardVisible] = useState(true); // Toggle state for visibility

  // Fetch available users
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

  // Fetch inbox messages
  const fetchInbox = useCallback(async () => {
    try {
      const messages = await fetchInboxMessages();
      console.log("Fetched inbox messages:", messages);

      if (messages.length === 0) {
        console.warn("No messages found for this user.");
      }

      setInboxMessages(messages || []);
    } catch (error) {
      console.error("Error fetching inbox messages:", error);
    }
  }, [fetchInboxMessages]);

  // Fetch outbox messages
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

  // Handle sending messages
  const handleMessageSend = async () => {
    if (!selectedConversation || !newMessage.trim()) {
      console.error(
        "A conversation and message content are required to send a message."
      );
      return;
    }

    const recipientId = selectedConversation._id;

    try {
      const message = await handleSendMessage(
        selectedConversation._id,
        recipientId,
        newMessage
      );
      setNewMessage("");
      fetchOutbox();
      toast.success("Message sent successfully!");
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again.");
    }
  };

  // Open message modal
  const handleModalOpen = (message) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
  };

  // Close message modal
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedMessage(null);
  };

  // Render recipients for message
  const renderRecipients = (recipients) => {
    if (!Array.isArray(recipients)) {
      recipients = [recipients];
    }

    if (recipients.length === 0) return "Unknown Recipient";

    return recipients
      .map((recipient) => {
        if (recipient && recipient.firstName && recipient.lastName) {
          return `${recipient.firstName} ${recipient.lastName}`;
        }
        return "Unknown Recipient";
      })
      .join(", ");
  };

  // Render sender name
  const renderSender = (message) => {
    const sender = message.sender;
    if (sender && sender.firstName && sender.lastName) {
      return `${sender.firstName} ${sender.lastName}`;
    }
    return "Unknown Sender";
  };

  // Toggle dashboard visibility
  const toggleDashboard = () => {
    setIsDashboardVisible((prev) => !prev);
  };

  return (
    <motion.div
      className="MessagingDashboard-Container"
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="MessagingDashboard-Header">
        <h2 onClick={toggleDashboard}>
          Messaging {isDashboardVisible ? "(Hide)" : "(Show)"}
        </h2>
      </div>

      <AnimatePresence>
        {isDashboardVisible && (
          <motion.div
            className="MessagingDashboard-Content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
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

            {activeTab === "Inbox" && (
              <motion.div className="InboxContainer MessagesScrollable">
                <h3>Inbox Messages</h3>
                {inboxMessages.length > 0 ? (
                  inboxMessages.map((message) => (
                    <div key={message._id} className="MessageItem">
                      <p>
                        <strong>From: {renderSender(message)}</strong>
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
                  <p>No inbox messages found.</p>
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
                    <div
                      key={message._id}
                      className="MessageItem"
                      onClick={() => handleModalOpen(message)}
                    >
                      <p>
                        <strong>
                          To: {renderRecipients(message.recipient)}
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
          </motion.div>
        )}
      </AnimatePresence>

      {isModalOpen && selectedMessage && (
        <motion.div
          className="MessageModal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="MessageModalContent">
            <button className="CloseButton" onClick={handleModalClose}>
              X
            </button>
            <h3>Message Details</h3>
            <p>
              <strong>To:</strong>{" "}
              {renderRecipients(
                Array.isArray(selectedMessage.recipient)
                  ? selectedMessage.recipient
                  : [selectedMessage.recipient]
              )}
            </p>
            <p>
              <strong>Content:</strong> {selectedMessage.content}
            </p>
            <p>
              <small>
                {new Date(selectedMessage.createdAt).toLocaleString()}
              </small>
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MessagingDashboard;
