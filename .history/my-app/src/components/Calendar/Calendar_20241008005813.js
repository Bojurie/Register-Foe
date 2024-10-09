import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "react-modal";
import "./Calendar.css";
import { useAuth } from "../AuthContext/AuthContext";
import { toast } from "react-toastify";

Modal.setAppElement("#root");

const Calendar = () => {
  const { postUserReminder, user, getUserReminder, deleteReminder } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isFullModalOpen, setFullModalIsOpen] = useState(false);
  const [isNewReminderModalOpen, setNewReminderModalIsOpen] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [newReminderText, setNewReminderText] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedReminder, setSelectedReminder] = useState(null);
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(true);

  const fetchUserReminders = useCallback(async () => {
    if (!user?.id) {
      console.warn("User ID is not available. Skipping reminder fetch.");
      return;
    }

    try {
      const response = await getUserReminder({ userId: user.id });
      setReminders(
        response.filter((reminder) => new Date(reminder.date) >= new Date())
      );
    } catch (error) {
      console.error("Error fetching user reminders:", error.message);
      toast.error("Failed to load reminders. Please try again later.");
    }
  }, [getUserReminder, user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchUserReminders();
    }
  }, [user?.id, fetchUserReminders]);

  useEffect(() => {
    if (selectedDate) {
      const reminder = reminders.find(
        (reminder) =>
          new Date(reminder.date).toDateString() === selectedDate.toDateString()
      );
      setSelectedReminder(reminder);
    }
  }, [selectedDate, reminders]);

  const getMonthDays = (date) => {
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return Array.from(
      { length: lastDay.getDate() },
      (_, i) => new Date(date.getFullYear(), date.getMonth(), i + 1)
    );
  };

  const handleMonthChange = (increment) => {
    setCurrentMonth(
      (prevMonth) =>
        new Date(prevMonth.getFullYear(), prevMonth.getMonth() + increment, 1)
    );
  };

  const handleDayClick = (day) => {
    if (day < new Date().setHours(0, 0, 0, 0)) {
      return;
    }
    setNewReminderText("");
    setSelectedDate(day);

    const reminder = reminders.find(
      (reminder) =>
        new Date(reminder.date).toDateString() === day.toDateString()
    );

    if (reminder) {
      openViewReminderModal(reminder);
    } else {
      openNewReminderModal();
    }
  };

  const openViewReminderModal = (reminder) => {
    setSelectedReminder(reminder);
    setFullModalIsOpen(true);
  };

  const openNewReminderModal = () => {
    setNewReminderModalIsOpen(true);
  };

  const handleSaveReminder = async () => {
    if (!newReminderText.trim()) {
      toast.warning("Reminder text cannot be empty.");
      return;
    }

    if (!user?.id) {
      console.error("User ID is not available. Cannot save reminder.");
      return;
    }

    try {
      const reminderData = {
        userId: user.id,
        date: selectedDate,
        text: newReminderText,
        createdBy: user.role,
      };
      await postUserReminder(reminderData);
      setNewReminderModalIsOpen(false);
      fetchUserReminders();
      toast.success("Reminder added successfully!");
    } catch (error) {
      console.error("Error saving reminder:", error.message);
      toast.error("Failed to save reminder. Please try again.");
    }
  };

  const handleDeleteReminder = async () => {
    if (!selectedReminder) {
      console.error("Selected reminder is undefined or null");
      return;
    }

    try {
      await deleteReminder(selectedReminder.id);
      setFullModalIsOpen(false);
      fetchUserReminders();
      toast.success("Reminder deleted successfully!");
    } catch (error) {
      console.error("Error deleting reminder:", error.message);
      toast.error("Failed to delete reminder. Please try again.");
    }
  };

  const monthDays = getMonthDays(currentMonth);
  const today = new Date();

  const toggleCalendarVisibility = () => {
    setIsCalendarExpanded((prevState) => !prevState);
  };

  return (
    <motion.div className="calendar-wrapper">
      <div className="calendar-header" onClick={toggleCalendarVisibility}>
        <h2 style={{ cursor: "pointer" }}>
          {isCalendarExpanded ? " " : ""}
          {currentMonth.toLocaleString("default", { month: "long" })}{" "}
          {currentMonth.getFullYear()}
        </h2>
        {isCalendarExpanded && (
          <div className="month-navigation">
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                handleMonthChange(-1);
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              &lt;
            </motion.button>
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                handleMonthChange(1);
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              &gt;
            </motion.button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isCalendarExpanded && (
          <motion.div
            className="calendar-days"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
          >
            {monthDays.map((day) => {
              const hasReminder = reminders.some(
                (reminder) =>
                  new Date(reminder.date).toDateString() === day.toDateString()
              );

              return (
                <motion.div
                  key={day.toString()}
                  className={`calendar-day ${
                    hasReminder ? "with-reminder" : ""
                  } ${
                    day.toDateString() === today.toDateString() ? "today" : ""
                  }`}
                  onClick={() => handleDayClick(day)}
                >
                  <span>
                    {day.getDate()}
                    {hasReminder && (
                      <span className="reminder-indicator">!</span>
                    )}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <Modal
        isOpen={isFullModalOpen || isNewReminderModalOpen}
        onRequestClose={() => {
          setFullModalIsOpen(false);
          setNewReminderModalIsOpen(false);
        }}
        className="full-screen-modal"
        overlayClassName="full-screen-modal-overlay"
      >
        <div className="full-screen-modal-content">
          {isFullModalOpen && selectedReminder && (
            <>
              <h2>{selectedDate?.toDateString()}</h2>
              <div>
                <p>{selectedReminder.text}</p>
                <p>{new Date(selectedReminder.date).toLocaleDateString()}</p>
              </div>
              <button onClick={handleDeleteReminder}>Delete Reminder</button>
            </>
          )}

          {isNewReminderModalOpen && (
            <>
              <h2>{selectedDate?.toDateString()}</h2>
              <div>
                <label>
                  Enter your reminder:
                  <input
                    type="text"
                    value={newReminderText}
                    onChange={(e) => setNewReminderText(e.target.value)}
                  />
                </label>
                <button onClick={handleSaveReminder}>Save Reminder</button>
              </div>
            </>
          )}
          <button
            onClick={() => {
              setFullModalIsOpen(false);
              setNewReminderModalIsOpen(false);
            }}
          >
            Close
          </button>
        </div>
      </Modal>
    </motion.div>
  );
};

export default Calendar;
