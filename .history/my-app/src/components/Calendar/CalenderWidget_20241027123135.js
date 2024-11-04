// CalendarWidget.jsx

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Modal from "react-modal";
import styles from "./CalendarWidget.module.css"; // Import CSS module
import ReminderModal from "./ReminderModal";
import { useAuth } from "../AuthContext/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";

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
    if (!apiKey) return console.error("API key missing.");

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
        console.error("Unable to fetch timezone.");
      }
    } catch (error) {
      console.error("Error fetching timezone:", error);
    }
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) =>
          fetchUserTimezone(
            position.coords.latitude,
            position.coords.longitude
          ),
        (error) => toast.error("Location access needed for timezone accuracy.")
      );
    }
  }, []);

  const fetchUserReminders = useCallback(async () => {
    if (!user?._id) return toast.error("User ID missing. Please log in again.");

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
        toast.info("No reminders found.");
      }
    } catch (error) {
      console.error("Error fetching reminders:", error);
      toast.error("Could not load reminders.");
    }
  }, [getUserReminder, user?._id]);

  useEffect(() => {
    if (user?._id) fetchUserReminders();
  }, [user, fetchUserReminders]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const reminder = reminders.find(
      (reminder) => reminder.date.toDateString() === date.toDateString()
    );
    setSelectedReminder(reminder);
  };

  const handleSaveReminder = async () => {
    if (!newReminderText.trim())
      return toast.warning("Reminder text cannot be empty.");
    if (!user?._id) return toast.error("User ID missing. Please log in again.");

    try {
      await postUserReminder({
        userId: user._id,
        date: selectedDate,
        text: newReminderText,
      });
      fetchUserReminders();
      setNewReminderText("");
      toast.success("Reminder added.");
    } catch (error) {
      console.error("Error saving reminder:", error);
      toast.error("Failed to save reminder.");
    }
  };

  const handleDeleteReminder = async () => {
    if (!selectedReminder) return toast.error("No reminder selected.");

    try {
      await deleteReminder(selectedReminder._id);
      fetchUserReminders();
      toast.success("Reminder deleted.");
    } catch (error) {
      console.error("Error deleting reminder:", error);
      toast.error("Could not delete reminder.");
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
          No reminders found.
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
