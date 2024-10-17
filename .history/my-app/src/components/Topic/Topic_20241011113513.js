import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import Modal from "../Modal";
import { FaComment, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { useSnackbar } from "notistack";
import axiosInstance from "../axiosInstance";
import CommentSection from "./CommentSection/CommentSection";
import "./Topic.css";

const Topic = ({ topic }) => {
  const { user, updateTopicVote } = useAuth();
  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  // Fetch likes, dislikes, and comments when component mounts
  useEffect(() => {
    const fetchReactions = async () => {
      try {
        console.log(`Fetching likes from: /vote/topics/${topic._id}/likes`);
        const likesResponse = await axiosInstance.get(
          `/vote/topics/${topic._id}/likes`
        );
        console.log("Likes response:", likesResponse.data);

        console.log(
          `Fetching dislikes from: /vote/topics/${topic._id}/dislikes`
        );
        const dislikesResponse = await axiosInstance.get(
          `/vote/topics/${topic._id}/dislikes`
        );
        console.log("Dislikes response:", dislikesResponse.data);

        console.log(`Fetching comments from: /topics/${topic._id}/comments`);
        const commentsResponse = await axiosInstance.get(
          `/topics/${topic._id}/comments`
        );
        console.log("Comments response:", commentsResponse.data);

        // Update state based on the fetched data
        setLikesCount(likesResponse.data.likesCount);
        setDislikesCount(dislikesResponse.data.dislikesCount);
        setCommentsCount(commentsResponse.data.comments.length);
      } catch (error) {
        console.error("Error fetching reactions or comments:", error);
        enqueueSnackbar("Failed to fetch likes, dislikes, or comments.", {
          variant: "error",
        });
      }
    };

    fetchReactions();
  }, [topic._id, enqueueSnackbar]);

  // Handle vote actions for like and dislike
  const handleVote = useCallback(
    async (action) => {
      try {
        const result = await updateTopicVote(user._id, topic._id, action);
        setLikesCount(result.likesCount);
        setDislikesCount(result.dislikesCount);
      } catch (error) {
        enqueueSnackbar(`Failed to ${action} the topic.`, { variant: "error" });
      }
    },
    [updateTopicVote, user._id, topic._id, enqueueSnackbar]
  );

  // Toggle the comment section modal
  const toggleModal = () => setIsModalOpen((prev) => !prev);

  return (
    <>
      <div className="Topic">
        <h4>{topic.title}</h4>
        <div className="Topic-stats">
          <FaThumbsUp onClick={() => handleVote("like")} /> {likesCount}
          <FaThumbsDown onClick={() => handleVote("dislike")} /> {dislikesCount}
          <FaComment onClick={toggleModal} /> {commentsCount} Comments
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={toggleModal}>
        <CommentSection topicId={topic._id} />
      </Modal>
    </>
  );
};

export default Topic;
