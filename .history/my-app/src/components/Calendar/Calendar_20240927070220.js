import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "react-modal";
import "./Calendar.css";
import { useAuth } from "../AuthContext/AuthContext";

Modal.setAppElement("#root");

const Calendar = () => {
  const { postUserReminder, user, getUserReminder, deleteReminder } = useAuth();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isFullModalOpen, setFullModalIsOpen] = useState(false);
  const [isNewReminderModalOpen, setNewReminderModalIsOpen] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [newReminderText, setNewReminderText] = useState("");
  const [datesWithReminders, setDatesWithReminders] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedReminder, setSelectedReminder] = useState(null);

  const getMonthDays = (date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return Array.from(
      { length: lastDay.getDate() },
      (_, i) => new Date(date.getFullYear(), date.getMonth(), i + 1)
    );
  };

  useEffect(() => {
    const fetchUserReminders = async () => {
      try {
        const response = await getUserReminder({ userId: user?.id });
        setReminders(response);
        setDatesWithReminders(
          response.map((reminder) => new Date(reminder.date))
        );
      } catch (error) {
        console.error("Error fetching user reminders:", error.message);
      }
    };

    if (user) {
      fetchUserReminders();
    }
  }, [user]);

  useEffect(() => {
    if (selectedDate) {
      getSavedReminder();
    }
  }, [selectedDate]);

  const getSavedReminder = async () => {
    try {
      const response = await getUserReminder({ userId: user?.id });
      const savedReminder = response.find(
        (reminder) => reminder.date === selectedDate.toDateString()
      );
      setSelectedReminder(savedReminder);
    } catch (error) {
      console.error("Error getting saved reminder:", error.message);
    }
  };

  const handleMonthChange = (increment) =>
    setCurrentMonth(
      (prevMonth) =>
        new Date(prevMonth.getFullYear(), prevMonth.getMonth() + increment, 1)
    );

  const handleDayClick = (day) => {
    setNewReminderText("");
    setSelectedReminder(null);
    setSelectedDate(day);

    const hasReminder = datesWithReminders.some(
      (date) => date.toDateString() === day.toDateString()
    );

    if (hasReminder) {
      openViewReminderModal(day);
    } else {
      openNewReminderModal();
    }
  };

  const openViewReminderModal = (day) => {
    setFullModalIsOpen(true);
    const remindersForDay = reminders.filter(
      (reminder) => reminder.date === day.toDateString()
    );
    setSelectedReminder(remindersForDay[0]);
  };

  const openNewReminderModal = () => {
    setNewReminderModalIsOpen(true);
  };

  const handleSaveReminder = async () => {
    try {
      const reminderData = {
        userId: user?.id,
        date: selectedDate,
        text: newReminderText,
        createdBy: user.role, 
      };
      await postUserReminder(reminderData);
      setDatesWithReminders((prevDates) => [...prevDates, selectedDate]);
      setNewReminderModalIsOpen(false);
      getSavedReminder();
    } catch (error) {
      console.error("Error saving reminder:", error.message);
    }
  };

  const handleDeleteReminder = async () => {
    try {
      if (!selectedReminder) {
        console.error("Selected reminder is undefined or null");
        return;
      }
      await deleteReminder(selectedReminder.id);
      setFullModalIsOpen(false);
      getSavedReminder();
    } catch (error) {
      console.error("Error deleting reminder:", error.message);
    }
  };

  const monthDays = getMonthDays(currentMonth);
  const today = new Date();

  const remindersForDay = reminders.filter(
    (reminder) => reminder.date === selectedDate?.toDateString()
  );

  const getReminderColor = (reminder) => {
    if (reminder.createdBy === "admin" || reminder.createdBy === "company") {
      return "admin-reminder"; 
    }
    return "user-reminder"; 
  };

  return (
    <motion.div className="calendar">
      <div className="calendar-header">
        <motion.button onClick={() => handleMonthChange(-1)}>
          &lt;
        </motion.button>
        <h1>
          {currentMonth.toLocaleString("default", { month: "long" })}{" "}
          {currentMonth.getFullYear()}
        </h1>
        <motion.button onClick={() => handleMonthChange(1)}>&gt;</motion.button>
      </div>
      <div className="calendar-days">
        {monthDays.map((day) => {
          const hasReminder = datesWithReminders.some(
            (date) => date.toDateString() === day.toDateString()
          );

          return (
            <motion.div
              key={day.toString()}
              className={`calendar-day ${hasReminder ? "with-reminder" : ""} ${
                day.getMonth() === today.getMonth() &&
                day.getDate() === today.getDate()
                  ? "today"
                  : ""
              }`}
              onClick={() => handleDayClick(day)}
            >
              <span>
                {day.getDate()}
                {hasReminder && <span className="reminder-indicator">!</span>}
                {remindersForDay.map((reminder) => (
                  <div key={reminder.id} className={getReminderColor(reminder)}>
                    {reminder.text}
                  </div>
                ))}
              </span>
            </motion.div>
          );
        })}
      </div>
      <AnimatePresence>
        {selectedDate && selectedReminder && (
          <Modal
            isOpen={isFullModalOpen}
            onRequestClose={() => setFullModalIsOpen(false)}
            className="full-screen-modal"
            overlayClassName="full-screen-modal-overlay"
          >
            <div className="full-screen-modal-content">
              <h2>{selectedDate.toDateString()}</h2>
              <div>
                <p>{selectedReminder.text}</p>
                <p>{selectedReminder.date?.toLocaleDateString()}</p>
              </div>
              <button onClick={handleDeleteReminder}>Delete Reminder</button>
              <button onClick={() => setFullModalIsOpen(false)}>Close</button>
            </div>
          </Modal>
        )}

        {selectedDate && !selectedReminder && (
          <Modal
            isOpen={isNewReminderModalOpen}
            onRequestClose={() => setNewReminderModalIsOpen(false)}
            className="full-screen-modal"
            overlayClassName="full-screen-modal-overlay"
          >
            <div className="full-screen-modal-content">
              <h2>{selectedDate.toDateString()}</h2>
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
              <button onClick={() => setNewReminderModalIsOpen(false)}>
                Close
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Calendar;
