

const Message = ({ message, onRetry }) => {
  const { role, text, ts, status } = message;
  const isUser = role === "user";
  const isFailed = status === "failed";
  const time = new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className={`msg-row ${isUser ? "right" : "left"}`}>
      {!isUser && <div className="bubble-avatar" aria-hidden="true">AI</div>}
      <div className={`bubble ${isUser ? "user" : "ai"} ${isFailed ? "failed" : ""}`} title={time}>
        <div className="bubble-text">{text}</div>
        <div className="bubble-meta">{time}</div>

        {/* failed actions */}
        {isFailed && (
          <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
            <button
              onClick={() => onRetry && onRetry(message)}
              style={{
                padding: "6px 10px",
                borderRadius: 6,
                color : "white",
                border: "1px solid #333",
                background: "transparent",
                cursor: "pointer",
              }}
              aria-label="Regenerate response"
            >
              Regenerate
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;

