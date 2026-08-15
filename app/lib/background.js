// 都市の現地時刻と天気状況から背景グラデーションを決定する。
// 悪天候は時間帯に関わらず灰色を優先する。

const BAD_WEATHER = [
  'Thunderstorm',
  'Drizzle',
  'Rain',
  'Snow',
  'Mist',
  'Smoke',
  'Haze',
  'Dust',
  'Fog',
  'Sand',
  'Ash',
  'Squall',
  'Tornado',
];

export function getBackgroundGradient(cityDate, weatherMain) {
  if (weatherMain && BAD_WEATHER.includes(weatherMain)) {
    return {
      key: 'bad',
      label: '悪天候',
      gradient: 'linear-gradient(160deg, #64748b 0%, #94a3b8 55%, #cbd5e1 100%)',
      textColor: '#1e293b',
    };
  }

  const hour = cityDate.getUTCHours();

  if (hour >= 5 && hour < 9) {
    return {
      key: 'morning',
      label: '朝',
      gradient: 'linear-gradient(160deg, #ffecd2 0%, #ffd8a8 45%, #fcb69f 100%)',
      textColor: '#7c4a1e',
    };
  }

  if (hour >= 9 && hour < 17) {
    return {
      key: 'day',
      label: '日中',
      gradient: 'linear-gradient(160deg, #4facfe 0%, #7dc4fd 50%, #a6d9ff 100%)',
      textColor: '#0b3d63',
    };
  }

  if (hour >= 17 && hour < 19) {
    return {
      key: 'evening',
      label: '夕方',
      gradient: 'linear-gradient(160deg, #ff9a5c 0%, #ee5f5f 50%, #b3315f 100%)',
      textColor: '#fff7f0',
    };
  }

  return {
    key: 'night',
    label: '夜',
    gradient: 'linear-gradient(160deg, #0f2027 0%, #203a43 55%, #2c5364 100%)',
    textColor: '#e2e8f0',
  };
}
