import React from 'react';
import { useCurrency } from '../../contexts/CurrencyContext';

/**
 * CurrencyToggle
 *
 * A small pill-style switch that lets the user toggle the displayed
 * property prices between Ethiopian birr (ETB) and US dollars (USD).
 * The conversion uses the daily ETB market rate exposed by the
 * CurrencyContext.
 */
const CurrencyToggle = ({ style = {}, compact = false }) => {
  const { currency, toggleCurrency, etbPerUsd, rateLoading, rateUpdatedAt } =
    useCurrency();

  const isUSD = currency === 'USD';
  const trackBg = '#f1f5f9';
  const knobBg = isUSD ? '#1d4ed8' : '#166534';
  const labelColor = '#0f172a';

  const updatedLabel = rateUpdatedAt
    ? `Updated ${new Date(rateUpdatedAt).toLocaleDateString()}`
    : 'Live rate';

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: compact ? '8px' : '12px',
        ...style,
      }}
    >
      {!compact && (
        <span
          style={{
            fontSize: '0.82rem',
            color: '#0f172a',
            fontWeight: 800,           // bolder for both web + mobile readability
            whiteSpace: 'nowrap',
          }}
          title={`1 USD ≈ ${etbPerUsd?.toFixed(2)} ETB · ${updatedLabel}`}
        >
          💱 Currency
        </span>
      )}

      <button
        onClick={toggleCurrency}
        aria-label={`Switch currency, currently ${currency}`}
        title={`1 USD ≈ ${etbPerUsd?.toFixed(2)} ETB · ${updatedLabel}`}
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          background: trackBg,
          border: '1px solid #e2e8f0',
          borderRadius: '999px',
          padding: '3px',
          cursor: 'pointer',
          height: '34px',
          width: '110px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
          transition: 'background 0.2s ease',
        }}
      >
        {/* Sliding knob */}
        <span
          style={{
            position: 'absolute',
            top: '3px',
            left: isUSD ? '53px' : '3px',
            width: '54px',
            height: '26px',
            background: knobBg,
            borderRadius: '999px',
            transition: 'left 0.25s ease, background 0.25s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
          }}
        />
        {/* ETB label */}
        <span
          style={{
            position: 'relative',
            zIndex: 1,
            flex: 1,
            textAlign: 'center',
            fontSize: '0.72rem',
            fontWeight: 800,
            letterSpacing: '0.4px',
            color: !isUSD ? '#fff' : labelColor,
            transition: 'color 0.2s',
          }}
        >
          ETB
        </span>
        {/* USD label */}
        <span
          style={{
            position: 'relative',
            zIndex: 1,
            flex: 1,
            textAlign: 'center',
            fontSize: '0.72rem',
            fontWeight: 800,
            letterSpacing: '0.4px',
            color: isUSD ? '#fff' : labelColor,
            transition: 'color 0.2s',
          }}
        >
          USD
        </span>
      </button>

      {!compact && (
        <span
          style={{
            fontSize: '0.75rem',
            color: '#334155',
            fontWeight: 700,           // bold the live rate text on web + mobile
            whiteSpace: 'nowrap',
          }}
        >
          {rateLoading
            ? 'Fetching rate…'
            : `1 USD ≈ ${etbPerUsd?.toFixed(2)} ETB`}
        </span>
      )}
    </div>
  );
};

export default CurrencyToggle;
