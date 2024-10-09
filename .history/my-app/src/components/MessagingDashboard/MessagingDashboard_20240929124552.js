import React, { useState } from "react";
import Conversations from "./Conversations";
import Messages from "./Messages";


import "./MessagingDashboard.css";

const MessagingDashboard = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);

  return (
    <div className="MessagingDashboard-Container">
      <Conversations onConversationSelect={setSelectedConversation} />
      {selectedConversation && <Messages conversation={selectedConversation} />}
    </div>
  );
};

export default MessagingDashboard;
