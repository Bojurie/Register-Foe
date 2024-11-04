// Messages.js
import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const MessageContainer = styled.div`
  max-height: 80vh;
  overflow-y: auto;
  padding: 20px;
  background: #f4f4f4;
  border-radius: 8px;
`;

const MessageItem = styled(motion.div)`
  background: #fff;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`;

const Messages = ({ messages, handleMessageClick }) => (
  <MessageContainer>
    {messages.length > 0 ? (
      messages.map((message) => (
        <MessageItem
          key={message._id}
          onClick={() => handleMessageClick(message)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p>
            <strong>{message.sender.firstName}</strong>: {message.content}
          </p>
        </MessageItem>
      ))
    ) : (
      <p>No messages available.</p>
    )}
  </MessageContainer>
);

export default Messages;
