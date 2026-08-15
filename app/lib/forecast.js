// OpenWeatherMap のレスポンスを「都市の現地時刻」基準で扱うためのユーティリティ。
// dt (UTC unix秒) + timezone offset(秒) を UTC メソッドで読むことで、
// ブラウザのタイムゾーンに関係なく、その都市の現地時刻を正しく計算する。

export function toCityDate(unixSeconds, timezoneOffsetSeconds) {
  return new Date((unixSeconds + timezoneOffsetSeconds) * 1000);
}

export function dateKey(cityDate) {
  const y = cityDate.getUTCFullYear();
  const m = String(cityDate.getUTCMonth() + 1).padStart(2, '0');
  const d = String(cityDate.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// 3時間おきの予報リストを日付ごとにグループ化し、
// 最大5日分（当日を含む）を返す。
export function groupForecastByDay(list, timezoneOffsetSeconds) {
  const map = new Map();

  for (const item of list) {
    const cityDate = toCityDate(item.dt, timezoneOffsetSeconds);
    const key = dateKey(cityDate);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push({ ...item, cityDate });
  }

  return Array.from(map.entries())
    .map(([date, items]) => {
      const temps = items.map((i) => i.main.temp);
      const representative = items.reduce((best, item) => {
        if (!best) return item;
        const diff = Math.abs(item.cityDate.getUTCHours() - 12);
        const bestDiff = Math.abs(best.cityDate.getUTCHours() - 12);
        return diff < bestDiff ? item : best;
      }, null);

      return {
        date,
        items,
        max: Math.max(...temps),
        min: Math.min(...temps),
        representative,
      };
    })
    .slice(0, 5);
}
