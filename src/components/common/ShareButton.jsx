import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Capacitor } from '@capacitor/core';
import { Share as CapShare } from '@capacitor/share';

/**
 * Reusable 🔗 Share button for properties.
 *
 * - On native (Android/iOS via Capacitor) → uses the native share sheet
 *   via @capacitor/share.
 * - On web with Web Share API support (mobile browsers) → uses navigator.share.
 * - Otherwise → copies the link to the clipboard.
 *
 * Props:
 *  - propertyId  : string (required)
 *  - title       : string (property title for share text)
 *  - size        : number (icon size, default 18)
 *  - showLabel   : boolean (show "Share" text)
 *  - style       : object (extra wrapper styles)
 *  - className   : string
 *  - variant     : 'light' | 'dark' (default 'light')
 */
const ShareButton = ({
  propertyId,
  title = 'Check out this property on Addisnest',
  size = 18,
  showLabel = false,
  style = {},
  className = '',
  variant = 'light',
}) => {
  const [animating, setAnimating] = useState(false);

  const getShareUrl = () => {
    // On native (Capacitor) the page is served from a custom scheme like
    // https://localhost or capacitor://localhost, which is not a real URL
    // a recipient can open. Use the public production domain instead.
    if (Capacitor.isNativePlatform()) {
      const prodBase =
        import.meta.env.VITE_PUBLIC_SITE_URL ||
        import.meta.env.VITE_API_BASE_URL ||
        'https://addisnest.com';
      return `${prodBase.replace(/\/+$/, '')}/property/${propertyId}`;
    }

    const origin = window.location.origin;
    // Avoid sharing localhost links from a web preview
    if (/localhost|127\.0\.0\.1/.test(origin)) {
      return `https://addisnest.com/property/${propertyId}`;
    }
    return `${origin}/property/${propertyId}`;
  };

  const copyToClipboard = async (shareUrl) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      toast.success('Link copied to clipboard!', {
        autoClose: 1500,
        hideProgressBar: true,
      });
    } catch (err) {
      toast.error('Unable to copy link');
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setAnimating(true);
    setTimeout(() => setAnimating(false), 400);

    const shareUrl = getShareUrl();
    const shareData = {
      title: 'Addisnest Property',
      text: title,
      url: shareUrl,
      dialogTitle: 'Share this property',
    };

    // Native (Capacitor) share — Android & iOS
    if (Capacitor.isNativePlatform()) {
      try {
        const { value: canShare } = await CapShare.canShare();
        if (canShare !== false) {
          await CapShare.share(shareData);
          return;
        }
      } catch (err) {
        // User cancelled
        if (err && (err.message || '').toLowerCase().includes('cancel')) return;
        // Otherwise fall through to clipboard fallback
        console.warn('Capacitor Share failed, falling back to clipboard:', err);
      }
      // Fallback for native if share unavailable
      await copyToClipboard(shareUrl);
      return;
    }

    // Web Share API (mobile browsers)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if (err && err.name === 'AbortError') return;
        // fall through to clipboard
      }
    }

    // Clipboard fallback
    await copyToClipboard(shareUrl);
  };

  const isDark = variant === 'dark';

  return (
    <button
      onClick={handleClick}
      className={`share-btn ${className}`}
      aria-label="Share this property"
      title="Share this property"
      style={{
        background: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.92)',
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
        boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.12)',
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
        fill="none"
        stroke={isDark ? 'rgba(255,255,255,0.8)' : '#555'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transition: 'all 0.3s ease' }}
      >
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
      {showLabel && (
        <span
          style={{
            fontSize: '13px',
            fontWeight: '600',
            color: isDark ? 'rgba(255,255,255,0.8)' : '#555',
          }}
        >
          Share
        </span>
      )}
    </button>
  );
};

export default ShareButton;
