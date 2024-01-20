import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Calendar.css";

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [reminders, setReminders] = useState([]);
  const [notificationPermission, setNotificationPermission] = useState(
    Notification.permission
  );
  const [selectedDate, setSelectedDate] = useState(null);

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

    const handleDateIndicatorClick = (day) => {
      setSelectedDate(day);
    };

    const closeReminderModal = () => {
      setSelectedDate(null);
    };
  const handleDayClick = (day) => {
    const reminderDate = new Date(day);
    reminderDate.setDate(reminderDate.getDate() - 1);

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
        icon: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' fill='%23000' viewBox='0 0 24 24' width='24' height='24'><path d='M0 0h24v24H0z' fill='none'/><path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z'/></svg>",
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
              reminders.some(
                (reminder) =>
                  reminder.date.toDateString() === day.toDateString()
              )
                ? "with-reminder"
                : ""
            } ${
              day.getMonth() === today.getMonth() &&
              day.getDate() === today.getDate()
                ? "today"
                : ""
            }`}
            onClick={() => handleDateIndicatorClick(day)}
          >
            {day.getDate()}
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {/* Display the reminder modal only if a date is selected */}
        {selectedDate && (
          <motion.div
            key="reminder-modal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="reminder-modal"
          >
            {/* Display the reminder for the selected date */}
            {reminders
              .filter(
                (reminder) =>
                  reminder.date.toDateString() === selectedDate.toDateString()
              )
              .map((reminder) => (
                <div key={reminder.date.toString()}>
                  <p>{reminder.text}</p>
                  <p>{reminder.date.toLocaleDateString()}</p>
                  <button onClick={() => scheduleNotification(reminder)}>
                    Schedule Notification
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24"
                      viewBox="0 0 24 24"
                      width="24"
                    >
                      {/* ... (unchanged) */}
                    </svg>
                  </button>
                </div>
              ))}
            <button onClick={closeReminderModal}>Close</button>
          </motion.div>
        )}
      </AnimatePresence>
      <button onClick={requestNotificationPermission}>
        Request Notification Permission
      </button>
    </motion.div>
  );
};

export default Calendar;