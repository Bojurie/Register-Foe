import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Calendar.css";

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getMonthDays = (date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const days = [];

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(date.getFullYear(), date.getMonth(), i));
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentMonth((prevMonth) => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(prevMonth.getMonth() - 1);
      return newMonth;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth((prevMonth) => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(prevMonth.getMonth() + 1);
      return newMonth;
    });
  };

  const monthDays = getMonthDays(currentMonth);
  const today = new Date();

  return (
    <motion.div
      className="calendar"
      style={{ maxHeight: "300px", overflowY: "auto" }}
    >
      <div className="calendar-header">
        <motion.button onClick={handlePrevMonth}>&lt;</motion.button>
        <h2>
          {currentMonth.toLocaleString("default", { month: "long" })}{" "}
          {currentMonth.getFullYear()}
        </h2>
        <motion.button onClick={handleNextMonth}>&gt;</motion.button>
      </div>
      <AnimatePresence>
        <motion.div
          key={currentMonth.toString()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="calendar-days"
        >
          {monthDays.map((day) => (
            <div
              key={day.toString()}
              className={`calendar-day ${
                day.getMonth() === today.getMonth() &&
                day.getDate() === today.getDate()
                  ? "today"
                  : ""
              }`}
            >
              {day.getDate()}
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default Calendar;
