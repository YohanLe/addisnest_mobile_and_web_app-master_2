import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import '../mobile-payment-form.css';

const MobilePaymentForm = ({ totalPrice, planName, onCancel }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [phoneData, setPhoneData] = useState({
    phoneNumber: '',
    provider: null
  });
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOtpSent, setShowOtpSent] = useState(false);

  const mobileProviders = [
    { id: 'telebirr', name: 'TeleBirr', logo: '📱' },
    { id: 'cbe', name: 'CBE Birr', logo: '🏦' },
    { id: 'amole', name: 'Amole', logo: '💸' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Clear any existing error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
    
    // Format phone number
    if (name === 'phoneNumber') {
      // Remove non-digit characters
      let formattedValue = value.replace(/\D/g, '');
      
      // Add Ethiopian prefix if not already present
      if (formattedValue.length > 0 && !formattedValue.startsWith('251')) {
        // If starts with 0, replace with 251
        if (formattedValue.startsWith('0')) {
          formattedValue = '251' + formattedValue.substring(1);
        } 
        // If starts with 9, prepend 251
        else if (formattedValue.startsWith('9')) {
          formattedValue = '251' + formattedValue;
        }
      }
      
      setPhoneData({ ...phoneData, [name]: formattedValue });
      return;
    }
    
    // For other fields, just update the value
    setPhoneData({ ...phoneData, [name]: value });
  };

  const selectProvider = (providerId) => {
    setPhoneData({ ...phoneData, provider: providerId });
    
    // Clear any provider error
    if (errors.provider) {
      setErrors({ ...errors, provider: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate phone number
    if (!phoneData.phoneNumber || phoneData.phoneNumber.length < 9) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }
    
    // Validate provider selection
    if (!phoneData.provider) {
      newErrors.provider = 'Please select a mobile payment provider';
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
    
    // Simulate OTP sent to phone
    toast.info(`Sending verification code to +${phoneData.phoneNumber}`, { 
      autoClose: 2000 
    });
    
    setTimeout(() => {
      setIsProcessing(false);
      setShowOtpSent(true);
      
      toast.success('Verification code sent! Check your phone.', {
        autoClose: 3000
      });
    }, 2000);
  };

  const handleCompletePayment = async () => {
    // Simulate payment processing
    setIsProcessing(true);

    toast.info('Processing payment...', { autoClose: 2000 });

    // Get propertyData and plan from location.state
    const propertyData = location.state?.propertyData;
    const plan = location.state?.plan;

    setTimeout(async () => {
      let updateSuccess = true;
      // Only update property status for vip/diamond (not basic)
      if (propertyData && propertyData._id && (plan === 'vip' || plan === 'diamond')) {
                try {
                  // Update only the payment status to "active"
                  // Let the server handle the property status based on payment status
                  // Ensure we're using the correct ID property
                  const propertyId = propertyData._id || propertyData.id;
                  
                  // Use the flat address structure when updating
                  await import('../../../../Apis/Api').then(({ default: Api }) =>
                    Api.putWithtoken
                      ? Api.putWithtoken(`properties/${propertyId}`, { 
                          paymentStatus: 'active',
                          // Include flat address structure if we have it
                          ...(propertyData.street && {
                            street: propertyData.street,
                            city: propertyData.city,
                            regional_state: propertyData.regional_state,
                            country: propertyData.country
                          })
                        })
                      : Api.patchWithtoken(`properties/${propertyId}`, { 
                          paymentStatus: 'active',
                          // Include flat address structure if we have it
                          ...(propertyData.street && {
                            street: propertyData.street,
                            city: propertyData.city,
                            regional_state: propertyData.regional_state,
                            country: propertyData.country
                          })
                        })
                  );
        } catch (err) {
          updateSuccess = false;
          toast.error('Failed to update property status after payment. Please contact support.');
        }
      }

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
            plan: 'mobile-payment',
            message: `Your property has been successfully listed with the ${planName}.`
          }
        });
      }, 1500);
    }, 2000);
  };

  return (
    <div className="mobile-payment-form">
      <div className="form-header">
        <h3>
          <span className="mobile-icon">📱</span>
          Mobile Payment
        </h3>
      </div>
      
      {!showOtpSent ? (
        <form onSubmit={handleSubmit}>
          <div className="provider-icon-row">
            {mobileProviders.map(provider => (
              <div 
                key={provider.id}
                className={`provider-icon ${phoneData.provider === provider.id ? 'active' : ''}`}
                onClick={() => selectProvider(provider.id)}
                title={provider.name}
              >
                <span style={{ fontSize: '24px' }}>{provider.logo}</span>
              </div>
            ))}
          </div>
          
          {errors.provider && (
            <div className="error-message" style={{ textAlign: 'center', marginBottom: '15px' }}>
              {errors.provider}
            </div>
          )}
          
          <div className={`form-group ${errors.phoneNumber ? 'has-error' : ''}`}>
            <label htmlFor="phoneNumber">Mobile Phone Number *</label>
            <div className="input-with-icon">
              <span className="input-icon">📱</span>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="e.g., 251912345678"
                value={phoneData.phoneNumber}
                onChange={handleInputChange}
              />
            </div>
            {errors.phoneNumber && <div className="error-message">{errors.phoneNumber}</div>}
            <small style={{ 
              display: 'block', 
              marginTop: '8px', 
              fontSize: '12px', 
              color: '#666' 
            }}>
              Enter your mobile number connected to your mobile wallet.
            </small>
          </div>
          
          <div className="security-note">
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
                  Sending verification code...
                </>
              ) : (
                <>
                  <span className="button-icon">✓</span>
                  Verify Phone Number
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        <div>
          <div className="confirmation-message">
            <span className="confirmation-icon">✓</span>
            Verification code sent to +{phoneData.phoneNumber}
          </div>
          
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <p style={{ marginBottom: '15px' }}>
              Please check your phone for the verification code and confirm the payment in your 
              {' '}{mobileProviders.find(p => p.id === phoneData.provider)?.name || 'mobile wallet'} app.
            </p>
            
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '25px' }}>
              Once you confirm in your app, click the button below to complete your property listing.
            </p>
          </div>
          
          <div style={{ marginTop: '20px' }}>
            <button 
              className="payment-button"
              onClick={handleCompletePayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <span className="button-icon">⏳</span>
                  Processing payment...
                </>
              ) : (
                <>
                  <span className="button-icon">✓</span>
                  I've Confirmed in My App
                </>
              )}
            </button>
          </div>
        </div>
      )}
      
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
    </div>
  );
};

export default MobilePaymentForm;
