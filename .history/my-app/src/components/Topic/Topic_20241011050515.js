import React, { useState, useCallback } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import Modal from "../Modal";
import TopicDisplay from "../TopicDisplay/TopicDisplay";
import { FaComment, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { useSnackbar } from "notistack"; 
import "./Topic.css";

const Topic = ({ topic }) => {
  const { user, updateTopicVote, deleteTopic, addCommentToTopic } = useAuth();
  const [likesCount, setLikesCount] = useState(topic.likeCount || 0);
  const [dislikesCount, setDislikesCount] = useState(topic.dislikeCount || 0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comments, setComments] = useState(topic.comments || []);
  const [newComment, setNewComment] = useState("");
  const { enqueueSnackbar } = useSnackbar(); 

  const handleVote = useCallback(
    async (action) => {
      try {
        const optimisticCount = action === "like" ? likesCount + 1 : dislikesCount + 1;
        // Optimistically update UI
        if (action === "like") setLikesCount(optimisticCount);
        else setDislikesCount(optimisticCount);

        const result = await updateTopicVote(user._id, topic._id, action);
        if (action === "like") {
          setLikesCount(result.likesCount); // Correct count after backend response
          enqueueSnackbar('Successfully liked the topic!', { variant: 'success' });
        } else {
          setDislikesCount(result.dislikesCount);
          enqueueSnackbar('Successfully disliked the topic!', { variant: 'success' });
        }
      } catch (error) {
        // Rollback optimistic UI update on failure
        if (action === "like") setLikesCount(likesCount - 1);
        else setDislikesCount(dislikesCount - 1);
        
        enqueueSnackbar(`Error processing ${action} vote. Please try again.`, { variant: 'error' });
      }
    },
    [user._id, topic._id, likesCount, dislikesCount, updateTopicVote, enqueueSnackbar]
  );

  // Handle adding a comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const addedComment = await addCommentToTopic(user._id, topic._id, newComment);
      setComments((prevComments) => [...prevComments, addedComment]);
      setNewComment("");
      enqueueSnackbar('Comment added successfully!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Error adding comment. Please try again.', { variant: 'error' });
    }
  };

  const toggleModal = () => setIsModalOpen((prev) => !prev);

  return (
    <>
      <div className="Topic" onClick={toggleModal}>
        <h4>{topic.title}</h4>
        <p>
          {new Date(topic.dateStart).toLocaleDateString()} -{" "}
          {new Date(topic.dateEnd).toLocaleDateString()}
        </p>
        <div className="Topic-stats">
          <div>
            <FaThumbsUp /> {likesCount}
          </div>
          <div>
            <FaThumbsDown /> {dislikesCount}
          </div>
          <div>
            <FaComment /> {comments.length}
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={toggleModal}>
        <TopicDisplay
          topic={topic}
          likesCount={likesCount}
          dislikesCount={dislikesCount}
          onLike={() => handleVote("like")}
          onDislike={() => handleVote("dislike")}
          onDelete={() => deleteTopic(topic._id)}
          comments={comments}
          isAdmin={user.role === "Admin"}
        />
        <div className="AddComment">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            rows="3"
          />
          <button onClick={handleAddComment}>Add Comment</button>
        </div>
      </Modal>
    </>
  );
};

export default Topic;
