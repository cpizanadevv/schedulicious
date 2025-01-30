import "./LandingPage.css";
// import { NavLink } from "react-router-dom";
// import OpenModalButton from "../OpenModalButton";
// import SignupFormModal from "../SignupFormModal";
import { useEffect} from "react";
// import SearchBar from "../SearchBar/SearchBar";
import { useDispatch, useSelector } from "react-redux";
// import { getAllRecipes } from "../../redux/recipe";
import { currentWeekMeals, getAllMeals } from "../../redux/schedule";

function UserLandingPage() {
  const user = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  const weekMeals = useSelector((state) => state.schedule.scheduleMeals)

  //   TODO Maybe make this it's own component if it gets too long
  const today = new Date();
  const firstDayOfWeek = () => {
    const currDay = today.getDay();
    if(currDay === 0){
      return today;
    }
    if(currDay > 0){
      return new Date(today - currDay);
    }
  };

  useEffect(() => {
    const lastDayOfWeek = new Date(firstDayOfWeek +6)
    dispatch(currentWeekMeals(firstDayOfWeek,lastDayOfWeek))
  }, [dispatch,today]);

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
