import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import Modal from "../Modal";
import { FaComment, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { useSnackbar } from "notistack";
import axiosInstance from "../axiosInstance";
import CommentSection from "./CommentSection/CommentSection"; // New component
import "./Topic.css";

const Topic = ({ topic }) => {
  const { user, updateTopicVote } = useAuth();
  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentsCount, setCommentsCount] = useState(0);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchReactions = async () => {
      try {
        const likesResponse = updateTopicVote()
        const dislikesResponse = updateTopicVote();
        const commentsResponse = updateTopicVote()

        setLikesCount(likesResponse.data.likesCount);
        setDislikesCount(dislikesResponse.data.dislikesCount);
        setCommentsCount(commentsResponse.data.comments.length); 
      } catch (error) {
        enqueueSnackbar("Failed to fetch likes, dislikes, or comments.", {
          variant: "error",
        });
      }
    };

    fetchReactions();
  }, [topic._id, enqueueSnackbar]);

  const handleVote = useCallback(
    async (action) => {
      try {
        const result = await axiosInstance.post(
          `/topics/${topic._id}/comments/${action}`,
          { userId: user._id }
        );
        if (action === "like") {
          setLikesCount(result.data.likesCount);
        } else {
          setDislikesCount(result.data.dislikesCount);
        }
        enqueueSnackbar(`Successfully ${action}d the topic!`, {
          variant: "success",
        });
      } catch (error) {
        enqueueSnackbar(`Error processing ${action}. Please try again.`, {
          variant: "error",
        });
      }
    },
    [topic._id, user._id, enqueueSnackbar]
  );

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
