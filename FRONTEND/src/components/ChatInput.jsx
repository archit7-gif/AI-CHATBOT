

const ChatInput = ({ textareaRef, input, setInput, sendMessage, handleKeyDown, showScrollBtn, scrollToBottom }) => {
  return (
    <footer className="chat-inputbar">
      <div className="input-wrap">
        <textarea
          ref={textareaRef}
          className="input"
          placeholder="Write your message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          spellCheck={true}
        />
        <button
          className="send-btn"
          onClick={sendMessage}
          disabled={!input.trim()}
          title={input.trim() ? "Send (Enter)" : "Type something to send"}
          aria-label="Send message"
        >
          ➤
        </button>
      </div>
      {showScrollBtn && (
        <button className="scroll-bottom" onClick={scrollToBottom} aria-label="Scroll to latest" title="Scroll to latest">
          ↓
        </button>
      )}
    </footer>
  );
};

export default ChatInput;
