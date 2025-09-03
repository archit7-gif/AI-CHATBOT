


import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import ChatHeader from "./components/ChatHeader";
import ChatHistory from "./components/ChatHistory";
import ChatInput from "./components/ChatInput";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RESPONSE_TIMEOUT = 15000; // ms

const App = () => {
  const [socket, setSocket] = useState();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem("chat.history.v1");
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.length > 0
          ? parsed
          : [{ id: Date.now(), role: "ai", text: "Hello! How can I help you today?", ts: new Date().toISOString() }];
      }
    } catch {}
    return [{ id: Date.now(), role: "ai", text: "Hello! How can I help you today?", ts: new Date().toISOString() }];
  });

  const [isTyping, setIsTyping] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const historyRef = useRef(null);
  const endRef = useRef(null);
  const textareaRef = useRef(null);
  const mountedRef = useRef(false);

  const pendingRequestRef = useRef({
    id: null,
    text: null,
    timeoutId: null,
    failedMsgId: null,
  });

  // persist chat history
  useEffect(() => {
    try {
      localStorage.setItem("chat.history.v1", JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // auto scroll
  useEffect(() => {
    if (!endRef.current) return;
    endRef.current.scrollIntoView({
      behavior: mountedRef.current ? "smooth" : "instant",
      block: "end",
    });
    mountedRef.current = true;
  }, [messages, isTyping]);

  // scroll button visibility
  useEffect(() => {
    const el = historyRef.current;
    if (!el) return;
    const onScroll = () => {
      const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
      setShowScrollBtn(!nearBottom);
    };
    el.addEventListener("scroll", onScroll);
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // auto-size textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "0px";
    ta.style.height = Math.min(150, ta.scrollHeight) + "px";
  }, [input]);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  const clearPendingTimeout = () => {
    if (pendingRequestRef.current.timeoutId) {
      clearTimeout(pendingRequestRef.current.timeoutId);
    }
    pendingRequestRef.current.timeoutId = null;
  };

  const handleTimeout = (requestId) => {
    if (pendingRequestRef.current.id !== requestId) return;
    const failedId = `failed-${requestId}`;
    const failedMsg = {
      id: failedId,
      role: "ai",
      text: "Failed to generate response. Tap to regenerate.",
      ts: new Date().toISOString(),
      status: "failed",
      userText: pendingRequestRef.current.text,
      requestId,
    };
    setMessages((prev) => [...prev, failedMsg]);
    pendingRequestRef.current.failedMsgId = failedId;
    pendingRequestRef.current.timeoutId = null;
    setIsTyping(false);
  };

  const startRequest = (text, { addUser = true } = {}) => {
    if (!socket) {
      const failedId = `failed-no-socket-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: failedId,
          role: "ai",
          text: "Failed to generate response (no connection). Tap to regenerate.",
          ts: new Date().toISOString(),
          status: "failed",
          userText: text,
        },
      ]);
      return;
    }

    clearPendingTimeout();

    const requestId = Date.now();

    if (addUser) {
      const userMsg = { id: `${requestId}-user`, role: "user", text, ts: new Date().toISOString() };
      setMessages((prev) => [...prev, userMsg]);
    }

    setIsTyping(true);

    const timeoutId = setTimeout(() => handleTimeout(requestId), RESPONSE_TIMEOUT);
    pendingRequestRef.current = { id: requestId, text, timeoutId, failedMsgId: null };

    socket.emit("ai-message", text);
  };

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    startRequest(text, { addUser: true });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ✅ replaced window.confirm with toast confirm
const resetChat = () => {
  toast(
    ({ closeToast }) => (
      <div
        style={{
          background: "#1e1e1e",
          color: "#f0f0f0",
          padding: "16px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          width: "300px",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <p style={{ margin: 0, fontSize: "15px", fontWeight: 500 }}>
          Do you want to clear the chat?
        </p>
        <div
          style={{
            marginTop: "12px",
            display: "flex",
            justifyContent: "flex-end",
            gap: "8px",
          }}
        >
          <button
            onClick={() => {
              setMessages([
                {
                  id: Date.now(),
                  role: "ai",
                  text: "Hello! How can I help you today?",
                  ts: new Date().toISOString(),
                },
              ]);
              localStorage.removeItem("chat.history.v1");
              socket?.emit("reset-chat");
              closeToast();
            }}
            style={{
              background: "#22c55e",
              color: "white",
              border: "none",
              padding: "6px 14px",
              borderRadius: "8px",
              fontSize: "14px",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Yes
          </button>
          <button
            onClick={closeToast}
            style={{
              background: "#374151",
              color: "white",
              border: "none",
              padding: "6px 14px",
              borderRadius: "8px",
              fontSize: "14px",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    ),
    {
      autoClose: false,
      closeOnClick: false,   // ❌ disable click-to-close
      closeButton: false,    // ❌ remove "x" icon
      draggable: false,      // ❌ disable swipe/drag to dismiss
      style: { background: "transparent", boxShadow: "none" },
    }
  );
};



  const handleRegenerate = (failedMsg) => {
    const userText = failedMsg.userText || pendingRequestRef.current?.text || "";
    setMessages((prev) => prev.filter((m) => m.id !== failedMsg.id));
    startRequest(userText, { addUser: false });
  };

  useEffect(() => {
    const socketInstance = io("http://localhost:3000", { withCredentials: true });
    setSocket(socketInstance);

    socketInstance.on("ai-ke-message-ka-response", (response) => {
      clearPendingTimeout();
      const botMessage = { id: Date.now() + 1, role: "ai", text: response, ts: new Date().toISOString() };
      setMessages((prev) => {
        const failedId = pendingRequestRef.current.failedMsgId;
        if (failedId) {
          return prev.map((m) => (m.id === failedId ? botMessage : m));
        }
        return [...prev, botMessage];
      });
      setIsTyping(false);
      pendingRequestRef.current = { id: null, text: null, timeoutId: null, failedMsgId: null };
    });

    socketInstance.on("ai-error", (err) => {
      clearPendingTimeout();
      const requestId = pendingRequestRef.current.id || Date.now();
      const failedId = `failed-${requestId}`;
      const failedMsg = {
        id: failedId,
        role: "ai",
        text: "Failed to generate response. Tap to regenerate.",
        ts: new Date().toISOString(),
        status: "failed",
        userText: pendingRequestRef.current.text,
        requestId,
      };
      setMessages((prev) => [...prev, failedMsg]);
      pendingRequestRef.current.failedMsgId = failedId;
      setIsTyping(false);
      pendingRequestRef.current.timeoutId = null;
    });

    const handleUnload = () => {
      clearPendingTimeout();
      let navType = "unknown";
      try {
        if (performance && typeof performance.getEntriesByType === "function") {
          const entries = performance.getEntriesByType("navigation");
          if (entries && entries.length > 0 && entries[0].type) {
            navType = entries[0].type;
          }
        } else if (performance?.navigation?.type === 1) {
          navType = "reload";
        }
      } catch {}
      if (navType !== "reload") {
        try {
          socketInstance.emit("reset-chat");
        } catch {}
        try {
          localStorage.removeItem("chat.history.v1");
        } catch {}
      }
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => {
      handleUnload();
      window.removeEventListener("beforeunload", handleUnload);
      clearPendingTimeout();
      socketInstance.disconnect();
    };
  }, []);

  return (
    <div className="chat-root">
      <div className="chat-card" aria-live="polite">
        <ChatHeader onResetChat={resetChat} />
        <ChatHistory
          historyRef={historyRef}
          endRef={endRef}
          messages={messages}
          isTyping={isTyping}
          onRetry={handleRegenerate}
        />
        <ChatInput
          textareaRef={textareaRef}
          input={input}
          setInput={setInput}
          sendMessage={sendMessage}
          handleKeyDown={handleKeyDown}
          showScrollBtn={showScrollBtn}
          scrollToBottom={scrollToBottom}
        />
      </div>
      {/* Toast container for confirm dialogs */}
      <ToastContainer position="top-center" />
    </div>
  );
};

export default App;


