import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { DateRange } from "react-date-range";
import "./ScheduleForm.scss";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { addDays, differenceInCalendarDays } from "date-fns";
import * as scheduleActions from "../../redux/schedule";

// ! Make into a modal
function ScheduleUpdate(schedule) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const schedules = useSelector((state) => state.schedule.schedules);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [originalStart, setOriginalStart] = useState("");
  const [originalEnd, setOriginalEnd] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const [currSchedule, setCurrSchedule] = useState({});
  console.log("curr schedule", currSchedule);

  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });
  useEffect(() => {
    dispatch(scheduleActions.getUserSchedules());
    if (schedules) {
      setCurrSchedule(schedules[schedule.id]);
    }
    if (currSchedule) {
      const start = new Date(currSchedule.start_date);
      const end = new Date(currSchedule.end_date);
      setSelectionRange({
        startDate: start,
        endDate: end,
        key: "selection",
      });
      setOriginalStart(start);
      setOriginalEnd(end);
    }
    if (selectionRange) {
      setStartDate(selectionRange.startDate);
      setEndDate(selectionRange.endDate);
    }
  }, [dispatch, currSchedule.id]);

  const handleSelect = (ranges) => {
    const { startDate, endDate } = ranges.selection;
    const differenceInDays = differenceInCalendarDays(endDate, startDate);

    if (differenceInDays > 6) {
      setErrors({ date: "You can only select a range of up to 7 days." });
      return;
    }

    setSelectionRange({
      ...ranges.selection,
      endDate: addDays(startDate, differenceInDays),
    });
    // Format to YYYY-MM-DD
    setStartDate(startDate);
    setEndDate(endDate);
    setErrors({});
  };
  // console.log('og start',originalStart.toISOString().split('T')[0],'new start',startDate)
  // console.log('og end',originalEnd.toISOString().split('T')[0],'new end',endDate)

  const dayNames = async (start, end) => {
    console.log('start',start)
    console.log('end',end)
    const days = Array.from(
      { length: (end - start) / (1000 * 60 * 60 * 24) + 1 },
      (_, index) => {
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
        const currDay = dayNames[currentDate.getDay()];
        return {day:currDay,date:currentDate
            .toISOString()
            .split("T")[0]}
      }
    );
    console.log("days", days);
    return days
  };

  const removeDays = async (oldStart, newStart, oldEnd, newEnd) => {
    const oldDays = await dayNames(oldStart, oldEnd);
    const newDays = await dayNames(newStart, newEnd);
    console.log("old", oldDays);
    console.log("new", newDays);

    oldDays.forEach((oldDay) => {
        console.log('day', oldDay,'is in',newDays.includes(oldDay))
      if (!newDays.includes(oldDay)) {
        const toDelete = {
          schedule_id: schedule.id,
          day_of_week: oldDay.day,
        };
        console.log(toDelete)
        dispatch(scheduleActions.deleteMealDay(toDelete));
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    removeDays(originalStart, startDate, originalEnd, endDate);

    const newSchedule = {
      schedule_id: schedule.id,
      start_date: startDate,
      end_date: endDate,
    };

    const serverResponse = await dispatch(
      scheduleActions.editUserSchedules(newSchedule)
    );

    if (serverResponse.errors) {
      setErrors(serverResponse.errors);
    } else {
      closeModal();
      setErrors({});
    }
  };

  // ! Before closing modal, Confirm user doesn't want to make more schedules
  return (
    <div className="create-schedule">
      <div className="site-name">
        <h1 className="signlog">Scheduliscious</h1>
      </div>
      <h2 className="modal-title">Update your schedule!</h2>
      <form onSubmit={handleSubmit} className="schedule-form">
        <div className="schedule-form-div">
          <label>Select days for the week:</label>
          <div className="calendar">
            <DateRange ranges={[selectionRange]} onChange={handleSelect} />
            <p>Start Date: {selectionRange.startDate.toDateString()}</p>
            <p>End Date: {selectionRange.endDate.toDateString()}</p>
          </div>
        </div>
        {errors.date && <p className="errors">{errors.date}</p>}
        <div className="schedule-submit">
          <button type="submit">Update</button>
        </div>
      </form>
    </div>
  );
}

export default ScheduleUpdate;
