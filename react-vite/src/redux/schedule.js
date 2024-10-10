const SET_SCHEDULE = "schedule/setSchedule";
const SET_SCHEDULES = "schedules/setSchedules";
const SET_DAY_MEALS = "schedule/setDayMeals";
const SET_SCHEDULE_MEALS = "schedule/setScheduleMeals";
const REMOVE_SCHEDULE = "schedule/removeSchedule";
const REMOVE_SCHEDULE_MEAL = "schedule/removeScheduleMeal";
const RESET = 'RESET';

const setSchedule = (schedule) => ({
  type: SET_SCHEDULE,
  payload: schedule,
});
const setSchedules = (schedules) => ({
  type: SET_SCHEDULES,
  payload: schedules,
});
const setDayMeals = (scheduleMeal) => ({
  type: SET_DAY_MEALS,
  payload: scheduleMeal,
});
const setScheduleMeals = (scheduleMeal) => ({
  type: SET_SCHEDULE_MEALS,
  payload: scheduleMeal,
});
const removeSchedule = (schedule) => ({
  type: REMOVE_SCHEDULE,
  payload: schedule,
});
const removeScheduleMeal = (scheduleMeal) => ({
  type: REMOVE_SCHEDULE_MEAL,
  payload: scheduleMeal,
});
export const resetScheduleMeals = () => ({
  type: RESET,
});

export const getUserSchedules = () => async (dispatch) => {
  const res = await fetch("/api/schedules/all");

  if (res.ok) {
    const data = await res.json();
    dispatch(setSchedules(data));
    return data;
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const getDayMeals = (schedule_id,day_of_week) => async (dispatch) => {
    console.log("THUNK",schedule_id)
  const res = await fetch(`/api/schedules/${schedule_id}/${day_of_week}/meals`);

  if (res.ok) {
    const data = await res.json();
    dispatch(setDayMeals(data));
    console.log("thunk",data)
    return data;
  } else {
    const errors = await res.json();
    return errors;
  }
};
export const getScheduleMeals = (schedule_id) => async (dispatch) => {
    console.log("THUNK",schedule_id)
  const res = await fetch(`/api/schedules/${schedule_id}/meals`);

  if (res.ok) {
    const data = await res.json();
    dispatch(setScheduleMeals(data));
    return data;
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const createUserSchedules = (schedule) => async (dispatch) => {
  console.log('THUNK', schedule)
  const res = await fetch(`/api/schedules/new-schedule`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(schedule),
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(setSchedule(data));
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
    dispatch(setScheduleMeals(data));
    return data;
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const editUserSchedules = (schedule) => async (dispatch) => {
  console.log('thunk', schedule)
  const res = await fetch(`/api/schedules/${schedule.id}/edit-schedule`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(schedule),
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(setSchedule(data));
    return data;
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const deleteUserSchedule = (schedule) => async (dispatch) => {
  const res = await fetch(`/api/schedules/${schedule.id}/delete`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(schedule),
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(removeSchedule(data));
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
export const deleteMealDay = (schedule_day) => async (dispatch) => {
  const { schedule_id, day_of_week } = schedule_day;
  const res = await fetch(
    `/api/schedules/${schedule_id}/${day_of_week}/delete`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(schedule_day),
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

const initialState = { schedule: {}, schedules: {}, dayMeals: {} , scheduleMeals: {}};

function scheduleReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SCHEDULE:
      const newSchedule = action.payload;
      return {
        ...state,
        schedule: {
          ...state.schedule,
          ...action.payload,
        },
        schedules:{
          ...state.schedules,
          [newSchedule.id]: newSchedule
        }
      };
    case SET_SCHEDULES: {
      const newState = { ...state, schedules: {} };
      action.payload.forEach((schedule) => {
        newState.schedules[schedule.id] = schedule;
      });
      return newState;
    }
    case SET_DAY_MEALS:{
      const newState = {
        ...state,
        dayMeals: { ...state.dayMeals },
      };
      action.payload.forEach((meal) => {
        newState.dayMeals[meal.id] = meal;
      });
      return newState;
    }
    case SET_SCHEDULE_MEALS: {
      const newState = {
        ...state,
        scheduleMeals: { ...state.scheduleMeals },
      };
      action.payload.forEach((meal) => {
        const dayOfWeek = Object.keys(meal)[0];
        const recipeId = meal[dayOfWeek];

        if (!newState.scheduleMeals[dayOfWeek]) {
          newState.scheduleMeals[dayOfWeek] = [];
        }

        if (!newState.scheduleMeals[dayOfWeek].includes(recipeId)) {
          newState.scheduleMeals[dayOfWeek].push(recipeId);
        }
      });
      return newState;
    }
    case REMOVE_SCHEDULE: {
      const newState = { ...state };
      delete newState.schedules[action.payload.id];
      return newState;
    }
    case REMOVE_SCHEDULE_MEAL: {
      const newState = { ...state };
      delete newState.scheduleMeals[action.payload.id];
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
