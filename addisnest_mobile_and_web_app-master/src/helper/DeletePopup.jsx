import React from 'react';

const DeletePopup = ({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="delete-popup-overlay">
      <div className="delete-popup-container">
        <div className="delete-popup-header">
          <h3>Confirm Deletion</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="delete-popup-body">
          <p>Are you sure you want to delete {itemName || 'this item'}?</p>
          <p className="warning">This action cannot be undone.</p>
        </div>
        <div className="delete-popup-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DeletePopup;
