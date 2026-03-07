import { useState, useRef, useEffect } from "react";
import { useChatStore } from "../state/chatStore";

interface ChatInterfaceProps {
  gigId: string;
  gigTitle: string;
  posterName: string;
  posterAvatar?: string;
  onSendMessage: (message: string) => void;
  onGetDirections?: (gigId: string) => void;
  onClose: () => void;
}

export function ChatInterface({ 
  gigId, 
  gigTitle, 
  posterName, 
  posterAvatar, 
  onSendMessage, 
  onGetDirections, 
  onClose 
}: ChatInterfaceProps) {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage } = useChatStore();

  const currentMessages = messages.filter(m => m.threadId === gigId);

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleGetDirections = () => {
    onGetDirections?.(gigId);
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Mock typing indicator
  useEffect(() => {
    const timer = setTimeout(() => setIsTyping(false), 1000);
    return () => clearTimeout(timer);
  }, [currentMessages]);

  return (
    <div className="chat-interface theme-transition">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="chat-user-info">
          <img 
            src={posterAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(posterName)}&background=random&color=fff`}
            alt={posterName}
            className="user-avatar"
          />
          <div className="user-details">
            <h4>{posterName}</h4>
            <p className="gig-title">{gigTitle}</p>
            <span className="status-indicator online">Online</span>
          </div>
        </div>
        <div className="chat-actions">
          <button 
            className="btn-icon"
            onClick={handleGetDirections}
            title="Get Directions"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2l7 10h-3v8h-4v-8H9l7-10z" fill="currentColor"/>
              <path d="M12 22v-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <button 
            className="btn-icon"
            onClick={onClose}
            title="Close Chat"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {currentMessages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h5>Start the conversation</h5>
            <p>Send a message to ask about the gig details, negotiate terms, or get more information.</p>
          </div>
        ) : (
          currentMessages.map((msg) => (
            <div key={msg.id} className={`message-bubble ${msg.senderId === 'user' ? 'sent' : 'received'}`}>
              <div className="message-content">
                <p>{msg.content}</p>
                <span className="message-time">{new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
            </div>
          ))
        )}
        
        {isTyping && (
          <div className="message-bubble received typing-indicator">
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="chat-input">
        <div className="input-container">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="message-input"
          />
          <button 
            className="send-button"
            onClick={handleSendMessage}
            disabled={!message.trim()}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div className="quick-actions">
          <button className="quick-btn" onClick={() => setMessage("Hi, I'm interested in this gig. Can you tell me more details?")}>
            Ask Details
          </button>
          <button className="quick-btn" onClick={() => setMessage("What's your payment method?")}>
            Payment Method
          </button>
          <button className="quick-btn" onClick={() => setMessage("Can we negotiate the price?")}>
            Negotiate
          </button>
        </div>
      </div>
    </div>
  );
}