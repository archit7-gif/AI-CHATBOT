

const TypingBubble = () => {
  return (
    <div className="msg-row left">
      <div className="bubble-avatar" aria-hidden="true">AI</div>
      <div className="bubble ai typing">
        <span className="dotty"></span>
        <span className="dotty"></span>
        <span className="dotty"></span>
      </div>
    </div>
  );
};

export default TypingBubble;
