'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import SearchBar from './SearchBar';
import CurrentWeather from './CurrentWeather';
import DateCards from './DateCards';
import HourlyScroll from './HourlyScroll';
import TempChart from './TempChart';
import FavoriteBar from './FavoriteBar';
import { groupForecastByDay, toCityDate } from '../lib/forecast';
import { getBackgroundGradient } from '../lib/background';

const FAVORITES_KEY = 'weather-app:favorites';

export default function WeatherApp() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null); // { current, forecast, label }
  const [selectedDate, setSelectedDate] = useState(null);
  const [now, setNow] = useState(() => Date.now());
  const [favorites, setFavorites] = useState([]);

  // 起動時に localStorage からお気に入りを読み込む
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(FAVORITES_KEY);
      if (raw) setFavorites(JSON.parse(raw));
    } catch {
      // 壊れたデータは無視する
    }
  }, []);

  const persistFavorites = useCallback((next) => {
    setFavorites(next);
    try {
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
    } catch {
      // 保存できなくてもアプリの動作は継続する
    }
  }, []);

  // 背景グラデーション・現地時刻表示を1分ごとに更新する
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(id);
  }, []);

  const fetchWeather = useCallback(async (params, label) => {
    setLoading(true);
    setError('');
    try {
      const search = new URLSearchParams(params);
      const res = await fetch(`/api/weather?${search.toString()}`);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || '天気情報の取得に失敗しました。');
      }

      setData({ current: json.current, forecast: json.forecast, label: label || json.current?.name });
      setSelectedDate(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setLocating(false);
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    fetchWeather({ city: query.trim() });
  };

  const handleLocate = useCallback(() => {
    if (!navigator.geolocation) {
      setError('このブラウザは現在地の取得に対応していません。都市名で検索してください。');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchWeather(
          { lat: pos.coords.latitude, lon: pos.coords.longitude },
          '現在地'
        );
      },
      () => {
        setLocating(false);
        setError('現在地を取得できませんでした。位置情報の許可を確認するか、都市名で検索してください。');
      }
    );
  }, [fetchWeather]);

  // 初回表示時に現在地の取得を試みる
  useEffect(() => {
    handleLocate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dailyForecast = useMemo(() => {
    if (!data?.forecast?.list) return [];
    return groupForecastByDay(data.forecast.list, data.forecast.city?.timezone ?? 0);
  }, [data]);

  useEffect(() => {
    if (dailyForecast.length && !selectedDate) {
      setSelectedDate(dailyForecast[0].date);
    }
  }, [dailyForecast, selectedDate]);

  const timezoneOffset = data?.current?.timezone ?? 0;
  const cityNow = useMemo(
    () => toCityDate(Math.floor(now / 1000), timezoneOffset),
    [now, timezoneOffset]
  );

  const weatherMain = data?.current?.weather?.[0]?.main;
  const theme = getBackgroundGradient(cityNow, weatherMain);

  const selectedDay = dailyForecast.find((d) => d.date === selectedDate);

  const currentCoord = data?.current?.coord;
  const activeFavoriteId = currentCoord
    ? `${currentCoord.lat.toFixed(2)},${currentCoord.lon.toFixed(2)}`
    : null;
  const isFavorite = favorites.some((f) => f.id === activeFavoriteId);

  const handleToggleFavorite = () => {
    if (!currentCoord) return;
    if (isFavorite) {
      persistFavorites(favorites.filter((f) => f.id !== activeFavoriteId));
    } else {
      const name = data.label || data.current.name;
      persistFavorites([
        ...favorites,
        { id: activeFavoriteId, lat: currentCoord.lat, lon: currentCoord.lon, name },
      ]);
    }
  };

  const handleSelectFavorite = (fav) => {
    fetchWeather({ lat: fav.lat, lon: fav.lon }, fav.name);
  };

  const handleRemoveFavorite = (fav) => {
    persistFavorites(favorites.filter((f) => f.id !== fav.id));
  };

  return (
    <main className="app" style={{ background: theme.gradient, color: theme.textColor }}>
      <div className="app__inner">
        <h1 className="app__title">天気予報</h1>

        <FavoriteBar
          favorites={favorites}
          activeId={activeFavoriteId}
          onSelect={handleSelectFavorite}
          onRemove={handleRemoveFavorite}
        />

        <SearchBar
          query={query}
          onQueryChange={setQuery}
          onSubmit={handleSearch}
          onLocate={handleLocate}
          locating={locating}
        />

        {error && <p className="app__error">{error}</p>}
        {loading && <p className="app__loading">読み込み中…</p>}

        {!data && !loading && !error && (
          <p className="app__hint">都市名を検索するか、現在地ボタンから天気を取得してください。</p>
        )}

        {data && !loading && (
          <>
            <CurrentWeather
              current={data.current}
              label={data.label}
              cityNow={cityNow}
              nextPop={data.forecast?.list?.[0]?.pop}
              isFavorite={isFavorite}
              onToggleFavorite={handleToggleFavorite}
            />
            <DateCards days={dailyForecast} selectedDate={selectedDate} onSelect={setSelectedDate} />
            {selectedDay && <TempChart items={selectedDay.items} />}
            {selectedDay && <HourlyScroll items={selectedDay.items} />}
          </>
        )}
      </div>
    </main>
  );
}
