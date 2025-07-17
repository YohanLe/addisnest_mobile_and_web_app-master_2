import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./mobile-messages.css";
import "./web-messages.css";
import "./enhanced-messages.css";
import "./modern-messages.css";
import MobileChatInterface from "./MobileChatInterface";
import { format } from 'date-fns';
import { getToken, isAuthenticated } from "../../../../utils/tokenHandler";

const Messages = () => {
  const navigate = useNavigate();
  
  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: '/account-management', activeTab: 'messages' } });
    }
  }, [navigate]);
  
  // State for mobile view
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
  const [showChatView, setShowChatView] = useState(false);
  const [testModeExpanded, setTestModeExpanded] = useState(false);
  
  // State for conversations and messages
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for selected conversation
  const [selectedConversation, setSelectedConversation] = useState(null);
  
  // State to track if the conversation has been accepted
  const [conversationAccepted, setConversationAccepted] = useState(true);
  const [pendingMessages, setPendingMessages] = useState([]);
  
  // State for the new message being composed
  const [newMessage, setNewMessage] = useState("");
  
  // State for conversation messages
  const [conversationMessages, setConversationMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  
  // Refs for auto-scrolling and message input
  const messageHistoryRef = useRef(null);
  const messageInputRef = useRef(null);
  
  // Check for mobile view on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Mock data for testing when API is not available
  const mockConversations = [
    {
      id: '1',
      type: 'AGENT',
      name: 'John Smith',
      lastMessage: 'I would like to schedule a viewing for the property',
      online: true,
      unread: 2,
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      messageIcon: '🏠',
      property: { title: 'Modern Apartment in Downtown' },
      participants: [{ _id: 'agent1', firstName: 'John', lastName: 'Smith', role: 'agent' }]
    },
    {
      id: '2',
      type: 'CUSTOMER',
      name: 'Sarah Johnson',
      lastMessage: 'Thank you for your help with my property search',
      online: false,
      unread: 0,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      messageIcon: '💬',
      property: null,
      participants: [{ _id: 'customer1', firstName: 'Sarah', lastName: 'Johnson', role: 'customer' }]
    },
    {
      id: '3',
      type: 'ADMIN',
      name: 'Admin Support',
      lastMessage: 'Your account has been verified successfully',
      online: true,
      unread: 1,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      messageIcon: '💬',
      property: null,
      participants: [{ _id: 'admin1', firstName: 'Admin', lastName: 'Support', role: 'admin' }]
    }
  ];

  const mockMessages = {
    '1': [
      {
        id: '101',
        text: 'Hello, I am interested in the Modern Apartment in Downtown',
        time: '10:30 AM',
        date: format(new Date(), 'M/d/yyyy'),
        sender: 'them',
        senderName: 'John Smith',
        isRead: true
      },
      {
        id: '102',
        text: 'I would like to schedule a viewing for the property',
        time: '10:35 AM',
        date: format(new Date(), 'M/d/yyyy'),
        sender: 'them',
        senderName: 'John Smith',
        isRead: true
      },
      {
        id: '103',
        text: 'Hi John, I would be happy to arrange a viewing. When would be a good time for you?',
        time: '10:40 AM',
        date: format(new Date(), 'M/d/yyyy'),
        sender: 'me',
        senderName: 'You',
        isRead: true
      }
    ],
    '2': [
      {
        id: '201',
        text: 'Thank you for your help with my property search',
        time: '2:15 PM',
        date: format(new Date(Date.now() - 1000 * 60 * 60 * 24), 'M/d/yyyy'), // Yesterday
        sender: 'them',
        senderName: 'Sarah Johnson',
        isRead: true
      },
      {
        id: '202',
        text: "You're welcome! Let me know if you need anything else.",
        time: '2:20 PM',
        date: format(new Date(Date.now() - 1000 * 60 * 60 * 24), 'M/d/yyyy'), // Yesterday
        sender: 'me',
        senderName: 'You',
        isRead: true
      }
    ],
    '3': [
      {
        id: '301',
        text: 'Your account has been verified successfully',
        time: '9:00 AM',
        date: format(new Date(Date.now() - 1000 * 60 * 60 * 24), 'M/d/yyyy'), // Yesterday
        sender: 'them',
        senderName: 'Admin Support',
        isRead: false
      }
    ]
  };

  // Fetch pending messages
  useEffect(() => {
    const fetchPendingMessages = async () => {
      try {
        if (!isAuthenticated()) {
          console.log('User is not authenticated, using mock data for pending messages');
          setPendingMessages([]);
          return;
        }
        
        const token = getToken();
        const response = await fetch('/api/messages?status=pending', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            console.log('Authentication failed, using mock data for pending messages');
            setPendingMessages([]);
            return;
          }
          throw new Error(`Failed to fetch pending messages: ${response.status}`);
        }
        
        const data = await response.json();
        setPendingMessages(data.data || []);
      } catch (error) {
        console.error('Error fetching pending messages:', error);
      }
    };
    
    fetchPendingMessages();
  }, []);
  
  // Fetch conversations from the API
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        
        // Check if user is authenticated
        if (!isAuthenticated()) {
          console.log('User is not authenticated, using mock data');
          setConversations(mockConversations);
          setFilteredConversations(mockConversations);
          setLoading(false);
          return;
        }
        
        const token = getToken();
        const response = await fetch('/api/conversations', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            console.log('Authentication failed, using mock data');
            setConversations(mockConversations);
            setFilteredConversations(mockConversations);
            setLoading(false);
            return;
          }
          throw new Error(`Failed to fetch conversations: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Transform the data to match our component's expected format
        // Check if data is an array or has a data property
        const conversationsArray = Array.isArray(data) ? data : (data.data || []);
        
        const formattedConversations = conversationsArray.map(conv => {
          // Get the other participant (not the current user)
          const otherParticipant = conv.participants[0] || {};
          
          return {
            id: conv._id,
            type: otherParticipant.role ? otherParticipant.role.toUpperCase() : "USER",
            name: otherParticipant.firstName ? 
              `${otherParticipant.firstName} ${otherParticipant.lastName || ''}` : 
              "Unknown User",
            lastMessage: conv.lastMessage?.content || "No messages yet",
            online: true, // We could implement real online status later
            unread: conv.unreadCount || 0,
            timestamp: conv.updatedAt ? new Date(conv.updatedAt) : new Date(),
            messageIcon: conv.property ? "🏠" : "💬",
            property: conv.property,
            participants: conv.participants,
            messages: [] // Will be loaded when conversation is selected
          };
        });
        
        setConversations(formattedConversations);
        setFilteredConversations(formattedConversations);
        setLoading(false);
        
      } catch (error) {
        console.error('Error fetching conversations:', error);
        setError('Failed to load conversations. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchConversations();
  }, []);

  // Filter conversations based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredConversations(conversations);
    } else {
      const filtered = conversations.filter(conv => 
        conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredConversations(filtered);
    }
  }, [searchQuery, conversations]);

  // Get the selected conversation object
  const getSelectedConversationData = () => {
    return conversations.find(conv => conv.id === selectedConversation);
  };

  const selectedConvData = getSelectedConversationData();
  
  // Fetch messages when a conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      const fetchMessages = async () => {
        try {
          setLoadingMessages(true);
          
          // Check if user is authenticated
          if (!isAuthenticated()) {
            console.log('User is not authenticated, using mock data for messages');
            if (mockMessages[selectedConversation]) {
              setConversationMessages(mockMessages[selectedConversation]);
            } else {
              setConversationMessages([]);
            }
            setLoadingMessages(false);
            return;
          }
          
          const token = getToken();
          const response = await fetch(`/api/messages/conversation/${selectedConversation}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (!response.ok) {
            if (response.status === 401) {
              console.log('Authentication failed, using mock data for messages');
              if (mockMessages[selectedConversation]) {
                setConversationMessages(mockMessages[selectedConversation]);
              } else {
                setConversationMessages([]);
              }
              setLoadingMessages(false);
              return;
            }
            throw new Error(`Failed to fetch messages: ${response.status}`);
          }
          
          const data = await response.json();
          
          // Format messages for display
          const formattedMessages = data.data.map(msg => {
            const messageDate = new Date(msg.createdAt);
            return {
              id: msg._id,
              text: msg.content,
              time: format(messageDate, 'h:mm a'),
              date: format(messageDate, 'M/d/yyyy'),
              sender: msg.sender._id === localStorage.getItem('userId') ? 'me' : 'them',
              senderName: `${msg.sender.firstName} ${msg.sender.lastName || ''}`,
              isRead: msg.isRead
            };
          });
          
          setConversationMessages(formattedMessages);
          setLoadingMessages(false);
          
          // Mark conversation as accepted since we're loading messages
          setConversationAccepted(true);
          
          // Focus on message input after loading messages
          if (messageInputRef.current) {
            messageInputRef.current.focus();
          }
          
        } catch (error) {
          console.error('Error fetching messages:', error);
          setLoadingMessages(false);
        }
      };
      
      fetchMessages();
    }
  }, [selectedConversation]);
  
  // Scroll to bottom of message history when new messages are added
  useEffect(() => {
    if (messageHistoryRef.current && conversationMessages.length > 0) {
      messageHistoryRef.current.scrollTop = messageHistoryRef.current.scrollHeight;
    }
  }, [conversationMessages]);
  
  // Handle accepting a message
  const handleAcceptMessage = async (messageId) => {
    try {
      if (!isAuthenticated()) {
        console.log('User is not authenticated, simulating message accept');
        setConversationAccepted(true);
        return;
      }
      
      const token = getToken();
      const response = await fetch(`/api/messages/${messageId}/accept`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to accept message: ${response.status}`);
      }
      
      // Update UI to show conversation is accepted
      setConversationAccepted(true);
      
      // Refresh conversations list
      const updatedPendingMessages = pendingMessages.filter(msg => msg._id !== messageId);
      setPendingMessages(updatedPendingMessages);
      
      // Focus on message input after accepting
      if (messageInputRef.current) {
        messageInputRef.current.focus();
      }
      
    } catch (error) {
      console.error('Error accepting message:', error);
      alert('Failed to accept message. Please try again.');
    }
  };
  
  // Handle ignoring a message
  const handleIgnoreMessage = async (messageId) => {
    try {
      if (!isAuthenticated()) {
        console.log('User is not authenticated, simulating message ignore');
        return;
      }
      
      const token = getToken();
      const response = await fetch(`/api/messages/${messageId}/ignore`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ignore message: ${response.status}`);
      }
      
      // Refresh conversations list
      const updatedPendingMessages = pendingMessages.filter(msg => msg._id !== messageId);
      setPendingMessages(updatedPendingMessages);
      
    } catch (error) {
      console.error('Error ignoring message:', error);
      alert('Failed to ignore message. Please try again.');
    }
  };
  
  // Handle accepting the conversation (legacy method)
  const handleAccept = () => {
    setConversationAccepted(true);
    
    // Focus on message input after accepting
    if (messageInputRef.current) {
      messageInputRef.current.focus();
    }
  };
  
  // Handle sending a new message
  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedConversation) {
      try {
        // Get recipient ID from the conversation
        const conversation = getSelectedConversationData();
        if (!conversation) return;
        
        // Find the recipient ID (the other participant)
        const recipientId = conversation.participants?.[0]?._id;
        if (!recipientId) {
          console.error('Could not determine recipient ID');
          return;
        }
        
        // Check if user is authenticated
        if (!isAuthenticated()) {
          console.log('User is not authenticated, simulating message send');
          
          // Create a mock message
          const now = new Date();
          const newMessageObj = {
            id: `mock-${Date.now()}`,
            text: newMessage,
            time: format(now, 'h:mm a'),
            date: format(now, 'M/d/yyyy'),
            sender: 'me',
            senderName: 'You',
            isRead: false
          };
          
          // Add to conversation messages
          setConversationMessages(prev => [...prev, newMessageObj]);
          
          // Update the conversation list with the new message
          setConversations(prev => 
            prev.map(conv => 
              conv.id === selectedConversation 
                ? { ...conv, lastMessage: newMessage, timestamp: now } 
                : conv
            )
          );
          
          // Clear the input
          setNewMessage("");
          return;
        }
        
        // Send the message
        const token = getToken();
        const response = await fetch('/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            conversationId: selectedConversation,
            recipientId: recipientId,
            content: newMessage,
            propertyId: conversation.property?._id || null
          })
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            console.log('Authentication failed, simulating message send');
            
            // Create a mock message
            const now = new Date();
            const newMessageObj = {
              id: `mock-${Date.now()}`,
              text: newMessage,
              time: format(now, 'h:mm a'),
              date: format(now, 'M/d/yyyy'),
              sender: 'me',
              senderName: 'You',
              isRead: false
            };
            
            // Add to conversation messages
            setConversationMessages(prev => [...prev, newMessageObj]);
            
            // Update the conversation list with the new message
            setConversations(prev => 
              prev.map(conv => 
                conv.id === selectedConversation 
                  ? { ...conv, lastMessage: newMessage, timestamp: now } 
                  : conv
              )
            );
            
            // Clear the input
            setNewMessage("");
            return;
          }
          throw new Error(`Failed to send message: ${response.status}`);
        }
        
        // Add the new message to the conversation
        const messageData = await response.json();
        
        // Format the new message
        const now = new Date();
        const newMessageObj = {
          id: messageData._id,
          text: newMessage,
          time: format(now, 'h:mm a'),
          date: format(now, 'M/d/yyyy'),
          sender: 'me',
          senderName: 'You',
          isRead: false
        };
        
        // Add to conversation messages
        setConversationMessages(prev => [...prev, newMessageObj]);
        
        // Update the conversation list with the new message
        setConversations(prev => 
          prev.map(conv => 
            conv.id === selectedConversation 
              ? { ...conv, lastMessage: newMessage, timestamp: now } 
              : conv
          )
        );
        
        // Clear the input
        setNewMessage("");
      } catch (error) {
        console.error('Error sending message:', error);
        alert('Failed to send message. Please try again.');
      }
    }
  };
  
  // Handle key press in message input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diffMs = now - timestamp;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return format(timestamp, 'MM/dd/yyyy');
    }
  };
  
  // Get role badge based on type
  const getRoleBadge = (type) => {
    switch(type) {
      case "AGENT":
        return <span className="role-badge agent">Agent</span>;
      case "CUSTOMER":
        return <span className="role-badge customer">Customer</span>;
      case "ADMIN":
        return <span className="role-badge admin">Admin</span>;
      default:
        return null;
    }
  };
  
  // Toggle chat view for mobile
  const toggleChatView = (convId) => {
    setSelectedConversation(convId);
    if (isMobile) {
      setShowChatView(true);
    }
  };
  
  // Go back to conversation list on mobile
  const goBackToList = () => {
    setShowChatView(false);
  };
  
  // Toggle test mode container expansion
  const toggleTestMode = () => {
    setTestModeExpanded(!testModeExpanded);
  };

  // Group messages by date
  const getMessagesByDate = () => {
    const messagesByDate = {};
    conversationMessages.forEach(message => {
      if (!messagesByDate[message.date]) {
        messagesByDate[message.date] = [];
      }
      messagesByDate[message.date].push(message);
    });
    return messagesByDate;
  };

  // Render the new MobileChatInterface component for mobile views
  if (isMobile) {
    return <MobileChatInterface />;
  }
  
  // Render the original desktop chat interface for non-mobile views
  return (
    <div className="chat-container">
      <div className="chat-panel">
        {/* Left panel - Conversations list */}
        <div className={`conversations-panel ${isMobile && showChatView ? 'hidden' : ''}`}>
          {!isMobile && (
            <div className="conversations-header">
              <h3>Active Conversations <span className="conversation-count">{conversations.length}</span></h3>
            </div>
          )}
          
          <div className="conversations-search">
            <input 
              type="text" 
              placeholder="Search conversations..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button 
                className="clear-search-btn" 
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
          
          {/* Pending Messages Section */}
          {pendingMessages.length > 0 && (
            <div className="pending-messages-section">
              <div className="pending-messages-header">
                <div className="pending-messages-icon">🔔</div>
                <h4>New Message Requests</h4>
                <span className="pending-count">{pendingMessages.length}</span>
              </div>
              <p className="pending-messages-description">
                These messages require your approval before starting a conversation
              </p>
              <div className="pending-messages-list">
                {pendingMessages.map((message) => (
                  <div key={message._id} className="pending-message-item">
                    <div className="pending-message-header">
                      <div className="sender-avatar">
                        {message.senderName ? message.senderName.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div className="sender-info">
                        <span className="sender-name">{message.senderName}</span>
                        <span className="message-time">
                          {message.createdAt ? format(new Date(message.createdAt), 'MMM d, h:mm a') : 'Just now'}
                        </span>
                      </div>
                    </div>
                    {message.propertyTitle && (
                      <div className="property-reference">
                        <span className="property-icon">🏠</span>
                        <span className="property-title">{message.propertyTitle}</span>
                      </div>
                    )}
                    <div className="pending-message-content">
                      <p>{message.content}</p>
                    </div>
                    <div className="pending-message-actions">
                      <button 
                        className="ignore-btn"
                        onClick={() => handleIgnoreMessage(message._id)}
                        title="Ignore this message request"
                      >
                        <span className="action-icon">✕</span>
                        Ignore
                      </button>
                      <button 
                        className="accept-btn"
                        onClick={() => handleAcceptMessage(message._id)}
                        title="Accept this message request and start conversation"
                      >
                        <span className="action-icon">✓</span>
                        Accept
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="conversations-list">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading conversations...</p>
              </div>
            ) : error ? (
              <div className="error-container">
                <p className="error-message">{error}</p>
                <button 
                  className="retry-button"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </button>
                <p className="error-help-text">
                  There was a problem loading your messages. Please try again.
                </p>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="empty-conversations">
                {searchQuery ? (
                  <div className="no-search-results">
                    <div className="no-results-icon">🔍</div>
                    <p>No conversations found matching "{searchQuery}"</p>
                    <button 
                      className="clear-search-button"
                      onClick={() => setSearchQuery("")}
                    >
                      Clear Search
                    </button>
                  </div>
                ) : (
                  <div className="no-conversations">
                    <div className="no-conversations-icon">💬</div>
                    <p>No conversations yet</p>
                    <p className="no-conversations-hint">Messages from property inquiries will appear here</p>
                  </div>
                )}
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <div 
                  key={conv.id} 
                  className={`conversation-item ${selectedConversation === conv.id ? 'active' : ''}`}
                  onClick={() => toggleChatView(conv.id)}
                >
                  <div className={`avatar ${conv.type.toLowerCase()}`}>
                    {conv.name.charAt(0).toUpperCase()}
                    {conv.online && <span className="online-indicator"></span>}
                  </div>
                  <div className="conversation-info">
                    <div className="conversation-header">
                      <span className="conversation-name">{conv.name}</span>
                      {getRoleBadge(conv.type)}
                      <span className="conversation-time">{formatTimestamp(conv.timestamp)}</span>
                    </div>
                    <div className="conversation-message">
                      <span className="message-icon">{conv.messageIcon}</span>
                      <span className="message-preview">{conv.lastMessage}</span>
                    </div>
                  </div>
                  {conv.unread > 0 && (
                    <div className="unread-count">{conv.unread}</div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Right panel - Chat view */}
        <div className={`chat-view ${isMobile && showChatView ? 'active' : ''}`}>
          {selectedConvData ? (
            <div className="chat-messages">
              {/* Header with user info */}
              <div className="chat-header">
                {isMobile && (
                  <button className="back-button" onClick={goBackToList}>
                    <span className="back-icon">←</span>
                  </button>
                )}
                <div className="user-profile">
                  <div className={`avatar user-avatar ${selectedConvData.type.toLowerCase()}`}>
                    {selectedConvData.name.charAt(0).toUpperCase()}
                    {selectedConvData.online && <span className="online-indicator"></span>}
                  </div>
                  <div className="user-info">
                    <h3>{selectedConvData.name}</h3>
                    <div className="user-status">
                      {getRoleBadge(selectedConvData.type)}
                      <span className="status-text">
                        {selectedConvData.online ? "Online" : "Offline"}
                      </span>
                      {selectedConvData.property && (
                        <span className="property-reference">
                          • Regarding: {selectedConvData.property.title || "Property"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Message history */}
              <div className="message-history" ref={messageHistoryRef}>
                {loadingMessages ? (
                  <div className="loading-messages">
                    <div className="loading-spinner"></div>
                    <p>Loading messages...</p>
                  </div>
                ) : conversationMessages.length === 0 ? (
                  <div className="no-messages">
                    <div className="no-messages-icon">💬</div>
                    <h4>No messages yet</h4>
                    <p>Start the conversation by sending a message below</p>
                  </div>
                ) : (
                  // Group messages by date
                  Object.entries(getMessagesByDate()).map(([date, messages]) => (
                    <div key={date} className="message-group">
                      <div className="date-divider">
                        <span>{date}</span>
                      </div>
                      
                      {messages.map(message => (
                        <div 
                          key={message.id} 
                          className={`message-bubble ${message.sender === 'me' ? 'sender' : 'receiver'}`}
                        >
                          <div className="message-content">
                            <p>{message.text}</p>
                            <div className="message-meta">
                              <span className="message-time">{message.time}</span>
                              {message.sender === 'me' && (
                                <span className="message-status">
                                  {message.isRead ? "Read" : "Sent"}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))
                )}
              </div>
              
              {/* Message input or action buttons based on conversation status */}
              {conversationAccepted ? (
                <div className="message-input-container">
                  <div className="message-input-wrapper">
                    <input 
                      type="text" 
                      placeholder="Write a message..." 
                      className="message-input"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      ref={messageInputRef}
                    />
                    <button className="attach-btn" title="Attach a file">
                      <i className="attachment-icon">📎</i>
                    </button>
                  </div>
                  <button 
                    className="send-btn"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    title="Send message"
                  >
                    Send
                  </button>
                </div>
              ) : (
                <div className="message-actions">
                  <button className="decline-btn">Decline</button>
                  <button className="accept-btn" onClick={handleAccept}>Accept</button>
                </div>
              )}
            </div>
          ) : (
            <div className="no-conversation">
              <div className="no-conversation-avatar">
                <img src="https://via.placeholder.com/100" alt="Profile" />
              </div>
              <h3>Select a conversation</h3>
              <p>Choose a conversation from the list to start messaging</p>
              <div className="no-messages-info">
                <p>No messages selected yet.</p>
                <p>Select a conversation to start chatting.</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile footer menu */}
      {isMobile && (
        <>
          <div className={`test-mode-container ${testModeExpanded ? 'expanded' : ''}`} onClick={toggleTestMode}>
            <span className="test-mode-icon">⚙️</span>
            <span className="test-mode-label">Test Mode</span>
          </div>
          
          <div className="mobile-footer-menu">
            <button className="footer-menu-button">
              <span className="footer-menu-icon">🏠</span>
              <span>Home</span>
            </button>
            <button className="footer-menu-button">
              <span className="footer-menu-icon">🔍</span>
              <span>Search</span>
            </button>
            <button className="footer-menu-button">
              <span className="footer-menu-icon">💬</span>
              <span>Messages</span>
            </button>
            <button className="footer-menu-button">
              <span className="footer-menu-icon">👤</span>
              <span>Account</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Messages;
