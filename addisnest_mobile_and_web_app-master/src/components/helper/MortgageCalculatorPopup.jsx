import React from 'react';
import MortgageCalculatorModern from '../mortgage-calculator/MortgageCalculatorModern';
import './MortgageCalculatorPopup.css';

/**
 * Mortgage Calculator Popup Component
 * Displays a modal with the mortgage calculator when triggered from the header
 */
const MortgageCalculatorPopup = ({ handlePopup }) => {
  return (
    <div className="mortgage-popup-overlay" onClick={handlePopup}>
      <div className="mortgage-popup-container" onClick={(e) => e.stopPropagation()}>
        <div className="mortgage-popup-header">
          <h2>Mortgage Calculator</h2>
          <button className="mortgage-popup-close" onClick={handlePopup}>×</button>
        </div>
        <div className="mortgage-popup-content">
          <MortgageCalculatorModern currency="$" />
        </div>
      </div>
    </div>
  );
};

export default MortgageCalculatorPopup;
