import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Modal from "react-modal";
import "./Calendar.css";
import { useAuth } from "../AuthContext/AuthContext";
import { toast } from "react-toastify";

const reminderSound = new Audio("/path/to/reminder-sound.mp3"); // Add a path to your sound file

const ReminderModal = ({
  isOpen,
  onClose,
  selectedReminder,
  selectedDate,
  handleSaveReminder,
  handleDeleteReminder,
  newReminderText,
  setNewReminderText,
  handleSnooze,
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
            <div className="reminder-actions">
              <label>
                Snooze for:
                <select onChange={handleSnooze}>
                  <option value="5">5 minutes</option>
                  <option value="10">10 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="1440">1 day</option>
                </select>
              </label>
              <motion.button
                onClick={handleDeleteReminder}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Dismiss Reminder
              </motion.button>
            </div>
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
    if (user?._id) {
      fetchUserReminders();
    }
  }, [user]);

  useEffect(() => {
    const checkReminder = () => {
      const now = new Date();
      reminders.forEach((reminder) => {
        const reminderDate = new Date(reminder.date);
        if (reminderDate <= now) {
          setSelectedReminder(reminder);
          setSelectedDate(reminderDate);
          setModalOpen(true);
          reminderSound.play(); // Play the sound when the reminder is due
        }
      });
    };
    const interval = setInterval(checkReminder, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [reminders]);

  const fetchUserReminders = useCallback(async () => {
    if (!user?._id) {
      toast.error("User ID is missing. Please log in again.");
      return;
    }

    try {
      const response = await getUserReminder({ userId: user._id });
      setReminders(response);
    } catch (error) {
      toast.error("Failed to load reminders. Please try again later.");
    }
  }, [getUserReminder, user?._id]);

  const handleSaveReminder = async () => {
    if (!newReminderText.trim()) {
      toast.warning("Reminder text cannot be empty.");
      return;
    }
    if (!user?._id) {
      toast.error("User ID is missing. Please log in again.");
      return;
    }

    try {
      await postUserReminder({
        userId: user._id,
        date: selectedDate,
        text: newReminderText,
      });

      closeModal();
      fetchUserReminders();
      toast.success("Reminder added successfully!");
    } catch (error) {
      toast.error("Failed to save reminder. Please try again.");
    }
  };

  const handleDeleteReminder = async () => {
    if (!selectedReminder) {
      toast.error("No reminder selected.");
      return;
    }

    try {
      await deleteReminder(selectedReminder._id);
      toast.success("Reminder deleted successfully!");
      closeModal();
      fetchUserReminders();
    } catch (error) {
      toast.error("Failed to delete reminder. Please try again.");
    }
  };

  const handleSnooze = async (e) => {
    const snoozeMinutes = parseInt(e.target.value);
    const newDate = new Date();
    newDate.setMinutes(newDate.getMinutes() + snoozeMinutes);

    try {
      await postUserReminder({
        userId: user._id,
        date: newDate,
        text: selectedReminder.text,
      });

      toast.success(`Reminder snoozed for ${snoozeMinutes} minutes.`);
      closeModal();
      fetchUserReminders();
    } catch (error) {
      toast.error("Failed to snooze reminder. Please try again.");
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
        handleSnooze={handleSnooze}
      />
    </motion.div>
  );
};

export default Calendar;
