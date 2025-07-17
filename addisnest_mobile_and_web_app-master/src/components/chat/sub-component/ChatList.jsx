import React, { useEffect, useState } from "react";
import { ProfileImg } from "../../../assets/images";
import { useSelector, useDispatch } from "react-redux";
import { GetChatlistData } from "../../../Redux-store/Slices/ChatlistSlice";

const ChatList = ({ activeUser, setActiveUser }) => {
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState("");
    
    // Get chat data from Redux store
    const chatData = useSelector((state) => state.Chatlist?.Data || {});
    const connectedUsers = chatData?.data || [];
    const isLoading = chatData?.pending || false;
    
    // Fetch connected users on component mount
    useEffect(() => {
        // Try to fetch chat list data if the slice exists
        try {
            dispatch(GetChatlistData());
        } catch (error) {
            console.error("Error fetching chat list:", error);
        }
    }, [dispatch]);
    
    // Filter users based on search term
    const filteredUsers = connectedUsers.filter(user => 
        user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user?.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Only show users who have active conversations (have exchanged messages)
    const activeConversations = filteredUsers.filter(user => 
        user?.lastMessage && user?.lastMessage.trim() !== ""
    );
    
    // Add mock test data when no real data is available (for development purposes)
    const testConversations = activeConversations.length === 0 ? [
        {
            id: 1,
            name: "John Smith",
            lastMessage: "Hello, I'm interested in the property listing",
            lastMessageTime: new Date().toISOString(),
            profileImage: null,
            isOnline: true,
            messages: [
                {
                    id: 1,
                    content: "Hello, I'm interested in the property listing on Main Street",
                    timestamp: new Date(Date.now() - 3600000).toISOString(),
                    isFromUser: false,
                    sender: 'user'
                },
                {
                    id: 2,
                    content: "Great! I'd be happy to help you with that property. What would you like to know?",
                    timestamp: new Date(Date.now() - 3000000).toISOString(),
                    isFromUser: true,
                    sender: 'agent'
                }
            ],
            isAccepted: true
        },
        {
            id: 2,
            name: "Sarah Johnson",
            lastMessage: "Is the property still available?",
            lastMessageTime: new Date(Date.now() - 7200000).toISOString(),
            profileImage: null,
            isOnline: false,
            messages: [
                {
                    id: 1,
                    content: "Is the property still available?",
                    timestamp: new Date(Date.now() - 7200000).toISOString(),
                    isFromUser: false,
                    sender: 'user'
                }
            ],
            isAccepted: false
        }
    ] : activeConversations;

    return (
        <>
            <div className="chat-left">
                <div className="chat-users-main">
                    <div className="chat-header">
                        <div className="chathead-convrdtl">
                            <h3>Active Conversations</h3>
                        </div>
                        <div className="active-chats">
                            <span>{testConversations.length}</span>
                        </div>
                    </div>
                    <div className="chat-wraper">
                        <div className="chat-filter">
                            <div className="ticket-search">
                                <div className="inputwth-icon">
                                    <input 
                                        type="text" 
                                        placeholder="Search conversations..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <div className="input-icon">
                                        <span>
                                            <i className="fa-solid fa-magnifying-glass"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="chat-list">
                            {isLoading ? (
                                <div className="loading-message">
                                    <p>Loading conversations...</p>
                                </div>
                            ) : testConversations.length > 0 ? (
                                <ul>
                                    {testConversations.map((user) => (
                                        <li key={user.id || user._id}>
                                            <div
                                                className={`chat-user-card ${activeUser?.id === user.id ? "active" : ""}`}
                                                onClick={() => setActiveUser(user)}
                                            >
                                                <div className="chat-user-bg">
                                                    <span
                                                        style={{ 
                                                            backgroundImage: `url(${user.profileImage || user.image || ProfileImg})` 
                                                        }}
                                                    ></span>
                                                    <em className={user.isOnline ? "online" : "offline"}></em>
                                                </div>
                                                <div className="chat-user-detail">
                                                    <h3>{user.name || user.firstName + ' ' + user.lastName || 'Unknown User'}</h3>
                                                    <p>{user.lastMessage || 'No messages yet'}</p>
                                                    {user.lastMessageTime && (
                                                        <span className="last-message-time">
                                                            {new Date(user.lastMessageTime).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="no-conversations">
                                    <p>No active conversations found</p>
                                    {searchTerm && (
                                        <p>Try adjusting your search terms</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChatList;
