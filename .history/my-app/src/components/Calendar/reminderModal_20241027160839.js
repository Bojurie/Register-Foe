import React from "react";
import Modal from "react-modal";
import { motion } from "framer-motion";
import './CalenderWidget.css'

const ReminderModal = ({
  isOpen,
  onClose,
  selectedReminder,
  selectedDate,
  reminderTime,
  setReminderTime,
  handleSaveReminder,
  handleDeleteReminder,
  handleSnoozeReminder,
  newReminderText,
  setNewReminderText,
  userTimezone,
}) => {
  const formattedDate = selectedDate
    ? new Intl.DateTimeFormat("default", {
        dateStyle: "full",
        timeStyle: "short",
        timeZone: userTimezone,
      }).format(selectedDate) // Use selectedDate directly
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
                onClose();
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Dismiss Reminder
            </motion.button>
            <div className="snoozeContainer">
              <label>Snooze for:</label>
              <select
                onChange={(e) => handleSnoozeReminder(parseInt(e.target.value))}
              >
                <option value="5">5 minutes</option>
                <option value="10">10 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
              </select>
            </div>
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
                onClose();
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
