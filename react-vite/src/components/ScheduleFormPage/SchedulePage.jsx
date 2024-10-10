import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import ScheduleForm from "./ScheduleForm";
import ScheduleUpdate from "./ScheduleUpdate";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import "./SchedulePage.scss";
import * as scheduleActions from "../../redux/schedule";
import * as recipeActions from "../../redux/recipe";

function SchedulePage() {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.session.user);
  const schedules = useSelector((store) => store.schedule.schedules);
  const favorites = useSelector((store) => store.recipe.recipes);
  const scheduleMeals = useSelector((store) => store.schedule.scheduleMeals);
  const dayMeals = useSelector((store) => store.schedule.dayMeals);

  console.log("schedules ", schedules);
  console.log("meals:", scheduleMeals);

  const allFavs = Object.values(favorites);
  const allSchedules = Object.values(schedules).map((schedule) => ({
    ...schedule,
    formattedStartDate: new Date(schedule.start_date)
      .toISOString()
      .split("T")[0],
  }));
  const selectedDayMeals = Object.values(dayMeals);

  const [errors, setErrors] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState({});
  const [selectedId, setSelectedId] = useState();
  const [startDate, setStartDate] = useState();

  //Day amount - to set how many day divs
  //Day names - to set names for day divs to be accessed by day selected
  // DaySelected - tracks day_of_week for submitting to backend
  const [dayAmount, setDayAmount] = useState(0);
  const [dayNames, setDayNames] = useState([]);
  const [daySelected, setDaySelected] = useState("");

  // Arr of dayMeal objs to be sent to backend when finialized
  const [mealPlan, setMealPlan] = useState([]);
console.log(selectedId)
  // ! UseEffect
  // Get User's schedules and favorite recipes
  useEffect(() => {
    dispatch(scheduleActions.getUserSchedules());
    dispatch(recipeActions.getAllFavs());
    if(daySelected){
      dispatch(scheduleActions.getDayMeals(selectedSchedule.id,daySelected));
    }

  }, [dispatch,scheduleMeals]);

  useEffect(() => {
    if (selectedId) {
      dispatch(scheduleActions.getScheduleMeals(selectedId));
    }
  }, [dispatch,selectedId]);
  console.log("day:", daySelected);

  const handleScheduleChange = (e) => {
    const currScheduleId = e.target.value;
    const currSchedule = allSchedules.find(
      (s) => s.id === Number(currScheduleId)
    );

    dispatch(scheduleActions.resetScheduleMeals());
    if (currSchedule) {
      setSelectedSchedule(currSchedule);
      setSelectedId(currScheduleId);

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
    const recipeId = e.dataTransfer.getData("recipeId");
    

    // console.log("Dropped recipe ID:", recipeId);

    if (recipeId) {
      const draggedRecipe = document.getElementById(`recipe-${recipeId}`);
      if (draggedRecipe) {
        // Clone the dragged recipe and append it to the target
        const clone = draggedRecipe.cloneNode(true);
        clone.classList.remove("schedule-recipe-img");
        clone.classList.add("dropped-item");
        
        e.target.appendChild(clone);
  
        // Update the meal plan state with the dropped recipe
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
      }
    }
  };

  // !    SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Mealplan", mealPlan);
    for (let i = 0; i < mealPlan.length; i++) {
      const day = mealPlan[i].day_of_week;
      const recipeId = mealPlan[i].recipeId;
  
      if (scheduleMeals[day]?.includes(recipeId)){
        continue;
      }
      const dispatchMeal = dispatch(
        scheduleActions.createScheduleMeals(mealPlan[i])
      );
      if (dispatchMeal.errors) {
        setErrors(dispatchMeal.errors);
      }
    }

    if (errors) {
      return errors;
    }
    setMealPlan([])
    draggedRecipe.setAttribute("draggable", "true");
    draggedRecipe.classList.remove("selected");
  };

  return (
    <div className="schedule-page">
      <div className="banner">
        <img src="https://aa-aws-proj-bucket.s3.us-west-2.amazonaws.com/Designer+(6).png" />
      </div>
      <div className="schedule-top">
        {allSchedules.length  > 0 ? (
          <div className="schedule-select">
            <h2>Choose a schedule</h2>
            <select
              onChange={handleScheduleChange}
              className="schedule-selector"
            >
              <option value="">Choose</option>
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
            <h3>Choose a day to add meals to:</h3>
            <div className="days">
              {dayNames.map((dayName, index) => (
                <div
                  key={index}
                  className="day-div"
                  onClick={() => setDaySelected(dayName)}
                >
                  <label className="day-labels" key={dayName}>{dayName}</label>
                  <div className="meal-list">
                    {favorites && scheduleMeals[dayName] &&
                      scheduleMeals[dayName].map((recipeId) => {
                        const recipe = allFavs[recipeId];
                        // console.log('html',recipeId)
                        return (
                          <ul key={recipeId} className="recipe-name">
                            <li>{recipe ? recipe.meal_name : ''}</li>
                          </ul>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
            {!daySelected && (
            <div className="link-buttons">
              <div className="schedule-form-modal">
                <OpenModalButton
                  buttonText="Create Schedule"
                  modalComponent={<ScheduleForm className="schedule-modal" />}
                />
              </div>
              <div className="update-schedule">
                <OpenModalButton
                    buttonText="Update Schedule"
                    modalComponent={<ScheduleUpdate id={selectedId}/>}
                  />  
              </div>
              <div className="delete-schedule">
                {/* NEED DELETE MODAL */}
                <FaTrashAlt />
              </div>
            </div>

            )}
          </div>
        )}
      </div>
      {daySelected && (
        <div>
          <div className="schedule-middle">
            <div className="link-buttons">
              <button className="schedule-button">
                Browse for more Recipes
              </button>
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
              <div className="recipes">
                {allFavs &&
                  allFavs.map((recipe) => (
                    <div 
                    key={recipe.id}className="schedule-recipe">
                      <div
                      key={recipe.id}
                        className="schedule-recipe-img"
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
                          <div className="schedule-overlay-text">{recipe.meal_name}</div>
                        </div>
                      </div>
                    </div>
                  ))}
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
              {" "}
              Finalize Meal Day
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SchedulePage;
