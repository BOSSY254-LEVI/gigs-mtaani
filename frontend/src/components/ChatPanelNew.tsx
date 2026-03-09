import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { useAuthStore } from "../state/authStore";

interface UserSummary {
  id: string;
  name: string;
  avatar: string | null;
}

interface Message {
  id: string;
  content: string;
  fileUrl: string | null;
  createdAt: string;
  read: boolean;
  sender: UserSummary;
}

interface Conversation {
  partnerId: string;
  partner: UserSummary;
  lastMessage: { content: string; createdAt: string; read: boolean };
  unread: number;
}

export type ChatLaunchIntent = {
  requestId: number;
  gigId: string;
  gigTitle: string;
  posterName?: string;
  posterId?: string;
};

type ChatPanelProps = {
  launchIntent?: ChatLaunchIntent | null;
  onLaunchHandled?: () => void;
  onStatusChange?: (message: string) => void;
};

export function ChatPanel({ launchIntent, onLaunchHandled, onStatusChange }: ChatPanelProps) {
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activePartnerId, setActivePartnerId] = useState<string | null>(null);
  const [activePartner, setActivePartner] = useState<UserSummary | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const intentProcessedRef = useRef<boolean>(false);

  const fetchConversations = async () => {
    try {
      const res = await fetch("/api/v1/chat/threads");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setConversations(data);
        } else if (data.thread) {
          const thread = data.thread;
          const partner = thread.participants?.find((p: { userId: string }) => p.userId !== user?.id);
          if (partner) {
            setConversations([{
              partnerId: partner.userId,
              partner: {
                id: partner.userId,
                name: partner.user?.profile?.displayName || "Gig Poster",
                avatar: null
              },
              lastMessage: { content: "", createdAt: "", read: true },
              unread: 0
            }]);
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    } finally {
      setLoadingConvos(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (!launchIntent || !user || intentProcessedRef.current) return;

    const handleLaunchIntent = async () => {
      intentProcessedRef.current = true;
      try {
        const res = await fetch("/api/v1/chat/threads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            gigId: launchIntent.gigId,
            gigTitle: launchIntent.gigTitle,
            participantId: launchIntent.posterId,
            participantName: launchIntent.posterName || "Gig Poster"
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.thread && data.thread.participants) {
            const partner = data.thread.participants.find(
              (p: { userId: string }) => p.userId !== user.id
            );
            if (partner) {
              setActivePartnerId(partner.userId);
              setActivePartner({
                id: partner.userId,
                name: partner.user?.profile?.displayName || launchIntent.posterName || "Gig Poster",
                avatar: null
              });
              onStatusChange?.(`Starting conversation about "${launchIntent.gigTitle}"`);
            }
          }
        }
      } catch (error) {
        console.error("Failed to create thread:", error);
      } finally {
        onLaunchHandled?.();
      }
    };

    handleLaunchIntent();
  }, [launchIntent, user, onLaunchHandled, onStatusChange]);

  useEffect(() => {
    if (!activePartnerId) return;

    const fetchThread = async () => {
      setLoadingMessages(true);
      try {
        const res = await fetch(`/api/v1/chat/threads/${activePartnerId}/messages`);
        if (res.ok) {
          const data: Message[] = await res.json();
          setMessages(data);
          setConversations((prev) =>
            prev.map((c) => (c.partnerId === activePartnerId ? { ...c, unread: 0 } : c))
          );
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setLoadingMessages(false);
      }
    };

    const convo = conversations.find((c) => c.partnerId === activePartnerId);
    if (convo) setActivePartner(convo.partner);

    fetchThread();
  }, [activePartnerId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!activePartnerId || !user) return;
    const interval = setInterval(async () => {
      const res = await fetch(`/api/v1/chat/threads/${activePartnerId}/messages`);
      if (res.ok) {
        const data: Message[] = await res.json();
        setMessages(data);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [activePartnerId, user]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activePartnerId || sending) return;

    setSending(true);
    try {
      const res = await fetch("/api/v1/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientId: activePartnerId, content: newMessage.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        const msg: Message = {
          id: data.message?.id || Date.now().toString(),
          content: newMessage.trim(),
          fileUrl: null,
          createdAt: new Date().toISOString(),
          read: true,
          sender: {
            id: user.id,
            name: user.profile?.displayName || user.displayName || "You",
            avatar: null
          }
        };
        setMessages((prev) => [...prev, msg]);
        setNewMessage("");
        fetchConversations();
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    return isToday
      ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : d.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-slate-600">Please log in to access messages.</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 gap-6 overflow-hidden">
      <aside className="w-72 flex-shrink-0 bg-white border border-slate-200 rounded-xl flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-slate-900 font-semibold text-lg">Messages</h2>
        </div>

        {loadingConvos ? (
          <div className="flex-1 flex items-center justify-center">
            <span className="text-slate-600 text-sm">Loading...</span>
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="text-4xl mb-3">💬</div>
            <p className="text-slate-600 text-sm">No conversations yet.</p>
            <p className="text-slate-500 text-xs mt-1">
              Message someone from a gig or project page.
            </p>
          </div>
        ) : (
          <ul className="flex-1 overflow-y-auto divide-y divide-slate-200">
            {conversations.map((convo) => (
              <li key={convo.partnerId}>
                <button
                  onClick={() => {
                    setActivePartnerId(convo.partnerId);
                    setActivePartner(convo.partner);
                  }}
                  className={`w-full text-left px-4 py-3 hover:bg-slate-100 transition-colors flex items-center gap-3 ${
                    activePartnerId === convo.partnerId ? "bg-amber-50" : ""
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-amber-600 flex-shrink-0 flex items-center justify-center text-sm font-bold text-white">
                    {convo.partner.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-900 truncate">
                        {convo.partner.name}
                      </span>
                      {convo.unread > 0 && (
                        <span className="ml-2 bg-amber-600 text-white text-xs rounded-full px-1.5 py-0.5">
                          {convo.unread}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 truncate">{convo.lastMessage.content}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>

      <main className="flex-1 bg-white border border-slate-200 rounded-xl flex flex-col overflow-hidden">
        {!activePartnerId ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="text-5xl mb-4">💬</div>
            <h3 className="text-slate-900 text-xl font-semibold mb-2">Select a conversation</h3>
            <p className="text-slate-600 text-sm max-w-xs">
              Choose a conversation from the sidebar, or message someone directly from a gig or project.
            </p>
          </div>
        ) : (
          <>
            <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-600 flex-shrink-0 flex items-center justify-center text-sm font-bold text-white">
                {activePartner?.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-slate-900 font-semibold">{activePartner?.name}</h3>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {loadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <span className="text-slate-600 text-sm">Loading messages...</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="text-slate-600 text-sm">No messages yet. Say hello!</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isOwn = msg.sender.id === user.id;
                  return (
                    <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                      {!isOwn && (
                        <div className="w-7 h-7 rounded-full bg-slate-300 flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-700 mr-2 mt-1">
                          {msg.sender.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className={`max-w-xs lg:max-w-md ${isOwn ? "items-end" : "items-start"} flex flex-col`}>
                        <div className={`rounded-2xl px-4 py-2.5 text-sm ${
                          isOwn ? "bg-amber-600 text-white rounded-br-sm" : "bg-slate-100 text-slate-900 rounded-bl-sm"
                        }`}>
                          {msg.content}
                        </div>
                        <span className="text-xs text-slate-600 mt-1 px-1">
                          {formatTime(msg.createdAt)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-gradient-to-b from-slate-50 to-white">
              <form onSubmit={sendMessage} className="flex gap-2 items-center">
                <div className="flex-1 flex items-center gap-2 bg-white border-2 border-slate-200 rounded-2xl px-4 py-3 hover:border-slate-300 focus-within:border-amber-500 focus-within:shadow-md transition-all">
                  <span className="text-slate-400 text-lg">💬</span>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent text-slate-900 placeholder-slate-500 text-sm focus:outline-none"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors px-6 py-3 rounded-2xl font-medium"
                >
                  {sending ? "…" : "Send"}
                </Button>
              </form>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
