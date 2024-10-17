import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import Modal from "../Modal";
import { FaComment, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { useSnackbar } from "notistack";
import axiosInstance from "../axiosInstance";
import CommentSection from "./CommentSection/CommentSection";
import { Box, Typography, IconButton } from "@mui/material";
import { styled } from "@mui/system";

const StyledBox = styled(Box)({
  padding: "16px",
  marginBottom: "16px",
  backgroundColor: "#f9f9f9",
  borderRadius: "8px",
  boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
  "@media (max-width: 600px)": {
    padding: "12px",
  },
});

const Topic = ({ topic }) => {
  const { user, updateTopicVote, fetchLikesAndDislikes } = useAuth();
  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchCommentsCount = async () => {
      try {
        const response = await axiosInstance.get(
          `/vote/topics/${topic._id}/comments`
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

        setLikesCount(likesResponse?.count ?? 0);
        setDislikesCount(dislikesResponse?.count ?? 0);
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

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  return (
    <>
      <StyledBox>
        <Typography variant="h5">{topic.title}</Typography>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={2}
        >
          <IconButton onClick={() => handleVote("like")}>
            <FaThumbsUp /> {likesCount}
          </IconButton>
          <IconButton onClick={() => handleVote("dislike")}>
            <FaThumbsDown /> {dislikesCount}
          </IconButton>
          <IconButton onClick={toggleModal}>
            <FaComment /> {commentsCount} Comments
          </IconButton>
        </Box>
      </StyledBox>

      <Modal isOpen={isModalOpen} onClose={toggleModal}>
        <CommentSection topicId={topic._id} />
      </Modal>
    </>
  );
};

export default Topic;
