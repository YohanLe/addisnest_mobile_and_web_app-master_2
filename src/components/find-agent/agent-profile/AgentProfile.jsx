import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import {
    FaArrowLeft,
    FaShare,
    FaPhone,
    FaEnvelope,
    FaMapMarkerAlt,
    FaCity,
    FaBed,
    FaBath,
    FaRulerCombined,
    FaCommentDots,
    FaWhatsapp,
    FaCheckCircle,
    FaStar,
    FaHome,
    FaBolt,
} from "react-icons/fa";
import Api from "../../../Apis/Api";
import MessageAgentPopup from "../../../helper/MessageAgentPopup";
import "../find-agent.modern.css";

/* ----------- helpers (mirrors SearchAgent) ----------- */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://addisnest.com";

const getImageUrl = (path) => {
    if (!path || path === "None" || path === "") return null;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    if (path.startsWith("/uploads/")) return `${API_BASE_URL}${path}`;
    return `${API_BASE_URL}/uploads/${path}`;
};

const getAgentPhoto = (agent) =>
    getImageUrl(agent?.profilePicture) ||
    getImageUrl(agent?.profile_img) ||
    getImageUrl(agent?.profileImage) ||
    null;

const fullName = (a) =>
    `${a?.firstName || ""} ${a?.lastName || ""}`.trim() || "Agent";

const initials = (a) =>
    `${(a?.firstName || "?")[0] || ""}${(a?.lastName || "")[0] || ""}`.toUpperCase();

const firstNameOnly = (a) => a?.firstName || fullName(a).split(" ")[0];

const getPropertyImage = (p) => {
    const img =
        (Array.isArray(p?.media) && (p.media[0]?.filePath || p.media[0]?.url)) ||
        (Array.isArray(p?.images) && (p.images[0]?.url || p.images[0])) ||
        p?.image ||
        p?.coverImage;
    if (!img) return null;
    if (typeof img === "string") return getImageUrl(img);
    return null;
};

const formatPrice = (p) => {
    const v = Number(p?.price || p?.amount || 0);
    if (!v || Number.isNaN(v)) return "Price on request";
    return `ETB ${v.toLocaleString()}`;
};

const isForSale = (p) => {
    const t = (p?.offeringType || p?.propertyFor || p?.listingType || "").toLowerCase();
    return t.includes("sale") || t.includes("sell") || t.includes("buy");
};

const isForRent = (p) => {
    const t = (p?.offeringType || p?.propertyFor || p?.listingType || "").toLowerCase();
    return t.includes("rent") || t.includes("lease");
};


const formatAddress = (p) => {
    const a = p?.address || {};
    return [a.street, a.city || a.regionalState || a.state]
        .filter(Boolean)
        .join(", ") || a.regionalState || a.city || "Address not specified";
};

