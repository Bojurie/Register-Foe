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
        const result = await updateTopicVote(user._id, topic._id, action);
        if (action === "like") {
          setLikesCount(result.likesCount);
        } else if (action === "dislike") {
          setDislikesCount(result.dislikesCount);
        }
        enqueueSnackbar(`Successfully ${action}d the topic!`, {
          variant: "success",
        });
      } catch (error) {
        console.error(`Error processing ${action} vote:`, error);
        enqueueSnackbar(`Failed to ${action} the topic. Please try again.`, {
          variant: "error",
        });
      }
    },
    [user._id, topic._id, enqueueSnackbar]
  );

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const addedComment = await addCommentToTopic(
        user._id,
        topic._id,
        newComment
      );
      setComments((prevComments) => [...prevComments, addedComment]);
      setNewComment("");
      enqueueSnackbar("Comment added successfully!", { variant: "success" });
    } catch (error) {
      console.error("Error adding comment:", error);
      enqueueSnackbar("Failed to add comment. Please try again.", {
        variant: "error",
      });
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
