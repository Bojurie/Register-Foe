import React, { useState, useEffect } from "react";
import axiosInstance from "../../axiosInstance";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";

const CommentSection = ({ topicId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [replies, setReplies] = useState({}); // Store replies for each comment

  // Fetch comments from the server
  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/vote/vote/topics/${topicId}/comments`
      );
      setComments(response.data.comments); // Adjust based on your API response structure
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  // Submit a comment or reply
  const handleCommentSubmit = async (commentId = null, action = null) => {
    const endpoint = commentId
      ? `/vote/vote/topics/${topicId}/comments/${commentId}`
      : `/vote/vote/topics/${topicId}/comments`;

    const requestBody = {
      text: action ? undefined : commentId ? replies[commentId] : newComment,
      action: action || undefined,
    };

    if (action === null && !requestBody.text) return; // Ensure there's text or action to submit

    console.log("Submitting comment:", {
      endpoint,
      text: requestBody.text,
      action,
    });

    try {
      await axiosInstance.post(endpoint, requestBody);

      // Reset state based on the context
      if (commentId) {
        setReplies((prev) => ({ ...prev, [commentId]: "" })); // Clear the reply input
      } else {
        setNewComment(""); // Clear the new comment input
      }

      fetchComments(); // Refresh comments after submission
    } catch (error) {
      console.error("Error posting comment or reply:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
      }
    }
  };

  // Handle voting (liking/disliking)
  const handleVote = (commentId, voteType) => {
    const action = voteType === "like" ? "like" : "dislike";
    handleCommentSubmit(commentId, action); // Pass action when voting
  };

  // Update reply state
  const handleReplyChange = (commentId, value) => {
    setReplies((prev) => ({ ...prev, [commentId]: value })); // Store the reply for the specific comment
  };

  useEffect(() => {
    fetchComments(); // Fetch comments on component mount
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
        rows={4}
      />
      <Button onClick={() => handleCommentSubmit()} variant="contained">
        Submit
      </Button>

      <Box mt={2}>
        {loading ? (
          <CircularProgress />
        ) : (
          comments.map((comment) => (
            <Box key={comment._id} mb={2}>
              <Typography variant="body1">{comment.text}</Typography>
              <div>
                <Button onClick={() => handleVote(comment._id, "like")}>
                  <FaThumbsUp /> {comment.reactions?.likeCount || 0}
                </Button>
                <Button onClick={() => handleVote(comment._id, "dislike")}>
                  <FaThumbsDown /> {comment.reactions?.dislikeCount || 0}
                </Button>
              </div>

              {/* Reply Input */}
              <TextField
                variant="outlined"
                fullWidth
                placeholder="Reply..."
                value={replies[comment._id] || ""}
                onChange={(e) => handleReplyChange(comment._id, e.target.value)}
                multiline
                rows={2}
                sx={{ mt: 2 }} // Add some margin top
              />
              <Button
                onClick={() => handleCommentSubmit(comment._id)} // No action specified for replies
                variant="contained"
                sx={{ mt: 1 }}
              >
                Reply
              </Button>

              {/* Display Replies */}
              <Box mt={1} pl={2}>
                {comment.replies?.map((reply) => (
                  <Box key={reply._id} mb={1}>
                    <Typography variant="body2" color="text.secondary">
                      {reply.text}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

export default CommentSection;