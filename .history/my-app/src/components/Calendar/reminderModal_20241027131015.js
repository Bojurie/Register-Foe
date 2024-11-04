import React from "react";
import Modal from "react-modal";
import { motion } from "framer-motion";
import "./CalendarWidget.css";

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
        <h2>{selectedReminder ? "Edit Reminder" : "Add Reminder"}</h2>
        <p className="modalDate">{formattedDate}</p>

        {selectedReminder ? (
          <div className="reminderTextContainer">
            <p className="reminderText">{selectedReminder.text}</p>
            <motion.button
              onClick={handleDeleteReminder}
              className="modalButton deleteButton"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Delete Reminder
            </motion.button>
          </div>
        ) : (
          <div className="addReminderContainer">
            <label className="inputLabel">Reminder Text:</label>
            <input
              type="text"
              value={newReminderText}
              onChange={(e) => setNewReminderText(e.target.value)}
              placeholder="Enter your reminder"
              className="reminderInput"
            />
            <motion.button
              onClick={handleSaveReminder}
              className="modalButton saveButton"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Save Reminder
            </motion.button>
          </div>
        )}

        <motion.button
          onClick={onClose}
          className="modalButton closeButton"
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
