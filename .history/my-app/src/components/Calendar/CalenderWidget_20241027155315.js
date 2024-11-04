import React, { useState, useEffect, useCallback } from "react";
import Calendar from "react-calendar";
import Modal from "react-modal";
import { motion } from "framer-motion";
import { useAuth } from "../AuthContext/AuthContext";
import { toast } from "react-toastify";
import "./CalendarWidget.css";
import ReminderModal from "./reminderModal";

const CalendarWidget = () => {
  const { postUserReminder, user, getUserReminder, deleteReminder } = useAuth();
  const [reminders, setReminders] = useState([]);
  const [newReminderText, setNewReminderText] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedReminder, setSelectedReminder] = useState(null);
  const [userTimezone, setUserTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  const fetchUserReminders = useCallback(async () => {
    if (!user?._id) {
      toast.error("User ID is missing. Please log in again.");
      return;
    }

    try {
      const response = await getUserReminder({ userId: user._id });
      if (Array.isArray(response) && response.length) {
        setReminders(
          response.map((reminder) => ({
            date: new Date(reminder.date).toISOString().split("T")[0],
            text: reminder.text,
            id: reminder._id,
          }))
        );
      } else {
        setReminders([]);
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
      setSelectedDate(null); // Close modal after saving
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
      await deleteReminder(selectedReminder.id);
      fetchUserReminders();
      setSelectedDate(null); // Close modal after deleting
      toast.success("Reminder deleted successfully!");
    } catch (error) {
      console.error("Error deleting reminder:", error);
      toast.error("Failed to delete reminder. Please try again.");
    }
  };

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const dateStr = date.toISOString().split("T")[0];
      if (dateStr === new Date().toISOString().split("T")[0]) {
        return "currentDay";
      }
      if (reminders.some((reminder) => reminder.date === dateStr)) {
        return "reminderDay";
      }
    }
    return null;
  };

  const disablePastDates = ({ date }) => date < new Date();

  return (
    <div className="calendarWidget">
      <Calendar
        onClickDay={(date) => {
          const dateStr = date.toISOString().split("T")[0];
          setSelectedDate(dateStr);
          const reminder = reminders.find((r) => r.date === dateStr);
          setSelectedReminder(reminder);
        }}
        tileClassName={tileClassName}
        tileDisabled={disablePastDates}
      />
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
