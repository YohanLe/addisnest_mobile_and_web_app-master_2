import React from "react";

const AgentInfo = ({ agentName = "agent", agentEmail = "agent121@gmail.com" }) => {
  return (
    <div className="agent-info-container">
      <div className="agent-profile">
        <div className="agent-avatar">
          {/* Circle avatar with first letter of agent name */}
          <div className="avatar-circle">
            {agentName.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="agent-details">
          <h3 className="agent-name">{agentName}</h3>
          <p className="agent-email">{agentEmail}</p>
        </div>
        <div className="agent-actions">
          <button className="btn-edit-profile">
            <i className="bi bi-pencil-square"></i>
          </button>
        </div>
      </div>
      
      <div className="agent-stats">
        <div className="stat-item">
          <span className="stat-label">Listings</span>
          <span className="stat-value">12</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Active</span>
          <span className="stat-value">8</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Sold</span>
          <span className="stat-value">4</span>
        </div>
      </div>
      
      <div className="agent-actions-list">
        <button className="btn-action">
          <i className="bi bi-house-add"></i>
          <span>Add New Listing</span>
        </button>
        <button className="btn-action">
          <i className="bi bi-graph-up"></i>
          <span>View Performance</span>
        </button>
        <button className="btn-action">
          <i className="bi bi-calendar-date"></i>
          <span>Schedule</span>
        </button>
      </div>
      
      <div className="agent-verification">
        <div className="verification-status verified">
          <i className="bi bi-check-circle-fill"></i>
          <span>Verified Agent</span>
        </div>
        <div className="account-status">
          <span className="status-label">Account Status:</span>
          <span className="status-value active">Active</span>
        </div>
        <div className="membership-info">
          <span className="membership-label">Membership:</span>
          <span className="membership-value premium">Premium</span>
        </div>
      </div>
    </div>
  );
};

export default AgentInfo;
