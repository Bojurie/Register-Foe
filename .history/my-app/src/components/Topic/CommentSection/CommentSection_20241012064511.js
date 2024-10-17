import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { FaThumbsUp, FaThumbsDown, FaReply } from "react-icons/fa";
import { useAuth } from "../../AuthContext/AuthContext";
import axiosInstance from "../../axiosInstance";
import { Box, Typography, TextField, Button, IconButton } from "@mui/material";


const CommentsContainer = styled(Box)({
  maxHeight: '300px',
  overflowY: 'auto',
  padding: '16px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  backgroundColor: '#f9f9f9',
});

// Styled individual comment
const CommentBox = styled(Box)({
  padding: '12px',
  marginBottom: '12px',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});


const CommentSection = ({ topicId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axiosInstance.get(
          `/vote/topics/${topicId}/comments/comment`
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
        text: newComment.trim(),
      });

      const response = await axiosInstance.post(
        `/vote/topics/${topicId}/comments/comment`,
        {
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

      <CommentsContainer>
        {comments.map((comment) => (
          <CommentBox key={comment._id}>
            <Typography>{comment.text}</Typography>
            <Box className="Comment-actions">
              <IconButton onClick={() => alert("Like functionality")}>
                <FaThumbsUp />
              </IconButton>
              <IconButton onClick={() => alert("Dislike functionality")}>
                <FaThumbsDown />
              </IconButton>
              <IconButton onClick={() => alert("Reply functionality")}>
                <FaReply />
              </IconButton>
            </Box>
          </CommentBox>
        ))}
      </CommentsContainer>
    </div>
  );
};


export default CommentSection;
