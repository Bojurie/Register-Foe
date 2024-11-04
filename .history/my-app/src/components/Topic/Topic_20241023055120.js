import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import Modal from "../Modal";
import { FaComment, FaThumbsUp, FaThumbsDown, FaTrash } from "react-icons/fa";
import { useSnackbar } from "notistack";
import axiosInstance from "../axiosInstance";
import CommentSection from "./CommentSection/CommentSection";
import { Box, Typography, IconButton } from "@mui/material";
import { styled } from "@mui/system";

const StyledBox = styled(Box)({
  padding: "16px",
  borderRadius: "8px",
  boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
  "@media (max-width: 600px)": {
    padding: "12px",
  },
  background: "linear-gradient(135deg, #e5e5e573, #c5c5c591)",
});

const StyledTitle = styled(Typography)({
  textTransform: "capitalize",
  fontSize: ".9rem",
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
    color: "#657103",
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
});

const DeleteButton = styled(IconButton)({
  backgroundColor: "#ffebe6",
  borderRadius: "8px",
  padding: "10px",
  transition: "background-color 0.3s ease",
  "&:hover": {
    backgroundColor: "#ff4d4d",
  },
  "& svg": {
    color: "#ff3333",
    marginRight: "4px",
  },
});

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
    const fetchCommentsCount = async () => {
      try {
        const response = await axiosInstance.get(
          `/vote/topics/${topic._id}/comments/comment`
        );
        setCommentsCount(response.data.comments.length);
      } catch {
        enqueueSnackbar("Failed to fetch comments count.", {
          variant: "error",
        });
      }
    };

    fetchCommentsCount();
  }, [topic._id, enqueueSnackbar]);

  useEffect(() => {
    const fetchReactions = async () => {
      if (!fetchedDataRef.current.likesFetched) {
        try {
          const likesResponse = await fetchLikesAndDislikes(topic._id, "likes");
          setLikesCount(likesResponse?.count ?? 0);
          fetchedDataRef.current.likesFetched = true;
        } catch {
          enqueueSnackbar("Failed to fetch likes.", { variant: "error" });
        }
      }

      if (!fetchedDataRef.current.dislikesFetched) {
        try {
          const dislikesResponse = await fetchLikesAndDislikes(
            topic._id,
            "dislikes"
          );
          setDislikesCount(dislikesResponse?.count ?? 0);
          fetchedDataRef.current.dislikesFetched = true;
        } catch {
          enqueueSnackbar("Failed to fetch dislikes.", { variant: "error" });
        }
      }
    };

    fetchReactions();
  }, [topic._id, fetchLikesAndDislikes, enqueueSnackbar]);

  const handleVote = useCallback(
    async (action) => {
      try {
        const result = await updateTopicVote(user._id, topic._id, action);
        setLikesCount(result.likesCount);
        setDislikesCount(result.dislikesCount);
      } catch {
        enqueueSnackbar(`Failed to ${action} the topic.`, { variant: "error" });
      }
    },
    [updateTopicVote, user._id, topic._id, enqueueSnackbar]
  );

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/vote/topics/${topic._id}`);
      enqueueSnackbar("Topic deleted successfully.", { variant: "success" });
    } catch {
      enqueueSnackbar("Failed to delete the topic.", { variant: "error" });
    }
  };

  const toggleModal = () => setIsModalOpen((prev) => !prev);

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

          {canDelete && (
            <DeleteButton onClick={handleDelete}>
              <FaTrash /> Delete
            </DeleteButton>
          )}
        </Box>
      </StyledBox>

      <Modal isOpen={isModalOpen} onClose={toggleModal}>
        <CommentSection topicId={topic._id} />
      </Modal>
    </>
  );
};

export default Topic;
