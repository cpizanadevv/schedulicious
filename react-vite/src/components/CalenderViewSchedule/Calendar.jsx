import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as scheduleActions from "../../redux/schedule";
import { FaDotCircle } from "react-icons/fa";
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
  const allMeals = Object.values(meals);

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  console.log('daysInMonth', daysInMonth)

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  useEffect(() => {
    if (month && year) {
      console.log("month, year", month + 1, year);
      dispatch(scheduleActions.getAllMeals(month + 1, year));
    }
  }, [dispatch, month, year]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
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
                {day &&(

                <div className="week-actions">
                  <NavLink
                    className={"navlink"}
                    to={`schedule/${
                      new Date(year, month, day).toISOString().split("T")[0]
                    }/${dayNames[new Date(year, month, day).getDay()]}`}
                  >
                    <button>Add Recipes</button>
                  </NavLink>
                  <button onClick={() => clearRecipes(new Date(year, month, day)
                            .toISOString()
                            .split("T")[0])}>
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
                            <FaDotCircle className="circle"/> 
                             {meal.meal_name}
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
