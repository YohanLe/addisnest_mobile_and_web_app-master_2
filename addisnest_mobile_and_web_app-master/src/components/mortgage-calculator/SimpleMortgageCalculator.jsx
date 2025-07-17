import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

/**
 * Simple Mortgage Calculator Component
 * A clean, user-friendly mortgage calculator that matches the UI in the image
 */
const SimpleMortgageCalculator = ({
  currency = "$",
  initialValues = {
    homePrice: 300000,
    downPayment: 60000,
    loanTerm: 30,
    interestRate: 4.5,
    propertyTax: 3000,
    homeInsurance: 1000
  }
}) => {
  // State for input values
  const [homePrice, setHomePrice] = useState(initialValues.homePrice);
  const [downPayment, setDownPayment] = useState(initialValues.downPayment);
  const [downPaymentPercent, setDownPaymentPercent] = useState(
    ((initialValues.downPayment / initialValues.homePrice) * 100).toFixed(1)
  );
  const [loanTerm, setLoanTerm] = useState(initialValues.loanTerm);
  const [interestRate, setInterestRate] = useState(initialValues.interestRate);
  const [propertyTax, setPropertyTax] = useState(initialValues.propertyTax);
  const [homeInsurance, setHomeInsurance] = useState(initialValues.homeInsurance);

  // State for calculated results
  const [loanAmount, setLoanAmount] = useState(0);
  const [monthlyPrincipalInterest, setMonthlyPrincipalInterest] = useState(0);
  const [monthlyPropertyTax, setMonthlyPropertyTax] = useState(0);
  const [monthlyHomeInsurance, setMonthlyHomeInsurance] = useState(0);
  const [totalMonthlyPayment, setTotalMonthlyPayment] = useState(0);

  // Initialize calculation on component mount and when inputs change
  useEffect(() => {
    calculateMortgage();
  }, [homePrice, downPayment, interestRate, loanTerm, propertyTax, homeInsurance]);

  // Reset calculator to initial values
  const resetCalculator = () => {
    setHomePrice(initialValues.homePrice);
    setDownPayment(initialValues.downPayment);
    setDownPaymentPercent(((initialValues.downPayment / initialValues.homePrice) * 100).toFixed(1));
    setLoanTerm(initialValues.loanTerm);
    setInterestRate(initialValues.interestRate);
    setPropertyTax(initialValues.propertyTax);
    setHomeInsurance(initialValues.homeInsurance);
    calculateMortgage();
  };

  // Keep downPayment and downPaymentPercent in sync
  const updateDownPayment = (value) => {
    setDownPayment(value);
    setDownPaymentPercent(((value / homePrice) * 100).toFixed(1));
  };

  // Keep downPaymentPercent and downPayment in sync
  const updateDownPaymentPercent = (percent) => {
    setDownPaymentPercent(percent);
    setDownPayment((homePrice * percent) / 100);
  };

  // Format currency for display
  const formatCurrency = (amount) => {
    return currency + amount.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  };

  // Calculate monthly mortgage payment
  const calculateMonthlyPayment = (principal, years, rate) => {
    const monthlyRate = rate / 100 / 12;
    const payments = years * 12;
    
    // If rate is 0, simply divide principal by number of payments
    if (rate === 0) {
      return principal / payments;
    }
    
    return (
      (principal * monthlyRate * Math.pow(1 + monthlyRate, payments)) /
      (Math.pow(1 + monthlyRate, payments) - 1)
    );
  };

  // Calculate all mortgage details
  const calculateMortgage = () => {
    // Calculate loan amount
    const calculatedLoanAmount = homePrice - downPayment;
    setLoanAmount(calculatedLoanAmount);
    
    // Calculate monthly principal and interest payment
    const monthlyPI = calculateMonthlyPayment(
      calculatedLoanAmount,
      loanTerm,
      interestRate
    );
    setMonthlyPrincipalInterest(monthlyPI);
    
    // Calculate monthly property tax
    const monthlyPT = propertyTax / 12;
    setMonthlyPropertyTax(monthlyPT);
    
    // Calculate monthly home insurance
    const monthlyHI = homeInsurance / 12;
    setMonthlyHomeInsurance(monthlyHI);
    
    // Calculate total monthly payment
    const total = monthlyPI + monthlyPT + monthlyHI;
    setTotalMonthlyPayment(total);
  };

  return (
    <div className="mortgage-calculator" style={{ 
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        borderBottom: '1px solid #eee',
        marginBottom: '20px',
        paddingBottom: '10px'
      }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: '600', 
          margin: '0 0 20px 0',
          color: '#333'
        }}>
          Mortgage Calculator
        </h1>
      </div>

      <div style={{ 
        display: 'flex', 
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: '40px'
      }}>
        {/* Left Column - Inputs */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          {/* Home Price */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ 
              display: 'block', 
              fontWeight: '600', 
              fontSize: '16px', 
              marginBottom: '10px',
              color: '#333'
            }}>
              Home Price
            </label>
            <input
              type="text"
              value={homePrice.toLocaleString()}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                setHomePrice(Number(value) || 0);
              }}
              style={{
                width: '100%',
                padding: '12px 15px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: '500'
              }}
            />
            <input
              type="range"
              min="50000"
              max="2000000"
              step="10000"
              value={homePrice}
              onChange={(e) => setHomePrice(Number(e.target.value))}
              style={{
                width: '100%',
                marginTop: '10px'
              }}
            />
          </div>

          {/* Down Payment */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ 
              display: 'block', 
              fontWeight: '600', 
              fontSize: '16px', 
              marginBottom: '10px',
              color: '#333'
            }}>
              Down Payment
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={downPayment.toLocaleString()}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  updateDownPayment(Number(value) || 0);
                }}
                style={{
                  flex: '2',
                  padding: '12px 15px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
              />
              <input
                type="text"
                value={downPaymentPercent}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.]/g, '');
                  updateDownPaymentPercent(Number(value) || 0);
                }}
                style={{
                  flex: '1',
                  padding: '12px 15px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px',
                  fontWeight: '500',
                  textAlign: 'right'
                }}
              />
              <span style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '0 10px',
                fontSize: '16px',
                color: '#666'
              }}>%</span>
            </div>
            <input
              type="range"
              min="0"
              max={homePrice * 0.5}
              step="1000"
              value={downPayment}
              onChange={(e) => updateDownPayment(Number(e.target.value))}
              style={{
                width: '100%',
                marginTop: '10px'
              }}
            />
          </div>

          {/* Interest Rate */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ 
              display: 'block', 
              fontWeight: '600', 
              fontSize: '16px', 
              marginBottom: '10px',
              color: '#333'
            }}>
              Interest Rate
            </label>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center'
            }}>
              <input
                type="text"
                value={interestRate}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.]/g, '');
                  setInterestRate(Number(value) || 0);
                }}
                style={{
                  flex: '1',
                  padding: '12px 15px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
              />
              <span style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '0 10px',
                fontSize: '16px',
                color: '#666'
              }}>%</span>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              style={{
                width: '100%',
                marginTop: '10px'
              }}
            />
          </div>
          
          {/* Loan Term */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ 
              display: 'block', 
              fontWeight: '600', 
              fontSize: '16px', 
              marginBottom: '10px',
              color: '#333'
            }}>
              Loan Term (years)
            </label>
            <select
              value={loanTerm}
              onChange={(e) => setLoanTerm(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '12px 15px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: '500',
                backgroundColor: 'white'
              }}
            >
              <option value="30">30 years</option>
              <option value="20">20 years</option>
              <option value="15">15 years</option>
              <option value="10">10 years</option>
            </select>
          </div>
        </div>

        {/* Right Column - Results */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <div style={{ 
            backgroundColor: '#f9f9f9', 
            borderRadius: '8px',
            padding: '25px',
            height: '100%',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
          }}>
            {/* Payment Calculator Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h2 style={{ margin: 0, fontSize: '22px', color: '#333' }}>Payment Calculator</h2>
              <button 
                onClick={resetCalculator}
                style={{
                  backgroundColor: '#f5f5f5',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 15px',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
              >
                <span style={{ marginRight: '5px', fontWeight: '500' }}>Reset</span>
                <span>↺</span>
              </button>
            </div>
            
            <p style={{ margin: '0 0 20px 0', color: '#666' }}>
              Estimate Costs for this home {formatCurrency(totalMonthlyPayment)}/month
            </p>

            {/* Payment Visualization */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              marginBottom: '30px', 
              height: '200px'
            }}>
              <div style={{
                position: 'relative',
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                backgroundColor: '#f0f0f0',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: 'inset 0 0 0 15px #4CAF50, inset 0 0 0 30px #FFC107, inset 0 0 0 45px #03A9F4'
              }}>
                <div style={{
                  width: '130px',
                  height: '130px',
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                }}>
                  <div style={{ fontSize: '14px', color: '#666' }}>Est. Payment</div>
                  <div style={{ fontSize: '22px', fontWeight: 'bold', margin: '5px 0' }}>
                    {formatCurrency(Math.round(totalMonthlyPayment))}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>/ Month</div>
                </div>
              </div>
            </div>

            {/* Payment Breakdown */}
            <div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '10px',
                fontSize: '16px',
                color: '#333'
              }}>
                <span>Principal & Interest</span>
                <span>{formatCurrency(Math.round(monthlyPrincipalInterest))}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '10px',
                fontSize: '16px',
                color: '#333'
              }}>
                <span>Property Tax</span>
                <span>{formatCurrency(Math.round(monthlyPropertyTax))}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '20px',
                fontSize: '16px',
                color: '#333'
              }}>
                <span>Home Insurance</span>
                <span>{formatCurrency(Math.round(monthlyHomeInsurance))}</span>
              </div>
            </div>

            {/* Loan Details */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '30px',
              padding: '15px 0',
              borderTop: '1px solid #eee',
              borderBottom: '1px solid #eee'
            }}>
              <div>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Loan Amount</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{formatCurrency(loanAmount)}</div>
              </div>
              <div>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Loan-to-Value</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                  {((loanAmount / homePrice) * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Calculate Button */}
            <button 
              onClick={calculateMortgage}
              style={{
                width: '100%',
                backgroundColor: '#A5D959',
                color: '#333',
                fontWeight: 'bold',
                fontSize: '16px',
                padding: '15px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#93C74F'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#A5D959'}>
              Calculate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

SimpleMortgageCalculator.propTypes = {
  currency: PropTypes.string,
  initialValues: PropTypes.shape({
    homePrice: PropTypes.number,
    downPayment: PropTypes.number,
    loanTerm: PropTypes.number,
    interestRate: PropTypes.number,
    propertyTax: PropTypes.number,
    homeInsurance: PropTypes.number
  })
};

export default SimpleMortgageCalculator;
