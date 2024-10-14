import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { DateRange } from "react-date-range";
import "./ScheduleForm.scss";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { addDays, differenceInCalendarDays } from "date-fns";
import * as scheduleActions from '../../redux/schedule'

// ! Make into a modal
function ScheduleForm() {
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal} = useModal();
  const user = useSelector((state) => state.session.user);
  const schedules = useSelector((state) => state.schedule.schedules);
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });
  const allSchedules = Object.values(schedules)
  useEffect(() => {
    dispatch(scheduleActions.getUserSchedules());
  }, [dispatch]);

  const handleSelect = (ranges) => {
    const { startDate, endDate } = ranges.selection;
    const differenceInDays = differenceInCalendarDays(endDate, startDate);
    const today = new Date().toISOString().split("T")[0]

    if (differenceInDays > 6) {
      setErrors({ date: "You can only select a range of up to 7 days." });
      return;
    }
    if(startDate.toISOString().split("T")[0] < today){
      setErrors({ date: "You cannot choose a past date" })
      return;
    }
    

    const dateExists = allSchedules.some(schedule => {
      const scheduleStart = new Date(schedule.start_date);
      const scheduleEnd = new Date(schedule.end_date);
      return (startDate < scheduleEnd && endDate > scheduleStart);
    });

    if(dateExists){
      setErrors({ date: "One or more selected dates already exists in another schedule" });
      return;
    }

    setSelectionRange({
      ...ranges.selection,
      endDate: addDays(startDate, differenceInDays),
    });
    // Format to YYYY-MM-DD
    setStartDate(startDate.toISOString().split('T')[0]);
    setEndDate(endDate.toISOString().split('T')[0]); 
    setErrors({})
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!endDate || startDate == endDate){
      setErrors({ date: "Schedule must be more than 1 day" })
      return;
    }

    const newSchedule = {
      user_id: user.id,
      start_date: startDate,
      end_date: endDate,
    };
    const serverResponse = await dispatch(scheduleActions.createUserSchedules(newSchedule));

    if (serverResponse.errors) {
      setErrors(serverResponse.errors);
    } else {
      closeModal();
      dispatch(scheduleActions.getUserSchedules())
      setErrors({});
    }
  };

  // ! Before closing modal, Confirm user doesn't want to make more schedules
  return (
    <div className="create-schedule">
      <div className="site-name">
        <h1 className="signlog">Scheduliscious</h1>
      </div>
      <h2 className="modal-title">Create a schedule!</h2>
      <form onSubmit={handleSubmit} className="schedule-form">
        <div className="schedule-form-div">
            <label>Select days for the week:</label>
            <div
              className="calendar">
                <DateRange
              ranges={[selectionRange]}
              onChange={handleSelect}
            />
            <p>Start Date: {selectionRange.startDate.toDateString()}</p>
            <p>End Date: {selectionRange.endDate.toDateString()}</p>
            </div>
            
        </div>
            {errors.date && <p className="errors">{errors.date}</p>}
        <div className="schedule-submit">
        <button type="submit">Create your Meal Week</button>

        </div>
      </form>
    </div>
  );
}

export default ScheduleForm;
