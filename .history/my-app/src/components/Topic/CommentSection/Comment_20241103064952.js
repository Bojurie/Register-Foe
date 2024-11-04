import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import axiosInstance from "../../axiosInstance";

const Comment = ({ comment }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText) return;

    try {
      await axiosInstance.post(`/vote/vote/comments/${comment._id}/replies`, {
        text: replyText,
      });
      // Optionally, refresh comments here
      setReplyText("");
    } catch (error) {
      console.error("Failed to post reply:", error.message);
    }
  };

  return (
    <Box border={1} borderRadius={2} padding={2} marginBottom={2}>
      <Typography variant="body1">{comment.text}</Typography>
      <Button onClick={() => setIsReplying((prev) => !prev)}>
        {isReplying ? "Cancel" : "Reply"}
      </Button>

      {isReplying && (
        <form onSubmit={handleReplySubmit}>
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
          />
          <Button type="submit">Submit Reply</Button>
        </form>
      )}

      {/* Render replies if any */}
      {comment.replies && comment.replies.length > 0 && (
        <Box mt={2}>
          {comment.replies.map((reply) => (
            <Typography key={reply._id} variant="body2" sx={{ pl: 3 }}>
              {reply.text}
            </Typography>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Comment;
