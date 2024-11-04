import React, { useState, useEffect } from "react";
import { FaThumbsUp, FaThumbsDown, FaReply } from "react-icons/fa";
import { useAuth } from "../../AuthContext/AuthContext";
import axiosInstance from "../../axiosInstance";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Alert,
} from "@mui/material";
import { styled } from "@mui/system";

const CommentsContainer = styled(Box)({
  maxHeight: "300px",
  overflowY: "auto",
  padding: "16px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  backgroundColor: "#f9f9f9",
});

const CommentBox = styled(Box)({
  padding: "12px",
  marginBottom: "12px",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.2s",
  "&:hover": {
    transform: "scale(1.02)",
  },
});

const UserName = styled(Typography)({
  fontWeight: "bold",
  marginBottom: "4px",
});

const CommentSection = ({ topicId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [message, setMessage] = useState(null);
  const [replyText, setReplyText] = useState({});

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axiosInstance.get(
          `/vote/topics/${topicId}/comments/comment`
        );
        setComments(response.data.comments);
      } catch {
        setMessage({ type: "error", text: "Failed to load comments." });
      }
    };
    fetchComments();
  }, [topicId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await axiosInstance.post(
        `/vote/topics/${topicId}/comments/comment`,
        { text: newComment.trim() }
      );
      setComments((prev) => [...prev, response.data.comment]);
      setNewComment("");
      setMessage({ type: "success", text: "Comment added successfully!" });
    } catch {
      setMessage({ type: "error", text: "Failed to add comment." });
    }
  };

  const handleReaction = async (commentId, type) => {
    try {
      const endpoint = `/vote/topics/${topicId}/comments/${commentId}/${type}`;
      const response = await axiosInstance.post(endpoint);
      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId ? response.data.comment : comment
        )
      );
    } catch {
      setMessage({ type: "error", text: `Failed to ${type} comment.` });
    }
  };

  const handleReplySubmit = async (commentId) => {
    const text = replyText[commentId]?.trim();
    if (!text) return;

    try {
      const response = await axiosInstance.post(
        `/vote/topics/${topicId}/comments/${commentId}/reply`,
        { text }
      );
      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId
            ? { ...comment, replies: [...comment.replies, response.data.reply] }
            : comment
        )
      );
      setReplyText((prev) => ({ ...prev, [commentId]: "" }));
      setMessage({ type: "success", text: "Reply added successfully!" });
    } catch {
      setMessage({ type: "error", text: "Failed to add reply." });
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

      <CommentsContainer>
        {comments.map((comment) => (
          <CommentBox key={comment._id}>
            <UserName>{comment.user.name}</UserName>
            <Typography>{comment.text}</Typography>
            <Box className="Comment-actions">
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
              <Box className="ReplyBox" mt={1}>
                <TextField
                  value={replyText[comment._id] || ""}
                  onChange={(e) =>
                    setReplyText((prev) => ({
                      ...prev,
                      [comment._id]: e.target.value,
                    }))
                  }
                  placeholder="Reply to this comment..."
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
                  Submit Reply
                </Button>
              </Box>
            )}
            {comment.replies && comment.replies.length > 0 && (
              <Box mt={2}>
                {comment.replies.map((reply) => (
                  <CommentBox key={reply._id} sx={{ marginLeft: "20px" }}>
                    <UserName>{reply.user.name}</UserName>
                    <Typography>{reply.text}</Typography>
                  </CommentBox>
                ))}
              </Box>
            )}
          </CommentBox>
        ))}
      </CommentsContainer>
    </div>
  );
};

export default CommentSection;
