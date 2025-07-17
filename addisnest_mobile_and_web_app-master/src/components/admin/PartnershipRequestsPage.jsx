import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaEye, FaFilter } from 'react-icons/fa';

const PartnershipRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    status: ''
  });

  // Fetch partnership requests
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/partnership-requests${statusFilter !== 'all' ? `?status=${statusFilter}` : ''}`);
      setRequests(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch partnership requests. Please try again later.');
      console.error('Error fetching partnership requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  // Handle view request details
  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setFormData({ status: request.status });
    setShowModal(true);
    setEditMode(false);
  };

  // Handle edit request
  const handleEditRequest = (request) => {
    setSelectedRequest(request);
    setFormData({ status: request.status });
    setShowModal(true);
    setEditMode(true);
  };

  // Handle delete request
  const handleDeleteRequest = async (id) => {
    if (window.confirm('Are you sure you want to delete this partnership request?')) {
      try {
        await axios.delete(`/api/partnership-requests/${id}`);
        fetchRequests();
      } catch (err) {
        setError('Failed to delete partnership request. Please try again later.');
        console.error('Error deleting partnership request:', err);
      }
    }
  };

  // Handle form input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/partnership-requests/${selectedRequest._id}`, formData);
      setShowModal(false);
      fetchRequests();
    } catch (err) {
      setError('Failed to update partnership request. Please try again later.');
      console.error('Error updating partnership request:', err);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'not revised':
        return '#f44336'; // Red
      case 'in progress':
        return '#ff9800'; // Orange
      case 'approved':
        return '#4caf50'; // Green
      case 'rejected':
        return '#9e9e9e'; // Grey
      default:
        return '#2196f3'; // Blue
    }
  };

  return (
    <div className="partnership-requests-container">
      <div className="page-header" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Partnership Requests</h1>
        <div className="filter-container" style={{ display: 'flex', alignItems: 'center' }}>
          <FaFilter style={{ marginRight: '8px' }} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              backgroundColor: 'white'
            }}
          >
            <option value="all">All Requests</option>
            <option value="not revised">Not Revised</option>
            <option value="in progress">In Progress</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ padding: '12px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="loading" style={{ textAlign: 'center', padding: '40px' }}>
          <div className="spinner" style={{ width: '40px', height: '40px', margin: '0 auto', borderRadius: '50%', border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', animation: 'spin 1s linear infinite' }}></div>
          <p style={{ marginTop: '10px' }}>Loading partnership requests...</p>
        </div>
      ) : (
        <>
          {requests.length === 0 ? (
            <div className="no-requests" style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
              <p>No partnership requests found.</p>
              {statusFilter !== 'all' && (
                <button
                  onClick={() => setStatusFilter('all')}
                  style={{
                    marginTop: '10px',
                    padding: '8px 16px',
                    backgroundColor: '#4a6cf7',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Show All Requests
                </button>
              )}
            </div>
          ) : (
            <div className="table-responsive" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f2f2f2' }}>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Company</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Contact</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Email</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Type</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Status</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Date</th>
                    <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request._id} style={{ borderBottom: '1px solid #ddd' }}>
                      <td style={{ padding: '12px' }}>{request.companyName}</td>
                      <td style={{ padding: '12px' }}>{request.contactName}</td>
                      <td style={{ padding: '12px' }}>{request.email}</td>
                      <td style={{ padding: '12px' }}>{request.partnershipType}</td>
                      <td style={{ padding: '12px' }}>
                        <span
                          style={{
                            backgroundColor: getStatusBadgeColor(request.status),
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px'
                          }}
                        >
                          {request.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>{formatDate(request.createdAt)}</td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <button
                          onClick={() => handleViewRequest(request)}
                          style={{
                            backgroundColor: '#2196f3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '6px 10px',
                            marginRight: '5px',
                            cursor: 'pointer'
                          }}
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleEditRequest(request)}
                          style={{
                            backgroundColor: '#4caf50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '6px 10px',
                            marginRight: '5px',
                            cursor: 'pointer'
                          }}
                          title="Edit Status"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteRequest(request._id)}
                          style={{
                            backgroundColor: '#f44336',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '6px 10px',
                            cursor: 'pointer'
                          }}
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Modal for viewing/editing request details */}
      {showModal && selectedRequest && (
        <div className="modal-backdrop" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="modal-content" style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto',
            padding: '20px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
          }}>
            <div className="modal-header" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {editMode ? 'Update Request Status' : 'Partnership Request Details'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer'
                }}
              >
                &times;
              </button>
            </div>
            
            <div className="modal-body">
              {editMode ? (
                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                      Status:
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '4px',
                        border: '1px solid #ddd'
                      }}
                      required
                    >
                      <option value="not revised">Not Revised</option>
                      <option value="in progress">In Progress</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      style={{
                        padding: '10px 16px',
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{
                        padding: '10px 16px',
                        backgroundColor: '#4caf50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Update Status
                    </button>
                  </div>
                </form>
              ) : (
                <div className="request-details">
                  <div style={{ marginBottom: '15px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '5px' }}>Company Name:</h3>
                    <p>{selectedRequest.companyName}</p>
                  </div>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '5px' }}>Contact Person:</h3>
                    <p>{selectedRequest.contactName}</p>
                  </div>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '5px' }}>Email:</h3>
                    <p>{selectedRequest.email}</p>
                  </div>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '5px' }}>Phone:</h3>
                    <p>{selectedRequest.phone || 'Not provided'}</p>
                  </div>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '5px' }}>Partnership Type:</h3>
                    <p style={{ textTransform: 'capitalize' }}>{selectedRequest.partnershipType}</p>
                  </div>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '5px' }}>Status:</h3>
                    <span
                      style={{
                        backgroundColor: getStatusBadgeColor(selectedRequest.status),
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}
                    >
                      {selectedRequest.status}
                    </span>
                  </div>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '5px' }}>Date Submitted:</h3>
                    <p>{formatDate(selectedRequest.createdAt)}</p>
                  </div>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '5px' }}>Message:</h3>
                    <p style={{ 
                      backgroundColor: '#f9f9f9', 
                      padding: '15px', 
                      borderRadius: '4px',
                      border: '1px solid #eee',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {selectedRequest.message}
                    </p>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                    <button
                      onClick={() => setShowModal(false)}
                      style={{
                        padding: '10px 16px',
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        setEditMode(true);
                        setFormData({ status: selectedRequest.status });
                      }}
                      style={{
                        padding: '10px 16px',
                        backgroundColor: '#4caf50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Edit Status
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default PartnershipRequestsPage;
