import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import Modal from "../Modal";
import { FaComment, FaThumbsUp, FaThumbsDown, FaTrash } from "react-icons/fa";
import axiosInstance from "../axiosInstance";
import CommentSection from "./CommentSection/CommentSection";
import { motion } from "framer-motion";
import { Box, Typography, Alert } from "@mui/material";
import "./Topic.css";

const Topic = ({ topic }) => {
  const { user, updateTopicVote, fetchLikesAndDislikes } = useAuth();
  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState(null);
  const fetchedDataRef = useRef({
    likesFetched: false,
    dislikesFetched: false,
  });

  const canDelete =
    user?.role === "admin" ||
    (user?.isCompany && user?.companyCode === topic.companyCode);

  useEffect(() => {
    if (!topic?._id) return; // Ensure topic ID is available

    const fetchCommentsCount = async () => {
      try {
        const response = await axiosInstance.get(
          `/topics/${topic._id}/comments/count`
        );
        setCommentsCount(response.data.commentsCount);
      } catch (error) {
        console.error("Failed to fetch comments count:", error.message);
        setMessage({ type: "error", text: "Failed to fetch comments count." });
      }
    };

    fetchCommentsCount();
  }, [topic?._id]); // Only run if topic ID changes

  useEffect(() => {
    const fetchReactions = async () => {
      try {
        if (!fetchedDataRef.current.likesFetched) {
          const likesResponse = await fetchLikesAndDislikes(topic._id, "likes");
          setLikesCount(likesResponse?.count ?? 0);
          fetchedDataRef.current.likesFetched = true;
        }

        if (!fetchedDataRef.current.dislikesFetched) {
          const dislikesResponse = await fetchLikesAndDislikes(
            topic._id,
            "dislikes"
          );
          setDislikesCount(dislikesResponse?.count ?? 0);
          fetchedDataRef.current.dislikesFetched = true;
        }
      } catch {
        setMessage({
          type: "error",
          text: "Failed to fetch likes or dislikes.",
        });
      }
    };
    fetchReactions();
  }, [topic._id, fetchLikesAndDislikes]);

  const handleVote = useCallback(
    async (action) => {
      try {
        const result = await updateTopicVote(user._id, topic._id, action);
        setLikesCount(result.likesCount);
        setDislikesCount(result.dislikesCount);
      } catch {
        setMessage({ type: "error", text: `Failed to ${action} the topic.` });
      }
    },
    [updateTopicVote, user._id, topic._id]
  );

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/vote/topics/${topic._id}`);
      setMessage({ type: "success", text: "Topic deleted successfully." });
    } catch {
      setMessage({ type: "error", text: "Failed to delete the topic." });
    }
  };

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  return (
    <>
      <motion.div
        className="topic"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h4 className="topic-title">{topic.title}</h4>
        <p className="topic-dates">
          {new Date(topic.dateStart).toLocaleDateString()} -{" "}
          {new Date(topic.dateEnd).toLocaleDateString()}
        </p>
        <p className="topic-description">{topic.description}</p>

        {message && (
          <Box mb={2}>
            <Alert severity={message.type}>{message.text}</Alert>
          </Box>
        )}

        <div className="topic-stats">
          <motion.button
            className="reaction-button"
            onClick={() => handleVote("like")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaThumbsUp style={{ color: "green" }} /> {likesCount}
          </motion.button>
          <motion.button
            className="reaction-button"
            onClick={() => handleVote("dislike")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaThumbsDown style={{ color: "red" }} /> {dislikesCount}
          </motion.button>
          <motion.button
            className="comment-button"
            onClick={toggleModal}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaComment style={{ color: "#7aadde" }} /> {commentsCount} Comments
          </motion.button>

          {canDelete && (
            <motion.button
              className="delete-button"
              onClick={handleDelete}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaTrash /> Delete
            </motion.button>
          )}
        </div>
      </motion.div>

      <Modal isOpen={isModalOpen} onClose={toggleModal}>
        <CommentSection topicId={topic._id} />
      </Modal>
    </>
  );
};

export default Topic;
