const SET_CURR_SCHEDULE = "schedule/setCurrSchedule";
const SET_CURR_SCHEDULE_MEALS = "schedule/setCurrScheduleMeals";
const SET_SCHEDULES = "schedules/setSchedules";
const SET_DAY_MEALS = "schedule/setDayMeals";
const REMOVE_SCHEDULE = "schedule/removeSchedule";
const REMOVE_SCHEDULE_MEAL = "schedule/removeScheduleMeal";
const RESET = 'RESET';

const setCurrSchedule = (schedule) => ({
  type: SET_CURR_SCHEDULE,
  payload: schedule,
});
const setCurrScheduleMeals = (scheduleMeal) => ({
  type: SET_CURR_SCHEDULE_MEALS,
  payload: scheduleMeal,
});
const setSchedules = (schedules) => ({
  type: SET_SCHEDULES,
  payload: schedules,
});
const setDayMeals = (scheduleMeal) => ({
  type: SET_DAY_MEALS,
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

export const getCurrSchedule = (schedule_id) => async (dispatch) => {
  const res = await fetch(`/api/schedules/${schedule_id}`);

  if (res.ok) {
    const data = await res.json();
    dispatch(setCurrSchedule(data));
    return data;
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const getDayMeals = (schedule_id,day_of_week) => async (dispatch) => {
  const res = await fetch(`/api/schedules/${schedule_id}/${day_of_week}/meals`);

  if (res.ok) {
    const data = await res.json();
    dispatch(setDayMeals(data));
    return data;
  } else {
    const errors = await res.json();
    return errors;
  }
};
export const getCurrScheduleMeals = (schedule_id) => async (dispatch) => {
  const res = await fetch(`/api/schedules/${schedule_id}/meals`);

  if (res.ok) {
    const data = await res.json();
    dispatch(setCurrScheduleMeals(data));
    return data;
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const createUserSchedules = (schedule) => async (dispatch) => {
  const res = await fetch(`/api/schedules/new-schedule`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(schedule),
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(setCurrSchedule(data));
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

export const editUserSchedules = (schedule) => async (dispatch) => {
  const res = await fetch(`/api/schedules/${schedule.id}/edit-schedule`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(schedule),
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(setCurrSchedule(data));
    return data;
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const deleteUserSchedule = (schedule) => async (dispatch) => {
  const res = await fetch(`/api/schedules/${schedule.id.id}/delete`, {
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

const initialState = { currSchedule: {}, schedules: {}, dayMeals: {} , scheduleMeals: {}};

function scheduleReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CURR_SCHEDULE:
      return {
        ...state,
        currSchedule: {
          ...action.payload,
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
      const newState = { ...state, dayMeals: {} };
      action.payload.forEach((meal) => {
        newState.dayMeals[meal.recipe_id] = meal;
      });
      return newState;
    }
    case SET_CURR_SCHEDULE_MEALS: {
      const newState = { ...state, scheduleMeals: {} };
      Object.keys(action.payload).forEach(day => {
        newState.scheduleMeals[day] = action.payload[day];
      });
      return newState;
    }
    case REMOVE_SCHEDULE: {
      const newState = { ...state };
      if (newState.schedules) {
        delete newState.schedules[action.payload.id];
        newState.currSchedule = {};
      }
      return newState;
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
