import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import Modal from "../Modal";
import TopicDisplay from "../TopicDisplay/TopicDisplay";
import { FaComment, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { useSnackbar } from "notistack";
import axiosInstance from "../axiosInstance"; 
import "./Topic.css";

const Topic = ({ topic }) => {
  const { user, updateTopicVote, deleteTopic,  } = useAuth();
  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comments, setComments] = useState(topic.comments || []);
  const [newComment, setNewComment] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchReactions = async () => {
      try {
        const likesResponse = await axiosInstance.get(
          `/vote/topics/${topic._id}/likes`
        );
        const dislikesResponse = await axiosInstance.get(
          `/vote/topics/${topic._id}/dislikes`
        );
        setLikesCount(likesResponse.data.likesCount);
        setDislikesCount(dislikesResponse.data.dislikesCount);
      } catch (error) {
        enqueueSnackbar("Failed to fetch likes and dislikes.", {
          variant: "error",
        });
      }
    };

    fetchReactions();
  }, [topic._id, enqueueSnackbar]);

  const handleVote = useCallback(
    async (action) => {
      try {
        const optimisticCount =
          action === "like" ? likesCount + 1 : dislikesCount + 1;

        if (action === "like") setLikesCount(optimisticCount);
        else setDislikesCount(optimisticCount);

        const result = await updateTopicVote(user._id, topic._id, action);

        if (action === "like") {
          setLikesCount(result.likesCount); 
          enqueueSnackbar("Successfully liked the topic!", {
            variant: "success",
          });
        } else {
          setDislikesCount(result.dislikesCount);
          enqueueSnackbar("Successfully disliked the topic!", {
            variant: "success",
          });
        }
      } catch (error) {
        if (action === "like") setLikesCount(likesCount - 1);
        else setDislikesCount(dislikesCount - 1);

        enqueueSnackbar(`Error processing ${action} vote. Please try again.`, {
          variant: "error",
        });
      }
    },
    [
      user._id,
      topic._id,
      likesCount,
      dislikesCount,
      updateTopicVote,
      enqueueSnackbar,
    ]
  );

  // Handle adding a comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const addedComment = await axiosInstance(
        user._id,
        topic._id,
        newComment
      );
      setComments((prevComments) => [...prevComments, addedComment]);
      setNewComment("");
      enqueueSnackbar("Comment added successfully!", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Error adding comment. Please try again.", {
        variant: "error",
      });
    }
  }

   useEffect(() => {
     const postComments = async () => {
       try {
         const response = await axiosInstance.get(
           `/topics/${topicId}/comments`
         );
         setTopicComments(response.data.comments);
       } catch (error) {
         console.error("Error fetching comments:", error);
       }
     };

     postComments();
   }, [topicId]);

  const toggleModal = () => setIsModalOpen((prev) => !prev);

  return (
    <>
      <div className="Topic" onClick={toggleModal}>
        <h4>{topic.title}</h4>
        <p>
          {new Date(topic.dateStart).toLocaleDateString()} -{" "}
          {new Date(topic.dateEnd).toLocaleDateString()}
        </p>
        <div className="Topic-stats">
          <div>
            <FaThumbsUp /> {likesCount}
          </div>
          <div>
            <FaThumbsDown /> {dislikesCount}
          </div>
          <div>
            <FaComment /> {comments.length}
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={toggleModal}>
        <TopicDisplay
          topic={topic}
          likesCount={likesCount}
          dislikesCount={dislikesCount}
          onLike={() => handleVote("like")}
          onDislike={() => handleVote("dislike")}
          onDelete={() => deleteTopic(topic._id)}
          comments={comments}
          isAdmin={user.role === "Admin"}
        />
        <div className="AddComment">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            rows="3"
          />
          <button onClick={handleAddComment}>Add Comment</button>
        </div>
      </Modal>
    </>
  );
};

export default Topic;
