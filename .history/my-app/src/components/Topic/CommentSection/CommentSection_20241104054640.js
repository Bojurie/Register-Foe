import React, { useState, useEffect, useCallback } from "react";
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
  const [replies, setReplies] = useState({}); // Store replies for comments
  const [replyInputVisible, setReplyInputVisible] = useState(null); // Track reply input visibility
  const [error, setError] = useState(null);
  const [reactions, setReactions] = useState({}); // Store reactions for comments
  const [replyReactions, setReplyReactions] = useState({}); // Store reactions for replies

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

      // Fetch reactions for replies
      const replies = await axiosInstance.get(
        `/vote/vote/topics/${topicId}/comments/${commentId}/replies`
      );
      replies.data.forEach((reply) => {
        fetchReplyReactions(reply._id);
      });
    } catch (error) {
      console.error("Failed to fetch reactions:", error);
    }
  };

  const fetchReplyReactions = async (replyId) => {
    if (!replyId) {
      console.warn("Reply ID is not provided for fetching reactions.");
      return;
    }

    try {
      const { data } = await axiosInstance.get(
        `/vote/vote/topics/${topicId}/replies/${replyId}/reactions`
      );
      setReplyReactions((prev) => ({
        ...prev,
        [replyId]: data.reactions,
      }));
    } catch (error) {
      console.error("Failed to fetch reply reactions:", error);
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
    [comments, fetchComments, userId, topicId]
  );

  const handleReplyVote = useCallback(
    async (replyId, reaction) => {
      if (!["like", "dislike"].includes(reaction)) {
        setError("Invalid reaction. Use 'like' or 'dislike'.");
        return;
      }

      const updatedReplies = { ...replyReactions };
      if (updatedReplies[replyId]) {
        const userAlreadyReacted =
          updatedReplies[replyId][`${reaction}s`].includes(userId);
        if (userAlreadyReacted) {
          setError(`You can only ${reaction} a reply once.`);
          return;
        }
        updatedReplies[replyId][`${reaction}s`].push(userId);
      } else {
        updatedReplies[replyId] = { likes: [], dislikes: [] };
        updatedReplies[replyId][`${reaction}s`].push(userId);
      }

      setReplyReactions(updatedReplies);

      try {
        await axiosInstance.post(
          `/vote/vote/topics/${topicId}/replies/${replyId}/${reaction}`
        );
        await fetchReplyReactions(replyId);
      } catch (error) {
        setError("Failed to submit your vote for the reply. Please try again.");
        console.error("Vote submission error for reply:", error);
      }
    },
    [replyReactions, fetchReplyReactions, userId, topicId]
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

  const toggleReplyInput = (commentId) => {
    setReplyInputVisible((prev) => (prev === commentId ? null : commentId));
  };

  const handleReplyChange = (commentId, value) => {
    setReplies((prev) => ({ ...prev, [commentId]: value }));
  };

  const renderReply = (reply) => {
    const replyId = reply._id; // Ensure we're using the correct ID for replies
    const replyReactionCounts = replyReactions[replyId] || {
      likes: [],
      dislikes: [],
      likesCount: 0,
      dislikesCount: 0,
    };

    return (
      <Box key={replyId} mb={1} borderBottom="1px solid #ddd" pb={1} pt={1}>
        <Typography variant="body2">{reply.text}</Typography>
        <Box display="flex" alignItems="center" mt={1}>
          <Button
            onClick={() => handleReplyVote(replyId, "like")}
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<FaThumbsUp />}
          >
            {replyReactionCounts.likesCount}
          </Button>
          <Button
            onClick={() => handleReplyVote(replyId, "dislike")}
            variant="outlined"
            color="secondary"
            size="small"
            startIcon={<FaThumbsDown />}
          >
            {replyReactionCounts.dislikesCount}
          </Button>
        </Box>
      </Box>
    );
  };

  const renderComment = (comment) => {
    const commentId = comment._id;
    const replyReactionCounts = reactions[commentId] || {
      likes: [],
      dislikes: [],
      likesCount: 0,
      dislikesCount: 0,
    };

    return (
      <Box key={commentId} mb={2}>
        <Typography variant="body1">{comment.text}</Typography>
        <Box display="flex" alignItems="center" mt={1}>
          <Button
            onClick={() => handleVote(commentId, "like")}
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<FaThumbsUp />}
          >
            {replyReactionCounts.likesCount}
          </Button>
          <Button
            onClick={() => handleVote(commentId, "dislike")}
            variant="outlined"
            color="secondary"
            size="small"
            startIcon={<FaThumbsDown />}
          >
            {replyReactionCounts.dislikesCount}
          </Button>
          <IconButton
            onClick={() => toggleReplyInput(commentId)}
            size="small"
            sx={{ ml: 1 }}
          >
            {replyInputVisible === commentId ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>

        {replyInputVisible === commentId && (
          <Box mt={2}>
            <TextField
              variant="outlined"
              placeholder="Write a reply..."
              value={replies[commentId] || ""}
              onChange={(e) => handleReplyChange(commentId, e.target.value)}
              fullWidth
              sx={{ mb: 1 }}
            />
            <Button
              onClick={() => handleCommentSubmit(commentId)}
              variant="contained"
              color="primary"
              disabled={!replies[commentId]?.trim()}
            >
              Reply
            </Button>
          </Box>
        )}

        <Box
          mt={2}
          maxHeight="200px"
          overflow="auto"
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
      </Box>
    );
  };

  return (
    <Box>
      <Typography variant="h6">Comments</Typography>
      <TextField
        variant="outlined"
        placeholder="Write a comment..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
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
        <Box mt={2} maxHeight="400px" overflow="auto">
          {comments.length > 0 ? (
            comments.map(renderComment)
          ) : (
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
