import MortgageCalculatorModern from "./MortgageCalculatorModern";
import FallbackCalculator from "./FallbackCalculator";
import SimpleMortgageCalculator from "./SimpleMortgageCalculator";

// Use FallbackCalculator as a substitute for MortgageCalculatorDemo
const MortgageCalculatorDemo = FallbackCalculator;

export { 
  MortgageCalculatorModern, 
  FallbackCalculator,
  SimpleMortgageCalculator,
  MortgageCalculatorDemo
};
