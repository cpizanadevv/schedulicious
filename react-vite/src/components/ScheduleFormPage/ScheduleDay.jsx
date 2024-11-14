import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import { IoArrowBackCircle } from "react-icons/io5";
import * as recipeActions from "../../redux/recipe";
import * as scheduleActions from "../../redux/schedule";
import "./ScheduleDay.scss";

function ScheduleDay() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.session.user);
  const favorited = useSelector((state) => state.recipe.favorited);
  const dayMeals = useSelector((state) => state.schedule.dayMeals || {});
  const { date, day } = useParams();

  const [addedMeals, setAddedMeals] = useState({});
  const mealPlan = Object.values(addedMeals);
  const meals = Object.values(dayMeals);
  console.log("mealPlan", mealPlan);
  console.log("addedMeals", addedMeals);

  // ! UseEffects
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user]);

  useEffect(() => {
    dispatch(recipeActions.getUserFavs());
  }, [dispatch]);

  useEffect(() => {
    dispatch(scheduleActions.getDayMeals(date, day));
  }, [dispatch,addedMeals]);

  useEffect(() => {}, [dayMeals,meals]);

  const handleAddMeal = (recipe) => {
    setAddedMeals((prevMeals) => ({
      ...prevMeals,
      [recipe.id]: recipe,
    }));
  };

  // !    SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mealPlan.length === 0) {
      return;
    }
    for (const recipe of mealPlan) {
      const recipeToAdd = {
        recipe_id: recipe.id,
        date: date,
        day_of_week: day,
      };
      await dispatch(scheduleActions.createScheduleMeals(recipeToAdd));
    }
    setAddedMeals({})
  };
  // console.log("days", dayAmount);
  // !      DELETE MEAL
  const handleDeleteDayMeal = (e,recipe_id) => {
    e.preventDefault();
    console.log('recipe_id', recipe_id)
    dispatch(scheduleActions.deleteScheduleMeal(date,recipe_id,"day"))
  };
  
  const handleGoBack = () => {
    navigate(`/calendar-view`);
  };

  return (
    <div>
      <div className="banner">
        <img src="https://aa-aws-proj-bucket.s3.us-west-2.amazonaws.com/Designer+(6).png" />
      </div>
      <div>
        <div className="schedule-day-back" onClick={handleGoBack}>
          <span className="tooltiptext">Calendar</span>
          <IoArrowBackCircle className="schedule-day-back-icon" />
        </div>

        <NavLink to={"/recipes"}>
          <button className="schedule-button">Browse for more Recipes</button>
        </NavLink>
      </div>
      <div className="schedule-bottom">
        <div className="fave-recipes">
          {/* <div className="filter-sorts">
                <select className="filter"></select>
                <select className="sort"></select>
                <input type="search" name="" id="" />
              </div> */}
          <h2>Favorited Recipes :</h2>
          <div className="recipes">
            {favorited && favorited.length > 0 ? (
              favorited.map((recipe) => (
                <div key={recipe.id} className="favorited-recipe">
                  <div onClick={() => handleAddMeal(recipe)}>
                    {recipe.img && (
                      <img
                        src={recipe.img}
                        alt={recipe.meal_name}
                        className="schedule-recipe-img"
                      />
                    )}
                    {/* <div className="schedule-overlay">
                      <div className="schedule-overlay-text">
                        {recipe.meal_name}
                      </div>
                    </div> */}
                  </div>
                </div>
              ))
            ) : (
              <div>
                <p>No favorites...</p>

                <NavLink to={"/recipes"}>
                  <button className="schedule-button">
                    Browse for more Recipes
                  </button>
                </NavLink>
              </div>
            )}
          </div>
        </div>
        <div className="day-meals">
          <div className="meal-sections">
            <h2>
              Meals for {day} ({date}) :
            </h2>
            <div className="meals">
              {meals &&
                meals.map((recipe) => (
                  <div className="schedule-recipe" key={recipe.id} onClick={(e)=>handleDeleteDayMeal(e,recipe.recipe_id)}>
                    <img
                      src={recipe.img}
                      alt={recipe.meal_name}
                      className="schedule-recipe-img"
                    />

                    <div>{recipe.meal_name}</div>
                  </div>
                ))}
              {mealPlan &&
                mealPlan.map((recipe) => (
                  <div className="schedule-recipe" key={recipe.id} onClick={() => {
                    const { [recipe.id]: _, ...removed } = addedMeals;
                    setAddedMeals(removed);
                  }}>
                    <img
                      src={recipe.img}
                      alt={recipe.meal_name}
                      className="schedule-recipe-img"
                    />

                    <div>{recipe.meal_name}</div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      <div className="submit-button">
        <button
          className="schedule-button"
          type="submit"
          onClick={handleSubmit}
        >
          Finalize Meal Day
        </button>
      </div>
    </div>
  );
}

export default ScheduleDay;