import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import '../credit-card-form.css';

const CreditCardForm = ({ totalPrice, planName, onCancel }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Clear any existing error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      const formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setCardData({ ...cardData, [name]: formattedValue });
      return;
    }
    
    // Format expiry date with slash
    if (name === 'expiryDate') {
      let formattedValue = value.replace(/\//g, '');
      if (formattedValue.length > 2) {
        formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2, 4)}`;
      }
      setCardData({ ...cardData, [name]: formattedValue });
      return;
    }
    
    // For other fields, just update the value
    setCardData({ ...cardData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate card number
    if (!cardData.cardNumber || cardData.cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Please enter a valid 16-digit card number';
    }
    
    // Validate card name
    if (!cardData.cardName || cardData.cardName.trim() === '') {
      newErrors.cardName = 'Please enter the name on card';
    }
    
    // Validate expiry date
    if (!cardData.expiryDate || !/^\d{2}\/\d{2}$/.test(cardData.expiryDate)) {
      newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
    } else {
      const [month, year] = cardData.expiryDate.split('/');
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      
      if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        newErrors.expiryDate = 'Card has expired';
      }
    }
    
    // Validate CVV
    if (!cardData.cvv || !/^\d{3,4}$/.test(cardData.cvv)) {
      newErrors.cvv = 'Please enter a valid 3 or 4 digit security code';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing
    toast.info('Processing payment...', { autoClose: 2000 });
    
    setTimeout(() => {
      toast.success('Payment successful!', { autoClose: 3000 });
      
      // Delay navigation slightly to show the success message
      setTimeout(() => {
        // Get the redirect path and state from location state or use defaults
        const redirectPath = location.state?.redirectAfterPayment || '/account-management';
        const redirectState = location.state?.redirectState || {};
        
        navigate(redirectPath, { 
          state: { 
            ...redirectState,
            propertyData: location.state?.propertyData,
            listing: 'new',
            plan: 'credit-card',
            message: `Your property has been successfully listed with the ${planName}.`
          }
        });
      }, 1500);
    }, 2000);
  };

  const getCardTypeIcon = (cardNumber) => {
    const visaPattern = /^4/;
    const mastercardPattern = /^5[1-5]/;
    const amexPattern = /^3[47]/;
    const discoverPattern = /^6(?:011|5)/;
    
    const number = cardNumber.replace(/\s/g, '');
    
    if (visaPattern.test(number)) return 'visa';
    if (mastercardPattern.test(number)) return 'mastercard';
    if (amexPattern.test(number)) return 'amex';
    if (discoverPattern.test(number)) return 'discover';
    
    return null;
  };

  const activeCardType = getCardTypeIcon(cardData.cardNumber);

  return (
    <div className="credit-card-form">
      <div className="form-header">
        <h3>
          <span className="credit-card-icon">💳</span>
          Credit Card Payment
        </h3>
      </div>
      
      <div className="card-icon-row">
        <span className={`card-type-icon ${activeCardType === 'visa' ? 'active' : ''}`}>
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visa/visa-original.svg" 
               alt="Visa" width="40" height="24" />
        </span>
        <span className={`card-type-icon ${activeCardType === 'mastercard' ? 'active' : ''}`}>
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mastercard/mastercard-original.svg" 
               alt="Mastercard" width="40" height="24" />
        </span>
        <span className={`card-type-icon ${activeCardType === 'amex' ? 'active' : ''}`}>
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amex/amex-original.svg" 
               alt="American Express" width="40" height="24" />
        </span>
        <span className={`card-type-icon ${activeCardType === 'discover' ? 'active' : ''}`}>
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/discover/discover-original.svg" 
               alt="Discover" width="40" height="24" />
        </span>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className={`form-group ${errors.cardNumber ? 'has-error' : ''}`}>
          <label htmlFor="cardNumber">Card Number *</label>
          <div className="input-with-icon">
            <span className="input-icon">💳</span>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              placeholder="•••• •••• •••• ••••"
              value={cardData.cardNumber}
              onChange={handleInputChange}
              maxLength="19"
            />
          </div>
          {errors.cardNumber && <div className="error-message">{errors.cardNumber}</div>}
        </div>
        
        <div className={`form-group ${errors.cardName ? 'has-error' : ''}`}>
          <label htmlFor="cardName">Name on Card *</label>
          <input
            type="text"
            id="cardName"
            name="cardName"
            placeholder="John Smith"
            value={cardData.cardName}
            onChange={handleInputChange}
          />
          {errors.cardName && <div className="error-message">{errors.cardName}</div>}
        </div>
        
        <div className="form-row">
          <div className={`form-group form-col-50 ${errors.expiryDate ? 'has-error' : ''}`}>
            <label htmlFor="expiryDate">Expiry Date *</label>
            <input
              type="text"
              id="expiryDate"
              name="expiryDate"
              placeholder="MM/YY"
              value={cardData.expiryDate}
              onChange={handleInputChange}
              maxLength="5"
            />
            {errors.expiryDate && <div className="error-message">{errors.expiryDate}</div>}
          </div>
          
          <div className={`form-group form-col-50 ${errors.cvv ? 'has-error' : ''}`}>
            <label htmlFor="cvv">Security Code (CVV) *</label>
            <input
              type="password"
              id="cvv"
              name="cvv"
              placeholder="•••"
              value={cardData.cvv}
              onChange={handleInputChange}
              maxLength="4"
            />
            {errors.cvv && <div className="error-message">{errors.cvv}</div>}
          </div>
        </div>
        
        <div className="card-security-note">
          <span className="security-icon">🔒</span>
          Your payment information is encrypted and secure.
        </div>
        
        <div style={{ marginTop: '20px', textAlign: 'center', fontWeight: 'bold' }}>
          Total Amount: ETB {totalPrice}
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <button 
            type="submit" 
            className="payment-button"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <span className="button-icon">⏳</span>
                Processing...
              </>
            ) : (
              <>
                <span className="checkout-icon">✓</span>
                Complete Payment
              </>
            )}
          </button>
        </div>
        
        <div style={{ marginTop: '15px', textAlign: 'center' }}>
          <button 
            type="button" 
            onClick={onCancel}
            style={{
              background: 'none',
              border: 'none',
              color: '#666',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Cancel and return to payment methods
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreditCardForm;
