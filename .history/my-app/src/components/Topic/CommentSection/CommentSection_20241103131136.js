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
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError("Failed to load comments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (id, reaction) => {
    if (!["like", "dislike"].includes(reaction)) {
      console.error("Invalid reaction. Use 'like' or 'dislike'.");
      return;
    }

    const updatedComments = comments.map((comment) => {
      if (comment._id.$oid === id) {
        const updatedComment = { ...comment };
        updatedComment.reactions[reaction + "Count"].$numberInt++;
        return updatedComment;
      }
      return comment;
    });

    setComments(updatedComments); // Optimistically update UI

    try {
      await axiosInstance.post(
        `/vote/vote/topics/${topicId}/comments/${id}/${reaction}`
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
              const commentId = comment._id ? comment._id.$oid : null; // Safe access
              if (!commentId) {
                console.warn("Comment ID is undefined:", comment);
                return null; // Skip rendering this comment if ID is undefined
              }

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
                      <FaThumbsUp />{" "}
                      {comment.reactions.likeCount?.$numberInt || 0}
                    </Button>
                    <Button onClick={() => handleVote(commentId, "dislike")}>
                      <FaThumbsDown />{" "}
                      {comment.reactions.dislikeCount?.$numberInt || 0}
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
                      {comment.replies &&
                        comment.replies.map((reply) => {
                          const replyId = reply._id ? reply._id.$oid : null; // Safe access
                          return (
                            <Box key={replyId} mb={1}>
                              <Typography variant="body2">
                                {reply.text}
                              </Typography>
                            </Box>
                          );
                        })}
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
