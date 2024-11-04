
import React from "react";
import { motion } from "framer-motion";
import Modal from "react-modal";
import styles from "./ReminderModal.module.css.css";

const ReminderModal = ({
  isOpen,
  onClose,
  selectedReminder,
  selectedDate,
  handleSaveReminder,
  handleDeleteReminder,
  newReminderText,
  setNewReminderText,
  userTimezone,
}) => {
  const formattedDate = selectedDate
    ? new Intl.DateTimeFormat("default", {
        dateStyle: "full",
        timeStyle: "short",
        timeZone: userTimezone,
      }).format(selectedDate)
    : "";

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={styles.modalContent}
      overlayClassName={styles.modalOverlay}
      ariaHideApp={false}
    >
      <div>
        {selectedReminder ? (
          <>
            <h2>Reminder for {formattedDate}</h2>
            <div>
              <p>{selectedReminder.text}</p>
            </div>
            <motion.button onClick={handleDeleteReminder}>
              Delete Reminder
            </motion.button>
          </>
        ) : (
          <>
            <h2>Add Reminder for {formattedDate}</h2>
            <input
              type="text"
              value={newReminderText}
              onChange={(e) => setNewReminderText(e.target.value)}
              placeholder="Enter reminder"
            />
            <motion.button onClick={handleSaveReminder}>
              Save Reminder
            </motion.button>
          </>
        )}
        <motion.button onClick={onClose}>Close</motion.button>
      </div>
    </Modal>
  );
};

export default ReminderModal;
