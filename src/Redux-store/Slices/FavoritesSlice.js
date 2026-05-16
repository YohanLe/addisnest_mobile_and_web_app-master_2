import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Capacitor } from "@capacitor/core";
import { getToken } from "../../utils/tokenHandler";

// ── Local persistence (works on Android even when offline / API fails) ──────
const LOCAL_IDS_KEY = "addisnest_fav_ids";
const LOCAL_ITEMS_KEY = "addisnest_fav_items";

const safeParse = (raw, fallback) => {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};
const loadLocalIds = () => safeParse(localStorage.getItem(LOCAL_IDS_KEY), []);
const loadLocalItems = () => safeParse(localStorage.getItem(LOCAL_ITEMS_KEY), []);
const saveLocalIds = (ids) => {
  try {
    localStorage.setItem(LOCAL_IDS_KEY, JSON.stringify(ids));
  } catch {}
};
const saveLocalItems = (items) => {
  try {
    localStorage.setItem(LOCAL_ITEMS_KEY, JSON.stringify(items));
  } catch {}
};

// Helper: build headers with auth token
const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Build the API base URL.
//  - Web (dev / prod) → "" so Vite proxy or Netlify _redirects forward /api
//  - Native app       → absolute production URL (page is served from
//                       https://localhost via Capacitor — no backend there)
const isNative =
  typeof Capacitor !== "undefined" &&
  Capacitor.isNativePlatform &&
  Capacitor.isNativePlatform();
const API_ROOT = isNative
  ? (import.meta.env.VITE_API_BASE_URL || "https://addisnest.com").replace(
      /\/+$/,
      ""
    )
  : "";
const BASE = `${API_ROOT}/api/favorites`;

// Short timeout so a slow / unreachable backend doesn't keep the spinner forever.
const REQ_TIMEOUT = 12000;

// ─── Thunks ──────────────────────────────────────────────────────────────────

// Fetch all favorites for the logged-in user (falls back to local cache on error)
export const fetchFavorites = createAsyncThunk(
  "favorites/fetchFavorites",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(BASE, {
        headers: authHeaders(),
        timeout: REQ_TIMEOUT,
      });
      // Cache locally for offline use
      const items = data?.data || [];
      saveLocalItems(items);
      saveLocalIds(items.map((p) => p._id || p.id).filter(Boolean));
      return data;
    } catch (error) {
      // Fallback: return whatever we have in localStorage
      const localItems = loadLocalItems();
      if (localItems.length > 0) {
        return { success: true, data: localItems, fromCache: true };
      }
      return rejectWithValue(
        error.response?.data?.error ||
          error.message ||
          "Failed to fetch favorites"
      );
    }
  }
);

// Toggle (save/unsave) a property — persists locally even if the API fails.
// IMPORTANT: This thunk dispatches `applyToggleLocal` SYNCHRONOUSLY at the
// very start so the UI updates instantly — the network call only runs in
// the background and never blocks the heart-tap response.
export const toggleFavorite = createAsyncThunk(
  "favorites/toggleFavorite",
  async (payload, { dispatch, getState, rejectWithValue }) => {
    // Accept either a propertyId string OR a {propertyId, property} object so
    // we can cache the full property for offline rendering.
    let propertyId, property;
    if (payload && typeof payload === "object" && payload.propertyId) {
      propertyId = payload.propertyId;
      property = payload.property;
    } else {
      propertyId = payload;
    }

    // Determine target state from the CURRENT in-memory Redux state so that
    // back-to-back taps don't flip incorrectly.
    const state = getState();
    const currentIds = state?.Favorites?.savedIds || loadLocalIds();
    const isCurrentlySaved = currentIds.includes(propertyId);
    const isSaved = !isCurrentlySaved;

    // ⚡ Instant UI update + localStorage write (synchronous reducer)
    dispatch(applyToggleLocal({ propertyId, property, isSaved }));

    // Best-effort server sync — never block the UX on failure
    let serverOk = false;
    try {
      const { data } = await axios.post(
        `${BASE}/toggle`,
        { propertyId },
        {
          headers: { ...authHeaders(), "Content-Type": "application/json" },
          timeout: REQ_TIMEOUT,
        }
      );
      serverOk = !!data?.success;
    } catch (error) {
      // Log but don't fail the action — local persistence is the source of truth
      // on mobile (the user sees the heart stay red and the item shows up in
      // the Favorites page).
      console.warn(
        "[favorites] server sync failed, kept local change:",
        error?.message || error
      );
    }

    return {
      success: true,
      data: { isSaved, propertyId, serverOk, property: property || null },
    };
  }
);



// Check if a specific property is saved (server + local merge)
export const checkFavorite = createAsyncThunk(
  "favorites/checkFavorite",
  async (propertyId, { rejectWithValue }) => {
    // Local first
    const localSaved = loadLocalIds().includes(propertyId);
    try {
      const { data } = await axios.get(`${BASE}/check/${propertyId}`, {
        headers: authHeaders(),
        timeout: REQ_TIMEOUT,
      });
      return data;
    } catch (error) {
      return {
        success: true,
        data: { isSaved: localSaved, propertyId },
        fromCache: true,
      };
    }
  }
);

