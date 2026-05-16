import React, { useEffect, useState, useCallback, useMemo } from 'react';
import api from '../../../../Apis/Api';
import './tour-requests.css';

/* -------------------------------------------------------------------------- *
 * Tour Requests tab
 *
 * Two views:
 *   - Incoming  (you are the property owner / agent)
 *   - My tours  (you are the visitor)
 *
 * Statuses: pending | confirmed | rejected | cancelled | completed | rescheduled
 *
 * Owner actions:   Confirm | Decline | Suggest new time | Mark completed
 * Visitor actions: Cancel  | Accept proposal | Decline proposal
 * -------------------------------------------------------------------------- */

const STATUS_META = {
    pending:     { label: 'Pending',     color: '#856404', bg: '#fff3cd' },
    confirmed:   { label: 'Confirmed',   color: '#155724', bg: '#d4edda' },
    rejected:    { label: 'Declined',    color: '#721c24', bg: '#f8d7da' },
    cancelled:   { label: 'Cancelled',   color: '#383d41', bg: '#e2e3e5' },
    completed:   { label: 'Completed',   color: '#0c5460', bg: '#d1ecf1' },
    rescheduled: { label: 'New time proposed', color: '#1f4e79', bg: '#cce5ff' },
};

const fmtDate = (d) => {
    if (!d) return '';
    const date = new Date(d);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
    });
};

const fmtTime = (t) => t || '';

const fullName = (u) => {
    if (!u) return '';
    const n = `${u.firstName || ''} ${u.lastName || ''}`.trim();
    return n || u.email || '';
};

/* Pull a usable URL out of whatever shape the property carries.
   Properties are stored as `images: [{ url, caption }, ...]` but legacy /
   demo records sometimes store plain strings, and the field is occasionally
   `image` (singular) or `coverImage`. Walk the candidates in priority order
   and fall back gracefully. */
const getMainPhoto = (property) => {
    if (!property) return '';
    const list = Array.isArray(property.images) ? property.images : [];
    for (const item of list) {
        if (!item) continue;
        if (typeof item === 'string' && item.trim()) return item;
        if (typeof item === 'object') {
            const u = item.url || item.src || item.path || item.location;
            if (u && typeof u === 'string') return u;
        }
    }
    if (typeof property.coverImage === 'string' && property.coverImage) return property.coverImage;
    if (typeof property.image === 'string' && property.image) return property.image;
    if (property.image && typeof property.image === 'object' && property.image.url) return property.image.url;
    return '';
};


