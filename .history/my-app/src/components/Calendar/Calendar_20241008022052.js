import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "react-modal";
import "./Calendar.css";
import { useAuth } from "../AuthContext/AuthContext";
import { toast } from "react-toastify";

// Custom modal component with logs
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
  console.log("Modal isOpen:", isOpen); // Check if modal should be open

  return (
    <Modal
      isOpen={isOpen} // Modal should open when isOpen is true
      onRequestClose={onClose}
      className="full-screen-modal"
      overlayClassName="full-screen-modal-overlay"
      ariaHideApp={false} // For accessibility
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
      console.log("Fetching reminders for user:", user.id);
      const response = await getUserReminder({ userId: user.id });
      setReminders(
        response.filter((reminder) => new Date(reminder.date) >= new Date())
      );
      console.log("Fetched reminders:", response);
    } catch (error) {
      toast.error("Failed to load reminders. Please try again later.");
      console.error("Error fetching user reminders:", error.message);
    }
  }, [getUserReminder, user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchUserReminders();
    }
  }, [user?.id, fetchUserReminders]);

  // Open view reminder modal
  const openViewReminderModal = useCallback((reminder) => {
    console.log("Opening view modal for reminder:", reminder);
    setSelectedReminder(reminder);
    setFullModalIsOpen(true); // Modal should open here
  }, []);

  // Open new reminder modal
  const openNewReminderModal = useCallback(() => {
    console.log("Opening new reminder modal");
    setNewReminderModalIsOpen(true); // Modal should open here
  }, []);

  // Close the modal
  const closeModal = useCallback(() => {
    console.log("Closing modal");
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
      console.error("User ID is not available. Cannot save reminder.");
      return;
    }

    try {
      const reminderData = {
        userId: user.id,
        date: selectedDate,
        text: newReminderText,
      };
      console.log("Saving new reminder:", reminderData);
      await postUserReminder(reminderData);
      closeModal();
      fetchUserReminders();
      toast.success("Reminder added successfully!");
    } catch (error) {
      toast.error("Failed to save reminder. Please try again.");
      console.error("Error saving reminder:", error.message);
    }
  };

  // Delete a reminder
  const handleDeleteReminder = async () => {
    if (!selectedReminder) return;

    try {
      console.log("Deleting reminder:", selectedReminder);
      await deleteReminder(selectedReminder.id);
      closeModal();
      fetchUserReminders();
      toast.success("Reminder deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete reminder. Please try again.");
      console.error("Error deleting reminder:", error.message);
    }
  };

  // Handle click on a day
  const handleDayClick = (day) => {
    console.log("Clicked day:", day);
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
    console.log("Changing month by:", increment);
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
        isOpen={isFullModalOpen || isNewReminderModalOpen} // Check if modal is open
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
