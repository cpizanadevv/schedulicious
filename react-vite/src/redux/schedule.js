const SET_CURR_SCHEDULE = "schedule/setCurrSchedule";
const SET_CURR_SCHEDULE_MEALS = "schedule/setCurrScheduleMeals";
const SET_SCHEDULES = "schedules/setSchedules";
const SET_DAY_MEALS = "schedule/setDayMeals";
const REMOVE_SCHEDULE = "schedule/removeSchedule";
const REMOVE_SCHEDULE_MEAL = "schedule/removeScheduleMeal";
const RESET = 'RESET';

const setDayMeals = (scheduleMeal) => ({
  type: SET_DAY_MEALS,
  payload: scheduleMeal,
});
const removeScheduleMeal = (scheduleMeal) => ({
  type: REMOVE_SCHEDULE_MEAL,
  payload: scheduleMeal,
});
export const resetScheduleMeals = () => ({
  type: RESET,
});

export const getDayMeals = (date,day_of_week) => async (dispatch) => {
  const res = await fetch(`/api/schedules/${date}/${day_of_week}/meals`);

  if (res.ok) {
    const data = await res.json();
    dispatch(setDayMeals(data));
    return data;
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const createScheduleMeals = (meals) => async (dispatch) => {
  const res = await fetch(
    `/api/schedules/${meals.recipe_id}/${meals.schedule_id}/add-meal`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(meals),
    }
  );

  if (res.ok) {
    const data = await res.json();
    dispatch(setCurrScheduleMeals(data));
    return data;
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const deleteScheduleMeal = (schedule_day) => async (dispatch) => {
  const { schedule_id, recipe_id, day_of_week } = schedule_day;
  const res = await fetch(
    `/api/schedules/${schedule_id}/${recipe_id}/${day_of_week}/delete`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(schedule_day),
    }
  );

  if (res.ok) {
    const data = await res.json();
    dispatch(removeScheduleMeal(data));
    return data;
  } else {
    const errors = await res.json();
    return errors;
  }
};

const initialState = {  schedules: {}, dayMeals: {} , scheduleMeals: {}};

function scheduleReducer(state = initialState, action) {
  switch (action.type) {
    case SET_DAY_MEALS:
      return {
        ...state,
        dayMeals:action.payload
      }
    case REMOVE_SCHEDULE_MEAL: {
      const newState = { ...state };
      if (newState.scheduleMeals) {
        newState.scheduleMeals[action.payload.day_of_week] = newState.scheduleMeals[action.payload.day_of_week].filter(
          (meal) => meal.recipe_id !== action.payload.recipe_id
        );
      }
      return newState;
    }
    case RESET:{
      return {
        ...state,
        scheduleMeals: {},
        dayMeals: {},
      };
    }
    default:
      return state;
  }
}

export default scheduleReducer;
