import React, { useState, useEffect } from "react";
import axiosInstance from "../../axiosInstance";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
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

  // Handle submission of a new comment or reply
  const handleCommentSubmit = async (commentId = null, action = null) => {
    const endpoint = commentId
      ? `/vote/vote/topics/${topicId}/comments/${commentId}`
      : `/vote/vote/topics/${topicId}/comments`;

    const requestBody = {
      text:
        action === null
          ? commentId
            ? replies[commentId]
            : newComment
          : undefined,
      action: action || undefined,
    };

    if (action === null && !requestBody.text) return;

    try {
      await axiosInstance.post(endpoint, requestBody);
      if (commentId) {
        setReplies((prev) => ({ ...prev, [commentId]: "" }));
      } else {
        setNewComment("");
      }
      fetchComments(); // Refresh comments after submission
    } catch (error) {
      console.error("Error posting comment or reply:", error);
    }
  };

  // Handle voting (liking/disliking)
  const handleVote = (commentId, voteType) => {
    const action = voteType === "like" ? "like" : "dislike";
    handleCommentSubmit(commentId, action);
  };

  // Toggle expanded/collapsed state for replies
  const toggleReplies = (commentId) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  // Handle reply input change
  const handleReplyChange = (commentId, value) => {
    setReplies((prev) => ({ ...prev, [commentId]: value }));
  };

  useEffect(() => {
    fetchComments();
  }, [topicId]);

  return (
    <Box>
      {/* New Comment Input */}
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
            <Box key={comment._id} mb={3} borderBottom="1px solid #ddd" pb={2}>
              {/* Parent Comment */}
              <Typography variant="body1">{comment.text}</Typography>
              <Box display="flex" alignItems="center" mt={1}>
                <Button onClick={() => handleVote(comment._id, "like")}>
                  <FaThumbsUp /> {comment.reactions?.likeCount || 0}
                </Button>
                <Button onClick={() => handleVote(comment._id, "dislike")}>
                  <FaThumbsDown /> {comment.reactions?.dislikeCount || 0}
                </Button>

                {/* Toggle Replies */}
                <IconButton onClick={() => toggleReplies(comment._id)}>
                  {expandedReplies[comment._id] ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  )}
                </IconButton>
              </Box>

              {/* Collapsible Replies Section */}
              {expandedReplies[comment._id] && (
                <Box
                  ml={4}
                  mt={1}
                  maxHeight="200px"
                  overflow="auto"
                  borderLeft="2px solid #eee"
                  pl={2}
                >
                  {/* Replies */}
                  {comment.replies?.map((reply) => (
                    <Box key={reply._id} mb={2}>
                      <Typography variant="body2">{reply.text}</Typography>
                      <Box display="flex" alignItems="center" mt={0.5}>
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

                  {/* Reply Input for Each Comment */}
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
