import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

/**
 * CurrencyContext
 *
 * Manages the user's preferred display currency (ETB or USD) for property
 * prices across the app. The exchange rate is sourced from a public free
 * exchange-rate API (which mirrors the daily market/inter-bank ETB rate
 * published by the National Bank of Ethiopia). The value is cached in
 * localStorage for 12 hours to avoid hammering the API.
 */

const CurrencyContext = createContext();

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
};

const CACHE_KEY = 'addisnest_etb_usd_rate';
const CACHE_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours
const FALLBACK_RATE = 142; // 1 USD ≈ 142 ETB (used only if API is unreachable)

// List of public endpoints that surface the ETB↔USD daily market rate.
// They are queried in order; the first one that responds wins.
const RATE_ENDPOINTS = [
  // open.er-api.com — free, no key required, daily updated
  {
    url: 'https://open.er-api.com/v6/latest/USD',
    extract: (data) => data?.rates?.ETB,
  },
  // exchangerate.host — free, no key required
  {
    url: 'https://api.exchangerate.host/latest?base=USD&symbols=ETB',
    extract: (data) => data?.rates?.ETB,
  },
  // frankfurter.app fallback (does not always include ETB)
  {
    url: 'https://api.frankfurter.app/latest?from=USD&to=ETB',
    extract: (data) => data?.rates?.ETB,
  },
];

const loadCache = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.rate || !parsed?.timestamp) return null;
    if (Date.now() - parsed.timestamp > CACHE_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
};

const saveCache = (rate) => {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ rate, timestamp: Date.now() })
    );
  } catch { /* ignore */ }
};

export const CurrencyProvider = ({ children }) => {
  // Default = ETB (Ethiopian birr) per requirement
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('addisnest_currency') || 'ETB';
  });

  const cached = loadCache();
  const [etbPerUsd, setEtbPerUsd] = useState(cached?.rate || FALLBACK_RATE);
  const [rateLoading, setRateLoading] = useState(false);
  const [rateUpdatedAt, setRateUpdatedAt] = useState(cached?.timestamp || null);

  const fetchRate = useCallback(async () => {
    // Skip if cache is still warm
    const c = loadCache();
    if (c) {
      setEtbPerUsd(c.rate);
      setRateUpdatedAt(c.timestamp);
      return;
    }

    setRateLoading(true);
    for (const endpoint of RATE_ENDPOINTS) {
      try {
        const res = await fetch(endpoint.url, { method: 'GET' });
        if (!res.ok) continue;
        const data = await res.json();
        const rate = endpoint.extract(data);
        if (rate && Number.isFinite(rate) && rate > 0) {
          setEtbPerUsd(rate);
          setRateUpdatedAt(Date.now());
          saveCache(rate);
          setRateLoading(false);
          return;
        }
      } catch {
        // try next endpoint
      }
    }
    // All endpoints failed → use fallback rate but don't cache it
    setEtbPerUsd((prev) => prev || FALLBACK_RATE);
    setRateLoading(false);
  }, []);

  useEffect(() => {
    fetchRate();
  }, [fetchRate]);

  useEffect(() => {
    localStorage.setItem('addisnest_currency', currency);
  }, [currency]);

  const toggleCurrency = () => {
    setCurrency((prev) => (prev === 'ETB' ? 'USD' : 'ETB'));
  };

  /**
   * Convert a numeric amount from its source currency into the user's
   * currently selected display currency.
   *
   * @param {number} amount   Numeric amount
   * @param {string} from     Source currency code (defaults to ETB)
   * @returns {number}
   */
  const convert = (amount, from = 'ETB') => {
    if (!amount && amount !== 0) return 0;
    const num = Number(amount) || 0;
    const src = (from || 'ETB').toUpperCase();
    if (src === currency) return num;
    if (src === 'ETB' && currency === 'USD') return num / etbPerUsd;
    if (src === 'USD' && currency === 'ETB') return num * etbPerUsd;
    return num;
  };

  /**
   * Format an amount for display using the active currency.
   * @param {number} amount
   * @param {string} from   Source currency (default ETB)
   */
  const formatAmount = (amount, from = 'ETB') => {
    const value = convert(amount, from);
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(value);
    }
    // ETB
    return `ETB ${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value)}`;
  };

  const value = {
    currency,
    setCurrency,
    toggleCurrency,
    etbPerUsd,
    rateLoading,
    rateUpdatedAt,
    refreshRate: fetchRate,
    convert,
    formatAmount,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export default CurrencyContext;
