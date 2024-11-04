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

  const handleVote = async (commentId, reaction) => {
    if (!["like", "dislike"].includes(reaction)) {
      console.error("Invalid reaction type.");
      return;
    }

    // Optimistic UI update
    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        const updatedComment = { ...comment };
        if (!updatedComment.reactions) {
          updatedComment.reactions = { likeCount: 0, dislikeCount: 0 };
        }
        if (reaction === "like") {
          updatedComment.reactions.likeCount += 1;
        } else {
          updatedComment.reactions.dislikeCount += 1;
        }
        return updatedComment;
      }
      return comment;
    });
    setComments(updatedComments);

    try {
      await axiosInstance.post(
        `/vote/vote/topics/${topicId}/comments/${commentId}/${reaction}`
      );
    } catch (err) {
      console.error("Failed to submit vote:", err);
      setError("Failed to submit your vote. Please try again.");
      fetchComments(); // Revert optimistic UI on error
    }
  };

  const handleCommentSubmit = async (commentId = null) => {
    const text = commentId ? replies[commentId]?.trim() : newComment.trim();
    if (!text) return;

    const endpoint = commentId
      ? `/vote/vote/topics/${topicId}/comments/${commentId}`
      : `/vote/vote/topics/${topicId}/comments`;

    setError(null);
    try {
      await axiosInstance.post(endpoint, { text });
      fetchComments();
      if (!commentId) setNewComment(""); // Clear new comment input
      setReplies((prev) => ({ ...prev, [commentId]: "" })); // Clear reply input
    } catch (err) {
      console.error("Failed to post comment:", err);
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
            {comments.map((comment) => {
              const commentId = comment.id;
              return (
                <Box
                  key={commentId}
                  mb={3}
                  borderBottom="1px solid #ddd"
                  pb={2}
                >
                  <Typography variant="body1">{comment.text}</Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    <Button onClick={() => handleVote(commentId, "like")}>
                      <FaThumbsUp /> {comment.reactions?.likeCount || 0}
                    </Button>
                    <Button onClick={() => handleVote(commentId, "dislike")}>
                      <FaThumbsDown /> {comment.reactions?.dislikeCount || 0}
                    </Button>
                    <IconButton onClick={() => toggleReplies(commentId)}>
                      {expandedReplies[commentId] ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      )}
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
                        onChange={(e) =>
                          handleReplyChange(commentId, e.target.value)
                        }
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
                      {comment.replies?.map((reply) => (
                        <Box key={reply.id} mb={1}>
                          <Typography variant="body2">{reply.text}</Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              );
            })}
          </>
        )}
      </Box>
    </Box>
  );
};

export default CommentSection;
