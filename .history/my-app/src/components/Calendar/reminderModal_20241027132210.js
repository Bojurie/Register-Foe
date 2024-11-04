import React from "react";
import Modal from "react-modal";
import { motion } from "framer-motion";
import "./CalenderWidget.css";
import { toast } from "react-toastify";

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
        timeZone: userTimezone,
      }).format(new Date(selectedDate))
    : "";

  const snoozeOptions = [5, 10, 15, 30, 60]; // minutes

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
            <h2 className="modalDate">
              Reminder for {formattedDate} at {selectedReminder.time}
            </h2>
            <p className="reminderText">{selectedReminder.text}</p>
            <motion.button
              className="modalButton deleteButton"
              onClick={handleDeleteReminder}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Dismiss Reminder
            </motion.button>
            <div className="snoozeContainer">
              <label htmlFor="snooze">Snooze for:</label>
              <select
                id="snooze"
                onChange={(e) =>
                  toast.info(`Snoozed for ${e.target.value} minutes`)
                }
              >
                {snoozeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option} minutes
                  </option>
                ))}
              </select>
            </div>
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
            <label className="inputLabel">Time:</label>
            <input
              type="time"
              className="timeInput"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
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
