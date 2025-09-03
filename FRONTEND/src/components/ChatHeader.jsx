import { useState, useRef, useEffect } from "react";

const ChatHeader = ({ onResetChat }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="chat-header" style={{ position: "relative", zIndex: 50 }}>
      <div className="chat-title">
        <div className="ai-avatar" aria-hidden="true">AI</div>
        <div>
          <div className="title">AI Chat</div>
          <div className="subtitle"><span className="online-dot" /> Online</div>
        </div>
      </div>

      {/* Three dots */}
      <div
      style={{
        height : "25px",
        width : "40px"
      }}
        className="header-actions"
        aria-hidden="true"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>

      {/* Dropdown menu */}
      {menuOpen && (
        <div
          ref={menuRef}
          style={{
            position: "absolute",
            right: 65,
            top: 0,
            marginTop: "8px",
            background: "#1a1f26",
            border: "1px solid #262c35",
            borderRadius: 8,
            padding: "8px 0",
            zIndex: 9999, // ⬅️ stays above everything
          }}
        >
<button
  onClick={() => {
    onResetChat();
    setMenuOpen(false);   // ✅ close menu after click
  }}
  style={{
    display: "block",
    padding: "8px 16px",
    background: "transparent",
    color: "#e5e7eb",
    border: "none",
    width: "100%",
    textAlign: "left",
    cursor: "pointer",
  }}
>
  🗑 Delete Chat
</button>
<button
  onClick={() => {
    onResetChat();
    setMenuOpen(false);   // ✅ close menu after click
  }}
  style={{
    display: "block",
    padding: "8px 16px",
    background: "transparent",
    color: "#e5e7eb",
    border: "none",
    width: "100%",
    textAlign: "left",
    cursor: "pointer",
  }}
>
  ✨ New Chat
</button>

        </div>
      )}
    </header>
  );
};

export default ChatHeader;



