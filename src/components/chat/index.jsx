import React, { useState } from "react";
import { ChatInbox, ChatList } from "./sub-component";

const ChatPage = () => {
  const [activeUser, setActiveUser] = useState(null);

  return (
    <>
      <div className="main-wrapper">
        <section className="chat-section">
          <div className="container">
            <div className="ticket-head">
              <h2>Messages</h2>
            </div>
            <div className="chat-main">
              <ChatList activeUser={activeUser} setActiveUser={setActiveUser} />
              <ChatInbox activeUser={activeUser} />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ChatPage;
