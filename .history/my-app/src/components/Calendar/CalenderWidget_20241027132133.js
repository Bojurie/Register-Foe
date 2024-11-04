import React, { useState, useEffect, useCallback } from "react";
import Calendar from "react-calendar";
import { useAuth } from "../AuthContext/AuthContext";
import { toast } from "react-toastify";
import ReminderModal from "./reminderModal";
import "./CalenderWidget.css";

const CalendarWidget = () => {
  const { postUserReminder, user, getUserReminder, deleteReminder } = useAuth();
  const [reminders, setReminders] = useState([]);
  const [newReminderText, setNewReminderText] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedReminder, setSelectedReminder] = useState(null);
  const [reminderTime, setReminderTime] = useState("12:00"); // Default time
  const [userTimezone, setUserTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  // Fetch reminders on component mount or user change
  const fetchUserReminders = useCallback(async () => {
    if (!user?._id)
      return toast.error("User ID is missing. Please log in again.");

    try {
      const response = await getUserReminder({ userId: user._id });
      if (Array.isArray(response) && response.length) {
        setReminders(
          response.map((reminder) => ({
            date: new Date(reminder.date).toISOString().split("T")[0],
            time: reminder.time,
            text: reminder.text,
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
    if (user?._id) fetchUserReminders();
  }, [user, fetchUserReminders]);

  // Handle reminder save
  const handleSaveReminder = async () => {
    if (!newReminderText.trim())
      return toast.warning("Reminder text cannot be empty.");
    if (!user?._id)
      return toast.error("User ID is missing. Please log in again.");

    try {
      await postUserReminder({
        userId: user._id,
        date: selectedDate,
        time: reminderTime,
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

  // Handle reminder delete
  const handleDeleteReminder = async () => {
    if (!selectedReminder) return toast.error("No reminder selected.");

    try {
      await deleteReminder(selectedReminder._id);
      fetchUserReminders();
      toast.success("Reminder deleted successfully!");
    } catch (error) {
      console.error("Error deleting reminder:", error);
      toast.error("Failed to delete reminder. Please try again.");
    }
  };

  // Calendar day styling
  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const dateStr = date.toISOString().split("T")[0];
      if (dateStr === new Date().toISOString().split("T")[0])
        return "currentDay";
      if (reminders.some((reminder) => reminder.date === dateStr))
        return "reminderDay";
    }
    return null;
  };

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
      />
      <ReminderModal
        isOpen={Boolean(selectedDate)}
        onClose={() => setSelectedDate(null)}
        selectedReminder={selectedReminder}
        selectedDate={selectedDate}
        reminderTime={reminderTime}
        setReminderTime={setReminderTime}
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
