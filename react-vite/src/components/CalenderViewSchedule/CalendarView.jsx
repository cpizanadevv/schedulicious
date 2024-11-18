import { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as scheduleActions from "../../redux/schedule";
import "./CalendarView.scss";

function Calendar() {
  const dispatch = useDispatch();
  const calendarRef = useRef(null);

  const meals = useSelector((state) => state.schedule.scheduleMeals);

  const [isEditMode, setIsEditMode] = useState(false);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(null);

  const allMeals = Object.values(meals);
  console.log("month", month);
  console.log("year", year);
  console.log("allMeals", allMeals);

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

  useEffect(() => {
    if (month && year) {
      dispatch(scheduleActions.getAllMeals(month, year));
    }
  }, [dispatch, month, year]);

  useEffect(() => {}, [meals, allMeals]);

  const onDateRangeChange = (arg) => {
    const monthYear = arg.view.title.split(" ");
    const monthIndex = monthNames.indexOf(monthYear[0]);
    console.log("arg", monthIndex);
    const year = arg.start.getFullYear();
    setMonth(monthIndex + 1);
    setYear(year);
  };

  const handleViewChange = (view) => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.changeView(view);
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
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
      <div className="calendar-buttons">
        <div className="calendar-view-buttons">
          <button onClick={() => handleViewChange("dayGridMonth")}>
            Month View
          </button>
          <button onClick={() => handleViewChange("timeGridWeek")}>
            Week View
          </button>
          <button onClick={() => handleViewChange("timeGridDay")}>
            Day View
          </button>
        </div>
        <div>
          <button onClick={toggleEditMode}>
            {isEditMode ? "Exit Edit Mode" : "Enter Edit Mode"}
          </button>
        </div>
      </div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        ref={calendarRef}
        datesSet={onDateRangeChange}
        views={{
          timeGridWeek: {
            slotLabelFormat: [],
            slotMinTime: "24:00:00",
            slotMaxTime: "24:00:00",
          },
          timeGridDay: {
            slotLabelFormat: [],
            slotMinTime: "24:00:00",
            slotMaxTime: "24:00:00",
          },
        }}
        dayCellContent={(arg) => {
          const { date } = arg;
          const startOfWeek = new Date(date);
          startOfWeek.setDate(date.getDate() - date.getDay());
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          const currDay = dayNames[date.getDay()];
          const formattedDate = date.toISOString().split("T")[0];

          return (
            <div className="day-cell-content" onClick={toggleEditMode}>
              <div className="fc-daygrid-day-top">{date.getDate()}</div>
              <div>
                <div className="fc-daygrid-day-events">
                  {allMeals &&
                    allMeals.map((meal) => {
                      const mealDate = new Date(meal.date)
                        .toISOString()
                        .split("T")[0];
                      return (
                        formattedDate === mealDate && (
                          <div key={meal.recipe_id}>{meal.meal_name}</div>
                        )
                      );
                    })}
                </div>

                {isEditMode && (
                  <div className="week-actions">
                    <NavLink
                      className={"navlink"}
                      to={`schedule/${
                        date.toISOString().split("T")[0]
                      }/${currDay}`}
                    >
                      <button>Add Recipes</button>
                    </NavLink>
                    <button onClick={() => clearRecipes(date)}>
                      Clear Recipes
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}
export default Calendar;
