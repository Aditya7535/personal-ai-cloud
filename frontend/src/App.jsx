import { useState, useEffect } from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";

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

  // FIND CURRENT CHAT
  const currentChat = chats.find(
    (chat) => chat.id === currentChatId
  );

  // SAVE CHATS
  useEffect(() => {

    localStorage.setItem(
      chatStorageKey,
      JSON.stringify(chats)
    );

  }, [chats]);

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

  // RESET CHATS WHEN USER CHANGES
  useEffect(() => {

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

    try {

      const endpoint = isSignup
        ? "signup"
        : "login";

      const response = await fetch(
        `http://127.0.0.1:8000/${endpoint}`,
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

      // LOGIN
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

      } else {

        alert(data.message);
      }

    } catch (error) {

      console.log(error);

    }
  };

  // FETCH DOCUMENTS
  const fetchDocuments = async () => {

    try {

      const response = await fetch(
        `http://127.0.0.1:8000/documents/${currentUser}`
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
      `http://127.0.0.1:8000/uploads/${filename}`;

    window.open(url, "_blank");
  };

  // DELETE DOCUMENT
  const deleteDoc = async (filename) => {

    try {

      await fetch(
        `http://127.0.0.1:8000/documents/${filename}`,
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

        formData.append(
          "username",
          currentUser
        );

        await fetch(
          "http://127.0.0.1:8000/upload",
          {
            method: "POST",
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

  // SEND PROMPT
  const sendPrompt = async () => {

    if (!prompt.trim()) return;

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
        "http://127.0.0.1:8000/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({

            username: currentUser,

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

    } catch (error) {

      console.log(error);

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
        backgroundColor: "#0f172a",
        color: "white",
        fontFamily: "Arial"
      }}>

        <div style={{
          width: "350px",
          backgroundColor: "#1e293b",
          padding: "30px",
          borderRadius: "20px"
        }}>

          <h1 style={{
            textAlign: "center",
            marginBottom: "20px"
          }}>
            Personal AI Cloud
          </h1>

          <h2 style={{
            textAlign: "center",
            marginBottom: "20px"
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
              padding: "12px",
              marginBottom: "15px",
              borderRadius: "10px",
              border: "none",
              boxSizing: "border-box"
            }}
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
              padding: "12px",
              marginBottom: "20px",
              borderRadius: "10px",
              border: "none",
              boxSizing: "border-box"
            }}
          />

          <button
            onClick={handleAuth}

            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: "#2563eb",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer"
            }}
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
              marginTop: "20px",
              textAlign: "center",
              cursor: "pointer"
            }}
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
      backgroundColor: "#0f172a",
      color: "white",
      fontFamily: "Arial"
    }}>

      {/* SIDEBAR */}

      <div style={{
        width: "260px",
        backgroundColor: "#111827",
        padding: "20px",
        borderRight: "1px solid #333",
        overflowY: "auto"
      }}>

        {/* NEW CHAT */}

        <button
          onClick={createNewChat}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "12px",
            marginBottom: "20px",
            cursor: "pointer",
            border: "none",
            backgroundColor: "#374151",
            color: "white",
            fontWeight: "bold"
          }}
        >
          + New Chat
        </button>

        {/* LOGOUT */}
        <button
          onClick={logout}

          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "10px",
            marginBottom: "20px",
            cursor: "pointer",
            border: "none",
            backgroundColor: "#dc2626",
            color: "white",
            fontWeight: "bold"
          }}
        >
          Logout
        </button>

        {/* CHAT LIST */}

        {chats.map((chat) => (

          <div
            key={chat.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent:
                "space-between",

              padding: "12px",
              marginBottom: "10px",
              borderRadius: "12px",

              backgroundColor:
                currentChatId === chat.id
                  ? "#2563eb"
                  : "#1e293b"
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
                color: "white",
                cursor: "pointer",
                fontSize: "16px"
              }}
            >
              ✕
            </button>

          </div>
        ))}
        <hr style={{
          margin: "20px 0",
          borderColor: "#333"
        }} />

        <h3 style={{
          marginBottom: "15px"
        }}>
          Knowledge Base
        </h3>

        <div>

          {documents.map((doc, index) => (

            <div
              key={index}
              style={{
                backgroundColor: "#1e293b",
                padding: "10px",
                borderRadius: "10px",
                marginBottom: "10px",
                fontSize: "14px",
                overflowWrap: "break-word",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
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
                      ? "#60a5fa"
                      : "white"
                }}
              >
                📄 {doc}
              </span>
              <button
                onClick={() => deleteDoc(doc)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#ef4444",
                  cursor: "pointer",
                  fontSize: "16px",
                  padding: "0",
                  marginLeft: "10px"
                }}
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
              file={`http://127.0.0.1:8000/uploads/${selectedPdf}`}
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
        padding: "20px"
      }}>

        {/* HEADER */}

        <h1 style={{
          textAlign: "center",
          marginBottom: "20px"
        }}>
          Personal AI Cloud
        </h1>

        {/* CHAT AREA */}

        <div style={{
          flex: 1,
          overflowY: "auto",
          paddingRight: "10px"
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

                  marginBottom: "15px"
                }}
              >

                <div
                  style={{
                    backgroundColor:
                      msg.role === "user"
                        ? "#2563eb"
                        : "#1e293b",

                    padding: "15px",
                    borderRadius: "15px",
                    maxWidth: "70%",
                    lineHeight: "1.5"
                  }}
                >

                  <strong>
                    {msg.role === "user"
                      ? "You"
                      : "AI"}
                  </strong>

                  <p style={{
                    marginTop: "8px",
                    whiteSpace: "pre-wrap"
                  }}>
                    {msg.content}
                  </p>

                </div>

              </div>
            )
          )}

        </div>

        {/* INPUT AREA */}

        <div style={{
          marginTop: "20px"
        }}>

          {/* ACTIVE KNOWLEDGE BASE */}
          <p style={{ marginBottom: "15px" }}>

            Active Knowledge Base:
            <br />

            <button
              onClick={() =>
                setSelectedDocument(null)
              }
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #60a5fa",
                backgroundColor:
                  !selectedDocument
                    ? "#60a5fa"
                    : "transparent",
                color:
                  !selectedDocument
                    ? "white"
                    : "#60a5fa",
                cursor: "pointer",
                marginRight: "10px",
                marginTop: "8px"
              }}
            >
              All PDFs
            </button>

            {selectedDocument && (
              <span
                style={{
                  color: "#93c5fd",
                  fontSize: "14px"
                }}
              >
                Selected: <strong>{selectedDocument}</strong>
              </span>
            )}

          </p>

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

            <p>
              {uploadMessage}
            </p>

          </div>

          {/* TEXTAREA */}

          <textarea
            rows="4"
            placeholder="Ask anything..."
            value={prompt}
            onChange={(e) =>
              setPrompt(e.target.value)
            }
            style={{
              width: "100%",
              padding: "15px",
              borderRadius: "15px",
              border: "1px solid #444",
              backgroundColor: "#1e293b",
              color: "white",
              resize: "none",
              fontSize: "16px"
            }}
          />

          <br /><br />

          {/* SEND BUTTON */}

          <button
            onClick={sendPrompt}
            style={{
              padding: "12px 25px",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              backgroundColor: "#2563eb",
              color: "white",
              fontWeight: "bold",
              fontSize: "15px"
            }}
          >
            Ask AI
          </button>

        </div>

      </div>

    </div>
  );
}

export default App;