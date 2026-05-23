import { useState, useEffect } from "react";

function App() {

  // LOAD SAVED CHATS
  const [chats, setChats] = useState(() => {

    const savedChats =
      localStorage.getItem("ai_chats");

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
          "current_chat_id"
        );

      return savedId
        ? Number(savedId)
        : 1;
    });

  // INPUT
  const [prompt, setPrompt] = useState("");

  // PDF UPLOAD MESSAGE
  const [uploadMessage, setUploadMessage] =
    useState("");

  // FIND CURRENT CHAT
  const currentChat = chats.find(
    (chat) => chat.id === currentChatId
  );

  // SAVE CHATS
  useEffect(() => {

    localStorage.setItem(
      "ai_chats",
      JSON.stringify(chats)
    );

  }, [chats]);

  // SAVE ACTIVE CHAT
  useEffect(() => {

    localStorage.setItem(
      "current_chat_id",
      currentChatId
    );

  }, [currentChatId]);

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
            prompt: currentPrompt
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

      </div>

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