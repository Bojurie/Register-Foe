import React, { useState, useEffect, useContext, useCallback } from "react";
import axiosInstance from "../../axiosInstance";
import { FaThumbsUp, FaThumbsDown, FaReply } from "react-icons/fa";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { useAuth } from "../../AuthContext/AuthContext";

const CommentSection = ({ topicId }) => {
  const { user } = useAuth();
  const userId = user?._id;
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [replyInput, setReplyInput] = useState({});
  const [expandedReplies, setExpandedReplies] = useState({});
  const [error, setError] = useState(null);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.get(
        `/vote/vote/topics/${topicId}/comments`
      );
      setComments(data.comments || []);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching comments.");
    } finally {
      setLoading(false);
    }
  }, [topicId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleVote = async (commentId, reaction) => {
    try {
      await axiosInstance.post(
        `/vote/vote/topics/${topicId}/comments/${commentId}/${reaction}`
      );
      fetchComments();
    } catch (error) {
      setError("Failed to submit your vote. Please try again.");
    }
  };

  const handleCommentSubmit = async (commentId = null) => {
    const text = commentId ? replyInput[commentId]?.trim() : newComment.trim();

    if (!text) {
      setError("Comment text cannot be empty.");
      return;
    }

    if (!userId) {
      setError("User not identified. Please log in again.");
      return;
    }

    const requestBody = { text, userId };
    const endpoint = commentId
      ? `/vote/vote/topics/${topicId}/comments/${commentId}`
      : `/vote/vote/topics/${topicId}/comments`;

    try {
      await axiosInstance.post(endpoint, requestBody);
      fetchComments();
      if (!commentId) {
        setNewComment("");
      } else {
        setReplyInput((prev) => ({ ...prev, [commentId]: "" }));
      }
    } catch (error) {
      setError("Failed to submit your comment. Please try again.");
    }
  };

  const toggleReplies = (commentId) => {
    setExpandedReplies((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const toggleReplyInput = (commentId) => {
    setReplyInput((prev) => ({
      ...prev,
      [commentId]: prev[commentId] ? "" : "",
    }));
  };

  const renderComment = (comment) => {
    const commentId = comment._id;

    return (
      <Box key={commentId} mb={3} borderBottom="1px solid #ddd" pb={2} pt={1}>
        <Typography variant="body1">{comment.text}</Typography>
        <Box display="flex" alignItems="center" mt={1}>
          <Button
            onClick={() => handleVote(commentId, "like")}
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<FaThumbsUp />}
          >
            {comment.likesCount || 0}
          </Button>
          <Button
            onClick={() => handleVote(commentId, "dislike")}
            variant="outlined"
            color="secondary"
            size="small"
            startIcon={<FaThumbsDown />}
          >
            {comment.dislikesCount || 0}
          </Button>
          <IconButton onClick={() => toggleReplies(commentId)}>
            {expandedReplies[commentId] ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
          <IconButton onClick={() => toggleReplyInput(commentId)}>
            <FaReply />
          </IconButton>
        </Box>

        {replyInput[commentId] !== undefined && (
          <Box display="flex" mt={1}>
            <TextField
              variant="outlined"
              placeholder="Reply..."
              value={replyInput[commentId] || ""}
              onChange={(e) =>
                setReplyInput((prev) => ({
                  ...prev,
                  [commentId]: e.target.value,
                }))
              }
              fullWidth
            />
            <Button
              onClick={() => handleCommentSubmit(commentId)}
              variant="contained"
              color="primary"
              disabled={!replyInput[commentId]?.trim()}
              sx={{ ml: 1 }}
            >
              Reply
            </Button>
          </Box>
        )}

        {expandedReplies[commentId] && (
          <Box
            ml={4}
            mt={1}
            maxHeight="200px"
            overflow="auto"
            border="1px solid #ddd"
            borderRadius="4px"
            bgcolor="#f9f9f9"
            p={1}
          >
            {loading ? (
              <CircularProgress />
            ) : comment.replies?.length > 0 ? (
              comment.replies.map(renderComment)
            ) : (
              <Typography variant="body2" color="textSecondary">
                No replies yet.
              </Typography>
            )}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box>
      {error && <Typography color="error">{error}</Typography>}
      <TextField
        variant="outlined"
        fullWidth
        placeholder="Add a comment..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        multiline
        rows={3}
        sx={{ mb: 2 }}
      />
      <Button
        onClick={() => handleCommentSubmit()}
        variant="contained"
        color="primary"
        sx={{ mb: 2 }}
        disabled={!newComment.trim() || loading}
      >
        {loading ? <CircularProgress size={24} /> : "Submit Comment"}
      </Button>
      {loading ? <CircularProgress /> : comments.map(renderComment)}
    </Box>
  );
};

export default CommentSection;
