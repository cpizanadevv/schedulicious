import { useState } from "react";
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

  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

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
    setStartDate(startDate.toISOString().split('T')[0]);
    setEndDate(endDate.toISOString().split('T')[0]); 
    setErrors({})
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
