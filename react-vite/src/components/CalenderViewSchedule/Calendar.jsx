import { useState } from "react";

function Calendar() {
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const today = new Date().toISOString().split("T")[0];
  const [currMonth, setCurrMonth]
  const [numOfDays, setNumOfDays] = useState()

  return (
    <div>
      {today}
      <div className="calendar">
        <div className="day-names">
          {dayNames && dayNames.map((day) => <div>{day}</div>)}
        </div>
        <div className="days">
          <div>{today && }</div>
        </div>
      </div>
    </div>
  );
}
export default Calendar;
