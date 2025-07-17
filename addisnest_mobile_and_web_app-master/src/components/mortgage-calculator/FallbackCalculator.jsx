import React from "react";

const FallbackCalculator = () => {
  return (
    <div style={{
      padding: "30px",
      maxWidth: "800px",
      margin: "40px auto",
      backgroundColor: "#fff",
      borderRadius: "12px",
      boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
      textAlign: "center"
    }}>
      <h1 style={{ color: "#4a6cf7", marginBottom: "20px" }}>Mortgage Calculator</h1>
      <p style={{ fontSize: "18px", marginBottom: "30px" }}>
        A simple mortgage calculator to help you estimate your monthly payments.
      </p>
      
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: "20px",
        maxWidth: "500px",
        margin: "0 auto"
      }}>
        <div style={{ textAlign: "left" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
            Home Price ($)
          </label>
          <input 
            type="number" 
            defaultValue="300000"
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "16px"
            }}
          />
        </div>

        <div style={{ textAlign: "left" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
            Down Payment ($)
          </label>
          <input 
            type="number" 
            defaultValue="60000"
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "16px"
            }}
          />
        </div>

        <div style={{ textAlign: "left" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
            Interest Rate (%)
          </label>
          <input 
            type="number" 
            defaultValue="4.5"
            step="0.1"
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "16px"
            }}
          />
        </div>

        <div style={{ textAlign: "left" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
            Loan Term (years)
          </label>
          <select 
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "16px"
            }}
          >
            <option value="30">30 years</option>
            <option value="20">20 years</option>
            <option value="15">15 years</option>
            <option value="10">10 years</option>
          </select>
        </div>

        <button 
          style={{
            backgroundColor: "#4a6cf7",
            color: "white",
            border: "none",
            padding: "12px 20px",
            borderRadius: "4px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            marginTop: "10px"
          }}
        >
          Calculate Payment
        </button>
      </div>
      
      <div style={{ marginTop: "30px", padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
        <h2 style={{ color: "#4a6cf7", marginBottom: "15px" }}>Estimated Monthly Payment</h2>
        <p style={{ fontSize: "24px", fontWeight: "bold" }}>$1,216.04</p>
        <p style={{ color: "#666", marginTop: "10px" }}>
          This is just a fallback display. The actual calculator would calculate based on your inputs.
        </p>
      </div>
    </div>
  );
};

export default FallbackCalculator;