/* ----------- component ----------- */
const AgentProfile = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { state } = useLocation();

    const [agent, setAgent] = useState(state?.agent || null);
    const [agentLoading, setAgentLoading] = useState(!state?.agent);
    const [listings, setListings] = useState([]);
    const [listingsLoading, setListingsLoading] = useState(true);
    const [showMessagePopup, setShowMessagePopup] = useState(false);

    // Fetch agent if not pre-loaded via navigation state
    useEffect(() => {
        if (state?.agent) {
            setAgent(state.agent);
            setAgentLoading(false);
            return;
        }
        if (!id) return;

        let cancelled = false;
        (async () => {
            try {
                setAgentLoading(true);
                const resp = await Api.getPublic(`agents/list?id=${id}`);
                const list = resp?.data?.agents || resp?.agents || [];
                const found = list.find?.((a) => a._id === id) || list[0] || null;
                if (!cancelled) setAgent(found);
            } catch (e) {
                console.error("Failed to load agent", e);
            } finally {
                if (!cancelled) setAgentLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [id, state]);

    // Fetch agent's properties
    useEffect(() => {
        if (!id) return;
        let cancelled = false;

        const extractList = (raw) => {
            const body = raw?.data !== undefined ? raw.data : raw;
            const candidates = [
                Array.isArray(body) ? body : null,
                Array.isArray(body?.data) ? body.data : null,
                Array.isArray(body?.data?.properties) ? body.data.properties : null,
                Array.isArray(body?.properties) ? body.properties : null,
                Array.isArray(body?.data?.data) ? body.data.data : null,
                Array.isArray(body?.results) ? body.results : null,
            ];
            for (const c of candidates) if (c) return c;
            return [];
        };

        (async () => {
            try {
                setListingsLoading(true);

                let list = [];
                try {
                    const resp = await Api.getPublic(`properties/user/${id}`);
                    if (cancelled) return;
                    list = extractList(resp);
                } catch (err) {
                    // Fallback to filtered global properties endpoint
                    try {
                        const resp2 = await Api.getPublic(
                            `properties?owner=${id}&limit=200`
                        );
                        if (cancelled) return;
                        list = extractList(resp2);
                    } catch {
                        list = [];
                    }
                }

                if (!cancelled) setListings(list);

                // Profile-photo fallback:
                // /agents/list often returns profileImage:"None", but the property's
                // populated `owner` field carries the real /uploads/... URL. Patch
                // the agent object so the hero avatar can show the picture.
                if (!cancelled && list.length > 0) {
                    const ownerSample = list
                        .map((p) => p?.owner)
                        .find((o) => o && typeof o === "object" &&
                            (getImageUrl(o.profileImage) ||
                             getImageUrl(o.profile_img) ||
                             getImageUrl(o.profilePicture)));

                    if (ownerSample) {
                        setAgent((prev) => {
                            if (!prev) return prev;
                            const existing = getAgentPhoto(prev);
                            if (existing) return prev; // already has a real photo
                            return {
                                ...prev,
                                profileImage:
                                    ownerSample.profileImage ||
                                    ownerSample.profile_img ||
                                    ownerSample.profilePicture ||
                                    prev.profileImage,
                                profile_img:
                                    ownerSample.profile_img ||
                                    ownerSample.profileImage ||
                                    prev.profile_img,
                            };
                        });
                    }
                }
            } catch (e) {
                console.error("Failed to load listings", e);
                if (!cancelled) setListings([]);
            } finally {
                if (!cancelled) setListingsLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [id]);


    const photo = useMemo(() => (agent ? getAgentPhoto(agent) : null), [agent]);


    const handleShare = async () => {
        try {
            const url = window.location.href;
            if (navigator.share) {
                await navigator.share({
                    title: agent ? `${fullName(agent)} on Addisnest` : "Agent",
                    url,
                });
            } else {
                await navigator.clipboard.writeText(url);
                // eslint-disable-next-line no-alert
                alert("Link copied to clipboard");
            }
        } catch {
            /* user cancelled */
        }
    };

    if (agentLoading) {
        return (
            <div className="fa-profile">
                <div className="fap-topbar">
                    <button className="fap-back" onClick={() => navigate(-1)}>
                        <FaArrowLeft />
                    </button>
                    <h1>Agent Profile</h1>
                    <span style={{ width: 38 }} />
                </div>
                <div className="fa-loading" style={{ padding: 60 }}>
                    <div className="fa-spinner"></div>
                    Loading agent…
                </div>
            </div>
        );
    }

    if (!agent) {
        return (
            <div className="fa-profile">
                <div className="fap-topbar">
                    <button className="fap-back" onClick={() => navigate(-1)}>
                        <FaArrowLeft />
                    </button>
                    <h1>Agent Profile</h1>
                    <span style={{ width: 38 }} />
                </div>
                <div className="fa-empty" style={{ padding: 60 }}>
                    Agent not found.
                </div>
            </div>
        );
    }

    const city =
        agent?.address?.city ||
        agent?.address?.regionalState ||
        agent?.region ||
        "Addis Ababa";
    const street = agent?.address?.street || agent?.address?.line1 || "Addis Ababa";

    return (
        <div className="fa-profile">
            {/* Top bar */}
            <div className="fap-topbar">
                <button className="fap-back" onClick={() => navigate(-1)} aria-label="Back">
                    <FaArrowLeft />
                </button>
                <h1>Agent Profile</h1>
                <button className="fap-share" onClick={handleShare} aria-label="Share">
                    <FaShare />
                </button>
            </div>

            {/* Hero */}
            <div className="fap-hero">
                <div
                    className={`fap-avatar ${photo ? "has-img" : ""}`}
                    style={photo ? { backgroundImage: `url(${photo})` } : {}}
                >
                    <span>{initials(agent)}</span>
                </div>

                <h2 className="fap-name">{fullName(agent)}</h2>

                {/* Trust signals row */}
                <div className="fap-trust">
                    <span className="fap-trust-pill fap-verified">
                        <FaCheckCircle /> Verified Agent
                    </span>
                    <span className="fap-trust-pill fap-rating">
                        <FaStar /> {agent?.rating || "4.8"} Rating
                    </span>
                    <span className="fap-trust-pill">
                        <FaMapMarkerAlt /> {city}
                    </span>
                    <span className="fap-trust-pill">
                        <FaHome /> {listings.length || 0} Listing{(listings.length || 0) === 1 ? "" : "s"}
                    </span>
                </div>

                {/* Response speed */}
                <div className="fap-response">
                    <FaBolt /> Usually replies in &lt; 10 min
                </div>

                {/* PRIMARY CTA: Message Agent */}
                <button
                    className="fap-btn-primary"
                    onClick={() => setShowMessagePopup(true)}
                >
                    <FaCommentDots /> Message Agent
                </button>

                {/* Secondary actions */}
                <div className="fap-actions fap-actions-secondary">
                    {agent?.phone ? (
                        <a
                            className="fap-btn fap-btn-whatsapp"
                            href={`https://wa.me/${String(agent.phone).replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaWhatsapp /> WhatsApp
                        </a>
                    ) : (
                        <button className="fap-btn fap-btn-whatsapp" disabled style={{ opacity: 0.6 }}>
                            <FaWhatsapp /> WhatsApp
                        </button>
                    )}
                    {agent?.phone ? (
                        <a className="fap-btn fap-btn-outline" href={`tel:${agent.phone}`}>
                            <FaPhone /> Call
                        </a>
                    ) : (
                        <button className="fap-btn fap-btn-outline" disabled style={{ opacity: 0.6 }}>
                            <FaPhone /> Call
                        </button>
                    )}
                    {agent?.email ? (
                        <a className="fap-btn fap-btn-outline" href={`mailto:${agent.email}`}>
                            <FaEnvelope /> Email
                        </a>
                    ) : (
                        <button className="fap-btn fap-btn-outline" disabled style={{ opacity: 0.6 }}>
                            <FaEnvelope /> Email
                        </button>
                    )}
                </div>
            </div>

            {showMessagePopup && (
                <MessageAgentPopup
                    agent={agent}
                    onClose={() => setShowMessagePopup(false)}
                />
            )}

            {/* Details */}
            <div className="fap-section">
                <h3>Details</h3>
                <div className="fap-detail-card">
                    <div className="fap-detail-row">
                        <div className="fap-detail-icon">
                            <FaCity />
                        </div>
                        <div className="fap-detail-text">
                            <label>City</label>
                            <span>{city}</span>
                        </div>
                    </div>
                    <div className="fap-detail-row">
                        <div className="fap-detail-icon">
                            <FaMapMarkerAlt />
                        </div>
                        <div className="fap-detail-text">
                            <label>Street</label>
                            <span>{street}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Listings */}
            <div className="fap-section">
                <h3>Listings from {firstNameOnly(agent)}</h3>

                {listingsLoading ? (
                    <div className="fa-loading">
                        <div className="fa-spinner"></div>
                        Loading listings…
                    </div>
                ) : listings.length === 0 ? (
                    <div className="fap-no-listings">
                        {firstNameOnly(agent)} has no active listings yet.
                    </div>
                ) : (
                    <div className="fap-listings">
                        {listings.map((p) => {
                            const img = getPropertyImage(p);
                            return (
                                <Link
                                    key={p._id || p.id}
                                    to={`/property/${p._id || p.id}`}
                                    className="fap-listing"
                                >
                                    <div
                                        className="fap-listing-img"
                                        style={img ? { backgroundImage: `url(${img})` } : {}}
                                    >
                                        {isForSale(p) && (
                                            <span className="fap-sale-badge">🏠 For Sale</span>
                                        )}
                                        {!isForSale(p) && isForRent(p) && (
                                            <span className="fap-rent-badge">🔑 For Rent</span>
                                        )}
                                    </div>

                                    <div className="fap-listing-body">
                                        <h4 className="fap-listing-title">{p.title || "Property"}</h4>
                                        <p className="fap-listing-addr">{formatAddress(p)}</p>

                                        <div className="fap-listing-stats">
                                            {(p.bedrooms || p.beds) && (
                                                <span>
                                                    <FaBed /> {p.bedrooms || p.beds}
                                                </span>
                                            )}
                                            {(p.bathrooms || p.baths) && (
                                                <span>
                                                    <FaBath /> {p.bathrooms || p.baths}
                                                </span>
                                            )}
                                            {(p.squareFeet || p.area) && (
                                                <span>
                                                    <FaRulerCombined /> {p.squareFeet || p.area} m²
                                                </span>
                                            )}
                                        </div>

                                        <div className="fap-listing-price">{formatPrice(p)}</div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AgentProfile;