/* ---------- Suggest-new-time mini modal ----------------------------------- */
const SuggestModal = ({ open, onClose, onSubmit, busy }) => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [note, setNote] = useState('');

    if (!open) return null;
    return (
        <div className="tr-modal-backdrop" onClick={onClose}>
            <div className="tr-modal" onClick={(e) => e.stopPropagation()}>
                <h3>Suggest a new time</h3>
                <p className="tr-modal-sub">
                    The visitor will be notified and can accept or decline.
                </p>
                <label>New date</label>
                <input
                    type="date"
                    value={date}
                    min={new Date().toISOString().slice(0, 10)}
                    onChange={(e) => setDate(e.target.value)}
                />
                <label>New time</label>
                <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                />
                <label>Note (optional)</label>
                <textarea
                    rows={2}
                    placeholder="Why are you suggesting a different time?"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                />
                <div className="tr-modal-actions">
                    <button className="tr-btn tr-btn-ghost" onClick={onClose} disabled={busy}>
                        Cancel
                    </button>
                    <button
                        className="tr-btn tr-btn-primary"
                        disabled={busy || !date || !time}
                        onClick={() => onSubmit({ proposedDate: date, proposedTime: time, ownerResponse: note.trim() })}
                    >
                        {busy ? 'Sending…' : 'Send proposal'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const StatusBadge = ({ status }) => {
    const meta = STATUS_META[status] || { label: status, color: '#333', bg: '#eee' };
    return (
        <span className="tr-status-badge" style={{ color: meta.color, backgroundColor: meta.bg }}>
            {meta.label}
        </span>
    );
};

const TourRequestCard = ({ schedule, viewMode, onAct, busyId }) => {
    const isOwnerView = viewMode === 'incoming';
    const counterparty = isOwnerView ? schedule.visitor : schedule.propertyOwner;
    const propertyTitle = schedule.property?.title || 'Property';
    /* Pull the main/cover photo robustly — see `getMainPhoto` for the
       full priority chain (handles object-shaped, string-shaped and legacy
       fields). Local imgFailed state lets us swap to the placeholder if the
       URL itself 404s at runtime, so we never leave a broken-image icon. */
    const propertyImage = getMainPhoto(schedule.property);
    const [imgFailed, setImgFailed] = useState(false);

    const showProposal = schedule.status === 'rescheduled' && schedule.proposedDate && schedule.proposedTime;
    const isBusy = busyId === schedule._id;

    return (
        <div className="tr-card">
            <div className="tr-card-top">
                {propertyImage && !imgFailed ? (
                    <img
                        className="tr-thumb"
                        src={propertyImage}
                        alt={propertyTitle}
                        onError={() => setImgFailed(true)}
                        loading="lazy"
                    />
                ) : (
                    <div className="tr-thumb tr-thumb-placeholder" aria-hidden>🏠</div>
                )}

                <div className="tr-card-head">
                    <div className="tr-card-title-row">
                        <h4 className="tr-card-title">{propertyTitle}</h4>
                        <StatusBadge status={schedule.status} />
                    </div>
                    <div className="tr-card-meta">
                        <span>{schedule.tourType === 'video' ? '📹 Video tour' : '🚶 In-person tour'}</span>
                        <span>•</span>
                        <span>{fmtDate(schedule.scheduledDate)} at {fmtTime(schedule.scheduledTime)}</span>
                    </div>
                    <div className="tr-card-counterparty">
                        {isOwnerView ? 'Requested by' : 'Owner'}: <strong>{fullName(counterparty) || '—'}</strong>
                        {schedule.visitorContact?.email && isOwnerView && (
                            <> · <a href={`mailto:${schedule.visitorContact.email}`}>{schedule.visitorContact.email}</a></>
                        )}
                        {schedule.visitorContact?.phone && isOwnerView && (
                            <> · <a href={`tel:${schedule.visitorContact.phone}`}>{schedule.visitorContact.phone}</a></>
                        )}
                    </div>
                    {schedule.visitorMessage && (
                        <div className="tr-message">“{schedule.visitorMessage}”</div>
                    )}
                    {schedule.ownerResponse && (
                        <div className="tr-owner-note">
                            <strong>Owner note:</strong> {schedule.ownerResponse}
                        </div>
                    )}
                    {showProposal && (
                        <div className="tr-proposal">
                            <strong>Proposed new time:</strong>{' '}
                            {fmtDate(schedule.proposedDate)} at {fmtTime(schedule.proposedTime)}
                        </div>
                    )}
                </div>
            </div>

            <div className="tr-actions">
                {isOwnerView ? (
                    <>
                        {(schedule.status === 'pending' || schedule.status === 'rescheduled') && (
                            <button className="tr-btn tr-btn-primary" disabled={isBusy}
                                onClick={() => onAct(schedule, 'confirm')}>
                                ✅ Confirm
                            </button>
                        )}
                        {(schedule.status === 'pending' || schedule.status === 'rescheduled') && (
                            <button className="tr-btn tr-btn-warning" disabled={isBusy}
                                onClick={() => onAct(schedule, 'suggest')}>
                                🕒 Suggest new time
                            </button>
                        )}
                        {(schedule.status === 'pending' || schedule.status === 'rescheduled') && (
                            <button className="tr-btn tr-btn-danger" disabled={isBusy}
                                onClick={() => onAct(schedule, 'decline')}>
                                ❌ Decline
                            </button>
                        )}
                        {schedule.status === 'confirmed' && (
                            <button className="tr-btn tr-btn-primary" disabled={isBusy}
                                onClick={() => onAct(schedule, 'complete')}>
                                ✔ Mark completed
                            </button>
                        )}
                    </>
                ) : (
                    <>
                        {schedule.status === 'rescheduled' && (
                            <>
                                <button className="tr-btn tr-btn-primary" disabled={isBusy}
                                    onClick={() => onAct(schedule, 'accept-proposal')}>
                                    ✅ Accept new time
                                </button>
                                <button className="tr-btn tr-btn-danger" disabled={isBusy}
                                    onClick={() => onAct(schedule, 'decline-proposal')}>
                                    ❌ Decline
                                </button>
                            </>
                        )}
                        {(schedule.status === 'pending' || schedule.status === 'confirmed') && (
                            <button className="tr-btn tr-btn-ghost" disabled={isBusy}
                                onClick={() => onAct(schedule, 'cancel')}>
                                Cancel request
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

const TourRequests = () => {
    const [view, setView] = useState('incoming'); // 'incoming' | 'mine'
    const [statusFilter, setStatusFilter] = useState('all');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [busyId, setBusyId] = useState(null);
    const [suggestFor, setSuggestFor] = useState(null); // schedule object

    /* IMPORTANT: load() is keyed only on `view`, NOT on `statusFilter`.
       We pull every status from the server in one shot and filter on the
       client, so the count badges on every filter pill stay accurate
       regardless of which one is currently selected. (Previously the
       server filtered by status, which meant clicking "Pending" wiped
       the counts off all the other pills because `items` only contained
       pending records.) */
    const load = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const type = view === 'incoming' ? 'owner' : 'visitor';
            const qs = new URLSearchParams({ type, limit: '200' });
            const res = await api.getWithtoken(`schedules?${qs.toString()}`);
            const data = res?.data?.data || res?.data || [];
            setItems(Array.isArray(data) ? data : (data.data || []));
        } catch (e) {
            setError(e?.userMessage || e?.message || 'Failed to load tour requests');
            setItems([]);
        } finally {
            setLoading(false);
        }
    }, [view]);

    useEffect(() => { load(); }, [load]);

    /* Counts are always computed against the full unfiltered `items` set. */
    const stats = useMemo(() => {
        const acc = { all: items.length, pending: 0, confirmed: 0, rescheduled: 0, completed: 0, rejected: 0, cancelled: 0 };
        items.forEach((s) => { if (acc[s.status] !== undefined) acc[s.status] += 1; });
        return acc;
    }, [items]);

    /* Client-side filtered list used only for rendering. */
    const visibleItems = useMemo(
        () => (statusFilter === 'all' ? items : items.filter((s) => s.status === statusFilter)),
        [items, statusFilter]
    );


    const handleAct = async (schedule, action) => {
        if (busyId) return;
        setBusyId(schedule._id);
        try {
            switch (action) {
                case 'confirm':
                    await api.putWithtoken(`schedules/${schedule._id}/status`, { status: 'confirmed' });
                    break;
                case 'decline': {
                    const note = prompt('Optional note for the visitor (why are you declining?)') || '';
                    await api.putWithtoken(`schedules/${schedule._id}/status`, { status: 'rejected', ownerResponse: note });
                    break;
                }
                case 'complete':
                    if (!window.confirm('Mark this tour as completed?')) { setBusyId(null); return; }
                    await api.putWithtoken(`schedules/${schedule._id}/status`, { status: 'completed' });
                    break;
                case 'cancel':
                    if (!window.confirm('Cancel this tour request?')) { setBusyId(null); return; }
                    await api.putWithtoken(`schedules/${schedule._id}/status`, { status: 'cancelled' });
                    break;
                case 'suggest':
                    setSuggestFor(schedule);
                    setBusyId(null);
                    return;
                case 'accept-proposal':
                    await api.putWithtoken(`schedules/${schedule._id}/respond-suggestion`, { accept: true });
                    break;
                case 'decline-proposal':
                    await api.putWithtoken(`schedules/${schedule._id}/respond-suggestion`, { accept: false });
                    break;
                default:
                    break;
            }
            await load();
        } catch (e) {
            alert(e?.userMessage || e?.message || 'Action failed');
        } finally {
            setBusyId(null);
        }
    };

    const submitSuggestion = async (payload) => {
        if (!suggestFor) return;
        setBusyId(suggestFor._id);
        try {
            await api.putWithtoken(`schedules/${suggestFor._id}/suggest`, payload);
            setSuggestFor(null);
            await load();
        } catch (e) {
            alert(e?.userMessage || e?.message || 'Failed to suggest a new time');
        } finally {
            setBusyId(null);
        }
    };

    return (
        <div className="tour-requests">
            <div className="tr-header">
                <div>
                    <h2>Tour Requests</h2>
                    <p className="tr-subtitle">Manage all tour requests in one place — no email needed.</p>
                </div>
                <button className="tr-btn tr-btn-ghost" onClick={load} disabled={loading}>
                    ↻ {loading ? 'Refreshing…' : 'Refresh'}
                </button>
            </div>

            <div className="tr-tabs">
                <button
                    className={`tr-tab ${view === 'incoming' ? 'active' : ''}`}
                    onClick={() => setView('incoming')}
                >
                    Incoming requests
                </button>
                <button
                    className={`tr-tab ${view === 'mine' ? 'active' : ''}`}
                    onClick={() => setView('mine')}
                >
                    My tour requests
                </button>
            </div>

            <div className="tr-filters">
                {['all', 'pending', 'rescheduled', 'confirmed', 'completed', 'rejected', 'cancelled'].map((s) => (
                    <button
                        key={s}
                        className={`tr-filter ${statusFilter === s ? 'active' : ''}`}
                        onClick={() => setStatusFilter(s)}
                    >
                        {s === 'all' ? 'All' : (STATUS_META[s]?.label || s)}
                        {stats[s] > 0 && <span className="tr-filter-count">{stats[s]}</span>}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="tr-empty">Loading…</div>
            ) : error ? (
                <div className="tr-empty tr-error">{error}</div>
            ) : items.length === 0 ? (
                <div className="tr-empty">
                    {view === 'incoming'
                        ? 'No tour requests yet. They will appear here when someone schedules a tour of one of your properties.'
                        : "You haven't requested a tour yet. Browse listings and click \"Schedule a Tour\" on any property."}
                </div>
            ) : visibleItems.length === 0 ? (
                <div className="tr-empty">
                    No tour requests with status “{STATUS_META[statusFilter]?.label || statusFilter}”.
                </div>
            ) : (
                <div className="tr-list">
                    {visibleItems.map((s) => (
                        <TourRequestCard
                            key={s._id}
                            schedule={s}
                            viewMode={view}
                            onAct={handleAct}
                            busyId={busyId}
                        />
                    ))}
                </div>
            )}


            <SuggestModal
                open={!!suggestFor}
                onClose={() => setSuggestFor(null)}
                onSubmit={submitSuggestion}
                busy={!!busyId && !!suggestFor}
            />
        </div>
    );
};

export default TourRequests;
