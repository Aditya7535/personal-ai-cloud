import { useState, useEffect, useRef } from "react";

export default function PersonalAICloud() {
  // STATE MANAGEMENT
  const [messages, setMessages] = useState([
    {
      role: "ai",
      content: "Hello! I'm your Personal AI Cloud assistant. Upload some PDFs and ask me anything about them.",
      sources: []
    },
    {
      role: "user",
      content: "What can you help me with?",
      sources: []
    },
    {
      role: "ai",
      content: "I can help you search through and understand your uploaded documents. Just ask me questions and I'll find the relevant information!",
      sources: []
    }
  ]);

  const [files, setFiles] = useState([
    { id: 1, name: "document1.pdf" },
    { id: 2, name: "research.pdf" },
    { id: 3, name: "notes.pdf" }
  ]);

  const [inputValue, setInputValue] = useState("");
  const [selectedFiles, setSelectedFiles] = useState("All PDFs");
  const messagesEndRef = useRef(null);

  // SCROLL TO BOTTOM
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // HANDLE SEND MESSAGE
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // ADD USER MESSAGE
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: inputValue,
        sources: []
      }
    ]);

    // SIMULATE AI RESPONSE
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: `I found information about "${inputValue}" in your documents. This is a simulated response. In the actual app, I'll search through your PDFs and provide relevant information.`,
          sources: ["document1.pdf", "research.pdf"]
        }
      ]);
    }, 1000);

    // CLEAR INPUT
    setInputValue("");
  };

  // DELETE FILE
  const handleDeleteFile = (id) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  // HANDLE NEW CHAT
  const handleNewChat = () => {
    setMessages([
      {
        role: "ai",
        content: "Started a new chat. How can I help?",
        sources: []
      }
    ]);
  };

  const containerStyle = {
    display: "flex",
    height: "100vh",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    backgroundColor: "#1a2332"
  };

  const sidebarStyle = {
    width: "200px",
    backgroundColor: "#1a2332",
    color: "#ffffff",
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid #2a3a4a",
    overflowY: "auto"
  };

  const newChatButtonStyle = {
    margin: "16px 12px",
    padding: "10px 16px",
    backgroundColor: "transparent",
    color: "#ffffff",
    border: "1px solid #2a3a4a",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    transition: "background-color 0.2s ease"
  };

  const logoutButtonStyle = {
    margin: "12px",
    padding: "10px 16px",
    backgroundColor: "#ff3333",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    transition: "background-color 0.2s ease"
  };

  const activeChatButtonStyle = {
    margin: "12px",
    padding: "12px 16px",
    backgroundColor: "#0066ff",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "background-color 0.2s ease"
  };

  const closeButtonStyle = {
    backgroundColor: "transparent",
    border: "none",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "18px",
    padding: "0 4px",
    transition: "color 0.2s ease"
  };

  const knowledgeBaseSectionStyle = {
    padding: "16px 12px",
    flex: 1
  };

  const sectionTitleStyle = {
    fontSize: "13px",
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: "12px",
    letterSpacing: "0.5px"
  };

  const fileCardStyle = {
    backgroundColor: "#2a3a4a",
    border: "1px solid #3a4a5a",
    borderRadius: "6px",
    padding: "10px",
    marginBottom: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    transition: "all 0.2s ease"
  };

  const fileNameStyle = {
    fontSize: "12px",
    color: "#e0e0e0",
    flex: 1,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  };

  const deleteButtonStyle = {
    backgroundColor: "transparent",
    border: "none",
    color: "#ff6666",
    cursor: "pointer",
    fontSize: "14px",
    padding: "4px 8px",
    transition: "color 0.2s ease"
  };

  const mainAreaStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#1a2332"
  };

  const headerStyle = {
    backgroundColor: "transparent",
    padding: "24px 32px",
    borderBottom: "1px solid #2a3a4a",
    textAlign: "center"
  };

  const titleStyle = {
    fontSize: "32px",
    fontWeight: "700",
    color: "#ffffff",
    margin: 0
  };

  const messagesContainerStyle = {
    flex: 1,
    overflowY: "auto",
    padding: "24px 32px",
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  };

  const messageStyle = (role) => ({
    display: "flex",
    justifyContent: role === "user" ? "flex-end" : "flex-start",
    gap: "12px"
  });

  const avatarStyle = {
    width: "32px",
    height: "32px",
    backgroundColor: "#000000",
    color: "#0066ff",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "700",
    flexShrink: 0
  };

  const messageContentStyle = (role) => ({
    backgroundColor: role === "user" ? "#0066ff" : "#2a3a4a",
    color: role === "user" ? "#ffffff" : "#e0e0e0",
    padding: "12px 16px",
    borderRadius: "8px",
    maxWidth: "60%",
    wordWrap: "break-word",
    border: role === "user" ? "none" : "1px solid #3a4a5a",
    boxShadow: role === "user" ? "0 2px 8px rgba(0, 102, 255, 0.15)" : "none",
    lineHeight: "1.5"
  });

  const sourcesStyle = {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginTop: "8px"
  };

  const sourceTagStyle = {
    backgroundColor: "#3a4a5a",
    color: "#b0b0b0",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "11px"
  };

  const inputSectionStyle = {
    backgroundColor: "#1a2332",
    borderTop: "1px solid #2a3a4a",
    padding: "20px 32px",
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  };

  const activeLabelStyle = {
    fontSize: "13px",
    fontWeight: "600",
    color: "#b0b0b0",
    marginBottom: "8px"
  };

  const fileSelectorsStyle = {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    flexWrap: "wrap"
  };

  const fileButtonStyle = (active) => ({
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
    transition: "all 0.2s ease",
    backgroundColor: active ? "#0066ff" : "#3a4a5a",
    color: "#ffffff"
  });

  const noFileChosenStyle = {
    fontSize: "12px",
    color: "#999999"
  };

  const inputGroupStyle = {
    display: "flex",
    gap: "12px",
    alignItems: "flex-end"
  };

  const inputStyle = {
    flex: 1,
    padding: "12px 16px",
    border: "1px solid #3a4a5a",
    borderRadius: "6px",
    fontSize: "13px",
    fontFamily: "inherit",
    outline: "none",
    backgroundColor: "#2a3a4a",
    color: "#e0e0e0",
    transition: "border-color 0.2s ease"
  };

  const askButtonStyle = {
    padding: "10px 28px",
    backgroundColor: "#0066ff",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    transition: "background-color 0.2s ease"
  };

  return (
    <div style={containerStyle}>
      {/* SIDEBAR */}
      <div style={sidebarStyle}>
        {/* NEW CHAT BUTTON */}
        <button
          style={newChatButtonStyle}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#2a3a4a")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
          onClick={handleNewChat}
        >
          + New Chat
        </button>

        {/* LOGOUT BUTTON */}
        <button
          style={logoutButtonStyle}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#e63333")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#ff3333")}
        >
          Logout
        </button>

        {/* ACTIVE CHAT */}
        <div style={{ margin: "12px", display: "flex" }}>
          <button
            style={activeChatButtonStyle}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#0052cc")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#0066ff")}
          >
            <span>New Chat</span>
            <button
              style={closeButtonStyle}
              onMouseEnter={(e) => (e.target.style.color = "#ff9999")}
              onMouseLeave={(e) => (e.target.style.color = "#ffffff")}
              onClick={(e) => e.stopPropagation()}
            >
              ×
            </button>
          </button>
        </div>

        {/* KNOWLEDGE BASE SECTION */}
        <div style={knowledgeBaseSectionStyle}>
          <div style={sectionTitleStyle}>Knowledge Base</div>

          {files.length > 0 ? (
            files.map((file) => (
              <div
                key={file.id}
                style={fileCardStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#3a4a5a";
                  e.currentTarget.style.borderColor = "#0066ff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#2a3a4a";
                  e.currentTarget.style.borderColor = "#3a4a5a";
                }}
              >
                <span style={{ fontSize: "13px", marginRight: "8px" }}>📄</span>
                <span style={fileNameStyle}>{file.name}</span>
                <button
                  style={deleteButtonStyle}
                  onMouseEnter={(e) => (e.target.style.color = "#ff8888")}
                  onMouseLeave={(e) => (e.target.style.color = "#ff6666")}
                  onClick={() => handleDeleteFile(file.id)}
                >
                  ×
                </button>
              </div>
            ))
          ) : (
            <p style={{ color: "#666666", fontSize: "12px" }}>
              No files uploaded yet
            </p>
          )}
        </div>
      </div>

      {/* MAIN AREA */}
      <div style={mainAreaStyle}>
        {/* HEADER */}
        <div style={headerStyle}>
          <h1 style={titleStyle}>Personal AI Cloud</h1>
        </div>

        {/* MESSAGES */}
        <div style={messagesContainerStyle}>
          {messages.map((msg, index) => (
            <div key={index} style={messageStyle(msg.role)}>
              {msg.role === "ai" && <div style={avatarStyle}>AI</div>}

              <div>
                <div style={messageContentStyle(msg.role)}>
                  {msg.content}
                </div>

                {msg.sources && msg.sources.length > 0 && (
                  <div style={sourcesStyle}>
                    {msg.sources.map((source, i) => (
                      <div key={i} style={sourceTagStyle}>
                        {source}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT SECTION */}
        <div style={inputSectionStyle}>
          {/* ACTIVE KNOWLEDGE BASE LABEL */}
          <div style={activeLabelStyle}>Active Knowledge Base:</div>

          {/* FILE SELECTORS */}
          <div style={fileSelectorsStyle}>
            <button
              style={fileButtonStyle(selectedFiles === "All PDFs")}
              onMouseEnter={(e) => {
                if (selectedFiles !== "All PDFs") {
                  e.target.style.backgroundColor = "#4a5a6a";
                }
              }}
              onMouseLeave={(e) => {
                if (selectedFiles !== "All PDFs") {
                  e.target.style.backgroundColor = "#3a4a5a";
                }
              }}
              onClick={() => setSelectedFiles("All PDFs")}
            >
              All PDFs
            </button>

            <button
              style={fileButtonStyle(selectedFiles === "Choose Files")}
              onMouseEnter={(e) => {
                if (selectedFiles !== "Choose Files") {
                  e.target.style.backgroundColor = "#4a5a6a";
                }
              }}
              onMouseLeave={(e) => {
                if (selectedFiles !== "Choose Files") {
                  e.target.style.backgroundColor = "#3a4a5a";
                }
              }}
              onClick={() => setSelectedFiles("Choose Files")}
            >
              Choose Files
            </button>

            <span style={noFileChosenStyle}>No file chosen</span>
          </div>

          {/* INPUT GROUP */}
          <div style={inputGroupStyle}>
            <input
              style={inputStyle}
              type="text"
              placeholder="Ask anything..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#0066ff";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#3a4a5a";
              }}
            />

            <button
              style={askButtonStyle}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#0052cc")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#0066ff")}
              onClick={handleSendMessage}
            >
              Ask AI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
