import React, { useState, useEffect } from "react";
import { ProfileImg } from "../../../assets/images";
import { toast } from "react-toastify";
import Api from "../../../Apis/Api";

const ChatInbox = ({ activeUser }) => {
  const [actionTaken, setActionTaken] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // When activeUser changes, load their conversation
  useEffect(() => {
    if (activeUser) {
      // Here you would typically load the conversation history
      setMessages(activeUser.messages || []);
      setActionTaken(activeUser.isAccepted || false);
      
      // Real implementation would fetch messages from API
      // fetchMessages(activeUser.id);
    }
  }, [activeUser]);

  const fetchMessages = async (userId) => {
    try {
      setLoading(true);
      // const response = await Api.get(`chat/messages/${userId}`);
      // setMessages(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setLoading(false);
      toast.error("Failed to load messages. Please try again.");
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() && activeUser) {
      // Create new message object
      const newMessageObj = {
        id: Date.now(),
        content: newMessage.trim(),
        timestamp: new Date().toISOString(),
        isFromUser: true, // This message is from the current user (agent)
        sender: 'agent'
      };
      
      // Add message to local state to display immediately
      setMessages(prevMessages => [...prevMessages, newMessageObj]);
      
      // Clear input
      setNewMessage("");
      
      // Here you would typically send the message via API
      try {
        // Example API call (commented out)
        /*
        await Api.post(`chat/send`, {
          recipientId: activeUser.id,
          message: newMessage.trim()
        });
        */
        console.log("Message sent:", newMessageObj);
      } catch (error) {
        console.error("Error sending message:", error);
        toast.error("Failed to send message. Please try again.");
      }
    }
  };

  const handleAcceptConversation = async () => {
    try {
      setLoading(true);
      // Example API call (commented out)
      /*
      await Api.post(`chat/accept`, {
        conversationId: activeUser.id
      });
      */
      setActionTaken(true);
      setLoading(false);
      toast.success("Conversation accepted successfully");
    } catch (error) {
      console.error("Error accepting conversation:", error);
      setLoading(false);
      toast.error("Failed to accept conversation. Please try again.");
    }
  };

  const handleDeclineConversation = async () => {
    try {
      setLoading(true);
      // Example API call (commented out)
      /*
      await Api.post(`chat/decline`, {
        conversationId: activeUser.id
      });
      */
      setLoading(false);
      toast.success("Conversation declined");
      // You might want to remove the conversation from the list or navigate away
    } catch (error) {
      console.error("Error declining conversation:", error);
      setLoading(false);
      toast.error("Failed to decline conversation. Please try again.");
    }
  };

  return (
    <>
      <div className="chat-right">
        <div className="chat-detail">
          {activeUser ? (
            <>
              <div className="chat-header">
                <div className="chathead-userdtl">
                  <div className="chathead-usrbg">
                    <span
                      style={{
                        backgroundImage: `url(${
                          activeUser.profileImage || activeUser.image || ProfileImg
                        })`,
                      }}
                    ></span>
                  </div>
                  <div className="chathead-userdescrp">
                    <h3>
                      {activeUser.name || activeUser.firstName + ' ' + activeUser.lastName || 'Unknown User'}
                    </h3>
                    <p>
                      {activeUser.lastMessageTime 
                        ? `Last message ${new Date(activeUser.lastMessageTime).toLocaleDateString()}`
                        : 'No recent messages'
                      }
                    </p>
                  </div>
                </div>
              </div>
              <div className="msginbox-sec">
                {loading ? (
                  <div className="loading-messages">
                    <p>Loading messages...</p>
                  </div>
                ) : messages.length > 0 ? (
                  <ul>
                    <div className="msginbox-tp-heading">
                      <h5>{new Date().toLocaleDateString()}</h5>
                    </div>
                    {messages.map((message, index) => (
                      <li key={index} className={message.isFromUser ? "msg-sender" : "msg-reciver"}>
                        <div className="card">
                          <div className="msg-descrp msg-format">
                            <p>{message.content}</p>
                          </div>
                        </div>
                        <div className="msgdate">
                          <p>{new Date(message.timestamp).toLocaleTimeString()}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="no-messages">
                    <p>This conversation will appear here once you start chatting.</p>
                  </div>
                )}

                <div className="chat-footer">
                  {!actionTaken ? (
                    <div className="chat-footer-action">
                      <button
                        className="btn btn-plain"
                        onClick={handleDeclineConversation}
                        disabled={loading}
                      >
                        {loading ? "Processing..." : "Decline"}
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={handleAcceptConversation}
                        disabled={loading}
                      >
                        {loading ? "Processing..." : "Accept"}
                      </button>
                    </div>
                  ) : (
                    <div className="chatftr-main">
                      <div className="chat-typinput">
                        <input 
                          type="text" 
                          placeholder="Write a message..." 
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <div className="attachment-icon">
                          <i className="fa-solid fa-paperclip"></i>
                        </div>
                      </div>
                      <div className="moremenu-chtbtn">
                        <button 
                          className="btn btn-primary btnwth-icon"
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim()}
                        >
                          Send
                          <span><i className="fa-solid fa-paper-plane"></i></span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="no-conversation-selected">
              <div className="empty-state">
                <h3>Select a conversation</h3>
                <p>Choose a conversation from the left to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatInbox;
