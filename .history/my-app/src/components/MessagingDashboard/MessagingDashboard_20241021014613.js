import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import axiosInstance from "../axiosInstance";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faReply,
  faPlusCircle,
  faInbox,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import "./MessagingDashboard.css"; // Custom overrides or extra styling
import Conversations from "./Conversations"; // Updated user list component
import Messages from "./Messages"; // Updated message display component

const MessagingDashboard = () => {
  const { user, fetchAdminUsers, fetchUserByCompanyCode, handleSendMessage } =
    useAuth();

  const [activeTab, setActiveTab] = useState("New");
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isDashboardVisible, setIsDashboardVisible] = useState(true);
  const [showMessageInput, setShowMessageInput] = useState(false);

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

  useEffect(() => {
    if (user) {
      fetchAvailableUsers();
    }
  }, [user, fetchAvailableUsers]);

  const handleMessageSend = async () => {
    const recipientId = selectedConversation?._id;
    if (!recipientId || !newMessage.trim()) {
      toast.error("A conversation and message content are required.");
      return;
    }

    try {
      await handleSendMessage(recipientId, newMessage);
      setNewMessage("");
      fetchMessagesByConversationId(selectedConversation._id);
      toast.success("Message sent successfully!");
    } catch (error) {
      toast.error("Failed to send the message.");
    }
  };

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    fetchMessagesByConversationId(conversation._id);
    setShowMessageInput(true);
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-12 text-center mb-4">
          <h2 className="d-inline-block">Messaging Dashboard</h2>
          <button
            className="btn btn-outline-primary ml-3"
            onClick={() => setIsDashboardVisible((prev) => !prev)}
          >
            {isDashboardVisible ? "Hide" : "Show"} Dashboard
          </button>
        </div>
      </div>

      {isDashboardVisible && (
        <div className="row">
          <div className="col-md-4">
            <ul className="nav nav-pills mb-3">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "New" ? "active" : ""}`}
                  onClick={() => setActiveTab("New")}
                >
                  <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
                  New
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "Inbox" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("Inbox")}
                >
                  <FontAwesomeIcon icon={faInbox} className="mr-2" />
                  Inbox
                </button>
              </li>
            </ul>

            {activeTab === "New" && (
              <div className="new-message-section">
                <h4>Available Users</h4>
                <Conversations
                  availableUsers={availableUsers}
                  onConversationSelect={handleConversationSelect}
                />
              </div>
            )}

            {activeTab === "Inbox" && (
              <div className="inbox-section">
                <h4>Your Inbox</h4>
                <Conversations
                  availableUsers={availableUsers}
                  onConversationSelect={handleConversationSelect}
                />
              </div>
            )}
          </div>

          <div className="col-md-8">
            <div className="card p-4">
              <Messages messages={messages} loadingMessages={loadingMessages} />

              {showMessageInput && selectedConversation && (
                <div className="message-input mt-3">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                    />
                    <div className="input-group-append">
                      <button
                        className="btn btn-primary"
                        onClick={handleMessageSend}
                        disabled={!newMessage.trim()}
                      >
                        <FontAwesomeIcon icon={faPaperPlane} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagingDashboard;
