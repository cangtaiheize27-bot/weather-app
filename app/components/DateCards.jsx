import { formatMonthDay, formatWeekday } from '../lib/format';

export default function DateCards({ days, selectedDate, onSelect }) {
  if (!days.length) return null;

  return (
    <section className="dates">
      <h2 className="section-title">5日間の予報</h2>
      <div className="dates__row">
        {days.map((day) => {
          const rep = day.representative;
          const iconUrl = rep
            ? `https://openweathermap.org/img/wn/${rep.weather[0].icon}.png`
            : null;
          const isSelected = day.date === selectedDate;

          return (
            <button
              key={day.date}
              type="button"
              className={`date-card${isSelected ? ' date-card--selected' : ''}`}
              onClick={() => onSelect(day.date)}
            >
              <span className="date-card__weekday">{formatWeekday(rep.cityDate)}</span>
              <span className="date-card__date">{formatMonthDay(rep.cityDate)}</span>
              {iconUrl && <img src={iconUrl} alt="" className="date-card__icon" />}
              <span className="date-card__temps">
                <span className="date-card__max">{Math.round(day.max)}°</span>
                <span className="date-card__min">{Math.round(day.min)}°</span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
