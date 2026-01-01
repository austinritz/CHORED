import { useMemo } from 'react';
import Task from './Task';
import "../assets/components/Calendar.css";

/* Calendar component
- Shows a calendar view of the chores for the household
- Each day shows the chores for the day, with earliest near the top
- Each task in the calendar is clickable and opens the TaskModal
- Each task in the calendar is color coded to indicate the household it belongs to
*/
const Calendar = ({ chores = [] }) => {
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get current week (Sunday to Saturday)
  const currentWeek = useMemo(() => {
    const today = new Date();
    const day = today.getDay(); // 0 = Sunday, 6 = Saturday
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - day); // Go back to Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      week.push(date);
    }
    return week;
  }, []);

  // Group chores by day
  const choresByDay = useMemo(() => {
    const grouped = {};
    weekDays.forEach((_, index) => {
      grouped[index] = [];
    });

    chores.forEach((chore) => {
      if (!chore.nextOccurrence) return;
      
      const choreDate = new Date(chore.nextOccurrence);
      const dayIndex = currentWeek.findIndex((weekDate) => {
        return (
          weekDate.getDate() === choreDate.getDate() &&
          weekDate.getMonth() === choreDate.getMonth() &&
          weekDate.getFullYear() === choreDate.getFullYear()
        );
      });

      if (dayIndex !== -1) {
        grouped[dayIndex].push(chore);
      }
    });

    // Sort chores within each day by time (earliest first)
    Object.keys(grouped).forEach((dayIndex) => {
      grouped[dayIndex].sort((a, b) => {
        const timeA = new Date(a.nextOccurrence).getTime();
        const timeB = new Date(b.nextOccurrence).getTime();
        return timeA - timeB;
      });
    });

    return grouped;
  }, [chores, currentWeek]);

  const formatDate = (date) => {
    return date.getDate();
  };

  return (
    <div className="Calendar">
      <div className="Calendar-header">
        {weekDays.map((day, index) => (
          <div key={index} className="Calendar-day-header">
            <div className="Calendar-day-name">{day}</div>
            <div className="Calendar-day-number">{formatDate(currentWeek[index])}</div>
          </div>
        ))}
      </div>
      <div className="Calendar-body">
        {weekDays.map((_, dayIndex) => (
          <div key={dayIndex} className="Calendar-day-column">
            {choresByDay[dayIndex]?.map((chore) => (
              <Task key={chore._id} chore={chore} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;