import React, { useCallback, useState, useEffect } from "react";
import { useAuth} from "../AuthContext/AuthContext";
import "./Messages.css";

const Messages = ({ userId }) => {
  const { user,getMessages  } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch messages using useCallback for memoization
  const fetchMessages = useCallback(async (userId) => {
    try {
      if (!userId) {
        console.warn("fetchMessages: User ID is undefined or null");
        return;
      }
      const response = await getMessages(userId);
      setMessages(response);
    } catch (error) {
      console.error("Error in fetchMessages:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && userId) {
      fetchMessages(userId);
    }
  }, [user, userId, fetchMessages]);

  if (loading) {
    return <div>Loading messages...</div>;
  }

  return (
    <div className="Messages">
      {messages.length > 0 ? (
        messages.map((message) => (
          <div key={message._id} className="MessageItem">
            <p>
              <strong>{message.sender.username}:</strong> {message.content}
            </p>
          </div>
        ))
      ) : (
        <p>No messages available.</p>
      )}
    </div>
  );
};

export default Messages;
