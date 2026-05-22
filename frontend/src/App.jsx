import { useState } from "react";
import axios from "axios";

function App() {

  const [prompt, setPrompt] = useState("");

  const [messages, setMessages] = useState([]);

  const sendPrompt = async () => {

    if (!prompt.trim()) return;

    // Add user message
    const userMessage = {
      role: "user",
      content: prompt
    };

    setMessages((prev) => [...prev, userMessage]);

    try {

      const res = await axios.post(
        "http://127.0.0.1:8000/chat",
        {
          prompt: prompt
        }
      );

      // Add AI message
      const aiMessage = {
        role: "ai",
        content: res.data.response
      };

      setMessages((prev) => [...prev, aiMessage]);

    } catch (error) {

      console.log(error);

    }

    setPrompt("");
  };

  return (

    <div style={{
      backgroundColor: "#0f172a",
      minHeight: "100vh",
      padding: "20px",
      color: "white",
      fontFamily: "Arial"
    }}>

      <h1>Personal AI Cloud</h1>

      {/* CHAT AREA */}

      <div style={{
        marginTop: "20px",
        marginBottom: "20px"
      }}>

        {messages.map((msg, index) => (

          <div
            key={index}
            style={{
              backgroundColor:
                msg.role === "user"
                  ? "#2563eb"
                  : "#1e293b",

              padding: "15px",
              borderRadius: "10px",
              marginBottom: "10px",
              maxWidth: "70%"
            }}
          >

            <strong>
              {msg.role === "user" ? "You" : "AI"}
            </strong>

            <p>{msg.content}</p>

          </div>
        ))}

      </div>

      {/* INPUT */}

      <textarea
        rows="5"
        cols="60"
        placeholder="Ask anything..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{
          padding: "10px",
          borderRadius: "10px"
        }}
      />

      <br /><br />

      <button
        onClick={sendPrompt}
        style={{
          padding: "10px 20px",
          borderRadius: "10px",
          cursor: "pointer"
        }}
      >
        Ask AI
      </button>

    </div>
  );
}

export default App;