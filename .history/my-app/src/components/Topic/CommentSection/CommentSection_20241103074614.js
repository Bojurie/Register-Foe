import React, { useState, useEffect } from "react";
import axiosInstance from "../../axiosInstance";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { Box, Button, TextField, Typography } from "@mui/material";

const CommentSection = ({ topicId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
const fetchComments = async () => {
  setLoading(true);
  try {
    const response = await axiosInstance.get(
      `/vote/vote/topics/${topicId}/comments`
    );
    setComments(response.data.comments); // response.data.comments will now include replies
  } catch (error) {
    console.error("Error fetching comments:", error);
  } finally {
    setLoading(false);
  }
};

  const handleCommentSubmit = async () => {
    if (!newComment) return;
    try {
      await axiosInstance.post(`/comments/${topicId}`, { text: newComment });
      setNewComment("");
      fetchComments();
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleVote = async (commentId, action) => {
    try {
      await axiosInstance.post(`/comments/${commentId}/vote`, { action });
      fetchComments(); // Refresh comments after voting
    } catch (error) {
      console.error("Error voting on comment:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [topicId]);

 return (
   <Box>
     {loading ? (
       <Typography>Loading comments...</Typography>
     ) : (
       comments.map((comment) => (
         <Box key={comment._id} mb={2}>
           <Typography variant="body1">{comment.text}</Typography>
           <div>
             <Button onClick={() => handleVote(comment._id, "like")}>
               <FaThumbsUp /> {comment.likesCount}
             </Button>
             <Button onClick={() => handleVote(comment._id, "dislike")}>
               <FaThumbsDown /> {comment.dislikesCount}
             </Button>
           </div>
           {comment.replies && comment.replies.length > 0 && (
             <Box pl={2}>
               {" "}
               {/* Indent replies for better UI */}
               {comment.replies.map((reply) => (
                 <Box key={reply._id} mb={1}>
                   <Typography variant="body2">{reply.text}</Typography>
                   <div>
                     <Button onClick={() => handleVote(reply._id, "like")}>
                       <FaThumbsUp /> {reply.likesCount}
                     </Button>
                     <Button onClick={() => handleVote(reply._id, "dislike")}>
                       <FaThumbsDown /> {reply.dislikesCount}
                     </Button>
                   </div>
                 </Box>
               ))}
             </Box>
           )}
         </Box>
       ))
     )}
   </Box>
 );
};

export default CommentSection;
