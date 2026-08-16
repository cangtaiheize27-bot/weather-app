import { getClothingAdvice } from '../lib/advice';

export default function ClothingAdvice({ temp, pop }) {
  if (temp == null) return null;

  const advice = getClothingAdvice({ temp, pop });

  return (
    <div className="advice">
      {advice.map((item) => (
        <span className="advice__chip" key={item.text}>
          <span className="advice__icon">{item.icon}</span>
          {item.text}
        </span>
      ))}
    </div>
  );
}
