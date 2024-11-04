import React, { useState, useEffect } from "react";
import axiosInstance from "../../axiosInstance";
import {
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { FaThumbsUp, FaThumbsDown, FaReply } from "react-icons/fa";

const CommentSection = ({ topicId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyText, setReplyText] = useState({});
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axiosInstance.get(
        `/vote/vote/topics/${topicId}/comments`
      );
      setComments(response.data.comments || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const { data } = await axiosInstance.post(
        `/vote/topics/${topicId}/comments`,
        {
          text: newComment,
        }
      );
      setComments((prev) => [...prev, data.comment]);
      setNewComment("");
      setMessage({ type: "success", text: "Comment added successfully" });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to add comment." });
      console.error("Error adding comment:", error);
    }
  };

  const handleReplySubmit = async (commentId) => {
    const reply = replyText[commentId];
    if (!reply || !reply.trim()) return;

    try {
      const { data } = await axiosInstance.post(
        `/vote/topics/${topicId}/comments/${commentId}`,
        { text: reply }
      );
      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId
            ? { ...comment, replies: [...(comment.replies || []), data.reply] }
            : comment
        )
      );
      setReplyText((prev) => ({ ...prev, [commentId]: "" }));
      setMessage({ type: "success", text: "Reply added successfully." });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to add reply." });
      console.error("Error adding reply:", error);
    }
  };

const handleReaction = async (commentId, type, isReply = false) => {
  const validTypes = ["like", "dislike"]; // Valid actions for reactions

  // Validate action type
  if (!validTypes.includes(type)) {
    setMessage({
      type: "error",
      text: "Invalid action. Use 'like' or 'dislike'.",
    });
    return;
  }

  try {
    // Construct endpoint URL based on the type of reaction
    const endpoint = `/vote/topics/${topicId}/comments/${commentId}/${type}`;
    const response = await axiosInstance.post(endpoint); // Send POST request

    // Update state based on whether it's a reply or main comment
    setComments((prevComments) =>
      prevComments.map((comment) => {
        if (
          isReply &&
          comment.replies?.some((reply) => reply._id === commentId)
        ) {
          return {
            ...comment,
            replies: comment.replies.map((reply) =>
              reply._id === commentId
                ? { ...reply, reactions: response.data.reactions }
                : reply
            ),
          };
        }

        // Update main comment's reactions
        if (comment._id === commentId && !isReply) {
          return { ...comment, reactions: response.data.reactions };
        }

        return comment;
      })
    );
  } catch (error) {
    // Extract error message from the Axios error object
    const errorMessage =
      error.response?.data?.message || `Failed to ${type} comment.`;
    setMessage({ type: "error", text: errorMessage });
    console.error("Reaction error:", error);
  }
};



  return (
    <div className="CommentSection">
      <Typography variant="h6" gutterBottom>
        Comments ({comments.length})
      </Typography>
      {message && <Alert severity={message.type}>{message.text}</Alert>}

      <Box mb={2}>
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

      <Box>
        {comments.map((comment) => (
          <Box key={comment._id} mb={2} p={2} border={1} borderColor="grey.300">
            <Box display="flex" alignItems="center" mb={1}>
              <img
                src={comment.user?.profilePicture || "/default-avatar.png"}
                alt="User"
                style={{
                  width: "40px",
                  borderRadius: "50%",
                  marginRight: "8px",
                }}
              />
              <Typography variant="body2" fontWeight="bold">
                {comment.user?.name}
              </Typography>
            </Box>
            <Typography>{comment.text}</Typography>
            <Box display="flex" alignItems="center" mt={1}>
              <IconButton onClick={() => handleReaction(comment._id, "like")}>
                <FaThumbsUp /> {comment.reactions?.likeCount || 0}
              </IconButton>
              <IconButton
                onClick={() => handleReaction(comment._id, "dislike")}
              >
                <FaThumbsDown /> {comment.reactions?.dislikeCount || 0}
              </IconButton>
              <IconButton
                onClick={() =>
                  setReplyText((prev) => ({ ...prev, [comment._id]: "" }))
                }
              >
                <FaReply />
              </IconButton>
            </Box>
            {replyText[comment._id] !== undefined && (
              <Box mt={2}>
                <TextField
                  value={replyText[comment._id] || ""}
                  onChange={(e) =>
                    setReplyText((prev) => ({
                      ...prev,
                      [comment._id]: e.target.value,
                    }))
                  }
                  placeholder="Add a reply..."
                  multiline
                  rows={2}
                  variant="outlined"
                  fullWidth
                />
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleReplySubmit(comment._id)}
                  sx={{ mt: 1 }}
                >
                  Reply
                </Button>
              </Box>
            )}
            {comment.replies?.map((reply) => (
              <Box
                key={reply._id}
                ml={4}
                mt={2}
                border={1}
                borderColor="grey.300"
                p={1}
              >
                <Box display="flex" alignItems="center" mb={1}>
                  <img
                    src={reply.user?.profilePicture || "/default-avatar.png"}
                    alt="User"
                    style={{
                      width: "30px",
                      borderRadius: "50%",
                      marginRight: "8px",
                    }}
                  />
                  <Typography variant="body2" fontWeight="bold">
                    {reply.user?.name}
                  </Typography>
                </Box>
                <Typography>{reply.text}</Typography>
                <Box display="flex" alignItems="center">
                  <IconButton
                    onClick={() => handleReaction(reply._id, "like", true)}
                  >
                    <FaThumbsUp /> {reply.reactions?.likeCount || 0}
                  </IconButton>
                  <IconButton
                    onClick={() => handleReaction(reply._id, "dislike", true)}
                  >
                    <FaThumbsDown /> {reply.reactions?.dislikeCount || 0}
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </div>
  );
};

export default CommentSection;
