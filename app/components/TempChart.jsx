import { formatHour } from '../lib/format';

const WIDTH = 600;
const HEIGHT = 160;
const PAD_X = 24;
const PAD_Y = 28;

export default function TempChart({ items }) {
  if (!items?.length) return null;

  const temps = items.map((item) => item.main.temp);
  const max = Math.max(...temps);
  const min = Math.min(...temps);
  const range = max - min || 1;

  const stepX = (WIDTH - PAD_X * 2) / (Math.max(items.length - 1, 1));

  const points = items.map((item, index) => {
    const x = PAD_X + index * stepX;
    const y = PAD_Y + (1 - (item.main.temp - min) / range) * (HEIGHT - PAD_Y * 2);
    return { x, y, item };
  });

  const linePath = points
    .map((p, index) => `${index === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${HEIGHT - PAD_Y} L ${points[0].x.toFixed(1)} ${HEIGHT - PAD_Y} Z`;

  return (
    <section className="temp-chart">
      <h2 className="section-title">気温の推移</h2>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="temp-chart__svg"
        role="img"
        aria-label="3時間ごとの気温の折れ線グラフ"
      >
        <path d={areaPath} className="temp-chart__area" />
        <path d={linePath} className="temp-chart__line" />
        {points.map(({ x, y, item }) => (
          <g key={item.dt}>
            <circle cx={x} cy={y} r="3.5" className="temp-chart__dot" />
            <text x={x} y={y - 10} textAnchor="middle" className="temp-chart__label">
              {Math.round(item.main.temp)}°
            </text>
            <text x={x} y={HEIGHT - 6} textAnchor="middle" className="temp-chart__hour">
              {formatHour(item.cityDate)}
            </text>
          </g>
        ))}
      </svg>
    </section>
  );
}
