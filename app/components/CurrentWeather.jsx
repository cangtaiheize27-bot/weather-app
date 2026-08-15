import { formatClock } from '../lib/format';

export default function CurrentWeather({ current, label, cityNow, nextPop }) {
  if (!current) return null;

  const weather = current.weather?.[0];
  const iconUrl = weather
    ? `https://openweathermap.org/img/wn/${weather.icon}@2x.png`
    : null;

  return (
    <section className="current">
      <div className="current__top">
        <div>
          <p className="current__place">{label || current.name}</p>
          <p className="current__time">現地時刻 {formatClock(cityNow)}</p>
        </div>
        {iconUrl && (
          <img className="current__icon" src={iconUrl} alt={weather.description} />
        )}
      </div>

      <div className="current__temp">{Math.round(current.main.temp)}°C</div>
      <p className="current__desc">{weather?.description}</p>

      <div className="current__stats">
        <div className="current__stat">
          <span className="current__stat-label">体感温度</span>
          <span>{Math.round(current.main.feels_like)}°C</span>
        </div>
        <div className="current__stat">
          <span className="current__stat-label">湿度</span>
          <span>{current.main.humidity}%</span>
        </div>
        <div className="current__stat">
          <span className="current__stat-label">降水確率</span>
          <span>{nextPop != null ? Math.round(nextPop * 100) : '-'}%</span>
        </div>
      </div>
    </section>
  );
}
