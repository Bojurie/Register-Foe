import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Calendar.css";

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [reminders, setReminders] = useState([]);
  const [notificationPermission, setNotificationPermission] = useState(
    Notification.permission
  );

  const getMonthDays = (date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const days = [];

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(date.getFullYear(), date.getMonth(), i));
    }

    return days;
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
    const reminderDate = new Date(day);
    reminderDate.setDate(reminderDate.getDate() - 1); // Set reminder 1 day before

    const reminderText = prompt("Enter your reminder:");
    if (reminderText) {
      setReminders([...reminders, { date: reminderDate, text: reminderText }]);
      setNotificationPermission(Notification.permission);
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

  const scheduleNotification = (reminder) => {
    if (notificationPermission === "granted") {
      const notification = new Notification("Reminder", {
        body: reminder.text,
        icon: "/path/to/your/icon.png", 
      });

      setTimeout(notification.close.bind(notification), 5000); 
    }
  };

  return (
    <motion.div
      className="calendar"
      style={{ maxHeight: "300px", overflowY: "auto" }}
    >
      <div className="calendar-header">
        <motion.button onClick={handlePrevMonth}>&lt;</motion.button>
        <h2>
          {currentMonth.toLocaleString("default", { month: "long" })}{" "}
          {currentMonth.getFullYear()}
        </h2>
        <motion.button onClick={handleNextMonth}>&gt;</motion.button>
      </div>
      <div className="calendar-days">
        {monthDays.map((day) => (
          <motion.div
            key={day.toString()}
            className={`calendar-day ${
              day.getMonth() === today.getMonth() &&
              day.getDate() === today.getDate()
                ? "today"
                : ""
            }`}
            onClick={() => handleDayClick(day)}
          >
            {day.getDate()}
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {reminders.map((reminder) => {
          return (
            <motion.div
              key={reminder.date.toString()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="reminder"
            >
              <p>{reminder.text}</p>
              <p>{reminder.date.toLocaleDateString()}</p>
              <button onClick={() => scheduleNotification(reminder)}>
                Schedule Notification
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
      <button onClick={requestNotificationPermission}>
        Request Notification Permission
      </button>
    </motion.div>
  );
};

export default Calendar;
