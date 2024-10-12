import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as scheduleActions from "../../redux/schedule";
import "./Delete.scss";

function ScheduleDelete( schedule ) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDeleteSchedule = (e) => {
    e.preventDefault();
    dispatch(scheduleActions.deleteUserSchedule(schedule));
    dispatch(scheduleActions.getUserSchedules());
    closeModal()
  };
  const handleCancel = (e) => {
    e.preventDefault();
    closeModal()
  };

  console.log("DELETE",schedule);
  return (
    <div className="delete-modal">
      <h2>Are you sure you want to delete this schedule?</h2>
      <button onClick={handleDeleteSchedule}>Confirm</button>
      <button onClick={handleCancel}>Cancel</button>
    </div>
  );
}

export default ScheduleDelete;
