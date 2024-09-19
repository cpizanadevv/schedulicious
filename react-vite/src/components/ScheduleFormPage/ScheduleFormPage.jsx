import { useSelector } from "react-redux";
import ScheduleForm from "./ScheduleForm";
import { useState } from "react";

function SchedulePage() {
  const user = useSelector((state) => state.session.user);
  const [day, setDay] = useState({});
  const [dayAmount, setDayAmount] = useState(0);

  // Get User's schedules, add them to select
  // Get User's Favorite recipes

  // Determine how many days are in selected week, add them to days as individual
  const dayDivs = Array.from({ length: dayAmount }, (_, index) => (
    <div key={index} className="day-div">
      Day {index + 1}
    </div>
  ));

  return (
    <div className="schedule-page">
      <div className="banner">
        <img src="" />
      </div>
      <div className="schedule-top">
        <div className="schedule-form">
          <ScheduleForm />
        </div>
        <div className="schedule-select">
          <select>{}</select>
        </div>
        <div className="days">{dayDivs}</div>

        <div className="schedule-middle">
            <div className="link-buttons">
                <button>Browse for more Recipes</button>

                {/* Might move later */}
                <button>Grocery List</button>

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
        <div className="dayMeals">
            <div className="Breakfast">
                <h2>Breakfast</h2>
            </div>
            <div className="Lunch">
                <h2>Lunch</h2>

            </div>
            <div className="Dinner">
                <h2>Dinner</h2>
            </div>
            <div className="Snack">
                <h2>Snacks/Dessert</h2>
            </div>
        </div>
      </div>
      <button type="submit"> Finalize Meal Week</button>
    </div>
  );
}

export default SchedulePage;
