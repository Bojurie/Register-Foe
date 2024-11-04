import React from "react";
import Modal from "react-modal";
import { motion } from "framer-motion";
import "./CalenderWidget.css";

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
      <div className="modalContainer">
        {selectedReminder ? (
          <div className="reminderTextContainer">
            <h2 className="modalDate">Reminder for {formattedDate}</h2>
            <p className="reminderText">{selectedReminder.text}</p>
            <motion.button
              className="modalButton deleteButton"
              onClick={handleDeleteReminder}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Dismiss Reminder
            </motion.button>
          </div>
        ) : (
          <div className="addReminderContainer">
            <h2 className="modalDate">Add Reminder for {formattedDate}</h2>
            <label className="inputLabel">Reminder:</label>
            <input
              type="text"
              className="reminderInput"
              value={newReminderText}
              onChange={(e) => setNewReminderText(e.target.value)}
              placeholder="Enter your reminder"
            />
            <motion.button
              className="modalButton saveButton"
              onClick={handleSaveReminder}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Save Reminder
            </motion.button>
          </div>
        )}
        <motion.button
          className="modalButton closeButton"
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
