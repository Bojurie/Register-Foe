import React from "react";
import Modal from "react-modal";
import "./MessageModal.css";

const MessageModal = ({
  message,
  handleCloseModal,
  handleReplySend,
  replyContent,
  setReplyContent,
}) => {
  return (
    <Modal isOpen onRequestClose={handleCloseModal} contentLabel="Reply Modal">
      <h2>Reply to {message.sender?.firstName || "Unknown Sender"}</h2>
      <p>Message: {message.content}</p>

      <textarea
        value={replyContent}
        onChange={(e) => setReplyContent(e.target.value)}
        placeholder="Type your reply here..."
      />

      <div className="ModalButtons">
        <button onClick={handleReplySend} disabled={!replyContent.trim()}>
          Send Reply
        </button>
        <button onClick={handleCloseModal}>Close</button>
      </div>
    </Modal>
  );
};

export default MessageModal;
