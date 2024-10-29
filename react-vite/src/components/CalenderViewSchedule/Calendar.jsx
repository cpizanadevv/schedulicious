import { useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import './Calendar.scss'

function Calendar() {
  const calendarRef = useRef(null);

  const handleViewChange = (view) => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.changeView(view);
  };

  const handleDateClick = (info) => {
    // alert('Date clicked: ' + info.dateStr);
  };

  const handleSelect = (info) => {
    // alert('Selected from: ' + info.startStr + ' to: ' + info.endStr);
  };

  const handleDayCellClassNames = (arg) => {
    const today = new Date();
    const cellDate = new Date(arg.date);
    
    if (cellDate < today.setHours(0, 0, 0, 0)) {
        return ['past-date'];
    }
    return [];
};

  return (
    <div>
      <div>
        <button onClick={() => handleViewChange("dayGridMonth")}>
          Month View
        </button>
        <button onClick={() => handleViewChange("timeGridWeek")}>
          Week View
        </button>
        <button onClick={() => handleViewChange("timeGridDay")}>
          Day View
        </button>
        
      </div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        dateClick={handleDateClick}
        select={handleSelect}
        dayCellClassNames={handleDayCellClassNames}
        ref={calendarRef}
      />
    </div>
  );
}
export default Calendar;
