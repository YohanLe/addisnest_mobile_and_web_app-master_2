import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

/**
 * Modern Mortgage Calculator Component
 * A user-friendly mortgage calculator with visual payment breakdown
 */
const MortgageCalculatorModern = ({
  currency = "",
  initialValues = {
    homePrice: 15200000,
    downPayment: 100000,
    loanTerm: 20,
    interestRate: 10,
    propertyTax: 19000,
    homeInsurance: 2533.33,
    pmi: 250,
    hoa: 500
  },
  customConfig = {}
}) => {
  // Get custom configuration or use defaults
  const config = {
    interestRateMax: 100,
    downPaymentPercentMax: 100,
    homePriceEditable: true,
    ...customConfig
  };

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
  const [pmi, setPmi] = useState(initialValues.pmi);
  const [hoa, setHoa] = useState(initialValues.hoa);

  // State for calculated results
  const [loanAmount, setLoanAmount] = useState(0);
  const [monthlyPrincipalInterest, setMonthlyPrincipalInterest] = useState(0);
  const [monthlyPropertyTax, setMonthlyPropertyTax] = useState(0);
  const [monthlyHomeInsurance, setMonthlyHomeInsurance] = useState(0);
  const [monthlyPmi, setMonthlyPmi] = useState(0);
  const [monthlyHoa, setMonthlyHoa] = useState(0);
  const [totalMonthlyPayment, setTotalMonthlyPayment] = useState(0);
  const [showResults, setShowResults] = useState(false);
  
  // Chart data
  const [chartData, setChartData] = useState([]);
  const [chartReady, setChartReady] = useState(false);
  const COLORS = ['#4CAF50', '#FFC107', '#03A9F4', '#673AB7', '#E91E63'];
  
  // Refs for tracking container dimensions
  const containerRef = useRef(null);
  
  // Set up chart dimensions after component mounts
  useEffect(() => {
    // Small delay to ensure the container is fully rendered
    const timer = setTimeout(() => {
      setChartReady(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Reset calculator to initial values
  const resetCalculator = () => {
    setHomePrice(initialValues.homePrice);
    setDownPayment(initialValues.downPayment);
    setDownPaymentPercent(((initialValues.downPayment / initialValues.homePrice) * 100).toFixed(1));
    setLoanTerm(initialValues.loanTerm);
    setInterestRate(initialValues.interestRate);
    setPropertyTax(initialValues.propertyTax);
    setHomeInsurance(initialValues.homeInsurance);
    setPmi(initialValues.pmi);
    setHoa(initialValues.hoa);
  };

  // Initialize calculation on component mount
  useEffect(() => {
    // Initial calculation when component mounts
    calculateMortgage();
  }, []);

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
    
    // Calculate monthly PMI (only if down payment < 20%)
    let monthlyPMI = 0;
    if (downPaymentPercent < 20) {
      monthlyPMI = pmi;
    }
    setMonthlyPmi(monthlyPMI);
    
    // Monthly HOA
    setMonthlyHoa(hoa);
    
    // Calculate total monthly payment
    const total = monthlyPI + monthlyPT + monthlyHI + monthlyPMI + hoa;
    setTotalMonthlyPayment(total);
    
    // Update chart data
    setChartData([
      { name: 'Principal & Interest', value: monthlyPI },
      { name: 'Property Taxes', value: monthlyPT },
      { name: 'Home Insurance', value: monthlyHI },
      { name: 'Association Fee', value: hoa },
      { name: 'Mortgage Insurance', value: monthlyPMI }
    ]);
  };

  return (
    <div className="mortgage-calculator-modern" style={{ 
      backgroundColor: '#f9f9f9',
      borderRadius: '10px',
      boxShadow: '0 2px 15px rgba(0,0,0,0.05)',
      overflow: 'hidden',
      padding: '30px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: '20px'
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
                setHomePrice(Number(value));
              }}
              style={{
                width: '100%',
                padding: '12px 15px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500'
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
                  updateDownPayment(Number(value));
                }}
                style={{
                  flex: '2',
                  padding: '12px 15px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
              />
              <div style={{ 
                flex: '1', 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px 15px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                backgroundColor: '#f5f5f5'
              }}>
                <input
                  type="number"
                  value={downPaymentPercent}
                  onChange={(e) => updateDownPaymentPercent(Number(e.target.value))}
                  min="0"
                  max="100"
                  step="0.1"
                  style={{
                    width: '60%',
                    textAlign: 'right',
                    border: 'none',
                    backgroundColor: 'transparent',
                    fontSize: '16px',
                    fontWeight: '500'
                  }}
                />
                <span style={{ marginLeft: '5px' }}></span>
              </div>
            </div>
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
              alignItems: 'center',
              padding: '12px 15px',
              border: '1px solid #ddd',
              borderRadius: '8px'
            }}>
              <input
                type="text"
                value={interestRate}
                onChange={(e) => {
                  const value = e.target.value;
                  const numericValue = parseFloat(value);
                  setInterestRate(isNaN(numericValue) ? value : numericValue);
                }}
                placeholder="Enter interest rate"
                style={{
                  flex: '1',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
              />
              <span style={{ marginLeft: '5px' }}>%</span>
            </div>
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
              Loan Term
            </label>
            <input
              type="text"
              value={loanTerm}
              onChange={(e) => {
                const value = e.target.value;
                const numericValue = parseInt(value);
                setLoanTerm(isNaN(numericValue) ? value : numericValue);
              }}
              placeholder="Enter loan term"
              style={{
                width: '100%',
                padding: '12px 15px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500'
              }}
            />
          </div>
        </div>

        {/* Right Column - Results */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <div style={{ 
            backgroundColor: '#fff', 
            borderRadius: '10px',
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
              Estimate Costs for this home {totalMonthlyPayment.toLocaleString(undefined, {maximumFractionDigits: 2})}/month
            </p>

            {/* Payment Visualization */}
            <div 
              ref={containerRef}
              style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                marginBottom: '20px', 
                height: '220px', 
                width: '100%', 
                minHeight: '220px', 
                minWidth: '300px' 
              }}
            >
              {chartReady && (
                <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={200} aspect={undefined}>
                <PieChart width={300} height={200}>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={false}
                    strokeWidth={0}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: '14px' }}>
                    Est. Payment
                  </text>
                  <text x="50%" y="50%" dy="20" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: '18px', fontWeight: 'bold' }}>
                    {totalMonthlyPayment.toLocaleString(undefined, {maximumFractionDigits: 0})}
                  </text>
                  <text x="50%" y="50%" dy="40" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: '12px', fill: '#666' }}>
                    / Month
                  </text>
                </PieChart>
              </ResponsiveContainer>
              )}
            </div>

            {/* Payment Summary */}
            <div style={{ 
              marginBottom: '20px',
              borderTop: '1px solid #eee',
              paddingTop: '15px'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '10px',
                fontSize: '18px',
                fontWeight: '600',
                color: '#333'
              }}>
                <span>Total Monthly Payment</span>
                <span>{totalMonthlyPayment.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
              </div>
            </div>

            {/* Calculate Button */}
            <button 
              onClick={() => {
                calculateMortgage();
                setShowResults(true);
              }}
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
                transition: 'background-color 0.2s',
                marginTop: '10px'
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

MortgageCalculatorModern.propTypes = {
  currency: PropTypes.string,
  initialValues: PropTypes.shape({
    homePrice: PropTypes.number,
    downPayment: PropTypes.number,
    loanTerm: PropTypes.number,
    interestRate: PropTypes.number,
    propertyTax: PropTypes.number,
    homeInsurance: PropTypes.number,
    pmi: PropTypes.number,
    hoa: PropTypes.number
  }),
  customConfig: PropTypes.object
};

export default MortgageCalculatorModern;
