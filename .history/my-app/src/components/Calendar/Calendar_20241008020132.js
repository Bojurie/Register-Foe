import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "react-modal";
import "./Calendar.css";
import { useAuth } from "../AuthContext/AuthContext";
import { toast } from "react-toastify";

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
}) => (
  <Modal
    isOpen={isOpen} // Modal should open when this is true
    onRequestClose={onClose}
    className="full-screen-modal"
    overlayClassName="full-screen-modal-overlay"
    ariaHideApp={false}
  >
    <div className="full-screen-modal-content">
      {isFullModalOpen && selectedReminder && (
        <>
          <h2>{selectedDate?.toDateString()}</h2>
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
    if (!user?.id) return;

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
    if (user?.id) fetchUserReminders();
  }, [user?.id, fetchUserReminders]);

  const openViewReminderModal = useCallback((reminder) => {
    setSelectedReminder(reminder);
    setFullModalIsOpen(true); // Modal should open here
  }, []);

  const openNewReminderModal = useCallback(() => {
    setNewReminderModalIsOpen(true); // Modal should open here
  }, []);

  const closeModal = useCallback(() => {
    setFullModalIsOpen(false);
    setNewReminderModalIsOpen(false);
    setNewReminderText("");
    setSelectedReminder(null);
  }, []);

  const handleSaveReminder = async () => {
    if (!newReminderText.trim()) {
      toast.warning("Reminder text cannot be empty.");
      return;
    }

    if (!user?.id) return;

    try {
      const reminderData = {
        userId: user.id,
        date: selectedDate,
        text: newReminderText,
        createdBy: user.role,
      };
      await postUserReminder(reminderData);
      closeModal();
      fetchUserReminders();
      toast.success("Reminder added successfully!");
    } catch (error) {
      toast.error("Failed to save reminder. Please try again.");
    }
  };

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

  const handleDayClick = (day) => {
    setSelectedDate(day);
    const reminder = reminders.find(
      (reminder) =>
        new Date(reminder.date).toDateString() === day.toDateString()
    );
    reminder ? openViewReminderModal(reminder) : openNewReminderModal();
  };

  const getMonthDays = (date) => {
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return Array.from(
      { length: lastDay.getDate() },
      (_, i) => new Date(date.getFullYear(), date.getMonth(), i + 1)
    );
  };

  const monthDays = getMonthDays(currentMonth);
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
        isOpen={isFullModalOpen || isNewReminderModalOpen} // This must be true when modal is open
        onClose={closeModal}
        isFullModalOpen={isFullModalOpen}
        isNewReminderModalOpen={isNewReminderModalIsOpen}
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
