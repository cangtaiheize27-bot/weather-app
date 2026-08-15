const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

export function formatWeekday(cityDate) {
  return WEEKDAYS[cityDate.getUTCDay()];
}

export function formatMonthDay(cityDate) {
  return `${cityDate.getUTCMonth() + 1}/${cityDate.getUTCDate()}`;
}

export function formatHour(cityDate) {
  return `${String(cityDate.getUTCHours()).padStart(2, '0')}:00`;
}

export function formatClock(cityDate) {
  const h = String(cityDate.getUTCHours()).padStart(2, '0');
  const m = String(cityDate.getUTCMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}
