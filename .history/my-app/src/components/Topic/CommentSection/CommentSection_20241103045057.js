import React, { useState } from "react";
import axiosInstance from "../../axiosInstance";
import {
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { FaThumbsUp, FaThumbsDown, FaReply } from "react-icons/fa";

const CommentSection = ({ topicId, comments, updateComments }) => {
  const [newComment, setNewComment] = useState("");
  const [replyText, setReplyText] = useState({});
  const [message, setMessage] = useState(null);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await axiosInstance.post(
        `/vote/vote/topics/${topicId}/comments`,
        {
          text: newComment,
        }
      );

      if (response.data.comment) {
        updateComments((prev) => [...prev, response.data.comment]);
        setMessage({ type: "success", text: "Comment added successfully." });
      } else {
        setMessage({
          type: "info",
          text: "Comment added, but update to comments list was not successful.",
        });
      }
      setNewComment("");
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to add comment.",
      });
      console.error("Error adding comment:", error);
    }
  };

  const handleReplySubmit = async (commentId) => {
    const reply = replyText[commentId]?.trim();
    if (!reply) return;

    try {
      const response = await axiosInstance.post(
        `/vote/vote/topics/${topicId}/comments/${commentId}`,
        {
          text: reply,
        }
      );

      updateComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                replies: [...(comment.replies || []), response.data.reply],
              }
            : comment
        )
      );

      setReplyText((prev) => ({ ...prev, [commentId]: "" }));
      setMessage({ type: "success", text: "Reply added successfully." });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to add reply.",
      });
      console.error("Error adding reply:", error);
    }
  };

  const handleReaction = async (commentId, type, isReply = false) => {
    try {
      const response = await axiosInstance.post(
        `/vote/topics/${topicId}/comments/${commentId}/${type}`
      );

      if (isReply) {
        const parentComment = comments.find((comment) =>
          comment.replies?.some((reply) => reply._id === commentId)
        );

        if (parentComment) {
          const updatedReplies = parentComment.replies.map((reply) =>
            reply._id === commentId
              ? { ...reply, reactions: response.data.reactions }
              : reply
          );

          updateComments((prev) =>
            prev.map((comment) =>
              comment._id === parentComment._id
                ? { ...parentComment, replies: updatedReplies }
                : comment
            )
          );
        } else {
          console.error("Parent comment not found for reply ID:", commentId);
        }
      } else {
        updateComments((prev) =>
          prev.map((comment) =>
            comment._id === commentId
              ? { ...comment, reactions: response.data.reactions }
              : comment
          )
        );
      }
    } catch (error) {
      setMessage({ type: "error", text: `Failed to ${type} comment.` });
      console.error("Reaction error:", error);
    }
  };

  return (
    <div className="CommentSection">
      <Typography variant="h6" gutterBottom>
        Comments ({comments.length})
      </Typography>

      {message && <Alert severity={message.type}>{message.text}</Alert>}

      <Box className="AddComment" mb={2}>
        <TextField
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          multiline
          rows={3}
          variant="outlined"
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddComment}
          sx={{ mt: 2 }}
        >
          Add Comment
        </Button>
      </Box>

      <Box>
        {comments.map((comment) => (
          <Box key={comment._id} mb={2} border={1} borderColor="grey.300" p={2}>
            <Box display="flex" alignItems="center">
              <img
                src={comment.user?.profilePicture || "/default-avatar.png"}
                alt="User"
                style={{
                  width: "40px",
                  borderRadius: "50%",
                  marginRight: "8px",
                }}
              />
              <Typography variant="body2" fontWeight="bold">
                {comment.user?.name}
              </Typography>
            </Box>
            <Typography>{comment.text}</Typography>
            <Box display="flex" alignItems="center">
              <IconButton onClick={() => handleReaction(comment._id, "like")}>
                <FaThumbsUp /> {comment.reactions?.likeCount || 0}
              </IconButton>
              <IconButton
                onClick={() => handleReaction(comment._id, "dislike")}
              >
                <FaThumbsDown /> {comment.reactions?.dislikeCount || 0}
              </IconButton>
              <IconButton
                onClick={() =>
                  setReplyText((prev) => ({ ...prev, [comment._id]: "" }))
                }
              >
                <FaReply />
              </IconButton>
            </Box>
            {replyText[comment._id] !== undefined && (
              <Box mt={2}>
                <TextField
                  value={replyText[comment._id] || ""}
                  onChange={(e) =>
                    setReplyText((prev) => ({
                      ...prev,
                      [comment._id]: e.target.value,
                    }))
                  }
                  placeholder="Add a reply..."
                  multiline
                  rows={2}
                  variant="outlined"
                  fullWidth
                />
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleReplySubmit(comment._id)}
                  sx={{ mt: 1 }}
                >
                  Reply
                </Button>
              </Box>
            )}
            {comment.replies?.map((reply) => (
              <Box
                key={reply._id}
                sx={{
                  marginLeft: "30px",
                  border: 1,
                  borderColor: "grey.300",
                  p: 1,
                  mt: 1,
                }}
              >
                <Box display="flex" alignItems="center">
                  <img
                    src={reply.user?.profilePicture || "/default-avatar.png"}
                    alt="User"
                    style={{
                      width: "30px",
                      borderRadius: "50%",
                      marginRight: "8px",
                    }}
                  />
                  <Typography variant="body2" fontWeight="bold">
                    {reply.user?.name}
                  </Typography>
                </Box>
                <Typography>{reply.text}</Typography>
                <Box display="flex" alignItems="center">
                  <IconButton
                    onClick={() => handleReaction(reply._id, "like", true)}
                  >
                    <FaThumbsUp /> {reply.reactions?.likeCount || 0}
                  </IconButton>
                  <IconButton
                    onClick={() => handleReaction(reply._id, "dislike", true)}
                  >
                    <FaThumbsDown /> {reply.reactions?.dislikeCount || 0}
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </div>
  );
};

export default CommentSection;
