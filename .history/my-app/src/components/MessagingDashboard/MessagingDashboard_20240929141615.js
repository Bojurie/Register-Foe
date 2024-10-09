import React, { useState } from "react";
// import Conversations from "./Conversations";
import Messages from "./Messages";
import "./MessagingDashboard.css";
import Conversations from "./Conversations";

const MessagingDashboard = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);

  return (
    <div className="MessagingDashboard-Container">
      <div className="ConversationsContainer">
        <Conversations onConversationSelect={setSelectedConversation} />
      </div>
      <div className="MessagesContainer">
        {selectedConversation ? (
          <Messages conversation={selectedConversation} />
        ) : (
          <div className="PlaceholderText">
            Select a conversation to view messages
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingDashboard;
