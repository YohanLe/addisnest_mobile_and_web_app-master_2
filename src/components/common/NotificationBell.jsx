import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../../utils/tokenHandler';
import api from '../../Apis/Api';
import '../notifications/notifications.css';

/**
 * Tour Requests button — sits in the site header (web + mobile).
 *
 * Replaces the previous generic "Notifications" bell. It now:
 *   - Polls /api/schedules/owner/pending-count every 30s while the user is
 *     signed in so the red badge always reflects how many tour requests are
 *     awaiting their action.
 *   - Falls back to the older /api/notifications/unread/count endpoint if the
 *     scheduling endpoint is unavailable, so installs that haven't shipped the
 *     newer backend still keep working.
 *   - Shows an "Tour Requests" text label so the affordance is obvious on both
 *     web and mobile (mobile collapses the label to icon-only on tiny widths
 *     via CSS).
 *   - Navigates straight to the Tour Requests tab inside account-management.
 *
 * The component renders nothing for guests.
 */
const POLL_INTERVAL_MS = 30000;

const TourRequestsButton = ({ className = '', style = {} }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [count, setCount] = useState(0);
    const timerRef = useRef(null);

    const fetchCount = useCallback(async () => {
        if (!isAuthenticated()) {
            setCount(0);
            return;
        }
        // Primary source: pending owner tour-requests
        try {
            const res = await api.getWithtoken('schedules/owner/pending-count', { silentOn404: true });
            const c = (res && (res.count ?? res.data?.count));
            if (typeof c === 'number') {
                setCount(c);
                return;
            }
        } catch (_) {
            /* fall through to legacy endpoint */
        }
        // Fallback: legacy unread notifications count
        try {
            const res = await api.getWithtoken('notifications/unread/count', { silentOn404: true });
            const c = (res && (res.count ?? res.data?.count)) || 0;
            setCount(typeof c === 'number' ? c : 0);
        } catch (_) {
            // Network/auth glitches shouldn't crash the header; keep last value.
        }
    }, []);

    useEffect(() => {
        fetchCount();
        timerRef.current = setInterval(fetchCount, POLL_INTERVAL_MS);
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [fetchCount]);

    // When the user lands on the tour requests view, reset the badge optimistically.
    useEffect(() => {
        if (
            location.pathname === '/notifications' ||
            location.pathname === '/notification' ||
            (location.pathname === '/account-management' &&
                location.state?.activeTab === 'tour-requests')
        ) {
            setCount(0);
        }
    }, [location.pathname, location.state]);

    if (!isAuthenticated()) return null;

    const handleClick = () => {
        navigate('/account-management', { state: { activeTab: 'tour-requests' } });
    };

    return (
        <button
            type="button"
            className={`tour-requests-btn ${className}`}
            style={style}
            onClick={handleClick}
            aria-label={`Tour Requests${count > 0 ? `, ${count} pending` : ''}`}
            title="Tour Requests"
        >
            <svg
                className="tour-requests-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                {/* Calendar / tour-request glyph */}
                <rect x="3" y="5" width="18" height="16" rx="2"></rect>
                <path d="M16 3v4M8 3v4M3 9h18"></path>
                <path d="M8 13h4M8 17h7"></path>
            </svg>
            <span className="tour-requests-label">Tour Requests</span>
            {count > 0 && (
                <span className="tour-requests-badge">
                    {count > 99 ? '99+' : count}
                </span>
            )}
        </button>
    );
};

export default TourRequestsButton;
