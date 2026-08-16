'use client';

export default function FavoriteBar({ favorites, activeId, onSelect, onRemove }) {
  if (!favorites.length) return null;

  return (
    <div className="favorites">
      {favorites.map((fav) => (
        <div
          key={fav.id}
          className={`favorite-chip${fav.id === activeId ? ' favorite-chip--active' : ''}`}
        >
          <button
            type="button"
            className="favorite-chip__label"
            onClick={() => onSelect(fav)}
          >
            {fav.name}
          </button>
          <button
            type="button"
            className="favorite-chip__remove"
            onClick={() => onRemove(fav)}
            aria-label={`${fav.name}をお気に入りから削除`}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
