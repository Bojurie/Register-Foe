import React from "react";
import TopicDisplay from "../TopicDisplay/TopicDisplay";

const Topic = ({ topic, isAdmin }) => {
  const [likesCount, setLikesCount] = useState(topic.likesCount || 0);
  const [dislikesCount, setDislikesCount] = useState(topic.dislikesCount || 0);
  const [votesCount, setVotesCount] = useState(topic.votesCount || 0);

  const handleLike = () => {
    console.log("Like topic:", topic._id);
    setLikesCount((prevCount) => prevCount + 1);
    // Implement like logic
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

  return (
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
  );
};

export default Topic;