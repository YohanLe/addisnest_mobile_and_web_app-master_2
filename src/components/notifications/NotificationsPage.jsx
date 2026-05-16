import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../Apis/Api';
import { isAuthenticated } from '../../utils/tokenHandler';
import './notifications.css';

/* -------------------------------------------------------------------------- *
 * Notifications page
 *
 * Lists every in-app notification for the current user with:
 *   - mark-as-read on click
 *   - mark-all-as-read
 *   - delete one / delete all
 *   - smart navigation to the relevant tour or property
 * -------------------------------------------------------------------------- */

const TYPE_ICONS = {
    tour_request_new:    '📅',
    tour_status_update:  '🔔',
    tour_reminder:       '⏰',
    message:             '💬',
    property_update:     '🏠',
    property_inquiry:    '📨',
    payment_received:    '💰',
    payment_confirmation:'💳',
    property_approved:   '✅',
    property_rejected:   '❌',
    account_update:      '👤',
    system:              '📢',
};

const formatRelative = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    const diff = (Date.now() - d.getTime()) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const NotificationsPage = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);

    // Auth gate
    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/', { replace: true });
        }
    }, [navigate]);

    const load = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await api.getWithtoken('notifications?limit=50');
            const data = res?.data || res?.data?.data || [];
            setItems(Array.isArray(data) ? data : (data.data || []));
        } catch (e) {
            setError(e?.userMessage || e?.message || 'Failed to load notifications');
            setItems([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const goTo = (n) => {
        // Tour-related notifications open the Tour Requests tab.
        if (n.type && n.type.startsWith('tour_')) {
            navigate('/account-management', { state: { activeTab: 'tour-requests' } });
            return;
        }
        // Property notifications navigate to the property if we have its id.
        const propertyId = n.property?._id || n.property;
        if (propertyId) {
            navigate(`/property/${propertyId}`);
            return;
        }
        // Messages → messages tab
        if (n.type === 'message') {
            navigate('/account-management', { state: { activeTab: 'messages' } });
        }
    };

    const handleClick = async (n) => {
        if (busy) return;
        // Optimistically mark this one as read
        if (!n.isRead) {
            setItems((prev) => prev.map((x) => (x._id === n._id ? { ...x, isRead: true } : x)));
            try { await api.putWithtoken(`notifications/${n._id}/read`, {}); } catch (_) { /* ignore */ }
        }
        goTo(n);
    };

    const handleMarkAllRead = async () => {
        if (busy) return;
        setBusy(true);
        try {
            await api.putWithtoken('notifications/read-all', {});
            setItems((prev) => prev.map((x) => ({ ...x, isRead: true })));
        } catch (e) {
            alert(e?.userMessage || e?.message || 'Failed to mark all as read');
        } finally {
            setBusy(false);
        }
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm('Delete this notification?')) return;
        try {
            await api.deleteWithtoken(`api/notifications/${id}`);
            setItems((prev) => prev.filter((x) => x._id !== id));
        } catch (err) {
            alert(err?.userMessage || err?.message || 'Failed to delete');
        }
    };

    const handleClearAll = async () => {
        if (!items.length) return;
        if (!window.confirm('Delete all notifications? This cannot be undone.')) return;
        setBusy(true);
        try {
            await api.deleteWithtoken('api/notifications');
            setItems([]);
        } catch (err) {
            alert(err?.userMessage || err?.message || 'Failed to clear notifications');
        } finally {
            setBusy(false);
        }
    };

    const unreadCount = items.filter((n) => !n.isRead).length;

    return (
        <div className="notifications-page">
            <div className="np-container">
                <div className="np-header">
                    <div>
                        <h1>Notifications</h1>
                        <p className="np-sub">
                            {unreadCount > 0 ? `${unreadCount} unread` : 'You\'re all caught up'}
                        </p>
                    </div>
                    <div className="np-header-actions">
                        <button
                            className="np-btn np-btn-ghost"
                            onClick={handleMarkAllRead}
                            disabled={busy || unreadCount === 0}
                        >
                            ✓ Mark all as read
                        </button>
                        <button
                            className="np-btn np-btn-danger"
                            onClick={handleClearAll}
                            disabled={busy || items.length === 0}
                        >
                            🗑 Clear all
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="np-empty">Loading…</div>
                ) : error ? (
                    <div className="np-empty np-error">{error}</div>
                ) : items.length === 0 ? (
                    <div className="np-empty">
                        <div className="np-empty-icon">🔔</div>
                        <div className="np-empty-title">No notifications yet</div>
                        <p>When someone schedules a tour, sends a message or updates your listing, you'll see it here.</p>
                    </div>
                ) : (
                    <ul className="np-list">
                        {items.map((n) => (
                            <li
                                key={n._id}
                                className={`np-item ${n.isRead ? 'read' : 'unread'}`}
                                onClick={() => handleClick(n)}
                            >
                                <div className="np-icon">{TYPE_ICONS[n.type] || '🔔'}</div>
                                <div className="np-body">
                                    <div className="np-title-row">
                                        <strong className="np-title">{n.title}</strong>
                                        <span className="np-time">{formatRelative(n.createdAt)}</span>
                                    </div>
                                    <div className="np-message">{n.message}</div>
                                </div>
                                <button
                                    className="np-delete"
                                    title="Delete"
                                    onClick={(e) => handleDelete(n._id, e)}
                                >
                                    ×
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
