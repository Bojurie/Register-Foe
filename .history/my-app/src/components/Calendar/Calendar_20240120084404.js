import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "react-modal";
import "./Calendar.css";
import { useAuth } from "../AuthContext/AuthContext";

Modal.setAppElement("#root");

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isFullModalOpen, setFullModalIsOpen] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState(
    Notification.permission
  );
  const [newReminderText, setNewReminderText] = useState("");
  const [datesWithReminders, setDatesWithReminders] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedReminder, setSelectedReminder] = useState(null);
  const { postUserReminder, user, getUserReminder } = useAuth();

  const getMonthDays = (date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const days = [];

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(date.getFullYear(), date.getMonth(), i));
    }

    return days;
  };

  useEffect(() => {
    if (selectedDate) {
      getSavedReminder();
    }
  }, [selectedDate]);

  const getSavedReminder = async () => {
    try {
      const response = await getUserReminder();
      console.log("User Reminder Data:", response);

      const savedReminder = response.find(
        (reminder) => reminder.date === selectedDate.toDateString()
      );
      setSelectedReminder(savedReminder);
      setDatesWithReminders(
        response.map((reminder) => new Date(reminder.date))
      );
    } catch (error) {
      console.error("Error getting saved reminder:", error.message);
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth((prevMonth) => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(prevMonth.getMonth() - 1);
      return newMonth;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth((prevMonth) => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(prevMonth.getMonth() + 1);
      return newMonth;
    });
  };

  const handleDayClick = (day) => {
    setNewReminderText("");
    setSelectedReminder(null);
    setSelectedDate(day);
    setFullModalIsOpen(true);
  };

  const handleSaveReminder = async () => {
    try {
      await postUserReminder({
        userId: user?.id,
        date: selectedDate,
        text: newReminderText,
      });

      setDatesWithReminders((prevDates) => [...prevDates, selectedDate]);
      setFullModalIsOpen(false);
      getSavedReminder();
    } catch (error) {
      console.error("Error saving reminder:", error.message);
    }
  };

  const monthDays = getMonthDays(currentMonth);
  const today = new Date();

  const requestNotificationPermission = async () => {
    if (Notification.permission !== "granted") {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    }
  };

  return (
    <motion.div className="calendar">
      <div className="calendar-header">
        <motion.button onClick={handlePrevMonth}>&lt;</motion.button>
        <h2>
          {currentMonth.toLocaleString("default", { month: "long" })}{" "}
          {currentMonth.getFullYear()}
        </h2>
        <motion.button onClick={handleNextMonth}>&gt;</motion.button>
      </div>
      <div className="calendar-days">
        {monthDays.map((day) => {
          const hasReminder = datesWithReminders.some(
            (date) => date.toDateString() === day.toDateString()
          );
          const remindersForDay = reminders.filter(
            (reminder) => reminder.date === day.toDateString()
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
              </span>
            </motion.div>
          );
        })}
      </div>
      <AnimatePresence>
        {selectedDate && (
          <Modal
            isOpen={isFullModalOpen}
            onRequestClose={() => setFullModalIsOpen(false)}
            className="full-screen-modal"
            overlayClassName="full-screen-modal-overlay"
          >
            <div className="full-screen-modal-content">
              <h2>{selectedDate.toDateString()}</h2>
              {selectedReminder ? (
                <div>
                  <p>{selectedReminder.text}</p>
                  <p>{selectedReminder.date?.toLocaleDateString()}</p>
                </div>
              ) : (
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
              )}
              {/* Display reminders for the selected date */}
              <div>
                <h3>Reminders for {selectedDate.toDateString()}</h3>
                <ul>
                  {remindersForDay.map((reminder) => (
                    <li key={reminder.id}>{reminder.text}</li>
                  ))}
                </ul>
              </div>
              <button onClick={() => setFullModalIsOpen(false)}>Close</button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      <button onClick={requestNotificationPermission}>
        Request Notification Permission
      </button>
    </motion.div>
  );
};

export default Calendar;
