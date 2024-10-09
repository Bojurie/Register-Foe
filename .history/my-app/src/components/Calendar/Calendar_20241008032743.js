import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "react-modal";
import "./Calendar.css";
import { useAuth } from "../AuthContext/AuthContext";
import { toast } from "react-toastify";

// Custom modal component for adding or viewing reminders
const ReminderModal = ({
  isOpen,
  onClose,
  selectedReminder,
  selectedDate,
  handleSaveReminder,
  handleDeleteReminder,
  newReminderText,
  setNewReminderText,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="full-screen-modal-content"
      overlayClassName="full-screen-modal-overlay"
      ariaHideApp={false}
    >
      <div>
        {selectedReminder ? (
          <>
            <h2>Reminder for {selectedDate?.toDateString()}</h2>
            <div>
              <p>{selectedReminder.text}</p>
              <p>{new Date(selectedReminder.date).toLocaleDateString()}</p>
            </div>
            <motion.button
              onClick={handleDeleteReminder}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Delete Reminder
            </motion.button>
          </>
        ) : (
          <>
            <h2>Add Reminder for {selectedDate?.toDateString()}</h2>
            <div>
              <label>
                Reminder:
                <input
                  type="text"
                  value={newReminderText}
                  onChange={(e) => setNewReminderText(e.target.value)}
                />
              </label>
              <motion.button
                onClick={handleSaveReminder}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Save Reminder
              </motion.button>
            </div>
          </>
        )}
        <motion.button
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

const Calendar = () => {
  const { postUserReminder, user, getUserReminder, deleteReminder } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isModalOpen, setModalOpen] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [newReminderText, setNewReminderText] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedReminder, setSelectedReminder] = useState(null);

  // Fetch user reminders
  const fetchUserReminders = useCallback(async () => {
    if (!user?.id) return;

    try {
      const response = await getUserReminder({ userId: user.id });
      setReminders(
        response.filter((reminder) => new Date(reminder.date) >= new Date())
      );
    } catch (error) {
      toast.error("Failed to load reminders. Please try again later.");
    }
  }, [getUserReminder, user?.id]);

  useEffect(() => {
    if (user?.id) fetchUserReminders();
  }, [user?.id, fetchUserReminders]);

  const handleDayClick = (day) => {
    const today = new Date().setHours(0, 0, 0, 0);
    const selectedDay = day.setHours(0, 0, 0, 0);

    if (selectedDay < today) {
      toast.warning("You cannot set reminders for past dates.");
      return;
    }

    setSelectedDate(day);
    const reminder = reminders.find(
      (reminder) =>
        new Date(reminder.date).toDateString() === day.toDateString()
    );
    setSelectedReminder(reminder);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setNewReminderText("");
    setSelectedReminder(null);
  };

  const handleSaveReminder = async () => {
    if (!newReminderText.trim()) {
      toast.warning("Reminder text cannot be empty.");
      return;
    }

    if (!user?.id) {
      toast.error("User not found. Please log in again.");
      return;
    }

    const formData = {
      userId: user.id,
      date: selectedDate, 
      text: newReminderText,
    };

    try {
      await postUserReminder(formData);
      closeModal(); 
      fetchUserReminders(); 
      toast.success("Reminder added successfully!");
    } catch (error) {
      toast.error(
        error.message || "Failed to save reminder. Please try again."
      );
    }
  };


  const handleDeleteReminder = async () => {
    if (!selectedReminder) return;

    try {
      await deleteReminder(selectedReminder.id);
      closeModal();
      fetchUserReminders();
      toast.success("Reminder deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete reminder. Please try again.");
    }
  };

  const getMonthDays = (date) => {
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return Array.from(
      { length: lastDay.getDate() },
      (_, i) => new Date(date.getFullYear(), date.getMonth(), i + 1)
    );
  };

  const monthDays = getMonthDays(currentMonth);

  return (
    <motion.div className="calendar-wrapper">
      <div className="calendar-header">
        <h2>
          {currentMonth.toLocaleString("default", { month: "long" })}{" "}
          {currentMonth.getFullYear()}
        </h2>
      </div>

      <motion.div className="calendar-days">
        {monthDays.map((day) => {
          const hasReminder = reminders.some(
            (reminder) =>
              new Date(reminder.date).toDateString() === day.toDateString()
          );
          return (
            <motion.div
              key={day.toString()}
              className={`calendar-day ${hasReminder ? "with-reminder" : ""} ${
                day.toDateString() === new Date().toDateString() ? "today" : ""
              }`}
              onClick={() => handleDayClick(day)}
            >
              {day.getDate()}
            </motion.div>
          );
        })}
      </motion.div>

      <ReminderModal
        isOpen={isModalOpen}
        onClose={closeModal}
        selectedReminder={selectedReminder}
        selectedDate={selectedDate}
        handleSaveReminder={handleSaveReminder}
        handleDeleteReminder={handleDeleteReminder}
        newReminderText={newReminderText}
        setNewReminderText={setNewReminderText}
      />
    </motion.div>
  );
};

export default Calendar;
