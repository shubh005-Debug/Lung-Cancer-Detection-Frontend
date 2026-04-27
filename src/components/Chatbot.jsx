import React, { useState, useRef, useEffect } from "react";

const SUGGESTED_QUESTIONS = [
  "What is adenocarcinoma?",
  "What are early symptoms of lung cancer?",
  "How accurate is this AI model?",
  "What does Grad-CAM heatmap show?",
  "What diet helps during lung cancer treatment?",
  "When should I see a doctor?",
];

const SYSTEM_PROMPT = `You are a helpful, empathetic medical AI assistant specialized in lung cancer education. 
You assist users of the LungAI application — an AI-powered lung cancer detection tool using a VGG16 CNN model trained on CT scan images.

Your role:
- Answer questions about lung cancer types: adenocarcinoma, large cell carcinoma, squamous cell carcinoma, and normal lung tissue
- Explain AI/deep learning concepts used in the app (CNN, VGG16, Grad-CAM, confidence scores)
- Provide general medical education about lung cancer symptoms, treatment, diet, and lifestyle
- Explain what CT scans are and how they are used in diagnosis
- Be empathetic and supportive — users may be anxious about results

Rules:
- Always clarify you are an AI and not a replacement for a doctor
- Never provide a specific diagnosis for the user's personal situation
- Keep responses concise (3-5 sentences max unless asked for detail)
- Use simple, clear language — avoid heavy jargon
- If asked something outside lung cancer / the app, politely redirect`;

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm your LungAI assistant. Ask me anything about lung cancer, CT scans, or how this AI model works. 🫁",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;

    const userMessage = { role: "user", content: userText };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();
      const reply = data?.content?.[0]?.text || "Sorry, I couldn't process that. Please try again.";

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Connection error. Please check your internet and try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      role: "assistant",
      content: "Hi! I'm your LungAI assistant. Ask me anything about lung cancer, CT scans, or how this AI model works. 🫁",
    }]);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        className={`chat-fab ${isOpen ? "chat-fab-open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        title="AI Medical Assistant"
      >
        {isOpen ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
          </svg>
        ) : (
          <>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22">
              <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="chat-fab-label">Ask AI</span>
          </>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar">🫁</div>
              <div>
                <div className="chat-title">LungAI Assistant</div>
                <div className="chat-status">
                  <span className="chat-online-dot" />
                  Powered by Claude AI
                </div>
              </div>
            </div>
            <button className="chat-clear-btn" onClick={clearChat} title="Clear chat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15">
                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.role === "user" ? "chat-msg-user" : "chat-msg-bot"}`}>
                {msg.role === "assistant" && (
                  <div className="chat-bot-avatar">🫁</div>
                )}
                <div className="chat-bubble">
                  {msg.content.split("\n").map((line, j) => (
                    <p key={j} style={{ margin: j > 0 ? "6px 0 0" : 0 }}>{line}</p>
                  ))}
                </div>
              </div>
            ))}

            {loading && (
              <div className="chat-msg chat-msg-bot">
                <div className="chat-bot-avatar">🫁</div>
                <div className="chat-bubble chat-typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length <= 2 && (
            <div className="chat-suggestions">
              <p className="chat-suggestions-label">Suggested questions</p>
              <div className="chat-suggestion-chips">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button key={q} className="chat-chip" onClick={() => sendMessage(q)}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="chat-input-area">
            <textarea
              ref={inputRef}
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about lung cancer, CT scans, AI..."
              rows={1}
              disabled={loading}
            />
            <button
              className="chat-send-btn"
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="18">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>

          <p className="chat-disclaimer">
            AI assistant only — not a substitute for medical advice
          </p>
        </div>
      )}
    </>
  );
}