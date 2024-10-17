import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { FaThumbsUp, FaThumbsDown, FaReply } from "react-icons/fa";
import { useAuth } from "../../AuthContext/AuthContext";
import axiosInstance from "../../axiosInstance";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Paper,
} from "@mui/material";
import { styled } from "@mui/system";

const CommentBox = styled(Box)({
  padding: "16px",
  marginBottom: "16px",
  backgroundColor: "#f0f0f0",
  borderRadius: "8px",
  "@media (max-width: 600px)": {
    padding: "12px",
  },
});

const CommentSection = ({ topicId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axiosInstance.get(
          `/vote/topics/${topicId}/comments`
        );
        setComments(response.data.comments);
      } catch (error) {
        enqueueSnackbar("Failed to load comments.", { variant: "error" });
      }
    };

    fetchComments();
  }, [topicId, enqueueSnackbar]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const response = await axiosInstance.post(
        `/vote/topics/${topicId}/comments`,
        {
          userId: user._id,
          text: newComment.trim(),
        }
      );
      setComments((prev) => [...prev, response.data.comment]);
      setNewComment("");
      enqueueSnackbar("Comment added!", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Failed to add comment.", { variant: "error" });
    }
  };

  const handleVote = async (commentId, action) => {
    try {
      const response = await axiosInstance.post(
        `/vote/topics/${topicId}/comments/${commentId}/${action}`,
        { userId: user._id }
      );
      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId
            ? { ...comment, ...response.data.comment }
            : comment
        )
      );
      enqueueSnackbar(`Comment ${action}d!`, { variant: "success" });
    } catch (error) {
      enqueueSnackbar(`Failed to ${action} comment.`, { variant: "error" });
    }
  };

  return (
    <Box>
      <Typography variant="h6">Comments</Typography>
      <Box display="flex" flexDirection="column" mt={2}>
        <TextField
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          multiline
          rows={3}
          variant="outlined"
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddComment}
          sx={{ mt: 2 }}
        >
          Add Comment
        </Button>
      </Box>

      {comments.map((comment) => (
        <CommentBox key={comment._id}>
          <Typography>{comment.text}</Typography>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={2}
          >
            <IconButton onClick={() => handleVote(comment._id, "like")}>
              <FaThumbsUp />
            </IconButton>
            <IconButton onClick={() => handleVote(comment._id, "dislike")}>
              <FaThumbsDown />
            </IconButton>
            <IconButton onClick={() => alert("Reply functionality")}>
              <FaReply />
            </IconButton>
          </Box>
        </CommentBox>
      ))}
    </Box>
  );
};

export default CommentSection;
