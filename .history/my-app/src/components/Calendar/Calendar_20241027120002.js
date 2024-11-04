import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Modal from "react-modal";
import axios from "axios";
import { useAuth } from "../AuthContext/AuthContext";
import { toast } from "react-toastify";
import "./Calendar.css";

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
      className="full-screen-modal-content"
      overlayClassName="full-screen-modal-overlay"
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
            <div className="reminder-actions">
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

const Calendar = () => {
  const { postUserReminder, user, getUserReminder, deleteReminder } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isModalOpen, setModalOpen] = useState(false);
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

  const today = new Date(
    new Intl.DateTimeFormat("en-US", { timeZone: userTimezone }).format(
      new Date()
    )
  );

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

  const handleDayClick = (day) => {
    const selectedDay = day.setHours(0, 0, 0, 0);

    if (selectedDay < today.setHours(0, 0, 0, 0)) {
      toast.warning("You cannot set reminders for past dates.");
      return;
    }

    setSelectedDate(day);
    const reminder = reminders.find(
      (reminder) => reminder.date.toDateString() === day.toDateString()
    );
    setSelectedReminder(reminder);
    setModalOpen(true);
  };

  const monthDays = Array.from(
    {
      length: new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        0
      ).getDate(),
    },
    (_, i) =>
      new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1)
  );

  return (
    <motion.div className="calendar-wrapper">
      <div className="calendar-header">
        <h2>
          {today.toLocaleString("default", { month: "long" })}{" "}
          {today.getFullYear()}
        </h2>
        <p>Upcoming Reminders: {reminders.length}</p>
      </div>

      <motion.div className="calendar-days">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="calendar-day-header">
            {day}
          </div>
        ))}
        {monthDays.map((day) => {
          const hasReminder = reminders.some(
            (reminder) => reminder.date.toDateString() === day.toDateString()
          );
          return (
            <motion.div
              key={day.toString()}
              className={`calendar-day ${hasReminder ? "with-reminder" : ""} ${
                day.toDateString() === today.toDateString() ? "today" : ""
              }`}
              onClick={() => handleDayClick(day)}
            >
              {day.getDate()}
            </motion.div>
          );
        })}
      </motion.div>

      {noReminders && (
        <motion.p className="no-reminders-text">
          No reminders found for this user.
        </motion.p>
      )}

      <ReminderModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        selectedReminder={selectedReminder}
        selectedDate={selectedDate}
        handleSaveReminder={() => {}}
        handleDeleteReminder={() => {}}
        newReminderText={newReminderText}
        setNewReminderText={setNewReminderText}
        handleSnooze={() => {}}
        userTimezone={userTimezone}
      />
    </motion.div>
  );
};

export default Calendar;
