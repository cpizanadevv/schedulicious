
// ! Make into a modal

function ScheduleForm() {
    
    const handleScheduleCreation = () => {

    }
    // ! Before closing modal, Confirm user doesn't want to make more schedules
  return (
    <div className="schedule-page">
      <form onSubmit={handleScheduleCreation}>
        <h3>Select a start date for you week:</h3>
        <input type="date" name="" id="" />
        <h3>Select a end date for you week:</h3>
        <input type="date" name="" id="" />
        <button type="submit">Create your Meal Week</button>
      </form>
    </div>
  );
}

export default ScheduleForm;
