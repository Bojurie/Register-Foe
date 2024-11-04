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
  const [replies, setReplies] = useState({}); // To store replies for each comment
  const [replyText, setReplyText] = useState({}); // Text input for each reply

  // Fetch comments and replies from the server
  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/vote/vote/topics/${topicId}/comments`
      );
      setComments(response.data.comments || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  // Submit a new comment or reply
  const handleCommentSubmit = async (commentId = null, action = null) => {
    const endpoint = commentId
      ? `/vote/vote/topics/${topicId}/comments/${commentId}`
      : `/vote/vote/topics/${topicId}/comments`;

    const text =
      action === null
        ? commentId
          ? replyText[commentId]
          : newComment
        : undefined;

    if (action === null && !text) return; // Prevent empty submissions

    const requestBody = { text, action: action || undefined };

    try {
      await axiosInstance.post(endpoint, requestBody);

      if (commentId) {
        setReplyText((prev) => ({ ...prev, [commentId]: "" })); // Clear reply input
      } else {
        setNewComment(""); // Clear new comment input
      }

      fetchComments(); // Refresh comments after submission
    } catch (error) {
      console.error("Error posting comment or reply:", error);
    }
  };

  // Handle likes/dislikes
  const handleVote = (commentId, replyId, voteType) => {
    const action = voteType === "like" ? "like" : "dislike";
    handleCommentSubmit(replyId || commentId, action); // Pass replyId if voting on a reply
  };

  useEffect(() => {
    fetchComments();
  }, [topicId]);

  return (
    <Box>
      {/* New Comment Input */}
      <TextField
        variant="outlined"
        fullWidth
        placeholder="Add a comment..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        multiline
        rows={3}
      />
      <Button onClick={() => handleCommentSubmit()} variant="contained">
        Submit
      </Button>

      <Box mt={3}>
        {loading ? (
          <CircularProgress />
        ) : (
          comments.map((comment) => (
            <Box
              key={comment._id}
              mb={2}
              pl={1}
              sx={{ borderLeft: "2px solid #ddd", paddingLeft: "8px" }}
            >
              <Typography variant="body1">{comment.text}</Typography>
              <Box>
                {/* Like/Dislike for Comment */}
                <Button onClick={() => handleVote(comment._id, null, "like")}>
                  <FaThumbsUp /> {comment.reactions?.likeCount || 0}
                </Button>
                <Button
                  onClick={() => handleVote(comment._id, null, "dislike")}
                >
                  <FaThumbsDown /> {comment.reactions?.dislikeCount || 0}
                </Button>
              </Box>

              {/* Reply Input for Parent Comment */}
              <TextField
                variant="outlined"
                fullWidth
                placeholder="Reply..."
                value={replyText[comment._id] || ""}
                onChange={(e) =>
                  setReplyText((prev) => ({
                    ...prev,
                    [comment._id]: e.target.value,
                  }))
                }
                multiline
                rows={2}
                sx={{ mt: 1 }}
              />
              <Button
                onClick={() => handleCommentSubmit(comment._id)}
                variant="contained"
                sx={{ mt: 1 }}
              >
                Reply
              </Button>

              {/* Render Replies */}
              {comment.replies && (
                <Box
                  mt={2}
                  pl={3}
                  sx={{ borderLeft: "1px solid #ccc", paddingLeft: "8px" }}
                >
                  {comment.replies.map((reply) => (
                    <Box key={reply._id} mb={1}>
                      <Typography variant="body2">{reply.text}</Typography>
                      <Box>
                        {/* Like/Dislike for Reply */}
                        <Button
                          onClick={() =>
                            handleVote(comment._id, reply._id, "like")
                          }
                        >
                          <FaThumbsUp /> {reply.reactions?.likeCount || 0}
                        </Button>
                        <Button
                          onClick={() =>
                            handleVote(comment._id, reply._id, "dislike")
                          }
                        >
                          <FaThumbsDown /> {reply.reactions?.dislikeCount || 0}
                        </Button>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

export default CommentSection;
