import { useState, useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AppLayout } from "../components/Layout";
import { ChatInterface } from "../components/ChatInterface";
import { useAuthStore } from "../state/authStore";
import { useChatStore, SelectedThread } from "../state/chatStore";

// Mock data for demo mode
const MOCK_THREADS = [
  {
    id: "thread-1",
    gigId: "1",
    gigTitle: "Campus Food Delivery",
    posterName: "John D.",
    lastMessage: "Can you deliver to Dorm B by 1 PM?",
    lastMessageTime: new Date(Date.now() - 3600000).toISOString(),
    unreadCount: 2,
    isOnline: true
  },
  {
    id: "thread-2",
    gigId: "2",
    gigTitle: "Math Tutoring - Calculus I",
    posterName: "Sarah M.",
    lastMessage: "Are you available tomorrow evening?",
    lastMessageTime: new Date(Date.now() - 7200000).toISOString(),
    unreadCount: 0,
    isOnline: false
  },
  {
    id: "thread-3",
    gigId: "3",
    gigTitle: "Event Photography",
    posterName: "Mike R.",
    lastMessage: "I can help with the photography gig!",
    lastMessageTime: new Date(Date.now() - 86400000).toISOString(),
    unreadCount: 1,
    isOnline: true
  }
];

export function ChatPage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { selectedThread, setSelectedThread } = useChatStore();

  const [searchQuery, setSearchQuery] = useState("");

  // Use mock data in demo mode
  const threadsQuery = useQuery({
    queryKey: ["threads"],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return { threads: MOCK_THREADS };
    },
    refetchInterval: 10000
  });

  const filteredThreads = useMemo(() => {
    if (!threadsQuery.data?.threads) return [];
    
    return threadsQuery.data.threads.filter(thread => 
      thread.gigTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.posterName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [threadsQuery.data?.threads, searchQuery]);

  const handleSelectThread = (thread: any) => {
    setSelectedThread({
      id: thread.id,
      gigId: thread.gigId,
      gigTitle: thread.gigTitle,
      posterName: thread.posterName,
      isOnline: thread.isOnline
    });
  };

  const handleNewMessage = (message: string) => {
    if (selectedThread) {
      // Simulate sending message
      console.log(`Sending message to ${selectedThread.gigTitle}: ${message}`);
      
      // Update unread count for other threads
      queryClient.invalidateQueries({ queryKey: ["threads"] });
    }
  };

  const handleQuickAction = (action: string) => {
    if (selectedThread) {
      let message = "";
      switch (action) {
        case "details":
          message = "Can you provide more details about this gig?";
          break;
        case "payment":
          message = "What's the payment method for this gig?";
          break;
        case "negotiate":
          message = "Can we discuss the payment terms?";
          break;
        case "directions":
          message = "Can you share the location details?";
          break;
      }
      handleNewMessage(message);
    }
  };

  return (
    <AppLayout title="Messages">
      <div className="chat-page-container">
        <div className="chat-sidebar">
          <div className="chat-sidebar-header">
            <h3>Conversations</h3>
            <div className="search-box">
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 110-15 7.5 7.5 0 010 15z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
          
          <div className="threads-list">
            {threadsQuery.isLoading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <span>Loading conversations...</span>
              </div>
            ) : null}
            
            {threadsQuery.isError ? (
              <div className="error-state">
                <span className="error-text">Failed to load conversations</span>
              </div>
            ) : null}

            {filteredThreads.length === 0 && !threadsQuery.isLoading ? (
              <div className="empty-threads">
                <div className="empty-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h4>No conversations yet</h4>
                <p>Start chatting with gig posters to see your conversations here.</p>
              </div>
            ) : null}

            {filteredThreads.map((thread) => (
              <div
                key={thread.id}
                className={`thread-item ${selectedThread?.id === thread.id ? 'active' : ''}`}
                onClick={() => handleSelectThread(thread)}
              >
                <div className="thread-avatar">
                  <div className="avatar-initials">
                    {thread.posterName.charAt(0).toUpperCase()}
                  </div>
                  {thread.isOnline && <div className="status-dot"></div>}
                </div>
                
                <div className="thread-info">
                  <div className="thread-header">
                    <span className="thread-name">{thread.posterName}</span>
                    <span className="thread-time">
                      {formatTime(thread.lastMessageTime)}
                    </span>
                  </div>
                  
                  <div className="thread-gig">
                    <span className="gig-badge">{thread.gigTitle}</span>
                  </div>
                  
                  <div className="thread-preview">
                    <span className="message-text">{thread.lastMessage}</span>
                    {thread.unreadCount > 0 && (
                      <span className="unread-badge">{thread.unreadCount}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="chat-main">
          {selectedThread ? (
            <ChatInterface
              gigTitle={selectedThread.gigTitle}
              posterName={selectedThread.posterName}
              isOnline={selectedThread.isOnline}
              onSendMessage={handleNewMessage}
              onQuickAction={handleQuickAction}
            />
          ) : (
            <div className="chat-placeholder">
              <div className="placeholder-content">
                <div className="placeholder-icon">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                    <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>Select a conversation</h3>
                <p>Choose a conversation from the list to start chatting</p>
                <div className="quick-actions">
                  <button className="btn btn-secondary">Browse Gigs</button>
                  <button className="btn btn-primary">New Message</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

// Helper function to format time
function formatTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric'
  });
}