// Get saved count for a property (public, best-effort)
export const getFavoriteCount = createAsyncThunk(
  "favorites/getFavoriteCount",
  async (propertyId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE}/count/${propertyId}`, {
        timeout: REQ_TIMEOUT,
      });
      return data;
    } catch (error) {
      return {
        success: true,
        data: { count: 0, propertyId },
      };
    }
  }
);

// ─── Slice ───────────────────────────────────────────────────────────────────

const FavoritesSlice = createSlice({
  name: "Favorites",
  initialState: {
    items: loadLocalItems(),
    savedIds: loadLocalIds(),
    loading: false,
    error: null,
    counts: {},
  },
  reducers: {
    clearFavorites: (state) => {
      state.items = [];
      state.savedIds = [];
      state.loading = false;
      state.error = null;
      saveLocalIds([]);
      saveLocalItems([]);
    },
    // Optimistic toggle — UI feedback before the thunk completes
    optimisticToggle: (state, action) => {
      const propertyId = action.payload;
      const index = state.savedIds.indexOf(propertyId);
      if (index > -1) {
        state.savedIds.splice(index, 1);
        state.items = state.items.filter(
          (item) => (item._id || item.id) !== propertyId
        );
        if (state.counts[propertyId] > 0) state.counts[propertyId] -= 1;
      } else {
        state.savedIds.push(propertyId);
        state.counts[propertyId] = (state.counts[propertyId] || 0) + 1;
      }
      // Persist optimistic change locally
      saveLocalIds(state.savedIds);
      saveLocalItems(state.items);
    },
    // Synchronous, idempotent toggle used by `toggleFavorite` thunk so the
    // UI updates the instant the user taps the heart — no waiting on
    // network. Action payload: { propertyId, property, isSaved }.
    applyToggleLocal: (state, action) => {
      const { propertyId, property, isSaved } = action.payload || {};
      if (!propertyId) return;
      if (isSaved) {
        if (!state.savedIds.includes(propertyId)) {
          state.savedIds.push(propertyId);
        }
        if (
          property &&
          !state.items.some((p) => (p._id || p.id) === propertyId)
        ) {
          state.items.push(property);
        }
        state.counts[propertyId] = (state.counts[propertyId] || 0) + 1;
      } else {
        state.savedIds = state.savedIds.filter((id) => id !== propertyId);
        state.items = state.items.filter(
          (p) => (p._id || p.id) !== propertyId
        );
        if (state.counts[propertyId] > 0) state.counts[propertyId] -= 1;
      }
      saveLocalIds(state.savedIds);
      saveLocalItems(state.items);
    },
  },

  extraReducers: (builder) => {
    builder
      // fetchFavorites
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload?.data || [];
        const fromCache = !!action.payload?.fromCache;

        if (fromCache) {
          // Keep what we have — local cache is already in state
          state.items = data;
          state.savedIds = data
            .map((item) => item._id || item.id)
            .filter(Boolean);
        } else {
          // Server response is authoritative; merge with any local-only IDs
          const serverIds = data
            .map((item) => item._id || item.id)
            .filter(Boolean);
          const localIds = loadLocalIds();
          const localItems = loadLocalItems();

          // Local IDs not yet on server — keep them so the user doesn't lose
          // a tap that didn't reach the backend.
          const extraIds = localIds.filter((id) => !serverIds.includes(id));
          const extraItems = localItems.filter((p) =>
            extraIds.includes(p._id || p.id)
          );

          state.items = [...data, ...extraItems];
          state.savedIds = [...serverIds, ...extraIds];

          saveLocalIds(state.savedIds);
          saveLocalItems(state.items);
        }
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        // Keep whatever local cache we have rather than wiping the UI
        const localItems = loadLocalItems();
        const localIds = loadLocalIds();
        state.items = localItems;
        state.savedIds = localIds;
        state.error = action.payload || "Failed to fetch favorites";
      })
      // toggleFavorite
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const { isSaved, propertyId, property } = action.payload?.data || {};
        if (!propertyId) return;
        if (isSaved) {
          if (!state.savedIds.includes(propertyId)) {
            state.savedIds.push(propertyId);
          }
          // Also push the full property object into state.items so the
          // Favorites page can render it without waiting for a server
          // round-trip (critical on Android when offline / API blocked).
          if (
            property &&
            !state.items.some((p) => (p._id || p.id) === propertyId)
          ) {
            state.items.push(property);
          }
        } else {
          state.savedIds = state.savedIds.filter((id) => id !== propertyId);
          state.items = state.items.filter(
            (item) => (item._id || item.id) !== propertyId
          );
        }
        saveLocalIds(state.savedIds);
        saveLocalItems(state.items);
      })

      // checkFavorite
      .addCase(checkFavorite.fulfilled, (state, action) => {
        const { isSaved, propertyId } = action.payload?.data || {};
        if (!propertyId) return;
        if (isSaved && !state.savedIds.includes(propertyId)) {
          state.savedIds.push(propertyId);
          saveLocalIds(state.savedIds);
        } else if (!isSaved) {
          state.savedIds = state.savedIds.filter((id) => id !== propertyId);
          saveLocalIds(state.savedIds);
        }
      })
      // getFavoriteCount
      .addCase(getFavoriteCount.fulfilled, (state, action) => {
        const { count, propertyId } = action.payload?.data || {};
        if (propertyId) state.counts[propertyId] = count || 0;
      });
  },
});

export const { clearFavorites, optimisticToggle, applyToggleLocal } =
  FavoritesSlice.actions;
export default FavoritesSlice.reducer;


