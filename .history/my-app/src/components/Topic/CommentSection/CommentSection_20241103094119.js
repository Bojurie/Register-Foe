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
  Collapse,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";

const CommentSection = ({ topicId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [replies, setReplies] = useState({});
  const [expandedReplies, setExpandedReplies] = useState({});

  // Fetch comments from the server
  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/vote/vote/topics/${topicId}/comments`
      );
      setComments(response.data.comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  // Submit a comment or reply
  const handleCommentSubmit = async (commentId = null, action = null) => {
    const endpoint = commentId
      ? `/vote/vote/topics/${topicId}/comments/${commentId}/${
          action || "reply"
        }`
      : `/vote/vote/topics/${topicId}/comments`;

    const text = commentId ? replies[commentId] : newComment;
    if (!text && !action) return;

    try {
      const requestBody = { text, action };
      await axiosInstance.post(endpoint, requestBody);

      if (commentId) {
        setReplies((prev) => ({ ...prev, [commentId]: "" }));
      } else {
        setNewComment("");
      }

      fetchComments();
    } catch (error) {
      console.error("Error posting comment or reply:", error);
    }
  };

  // Handle voting (liking/disliking)
  const handleVote = async (commentId, voteType) => {
    const action = voteType === "like" ? "like" : "dislike";
    try {
      await handleCommentSubmit(commentId, action);
    } catch (error) {
      console.error(`Error updating ${voteType}:`, error);
    }
  };

  // Toggle expanded replies
  const toggleReplies = (commentId) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  // Update reply state
  const handleReplyChange = (commentId, value) => {
    setReplies((prev) => ({ ...prev, [commentId]: value }));
  };

  useEffect(() => {
    fetchComments();
  }, [topicId]);

  return (
    <Box>
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
      >
        Submit
      </Button>

      <Box mt={2}>
        {loading ? (
          <CircularProgress />
        ) : (
          comments.map((comment) => (
            <Box key={comment._id} mb={2} borderBottom="1px solid #ccc" pb={2}>
              <Typography variant="body1">{comment.text}</Typography>
              <Box display="flex" alignItems="center" mt={1}>
                <Button onClick={() => handleVote(comment._id, "like")}>
                  <FaThumbsUp /> {comment.reactions.likeCount}
                </Button>
                <Button onClick={() => handleVote(comment._id, "dislike")}>
                  <FaThumbsDown /> {comment.reactions.dislikeCount}
                </Button>
                <IconButton onClick={() => toggleReplies(comment._id)}>
                  {expandedReplies[comment._id] ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  )}
                </IconButton>
                <IconButton onClick={() => handleReplyChange(comment._id, "")}>
                  <FaReply />
                </IconButton>
              </Box>

              {/* Reply Input */}
              {expandedReplies[comment._id] && (
                <Collapse
                  in={expandedReplies[comment._id]}
                  timeout="auto"
                  unmountOnExit
                >
                  <TextField
                    variant="outlined"
                    fullWidth
                    placeholder="Reply..."
                    value={replies[comment._id] || ""}
                    onChange={(e) =>
                      handleReplyChange(comment._id, e.target.value)
                    }
                    multiline
                    rows={2}
                    sx={{ mt: 1 }}
                  />
                  <Button
                    onClick={() => handleCommentSubmit(comment._id)}
                    variant="contained"
                    sx={{ mt: 1 }}
                  >
                    Reply
                  </Button>

                  {/* Display Replies */}
                  <Box mt={2} pl={2} maxHeight="200px" overflow="auto">
                    {comment.replies?.map((reply) => (
                      <Box
                        key={reply._id}
                        mb={1}
                        pb={1}
                        borderBottom="1px solid #eee"
                      >
                        <Typography variant="body2" color="text.secondary">
                          {reply.text}
                        </Typography>
                        <Box display="flex" alignItems="center" mt={1}>
                          <Button onClick={() => handleVote(reply._id, "like")}>
                            <FaThumbsUp /> {reply.reactions.likeCount}
                          </Button>
                          <Button
                            onClick={() => handleVote(reply._id, "dislike")}
                          >
                            <FaThumbsDown /> {reply.reactions.dislikeCount}
                          </Button>
                          <IconButton
                            onClick={() => handleReplyChange(reply._id, "")}
                          >
                            <FaReply />
                          </IconButton>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Collapse>
              )}
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

export default CommentSection;
