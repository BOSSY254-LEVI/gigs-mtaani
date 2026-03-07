import { create } from "zustand";

export type ChatEnvelope = {
  id: string;
  threadId: string;
  senderId: string;
  ciphertext: string;
  nonce: string;
  ratchetHeader: string;
  senderKeyId: string;
  createdAt: string;
};

export type ChatMessage = {
  id: string;
  threadId: string;
  senderId: string;
  content: string;
  createdAt: string;
};

export type SelectedThread = {
  id: string;
  gigId: string;
  gigTitle: string;
  posterName: string;
  isOnline: boolean;
};

type ChatState = {
  activeThreadId: string | null;
  selectedThread: SelectedThread | null;
  messagesByThread: Record<string, ChatEnvelope[]>;
  messages: ChatMessage[];
  setActiveThread: (threadId: string | null) => void;
  setSelectedThread: (thread: SelectedThread | null) => void;
  setMessages: (threadId: string, messages: ChatEnvelope[]) => void;
  appendMessage: (threadId: string, message: ChatEnvelope) => void;
  sendMessage: (threadId: string, content: string) => void;
  clearMessages: () => void;
};

export const useChatStore = create<ChatState>((set, get) => ({
  activeThreadId: null,
  selectedThread: null,
  messagesByThread: {},
  messages: [],
  setActiveThread: (threadId) => set({ activeThreadId: threadId }),
  setSelectedThread: (thread) => set({ selectedThread: thread }),
  setMessages: (threadId, messages) =>
    set((state) => ({
      ...state,
      messagesByThread: {
        ...state.messagesByThread,
        [threadId]: messages
      }
    })),
  appendMessage: (threadId, message) =>
    set((state) => {
      const existing = state.messagesByThread[threadId] ?? [];
      return {
        ...state,
        messagesByThread: {
          ...state.messagesByThread,
          [threadId]: [...existing, message]
        }
      };
    }),
  sendMessage: (threadId, content) => {
    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      threadId,
      senderId: 'user',
      content,
      createdAt: new Date().toISOString()
    };

    set((state) => ({
      ...state,
      messages: [...state.messages, newMessage]
    }));
  },
  clearMessages: () => set({ messages: [] })
}));

