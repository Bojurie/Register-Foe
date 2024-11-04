import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import { Box, TextField, Button, Typography } from "@mui/material";
import Comment from "./Comment";
import "./CommentSection.css";
import axiosInstance from "../axiosInstance";

const CommentSection = ({ topicId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axiosInstance.get(
          `/vote/vote/topics/${topicId}/comments`
        );
        setComments(response.data.comments);
      } catch (error) {
        setError("Failed to fetch comments.");
      }
    };

    fetchComments();
  }, [topicId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText) return;

    try {
      const response = await axiosInstance.post(
        `/vote/vote/topics/${topicId}/comments`,
        {
          text: commentText,
          userId: user._id,
        }
      );
      setComments((prev) => [...prev, response.data.comment]);
      setCommentText("");
    } catch (error) {
      setError("Failed to add comment.");
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Comments
      </Typography>
      {error && <Typography color="error">{error}</Typography>}

      <form onSubmit={handleCommentSubmit}>
        <TextField
          label="Add a comment"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ marginTop: 10 }}
        >
          Submit
        </Button>
      </form>

      {comments.length === 0 ? (
        <Typography>No comments yet.</Typography>
      ) : (
        comments.map((comment) => (
          <Comment key={comment._id} comment={comment} />
        ))
      )}
    </Box>
  );
};

export default CommentSection;
