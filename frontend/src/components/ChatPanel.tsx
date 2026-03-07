import { useEffect, useMemo, useState } from "react";
import { createChatSocket } from "../lib/ws";
import { getOrCreateIdentityKeyPair } from "../lib/e2ee";
import { useAuthStore } from "../state/authStore";
import { useChatStore } from "../state/chatStore";

type Thread = {
  id: string;
  participants: Array<{
    userId: string;
    user: {
      id: string;
      profile?: {
        displayName?: string;
      };
    };
  }>;
  latestMessage?: {
    id: string;
    createdAt: string;
  } | null;
};

// Mock threads for demo
const MOCK_THREADS: Thread[] = [
  {
    id: "thread-1",
    participants: [
      { userId: "demo-user-1", user: { id: "demo-user-1", profile: { displayName: "Demo User" } } },
      { userId: "user-2", user: { id: "user-2", profile: { displayName: "John D." } } }
    ],
    latestMessage: { id: "msg-1", createdAt: new Date().toISOString() }
  },
  {
    id: "thread-2",
    participants: [
      { userId: "demo-user-1", user: { id: "demo-user-1", profile: { displayName: "Demo User" } } },
      { userId: "user-3", user: { id: "user-3", profile: { displayName: "Sarah M." } } }
    ],
    latestMessage: { id: "msg-2", createdAt: new Date(Date.now() - 3600000).toISOString() }
  }
];

const MOCK_MESSAGES = [
  { id: "1", threadId: "thread-1", senderId: "user-2", ciphertext: "encrypted", nonce: "nonce", ratchetHeader: "{}", senderKeyId: "key1", createdAt: new Date(Date.now() - 7200000).toISOString() },
  { id: "2", threadId: "thread-1", senderId: "demo-user-1", ciphertext: "encrypted", nonce: "nonce", ratchetHeader: "{}", senderKeyId: "key2", createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: "3", threadId: "thread-1", senderId: "user-2", ciphertext: "encrypted", nonce: "nonce", ratchetHeader: "{}", senderKeyId: "key1", createdAt: new Date().toISOString() }
];

export function ChatPanel() {
  const { user } = useAuthStore();
  const { activeThreadId, setActiveThread, messagesByThread, setMessages, appendMessage } = useChatStore();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [draft, setDraft] = useState("");
  const [online, setOnline] = useState(true);

  const keyPair = useMemo(() => getOrCreateIdentityKeyPair(), []);

  useEffect(() => {
    // Load mock threads in demo mode
    setThreads(MOCK_THREADS);
    if (!activeThreadId && MOCK_THREADS.length) {
      setActiveThread(MOCK_THREADS[0].id);
    }
  }, [activeThreadId, setActiveThread]);

  useEffect(() => {
    if (!activeThreadId) return;
    // Load mock messages
    if (activeThreadId === "thread-1") {
      setMessages(activeThreadId, MOCK_MESSAGES);
    }
  }, [activeThreadId, setMessages]);

  const activeMessages = activeThreadId ? messagesByThread[activeThreadId] ?? [] : [];

  async function sendMessage() {
    if (!activeThreadId || !draft.trim()) return;

    const newMessage = {
      id: "msg-" + Date.now(),
      threadId: activeThreadId,
      senderId: user?.id || "demo-user-1",
      ciphertext: "encrypted",
      nonce: "nonce",
      ratchetHeader: "{}",
      senderKeyId: keyPair.publicKey,
      createdAt: new Date().toISOString()
    };

    appendMessage(activeThreadId, newMessage);
    setDraft("");
  }

  return (
    <section className="panel chat-panel">
      <div className="chat-head">
        <h3>Secure Chat</h3>
        <span className={online ? "status-on" : "status-off"}>{online ? "Online" : "Offline"}</span>
      </div>
      <div className="chat-layout">
        <aside className="threads">
          {threads.map((thread: { participants: any[]; id: any; }) => {
            const peer = thread.participants.find((p: { userId: any; }) => p.userId !== user?.id);
            return (
              <button
                key={thread.id}
                className={activeThreadId === thread.id ? "thread active" : "thread"}
                onClick={() => setActiveThread(thread.id)}
              >
                {peer?.user?.profile?.displayName ?? "Thread"}
              </button>
            );
          })}
          {!threads.length ? <p className="muted">No active threads yet.</p> : null}
        </aside>
        <div className="messages">
          <div className="message-list">
            {activeMessages.map((message: { id: any; senderId: any; createdAt: string | number | Date; }) => (
              <div key={message.id} className={message.senderId === user?.id ? "bubble me" : "bubble them"}>
                <p>[Demo Mode] {message.senderId === user?.id ? "You" : "User"}</p>
                <small>{new Date(message.createdAt).toLocaleTimeString()}</small>
              </div>
            ))}
          </div>
          <div className="send-box">
            <input 
              value={draft} 
              onChange={(e: { target: { value: any; }; }) => setDraft(e.target.value)} 
              placeholder="Type encrypted message" 
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>
    </section>
  );
}
