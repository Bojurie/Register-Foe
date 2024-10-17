import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { FaThumbsUp, FaThumbsDown, FaReply } from "react-icons/fa";
import { useAuth } from "../../AuthContext/AuthContext";
import axiosInstance from "../../axiosInstance";
import { Box, Typography, TextField, Button, IconButton } from "@mui/material";
import "./CommentSection.css";

const CommentSection = ({ topicId, handleVote }) => {
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
    console.log("Submitting comment:", {
      userId: user._id,
      text: newComment.trim(),
    });

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
    console.error(
      "Error adding comment:",
      error.response?.data || error.message
    );
    enqueueSnackbar("Failed to add comment.", { variant: "error" });
  }
};



  return (
    <div className="CommentSection">
      <Typography variant="h6" gutterBottom>
        Comments
      </Typography>
      <Box className="AddComment">
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
        <Box key={comment._id} className="Comment">
          <Typography>{comment.text}</Typography>
          <Box className="Comment-actions">
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
        </Box>
      ))}
    </div>
  );
};

export default CommentSection;
