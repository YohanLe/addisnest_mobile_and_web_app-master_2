import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../Apis/Api';

const PaymentModal = ({ isOpen, onClose, property }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      // Create payment data
      const paymentData = {
        propertyId: property._id,
        amount: property.price?.amount || property.price,
        paymentMethod: paymentMethod
      };

      // Submit payment
      const response = await api.post('/payments/property', paymentData);

      if (response.data.success) {
        setIsProcessing(false);
        onClose();
        
        // Show success message
        alert('Payment successful! You now own this property.');
        
        // Navigate to property list to see purchased property
        navigate('/property-list');
      } else {
        setError('Payment failed. Please try again.');
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError(error.response?.data?.message || 'Payment processing failed. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="payment-modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div className="payment-modal" style={{
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '30px',
        width: '100%',
        maxWidth: '500px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
      }}>
        <div className="payment-modal-header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>Complete Your Purchase</h2>
          <button 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666'
            }}
          >
            ×
          </button>
        </div>

        <div className="property-summary" style={{
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>Property Details</h3>
          <p style={{ margin: '0 0 5px 0', fontSize: '16px' }}>
            <strong>Address:</strong> {property.location?.address || property.address}
          </p>
          <p style={{ margin: '0 0 5px 0', fontSize: '16px', color: '#2563eb', fontWeight: '600' }}>
            <strong>Price:</strong> {property.price?.currency || 'ETB'} {(property.price?.amount || property.price).toLocaleString()}
          </p>
        </div>

        {error && (
          <div style={{
            padding: '10px 15px',
            backgroundColor: '#fee2e2',
            color: '#b91c1c',
            borderRadius: '4px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              fontSize: '16px'
            }}>
              Payment Method
            </label>
            
            <div className="payment-methods" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px',
                border: paymentMethod === 'credit_card' ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                borderRadius: '6px',
                cursor: 'pointer',
                backgroundColor: paymentMethod === 'credit_card' ? '#eff6ff' : 'white',
                transition: 'all 0.2s ease'
              }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="credit_card"
                  checked={paymentMethod === 'credit_card'}
                  onChange={() => setPaymentMethod('credit_card')}
                  style={{ marginRight: '10px' }}
                />
                <span>Credit Card</span>
              </label>
              
              <label style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px',
                border: paymentMethod === 'debit_card' ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                borderRadius: '6px',
                cursor: 'pointer',
                backgroundColor: paymentMethod === 'debit_card' ? '#eff6ff' : 'white',
                transition: 'all 0.2s ease'
              }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="debit_card"
                  checked={paymentMethod === 'debit_card'}
                  onChange={() => setPaymentMethod('debit_card')}
                  style={{ marginRight: '10px' }}
                />
                <span>Debit Card</span>
              </label>
              
              <label style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px',
                border: paymentMethod === 'bank_transfer' ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                borderRadius: '6px',
                cursor: 'pointer',
                backgroundColor: paymentMethod === 'bank_transfer' ? '#eff6ff' : 'white',
                transition: 'all 0.2s ease'
              }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank_transfer"
                  checked={paymentMethod === 'bank_transfer'}
                  onChange={() => setPaymentMethod('bank_transfer')}
                  style={{ marginRight: '10px' }}
                />
                <span>Bank Transfer</span>
              </label>
              
              <label style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px',
                border: paymentMethod === 'mobile_money' ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                borderRadius: '6px',
                cursor: 'pointer',
                backgroundColor: paymentMethod === 'mobile_money' ? '#eff6ff' : 'white',
                transition: 'all 0.2s ease'
              }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="mobile_money"
                  checked={paymentMethod === 'mobile_money'}
                  onChange={() => setPaymentMethod('mobile_money')}
                  style={{ marginRight: '10px' }}
                />
                <span>Mobile Money</span>
              </label>
            </div>
          </div>

          <div className="payment-actions" style={{ 
            display: 'flex',
            gap: '10px',
            marginTop: '30px'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: '1',
                padding: '12px 20px',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isProcessing}
              style={{
                flex: '2',
                padding: '12px 20px',
                backgroundColor: isProcessing ? '#93c5fd' : '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: isProcessing ? 'wait' : 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {isProcessing ? (
                <>
                  <span style={{ 
                    width: '20px', 
                    height: '20px', 
                    border: '2px solid rgba(255,255,255,0.3)', 
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    marginRight: '10px',
                    animation: 'spin 1s linear infinite'
                  }}></span>
                  Processing...
                </>
              ) : (
                'Complete Purchase'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
