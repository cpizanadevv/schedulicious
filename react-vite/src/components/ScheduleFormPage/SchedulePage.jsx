import { useSelector } from "react-redux";
import ScheduleForm from "./ScheduleForm";
import { useState } from "react";
import OpenModalMenuItem from '../OpenModalButton'
import './SchedulePage.scss'

function SchedulePage() {
  const user = useSelector((state) => state.session.user);
  const [day, setDay] = useState({});
  const [dayAmount, setDayAmount] = useState(7);


  // Get User's schedules, add them to select


  const schedule = [{id:1}];

  const [selectedSchedule, setSelectedSchedule] = useState(schedule[0].id);

  const handleScheduleChange = (e) => {
    setSelectedSchedule(Number(e.target.value));
  };

  // Get User's Favorite recipes

  // Determine how many days are in selected week, add them to days as individual
  const dayDivs = Array.from({ length: dayAmount }, (_, index) => (
    <div key={index} className="day-div">
      <label className="day-labels" >Day {index + 1}</label>
      
    </div>
  ));

  const closeMenu = () => setShowMenu(false);
  const [showMenu, setShowMenu] = useState(false);
  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  return (
    <div className="schedule-page">
      <div className="banner">
        <img src="https://aa-aws-proj-bucket.s3.us-west-2.amazonaws.com/Designer+(6).png" />
      </div>
      <div className="schedule-top">
        <div className="schedule-form">
          <OpenModalMenuItem
                itemText="Create Schedule"
                onItemClick={closeMenu}
                modalComponent={<ScheduleForm />}
              />
        </div>
        <div className="schedule-select">
          <select>
          {schedule.map(schedule => (
          <option key={schedule.id} value={schedule.id}>
            {schedule.label}
          </option>
        ))}
          </select>
        </div>
        <div className="schedule">
          <label className="schedule-days-title">Schedule</label>
          <div className="days">
            {dayDivs}
            
          </div>
        </div>

        <div className="schedule-middle">
            <div className="link-buttons">
                <button className="schedule-button">Browse for more Recipes</button>

                {/* Might move later */}
                <button className="schedule-button">Grocery List</button>

            </div>
        </div>
      </div>

      <div className="schedule-bottom">
        <div className="fave-recipes">
            <div className="filter-sorts">
                <select className="filter"></select>
                <select className="sort"></select>
                <input type="search" name="" id="" />
            </div>
            <div className="recipes">

            </div>
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
      <div className="submit-button">
        <button className="schedule-button" type="submit"> Finalize Meal Week</button>

      </div>
    </div>
  );
}

export default SchedulePage;
