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

  useEffect(() => {
    fetchComments();
  }, [topicId]);

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

const handleVote = (commentId, reaction) => {
  if (!["like", "dislike"].includes(reaction)) {
    console.error("Invalid reaction. Use 'like' or 'dislike'.");
    return; // Prevents execution if the reaction is invalid
  }
  handleCommentSubmit(commentId, reaction); // Only calls if the reaction is valid
};


const handleCommentSubmit = async (commentId = null, action = null) => {
  // Determine the endpoint based on whether a comment ID is provided
  const endpoint = commentId
    ? `/vote/vote/topics/${topicId}/comments/${commentId}`
    : `/vote/vote/topics/${topicId}/comments`;

  // Construct the request body with action, which is required if commentId is provided
  const requestBody = { action };

  // Validate that action is provided when commentId is given
  if (commentId && !action) {
    console.error("Action is required when providing a comment ID.");
    return;
  }

  try {
    const response = await axiosInstance.post(endpoint, requestBody);
    console.log("Response:", response.data);

    // Update local state based on the action performed
    if (commentId) {
      setReplies((prev) => ({ ...prev, [commentId]: "" }));
      setReplyInputVisible((prev) => ({ ...prev, [commentId]: false }));
    } else {
      setNewComment("");
    }

    fetchComments(); // Re-fetch comments to update the UI
  } catch (error) {
    console.error("Error posting comment or reply:", error);
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
                      <Box display="flex" alignItems="center" mt={0.5}>
                        <Button onClick={() => handleVote(reply._id, "like")}>
                          <FaThumbsUp /> {reply.reactions?.likeCount || 0}
                        </Button>
                        <Button
                          onClick={() => handleVote(reply._id, "dislike")}
                        >
                          <FaThumbsDown /> {reply.reactions?.dislikeCount || 0}
                        </Button>
                        <IconButton
                          onClick={() => toggleReplyInput(comment._id)}
                        >
                          <FaReply />
                        </IconButton>
                      </Box>
                    </Box>
                  ))}

                  {replyInputVisible[comment._id] && (
                    <Box mt={1}>
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
              )}
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

export default CommentSection;
