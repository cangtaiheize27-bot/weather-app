import { formatHour } from '../lib/format';

export default function HourlyScroll({ items }) {
  if (!items?.length) return null;

  return (
    <section className="hourly">
      <h2 className="section-title">3時間ごとの詳細</h2>
      <div className="hourly__row">
        {items.map((item) => {
          const weather = item.weather[0];
          const iconUrl = `https://openweathermap.org/img/wn/${weather.icon}.png`;

          return (
            <div className="hour-card" key={item.dt}>
              <span className="hour-card__time">{formatHour(item.cityDate)}</span>
              <img src={iconUrl} alt={weather.description} className="hour-card__icon" />
              <span className="hour-card__temp">{Math.round(item.main.temp)}°C</span>
              <span className="hour-card__detail">湿度 {item.main.humidity}%</span>
              <span className="hour-card__detail">
                降水 {Math.round((item.pop ?? 0) * 100)}%
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
