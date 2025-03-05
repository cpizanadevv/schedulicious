import "./LandingPage.scss";
// import { NavLink } from "react-router-dom";
// import OpenModalButton from "../OpenModalButton";
// import SignupFormModal from "../SignupFormModal";
import { useEffect } from "react";
// import SearchBar from "../SearchBar/SearchBar";
import { useDispatch, useSelector } from "react-redux";
// import { getAllRecipes } from "../../redux/recipe";
import { currentWeekMeals } from "../../redux/schedule";

function UserLandingPage() {
  const user = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  const weekMeals = useSelector((state) => state.schedule.scheduleMeals);
  const allWeekMeals = Object.entries(weekMeals);
  console.log('allWeekMeals', allWeekMeals)

  // TODO Links to Calendar and Recipe Creator

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const today = new Date();

  // console.log('today', today)
  const firstDayOfWeek = () => {
    const currDay = today.getDay();
    return new Date(today.setDate(today.getDate() - currDay));
  };

  useEffect(() => {
    const first = new Date(firstDayOfWeek()).toISOString().split("T")[0];
    const lastDayOfWeek = new Date(
      firstDayOfWeek().setDate(firstDayOfWeek().getDate() + 6)
    )
      .toISOString()
      .split("T")[0];
    dispatch(currentWeekMeals(first, lastDayOfWeek));
  }, [dispatch]);

  return (
    <div className="user-landing">
        <h2>Welcome {user.username}!</h2>
      <div className="landing-calendar-container">
        <h3>This week&apos;s meals</h3>
        <div className="landing-calendar">
          {dayNames.map((day) => (
            <div className="meal-days">
              {/* {allWeekMeals} */}
              <div className="day-name">{day}</div>
              <div className="meal-container ">
                
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserLandingPage;
