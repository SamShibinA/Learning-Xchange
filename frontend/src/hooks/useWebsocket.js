import { useEffect, useRef } from "react";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:5000"; // if using vite
// For CRA use: process.env.REACT_APP_WS_URL

let socketInstance = null;

// simple singleton to avoid reconnecting multiple times
export function getSocket() {
  if (socketInstance && socketInstance.readyState === WebSocket.OPEN) return socketInstance;
  if (!socketInstance || socketInstance.readyState > 1) {
    socketInstance = new WebSocket(WS_URL);
    socketInstance.onopen = () => console.log("✅ WS connected");
    socketInstance.onclose = () => console.log("🔌 WS closed");
    socketInstance.onerror = (e) => console.error("WS error", e);
  }
  return socketInstance;
}

// React hook that fires handler for incoming messages
export default function useWebsocket(onMessage) {
  const wsRef = useRef(null);

  useEffect(() => {
    wsRef.current = getSocket();

    const handle = (evt) => {
      try {
        const data = JSON.parse(evt.data);
        onMessage?.(data);
      } catch (err) {
        console.error("WS parse error", err);
      }
    };

    wsRef.current.addEventListener("message", handle);
    return () => {
      wsRef.current?.removeEventListener("message", handle);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onMessage]);

  return wsRef.current;
}
