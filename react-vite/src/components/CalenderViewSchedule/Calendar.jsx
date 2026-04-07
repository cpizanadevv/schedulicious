import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as scheduleActions from "../../redux/schedule";
import { FaDotCircle } from "react-icons/fa";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import "./Calendar.scss";

function Calendar() {
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dispatch = useDispatch();
  const today = new Date();
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const meals = useSelector((state) => state.schedule.scheduleMeals);
  const allMeals = Object.values(meals);
  const [currentDate, setCurrentDate] = useState(today);
  const [view, setView] = useState("monthView");
  const [calendarView, setCalendarView] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(null);

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const lastDay = new Date(year, month, daysInMonth).getDay();

  const days = [];
  const weeks = [];
  if (firstDay !== 0) {
    let tmpPrev = daysInPrevMonth;
    let tmpStart = daysInPrevMonth - (firstDay - 1);
    for (let i = tmpStart; i <= tmpPrev; i++) {
      days.push(new Date(year, month - 1, i));
    }
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }
  if (lastDay !== 6) {
    const leftOver = 6 - lastDay;
    for (let i = 1; i <= leftOver; i++) {
      days.push(new Date(year, month + 1, i));
    }
  }
  if (view === "weekView") {
    for (let i = 0; i < 6; i++) {
      const slice = days.slice(i * 7, i * 7 + 7);
      if (slice.length) {
        weeks.push(slice);
      }
      if (currentWeek === null) {
        setCurrentWeek(0);
      }
    }
  }
  if (!calendarView.length) {
    switch (view) {
      case "monthView":
        setCalendarView(days);
        break;
      case "weekView":
        setCalendarView(weeks[currentWeek]);
        break;
      default:
        setCalendarView([days.slice(0,1)]);
    }
  }

  useEffect(() => {
    setCalendarView([]);
  }, [view, currentDate]);

  useEffect(() => {
    let start = days[0].toISOString().split("T")[0];
    let end = days[days.length - 1].toISOString().split("T")[0];
    dispatch(scheduleActions.getAllMeals(start, end));
  }, [dispatch, currentDate,month,year]);

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    switch (view) {
      case "weekView":
        newDate.setDate(newDate.getDate() - 7);
        break;
      case "dayView":
        newDate.setDate(newDate.getDate() - 1);
        break;
      default:{
        const newMonth = newDate.getMonth() - 1;
        newDate.setMonth(newMonth);
        newDate.setDate(1);
      }
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    switch (view) {
      case "weekView":
        newDate.setDate(newDate.getDate() + 7);
        break;
      case "dayView":
        newDate.setDate(newDate.getDate() + 1);
        break;
      default: {
        const newMonth = newDate.getMonth() + 1;
        newDate.setMonth(newMonth);
        newDate.setDate(1);
      }
      setCurrentDate(newDate);
    }
  };


  const clearRecipes = async (date) => {
    const formattedDate = new Date(date);
    const toClear = allMeals.filter((meal) => {
      const mealDate = new Date(meal.date);
      return (
        mealDate.getFullYear() === formattedDate.getFullYear() &&
        mealDate.getMonth() === formattedDate.getMonth() &&
        mealDate.getDate() === formattedDate.getDate()
      );
    });

    const dateStr = formattedDate.toISOString().split('T')[0];

    await Promise.all(
      toClear.map((recipe) => {
        return dispatch(scheduleActions.deleteScheduleMeal(dateStr, recipe.recipe_id));
      })
    );
    
    let start = days[0].toISOString().split("T")[0];
    let end = days[days.length - 1].toISOString().split("T")[0];
    dispatch(scheduleActions.getAllMeals(start, end));
  };

  return (
    <div>
      <div className="banner">
        <img src="https://aa-proj-bucket.s3.us-west-2.amazonaws.com/Designer+(6).png" />
      </div>
      <div>
        <div className="calendar-buttons">
          <div className="view-buttons">
            {/*
            <button onClick={() => setView("monthView")}>month view</button>
            <button onClick={() => setView("weekView")}>week view</button>
            <button onClick={() => setView("dayView")}>day view</button>
            {*/}
          </div>
          <div className="monYear">
            {monthNames[month]} {year}
          </div>
          <div className="change-month-buttons">
            <button onClick={() => setCurrentDate(today)}>Today</button>
            <button className="change-month" onClick={handlePrev}>
              <IoChevronBack />
            </button>
            <button className="change-month" onClick={handleNext}>
              <IoChevronForward />
            </button>
          </div>
        </div>
        <div className="calendar">
          <div className="day-names-container">
            {view == 'dayView' ? (
              <div className={`day-names`}>
                {dayNames[currentDate.getDay()]}
              </div>
            ):(
              dayNames.map((day) => (
                <div key={day} className={`day-names ${day}`}>{day}</div>
              )))}
          </div>
          <div className="days">
            {calendarView.map((dayDate, index) => (
              <div
                key={index}
                className={`day ${
                  dayDate &&
                  dayDate.toDateString() === today.toDateString()
                    ? "today"
                    : ""
                }
                          ${
                            dayDate && dayDate < startOfToday
                              ? "past"
                              : ""
                          }`}
              >
                {dayDate.getDate()}
                {dayDate && (
                  <div className="week-actions">
                    <NavLink
                      className={"navlink"}
                      to={`schedule/${
                        dayDate.toISOString().split("T")[0]
                      }/${dayNames[dayDate.getDay()]}`}
                    >
                      <button>Add Recipes</button>
                    </NavLink>
                    <button
                      onClick={() =>
                        clearRecipes(
                          dayDate.toISOString().split("T")[0]
                        )
                      }
                    >
                      Clear Recipes
                    </button>
                  </div>
                )}
                <div className="scheduled-meals">
                  {allMeals &&
                    allMeals.map((meal) => {
                      const mealDate = new Date(meal.date)
                        .toISOString()
                        .split("T")[0];
                      return (
                        mealDate ==
                          dayDate.toISOString().split("T")[0] && (
                          <div key={meal.recipe_id} className="schedule-meal">
                            <FaDotCircle className="circle" /> {meal.meal_name}
                          </div>
                        )
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Calendar;
