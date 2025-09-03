

import Message from "./Message";
import TypingBubble from "./TypingBubble";

const ChatHistory = ({ historyRef, endRef, messages, isTyping, onRetry }) => {
  return (
    <main className="chat-history" ref={historyRef}>
      {messages.map((m) => (
        <Message key={m.id} message={m} onRetry={onRetry} />
      ))}
      {isTyping && <TypingBubble />}
      <div ref={endRef} />
    </main>
  );
};

export default ChatHistory;

