import React, { useState, useEffect } from "react";
import { FaThumbsUp, FaThumbsDown, FaReply } from "react-icons/fa";
import { useAuth } from "../../AuthContext/AuthContext";
import axiosInstance from "../../axiosInstance";
import { Box, Typography, TextField, IconButton, Alert } from "@mui/material";
import { styled } from "@mui/system";
import { Button } from "../../StyledComponents";

const CommentsContainer = styled(Box)({
  margin: "10px 0px",
  maxHeight: "300px",
  overflowY: "auto",
  padding: "16px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  backgroundColor: "#f9f9f9",
});

const CommentBox = styled(Box)({
  padding: "12px",
  marginBottom: "12px",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
  display: "flex",
  flexDirection: "column",
});

const UserImage = styled("img")({
  width: "30px",
  height: "30px",
  borderRadius: "50%",
  marginRight: "8px",
});

const CommentSection = ({ topicId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [message, setMessage] = useState(null);
  const [replyText, setReplyText] = useState({});

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axiosInstance.get(
          `/vote/vote/topics/${topicId}/comments`
        );
        setComments(response.data.comments || []);
        setMessage({ type: "success", text: "Comments loaded successfully!" });
      } catch {
        setMessage({ type: "error", text: "Failed to load comments." });
        setComments([]); // Initialize to an empty array on error
      }
    };
    fetchComments();
  }, [topicId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const response = await axiosInstance.post(
        `/vote/vote/topics/${topicId}/comments`,
        { text: newComment.trim() }
      );
      setComments((prev) => [...prev, response.data.comment]);
      setNewComment("");
      setMessage({ type: "success", text: "Comment added successfully!" });
    } catch (error) {
      console.error(
        "Error adding comment:",
        error.response?.data || error.message
      );
      setMessage({ type: "error", text: "Failed to add comment." });
    }
  };

  const handleReplySubmit = async (commentId) => {
    const text = replyText[commentId]?.trim();
    if (!text) return;
    try {
      const response = await axiosInstance.post(
        `/vote/topics/${topicId}/comments/${commentId}`,
        { text }
      );
      updateComments(response.data.updatedComment);
      setReplyText((prev) => ({ ...prev, [commentId]: "" }));
      setMessage({ type: "success", text: "Reply added successfully!" });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to add reply." });
    }
  };

  const updateComments = (updatedComment) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment?._id === updatedComment._id ? updatedComment : comment
      )
    );
  };

  const handleReaction = async (commentId, type, isReply = false) => {
    try {
      const endpoint = `/vote/vote/topics/${topicId}/comments/${commentId}/${type}`;
      const response = await axiosInstance.post(endpoint);

      if (isReply) {
        const parentComment = comments.find(
          (comment) =>
            comment.replies &&
            comment.replies.some((reply) => reply._id === commentId)
        );

        if (parentComment) {
          const updatedReplies = parentComment.replies.map((reply) => {
            return reply._id === commentId ? response.data.updatedReply : reply;
          });
          updateComments({ ...parentComment, replies: updatedReplies });
        } else {
          console.error("Parent comment not found for reply ID:", commentId);
        }
      } else {
        updateComments(response.data.updatedComment);
      }
    } catch (error) {
      setMessage({ type: "error", text: `Failed to ${type} comment.` });
      console.error("Reaction error:", error);
    }
  };

  return (
    <div className="CommentSection">
      <Typography variant="h6" gutterBottom>
        Comments ({comments.length})
      </Typography>

      {message && <Alert severity={message.type}>{message.text}</Alert>}

      <Box className="AddComment" mb={2}>
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
          <CommentBox key={comment?._id}>
            <Box display="flex" alignItems="center">
              <UserImage
                src={comment.user?.profilePicture || "/default-avatar.png"}
                alt="User"
              />
              <Typography variant="body2" fontWeight="bold">
                {comment.user?.name}
              </Typography>
            </Box>
            <Typography>{comment.text}</Typography>
            <Box className="Comment-actions" display="flex" alignItems="center">
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
              <Box className="ReplySection" mt={2}>
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
              <CommentBox key={reply?._id} style={{ marginLeft: "30px" }}>
                <Box display="flex" alignItems="center">
                  <UserImage
                    src={reply.user?.profilePicture || "/default-avatar.png"}
                    alt="User"
                  />
                  <Typography variant="body2" fontWeight="bold">
                    {reply.user?.name}
                  </Typography>
                </Box>
                <Typography>{reply.text}</Typography>
                <Box
                  className="Comment-actions"
                  display="flex"
                  alignItems="center"
                >
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
              </CommentBox>
            ))}
          </CommentBox>
        ))}
      </CommentsContainer>
    </div>
  );
};


export default CommentSection;
