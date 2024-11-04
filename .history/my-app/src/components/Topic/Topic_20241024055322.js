import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import Modal from "../Modal";
import { FaComment, FaThumbsUp, FaThumbsDown, FaTrash } from "react-icons/fa";
import { useSnackbar } from "notistack";
import axiosInstance from "../axiosInstance";
import CommentSection from "./CommentSection/CommentSection";
import './Topic.css'


const Topic = ({ topic }) => {
  const { user, updateTopicVote, fetchLikesAndDislikes } = useAuth();
  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const fetchedDataRef = useRef({
    likesFetched: false,
    dislikesFetched: false,
  });

  const canDelete =
    user?.role === "admin" ||
    (user?.isCompany && user?.companyCode === topic.companyCode);

  useEffect(() => {
    console.log("User data:", user);
    console.log("Can delete:", canDelete);
  }, [user, canDelete]);

  useEffect(() => {
    const fetchCommentsCount = async () => {
      try {
        const response = await axiosInstance.get(
          `/vote/topics/${topic._id}/comments/comment`
        );
        setCommentsCount(response.data.comments.length);
      } catch (error) {
        enqueueSnackbar("Failed to fetch comments count.", {
          variant: "error",
        });
      }
    };

    fetchCommentsCount();
  }, [topic._id, enqueueSnackbar]);

  useEffect(() => {
    const fetchReactions = async () => {
      try {
        if (!fetchedDataRef.current.likesFetched) {
          const likesResponse = await fetchLikesAndDislikes(
            topic._id,
            "likes",
            enqueueSnackbar
          );
          setLikesCount(likesResponse?.count ?? 0);
          fetchedDataRef.current.likesFetched = true;
        }

        if (!fetchedDataRef.current.dislikesFetched) {
          const dislikesResponse = await fetchLikesAndDislikes(
            topic._id,
            "dislikes",
            enqueueSnackbar
          );
          setDislikesCount(dislikesResponse?.count ?? 0);
          fetchedDataRef.current.dislikesFetched = true;
        }
      } catch (error) {
        enqueueSnackbar("Failed to fetch likes or dislikes.", {
          variant: "error",
        });
      }
    };

    fetchReactions();
  }, [topic._id, enqueueSnackbar, fetchLikesAndDislikes]);

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

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/vote/topics/${topic._id}`);
      enqueueSnackbar("Topic deleted successfully.", { variant: "success" });
      // Optionally, you can refresh the topic list or redirect after deletion
    } catch (error) {
      enqueueSnackbar("Failed to delete the topic.", { variant: "error" });
    }
  };

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  return (
    <>
      <div className="topic">
        <h4>{topic.title}</h4>
        <p>{topic.description}</p>

        <div className="topic-stats">
          <button
            className="reaction-button"
            onClick={() => handleVote("like")}
          >
            <FaThumbsUp /> {likesCount}
          </button>
          <button
            className="reaction-button"
            onClick={() => handleVote("dislike")}
          >
            <FaThumbsDown /> {dislikesCount}
          </button>
          <button className="comment-button" onClick={toggleModal}>
            <FaComment /> {commentsCount} Comments
          </button>

          {canDelete && (
            <button className="delete-button" onClick={handleDelete}>
              <FaTrash /> Delete
            </button>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={toggleModal}>
        <CommentSection topicId={topic._id} />
      </Modal>
    </>
  );
};

export default Topic;