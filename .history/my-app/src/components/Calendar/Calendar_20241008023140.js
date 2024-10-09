import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "react-modal";
import "./Calendar.css";
import { useAuth } from "../AuthContext/AuthContext";
import { toast } from "react-toastify";

// Set up the modal accessibility for React Modal
Modal.setAppElement("#root");

// Custom modal component
const ReminderModal = ({
  isOpen,
  onClose,
  isFullModalOpen,
  isNewReminderModalOpen,
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
      className="full-screen-modal"
      overlayClassName="full-screen-modal-overlay"
      ariaHideApp={false}
    >
      <div className="full-screen-modal-content">
        {isFullModalOpen && selectedReminder && (
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
        )}

        {isNewReminderModalOpen && (
          <>
            <h2>Set Reminder for {selectedDate?.toDateString()}</h2>
            <div>
              <label>
                Enter your reminder:
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
  const [isFullModalOpen, setFullModalIsOpen] = useState(false);
  const [isNewReminderModalOpen, setNewReminderModalIsOpen] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [newReminderText, setNewReminderText] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedReminder, setSelectedReminder] = useState(null);
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(true);

  // Fetch reminders for the logged-in user
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
      toast.error("Failed to load reminders. Please try again later.");
    }
  }, [getUserReminder, user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchUserReminders();
    }
  }, [user?.id, fetchUserReminders]);

  // Open view reminder modal
  const openViewReminderModal = useCallback((reminder) => {
    setSelectedReminder(reminder);
    setFullModalIsOpen(true);
  }, []);

  // Open new reminder modal
  const openNewReminderModal = useCallback(() => {
    setNewReminderModalIsOpen(true);
  }, []);

  // Close the modal
  const closeModal = useCallback(() => {
    setFullModalIsOpen(false);
    setNewReminderModalIsOpen(false);
    setNewReminderText("");
    setSelectedReminder(null);
  }, []);

  // Save new reminder
  const handleSaveReminder = async () => {
    if (!newReminderText.trim()) {
      toast.warning("Reminder text cannot be empty.");
      return;
    }

    if (!user?.id) {
      return;
    }

    try {
      const reminderData = {
        userId: user.id,
        date: selectedDate,
        text: newReminderText,
      };
      await postUserReminder(reminderData);
      closeModal();
      fetchUserReminders();
      toast.success("Reminder added successfully!");
    } catch (error) {
      toast.error("Failed to save reminder. Please try again.");
    }
  };

  // Delete a reminder
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

  // Handle click on a day
  const handleDayClick = (day) => {
    setSelectedDate(day);
    const reminder = reminders.find(
      (reminder) =>
        new Date(reminder.date).toDateString() === day.toDateString()
    );
    reminder ? openViewReminderModal(reminder) : openNewReminderModal();
  };

  // Generate the days for the current month
  const getMonthDays = (date) => {
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return Array.from(
      { length: lastDay.getDate() },
      (_, i) => new Date(date.getFullYear(), date.getMonth(), i + 1)
    );
  };

  const monthDays = getMonthDays(currentMonth);

  // Change the month
  const handleMonthChange = (increment) => {
    setCurrentMonth(
      (prevMonth) =>
        new Date(prevMonth.getFullYear(), prevMonth.getMonth() + increment, 1)
    );
  };

  return (
    <motion.div className="calendar-wrapper">
      <motion.div
        className="calendar-header"
        onClick={() => setIsCalendarExpanded((prev) => !prev)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <h2>
          {currentMonth.toLocaleString("default", { month: "long" })}{" "}
          {currentMonth.getFullYear()}
        </h2>
        <motion.div className="month-navigation">
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
        </motion.div>
      </motion.div>

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
                    day.toDateString() === new Date().toDateString()
                      ? "today"
                      : ""
                  }`}
                  onClick={() => handleDayClick(day)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
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

      <ReminderModal
        isOpen={isFullModalOpen || isNewReminderModalOpen}
        onClose={closeModal}
        isFullModalOpen={isFullModalOpen}
        isNewReminderModalOpen={isNewReminderModalOpen}
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
