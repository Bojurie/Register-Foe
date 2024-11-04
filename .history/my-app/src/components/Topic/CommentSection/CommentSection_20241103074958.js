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
  const [loading, setLoading] = useState(true); // Initialize loading state

  const fetchComments = async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const response = await axiosInstance.get(
        `/vote/vote/topics/${topicId}/comments`
      );
      setComments(response.data.comments); // Adjust based on your API response structure
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment) return;
    try {
      await axiosInstance.post(`/comments/${topicId}`, { text: newComment });
      setNewComment("");
      fetchComments();
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleVote = async (commentId, action) => {
    try {
      await axiosInstance.post(`/comments/${commentId}/vote`, { action });
      fetchComments(); // Refresh comments after voting
    } catch (error) {
      console.error("Error voting on comment:", error);
    }
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
        rows={4}
      />
      <Button onClick={handleCommentSubmit} variant="contained">
        Submit
      </Button>

      <Box mt={2}>
        {loading ? (
          <CircularProgress /> // Show loading indicator while fetching
        ) : (
          comments.map((comment) => (
            <Box key={comment._id} mb={2}>
              <Typography variant="body1">{comment.text}</Typography>
              <div>
                <Button onClick={() => handleVote(comment._id, "like")}>
                  <FaThumbsUp /> {comment.likesCount}{" "}
                  {/* Adjusted to match your API structure */}
                </Button>
                <Button onClick={() => handleVote(comment._id, "dislike")}>
                  <FaThumbsDown /> {comment.dislikesCount}{" "}
                  {/* Adjusted to match your API structure */}
                </Button>
              </div>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

export default CommentSection;
