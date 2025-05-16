import React from "react";

// Gemini API service utility
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`;

/**
 * Sends a request to the Gemini API
 * @param {string} messageText - The text message to send to Gemini
 * @param {string} apiKey - The Gemini API key
 * @returns {Promise<Object>} The response from the Gemini API
 * @throws {Error} If the API request fails or returns an error
 */
export const sendToGemini = async (messageText, apiKey) => {
  if (!apiKey) {
    throw new Error("Gemini API key is required");
  }

  const url = `${GEMINI_API_URL}?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: messageText,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Gemini API request failed: ${response.status} ${
          errorData.error?.message || response.statusText
        }`
      );
    }

    const data = await response.json();
    console.log("data", data);
    return data;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};

/**
 * Custom hook for using the Gemini API
 * @param {string} apiKey - The Gemini API key
 * @returns {Object} An object containing the sendMessage function and loading/error states
 */
export const useGemini = (apiKey) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const sendMessage = async (messageText) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendToGemini(messageText, apiKey);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendMessage,
    isLoading,
    error,
  };
};
