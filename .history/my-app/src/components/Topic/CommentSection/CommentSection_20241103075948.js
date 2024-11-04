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
  const [reply, setReply] = useState({}); // To track replies for each comment

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/vote/topics/${topicId}/comments`
      );
      setComments(response.data.comments); // Adjust based on your API response structure
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
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

  const handleReplyChange = (commentId, value) => {
    setReply((prev) => ({ ...prev, [commentId]: value })); // Store the reply for the specific comment
  };

  const handleReplySubmit = async (commentId) => {
    if (!reply[commentId]) return; // Check if there is a reply text
    try {
      await axiosInstance.post(`/comments/${commentId}/replies`, {
        text: reply[commentId],
      });
      setReply((prev) => ({ ...prev, [commentId]: "" })); // Clear the reply input after submission
      fetchComments(); // Refresh comments to show new reply
    } catch (error) {
      console.error("Error posting reply:", error);
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
          <CircularProgress />
        ) : (
          comments.map((comment) => (
            <Box key={comment._id} mb={2}>
              <Typography variant="body1">{comment.text}</Typography>
              <div>
                <Button onClick={() => handleVote(comment._id, "like")}>
                  <FaThumbsUp /> {comment.likesCount}
                </Button>
                <Button onClick={() => handleVote(comment._id, "dislike")}>
                  <FaThumbsDown /> {comment.dislikesCount}
                </Button>
              </div>

              {/* Reply Input */}
              <TextField
                variant="outlined"
                fullWidth
                placeholder="Reply..."
                value={reply[comment._id] || ""}
                onChange={(e) => handleReplyChange(comment._id, e.target.value)}
                multiline
                rows={2}
                sx={{ mt: 2 }} // Add some margin top
              />
              <Button
                onClick={() => handleReplySubmit(comment._id)}
                variant="contained"
                sx={{ mt: 1 }}
              >
                Reply
              </Button>

              {/* Display Replies */}
              <Box mt={1} pl={2}>
                {comment.replies &&
                  comment.replies.length > 0 &&
                  comment.replies.map((reply) => (
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
