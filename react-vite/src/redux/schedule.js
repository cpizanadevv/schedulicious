const SET_SCHEDULE = "schedule/setSchedule";
const SET_SCHEDULES = "schedules/setSchedules";
const SET_SCHEDULE_MEALS = "schedule/setScheduleMeal";
const REMOVE_SCHEDULE = "schedule/removeSchedule";
const REMOVE_SCHEDULE_MEAL = "schedule/removeScheduleMeal";

const setSchedule = (schedule) => ({
    type: SET_SCHEDULE,
    payload: schedule
})
const setSchedules = (schedules) => ({
    type: SET_SCHEDULES,
    payload: schedules
})
const setScheduleMeals = (scheduleMeal) => ({
    type: SET_SCHEDULE_MEALS,
    payload: scheduleMeal
})
const removeSchedule = (schedule) => ({
    type: REMOVE_SCHEDULE,
    payload: schedule
})
const removeScheduleMeal = (scheduleMeal) => ({
    type: REMOVE_SCHEDULE_MEAL,
    payload: scheduleMeal
})

export const getUserSchedules = () => async (dispatch) => {
    const res = await fetch('/api/schedules/all');

    if (res.ok) {
        const data = await res.json();
        dispatch(setSchedules(data))
        return data
    }else {
        const errors = await res.json();
        return errors;
    }
}

export const getScheduleMeals = (schedule_id, day) => async (dispatch) => {
    const res = await fetch(`/api/schedules/${schedule_id}/${day}`)

    if(res.ok) {
        const data = await res.json();
        dispatch(setScheduleMeals(data))
        return data
    }else {
        const errors = await res.json();
        return errors;
    }
}

export const createUserSchedules = (schedule) => async (dispatch) => {
    const res = await fetch(`/api/schedules/new-schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(schedule),
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(setSchedule(data))
        return data
    }else {
        const errors = await res.json();
        console.log('THIS IS RES', errors)
        return errors;
    }
}


export const editUserSchedules = (schedule) => async (dispatch) => {
    const res = await fetch(`/api/schedules/${schedule.id}/edit-schedule`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(schedule),
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(setSchedule(data))
        return data
    }else {
        const errors = await res.json();
        return errors;
    }
}

export const deleteUserSchedule = (schedule) => async (dispatch) => {
    const res = await fetch(`/api/schedules/${schedule.id}/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(schedule),
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(removeSchedule(data))
        return data
    }else {
        const errors = await res.json();
        return errors;
    }
}

export const deleteScheduleMeal = (schedule_day) => async (dispatch) => {
    const {schedule_id, recipe_id,day_of_week} = schedule_day
    const res = await fetch(`/api/schedules/${schedule_id}/${recipe_id}/${day_of_week}/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(schedule),
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(removeScheduleMeal(data))
        return data
    }else {
        const errors = await res.json();
        return errors;
    }
}


const initialState = { schedule: {}, schedules: {}, scheduleMeals: {} };

function scheduleReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SCHEDULE:
      return {
        ...state,
        schedule: {
          ...state.schedule,
           ...action.payload ,
        },
      };
    case SET_SCHEDULES:{
        const newState = { ...state, schedules: {} };
        action.payload.forEach((schedule) => {
          newState.schedules[schedule.id] = schedule;
        });
        return newState;
      };
    case SET_SCHEDULE_MEALS:
      return {
        ...state,
        scheduleMeals: {
          ...state.scheduleMeals,
           ...action.payload ,
        },
      };
    case REMOVE_SCHEDULE: {
      const newState = { ...state };
      delete newState.schedule[action.payload.id];
      return newState;
    }
    case REMOVE_SCHEDULE_MEAL: {
      const newState = { ...state };
      delete newState.scheduleMeals[action.payload.id];
      return newState;
    }
    default:
      return state;
  }
}

export default scheduleReducer;