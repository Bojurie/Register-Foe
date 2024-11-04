import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import axiosInstance from "../axiosInstance";

const Comment = ({ comment }) => {
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState(comment.replies || []);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText) return;

    try {
      const response = await axiosInstance.post(
        `/vote/vote/comments/${comment._id}/replies`,
        {
          text: replyText,
          userId: comment.userId,
        }
      );
      setReplies((prev) => [...prev, response.data.reply]);
      setReplyText("");
    } catch (error) {
      console.error("Failed to add reply:", error.message);
    }
  };

  return (
    <Box marginBottom={2}>
      <Typography variant="subtitle1">
        {comment.userName}: {comment.text}
      </Typography>
      <form onSubmit={handleReplySubmit}>
        <input
          type="text"
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Reply..."
        />
        <Button type="submit">Reply</Button>
      </form>
      {replies.map((reply) => (
        <Box key={reply._id} marginLeft={4}>
          <Typography variant="subtitle2">
            {reply.userName}: {reply.text}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default Comment;
