import { useState, createContext, useContext } from "react";

type ChatbotContextType = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const ChatbotContext = createContext<ChatbotContextType>({
  isOpen: false,
  setIsOpen: () => {},
});

export const ChatbotProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <ChatbotContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </ChatbotContext.Provider>
  );
};

export const useChatbot = () => useContext(ChatbotContext);
