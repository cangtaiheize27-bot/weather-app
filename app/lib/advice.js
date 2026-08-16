// 気温と降水確率から、服装・持ち物の一言アドバイスを組み立てる。

export function getClothingAdvice({ temp, pop }) {
  const advice = [];

  if (temp < 10) {
    advice.push({ icon: '🧥', text: '厚手の上着を' });
  } else if (temp < 18) {
    advice.push({ icon: '🧶', text: '羽織るものを一枚' });
  } else if (temp < 25) {
    advice.push({ icon: '👔', text: '過ごしやすい服装で' });
  } else {
    advice.push({ icon: '👕', text: '半袖で快適に' });
  }

  if (pop != null && pop >= 0.5) {
    advice.push({ icon: '☂️', text: '傘を持って' });
  }

  return advice;
}
