import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { FaThumbsUp, FaThumbsDown, FaReply } from "react-icons/fa";
import { useAuth } from "../../AuthContext/AuthContext";
import axiosInstance from "../../axiosInstance";
import { Box, Typography, TextField, Button, IconButton } from "@mui/material";
import { styled } from "@mui/system";

// Styled container for comments
const CommentsContainer = styled(Box)({
  maxHeight: "300px",
  overflowY: "auto",
  padding: "16px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  backgroundColor: "#f9f9f9",
});

// Styled individual comment
const CommentBox = styled(Box)({
  padding: "12px",
  marginBottom: "12px",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

const CommentSection = ({ topicId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  // const { enqueueSnackbar } = useSnackbar();
  const [replyText, setReplyText] = useState({});

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axiosInstance.get(
          `/vote/topics/${topicId}/comments/comment`
        );
        setComments(response.data.comments);
      } catch (error) {
        enqueueSnackbar("Failed to load comments.", { variant: "error" });
      }
    };

    fetchComments();
  }, [topicId, enqueueSnackbar]);

  // Handle adding a new comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await axiosInstance.post(
        `/vote/topics/${topicId}/comments/comment`,
        {
          text: newComment.trim(),
        }
      );

      setComments((prev) => [...prev, response.data.comment]);
      setNewComment("");
      enqueueSnackbar("Comment added!", { variant: "success" });
    } catch (error) {
      console.error(
        "Error adding comment:",
        error.response?.data || error.message
      );
      enqueueSnackbar("Failed to add comment.", { variant: "error" });
    }
  };

  // Handle liking a comment
  const handleLikeComment = async (commentId) => {
    try {
      const response = await axiosInstance.post(
        `/vote/topics/${topicId}/comments/${commentId}/like`
      );
      const updatedComment = response.data.comment;
      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId ? updatedComment : comment
        )
      );
    } catch (error) {
      enqueueSnackbar("Failed to like comment.", { variant: "error" });
    }
  };

  // Handle disliking a comment
  const handleDislikeComment = async (commentId) => {
    try {
      const response = await axiosInstance.post(
        `/vote/topics/${topicId}/comments/${commentId}/dislike`
      );
      const updatedComment = response.data.comment;
      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId ? updatedComment : comment
        )
      );
    } catch (error) {
      enqueueSnackbar("Failed to dislike comment.", { variant: "error" });
    }
  };

  // Handle reply submission
  const handleReplySubmit = async (commentId) => {
    const text = replyText[commentId]?.trim();
    if (!text) return;

    try {
      const response = await axiosInstance.post(
        `/vote/topics/${topicId}/comments/${commentId}/reply`,
        {
          text,
        }
      );
      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId
            ? { ...comment, replies: [...comment.replies, response.data.reply] }
            : comment
        )
      );
      setReplyText((prev) => ({ ...prev, [commentId]: "" }));
      enqueueSnackbar("Reply added!", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Failed to add reply.", { variant: "error" });
    }
  };

  return (
    <div className="CommentSection">
      <Typography variant="h6" gutterBottom>
        Comments
      </Typography>
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
            <Box>
              <Typography>{comment.text}</Typography>
              <Box className="Comment-actions">
                <IconButton onClick={() => handleLikeComment(comment._id)}>
                  <FaThumbsUp /> {comment.reactions?.likeCount || 0}
                </IconButton>
                <IconButton onClick={() => handleDislikeComment(comment._id)}>
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
            </Box>
          </CommentBox>
        ))}
      </CommentsContainer>
    </div>
  );
};

export default CommentSection;
