import "./LandingPage.css";
// import { NavLink } from "react-router-dom";
// import OpenModalButton from "../OpenModalButton";
// import SignupFormModal from "../SignupFormModal";
import { useEffect} from "react";
// import SearchBar from "../SearchBar/SearchBar";
import { useDispatch, useSelector } from "react-redux";
// import { getAllRecipes } from "../../redux/recipe";
import { currentWeekMeals } from "../../redux/schedule";

function UserLandingPage() {
  const user = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  const weekMeals = useSelector((state) => state.schedule.scheduleMeals)

  const today = new Date();
  
  // console.log('today', today)
  const firstDayOfWeek = () => {
    const currDay = today.getDay();
    return new Date(today.setDate(today.getDate()-currDay));
  };

  useEffect(() => {
    const first = new Date(firstDayOfWeek()).toISOString().split("T")[0];
    const lastDayOfWeek = new Date(firstDayOfWeek().setDate(firstDayOfWeek().getDate() + 6)).toISOString().split("T")[0];
    // console.log('lastDayOfWeek', lastDayOfWeek)
    // console.log('firstDayOfWeek', firstDayOfWeek().toLocaleDateString())
    dispatch(currentWeekMeals(first,lastDayOfWeek))
  }, [dispatch]);

  return (
    <div>
      <div>
        <h2>Welcome {user.username}!</h2>
        <div className="calendar-container">
          <h3>This week&apos;s meals</h3>
          <div className="calendar">
            <div className="days"></div>
            <div className="meal-container"></div>
          </div>
        </div>
        <div className="top-recipes"></div>
      </div>
    </div>
  );
}

export default UserLandingPage;
