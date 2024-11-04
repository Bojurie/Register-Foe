import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Modal from "react-modal";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from './CalendarWidget.module.css'
import { useAuth } from "../AuthContext/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import './Calendar.css'
const ReminderModal = ({
  isOpen,
  onClose,
  selectedReminder,
  selectedDate,
  handleSaveReminder,
  handleDeleteReminder,
  newReminderText,
  setNewReminderText,
  handleSnooze,
  userTimezone,
}) => {
  const formattedDate = selectedDate
    ? new Intl.DateTimeFormat("default", {
        dateStyle: "full",
        timeStyle: "short",
        timeZone: userTimezone,
      }).format(selectedDate)
    : "";

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={styles.modalContent}
      overlayClassName={styles.modalOverlay}
      ariaHideApp={false}
    >
      <div>
        {selectedReminder ? (
          <>
            <h2>Reminder for {formattedDate}</h2>
            <div>
              <p>{selectedReminder.text}</p>
              <p>{formattedDate}</p>
            </div>
            <div className={styles.reminderActions}>
              <label>
                Snooze for:
                <select onChange={handleSnooze}>
                  <option value="5">5 minutes</option>
                  <option value="10">10 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="1440">1 day</option>
                </select>
              </label>
              <motion.button
                onClick={handleDeleteReminder}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Dismiss Reminder
              </motion.button>
            </div>
          </>
        ) : (
          <>
            <h2>Add Reminder for {formattedDate}</h2>
            <div>
              <label>
                Reminder:
                <input
                  type="text"
                  value={newReminderText}
                  onChange={(e) => setNewReminderText(e.target.value)}
                  placeholder="Enter your reminder"
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

const CalendarWidget = () => {
  const { postUserReminder, user, getUserReminder, deleteReminder } = useAuth();
  const [reminders, setReminders] = useState([]);
  const [newReminderText, setNewReminderText] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedReminder, setSelectedReminder] = useState(null);
  const [noReminders, setNoReminders] = useState(false);
  const [userTimezone, setUserTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  const fetchUserTimezone = async (latitude, longitude) => {
    const apiKey = process.env.REACT_APP_OPENCAGE_API_KEY;
    if (!apiKey) {
      console.error("OpenCage API key is missing.");
      return;
    }

    try {
      const response = await axios.get(
        "https://api.opencagedata.com/geocode/v1/json",
        {
          params: {
            q: `${latitude},${longitude}`,
            key: apiKey,
            language: "en",
          },
        }
      );

      if (response.data.results?.length) {
        setUserTimezone(response.data.results[0].annotations.timezone.name);
      } else {
        console.error("Unable to fetch timezone details.");
      }
    } catch (error) {
      console.error("Error fetching timezone:", error);
    }
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchUserTimezone(latitude, longitude);
        },
        (error) => {
          console.error("Error fetching location:", error);
          toast.error("Location access is required for accurate timezone.");
        }
      );
    }
  }, []);

  const fetchUserReminders = useCallback(async () => {
    if (!user?._id) {
      toast.error("User ID is missing. Please log in again.");
      return;
    }

    try {
      const response = await getUserReminder({ userId: user._id });
      if (response?.length) {
        setReminders(
          response.map((reminder) => ({
            ...reminder,
            date: new Date(reminder.date),
          }))
        );
        setNoReminders(false);
      } else {
        setReminders([]);
        setNoReminders(true);
        toast.info("No reminders found for this user.");
      }
    } catch (error) {
      console.error("Error fetching reminders:", error);
      toast.error("Failed to load reminders. Please try again later.");
    }
  }, [getUserReminder, user?._id]);

  useEffect(() => {
    if (user?._id) {
      fetchUserReminders();
    }
  }, [user, fetchUserReminders]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const reminder = reminders.find(
      (reminder) => reminder.date.toDateString() === date.toDateString()
    );
    setSelectedReminder(reminder);
  };

  const handleSaveReminder = async () => {
    if (!newReminderText.trim()) {
      toast.warning("Reminder text cannot be empty.");
      return;
    }

    if (!user?._id) {
      toast.error("User ID is missing. Please log in again.");
      return;
    }

    try {
      await postUserReminder({
        userId: user._id,
        date: selectedDate,
        text: newReminderText,
      });
      fetchUserReminders();
      setNewReminderText("");
      toast.success("Reminder added successfully!");
    } catch (error) {
      console.error("Error saving reminder:", error);
      toast.error("Failed to save reminder. Please try again.");
    }
  };

  const handleDeleteReminder = async () => {
    if (!selectedReminder) {
      toast.error("No reminder selected.");
      return;
    }

    try {
      await deleteReminder(selectedReminder._id);
      fetchUserReminders();
      toast.success("Reminder deleted successfully!");
    } catch (error) {
      console.error("Error deleting reminder:", error);
      toast.error("Failed to delete reminder. Please try again.");
    }
  };

  return (
    <div className={styles.calendarWidget}>
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        tileClassName={({ date }) =>
          reminders.some(
            (reminder) => reminder.date.toDateString() === date.toDateString()
          )
            ? styles.hasReminder
            : null
        }
      />
      {noReminders && (
        <motion.p className={styles.noRemindersText}>
          No reminders found for this user.
        </motion.p>
      )}
      <ReminderModal
        isOpen={Boolean(selectedDate)}
        onClose={() => setSelectedDate(null)}
        selectedReminder={selectedReminder}
        selectedDate={selectedDate}
        handleSaveReminder={handleSaveReminder}
        handleDeleteReminder={handleDeleteReminder}
        newReminderText={newReminderText}
        setNewReminderText={setNewReminderText}
        userTimezone={userTimezone}
      />
    </div>
  );
};

export default CalendarWidget;
