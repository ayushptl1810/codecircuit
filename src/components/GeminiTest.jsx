import React, { useState } from "react";
import { useGemini } from "../utils/geminiService";

function GeminiTest() {
  const [inputMessage, setInputMessage] = useState("");
  const [response, setResponse] = useState(null);
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const { sendMessage, isLoading, error } = useGemini(apiKey);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await sendMessage(inputMessage);
      setResponse(result);
      console.log("Full API Response:", result);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div
      className="gemini-test"
      style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}
    >
      <h2>Gemini API Test</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <div style={{ marginBottom: "10px" }}>
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Enter your message here..."
            style={{
              width: "100%",
              minHeight: "100px",
              padding: "10px",
              marginBottom: "10px",
            }}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: "10px 20px",
            backgroundColor: isLoading ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          {isLoading ? "Sending..." : "Send Message"}
        </button>
      </form>

      {error && (
        <div style={{ color: "red", marginBottom: "20px" }}>Error: {error}</div>
      )}

      {response && (
        <div
          style={{
            backgroundColor: "#f5f5f5",
            padding: "15px",
            borderRadius: "4px",
            whiteSpace: "pre-wrap",
          }}
        >
          <h3>Response:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default GeminiTest;
