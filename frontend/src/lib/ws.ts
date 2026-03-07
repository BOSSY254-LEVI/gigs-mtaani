import { getAuthSnapshot } from "../state/authStore";

export function createChatSocket(onMessage: (data: any) => void): WebSocket | null {
  const { accessToken } = getAuthSnapshot();
  if (!accessToken) return null;

  const apiBase = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api/v1";
  const wsUrl = apiBase.replace("http://", "ws://").replace("https://", "wss://").replace("/api/v1", "") + `/api/v1/chat/ws?token=${accessToken}`;

  const socket = new WebSocket(wsUrl);

  socket.onmessage = (event) => {
    try {
      const parsed = JSON.parse(event.data);
      onMessage(parsed);
    } catch {
      // Ignore malformed messages.
    }
  };

  return socket;
}

