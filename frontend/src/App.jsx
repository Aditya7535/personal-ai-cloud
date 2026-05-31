import { useState, useEffect } from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import { API_BASE_URL } from "./config";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function App() {

  // USER CONTEXT
  const [currentUser, setCurrentUser] =
    useState(
      localStorage.getItem("username")
    );

  const chatStorageKey =
    `ai_chats_${currentUser}`;

  const activeChatKey =
    `current_chat_id_${currentUser}`;

  // LOAD SAVED CHATS
  const [chats, setChats] = useState(() => {

    const savedChats =
      localStorage.getItem(
        chatStorageKey
      );

    return savedChats
      ? JSON.parse(savedChats)
      : [
          {
            id: 1,
            title: "New Chat",
            messages: []
          }
        ];
  });

  // LOAD ACTIVE CHAT
  const [currentChatId, setCurrentChatId] =
    useState(() => {

      const savedId =
        localStorage.getItem(
          activeChatKey
        );

      return savedId
        ? Number(savedId)
        : 1;
    });

  // INPUT
  const [prompt, setPrompt] = useState("");

  // AUTH
  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [isLoggedIn, setIsLoggedIn] =
    useState(

      localStorage.getItem("token")
        ? true
        : false
    );

  const [isSignup, setIsSignup] =
    useState(false);

  // PDF UPLOAD MESSAGE
  const [uploadMessage, setUploadMessage] =
    useState("");

  // DOCUMENTS
  const [documents, setDocuments] =
    useState([]);

  // SELECTED DOCUMENT
  const [
    selectedDocument,
    setSelectedDocument
  ] = useState(null);

  // PDF VIEWER
  const [selectedPdf, setSelectedPdf] =
    useState(null);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [numPages, setNumPages] =
    useState(null);

  // CHATS LOADED STATE
  const [chatsLoaded, setChatsLoaded] =
    useState(false);

  // GENERATING STATE
  const [isGenerating, setIsGenerating] =
    useState(false);

  // FIND CURRENT CHAT
  const currentChat = chats.find(
    (chat) => chat.id === currentChatId
  );

  // SAVE CHATS
  useEffect(() => {

    if (!chatsLoaded) return;

    localStorage.setItem(
      chatStorageKey,
      JSON.stringify(chats)
    );

    saveChatsToBackend(chats);

  }, [chats, chatsLoaded]);

  // SAVE ACTIVE CHAT
  useEffect(() => {

    localStorage.setItem(
      activeChatKey,
      currentChatId
    );

  }, [currentChatId]);

  // LOAD DOCUMENTS ON START
  useEffect(() => {

    fetchDocuments();

  }, []);

  // LOAD CHATS ON LOGIN
  useEffect(() => {

    if (isLoggedIn) {

      loadChats();
    }

  }, [isLoggedIn]);

  // RESET CHATS WHEN USER CHANGES
  useEffect(() => {

    setDocuments([]);

    setSelectedDocument(null);

    const savedChats =
      localStorage.getItem(
        chatStorageKey
      );

    if (savedChats) {

      setChats(
        JSON.parse(savedChats)
      );

    } else {

      setChats([
        {
          id: 1,
          title: "New Chat",
          messages: []
        }
      ]);
    }

    const savedActiveChat =
      localStorage.getItem(
        activeChatKey
      );

    if (savedActiveChat) {

      setCurrentChatId(
        Number(savedActiveChat)
      );

    } else {

      setCurrentChatId(1);
    }

  }, [currentUser]);

  // CREATE NEW CHAT
  const createNewChat = () => {

    const newChat = {
      id: Date.now(),
      title: "New Chat",
      messages: []
    };

    setChats((prev) => [
      ...prev,
      newChat
    ]);

    setCurrentChatId(newChat.id);
  };

  // DELETE CHAT
  const deleteChat = (chatId) => {

    const updatedChats = chats.filter(
      (chat) => chat.id !== chatId
    );

    setChats(updatedChats);

    // IF CURRENT CHAT DELETED
    if (currentChatId === chatId) {

      if (updatedChats.length > 0) {

        setCurrentChatId(
          updatedChats[0].id
        );

      } else {

        const newChat = {
          id: Date.now(),
          title: "New Chat",
          messages: []
        };

        setChats([newChat]);

        setCurrentChatId(newChat.id);
      }
    }
  };

  // HANDLE AUTH
  const handleAuth = async () => {

    // VALIDATE INPUT
    if (!username.trim() || !password.trim()) {
      alert("Please enter username and password");
      return;
    }

    try {

      const endpoint = isSignup
        ? "signup"
        : "login";

      console.log(`Attempting to ${endpoint} at: ${API_BASE_URL}/${endpoint}`);

      const response = await fetch(
        `${API_BASE_URL}/${endpoint}`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            username,

            password
          })
        }
      );

      const data = await response.json();

      console.log("Auth response:", data);

      // CHECK FOR ERROR STATUS
      if (!response.ok) {
        throw new Error(data.detail || `HTTP error! status: ${response.status}`);
      }

      // LOGIN SUCCESS
      if (data.access_token) {

        localStorage.setItem(
          "token",
          data.access_token
        );

        localStorage.setItem(
          "username",
          username
        );

        setCurrentUser(username);

        setIsLoggedIn(true);

        setUsername("");

        setPassword("");

        loadChats();

        fetchDocuments();

      } else {

        alert(data.message || "Authentication failed");
      }

    } catch (error) {

      console.error("Auth error:", error);

      alert(`Error: ${error.message}`);

    }
  };

  // FETCH DOCUMENTS
  const fetchDocuments = async () => {

    try {

      const response = await fetch(
        `${API_BASE_URL}/documents`,
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      const data = await response.json();

      setDocuments(data.documents);

    } catch (error) {

      console.log(error);

    }
  };

  // VIEW DOCUMENT
  const viewDocument = (filename) => {

    const url =
      `${API_BASE_URL}/uploads/${filename}`;

    window.open(url, "_blank");
  };

  // DELETE DOCUMENT
  const deleteDoc = async (filename) => {

    try {

      await fetch(
        `${API_BASE_URL}/documents/${filename}`,
        {
          method: "DELETE"
        }
      );

      setDocuments((prev) =>
        prev.filter((doc) => doc !== filename)
      );

    } catch (error) {

      console.log(error);

    }
  };

  // HANDLE PDF LOAD SUCCESS
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setCurrentPage(1);
  };

  // LOGOUT
  const logout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem(
      "username"
    );

    setCurrentUser(null);

    setIsLoggedIn(false);

    setChats([
      {
        id: 1,
        title: "New Chat",
        messages: []
      }
    ]);

    setDocuments([]);

    setSelectedDocument(null);
  };

  // MULTIPLE PDF UPLOAD
  const uploadPDF = async (event) => {

    const files = event.target.files;

    if (!files.length) return;

    try {

      setUploadMessage(
        "Uploading PDFs..."
      );

      // LOOP THROUGH FILES
      for (const file of files) {

        const formData = new FormData();

        formData.append("file", file);

        await fetch(
          `${API_BASE_URL}/upload`,
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: formData
          }
        );
      }

      setUploadMessage(
        "All PDFs uploaded successfully"
      );

      fetchDocuments();

    } catch (error) {

      console.log(error);

      setUploadMessage(
        "Upload failed"
      );
    }
  };

  // LOAD CHATS
  const loadChats = async () => {

    try {

      const response = await fetch(
        `${API_BASE_URL}/load-chats`,
        {

          headers: {

            Authorization:
              `Bearer ${localStorage.getItem(
                "token"
              )}`
          }
        }
      );

      const data = await response.json();

      // IF NO CHATS
      if (data.chats.length === 0) {

        setChatsLoaded(true);

        setChats([
          {
            id: 1,
            title: "New Chat",
            messages: []
          }
        ]);

        setCurrentChatId(1);

        return;
      }

      setChats(data.chats);

      setCurrentChatId(
        data.chats[0].id
      );

      setChatsLoaded(true);

    } catch (error) {

      console.log(error);

    }
  };

  // SAVE CHATS TO BACKEND
  const saveChatsToBackend =
    async (updatedChats) => {

    if (!updatedChats.length) return;

    try {

      for (const chat of updatedChats) {

        await fetch(
          `${API_BASE_URL}/save-chat`,
          {

            method: "POST",

            headers: {

              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${localStorage.getItem(
                  "token"
                )}`
            },

            body: JSON.stringify(chat)
          }
        );
      }

    } catch (error) {

      console.log(error);

    }
  };

  // SEND PROMPT
  const sendPrompt = async () => {

    if (!prompt.trim()) return;

    setIsGenerating(true);

    const currentPrompt = prompt;

    // USER MESSAGE
    const userMessage = {
      role: "user",
      content: currentPrompt
    };

    // EMPTY AI MESSAGE
    const aiMessage = {
      role: "ai",
      content: ""
    };

    // UPDATE CHAT
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === currentChatId
          ? {
              ...chat,

              title:
                chat.messages.length === 0
                  ? currentPrompt.slice(0, 20)
                  : chat.title,

              messages: [
                ...chat.messages,
                userMessage,
                aiMessage
              ]
            }
          : chat
      )
    );

    // CLEAR INPUT
    setPrompt("");

    try {

      // STREAMING REQUEST
      const response = await fetch(
        `${API_BASE_URL}/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({

            prompt: currentPrompt,

            selected_document:
              selectedDocument
          })
        }
      );

      const reader = response.body.getReader();

      const decoder = new TextDecoder();

      let fullText = "";

      while (true) {

        const { done, value } =
          await reader.read();

        if (done) break;

        const chunk = decoder.decode(value);

        fullText += chunk;

        // UPDATE STREAM
        setChats((prev) =>
          prev.map((chat) => {

            if (chat.id !== currentChatId)
              return chat;

            const updatedMessages = [
              ...chat.messages
            ];

            updatedMessages[
              updatedMessages.length - 1
            ] = {
              role: "ai",
              content: fullText
            };

            return {
              ...chat,
              messages: updatedMessages
            };
          })
        );
      }

      setIsGenerating(false);

    } catch (error) {

      console.log(error);

      setIsGenerating(false);

    }
  };

  // LOGIN SCREEN
  if (!isLoggedIn) {

    return (

      <div style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0a1628",
        color: "white",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      }}>

        <div style={{
          width: "380px",
          backgroundColor: "#1a2f4a",
          padding: "40px 36px",
          borderRadius: "16px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)"
        }}>

          <h1 style={{
            textAlign: "center",
            marginBottom: "8px",
            fontSize: "32px",
            fontWeight: "700",
            margin: "0 0 8px 0"
          }}>
            Personal AI
          </h1>
          <h1 style={{
            textAlign: "center",
            marginBottom: "20px",
            fontSize: "32px",
            fontWeight: "700",
            margin: "0 0 20px 0"
          }}>
            Cloud
          </h1>

          <h2 style={{
            textAlign: "center",
            marginBottom: "24px",
            fontSize: "16px",
            fontWeight: "600",
            color: "#e0e0e0",
            margin: "0 0 24px 0"
          }}>
            {
              isSignup
                ? "Signup"
                : "Login"
            }
          </h2>

          <input
            type="text"
            placeholder="Username"

            value={username}

            onChange={(e) =>
              setUsername(e.target.value)
            }

            style={{
              width: "100%",
              padding: "12px 16px",
              marginBottom: "16px",
              borderRadius: "8px",
              border: "1px solid #3a4a5a",
              backgroundColor: "#2a3a4a",
              color: "#e0e0e0",
              fontSize: "14px",
              fontFamily: "inherit",
              outline: "none",
              transition: "border-color 0.2s ease",
              boxSizing: "border-box"
            }}
            onFocus={(e) => (e.target.style.borderColor = "#0066ff")}
            onBlur={(e) => (e.target.style.borderColor = "#3a4a5a")}
          />

          <input
            type="password"
            placeholder="Password"

            value={password}

            onChange={(e) =>
              setPassword(e.target.value)
            }

            style={{
              width: "100%",
              padding: "12px 16px",
              marginBottom: "24px",
              borderRadius: "8px",
              border: "1px solid #3a4a5a",
              backgroundColor: "#2a3a4a",
              color: "#e0e0e0",
              fontSize: "14px",
              fontFamily: "inherit",
              outline: "none",
              transition: "border-color 0.2s ease",
              boxSizing: "border-box"
            }}
            onFocus={(e) => (e.target.style.borderColor = "#0066ff")}
            onBlur={(e) => (e.target.style.borderColor = "#3a4a5a")}
          />

          <button
            onClick={handleAuth}

            style={{
              width: "100%",
              padding: "12px 16px",
              marginBottom: "16px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#0066ff",
              color: "white",
              fontWeight: "600",
              fontSize: "14px",
              cursor: "pointer",
              transition: "background-color 0.2s ease"
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#0052cc")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#0066ff")}
          >
            {
              isSignup
                ? "Signup"
                : "Login"
            }
          </button>

          <p
            onClick={() =>
              setIsSignup(!isSignup)
            }

            style={{
              marginTop: "0",
              textAlign: "center",
              cursor: "pointer",
              color: "#ffffff",
              fontSize: "14px",
              transition: "color 0.2s ease"
            }}
            onMouseEnter={(e) => (e.style.color = "#b0b0b0")}
            onMouseLeave={(e) => (e.style.color = "#ffffff")}
          >

            {
              isSignup
                ? "Already have an account? Login"
                : "No account? Signup"
            }

          </p>

        </div>

      </div>
    );
  }

  return (

    <div style={{
      display: "flex",
      height: "100vh",
      backgroundColor: "#1a2332",
      color: "white",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>

      {/* SIDEBAR */}

      <div style={{
        width: "200px",
        backgroundColor: "#1a2332",
        padding: "0",
        borderRight: "1px solid #2a3a4a",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column"
      }}>

        {/* NEW CHAT */}

        <button
          onClick={createNewChat}
          style={{
            margin: "16px 12px",
            padding: "10px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            border: "1px solid #2a3a4a",
            backgroundColor: "transparent",
            color: "white",
            fontWeight: "600",
            fontSize: "13px",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#2a3a4a")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
        >
          + New Chat
        </button>

        {/* LOGOUT */}
        <button
          onClick={logout}

          style={{
            margin: "12px",
            padding: "10px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            border: "none",
            backgroundColor: "#ff3333",
            color: "white",
            fontWeight: "600",
            fontSize: "13px",
            transition: "background-color 0.2s ease"
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#e63333")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#ff3333")}
        >
          Logout
        </button>

        {/* CHAT LIST */}

        <div style={{ padding: "0 12px", flex: 1, overflowY: "auto" }}>
          {chats.map((chat) => (

          <div
            key={chat.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent:
                "space-between",

              padding: "12px",
              marginBottom: "8px",
              borderRadius: "8px",
              fontSize: "13px",
              backgroundColor:
                currentChatId === chat.id
                  ? "#0066ff"
                  : "transparent",
              border: currentChatId === chat.id ? "none" : "none",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              if (currentChatId !== chat.id) {
                e.currentTarget.style.backgroundColor = "#2a3a4a";
              }
            }}
            onMouseLeave={(e) => {
              if (currentChatId !== chat.id) {
                e.currentTarget.style.backgroundColor = "transparent";
              }
            }}
          >

            <div
              onClick={() =>
                setCurrentChatId(chat.id)
              }
              style={{
                cursor: "pointer",
                flex: 1
              }}
            >
              {chat.title}
            </div>

            {/* DELETE BUTTON */}

            <button
              onClick={() =>
                deleteChat(chat.id)
              }
              style={{
                marginLeft: "10px",
                background: "transparent",
                border: "none",
                color: "#ffffff",
                cursor: "pointer",
                fontSize: "14px",
                padding: "4px 8px",
                transition: "color 0.2s ease"
              }}
              onMouseEnter={(e) => (e.target.style.color = "#ff6666")}
              onMouseLeave={(e) => (e.target.style.color = "#ffffff")}
            >
              ✕
            </button>

          </div>
        ))}
        </div>
        <hr style={{
          margin: "12px 0",
          borderColor: "#2a3a4a",
          border: "none",
          borderTop: "1px solid #2a3a4a"
        }} />

        <h3 style={{
          marginBottom: "12px",
          padding: "0 12px",
          fontSize: "12px",
          fontWeight: "700",
          color: "#ffffff",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          margin: "12px 12px 12px 12px"
        }}>
          Knowledge Base
        </h3>

        <div style={{ padding: "0 12px", flex: 1, overflowY: "auto" }}>

          {documents.map((doc, index) => (

            <div
              key={index}
              style={{
                backgroundColor: "#2a3a4a",
                border: "1px solid #3a4a5a",
                padding: "10px",
                borderRadius: "6px",
                marginBottom: "8px",
                fontSize: "12px",
                overflowWrap: "break-word",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#3a4a5a";
                e.currentTarget.style.borderColor = "#0066ff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#2a3a4a";
                e.currentTarget.style.borderColor = "#3a4a5a";
              }}
            >
              <span
                onClick={() =>
                  setSelectedDocument(doc)
                }
                style={{
                  cursor: "pointer",
                  flex: 1,
                  color:
                    selectedDocument === doc
                      ? "#0066ff"
                      : "#e0e0e0"
                }}
              >
                📄 {doc}
              </span>
              <button
                onClick={() => deleteDoc(doc)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#ff6666",
                  cursor: "pointer",
                  fontSize: "14px",
                  padding: "4px 8px",
                  transition: "color 0.2s ease"
                }}
                onMouseEnter={(e) => (e.target.style.color = "#ff8888")}
                onMouseLeave={(e) => (e.target.style.color = "#ff6666")}
              >
                ✕
              </button>
            </div>
          ))}

        </div>
      </div>

      {/* PDF VIEWER MODAL */}
      {selectedPdf && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "20px"
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            maxWidth: "800px",
            marginBottom: "20px",
            color: "white"
          }}>
            <h2>{selectedPdf}</h2>
            <button
              onClick={() => {
                setSelectedPdf(null);
                setCurrentPage(1);
                setNumPages(null);
              }}
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                fontSize: "24px",
                cursor: "pointer"
              }}
            >
              ✕
            </button>
          </div>

          <div style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
            maxHeight: "70vh",
            overflowY: "auto",
            maxWidth: "800px"
          }}>
            <Document
              file={`${API_BASE_URL}/uploads/${selectedPdf}`}
              onLoadSuccess={onDocumentLoadSuccess}
            >
              <Page pageNumber={currentPage} />
            </Document>
          </div>

          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "15px",
            marginTop: "20px",
            color: "white"
          }}>
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
              style={{
                padding: "10px 15px",
                backgroundColor: currentPage <= 1 ? "#666" : "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: currentPage <= 1 ? "not-allowed" : "pointer"
              }}
            >
              ← Prev
            </button>
            <span>
              Page {currentPage} of {numPages || "?"}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(numPages, currentPage + 1))}
              disabled={currentPage >= numPages}
              style={{
                padding: "10px 15px",
                backgroundColor: currentPage >= numPages ? "#666" : "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: currentPage >= numPages ? "not-allowed" : "pointer"
              }}
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* MAIN CHAT */}

      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#1a2332"
      }}>

        {/* HEADER */}

        <div style={{
          backgroundColor: "transparent",
          padding: "24px 32px",
          borderBottom: "1px solid #2a3a4a",
          textAlign: "center"
        }}>
          <h1 style={{
            fontSize: "32px",
            fontWeight: "700",
            color: "#ffffff",
            margin: "0"
          }}>
            Personal AI Cloud
          </h1>
        </div>

        {/* CHAT AREA */}

        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px 32px",
          display: "flex",
          flexDirection: "column",
          gap: "16px"
        }}>

          {currentChat?.messages.map(
            (msg, index) => (

              <div
                key={index}
                style={{
                  display: "flex",

                  justifyContent:
                    msg.role === "user"
                      ? "flex-end"
                      : "flex-start",

                  gap: "12px"
                }}
              >
                {msg.role === "ai" && (
                  <div
                    style={{
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
                    }}
                  >
                    AI
                  </div>
                )}

                <div>
                  <div
                    style={{
                      backgroundColor:
                        msg.role === "user"
                          ? "#0066ff"
                          : "#2a3a4a",

                      color:
                        msg.role === "user"
                          ? "#ffffff"
                          : "#e0e0e0",

                      padding: "12px 16px",
                      borderRadius: "8px",
                      maxWidth: "70%",
                      lineHeight: "1.5",
                      border: msg.role === "user" ? "none" : "1px solid #3a4a5a",
                      wordWrap: "break-word"
                    }}
                  >
                    {msg.content}
                  </div>
                </div>

              </div>
            )
          )}

          {isGenerating && (

            <div style={{
              marginBottom: "20px"
            }}>

              <div style={{
                backgroundColor: "#1e293b",
                padding: "15px",
                borderRadius: "15px",
                width: "120px"
              }}>

                AI is typing...

              </div>

            </div>
          )}

        </div>

        {/* INPUT AREA */}

        <div style={{
          backgroundColor: "#1a2332",
          borderTop: "1px solid #2a3a4a",
          padding: "20px 32px",
          display: "flex",
          flexDirection: "column",
          gap: "16px"
        }}>

          {/* ACTIVE KNOWLEDGE BASE */}
          <div style={{ marginBottom: "8px" }}>

            <div style={{
              fontSize: "13px",
              fontWeight: "600",
              color: "#b0b0b0",
              marginBottom: "8px"
            }}>
              Active Knowledge Base:
            </div>

            <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
              <button
                onClick={() =>
                  setSelectedDocument(null)
                }
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor:
                    !selectedDocument
                      ? "#0066ff"
                      : "#3a4a5a",
                  color: "#ffffff",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: "600",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  if (selectedDocument) {
                    e.target.style.backgroundColor = "#4a5a6a";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedDocument) {
                    e.target.style.backgroundColor = "#3a4a5a";
                  }
                }}
              >
                All PDFs
              </button>

              <button
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor:
                    selectedDocument
                      ? "#0066ff"
                      : "#3a4a5a",
                  color: "#ffffff",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: "600",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  if (!selectedDocument) {
                    e.target.style.backgroundColor = "#4a5a6a";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!selectedDocument) {
                    e.target.style.backgroundColor = "#3a4a5a";
                  }
                }}
              >
                Choose Files
              </button>

              <span style={{ fontSize: "12px", color: "#999999" }}>
                No file chosen
              </span>
            </div>

          </div>

          {/* MULTI PDF UPLOAD */}

          <div style={{
            marginBottom: "15px"
          }}>

            <input
              type="file"
              accept=".pdf"
              multiple
              onChange={uploadPDF}
              style={{
                marginBottom: "10px",
                color: "white"
              }}
            />

            {uploadMessage && (
              <p style={{ color: "#0066ff", fontSize: "12px" }}>
                {uploadMessage}
              </p>
            )}

          </div>

          {/* INPUT GROUP */}

          <div style={{ display: "flex", gap: "12px", alignItems: "flex-end" }}>
            <input
              placeholder="Ask anything..."
              value={prompt}
              onChange={(e) =>
                setPrompt(e.target.value)
              }
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendPrompt();
                }
              }}
              style={{
                flex: 1,
                padding: "12px 16px",
                border: "1px solid #3a4a5a",
                borderRadius: "6px",
                backgroundColor: "#2a3a4a",
                color: "#e0e0e0",
                resize: "none",
                fontSize: "13px",
                fontFamily: "inherit",
                outline: "none",
                transition: "border-color 0.2s ease"
              }}
              onFocus={(e) => (e.target.style.borderColor = "#0066ff")}
              onBlur={(e) => (e.target.style.borderColor = "#3a4a5a")}
            />

            {/* SEND BUTTON */}

            <button
              onClick={sendPrompt}
              disabled={isGenerating}
              style={{
                padding: "10px 28px",
                borderRadius: "6px",
                border: "none",
                cursor: isGenerating ? "not-allowed" : "pointer",
                backgroundColor: "#0066ff",
                color: "white",
                fontWeight: "600",
                fontSize: "13px",
                transition: "background-color 0.2s ease",
                opacity: isGenerating ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!isGenerating) {
                  e.target.style.backgroundColor = "#0052cc";
                }
              }}
              onMouseLeave={(e) => {
                if (!isGenerating) {
                  e.target.style.backgroundColor = "#0066ff";
                }
              }}
            >
              {
                isGenerating
                  ? "Generating..."
                  : "Ask AI"
              }
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}

export default App;