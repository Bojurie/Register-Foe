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
    if (!topic?._id) return;

    const fetchCommentsCount = async () => {
      try {
        const response = await axiosInstance.get(
          `/vote/vote/topics/${topic._id}/comments?onlyCount=true`
        );
        setCommentsCount(response.data.commentsCount);
      } catch (error) {
        console.error("Failed to fetch comments count:", error.message);
        setMessage({ type: "error", text: "Failed to fetch comments count." });
      }
    };

    fetchCommentsCount();
  }, [topic]);

  useEffect(() => {
    const fetchReactions = async () => {
      if (
        fetchedDataRef.current.likesFetched &&
        fetchedDataRef.current.dislikesFetched
      )
        return;

      try {
        const likesResponse = await fetchLikesAndDislikes(topic._id, "likes");
        setLikesCount(likesResponse?.count ?? 0);
        fetchedDataRef.current.likesFetched = true;

        const dislikesResponse = await fetchLikesAndDislikes(
          topic._id,
          "dislikes"
        );
        setDislikesCount(dislikesResponse?.count ?? 0);
        fetchedDataRef.current.dislikesFetched = true;
      } catch (error) {
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
      } catch (error) {
        setMessage({ type: "error", text: `Failed to ${action} the topic.` });
      }
    },
    [updateTopicVote, user._id, topic._id]
  );

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/vote/topics/${topic._id}`);
      setMessage({ type: "success", text: "Topic deleted successfully." });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to delete the topic." });
    }
  };

  return (
    <Box mb={2} borderBottom="1px solid #ccc" pb={2}>
      <Typography variant="h6">{topic.title}</Typography>
      <Typography variant="body1">{topic.content}</Typography>
      <Box display="flex" alignItems="center" mt={1}>
        <button onClick={() => handleVote("like")}>
          <FaThumbsUp /> {likesCount}
        </button>
        <button onClick={() => handleVote("dislike")}>
          <FaThumbsDown /> {dislikesCount}
        </button>
        <button onClick={() => setIsModalOpen(true)}>
          <FaComment /> {commentsCount} Comments
        </button>
        {canDelete && (
          <button onClick={handleDelete}>
            <FaTrash />
          </button>
        )}
      </Box>

      {message && (
        <Alert severity={message.type} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <CommentSection topicId={topic._id} />
      </Modal>
    </Box>
  );
};

export default Topic;
