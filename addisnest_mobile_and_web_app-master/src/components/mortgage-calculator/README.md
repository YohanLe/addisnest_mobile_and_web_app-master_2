# Mortgage Calculator Component

A comprehensive mortgage calculator with interactive inputs, detailed payment breakdown, and amortization schedule.

## Features

- **Interactive Inputs**: Sliders and number inputs for easy value adjustments
- **Real-time Calculations**: Instantly updates payment details as inputs change
- **Payment Breakdown**: Detailed breakdown of all payment components
- **Amortization Schedule**: Full amortization table showing principal, interest, and balance over time
- **Additional Costs**: Includes property tax, home insurance, PMI, and HOA fees
- **Responsive Design**: Works well on all screen sizes
- **Customizable**: Currency, initial values, and display options can be configured

## Usage

### Basic Usage

```jsx
import React from 'react';
import { MortgageCalculator } from './components/mortgage-calculator';

function MyComponent() {
  return (
    <div>
      <h2>Calculate Your Mortgage</h2>
      <MortgageCalculator />
    </div>
  );
}
```

### With Custom Configuration

```jsx
import React, { useState } from 'react';
import { MortgageCalculator } from './components/mortgage-calculator';

function MyComponent() {
  const [results, setResults] = useState(null);
  
  const handleCalculation = (calculationResults) => {
    setResults(calculationResults);
    console.log("Monthly payment:", calculationResults.totalMonthlyPayment);
  };
  
  return (
    <div>
      <h2>Euro Mortgage Calculator</h2>
      <MortgageCalculator 
        currency="€"
        initialValues={{
          homePrice: 250000,
          downPayment: 50000,
          loanTerm: 25,
          interestRate: 3.5,
          propertyTax: 2000,
          homeInsurance: 800,
          pmi: 0.5,
          hoa: 100
        }}
        showAdditionalCosts={true}
        showAmortizationSchedule={true}
        onCalculate={handleCalculation}
      />
      
      {results && (
        <div>
          <h3>Total Monthly Payment: €{results.totalMonthlyPayment.toFixed(2)}</h3>
        </div>
      )}
    </div>
  );
}
```

## Component Props

| Prop                      | Type       | Default                        | Description                                            |
|---------------------------|------------|--------------------------------|--------------------------------------------------------|
| `currency`                | String     | "$"                            | Currency symbol to display with monetary values        |
| `initialValues`           | Object     | *See below*                    | Initial values for calculator inputs                   |
| `showAdditionalCosts`     | Boolean    | true                           | Whether to display additional costs section            |
| `showAmortizationSchedule`| Boolean    | true                           | Whether to display amortization schedule               |
| `onCalculate`             | Function   | null                           | Callback function that receives calculation results    |

### Default Initial Values

```javascript
{
  homePrice: 300000,
  downPayment: 60000,
  loanTerm: 30,
  interestRate: 4.5,
  propertyTax: 3000,
  homeInsurance: 1000,
  pmi: 0.5,
  hoa: 0
}
```

## Calculation Results

The `onCalculate` callback receives an object with the following properties:

```javascript
{
  loanAmount: 240000,
  monthlyPrincipalInterest: 1216.04,
  monthlyPropertyTax: 250,
  monthlyHomeInsurance: 83.33,
  monthlyPmi: 100,
  monthlyHoa: 0,
  totalMonthlyPayment: 1649.37,
  amortizationSchedule: [
    {
      payment: 12,
      monthlyPayment: 1216.04,
      principalPayment: 316.04,
      interestPayment: 900.00,
      totalInterest: 10800.00,
      balance: 236839.75
    },
    // Additional entries for each year...
  ]
}
```

## Demo Component

The package includes a demo component that showcases the mortgage calculator's capabilities:

```jsx
import { MortgageCalculatorDemo } from './components/mortgage-calculator';

function App() {
  return (
    <div>
      <h1>Mortgage Calculator Demo</h1>
      <MortgageCalculatorDemo />
    </div>
  );
}
```

Visit `/mortgage-calculator-demo` route to see the demo in action.

## Implementation Details

The mortgage calculator is built with React and uses various hooks to manage state and calculations. It's designed to be lightweight, performant, and easy to integrate into any React application.

### Key Files

- `MortgageCalculator.jsx`: Main component implementation
- `MortgageCalculatorDemo.jsx`: Demo component showcasing usage
- `mortgage-calculator.css`: Component-specific styles

### Integration

Make sure to import the required CSS file in your main entry point:

```jsx
import './assets/css/mortgage-calculator.css';
```

## Formulas Used

### Monthly Mortgage Payment
```
M = P * [ r(1+r)^n / ((1+r)^n)-1) ]
```
Where:
- M = Monthly payment
- P = Principal (loan amount)
- r = Monthly interest rate (annual rate divided by 12 months)
- n = Total number of payments (years * 12)

### PMI (Private Mortgage Insurance)
PMI is typically required when the down payment is less than 20% of the home price. The calculator automatically adds PMI when this condition is met.
```
Monthly PMI = (Loan Amount * PMI Rate) / 12
