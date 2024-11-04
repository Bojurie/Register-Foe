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
  const [replyInputVisible, setReplyInputVisible] = useState(null); // Track a single reply input
  const [error, setError] = useState(null);
  const [reactions, setReactions] = useState({}); // Store reactions for comments

  const fetchComments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.get(
        `/vote/vote/topics/${topicId}/comments`
      );
      setComments(data.comments || []);

      // Fetch reactions for each comment
      await Promise.all(
        data.comments.map((comment) =>
          comment._id ? fetchReactions(comment._id) : Promise.resolve()
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching comments.");
    } finally {
      setLoading(false);
    }
  }, [topicId]);

  const fetchReactions = async (commentId) => {
    if (!commentId) {
      console.warn("Comment ID is not provided for fetching reactions.");
      return;
    }

    try {
      const { data } = await axiosInstance.get(
        `/vote/vote/topics/${topicId}/comments/${commentId}/reactions`
      );
      setReactions((prev) => ({
        ...prev,
        [commentId]: data.reactions,
      }));
    } catch (error) {
      console.error("Failed to fetch reactions:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleVote = useCallback(
    async (commentId, reaction) => {
      if (!["like", "dislike"].includes(reaction)) {
        setError("Invalid reaction. Use 'like' or 'dislike'.");
        return;
      }

      const updatedComments = comments.map((comment) => {
        if (comment._id === commentId) {
          const updatedComment = {
            ...comment,
            reactions: comment.reactions || { likes: [], dislikes: [] },
          };

          const userAlreadyReacted =
            updatedComment.reactions[`${reaction}s`].includes(userId);
          if (userAlreadyReacted) {
            setError(`You can only ${reaction} a comment once.`);
            return updatedComment; // Return unchanged
          }
          updatedComment.reactions[`${reaction}s`].push(userId);

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
        // Refetch reactions to update counts and user lists
        await fetchReactions(commentId);
      } catch (error) {
        setError("Failed to submit your vote. Please try again.");
        console.error("Vote submission error:", error);
        fetchComments(); // Re-fetch to correct the state
      }
    },
    [comments, fetchComments, userId]
  );

  const handleCommentSubmit = useCallback(
    async (commentId = null) => {
      const text = commentId ? replies[commentId]?.trim() : newComment.trim();

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

      setError(null);
      setLoading(true);

      try {
        await axiosInstance.post(endpoint, requestBody);
        fetchComments();

        if (!commentId) {
          setNewComment("");
        } else {
          setReplies((prevReplies) => ({
            ...prevReplies,
            [commentId]: "",
          }));
          setReplyInputVisible(null); // Hide the reply input after submission
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to submit your comment. Please try again.";
        setError(errorMessage);
        console.error(
          "Submission Error:",
          error.response ? error.response.data : error
        );
      } finally {
        setLoading(false);
      }
    },
    [fetchComments, newComment, replies, userId, topicId]
  );

  const toggleReplies = (commentId) => {
    setExpandedReplies((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const toggleReplyInput = (commentId) => {
    setReplyInputVisible((prev) => (prev === commentId ? null : commentId));
  };

  const handleReplyChange = (commentId, value) => {
    setReplies((prev) => ({ ...prev, [commentId]: value }));
  };

  const renderReply = (reply) => {
    const replyId = reply._id; // Ensure we're using the correct ID

    const replyReactions = reactions[replyId] || {
      likes: [],
      dislikes: [],
      likesCount: 0,
      dislikesCount: 0,
    };

    return (
      <Box key={replyId} mb={2} borderBottom="1px solid #ddd" pb={1} pt={1}>
        <Typography variant="body2">{reply.text}</Typography>
        <Box display="flex" alignItems="center" mt={1}>
          <Button
            onClick={() => handleVote(replyId, "like")}
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<FaThumbsUp />}
          >
            {replyReactions.likesCount}
          </Button>
          <Button
            onClick={() => handleVote(replyId, "dislike")}
            variant="outlined"
            color="secondary"
            size="small"
            startIcon={<FaThumbsDown />}
          >
            {replyReactions.dislikesCount}
          </Button>
        </Box>
      </Box>
    );
  };

  const renderComment = (comment) => {
    const commentId = comment._id; // Ensure we're using the correct ID

    const commentReactions = reactions[commentId] || {
      likes: [],
      dislikes: [],
      likesCount: 0,
      dislikesCount: 0,
    };

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
            {commentReactions.likesCount}
          </Button>
          <Button
            onClick={() => handleVote(commentId, "dislike")}
            variant="outlined"
            color="secondary"
            size="small"
            startIcon={<FaThumbsDown />}
          >
            {commentReactions.dislikesCount}
          </Button>
          <IconButton onClick={() => toggleReplies(commentId)}>
            {expandedReplies[commentId] ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
          <IconButton onClick={() => toggleReplyInput(commentId)}>
            <FaReply />
          </IconButton>
        </Box>

        {replyInputVisible === commentId && ( // Only show reply input for the active comment
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
            >
              Submit
            </Button>
          </Box>
        )}

        {expandedReplies[commentId] && (
          <Box
            mt={2}
            maxHeight="150px"
            overflowY="auto"
            border="1px solid #ddd"
            p={1}
          >
            {comment.replies && comment.replies.length > 0 ? (
              comment.replies.map(renderReply)
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
      <Typography variant="h6">Comments</Typography>
      <TextField
        variant="outlined"
        placeholder="Add a comment..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button
        onClick={() => handleCommentSubmit()}
        variant="contained"
        color="primary"
        disabled={!newComment.trim()}
      >
        Submit
      </Button>

      {loading ? (
        <CircularProgress />
      ) : (
        <Box
          mt={2}
          maxHeight="300px"
          overflowY="auto"
          border="1px solid #ddd"
          p={1}
        >
          {comments.map(renderComment)}
          {comments.length === 0 && (
            <Typography variant="body2" color="textSecondary">
              No comments yet.
            </Typography>
          )}
        </Box>
      )}

      {error && (
        <Typography variant="body2" color="error" mt={2}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default CommentSection;
