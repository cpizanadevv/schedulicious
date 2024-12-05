function setDays(view) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const lastDay = new Date(year, month, daysInMonth).getDay();
  
  const days = [];

  if (firstDay !== 0) {
    let tmpPrev = daysInPrevMonth;
    let tmpStart = daysInPrevMonth - (firstDay - 1);
    for (let i = tmpStart; i <= tmpPrev; i++) {
      days.push(i);
    }
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }
  if (lastDay !== 6) {
    const leftOver = 6 - lastDay;
    for (let i = 1; i <= leftOver; i++) {
      days.push(i);
    }
  }
  switch (view) {
    case 'monthView':
        return days;
    case 'weekView':
        const tmpWeek = days.slice(0,7)
        return tmpWeek;
    case 'dayView':
        const tmpDay = days.slice(0,1)
        return tmpDay;
    default:
        return days;
  }
}

export default setDays;
