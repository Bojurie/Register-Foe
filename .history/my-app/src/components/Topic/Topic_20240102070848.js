import React, {useState} from "react";
import TopicDisplay from "../TopicDisplay/TopicDisplay";
import Modal from '../Modal';
import './Topic.css'
const Topic = ({ topic, isAdmin }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNew, setIsNew] = useState(true); // New state to track if the topic is new
  const [likesCount, setLikesCount] = useState(topic.likesCount || 0);
  const [dislikesCount, setDislikesCount] = useState(topic.dislikesCount || 0);

  const handleLike = () => {
    console.log("Like topic:", topic._id);
    setIsModalOpen(true);
    setIsNew(false); // Set isNew to false when the topic is viewed
    setLikesCount((prevCount) => prevCount + 1);
  };

  const handleDislike = () => {
    console.log("Dislike topic:", topic._id);
    setDislikesCount((prevCount) => prevCount + 1);
    // Implement dislike logic
  };

  const handleDelete = () => {
    // Delete logic
  };
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      <div onClick={handleLike} className="Topic">
        <h3>
          {topic.title}
          {isNew && <span className="new-indicator">New</span>}{" "}
          {/* Show "New" indicator */}
        </h3>
        <p>{formatDate(topic.dateStart)}</p>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <TopicDisplay
          topic={topic}
          likesCount={likesCount}
          dislikesCount={dislikesCount}
          isAdmin={isAdmin}
          onLike={handleLike}
          onDislike={handleDislike}
          onDelete={handleDelete}
        />
      </Modal>
    </>
  );
};

export default Topic;