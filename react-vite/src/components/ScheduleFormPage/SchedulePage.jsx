import { useDispatch, useSelector } from "react-redux";
import ScheduleForm from "./ScheduleForm";
import { useState } from "react";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import "./SchedulePage.scss";
import { useEffect } from "react";
import * as scheduleActions from "../../redux/schedule";

function SchedulePage() {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.session.user);
  const schedules = useSelector((store) => store.schedule.schedules);

  const allSchedules = Object.values(schedules).map((schedule) => ({
    ...schedule,
    formattedStartDate: new Date(schedule.start_date)
      .toISOString()
      .split("T")[0],
  }));

  const [daySelected, setDaySelected] = useState({});
  const [selectedId, setSelectedId] = useState();
  const [startDate, setStartDate] = useState();
  const [dayAmount, setDayAmount] = useState(0);
  const [dayNames, setDayNames] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState({});

  // Get User's schedules, add them to select

  useEffect(() => {
    dispatch(scheduleActions.getUserSchedules());
  }, [dispatch]);

  const handleScheduleChange = (e) => {
    const currScheduleId = e.target.value;
    const currSchedule = allSchedules.find(
      (s) => s.id === Number(currScheduleId)
    );
    if (currSchedule) {
      setSelectedSchedule(currSchedule);

      const startDate = new Date(currSchedule.start_date);
      const endDate = new Date(currSchedule.end_date);
      setDayAmount((endDate - startDate) / (1000 * 60 * 60 * 24) + 1);
      setStartDate(startDate.toLocaleDateString());

      const dayNamesArray = Array.from(
        { length: (endDate - startDate) / (1000 * 60 * 60 * 24) + 1 },
        (_, index) => {
          const currentDate = new Date(startDate);
          currentDate.setDate(startDate.getDate() + index);
          const dayNames = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ];
          return dayNames[currentDate.getDay()];
        }
      );
      setDayNames(dayNamesArray);
    }
  };
  console.log("CC",selectedId)

  // Get User's Favorite recipes

  // Determine how many days are in selected week, add them to days as individual

  return (
    <div className="schedule-page">
      <div className="banner">
        <img src="https://aa-aws-proj-bucket.s3.us-west-2.amazonaws.com/Designer+(6).png" />
      </div>
      <div className="schedule-top">
        {schedules ? (
          <div className="schedule-select">
            <select
              onChange={handleScheduleChange}
              className="schedule-selector"
            >
              <option value="">Choose a schedule</option>
              {allSchedules.map((schedule) => (
                <option key={schedule.id} value={schedule.id}>
                  {schedule.formattedStartDate}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div>
            <h2 className="no-schedule">
              Looks like you do not have any schedules.
            </h2>
            <div className="schedule-form-modal">
              <OpenModalButton
                buttonText="Create Schedule"
                modalComponent={<ScheduleForm className="schedule-modal" />}
              />
            </div>
          </div>
        )}
        {dayAmount > 0 && (
          <div className="schedule">
            <label className="schedule-days-title">Schedule</label>
            <div className="days">
              {dayNames.map((dayName, index) => (
                <div
                  key={index}
                  className="day-div"
                  onClick={(e) => setSelectedId(dayName)}
                >
                  <label className="day-labels">{dayName}</label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {selectedId != undefined && (
        <div>
          <div className="schedule-middle">
            <div className="link-buttons">
              <button className="schedule-button">
                Browse for more Recipes
              </button>
              <div className="submit-button">
                <button className="schedule-button" type="submit">
                  {" "}
                  Finalize Meal Week
                </button>
              </div>
              <div className="schedule-form-modal">
                <OpenModalButton
                  buttonText="Create Schedule"
                  modalComponent={<ScheduleForm className="schedule-modal" />}
                />
              </div>
              {/* Might move later */}
              <button className="schedule-button">Grocery List</button>
            </div>
          </div>

          <div className="schedule-bottom">
            <div className="fave-recipes">
              <div className="filter-sorts">
                <select className="filter"></select>
                <select className="sort"></select>
                <input type="search" name="" id="" />
              </div>
              <div className="recipes"></div>
            </div>
            <div className="day-meals">
              <div className="meal-sections">
                <h2>Breakfast</h2>
              </div>
              <div className="meal-sections">
                <h2>Lunch</h2>
              </div>
              <div className="meal-sections">
                <h2>Dinner</h2>
              </div>
              <div className="meal-sections">
                <h2>Snacks/Dessert</h2>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SchedulePage;
