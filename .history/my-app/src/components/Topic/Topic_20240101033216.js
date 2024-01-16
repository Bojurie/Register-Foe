import React, {useState} from "react";
import TopicDisplay from "../TopicDisplay/TopicDisplay";
// import Model from '../Modal';

const Topic = ({ topic, isAdmin }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [likesCount, setLikesCount] = useState(topic.likesCount || 0);
  const [dislikesCount, setDislikesCount] = useState(topic.dislikesCount || 0);
  const [votesCount, setVotesCount] = useState(topic.votesCount || 0);

  const handleLike = () => {
    console.log("Like topic:", topic._id);
    setIsModalOpen(true);
    setLikesCount((prevCount) => prevCount + 1);
  };

  const handleDislike = () => {
    console.log("Dislike topic:", topic._id);
    setDislikesCount((prevCount) => prevCount + 1);
    // Implement dislike logic
  };

  const handleVote = () => {
    console.log("Vote for topic:", topic._id);
    setVotesCount((prevCount) => prevCount + 1);
    // Implement vote logic
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
      <div onClick={handleLike}>
        <h3>{topic.title}</h3>
        <p>{formatDate(topic.dateStart)}</p>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <TopicDisplay
          topic={topic}
          likesCount={likesCount}
          dislikesCount={dislikesCount}
          votesCount={votesCount}
          isAdmin={isAdmin}
          onLike={handleLike}
          onDislike={handleDislike}
          onVote={handleVote}
          onDelete={handleDelete}
        />
      </Modal>
    </>
  );
};

export default Topic;