import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as scheduleActions from '../../redux/schedule'
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
  const [currentDate, setCurrentDate] = useState(today);
  const meals = useSelector((state) => state.schedule.scheduleMeals);

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  console.log('month', month)
  
  useEffect(() => {
    if (month && year) {
      dispatch(scheduleActions.getAllMeals(monthNames[month], year));
    }
  }, [dispatch, month, year]);

  return (
    <div>
      <div className="banner">
        <img src="https://aa-aws-proj-bucket.s3.us-west-2.amazonaws.com/Designer+(6).png" />
      </div>
      <div>
        <div className="calendar-buttons">
          <div>
            <div>month view</div>
            <div>week view</div>
            <div>day view</div>
          </div>
          <div>
            {monthNames[month]} {year}
          </div>
          <div>
            <div>Today</div>
            <button onClick={handlePrevMonth}>Previous</button>
            <button onClick={handleNextMonth}>Next</button>
          </div>
        </div>
        <div className="calendar">
          <div className="day-names-container">
            {dayNames &&
              dayNames.map((day) => (
                <div className={`day-names ${day}`}>{day}</div>
              ))}
          </div>
          <div className="days">
            {days.map((day, index) => (
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
                <div>
                  {}
                </div>
                <div className="week-actions">
                  <NavLink
                    className={"navlink"}
                    to={`schedule/${new Date(
                      year,
                      month,
                      day
                    ).toISOString().split("T")[0]}/${dayNames[new Date(
                      year,
                      month,
                      day
                    ).getDay()]}`}
                  >
                    <button>Add Recipes</button>
                  </NavLink>
                  <button onClick={() => clearRecipes(date)}>
                    Clear Recipes
                  </button>
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
