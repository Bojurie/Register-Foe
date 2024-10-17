import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { FaThumbsUp, FaThumbsDown, FaReply } from "react-icons/fa";
import "./CommentSection.css";
import { useAuth } from "../../AuthContext/AuthContext";
import axiosInstance from "../../axiosInstance";




const CommentSection = ({ topicId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axiosInstance.get(`/vote/topics/${topicId}/comments`);
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
      const response = await axiosInstance.post(`/vote/topics/${topicId}/comments`, {
        userId: user._id,
        text: newComment,
      });
      setComments((prev) => [...prev, response.data.comment]);
      setNewComment("");
      enqueueSnackbar("Comment added!", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Failed to add comment.", { variant: "error" });
    }
  };

  const handleReply = (commentId, replyText) => {
    // Reply handling logic here
  };

  const handleVote = (commentId, action) => {
    // Like or dislike comment handling logic here
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
            <FaReply onClick={() => handleReply(comment._id)} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentSection;
