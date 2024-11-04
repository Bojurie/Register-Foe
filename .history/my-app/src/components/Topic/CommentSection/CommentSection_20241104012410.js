import React, { useState, useEffect } from "react";
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

const CommentSection = ({ topicId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [replies, setReplies] = useState({});
  const [expandedReplies, setExpandedReplies] = useState({});
  const [replyInputVisible, setReplyInputVisible] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchComments();
  }, [topicId]);

  const fetchComments = async () => {
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
  };

  const handleVote = async (commentId, reaction, isReply = false) => {
    if (!["like", "dislike"].includes(reaction)) {
      console.error("Invalid reaction. Use 'like' or 'dislike'.");
      return;
    }

    const updateCommentsList = (commentsList) =>
      commentsList.map((comment) => {
        if (comment.id && comment.id.$oid === commentId) {
          const updatedComment = { ...comment };
          if (reaction === "like") {
            updatedComment.reactions.likeCount += 1;
          } else {
            updatedComment.reactions.dislikeCount += 1;
          }
          return updatedComment;
        } else if (comment.replies) {
          // Recursively update replies
          return {
            ...comment,
            replies: updateCommentsList(comment.replies),
          };
        }
        return comment;
      });

    setComments((prevComments) => updateCommentsList(prevComments));

    try {
      await axiosInstance.post(
        `/vote/vote/topics/${topicId}/comments/${commentId}/${reaction}`
      );
    } catch (error) {
      console.error("Error handling vote:", error.response?.data || error);
      setError("Failed to submit your vote. Please try again.");
      fetchComments(); // Re-fetch to correct the state
    }
  };

  const handleCommentSubmit = async (commentId = null) => {
    const requestBody = {
      text: commentId ? replies[commentId]?.trim() : newComment.trim(),
    };
    const endpoint = commentId
      ? `/vote/vote/topics/${topicId}/comments/${commentId}`
      : `/vote/vote/topics/${topicId}/comments`;

    setError(null);
    try {
      await axiosInstance.post(endpoint, requestBody);
      fetchComments();
      if (!commentId) setNewComment("");
    } catch (error) {
      console.error(
        "Error posting comment or reply:",
        error.response?.data || error
      );
      setError("Failed to submit your comment. Please try again.");
    }
  };

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

  const renderComment = (comment) => {
    const commentId = comment.id ? comment.id.$oid : null;
    if (!commentId) {
      console.warn("Comment ID is undefined:", comment);
      return null;
    }

    return (
      <Box key={commentId} mb={3} borderBottom="1px solid #ddd" pb={2}>
        <Typography variant="body1">{comment.text}</Typography>
        <Box display="flex" alignItems="center" mt={1}>
          <Button onClick={() => handleVote(commentId, "like")}>
            <FaThumbsUp />{" "}
            {comment.reactions && comment.reactions.likeCount
              ? comment.reactions.likeCount.$numberInt
              : 0}
          </Button>
          <Button onClick={() => handleVote(commentId, "dislike")}>
            <FaThumbsDown />{" "}
            {comment.reactions && comment.reactions.dislikeCount
              ? comment.reactions.dislikeCount.$numberInt
              : 0}
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
              disabled={!replies[commentId]?.trim()}
              sx={{ ml: 1 }}
            >
              Reply
            </Button>
          </Box>
        )}

        {expandedReplies[commentId] && (
          <Box ml={4} mt={1}>
            {comment.replies && comment.replies.length > 0 ? (
              comment.replies.map((reply) => renderComment(reply))
            ) : (
              <Typography variant="body2">No replies yet.</Typography>
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
      />
      <Button
        onClick={() => handleCommentSubmit()}
        variant="contained"
        sx={{ mt: 1 }}
        disabled={!newComment.trim()}
      >
        Submit
      </Button>
      <Box mt={2}>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            {comments.length === 0 && (
              <Typography>No comments yet. Be the first to comment!</Typography>
            )}
            {comments.map((comment) => renderComment(comment))}
          </>
        )}
      </Box>
    </Box>
  );
};

export default CommentSection;
