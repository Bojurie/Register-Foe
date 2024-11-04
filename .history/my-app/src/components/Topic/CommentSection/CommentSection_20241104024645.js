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
    if (!["like", "dislike"].includes(reaction)) {
      setError("Invalid reaction. Use 'like' or 'dislike'.");
      return;
    }

    try {
      await axiosInstance.post(
        `/vote/vote/topics/${topicId}/comments/${commentId}/${reaction}`
      );
      fetchComments(); // Re-fetch to get updated comment reactions
    } catch (error) {
      setError("Failed to submit your vote. Please try again.");
      fetchComments(); // Re-fetch to correct the state
    }
  };

  const handleCommentSubmit = useCallback(
    async (commentId = null) => {
      const text = commentId ? replies[commentId]?.trim() : newComment.trim();

      // Ensure that we're not sending empty comments
      if (!text) {
        setError("Comment text cannot be empty.");
        return;
      }

      const requestBody = { text };
      const endpoint = commentId
        ? `/vote/vote/topics/${topicId}/comments/${commentId}`
        : `/vote/vote/topics/${topicId}/comments`;

      setError(null);
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
      }
    },
    [fetchComments, newComment, replies]
  );

  const toggleReplies = (commentId) => {
    setExpandedReplies((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const toggleReplyInput = (commentId) => {
    setReplyInputVisible((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleReplyChange = (commentId, value) => {
    setReplies((prev) => ({ ...prev, [commentId]: value }));
  };

  const renderComment = (comment, index) => {
    const commentId = comment.id || comment._id?.$oid || `comment-${index}`;
    if (!commentId) {
      console.warn("Comment ID is undefined:", comment);
      return null;
    }

    return (
      <Box key={commentId} mb={3} borderBottom="1px solid #ddd" pb={2}>
        <Typography variant="body1">{comment.text}</Typography>
        <Box display="flex" alignItems="center" mt={1}>
          <Button onClick={() => handleVote(commentId, "like")}>
            <FaThumbsUp /> {comment.likesCount || 0}
          </Button>
          <Button onClick={() => handleVote(commentId, "dislike")}>
            <FaThumbsDown /> {comment.dislikesCount || 0}
          </Button>
          <IconButton onClick={() => toggleReplies(commentId)}>
            {expandedReplies[commentId] ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
          <IconButton onClick={() => toggleReplyInput(commentId)}>
            <FaReply />
          </IconButton>
        </Box>
        {replyInputVisible[commentId] && (
          <Box display="flex" mt={2}>
            <TextField
              value={replies[commentId] || ""}
              onChange={(e) => handleReplyChange(commentId, e.target.value)}
              variant="outlined"
              placeholder="Reply..."
              fullWidth
            />
            <Button onClick={() => handleCommentSubmit(commentId)}>
              Reply
            </Button>
          </Box>
        )}
        {expandedReplies[commentId] && (
          <Box ml={3}>
            {comment.replies.map((reply, replyIndex) => (
              <Box key={replyIndex} borderBottom="1px solid #eee" mb={1}>
                <Typography variant="body2">{reply.text}</Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box>
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}
      {!loading && !error && (
        <>
          {comments.map(renderComment)}
          <TextField
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            variant="outlined"
            placeholder="Add a comment..."
            fullWidth
            margin="normal"
          />
          <Button onClick={handleCommentSubmit}>Submit</Button>
        </>
      )}
    </Box>
  );
};

export default CommentSection;
