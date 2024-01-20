import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "react-modal";
import "./Calendar.css";
import { useAuth } from "../AuthContext/AuthContext";

Modal.setAppElement("#root");

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [reminders, setReminders] = useState([]);
  const [hasIndicator, setHasIndicator] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState(
    Notification.permission
  ); 
  const [newReminderText, setNewReminderText] = useState(""); 

  const [selectedDate, setSelectedDate] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState(null);
  const { postUserReminder , user, getUserReminder} = useAuth();

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

const handleDayClick = async (day) => {
  const reminderDate = new Date(day);

  try {
    const { data } = await getUserReminder(reminderDate);
    const clickedDateReminders = data;

    if (clickedDateReminders.length > 0) {
      setReminders(clickedDateReminders);
      setSelectedReminder(clickedDateReminders[0]);
    } else {
      setNewReminderText("");
      setSelectedReminder(null);
    }

    setSelectedDate(day);
    setFullModalIsOpen(true); // Use a different state for full-screen modal
  } catch (error) {
    console.error("Error in handleDayClick:", error.message);
  }
};




const handleSaveReminder = async () => {
  try {
    await postUserReminder({
      userId: user?.id,
      date: selectedDate,
      text: newReminderText,
    });
    const updatedReminders = await getUserReminder(selectedDate);
    setReminders(updatedReminders);

    setModalIsOpen(false);
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

  const scheduleNotification = (reminder) => {
    if (notificationPermission === "granted") {
      const notification = new Notification("Reminder", {
        body: reminder.text,
        icon: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' fill='%23000' viewBox='0 0 24 24' width='24' height='24'><path d='M0 0h24v24H0z' fill='none'/><path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z'/></svg>",
      });

      setTimeout(notification.close.bind(notification), 5000);
    }
  };

  const openModal = (reminder) => {
    setModalIsOpen(true);
    setSelectedReminder(reminder);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedReminder(null);
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
            onClick={() => handleDayClick(day)}
          >
            <span>
              {day.getDate()}
              {hasIndicator && <span className="reminder-indicator">!</span>}
            </span>
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {selectedDate && (
          <Modal
            isOpen={fullModalIsOpen}
            onRequestClose={closeModal}
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
              <button onClick={closeModal}>Close</button>
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
