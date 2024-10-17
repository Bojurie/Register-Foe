import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import Modal from "../Modal";
import {
  FaComment,
  FaThumbsUp,
  FaThumbsDown,
  FaTrashAlt,
} from "react-icons/fa";
import { useSnackbar } from "notistack";
import axiosInstance from "../axiosInstance";
import CommentSection from "./CommentSection/CommentSection";
import { Box, Typography, IconButton, Button } from "@mui/material";
import { styled } from "@mui/system";

// Styled components
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

const StyledTitle = styled(Typography)({
  fontWeight: 700,
  fontSize: "1.5rem",
  color: "#333",
  "@media (max-width: 600px)": {
    fontSize: "1.2rem",
  },
});

const ReactionButton = styled(IconButton)({
  backgroundColor: "#f0f0f0",
  borderRadius: "8px",
  margin: "0 8px",
  padding: "10px",
  transition: "background-color 0.3s ease",
  "&:hover": {
    backgroundColor: "#e0e0e0",
  },
  "& svg": {
    color: "#333",
    marginRight: "4px",
  },
});

const CommentButton = styled(IconButton)({
  backgroundColor: "#fffae6",
  borderRadius: "8px",
  padding: "10px",
  transition: "background-color 0.3s ease",
  "&:hover": {
    backgroundColor: "#ffe680",
  },
  "& svg": {
    color: "#f5a623",
    marginRight: "4px",
  },
  "& span": {
    color: "#333",
  },
});

const DeleteButton = styled(Button)({
  backgroundColor: "#e74c3c",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#c0392b",
  },
  marginTop: "10px",
});

const Topic = ({ topic, onDelete }) => {
  const { user, updateTopicVote, fetchLikesAndDislikes } = useAuth();
  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const isAdminOrCompany =
    user.role === "Admin" || user.companyCode === topic.companyCode;

  // Fetch comments and set the count
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

  // Fetch likes and dislikes
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

  // Handle vote action
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

  // Toggle modal to view comments
  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  // Handle delete topic
  const handleDeleteTopic = async () => {
    try {
      await axiosInstance.delete(`/vote/topics/${topic._id}`);
      enqueueSnackbar("Topic deleted successfully.", { variant: "success" });
      if (onDelete) onDelete(topic._id); // Call parent function to update UI
    } catch (error) {
      enqueueSnackbar("Failed to delete topic.", { variant: "error" });
    }
  };

  return (
    <>
      <StyledBox>
        <StyledTitle variant="h5">{topic.title}</StyledTitle>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={2}
        >
          <ReactionButton onClick={() => handleVote("like")}>
            <FaThumbsUp /> {likesCount}
          </ReactionButton>
          <ReactionButton onClick={() => handleVote("dislike")}>
            <FaThumbsDown /> {dislikesCount}
          </ReactionButton>
          <CommentButton onClick={toggleModal}>
            <FaComment /> {commentsCount} Comments
          </CommentButton>
        </Box>

        {/* Show delete button if the user is an Admin or belongs to the company */}
        {isAdminOrCompany && (
          <DeleteButton onClick={handleDeleteTopic}>
            <FaTrashAlt /> Delete Topic
          </DeleteButton>
        )}
      </StyledBox>

      <Modal isOpen={isModalOpen} onClose={toggleModal}>
        <CommentSection topicId={topic._id} />
      </Modal>
    </>
  );
};

export default Topic;
