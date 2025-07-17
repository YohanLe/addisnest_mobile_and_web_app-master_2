// This file contains the improved implementation for the "Message the Agent" functionality
// To implement this, replace the existing message box section in PropertyDetail.jsx with this code

// Message Box - Send a message to the agent
<div style={{ width: '30%', padding: '0 10px', boxSizing: 'border-box' }}>
    <div className="message-agent-box" style={{
        padding: '16px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        height: '100%'
    }}>
        <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '12px',
            color: '#333'
        }}>Message the Agent</h2>
        
        {/* Message form */}
        <div style={{ marginBottom: '12px' }}>
            <p style={{ 
                fontSize: '14px', 
                fontWeight: '500', 
                marginBottom: '8px',
                color: '#555'
            }}>Have questions about this property?</p>
            
            {/* Message textarea */}
            <div style={{ marginBottom: '10px' }}>
                <textarea 
                    placeholder="I'm interested in this property and would like to know more about..."
                    rows="3"
                    id="property-message-content"
                    style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid #e0e0e0',
                        fontSize: '15px',
                        outline: 'none',
                        resize: 'vertical',
                        transition: 'border-color 0.3s ease',
                        boxSizing: 'border-box',
                        fontFamily: 'inherit'
                    }}
                />
            </div>
            
            {/* Checkbox for terms */}
            <div style={{ 
                display: 'flex', 
                alignItems: 'flex-start',
                gap: '10px',
                marginBottom: '10px'
            }}>
                <input 
                    type="checkbox" 
                    id="terms-consent"
                    style={{
                        marginTop: '3px'
                    }}
                />
                <label 
                    htmlFor="terms-consent"
                    style={{
                        fontSize: '14px',
                        color: '#666',
                        lineHeight: '1.4'
                    }}
                >
                    I agree to be contacted by Addisnest regarding this property and other relevant services.
                </label>
            </div>
        </div>
        
        {/* Send Message Button */}
        <button 
            className="send-btn"
            onClick={() => {
                if (!isAuthenticated()) {
                    setShowLoginPopup(true);
                } else {
                    // Get message content
                    const messageContent = document.getElementById('property-message-content').value;
                    if (!messageContent.trim()) {
                        alert('Please enter a message');
                        return;
                    }
                    
                    // Check if terms are accepted
                    const termsAccepted = document.getElementById('terms-consent').checked;
                    if (!termsAccepted) {
                        alert('Please accept the terms to continue');
                        return;
                    }
                    
                    // Send message to property owner/agent
                    const sendPropertyMessage = async () => {
                        try {
                            // Get the property owner/agent ID
                            const recipientId = PropertyDetails.owner?._id || 
                                               PropertyDetails.owner || 
                                               PropertyDetails.agent?._id || 
                                               PropertyDetails.agent || 
                                               PropertyDetails.createdBy;
                            
                            if (!recipientId) {
                                alert('Could not identify the property owner or agent');
                                return;
                            }
                            
                            // Get property details for the message
                            const propertyId = PropertyDetails._id;
                            const propertyTitle = PropertyDetails.title || 'Property Inquiry';
                            const senderName = localStorage.getItem('userName') || 'User';
                            
                            // Show sending indicator
                            const sendButton = document.querySelector('.message-agent-box .send-btn');
                            const originalText = sendButton.innerHTML;
                            sendButton.innerHTML = '<span style="font-size: 14px; margin-right: 8px;">⏳</span> Sending...';
                            sendButton.disabled = true;
                            
                            // Create or get conversation
                            const response = await fetch('/api/conversations', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                                },
                                body: JSON.stringify({
                                    participantId: recipientId,
                                    propertyId: propertyId
                                })
                            });
                            
                            const conversationData = await response.json();
                            
                            if (!response.ok) {
                                throw new Error(conversationData.message || 'Failed to create conversation');
                            }
                            
                            // Send message
                            const messageResponse = await fetch('/api/messages', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                                },
                                body: JSON.stringify({
                                    conversationId: conversationData._id,
                                    recipientId: recipientId,
                                    content: messageContent,
                                    propertyId: propertyId
                                })
                            });
                            
                            const messageData = await messageResponse.json();
                            
                            if (!messageResponse.ok) {
                                throw new Error(messageData.message || 'Failed to send message');
                            }
                            
                            // Clear the message input
                            document.getElementById('property-message-content').value = '';
                            document.getElementById('terms-consent').checked = false;
                            
                            // Reset button and show success message
                            sendButton.innerHTML = '<span style="font-size: 18px; margin-right: 8px;">✅</span> Sent!';
                            
                            // Show success message with link to messages
                            setTimeout(() => {
                                const successMessage = document.createElement('div');
                                successMessage.className = 'message-success-alert';
                                successMessage.innerHTML = `
                                    <div style="
                                        background-color: #e6f7e6;
                                        border: 1px solid #8cc63f;
                                        border-radius: 8px;
                                        padding: 12px;
                                        margin-top: 10px;
                                        display: flex;
                                        align-items: center;
                                    ">
                                        <span style="font-size: 20px; margin-right: 10px;">✅</span>
                                        <div>
                                            <p style="margin: 0 0 5px 0; font-weight: 600; color: #333;">Message sent successfully!</p>
                                            <p style="margin: 0; font-size: 14px; color: #555;">
                                                Check your <a href="/account-management/messages" style="color: #4a6cf7; text-decoration: underline;">messages</a> to view responses.
                                            </p>
                                        </div>
                                    </div>
                                `;
                                
                                // Find the message form container and append the success message
                                const messageForm = document.querySelector('.message-agent-box');
                                messageForm.appendChild(successMessage);
                                
                                // Reset button text after 2 seconds
                                setTimeout(() => {
                                    sendButton.innerHTML = originalText;
                                    sendButton.disabled = false;
                                }, 2000);
                            }, 1000);
                            
                        } catch (error) {
                            console.error('Error sending message:', error);
                            
                            // Reset button and show error
                            const sendButton = document.querySelector('.message-agent-box .send-btn');
                            sendButton.innerHTML = '<span style="font-size: 18px; margin-right: 8px;">📧</span> Send Message';
                            sendButton.disabled = false;
                            
                            // Show error message
                            const errorMessage = document.createElement('div');
                            errorMessage.className = 'message-error-alert';
                            errorMessage.innerHTML = `
                                <div style="
                                    background-color: #ffebee;
                                    border: 1px solid #ef5350;
                                    border-radius: 8px;
                                    padding: 12px;
                                    margin-top: 10px;
                                    display: flex;
                                    align-items: center;
                                ">
                                    <span style="font-size: 20px; margin-right: 10px;">⚠️</span>
                                    <div>
                                        <p style="margin: 0 0 5px 0; font-weight: 600; color: #333;">Failed to send message</p>
                                        <p style="margin: 0; font-size: 14px; color: #555;">
                                            Please try again later or contact support.
                                        </p>
                                    </div>
                                </div>
                            `;
                            
                            // Find the message form container and append the error message
                            const messageForm = document.querySelector('.message-agent-box');
                            messageForm.appendChild(errorMessage);
                            
                            // Remove the error message after 5 seconds
                            setTimeout(() => {
                                if (errorMessage.parentNode) {
                                    errorMessage.parentNode.removeChild(errorMessage);
                                }
                            }, 5000);
                        }
                    };
                    
                    sendPropertyMessage();
                }
            }}
            style={{
                width: '100%',
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '16px',
                padding: '10px 16px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 10px rgba(33, 150, 243, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1E88E5'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2196F3'}
        >
            <span style={{ fontSize: '18px', marginRight: '8px' }}>📧</span> Send Message
        </button>
    </div>
</div>
