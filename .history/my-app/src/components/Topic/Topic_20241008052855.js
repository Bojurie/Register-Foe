import React, { useState } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import Modal from "../Modal";
import TopicDisplay from "../TopicDisplay/TopicDisplay";
import "./Topic.css";

const Topic = ({ topic }) => {
  const { user, updateTopicVote, deleteTopic, addCommentToTopic } = useAuth();
  const [likesCount, setLikesCount] = useState(topic.likeCount || 0);
  const [dislikesCount, setDislikesCount] = useState(topic.dislikeCount || 0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comments, setComments] = useState(topic.comments || []);
  const [newComment, setNewComment] = useState("");

  const handleVote = async (action) => {
    try {
      await updateTopicVote(user._id, topic._id, action);
      if (action === "like") {
        setLikesCount((prev) => prev + 1);
      } else if (action === "dislike") {
        setDislikesCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error updating topic vote:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTopic(topic._id);
      console.log("Topic deleted successfully.");
    } catch (error) {
      console.error("Error deleting topic:", error);
    }
  };

const handleAddComment = async () => {
  if (newComment.trim() === "") {
    return; 
  }
  try {
    const addedComment = await addCommentToTopic(
      user._id,
      topic._id,
      newComment
    );
    setComments((prevComments) => [...prevComments, addedComment]);

    setNewComment("");
  } catch (error) {
    console.error("Error adding comment:", error);
  }
};


  const toggleModal = () => setIsModalOpen((prev) => !prev);

  return (
    <>
      <div className="Topic" onClick={toggleModal}>
        <h3>{topic.title}</h3>
        <p>
          {new Date(topic.dateStart).toLocaleDateString()} -{" "}
          {new Date(topic.dateEnd).toLocaleDateString()}
        </p>
      </div>

      <Modal isOpen={isModalOpen} onClose={toggleModal}>
        <TopicDisplay
          topic={topic}
          likesCount={likesCount}
          dislikesCount={dislikesCount}
          onLike={() => handleVote("like")}
          onDislike={() => handleVote("dislike")}
          onDelete={handleDelete}
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
