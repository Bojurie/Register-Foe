import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { FaThumbsUp, FaThumbsDown, FaReply } from "react-icons/fa";
import { useAuth } from "../../AuthContext/AuthContext";
import axiosInstance from "../../axiosInstance";
import "./CommentSection.css";

const CommentSection = ({ topicId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axiosInstance.get(`/topics/${topicId}/comments`);
        setComments(response.data.comments);
      } catch (error) {
        enqueueSnackbar("Failed to load comments.", { variant: "error" });
      }
    };

    fetchComments();
  }, [topicId, enqueueSnackbar]);

const handleAddComment = async () => {
  if (!newComment.trim()) return; // Ensure there's text in the comment
  try {
    const response = await axiosInstance.post(
      `/vote/topics/${topicId}/comments`,
      {
        userId: user._id,
        text: newComment.trim(), // Ensure the comment text is properly formatted
      }
    );
    setComments((prev) => [...prev, response.data.comment]);
    setNewComment(""); // Clear the input after posting
    enqueueSnackbar("Comment added!", { variant: "success" });
  } catch (error) {
    enqueueSnackbar("Failed to add comment.", { variant: "error" });
  }
};


  const handleReply = async (commentId, replyText) => {
    if (!replyText.trim()) return;
    try {
      const response = await axiosInstance.post(
        `/topics/${topicId}/comments/${commentId}/reply`,
        {
          userId: user._id,
          text: replyText,
        }
      );
      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId
            ? { ...comment, replies: [...comment.replies, response.data.reply] }
            : comment
        )
      );
      enqueueSnackbar("Reply added!", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Failed to add reply.", { variant: "error" });
    }
  };

  const handleVote = async (commentId, action) => {
    try {
      const response = await axiosInstance.post(
        `/vote/topics/${topicId}/comments/${commentId}/${action}`,
        {
          userId: user._id,
        }
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
    <div className="CommentSection">
      <h4>Comments</h4>
      <div className="AddComment">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          rows="3"
        />
        <button onClick={handleAddComment}>Add Comment</button>
      </div>
      {comments.map((comment) => (
        <div key={comment._id} className="Comment">
          <p>{comment.text}</p>
          <div className="Comment-actions">
            <FaThumbsUp onClick={() => handleVote(comment._id, "like")} />
            <FaThumbsDown onClick={() => handleVote(comment._id, "dislike")} />
            <FaReply
              onClick={() => handleReply(comment._id, prompt("Enter reply:"))}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentSection;
