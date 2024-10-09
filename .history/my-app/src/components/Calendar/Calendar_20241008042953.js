import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
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
                  placeholder="Enter your reminder"
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

  useEffect(() => {
    console.log("User object in Calendar component:", user); 
    if (user?._id) {
      console.log("User ID is present:", user._id);
      fetchUserReminders();
    } else {
      console.log("User ID is missing in Calendar component."); 
    }
  }, [user]);

  const fetchUserReminders = useCallback(async () => {
    if (!user?._id) {
      toast.error("User ID is missing. Please log in again.");
      console.log("User ID is missing in fetchUserReminders.");
      return;
    }

    try {
      console.log("Fetching reminders for user ID:", user._id); 
      const response = await getUserReminder({ userId: user._id });
      console.log("Reminders fetched:", response); 
      setReminders(response);
    } catch (error) {
      console.error("Error fetching reminders:", error);
      toast.error("Failed to load reminders. Please try again later.");
    }
  }, [getUserReminder, user?._id]);

  // Save new reminder
  const handleSaveReminder = async () => {
    console.log("Save Reminder button clicked");

    if (!newReminderText.trim()) {
      toast.warning("Reminder text cannot be empty.");
      console.log("Reminder text is empty. Cannot save.");
      return;
    }
    if (!user?._id) {
      toast.error("User ID is missing. Please log in again.");
      console.log("User ID is missing. Cannot save reminder.");
      return;
    }

    console.log("Saving reminder with the following data:");
    console.log("User ID:", user._id); 
    console.log("Date:", selectedDate);
    console.log("Reminder Text:", newReminderText);

    try {
      await postUserReminder({
        userId: user._id,
        date: selectedDate,
        text: newReminderText,
      });

      console.log("Reminder saved successfully!");

      closeModal(); 
      fetchUserReminders(); 
      toast.success("Reminder added successfully!");
    } catch (error) {
      console.error("Error saving reminder:", error);
      toast.error(
        error.response?.data?.error ||
          "Failed to save reminder. Please try again."
      );
    }
  };

  const handleDeleteReminder = async () => {
    if (!selectedReminder) {
      toast.error("No reminder selected.");
      return;
    }

    try {
      console.log("Deleting reminder with ID:", selectedReminder._id);
      await deleteReminder(selectedReminder._id);
      toast.success("Reminder deleted successfully!");
      closeModal();
      fetchUserReminders(); 
    } catch (error) {
      console.error("Error deleting reminder:", error);
      toast.error("Failed to delete reminder. Please try again.");
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setNewReminderText("");
    setSelectedReminder(null);
  };

  const getMonthDays = (date) => {
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return Array.from(
      { length: lastDay.getDate() },
      (_, i) => new Date(date.getFullYear(), date.getMonth(), i + 1)
    );
  };

  const monthDays = getMonthDays(currentMonth);

  // Function to handle day click
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
