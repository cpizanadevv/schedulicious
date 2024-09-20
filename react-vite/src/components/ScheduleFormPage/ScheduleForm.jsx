import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";

// ! Make into a modal
function ScheduleForm() {
    const dispatch = useDispatch();
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();
    const user = useSelector((state) => state.session.user)
    
    const handleSubmit = async (e) => {
      e.preventDefault();

      newSchedule = {
        user_id:user.id,
        start_date:startDate,
        end_date: endDate
      }
  
      const serverResponse = await dispatch(newSchedule);
  
      if (serverResponse) {
        setErrors(serverResponse);
      } else {
        closeModal();
        setErrors({});
      }
    };
    
    // ! Before closing modal, Confirm user doesn't want to make more schedules
  return (
    <div className="schedule-page">
      <form onSubmit={handleSubmit}>
        <h3>Select a start date for you week:</h3>
        <input type="date" name="" id="" />
        {errors.startDate && <p>{errors.startDate}</p>}
        <h3>Select a end date for you week:</h3>
        <input type="date" name="" id="" />
        {errors.endDate && <p>{errors.endDate}</p>}
        <button type="submit">Create your Meal Week</button>
      </form>
    </div>
  );
}

export default ScheduleForm;
