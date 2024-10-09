// Updated Topic Component
import React, { useState } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import Modal from "../Modal";
import TopicDisplay from "../TopicDisplay/TopicDisplay";
import "./Topic.css";

const Topic = ({ topic }) => {
  const { user, updateTopicVote } = useAuth();
  const [likesCount, setLikesCount] = useState(topic.likeCount || 0);
  const [dislikesCount, setDislikesCount] = useState(topic.dislikeCount || 0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleVote = async (action) => {
    try {
      await updateTopicVote(user._id, topic._id, action);
      setLikesCount((prev) => (action === "like" ? prev + 1 : prev));
      setDislikesCount((prev) => (action === "dislike" ? prev + 1 : prev));
    } catch (error) {
      console.error("Error updating topic vote:", error);
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
        />
      </Modal>
    </>
  );
};

export default Topic;
