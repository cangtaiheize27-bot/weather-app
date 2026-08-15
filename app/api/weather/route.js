import { NextResponse } from 'next/server';

// このルートはサーバー上でのみ実行されます。
// OPENWEATHER_API_KEY はここでしか参照されないため、ブラウザに露出しません。

export const dynamic = 'force-dynamic';

const OWM_BASE = 'https://api.openweathermap.org/data/2.5';
const GEO_BASE = 'https://api.openweathermap.org/geo/1.0';

export async function GET(request) {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey || apiKey === 'your_api_key_here') {
    return NextResponse.json(
      {
        error:
          'サーバーに OPENWEATHER_API_KEY が設定されていません。.env.local を確認してください。',
      },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const units = searchParams.get('units') || 'metric';
  const lang = searchParams.get('lang') || 'ja';

  try {
    let coords;

    if (lat && lon) {
      coords = { lat, lon };
    } else if (city) {
      const geoRes = await fetch(
        `${GEO_BASE}/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`
      );

      if (!geoRes.ok) {
        return NextResponse.json(
          { error: '都市の位置情報取得に失敗しました。' },
          { status: geoRes.status }
        );
      }

      const geoData = await geoRes.json();

      if (!geoData.length) {
        return NextResponse.json(
          { error: `「${city}」が見つかりませんでした。都市名を確認してください。` },
          { status: 404 }
        );
      }

      coords = { lat: geoData[0].lat, lon: geoData[0].lon };
    } else {
      return NextResponse.json(
        { error: 'city または lat/lon のいずれかを指定してください。' },
        { status: 400 }
      );
    }

    const [currentRes, forecastRes] = await Promise.all([
      fetch(
        `${OWM_BASE}/weather?lat=${coords.lat}&lon=${coords.lon}&units=${units}&lang=${lang}&appid=${apiKey}`
      ),
      fetch(
        `${OWM_BASE}/forecast?lat=${coords.lat}&lon=${coords.lon}&units=${units}&lang=${lang}&appid=${apiKey}`
      ),
    ]);

    if (!currentRes.ok) {
      const err = await currentRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: err.message || '現在の天気の取得に失敗しました。' },
        { status: currentRes.status }
      );
    }

    if (!forecastRes.ok) {
      const err = await forecastRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: err.message || '予報データの取得に失敗しました。' },
        { status: forecastRes.status }
      );
    }

    const current = await currentRes.json();
    const forecast = await forecastRes.json();

    return NextResponse.json({ current, forecast });
  } catch (err) {
    return NextResponse.json(
      { error: err?.message || '天気情報の取得中に不明なエラーが発生しました。' },
      { status: 500 }
    );
  }
}
