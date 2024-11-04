import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  const [reminderTime, setReminderTime] = useState("12:00");
  const [userTimezone, setUserTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  // Fetch user reminders
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
            _id: reminder._id,
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

  // Effect for fetching reminders on mount
  useEffect(() => {
    fetchUserReminders();
  }, [fetchUserReminders]);

  // Handle saving a reminder
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
        time: reminderTime,
        text: newReminderText,
      });
      fetchUserReminders(); // Refresh reminders after saving
      setNewReminderText("");
      setReminderTime("12:00");
      toast.success("Reminder added successfully!");
    } catch (error) {
      console.error("Error saving reminder:", error);
      toast.error("Failed to save reminder. Please try again.");
    }
  };

  // Handle deleting a reminder
  const handleDeleteReminder = async () => {
    if (!selectedReminder?._id) {
      toast.error("No reminder selected.");
      return;
    }

    try {
      await deleteReminder(selectedReminder._id);
      fetchUserReminders(); // Refresh reminders after deletion
      setSelectedReminder(null);
      toast.success("Reminder deleted successfully!");
    } catch (error) {
      console.error("Error deleting reminder:", error);
      toast.error("Failed to delete reminder. Please try again.");
    }
  };

  // Handle snoozing a reminder
  const handleSnoozeReminder = async (snoozeMinutes) => {
    if (!selectedReminder) return;

    const newTime = new Date();
    newTime.setMinutes(newTime.getMinutes() + snoozeMinutes);
    setReminderTime(newTime.toTimeString().slice(0, 5));

    toast.info(`Reminder snoozed for ${snoozeMinutes} minutes.`);
  };

  // Memoized class names for calendar tiles
  const tileClassName = useMemo(
    () => ({ date, view }) => {
      if (view === "month") {
        const dateStr = date.toISOString().split("T")[0];
        if (dateStr === new Date().toISOString().split("T")[0]) return "currentDay";
        if (reminders.some((reminder) => reminder.date === dateStr)) return "reminderDay";
      }
      return null;
    },
    [reminders]
  );

  // Memoized disabled tiles in calendar
  const tileDisabled = useMemo(
    () => ({ date, view }) => {
      return view === "month" && date < new Date().setHours(0, 0, 0, 0);
    },
    []
  );

  return (
    <div className="calendarWidget">
      <Calendar
        onClickDay={(date) => {
          setSelectedDate(date);
          const reminder = reminders.find(
            (r) => r.date === date.toISOString().split("T")[0]
          );
          setSelectedReminder(reminder);
        }}
        tileClassName={tileClassName}
        tileDisabled={tileDisabled}
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
        handleSnoozeReminder={handleSnoozeReminder}
        newReminderText={newReminderText}
        setNewReminderText={setNewReminderText}
        userTimezone={userTimezone}
      />
    </div>
  );
};

export default CalendarWidget;
