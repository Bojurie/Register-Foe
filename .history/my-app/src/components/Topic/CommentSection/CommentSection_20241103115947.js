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
  const [error, setError] = useState(null); // State for handling errors

  useEffect(() => {
    fetchComments();
  }, [topicId]);

  const fetchComments = async () => {
    setLoading(true);
    setError(null); // Reset error state before fetching
    try {
      const response = await axiosInstance.get(
        `/vote/vote/topics/${topicId}/comments`
      );
      setComments(response.data.comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError("Failed to load comments. Please try again."); // Set error message
    } finally {
      setLoading(false);
    }
  };

const handleVote = async (id, reaction, isReply = false) => {
  if (!["like", "dislike"].includes(reaction)) {
    console.error("Invalid reaction. Use 'like' or 'dislike'.");
    return;
  }

  try {
    // Modify the endpoint to include the correct IDs
    const endpoint = isReply
      ? `/vote/vote/topics/${topicId}/comments/${id}/${reaction}` // Ensure this matches your API structure
      : `/vote/vote/topics/${topicId}/comments/${id}/${reaction}`;

    await axiosInstance.post(endpoint);
    fetchComments(); // Re-fetch comments to update counts
  } catch (error) {
    console.error("Error handling vote:", error.response?.data || error);
    setError("Failed to submit your vote. Please try again."); // Set error message
  }
};


  const handleCommentSubmit = async (commentId = null) => {
    const requestBody = {
      text: commentId ? replies[commentId]?.trim() : newComment.trim(),
    };
    const endpoint = commentId
      ? `/vote/vote/topics/${topicId}/comments/${commentId}`
      : `/vote/vote/topics/${topicId}/comments`;

    setError(null); // Reset error state before submitting
    try {
      const response = await axiosInstance.post(endpoint, requestBody);
      console.log("Response:", response.data);
      fetchComments(); // Update UI
      if (!commentId) setNewComment(""); // Clear new comment input if submitting a new comment
    } catch (error) {
      console.error(
        "Error posting comment or reply:",
        error.response?.data || error
      );
      setError("Failed to submit your comment. Please try again."); // Set error message
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
      {error && <Typography color="error">{error}</Typography>}{" "}
      {/* Display error message */}
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
        disabled={!newComment.trim()} // Disable if the comment is empty
      >
        Submit
      </Button>
      <Box mt={2}>
        {loading ? (
          <CircularProgress />
        ) : (
          comments.map((comment) => (
            <Box key={comment._id} mb={3} borderBottom="1px solid #ddd" pb={2}>
              <Typography variant="body1">{comment.text}</Typography>
              <Box display="flex" alignItems="center" mt={1}>
                <Button onClick={() => handleVote(comment._id, "like")}>
                  <FaThumbsUp /> {comment.reactions?.likeCount || 0}
                </Button>
                <Button onClick={() => handleVote(comment._id, "dislike")}>
                  <FaThumbsDown /> {comment.reactions?.dislikeCount || 0}
                </Button>
                <IconButton onClick={() => toggleReplies(comment._id)}>
                  {expandedReplies[comment._id] ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  )}
                </IconButton>
                <IconButton onClick={() => toggleReplyInput(comment._id)}>
                  <FaReply />
                </IconButton>
              </Box>

              {expandedReplies[comment._id] && (
                <Box
                  ml={4}
                  mt={1}
                  maxHeight="200px"
                  overflow="auto"
                  borderLeft="2px solid #eee"
                  pl={2}
                >
                  {comment.replies?.map((reply) => (
                    <Box key={reply._id} mb={2}>
                      <Typography variant="body2">{reply.text}</Typography>
                      <Box display="flex" alignItems="center">
                        <Button onClick={() => handleVote(reply._id, "like")}>
                          <FaThumbsUp /> {reply.reactions?.likeCount || 0}
                        </Button>
                        <Button
                          onClick={() => handleVote(reply._id, "dislike")}
                        >
                          <FaThumbsDown /> {reply.reactions?.dislikeCount || 0}
                        </Button>
                      </Box>
                    </Box>
                  ))}
                  {replyInputVisible[comment._id] && (
                    <Box>
                      <TextField
                        variant="outlined"
                        fullWidth
                        placeholder="Add a reply..."
                        value={replies[comment._id] || ""} // Ensure controlled input
                        onChange={(e) =>
                          handleReplyChange(comment._id, e.target.value)
                        }
                        multiline
                        rows={2}
                      />
                      <Button
                        onClick={() => handleCommentSubmit(comment._id)}
                        variant="contained"
                        sx={{ mt: 1 }}
                        disabled={!replies[comment._id]?.trim()} // Disable if reply is empty
                      >
                        Submit Reply
                      </Button>
                    </Box>
                  )}
                  <Button onClick={() => toggleReplyInput(comment._id)}>
                    {replyInputVisible[comment._id] ? "Cancel" : "Reply"}
                  </Button>
                </Box>
              )}
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

export default CommentSection;