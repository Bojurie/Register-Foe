import React, { useState, useEffect } from "react";
import axiosInstance from "../../axiosInstance";
import { Box, TextField, Button, Typography } from "@mui/material";
import Comment from "./Comment"; // This component will handle displaying a single comment

const CommentSection = ({ topicId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axiosInstance.get(
          `/vote/vote/topics/${topicId}/comments`
        );
        setComments(response.data.comments);
      } catch (error) {
        console.error("Failed to fetch comments:", error.message);
      }
    };

    fetchComments();
  }, [topicId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment) return;

    try {
      const response = await axiosInstance.post(
        `/vote/vote/topics/${topicId}/comments`,
        { text: newComment }
      );
      setComments((prevComments) => [...prevComments, response.data.comment]);
      setNewComment("");
    } catch (error) {
      console.error("Failed to post comment:", error.message);
    }
  };

  return (
    <Box>
      <form onSubmit={handleCommentSubmit}>
        <TextField
          label="Add a comment"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
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

      <Box mt={3}>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <Comment key={comment._id} comment={comment} />
          ))
        ) : (
          <Typography>No comments yet.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default CommentSection;
