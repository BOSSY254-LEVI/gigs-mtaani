import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { AppLayout } from "../components/Layout";
import { ChatPanel, type ChatLaunchIntent } from "../components/ChatPanel";
import { useThemeStore } from "../state/themeStore";
import { MessageCircle } from "lucide-react";

export function ChatPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [launchIntent, setLaunchIntent] = useState<ChatLaunchIntent | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [showNewConversation, setShowNewConversation] = useState(false);

  useEffect(() => {
    // Set theme to light when entering chat page
    useThemeStore.getState().setTheme("light");
  }, []);

  // Check for URL parameters to start a new conversation
  useEffect(() => {
    const gigId = searchParams.get("gigId");
    const gigTitle = searchParams.get("gigTitle");
    const posterId = searchParams.get("posterId");
    const posterName = searchParams.get("posterName");

    if (gigId || posterId) {
      const intent: ChatLaunchIntent = {
        requestId: Date.now(),
        gigId: gigId || "",
        gigTitle: gigTitle || "",
        posterId: posterId,
        posterName: posterName || undefined
      };
      setLaunchIntent(intent);
    }
  }, [searchParams]);

  const handleStatusChange = (message: string) => {
    setStatusMessage(message);
    // Clear status message after 3 seconds
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const handleStartNewConversation = () => {
    setShowNewConversation(true);
  };

  return (
    <AppLayout title="Messages">
      <div className="dashboard-bottom-grid">
        {statusMessage && (
          <div className="status-banner">
            <span>{statusMessage}</span>
          </div>
        )}
        
        {/* Start Conversation Button - Always visible */}
        <div className="flex justify-end mb-4">
          <button
            className="btn btn-primary btn-sm flex items-center gap-2"
            onClick={handleStartNewConversation}
          >
            <MessageCircle size={16} />
            Start New Conversation
          </button>
        </div>

        {/* New Conversation Modal - Simplified inline form */}
        {showNewConversation && (
          <div className="mb-4 p-4 bg-white border border-slate-200 rounded-xl">
            <p className="text-slate-600 text-sm mb-2">
              To start a new conversation, browse gigs on the dashboard and click "Message" on any gig poster.
            </p>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setShowNewConversation(false)}
            >
              Got it
            </button>
          </div>
        )}

        <ChatPanel
          launchIntent={launchIntent}
          onLaunchHandled={() => {
            setLaunchIntent(null);
            // Clear URL params after handling
            setSearchParams({}, { replace: true });
          }}
          onStatusChange={handleStatusChange}
        />
      </div>
    </AppLayout>
  );
}

