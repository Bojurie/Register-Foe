import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import Modal from "../Modal";
import { FaComment, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { useSnackbar } from "notistack";
import axiosInstance from "../axiosInstance";
import CommentSection from "./CommentSection/CommentSection";
import "./Topic.css";

const Topic = ({ topic }) => {
  const { user, updateTopicVote, fetchLikesAndDislikes } = useAuth();
  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  // Fetch only likes and dislikes when the component mounts
  useEffect(() => {
    const fetchReactions = async () => {
      try {
        const likesResponse = await fetchLikesAndDislikes(
          topic._id,
          "likes",
          enqueueSnackbar
        );
        const dislikesResponse = await fetchLikesAndDislikes(
          topic._id,
          "dislikes",
          enqueueSnackbar
        );

        // Update state based on the fetched data
        setLikesCount(likesResponse.count);
        setDislikesCount(dislikesResponse.count);
      } catch (error) {
        console.error("Error fetching likes or dislikes:", error);
        enqueueSnackbar("Failed to fetch likes or dislikes.", {
          variant: "error",
        });
      }
    };

    fetchReactions();
  }, [topic._id, fetchLikesAndDislikes, enqueueSnackbar]);

  // Fetch only comments
  const fetchCommentReaction = async () => {
    try {
      console.log(`Fetching comments from: /topics/${topic._id}/comments`);
      const commentsResponse = await axiosInstance.get(
        `/topics/${topic._id}/comments`
      );
      console.log("Comments response:", commentsResponse.data);
      setCommentsCount(commentsResponse.data.comments.length);
    } catch (error) {
      console.error("Error fetching comments:", error);
      enqueueSnackbar("Failed to fetch comments.", {
        variant: "error",
      });
    }
  };

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

  // Toggle the comment section modal and fetch comments
  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
    if (!isModalOpen) {
      fetchCommentReaction();
    }
  };

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
