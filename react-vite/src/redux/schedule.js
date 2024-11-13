
const SET_DAY_MEALS = "schedule/setDayMeals";
const ADD_DAY_MEAL = "schedule/addDayMeal";
const REMOVE_SCHEDULE_MEAL = "schedule/removeScheduleMeal";
const RESET = 'RESET';

const setDayMeals = (scheduleMeal) => ({
  type: SET_DAY_MEALS,
  payload: scheduleMeal,
});
const addDayMeal = (scheduleMeal) => ({
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

export const createScheduleMeals = (meal) => async (dispatch) => {
  const res = await fetch(
    `/api/schedules/${meal.recipe_id}/${meal.date}/add`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(meal),
    }
  );
  const data = await res.json();

  if (res.ok) {
    dispatch(addDayMeal(data));
  } else {
    return data;
  }
};

export const deleteScheduleMeal = (date,recipe_id) => async (dispatch) => {
  console.log('date', date)
  console.log('recipe_id', recipe_id)
  const res = await fetch(`/api/schedules/${date}/${recipe_id}/delete`,
    {
      method: "DELETE"
    }
  );

  if (res.ok) {
    const data = await res.json();
    dispatch(removeScheduleMeal(data));
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
    case ADD_DAY_MEAL:
      return {
        ...state,
        dayMeals:{
          ...state.dayMeals,
          ...action.payload
        }
      }
    case REMOVE_SCHEDULE_MEAL: {
      const { [action.payload.recipe_id]: _, ...removed } = state.dayMeals;
      return {
        ...state,
        dayMeals:{ ...removed}
      }
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
