import { createContext, useContext, useState } from "react";

// Create the context
const ChatContext = createContext();

// Provider component
export const ChatProvider = ({ children }) => {
  const [roomId, setRoomId] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [connected, setConnected] = useState(false);

  return (
    <ChatContext.Provider
      value={{ roomId, currentUser, connected, setRoomId, setCurrentUser, setConnected }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook to use the context
const useChatContext = () => useContext(ChatContext);

export default useChatContext;
