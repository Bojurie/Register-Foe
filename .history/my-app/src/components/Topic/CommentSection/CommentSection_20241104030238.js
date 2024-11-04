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
  const userId = user?._id; // Safely accessing user ID
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [replies, setReplies] = useState({});
  const [expandedReplies, setExpandedReplies] = useState({});
  const [replyInputVisible, setReplyInputVisible] = useState({});
  const [error, setError] = useState(null);

  // Fetch comments from the server
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

  // Handle voting on a comment
  const handleVote = useCallback(
    async (commentId, reaction) => {
      if (!["like", "dislike"].includes(reaction)) {
        setError("Invalid reaction. Use 'like' or 'dislike'.");
        return;
      }

      const updatedComments = comments.map((comment) => {
        if (comment.id === commentId) {
          const updatedComment = {
            ...comment,
            reactions: comment.reactions || { likes: [], dislikes: [] },
          };

          if (reaction === "like") {
            if (updatedComment.reactions.likes.includes(userId)) {
              setError("You can only like a comment once.");
              return updatedComment; // Return unchanged
            }
            updatedComment.reactions.likes.push(userId);
          } else if (reaction === "dislike") {
            updatedComment.reactions.dislikes.push(userId);
          }

          updatedComment.likesCount = updatedComment.reactions.likes.length;
          updatedComment.dislikesCount =
            updatedComment.reactions.dislikes.length;

          return updatedComment;
        }
        return comment;
      });

      setComments(updatedComments);

      try {
        await axiosInstance.post(
          `/vote/vote/topics/${topicId}/comments/${commentId}/${reaction}`
        );
      } catch (error) {
        setError("Failed to submit your vote. Please try again.");
        fetchComments(); // Re-fetch to correct the state
      }
    },
    [comments, fetchComments, userId]
  );

  // Handle comment submission
  const handleCommentSubmit = useCallback(
    async (commentId = null) => {
      const text = commentId ? replies[commentId]?.trim() : newComment.trim();

      if (!text) {
        setError("Comment text cannot be empty.");
        return;
      }

      const requestBody = { text }; // Add other fields if needed
      const endpoint = commentId
        ? `/vote/vote/topics/${topicId}/comments/${commentId}`
        : `/vote/vote/topics/${topicId}/comments`;

      setError(null);
      setLoading(true); // Show loading spinner during submission
      try {
        await axiosInstance.post(endpoint, requestBody);
        fetchComments();
        if (!commentId) setNewComment("");
      } catch (error) {
        console.error("Submission Error:", error); // Log error details
        setError(
          error.response?.data?.message ||
            "Failed to submit your comment. Please try again."
        );
      } finally {
        setLoading(false); // Hide loading spinner after submission
      }
    },
    [fetchComments, newComment, replies]
  );

  // Toggle replies for a comment
  const toggleReplies = (commentId) => {
    setExpandedReplies((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  // Toggle reply input visibility
  const toggleReplyInput = (commentId) => {
    setReplyInputVisible((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  // Handle reply text input change
  const handleReplyChange = (commentId, value) => {
    setReplies((prev) => ({ ...prev, [commentId]: value }));
  };

  // Render a single comment
  const renderComment = (comment, index) => {
    const commentId = comment.id || comment._id?.$oid || `comment-${index}`;
    if (!commentId) {
      console.warn("Comment ID is undefined:", comment);
      return null;
    }

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

        {replyInputVisible[commentId] && (
          <Box display="flex" mt={1}>
            <TextField
              variant="outlined"
              placeholder="Reply..."
              value={replies[commentId] || ""}
              onChange={(e) => handleReplyChange(commentId, e.target.value)}
              fullWidth
            />
            <Button
              onClick={() => handleCommentSubmit(commentId)}
              variant="contained"
              color="primary"
              disabled={!replies[commentId]?.trim()}
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
            ) : comment.replies && comment.replies.length > 0 ? (
              comment.replies.map((reply, replyIndex) =>
                renderComment(reply, replyIndex)
              )
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
        disabled={!newComment.trim() || loading} // Disable during loading
      >
        Submit
      </Button>
      <Box>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            {comments.length === 0 && (
              <Typography>No comments yet. Be the first to comment!</Typography>
            )}
            {comments.map(renderComment)}
          </>
        )}
      </Box>
    </Box>
  );
};

export default CommentSection;
