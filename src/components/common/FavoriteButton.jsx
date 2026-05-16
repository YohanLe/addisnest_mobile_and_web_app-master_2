import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite, optimisticToggle, fetchFavorites } from '../../Redux-store/Slices/FavoritesSlice';
import { isAuthenticated } from '../../utils/tokenHandler';
import { toast } from 'react-toastify';

/**
 * Reusable ❤️ Favorite / Save button.
 *
 * Props:
 *  - propertyId  : string (required)
 *  - size        : number (icon size, default 22)
 *  - showLabel   : boolean (show "Save" / "Saved" text)
 *  - style       : object (extra wrapper styles)
 *  - onLoginRequired : function (called when login is needed)
 *  - className   : string
 */
const FavoriteButton = ({
  propertyId,
  property,           // optional full property object — cached for offline use
  size = 22,
  showLabel = false,
  style = {},
  onLoginRequired,
  className = '',
}) => {
  const dispatch = useDispatch();
  const savedIds = useSelector((state) => state.Favorites?.savedIds || []);
  const isSaved = savedIds.includes(propertyId);
  const [animating, setAnimating] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated()) {
      if (onLoginRequired) {
        onLoginRequired();
      } else {
        toast.info('Please log in to save properties');
        // Fire custom event so Header can show login popup
        window.dispatchEvent(new Event('showLoginPopup'));
      }
      return;
    }

    // Animate
    setAnimating(true);
    setTimeout(() => setAnimating(false), 400);

    const wasSaved = isSaved;

    // ⚡ Fire-and-forget — the thunk dispatches a synchronous reducer first,
    // so Redux state (and the heart icon) flips IMMEDIATELY. The server
    // round-trip happens in the background and never blocks the UI.
    dispatch(toggleFavorite({ propertyId, property }));

    // Show feedback toast right away (don't wait for the network).
    toast.success(wasSaved ? 'Removed from favorites' : 'Saved to favorites', {
      autoClose: 1200,
      hideProgressBar: true,
    });
  };



  return (
    <button
      onClick={handleClick}
      className={`favorite-btn ${isSaved ? 'saved' : ''} ${className}`}
      aria-label={isSaved ? 'Remove from favorites' : 'Save to favorites'}
      title={isSaved ? 'Remove from favorites' : 'Save to favorites'}
      style={{
        background: 'rgba(255,255,255,0.92)',
        border: 'none',
        borderRadius: showLabel ? '20px' : '50%',
        width: showLabel ? 'auto' : `${size + 16}px`,
        height: `${size + 16}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: showLabel ? '6px' : '0',
        padding: showLabel ? '0 14px' : '0',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        transform: animating ? 'scale(1.25)' : 'scale(1)',
        zIndex: 5,
        ...style,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        style={{ transition: 'all 0.3s ease' }}
      >
        {isSaved ? (
          // Filled heart
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill="#e74c3c"
          />
        ) : (
          // Outline heart
          <path
            d="M12.1 18.55l-.1.1-.11-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5 18.5 5 20 6.5 20 8.5c0 2.89-3.14 5.74-7.9 10.05zM16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3z"
            fill="#666"
          />
        )}
      </svg>
      {showLabel && (
        <span
          style={{
            fontSize: '13px',
            fontWeight: '600',
            color: isSaved ? '#e74c3c' : '#555',
          }}
        >
          {isSaved ? 'Saved' : 'Save'}
        </span>
      )}
    </button>
  );
};

export default FavoriteButton;
