import React, { useState, useEffect } from "react";
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
import './CommentSection.css'

const CommentSection = ({ topicId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyText, setReplyText] = useState({});
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axiosInstance.get(
        `/vote/vote/topics/${topicId}/comments`
      );
      setComments(response.data.comments || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setMessage({ type: "error", text: "Failed to load comments." });
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const { data } = await axiosInstance.post(
        `/vote/vote/topics/${topicId}/comments`,
        { text: newComment }
      );
      setComments((prev) => [...prev, data.comment]);
      setNewComment("");
      setMessage({ type: "success", text: "Comment added successfully." });
    } catch (error) {
      console.error("Error adding comment:", error);
      setMessage({ type: "error", text: "Failed to add comment." });
    }
  };

  const handleReplySubmit = async (commentId) => {
    const reply = replyText[commentId];
    if (!reply || !reply.trim()) return;

    try {
      const { data } = await axiosInstance.post(
        `/vote/vote/topics/${topicId}/comments/${commentId}`,
        { text: reply }
      );
      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId
            ? { ...comment, replies: [...(comment.replies || []), data.reply] }
            : comment
        )
      );
      setReplyText((prev) => ({ ...prev, [commentId]: "" }));
      setMessage({ type: "success", text: "Reply added successfully." });
    } catch (error) {
      console.error("Error adding reply:", error);
      setMessage({ type: "error", text: "Failed to add reply." });
    }
  };

  const handleReaction = async (commentId, type, isReply = false) => {
    if (!["like", "dislike"].includes(type)) {
      setMessage({
        type: "error",
        text: "Invalid action. Use 'like' or 'dislike'.",
      });
      return;
    }

    try {
      const endpoint = `/vote/vote/topics/${topicId}/comments/${commentId}/${type}`;
      const response = await axiosInstance.post(endpoint);
      setComments((prevComments) =>
        prevComments.map((comment) =>
          isReply
            ? {
                ...comment,
                replies: comment.replies?.map((reply) =>
                  reply._id === commentId
                    ? { ...reply, reactions: response.data.reactions }
                    : reply
                ),
              }
            : comment._id === commentId
            ? { ...comment, reactions: response.data.reactions }
            : comment
        )
      );
    } catch (error) {
      console.error("Reaction error:", error);
      setMessage({ type: "error", text: "Failed to update reaction." });
    }
  };

  return (
    <div className="CommentSection">
      <Typography variant="h6" gutterBottom>
        Comments ({comments.length})
      </Typography>
      {message && <Alert severity={message.type}>{message.text}</Alert>}

      <Box className="AddComment">
        <TextField
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          multiline
          rows={3}
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleAddComment}>
          Add Comment
        </Button>
      </Box>

      <Box>
        {comments.map((comment) => (
          <Box key={comment._id} className="CommentBox" sx={{ mb: 2 }}>
            <Box display="flex" alignItems="center" mb={1}>
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
            <Box className="Comment-actions" mt={1}>
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
                  sx={{ mb: 1 }}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleReplySubmit(comment._id)}
                >
                  Reply
                </Button>
              </Box>
            )}
            {comment.replies?.map((reply) => (
              <Box key={reply._id} ml={4} mt={2} className="ReplyBox">
                <Box display="flex" alignItems="center" mb={1}>
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
