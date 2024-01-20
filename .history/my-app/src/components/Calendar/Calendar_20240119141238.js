import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "react-modal";
import "./Calendar.css";

Modal.setAppElement("#root");

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [reminders, setReminders] = useState([]);
  const [selectedReminder, setSelectedReminder] = useState(null);

  const getMonthDays = (date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const days = [];

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(date.getFullYear(), date.getMonth(), i));
    }

    return days;
  };

  const handlePrevNextMonth = (increment) => {
    setCurrentMonth((prevMonth) => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(prevMonth.getMonth() + increment);
      return newMonth;
    });
  };

const handleDayClick = (day) => {
  const reminderText = prompt("Enter your reminder:");
  if (reminderText) {
    const reminderDate = new Date(day);
    reminderDate.setDate(reminderDate.getDate() - 1);

    const newReminders = [
      ...reminders,
      { date: reminderDate, text: reminderText },
    ];
    setReminders(newReminders);
    setSelectedReminder({ date: reminderDate, text: reminderText });
    setHasIndicator(true); // Ensure that the indicator is set when a new reminder is added
  } else {
    const existingReminder = reminders.find(
      (reminder) => reminder.date.toDateString() === day.toDateString()
    );
    if (existingReminder) {
      setSelectedReminder(existingReminder);
    }
  }
};


  const isToday = (day) => {
    const today = new Date();
    return (
      day.getMonth() === today.getMonth() && day.getDate() === today.getDate()
    );
  };

  const isWithReminder = (day) => {
    return reminders.some(
      (reminder) => reminder.date.toDateString() === day.toDateString()
    );
  };

  const openModal = (reminder) => {
    setSelectedReminder(reminder);
  };

  const closeModal = () => {
    setSelectedReminder(null);
  };

  return (
    <motion.div
      className="calendar"
      style={{ maxHeight: "300px", overflowY: "auto" }}
    >
      <div className="calendar-header">
        <motion.button onClick={() => handlePrevNextMonth(-1)}>
          &lt;
        </motion.button>
        <h2>
          {currentMonth.toLocaleString("default", { month: "long" })}{" "}
          {currentMonth.getFullYear()}
        </h2>
        <motion.button onClick={() => handlePrevNextMonth(1)}>
          &gt;
        </motion.button>
      </div>
      <div className="calendar-days">
        {getMonthDays(currentMonth).map((day) => (
          <motion.div
            key={day.toString()}
            className={`calendar-day ${
              isWithReminder(day) ? "with-reminder" : ""
            } ${isToday(day) ? "today" : ""}`}
            onClick={() => handleDayClick(day)}
          >
            <span
              onClick={() =>
                openModal({ date: day, text: "Click to view reminder" })
              }
            >
              {day.getDate()}
              {isWithReminder(day) && (
                <span className="reminder-indicator">!</span>
              )}
            </span>
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {selectedReminder && (
          <div className="reminder">
            <p>{selectedReminder.text}</p>
            <p>{selectedReminder.date?.toLocaleDateString()}</p>
            <button onClick={() => alert("Notification scheduled!")}>
              Schedule Notification
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 0 24 24"
                width="24"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
              </svg>
            </button>
            <button onClick={closeModal}>Close</button>
          </div>
        )}
      </AnimatePresence>
      <button onClick={() => alert("Notification permission requested!")}>
        Request Notification Permission
      </button>
    </motion.div>
  );
};

export default Calendar;
