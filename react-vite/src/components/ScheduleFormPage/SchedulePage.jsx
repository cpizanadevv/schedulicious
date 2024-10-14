import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { FaCalendarPlus } from "react-icons/fa";
import { MdEditCalendar } from "react-icons/md";
import ScheduleForm from "./ScheduleForm";
import ScheduleUpdate from "./ScheduleUpdate";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import ScheduleDelete from "../Deletes/DeleteSchedule";
import "./SchedulePage.scss";
import * as scheduleActions from "../../redux/schedule";
import * as recipeActions from "../../redux/recipe";
import { differenceInCalendarDays, set } from "date-fns";
import { NavLink, useNavigate } from "react-router-dom";

function SchedulePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.session.user);
  const schedules = useSelector((state) => state.schedule.schedules);
  const currSchedule = useSelector(
    (state) => state.schedule.currSchedule || {}
  );
  const favorites = useSelector((state) => state.recipe.recipes);
  const currScheduleMeals = useSelector(
    (state) => state.schedule.scheduleMeals || []
  );
  const dayMeals = useSelector((state) => state.schedule.dayMeals);

  const allFavs = Object.values(favorites);
  const allSchedules = Object.values(schedules);
  const selectedDayMeals = Object.values(dayMeals);

  // !    UseStates
  const [errors, setErrors] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  //Day amount - to set how many day divs
  //Day names - to set names for day divs to be accessed by day selected
  // DaySelected - tracks day_of_week for submitting to backend
  const [dayAmount, setDayAmount] = useState(0);
  const [dayNames, setDayNames] = useState([]);
  const [daySelected, setDaySelected] = useState("");

  // Arr of dayMeal objs to be sent to backend when finialized
  const [mealPlan, setMealPlan] = useState([]);
  const [deleteMeal, setDeletedMeal] = useState(false);

  // ! UseEffects
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user]);

  // Get User's schedules and favorite recipes
  // console.log("schedule len", Object.keys(schedules).length);
  useEffect(() => {
    dispatch(recipeActions.getUserFavs());
    dispatch(scheduleActions.getUserSchedules());
    if (selectedId) {
      dispatch(scheduleActions.getCurrSchedule(selectedId));
    }
  }, [dispatch, selectedId]);

  useEffect(() => {
    if (Object.keys(currSchedule).length == 0) {
      setSelectedId(null);
    }
    if (currSchedule.id != selectedId) {
      setSelectedId(currSchedule.id);
    }
  }, [currSchedule]);

  useEffect(() => {
    if (selectedId && currSchedule) {
      const start = new Date(currSchedule.start_date);
      const end = new Date(currSchedule.end_date);
      const daysDiff = differenceInCalendarDays(end, start) + 1;

      setDayAmount(daysDiff);
      // setStartDate(start.toISOString().split("T")[0]);

      const dayNamesArray = Array.from({ length: daysDiff }, (_, index) => {
        const currentDate = new Date(start);
        currentDate.setDate(start.getDate() + index);
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
      });

      setDayNames(dayNamesArray);
    }
  }, [selectedId, currSchedule]);

  useEffect(() => {
    if (selectedId) {
      dispatch(scheduleActions.getCurrScheduleMeals(selectedId));
    }
  }, [dispatch, selectedId, daySelected, currSchedule.id]);

  useEffect(() => {
    if (daySelected && currSchedule.id) {
      dispatch(scheduleActions.getDayMeals(currSchedule.id, daySelected));
    }
  }, [dispatch, daySelected, currScheduleMeals]);

  //    !   Schedule Change
  const handleScheduleChange = (e) => {
    const currScheduleId = e.target.value;

    dispatch(scheduleActions.resetScheduleMeals());

    const currSchedule = allSchedules.find(
      (s) => s.id === Number(currScheduleId)
    );

    if (currSchedule) {
      setSelectedId(currScheduleId);
      setDaySelected("");
    }
  };

  // !   Recipe Drag and Drop
  const onDragStart = (e, recipe) => {
    e.dataTransfer.setData("recipeId", recipe.id);
  };

  const allowDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add("drag-over");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("drag-over");
    const recipeId = Number(e.dataTransfer.getData("recipeId"));

    if (recipeId) {
      const draggedRecipe = document.getElementById(`recipe-${recipeId}`);
      if (draggedRecipe) {
        // Clone the dragged recipe and append it to the target
        const clone = draggedRecipe.cloneNode(true);
        clone.classList.remove("schedule-recipe-img");
        clone.classList.add("dropped-item");

        const uniqueCloneId = `dropped-${recipeId}-${daySelected}`;
        clone.setAttribute("id", uniqueCloneId);

        e.target.appendChild(clone);

        // Update the meal plan state with the dropped recipe
        if (!mealPlan.some((meal) => meal.recipe_id === recipeId)) {
          setMealPlan((prev) => [
            ...prev,
            {
              schedule_id: Number(selectedId),
              recipe_id: Number(recipeId),
              day_of_week: daySelected,
            },
          ]);
          draggedRecipe.setAttribute("draggable", "false");
          draggedRecipe.classList.add("selected");

          clone.onclick = () => {
            clone.remove();
            draggedRecipe.setAttribute("draggable", "true");
            draggedRecipe.classList.remove("selected");
            draggedRecipe.classList.add("schedule-recipe-img");
            setMealPlan((prev) =>
              prev.filter((meal) => meal.recipe_id !== recipeId)
            );
          };
        }
      }
    }
  };

  // !    SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();
    for (let i = 0; i < mealPlan.length; i++) {
      const day = mealPlan[i].day_of_week;
      const recipeId = mealPlan[i].recipeId;

      if (currScheduleMeals[day]?.includes(recipeId)) {
        continue;
      }
      const dispatchMeal = dispatch(
        scheduleActions.createScheduleMeals(mealPlan[i])
      );
      if (dispatchMeal.errors) {
        setErrors(dispatchMeal.errors);
        return errors;
      }
    }

    setMealPlan([]);
    setDaySelected("");
    window.scrollTo(0, 0);
  };
  // console.log("days", dayAmount);
  // !      DELETE MEAL
  const handleDeleteDayMeal = (e) => {
    e.preventDefault();
    const currRecipeId = e.target.id;
    const toDelete = {
      schedule_id: selectedId,
      recipe_id: currRecipeId,
      day_of_week: daySelected,
    };
    if (dayMeals[currRecipeId]) {
      dispatch(scheduleActions.deleteScheduleMeal(toDelete));
      setDeletedMeal(true);

      const currImg = document.getElementById(
        `dropped-${currRecipeId}-${daySelected}`
      );
      const draggedRecipe = document.getElementById(`recipe-${currRecipeId}`);
      if (currImg) {
        currImg.remove();
        draggedRecipe.setAttribute("draggable", "true");
        draggedRecipe.classList.remove("selected");
        draggedRecipe.classList.add("schedule-recipe-img");
      }
      dispatch(scheduleActions.getDayMeals(selectedId, daySelected));
      dispatch(scheduleActions.getCurrScheduleMeals(selectedId));
    }
  };

  return (
    <div className="schedule-page">
      <div className="banner">
        <img src="https://aa-aws-proj-bucket.s3.us-west-2.amazonaws.com/Designer+(6).png" />
      </div>
      <div className="schedule-top">
        <h2>Choose a schedule</h2>
        {allSchedules.length > 0 ? (
          <div className="schedule-select">
            <select
              onChange={handleScheduleChange}
              className="schedule-selector"
              value={currSchedule.id}
            >
              <option value="">Choose</option>
              {allSchedules.map((schedule) => (
                <option key={schedule.id} value={schedule.id}>
                  {schedule.start_date}
                </option>
              ))}
            </select>
            <div className="create-schedule-button">
              <span className="tooltiptext">Create Schedule</span>
              <OpenModalButton
                buttonText={<FaCalendarPlus />}
                modalComponent={<ScheduleForm />}
              />
            </div>
            {selectedId && (
              <>
                <div className="delete-schedule-button">
                  <span className="tooltiptext">Delete Schedule</span>
                  <OpenModalButton
                    buttonText={<FaTrashAlt />}
                    modalComponent={<ScheduleDelete id={currSchedule} />}
                  />
                </div>
                <div className="update-schedule-button">
                  <span className="tooltiptext">Update Schedule</span>
                  <OpenModalButton
                    buttonText={<MdEditCalendar />}
                    modalComponent={<ScheduleUpdate id={currSchedule} />}
                  />
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="no-schedules">
            <h2 className="no-schedule">
              Looks like you do not have any schedules...
            </h2>
            <div className="create-schedule-button">
              <span className="tooltiptext">Create Schedule</span>
              <OpenModalButton
                buttonText={<FaCalendarPlus />}
                modalComponent={<ScheduleForm />}
              />
            </div>
          </div>
        )}
        {Object.keys(currSchedule).length > 0 && dayAmount >= 1 && (
          <div className="schedule">
            <label className="schedule-days-title">Schedule</label>

            <h3>Choose a day to add meals to:</h3>
            <div className="days">
              {dayNames.map((dayName, index) => (
                <div
                  key={index}
                  className="day-div"
                  onClick={() => setDaySelected(dayName)}
                >
                  <label className="day-labels" key={dayName}>
                    {dayName}
                  </label>
                  <div
                    className="meal-list"
                    onDragOver={allowDrop}
                    onDrop={(e) => handleDrop(e, dayName)}
                  >
                    <ul className="recipe-names">
                      {currScheduleMeals[dayName] &&
                        Object.values(currScheduleMeals[dayName]).map(
                          (meal) => {
                            return (
                              <div>
                                {allFavs &&
                                  allFavs.map((recipe) => (
                                    <div>
                                      {recipe.id == meal.recipe_id && (
                                        <li
                                          key={meal.recipe_id}
                                          className="day-meal-img"
                                        >
                                          <img
                                            src={recipe.img}
                                            alt={meal.meal_name}
                                            className="day-meal-img"
                                          />
                                          <div className="day-meal-overlay">
                                            <div className="day-meal-overlay-text">
                                              {recipe.meal_name}
                                            </div>
                                          </div>
                                        </li>
                                      )}
                                    </div>
                                  ))}
                              </div>
                            );
                          }
                        )}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {daySelected && (
        <div>
          <div className="schedule-middle">
            <div className="link-buttons">
              <NavLink to={"/recipes"}>
                <button className="schedule-button">
                  Browse for more Recipes
                </button>
              </NavLink>
              {/* Might move later */}
              {/* <button className="schedule-button">Grocery List</button> */}
            </div>
          </div>

          <div className="schedule-bottom">
            <div className="fave-recipes">
              {/* <div className="filter-sorts">
                <select className="filter"></select>
                <select className="sort"></select>
                <input type="search" name="" id="" />
              </div> */}
              <div className="recipes">
                {allFavs.length > 0 ? (
                  allFavs.map((recipe) => {
                    // Check if the recipe is in the selectedDayMeals
                    const isSelected = selectedDayMeals.some(
                      (meal) => meal.recipe_id === recipe.id
                    );

                    return (
                      <div key={recipe.id} className="schedule-recipe">
                        <div
                          key={recipe.id}
                          className={`schedule-recipe-img ${
                            isSelected ? "selected" : ""
                          }`}
                          id={`recipe-${recipe.id}`}
                          draggable="true"
                          onDragStart={(e) => onDragStart(e, recipe)}
                        >
                          {recipe.img && (
                            <img
                              src={recipe.img}
                              alt={recipe.meal_name}
                              className="schedule-recipe-img"
                            />
                          )}
                          <div className="schedule-overlay">
                            <div className="schedule-overlay-text">
                              {recipe.meal_name}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
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
                <h2>Meals for {daySelected} :</h2>
                <div
                  className="meals"
                  onDragOver={allowDrop}
                  onDrop={(e) => handleDrop(e)}
                >
                  {selectedDayMeals &&
                    selectedDayMeals.map((meal) => {
                      const recipe = allFavs.find(
                        ({ id }) => id === meal.recipe_id
                      );
                      return recipe ? (
                        <div
                          id={`dropped-${meal.recipe_id}-${daySelected}`}
                          className="dropped-item"
                          key={meal.recipe_id}
                        >
                          <img
                            id={recipe.id}
                            src={recipe.img}
                            alt={recipe.meal_name}
                            className="schedule-recipe-img"
                            onClick={handleDeleteDayMeal}
                          />
                        </div>
                      ) : null;
                    })}
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
      )}
    </div>
  );
}

export default SchedulePage;
