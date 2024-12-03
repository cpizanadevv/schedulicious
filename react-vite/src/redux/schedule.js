const SET_DAY_MEALS = "schedule/setDayMeals";
const SET_MONTH_MEALS = "schedule/setMonthMeals";
const ADD_DAY_MEAL = "schedule/addDayMeal";
const REMOVE_SCHEDULE_MEAL = "schedule/removeScheduleMeal";
const RESET = "RESET";

const setDayMeals = (scheduleMeal) => ({
  type: SET_DAY_MEALS,
  payload: scheduleMeal,
});

const setMonthMeals = (meals) => ({
  type: SET_MONTH_MEALS,
  payload: meals,
});
const addDayMeal = (scheduleMeal) => ({
  type: SET_DAY_MEALS,
  payload: scheduleMeal,
});
const removeScheduleMeal = (scheduleMeal,src) => ({
  type: REMOVE_SCHEDULE_MEAL,
  payload: {scheduleMeal, src}
});
export const resetScheduleMeals = () => ({
  type: RESET,
});

export const getDayMeals = (date, day_of_week) => async (dispatch) => {
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
export const getAllMeals = (month, year) => async (dispatch) => {
  const res = await fetch(`/api/schedules/${month}/${year}/meals`);
  const data = await res.json();

  if (res.ok) {
    dispatch(setMonthMeals(data));
  } else {
    return data;
  }
};

export const createScheduleMeals = (meal) => async (dispatch) => {
  const res = await fetch(`/api/schedules/${meal.recipe_id}/${meal.date}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(meal),
  });
  const data = await res.json();

  if (res.ok) {
    dispatch(addDayMeal(data));
  } else {
    return data;
  }
};

export const deleteScheduleMeal = (date, recipe_id,src) => async (dispatch) => {
  // console.log('date', date)
  // console.log('recipe_id', recipe_id)
  const res = await fetch(`/api/schedules/${date}/${recipe_id}/delete`, {
    method: "DELETE",
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(removeScheduleMeal(data,src));
  } else {
    const errors = await res.json();
    return errors;
  }
};

const initialState = { schedules: {}, dayMeals: {}, scheduleMeals: {} };

function scheduleReducer(state = initialState, action) {
  switch (action.type) {
    case SET_MONTH_MEALS:
      return {
        ...state,
        scheduleMeals: action.payload,
      };
    case SET_DAY_MEALS:
      return {
        ...state,
        dayMeals: action.payload,
      };
    case ADD_DAY_MEAL:
      return {
        ...state,
        dayMeals: {
          ...state.dayMeals,
          ...action.payload,
        },
      };
    case REMOVE_SCHEDULE_MEAL: {
      const { scheduleMeal, src } = action.payload;
      console.log('action.payload', action.payload)

      if (src === "day") {
        const { [scheduleMeal.recipe_id]:_, ...removed } = state.dayMeals;
        return {
          ...state,
          dayMeals: { ...removed },
        };
      } else {
        const { [scheduleMeal.recipe_id]: _, ...removed } = state.scheduleMeals;
        return {
          ...state,
          scheduleMeals: { ...removed },
        };
      }
    }
    case RESET: {
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
