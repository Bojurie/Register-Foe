import React from "react";
import Modal from "react-modal";
import { motion } from "framer-motion";
import "./ReminderModal.css";

const ReminderModal = ({
  isOpen,
  onClose,
  selectedReminder,
  selectedDate,
  reminderTime,
  setReminderTime,
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
      }).format(new Date(selectedDate))
    : "";

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modalContent"
      overlayClassName="modalOverlay"
      ariaHideApp={false}
    >
      <div>
        {selectedReminder ? (
          <>
            <h2>Reminder for {formattedDate}</h2>
            <p>{selectedReminder.text}</p>
            <motion.button
              className="deleteButton"
              onClick={() => {
                handleDeleteReminder();
                onClose(); // Close modal after deletion
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Dismiss Reminder
            </motion.button>
          </>
        ) : (
          <>
            <h2>Add Reminder for {formattedDate}</h2>
            <div className="form-group">
              <label>Reminder:</label>
              <input
                type="text"
                value={newReminderText}
                onChange={(e) => setNewReminderText(e.target.value)}
                placeholder="Enter your reminder"
              />
            </div>
            <div className="form-group">
              <label>Time:</label>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
              />
            </div>
            <motion.button
              className="saveButton"
              onClick={() => {
                handleSaveReminder();
                onClose(); // Close modal after saving
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Save Reminder
            </motion.button>
          </>
        )}
        <motion.button
          className="closeButton"
          onClick={onClose}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Close
        </motion.button>
      </div>
    </Modal>
  );
};

export default ReminderModal;
