import { useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import "./Calendar.scss";


function Calendar() {
  const calendarRef = useRef(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleViewChange = (view) => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.changeView(view);
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleWeekHover = (weekStart, weekEnd) => {
    if (isEditMode) {
      
    }
  };

  const handleDateClick = (info) => {
    // alert('Date clicked: ' + info.dateStr);
  };

  const handleSelect = (info) => {
    // alert('Selected from: ' + info.startStr + ' to: ' + info.endStr);
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
      <div>
      <button onClick={toggleEditMode}>
        {isEditMode ? "Exit Edit Mode" : "Enter Edit Mode"}
      </button>
      </div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        dateClick={handleDateClick}
        select={handleSelect}
        ref={calendarRef}
        views={{
          timeGridWeek: {
            slotLabelFormat: [],
            slotMinTime: "24:00:00",
            slotMaxTime: "24:00:00",
          },
          timeGridDay: {
            slotLabelFormat: [],
            slotMinTime: "24:00:00",
            slotMaxTime: "24:00:00",
          },
        }}
        dayCellContent={(arg) => {
          const { date } = arg;
          const startOfWeek = new Date(date);
          startOfWeek.setDate(date.getDate() - date.getDay());
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);

          return (
            <div
              onMouseEnter={() => handleWeekHover(startOfWeek, endOfWeek)}
              className="day-cell-content"
            >
              {date.getDate()}
              {isEditMode && (
                <div className="week-actions">
                  <button onClick={() => addRecipes(startOfWeek, endOfWeek)}>
                    Add Recipes
                  </button>
                  <button onClick={() => clearRecipes(startOfWeek, endOfWeek)}>
                    Clear Recipes
                  </button>
                </div>
              )}
            </div>
          );
        }}
      />
    </div>
  );
}
export default Calendar;
