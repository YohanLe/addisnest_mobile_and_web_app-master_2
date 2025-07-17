import React, { useState } from 'react';
import PropertyDetail from './sub-component/PropertyDetail';
import { sampleProperty, unpaidProperty } from '../../mock/samplePropertyData';

const TestPropertyDetail = () => {
  const [showPaid, setShowPaid] = useState(true);
  const currentProperty = showPaid ? sampleProperty : unpaidProperty;
  
  return (
    <div className="test-container">
      <div className="test-controls" style={{ 
        padding: '20px', 
        background: '#f5f5f5', 
        marginBottom: '20px',
        borderRadius: '8px'
      }}>
        <h2>Test Property Detail View</h2>
        <p>Toggle between a paid property (which should show the About Place section) and an unpaid property (which should not show it).</p>
        
        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
          <button 
            onClick={() => setShowPaid(true)}
            style={{ 
              padding: '10px 20px',
              background: showPaid ? '#4a6cf7' : '#e0e0e0',
              color: showPaid ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: showPaid ? 'bold' : 'normal'
            }}
          >
            Paid & Active Property
          </button>
          
          <button 
            onClick={() => setShowPaid(false)}
            style={{ 
              padding: '10px 20px',
              background: !showPaid ? '#4a6cf7' : '#e0e0e0',
              color: !showPaid ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: !showPaid ? 'bold' : 'normal'
            }}
          >
            Unpaid Property
          </button>
        </div>
        
        <div style={{ marginTop: '15px', padding: '10px', background: '#e9f0ff', borderRadius: '4px' }}>
          <p><strong>Current Property Status:</strong> {currentProperty.status} (is_paid: {currentProperty.is_paid ? 'true' : 'false'})</p>
          <p><strong>About Place Section Should Be:</strong> {(currentProperty.status === 'active' && currentProperty.is_paid) ? 'VISIBLE' : 'HIDDEN'}</p>
        </div>
      </div>
      
      <PropertyDetail PropertyDetails={currentProperty} similarProperties={[sampleProperty]} />
    </div>
  );
};

export default TestPropertyDetail;
