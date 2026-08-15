'use client';

export default function SearchBar({ query, onQueryChange, onSubmit, onLocate, locating }) {
  return (
    <form className="search" onSubmit={onSubmit}>
      <input
        className="search__input"
        type="text"
        placeholder="都市名を入力（例: Tokyo, 大阪, London）"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
      />
      <button className="search__button" type="submit">
        検索
      </button>
      <button
        className="search__locate"
        type="button"
        onClick={onLocate}
        disabled={locating}
      >
        {locating ? '取得中…' : '📍 現在地'}
      </button>
    </form>
  );
}
