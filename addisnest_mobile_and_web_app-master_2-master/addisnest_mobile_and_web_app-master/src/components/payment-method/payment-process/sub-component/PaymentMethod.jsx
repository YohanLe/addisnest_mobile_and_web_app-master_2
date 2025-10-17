import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import CreditCardForm from './CreditCardForm';
import MobilePaymentForm from './MobilePaymentForm';

const PaymentMethod = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { propertyData, plan, planName, duration, totalPrice } = location.state || {};
  
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [showForm, setShowForm] = useState(null);

  useEffect(() => {
    // If we don't have required data, redirect back to promotion selection
    if (!propertyData || !plan) {
      toast.error('Missing property information. Please try again.');
      navigate('/payment-method/choose-promotion');
    }
  }, [propertyData, plan, navigate]);

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    setShowForm(method);
    
    toast.info(`${method.charAt(0).toUpperCase() + method.slice(1).replace('-', ' ')} selected`, {
      autoClose: 1500,
      position: "top-center",
      hideProgressBar: true
    });
  };

  const handleCancelForm = () => {
    setShowForm(null);
    setSelectedMethod(null);
  };

  const getPlanDurationText = () => {
    if (!duration) return '-';
    
    if (duration === 30) return '1 Month';
    if (duration === 90) return '3 Months';
    return `${duration} Days`;
  };

  return (
    <div className="payment-method-container" style={{
      maxWidth: '800px',
      margin: '40px auto',
      padding: '30px',
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
    }}>
      <div className="promotion-steps" style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '40px',
        position: 'relative'
      }}>
        <div className="step completed" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '150px',
          position: 'relative',
          zIndex: 2
        }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: '#27ae60',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            marginBottom: '10px',
            border: '2px solid #27ae60'
          }}>1</div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>Choose Promotion</div>
        </div>
        <div className="step active" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '150px',
          position: 'relative',
          zIndex: 2
        }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: '#4a6cf7',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            marginBottom: '10px',
            border: '2px solid #4a6cf7'
          }}>2</div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>Make Payment</div>
        </div>
        <div className="step" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '150px',
          position: 'relative',
          zIndex: 2
        }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: '#f0f0f0',
            color: '#999',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            marginBottom: '10px',
            border: '2px solid #f0f0f0'
          }}>3</div>
          <div style={{ fontSize: '14px', fontWeight: '500', color: '#666' }}>Confirmation</div>
        </div>
      </div>
      
      {!showForm ? (
        <>
          <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Select Payment Method</h2>
          
          {/* Credit card logos */}
          <div style={{ 
            display: 'flex',
            justifyContent: 'center',
            gap: '15px',
            marginBottom: '25px'
          }}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" 
                 alt="Visa" style={{ height: '30px', objectFit: 'contain' }} />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" 
                 alt="Mastercard" style={{ height: '30px', objectFit: 'contain' }} />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/1200px-American_Express_logo_%282018%29.svg.png" 
                 alt="American Express" style={{ height: '30px', objectFit: 'contain' }} />
            <img src="https://logos-world.net/wp-content/uploads/2020/09/Discover-Logo-2016-present.png" 
                 alt="Discover" style={{ height: '30px', objectFit: 'contain' }} />
          </div>
          
          <div style={{ 
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            flexWrap: 'wrap',
            marginBottom: '30px'
          }}>
            <div 
              style={{
                width: '200px',
                padding: '20px',
                border: selectedMethod === 'credit-card' ? '2px solid #4a6cf7' : '2px solid #e0e0e0',
                borderRadius: '10px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: selectedMethod === 'credit-card' ? 
                  '0 4px 12px rgba(74, 108, 247, 0.15)' : '0 2px 8px rgba(0,0,0,0.05)'
              }} 
              onClick={() => handleMethodSelect('credit-card')}
              onMouseOver={(e) => {
                if (selectedMethod !== 'credit-card') {
                  e.currentTarget.style.borderColor = '#4a6cf7';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(74, 108, 247, 0.15)';
                }
              }} 
              onMouseOut={(e) => {
                if (selectedMethod !== 'credit-card') {
                  e.currentTarget.style.borderColor = '#e0e0e0';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                }
              }}
            >
              <div style={{ fontSize: '28px', marginBottom: '10px' }}>💳</div>
              <h3 style={{ marginBottom: '10px', color: '#333' }}>Credit Card</h3>
              <p style={{ fontSize: '14px', color: '#666' }}>Pay securely with your credit card</p>
            </div>
            
            <div 
              style={{
                width: '200px',
                padding: '20px',
                border: selectedMethod === 'mobile-payment' ? '2px solid #4a6cf7' : '2px solid #e0e0e0',
                borderRadius: '10px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: selectedMethod === 'mobile-payment' ? 
                  '0 4px 12px rgba(74, 108, 247, 0.15)' : '0 2px 8px rgba(0,0,0,0.05)'
              }}
              onClick={() => handleMethodSelect('mobile-payment')}
              onMouseOver={(e) => {
                if (selectedMethod !== 'mobile-payment') {
                  e.currentTarget.style.borderColor = '#4a6cf7';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(74, 108, 247, 0.15)';
                }
              }} 
              onMouseOut={(e) => {
                if (selectedMethod !== 'mobile-payment') {
                  e.currentTarget.style.borderColor = '#e0e0e0';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                }
              }}
            >
              <div style={{ fontSize: '28px', marginBottom: '10px' }}>📱</div>
              <h3 style={{ marginBottom: '10px', color: '#333' }}>Mobile Payment</h3>
              <p style={{ fontSize: '14px', color: '#666' }}>Pay using your mobile wallet</p>
            </div>
            
            <div 
              style={{
                width: '200px',
                padding: '20px',
                border: selectedMethod === 'bank-transfer' ? '2px solid #4a6cf7' : '2px solid #e0e0e0',
                borderRadius: '10px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: selectedMethod === 'bank-transfer' ? 
                  '0 4px 12px rgba(74, 108, 247, 0.15)' : '0 2px 8px rgba(0,0,0,0.05)'
              }}
              onClick={() => handleMethodSelect('bank-transfer')}
              onMouseOver={(e) => {
                if (selectedMethod !== 'bank-transfer') {
                  e.currentTarget.style.borderColor = '#4a6cf7';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(74, 108, 247, 0.15)';
                }
              }} 
              onMouseOut={(e) => {
                if (selectedMethod !== 'bank-transfer') {
                  e.currentTarget.style.borderColor = '#e0e0e0';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                }
              }}
            >
              <div style={{ fontSize: '28px', marginBottom: '10px' }}>🏦</div>
              <h3 style={{ marginBottom: '10px', color: '#333' }}>Bank Transfer</h3>
              <p style={{ fontSize: '14px', color: '#666' }}>Pay directly from your bank account</p>
            </div>
          </div>
        </>
      ) : showForm === 'credit-card' ? (
        <CreditCardForm 
          totalPrice={totalPrice} 
          planName={planName} 
          onCancel={handleCancelForm} 
        />
      ) : showForm === 'mobile-payment' ? (
        <MobilePaymentForm 
          totalPrice={totalPrice} 
          planName={planName} 
          onCancel={handleCancelForm} 
        />
      ) : (
        // Bank transfer form would go here
        <div className="mobile-payment-form">
          <div className="form-header">
            <h3>
              <span className="mobile-icon">🏦</span>
              Bank Transfer
            </h3>
          </div>
          
          <div style={{ textAlign: 'center', marginBottom: '25px' }}>
            <p>Please transfer the amount to the following bank account:</p>
            
            <div style={{ 
              margin: '20px auto', 
              padding: '20px', 
              maxWidth: '400px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              background: '#f9f9f9'
            }}>
              <div style={{ marginBottom: '15px', textAlign: 'left' }}>
                <div style={{ fontWeight: '500', marginBottom: '5px' }}>Bank Name:</div>
                <div>Commercial Bank of Ethiopia</div>
              </div>
              
              <div style={{ marginBottom: '15px', textAlign: 'left' }}>
                <div style={{ fontWeight: '500', marginBottom: '5px' }}>Account Name:</div>
                <div>AddiSnest Real Estate</div>
              </div>
              
              <div style={{ marginBottom: '15px', textAlign: 'left' }}>
                <div style={{ fontWeight: '500', marginBottom: '5px' }}>Account Number:</div>
                <div>1000123456789</div>
              </div>
              
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: '500', marginBottom: '5px' }}>Reference:</div>
                <div>Property Listing - {planName}</div>
              </div>
            </div>
            
            <p style={{ marginTop: '20px', color: '#666', fontSize: '14px' }}>
              Please use your name as reference when making the payment.
            </p>
          </div>
          
          <div className="security-note">
            <span className="security-icon">🔒</span>
            After making the payment, please click the button below to complete your listing.
          </div>
          
          <div style={{ marginTop: '20px', textAlign: 'center', fontWeight: 'bold' }}>
            Total Amount: ETB {totalPrice}
          </div>
          
          <div style={{ marginTop: '20px' }}>
            <button 
              className="payment-button"
              onClick={() => {
                toast.success('Thank you! Your property has been listed successfully.', { autoClose: 3000 });
                setTimeout(() => {
                // Get the redirect path and state from location state or use defaults
                const redirectPath = location.state?.redirectAfterPayment || '/account-management';
                const redirectState = location.state?.redirectState || {};
                
                navigate(redirectPath, { 
                  state: { 
                    ...redirectState,
                    propertyData,
                    listing: 'new',
                    plan: 'bank-transfer',
                    message: 'Your property has been listed successfully with Bank Transfer payment.'
                  }
                });
                }, 3000);
              }}
            >
              <span className="button-icon">✓</span>
              I've Completed the Bank Transfer
            </button>
          </div>
          
          <div style={{ marginTop: '15px', textAlign: 'center' }}>
            <button 
              type="button" 
              onClick={handleCancelForm}
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
        </div>
      )}
      
      <div className="promotion-summary" style={{
        background: '#f9f9f9',
        borderRadius: '12px',
        padding: '25px',
        marginBottom: '30px'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px', color: '#333' }}>Payment Summary</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eee' }}>
          <span style={{ color: '#555' }}>Plan</span>
          <span style={{ fontWeight: '500' }}>{planName || 'Premium'}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eee' }}>
          <span style={{ color: '#555' }}>Duration</span>
          <span style={{ fontWeight: '500' }}>{getPlanDurationText()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontWeight: '600' }}>
          <span style={{ color: '#555' }}>Total</span>
          <span>ETB {totalPrice || 0}</span>
        </div>
      </div>
      
      {!showForm && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
          <Link to="/payment-method/choose-promotion" style={{
            padding: '12px 25px',
            background: '#f0f0f0',
            color: '#555',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center'
          }}>
            <span style={{ marginRight: '8px' }}>←</span>
            Back to Plans
          </Link>
          
          <Link 
            to="/account-management" 
            style={{
              padding: '12px 30px',
              background: selectedMethod ? '#4a6cf7' : '#b3b3b3',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: selectedMethod ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease',
              display: 'inline-flex',
              alignItems: 'center',
              textDecoration: 'none'
            }}
            onClick={(e) => {
              if (!selectedMethod) {
                e.preventDefault();
                toast.warning('Please select a payment method first');
              }
            }}
          >
            Complete Payment
            <span style={{ marginLeft: '8px' }}>→</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default PaymentMethod;
