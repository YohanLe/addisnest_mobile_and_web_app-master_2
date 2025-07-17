import React, { useState } from 'react';

const SafetyTipsSection = ({ onPostAdClick, onMarkUnavailableClick, onReportAbuseClick }) => {
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleReportAbuseClick = () => {
    setShowReportForm(true);
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      
      // Call the parent handler if provided
      if (onReportAbuseClick) {
        onReportAbuseClick({
          reason: reportReason,
          details: reportDetails
        });
      }
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setShowReportForm(false);
        setSubmitted(false);
        setReportReason('');
        setReportDetails('');
      }, 3000);
    }, 1000);
  };

  return (
    <div className="safety-tips-container">
      <div className="action-buttons">
        <button 
          className="btn-post-ad" 
          onClick={onPostAdClick}
        >
          <span className="icon">📝</span> Post Ad Like This
        </button>
        
        <button 
          className="btn-mark-unavailable" 
          onClick={onMarkUnavailableClick}
        >
          <span className="icon">🚫</span> Mark Unavailable
        </button>
        
        <button 
          className="btn-report-abuse" 
          onClick={handleReportAbuseClick}
        >
          <span className="flag-icon">🚩</span> Report Abuse
        </button>
      </div>
      
      {/* Report Abuse Form */}
      {showReportForm && (
        <div className="report-abuse-form">
          {!submitted ? (
            <form onSubmit={handleReportSubmit}>
              <h4>Report this listing</h4>
              <div className="form-group">
                <label htmlFor="reportReason">Reason for reporting:</label>
                <select 
                  id="reportReason" 
                  value={reportReason} 
                  onChange={(e) => setReportReason(e.target.value)}
                  required
                >
                  <option value="">Select a reason</option>
                  <option value="scam">Possible scam</option>
                  <option value="inappropriate">Inappropriate content</option>
                  <option value="duplicate">Duplicate listing</option>
                  <option value="misrepresentation">Property misrepresentation</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="reportDetails">Additional details:</label>
                <textarea 
                  id="reportDetails" 
                  value={reportDetails} 
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Please provide specific details about the issue..."
                  rows="3"
                  required
                ></textarea>
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-cancel" 
                  onClick={() => setShowReportForm(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          ) : (
            <div className="report-success">
              <div className="success-icon">✅</div>
              <h4>Thank you for your report</h4>
              <p>We have received your report and will review it promptly.</p>
            </div>
          )}
        </div>
      )}
      
      <div className="safety-tips">
        <h3><span className="safety-icon">⚠️</span> Safety Tips</h3>
        <ul>
          <li>It's safer not to pay ahead for inspections</li>
          <li>Ask friends or somebody you trust to accompany you for viewing</li>
          <li>Look around the apartment to ensure it meets your expectations</li>
          <li>Don't pay beforehand if they won't let you move in immediately</li>
          <li>Verify that the account details belong to the right property owner before initiating payment</li>
          <li>Report suspicious listings or behaviors to Addisnest</li>
        </ul>
      </div>

      <style jsx>{`
        .safety-tips-container {
          margin-top: 30px;
          margin-bottom: 30px;
        }
        
        .action-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 20px;
        }
        
        .action-buttons button {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px 16px;
          border-radius: 8px;
          font-weight: 500;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }
        
        .btn-post-ad {
          background-color: #4a6cf7;
          color: white;
        }
        
        .btn-mark-unavailable {
          background-color: #f5f5f5;
          color: #333;
          border: 1px solid #ddd !important;
        }
        
        .btn-report-abuse {
          background-color: #fff3f3;
          color: #e53935;
          border: 1px solid #ffcdd2 !important;
        }
        
        .btn-post-ad:hover {
          background-color: #3a5be6;
        }
        
        .btn-mark-unavailable:hover {
          background-color: #eeeeee;
        }
        
        .btn-report-abuse:hover {
          background-color: #ffe6e6;
        }
        
        .icon, .flag-icon {
          margin-right: 6px;
          font-size: 16px;
        }
        
        .safety-tips {
          background-color: #FFF9E6;
          padding: 16px 20px;
          border-radius: 8px;
          border-left: 4px solid #FFC107;
          margin-top: 20px;
        }
        
        .safety-tips h3 {
          color: #333;
          font-size: 18px;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
        }
        
        .safety-icon {
          margin-right: 8px;
        }
        
        .safety-tips ul {
          padding-left: 20px;
          margin: 0;
        }
        
        .safety-tips li {
          margin-bottom: 8px;
          color: #555;
          line-height: 1.5;
        }
        
        .safety-tips li:last-child {
          margin-bottom: 0;
        }
        
        /* Report Form Styles */
        .report-abuse-form {
          background-color: white;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .report-abuse-form h4 {
          margin-top: 0;
          margin-bottom: 16px;
          color: #e53935;
        }
        
        .form-group {
          margin-bottom: 16px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 6px;
          font-size: 14px;
          font-weight: 500;
        }
        
        .form-group select, .form-group textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }
        
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }
        
        .btn-cancel, .btn-submit {
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          border: none;
        }
        
        .btn-cancel {
          background-color: #f5f5f5;
          color: #333;
        }
        
        .btn-submit {
          background-color: #e53935;
          color: white;
        }
        
        .btn-submit:disabled {
          background-color: #ffcdd2;
          cursor: not-allowed;
        }
        
        /* Success Message */
        .report-success {
          text-align: center;
          padding: 20px 0;
        }
        
        .success-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }
        
        .report-success h4 {
          color: #4CAF50;
          margin-bottom: 8px;
        }
        
        @media (max-width: 768px) {
          .action-buttons {
            flex-direction: column;
          }
          
          .action-buttons button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default SafetyTipsSection;
