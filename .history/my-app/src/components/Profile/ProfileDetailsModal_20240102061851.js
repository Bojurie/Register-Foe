import React from "react";
import "./ProfileDetailsModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faThumbsUp,
  faThumbsDown,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

const ProfileDetailsModal = ({
  user,
  onClose,
  onLikeCount,
  onDislikeCount,
  onGrantAdmin,
}) => {
  if (!user) {
    return null;
  }

    const backdropVariants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    };
    const modalVariants = {
      hidden: { y: "-100vh", opacity: 0 },
      visible: { y: "0", opacity: 1 },
    };

  return (
   <motion.div 
      className="ProfileDetailsModalBackdrop"
      onClick={onClose}
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <motion.div 
        className="ProfileDetailsModal"
        onClick={(e) => e.stopPropagation()}
        variants={modalVariants}
      >
        <div className="ModalContent">
          <button className="CloseButton" onClick={onClose}>
            X
          </button>
          <h4>
            {user.firstName} {user.lastName}
          </h4>
          <p>
            <span>About:</span> {user.userProfileDetail}
          </p>
          <p>
            <span>Email:</span> {user.email}
          </p>
          <p>
            <span>Age:</span> {user.age}
          </p>
          <p>
            <span>Sex:</span> {user.sex}
          </p>
          <p>
            <span>CompanyCode:</span> {user.companyCode}
          </p>
          <div className="Profile-Buttons">
            <button onClick={() => onLikeCount(user)}>
              <FontAwesomeIcon icon={faThumbsUp} /> Like
            </button>
            <button onClick={() => onDislikeCount(user)}>
              <FontAwesomeIcon icon={faThumbsDown} /> Dislike
            </button>
            <button onClick={() => onGrantAdmin(user)}>
              <FontAwesomeIcon icon={faUserShield} /> Grant Admin
            </button>
         </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProfileDetailsModal;
