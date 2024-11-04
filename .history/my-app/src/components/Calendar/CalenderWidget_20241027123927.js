import React, { useState, useEffect, useCallback } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './CalendarWidget.module.css';
import ReminderModal from './ReminderModal.module.css.css';
import { useAuth } from '../AuthContext/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const CalendarWidget: React.FC = () => {
  const { postUserReminder, user, getUserReminder, deleteReminder } = useAuth();
  
  // Initialize reminders as an empty array
  const [reminders, setReminders] = useState<any[]>([]);
  const [newReminderText, setNewReminderText] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedReminder, setSelectedReminder] = useState<any>(null);
  const [noReminders, setNoReminders] = useState(false);
  const [userTimezone, setUserTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  const fetchUserTimezone = async (latitude: number, longitude: number) => {
    const apiKey = process.env.REACT_APP_OPENCAGE_API_KEY;
    if (!apiKey) {
      console.error('OpenCage API key is missing.');
      return;
    }

    try {
      const response = await axios.get(
        'https://api.opencagedata.com/geocode/v1/json',
        {
          params: { q: `${latitude},${longitude}`, key: apiKey, language: 'en' },
        }
      );

      if (response.data.results?.length) {
        setUserTimezone(response.data.results[0].annotations.timezone.name);
      } else {
        console.error('Unable to fetch timezone details.');
      }
    } catch (error) {
      console.error('Error fetching timezone:', error);
    }
  };

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchUserTimezone(latitude, longitude);
        },
        (error) => {
          console.error('Error fetching location:', error);
          toast.error('Location access is required for accurate timezone.');
        }
      );
    }
  }, []);

  const fetchUserReminders = useCallback(async () => {
    if (!user?._id) {
      toast.error('User ID is missing. Please log in again.');
      return;
    }

    try {
      const response = await getUserReminder({ userId: user._id });
      if (Array.isArray(response) && response.length) {
        setReminders(
          response.map((reminder: any) => ({
            ...reminder,
            date: new Date(reminder.date),
          }))
        );
        setNoReminders(false);
      } else {
        setReminders([]); // Ensure reminders is an empty array if no data
        setNoReminders(true);
        toast.info('No reminders found for this user.');
      }
    } catch (error) {
      console.error('Error fetching reminders:', error);
      toast.error('Failed to load reminders. Please try again later.');
    }
  }, [getUserReminder, user?._id]);

  useEffect(() => {
    if (user?._id) {
      fetchUserReminders();
    }
  }, [user, fetchUserReminders]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    const reminder = reminders.find(
      (reminder: any) => reminder.date.toDateString() === date.toDateString()
    );
    setSelectedReminder(reminder);
  };

  const handleSaveReminder = async () => {
    if (!newReminderText.trim()) {
      toast.warning('Reminder text cannot be empty.');
      return;
    }

    if (!user?._id) {
      toast.error('User ID is missing. Please log in again.');
      return;
    }

    try {
      await postUserReminder({
        userId: user._id,
        date: selectedDate,
        text: newReminderText,
      });
      fetchUserReminders();
      setNewReminderText('');
      toast.success('Reminder added successfully!');
    } catch (error) {
      console.error('Error saving reminder:', error);
      toast.error('Failed to save reminder. Please try again.');
    }
  };

  const handleDeleteReminder = async () => {
    if (!selectedReminder) {
      toast.error('No reminder selected.');
      return;
    }

    try {
      await deleteReminder(selectedReminder._id);
      fetchUserReminders();
      toast.success('Reminder deleted successfully!');
    } catch (error) {
      console.error('Error deleting reminder:', error);
      toast.error('Failed to delete reminder. Please try again.');
    }
  };

  return (
    <div className={styles.calendarWidget}>
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        tileClassName={({ date }) =>
          reminders.some(
            (reminder: any) => reminder.date.toDateString() === date.toDateString()
          )
            ? styles.hasReminder
            : null
        }
      />
      {noReminders && (
        <motion.p className={styles.noRemindersText}>No reminders found for this user.</motion.p>
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
