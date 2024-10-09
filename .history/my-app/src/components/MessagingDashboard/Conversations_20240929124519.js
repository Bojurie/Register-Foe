import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext/AuthContext";
import "./Conversations.css";

const Conversations = ({ onConversationSelect }) => {
  const { user, fetchConversations} = useAuth();
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get("/api/conversations", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setConversations(response.data);
      } catch (error) {
        console.error("Failed to load conversations", error);
      }
    };

    fetchConversations();
  }, [user]);

  return (
    <div className="Conversations-Container">
      <h2>Conversations</h2>
      <ul>
        {conversations.map((conversation) => (
          <li
            key={conversation._id}
            onClick={() => onConversationSelect(conversation)}
          >
            {conversation.title || "No Title"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Conversations;
