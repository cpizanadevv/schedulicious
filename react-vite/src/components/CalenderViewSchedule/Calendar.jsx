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
      let tmpDate = new Date(year, month - 1, i);
      days.push(i);
    }
  }
  for (let i = 1; i <= daysInMonth; i++) {
    let tmpDate = new Date(year, month, i);
    days.push(i);
  }
  if (lastDay !== 6) {
    const leftOver = 6 - lastDay;
    for (let i = 1; i <= leftOver; i++) {
      let tmpDate = new Date(year, month + 1, i);
      days.push(i);
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
        // TODO: Change this to day
        setCalendarView([days.slice(0,1)]);
    }
  }
  console.log("days", days);
  console.log("weeks", weeks);
  console.log("currentWeek", currentWeek);
  console.log("view", view);

  useEffect(() => {
    setCalendarView([]);
  }, [view, currentDate]);

  useEffect(() => {
    let start = new Date(year, month, days[0]).toISOString().split("T")[0];
    let end = new Date(year, month + 1, days[days.length - 1])
      .toISOString()
      .split("T")[0];
    if (days[0] !== 1) {
      start = new Date(year, month - 1, days[0]).toISOString().split("T")[0];
    }
    dispatch(scheduleActions.getAllMeals(start, end));
  }, [dispatch, month, year]);

  const handlePrevMonth = () => {

    switch (view) {
      case "weekView":
        setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)));
      case "dayView":
        setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 1)));
      default:
        setCurrentDate(new Date(year, month - 1, 1));
    }
  };

  const handleNextMonth = () => {
    switch (view) {
      case "weekView":
        setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)));
      case "dayView":
        setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 1)));
      default:
        setCurrentDate(new Date(year, month + 1, 1));
    }
  };


  const clearRecipes = (date) => {
    const formattedDate = new Date(date).toISOString().split("T")[0];
    const toClear = allMeals.filter((meal) => {
      const mealDate = new Date(meal.date).toISOString().split("T")[0];
      return mealDate === formattedDate;
    });

    toClear.forEach((recipe) => {
      dispatch(
        scheduleActions.deleteScheduleMeal(
          formattedDate,
          recipe.recipe_id,
          "month"
        )
      );
    });
  };

  return (
    <div>
      <div className="banner">
        <img src="https://aa-aws-proj-bucket.s3.us-west-2.amazonaws.com/Designer+(6).png" />
      </div>
      <div>
        <div className="calendar-buttons">
          <div className="view-buttons">
            <button onClick={() => setView("monthView")}>month view</button>
            <button onClick={() => setView("weekView")}>week view</button>
            <button onClick={() => setView("dayView")}>day view</button>
          </div>
          <div className="monYear">
            {monthNames[month]} {year}
          </div>
          <div className="change-month-buttons">
            <button onClick={() => setCurrentDate(today)}>Today</button>
            <button className="change-month" onClick={handlePrevMonth}>
              <IoChevronBack />
            </button>
            <button className="change-month" onClick={handleNextMonth}>
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
                <div className={`day-names ${day}`}>{day}</div>
              )))}
          </div>
          <div className="days">
            {calendarView.map((day, index) => (
              <div
                key={index}
                className={`day ${
                  day &&
                  new Date(year, month, day).toDateString() ===
                    today.toDateString()
                    ? "today"
                    : ""
                }
                          ${
                            day && new Date(year, month, day) < today
                              ? "past"
                              : ""
                          }`}
              >
                {day}
                {day && (
                  <div className="week-actions">
                    <NavLink
                      className={"navlink"}
                      to={`schedule/${
                        new Date(year, month, day).toISOString().split("T")[0]
                      }/${dayNames[new Date(year, month, day).getDay()]}`}
                    >
                      <button>Add Recipes</button>
                    </NavLink>
                    <button
                      onClick={() =>
                        clearRecipes(
                          new Date(year, month, day).toISOString().split("T")[0]
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
                          new Date(year, month, day)
                            .toISOString()
                            .split("T")[0] && (
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
