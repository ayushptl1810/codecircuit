import React, { useState } from "react";
import "./SearchBar.css";
import { useGemini } from "../utils/geminiService";
import { useGlobe } from "../context/GlobeContext";

function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("");
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const { sendMessage, isLoading, error } = useGemini(apiKey);
  const { setCoordinates, setPlaces } = useGlobe();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery || !selectedActivity) return;
    const prompt = `Given the city: ${searchQuery} and the activity: ${selectedActivity}, provide:\n1. The latitude and longitude of the city as a JSON object: { \"lat\": ..., \"lng\": ... }\n2. A list of 5 places in that city suitable for ${selectedActivity}, as a JSON array of objects with \"name\" and \"address\".\nRespond ONLY with a JSON object: { \"coordinates\": { \"lat\": ..., \"lng\": ... }, \"places\": [ ... ] }`;
    try {
      const response = await sendMessage(prompt);
      let jsonString = "";
      if (response?.candidates?.[0]?.content?.parts?.[0]?.text) {
        jsonString = response.candidates[0].content.parts[0].text;
      }
      try {
        jsonString = jsonString.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(jsonString);
        if (parsed.coordinates) {
          setCoordinates({
            ...parsed.coordinates,
            name: searchQuery,
          });
        }
        if (parsed.places) {
          setPlaces(parsed.places);
        }
      } catch (err) {
        console.error("Error parsing response:", err);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          placeholder="Search destinations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <select
          value={selectedActivity}
          onChange={(e) => setSelectedActivity(e.target.value)}
          className="activity-select"
        >
          <option value="">Select Activity</option>
          <option value="hiking">Hiking</option>
          <option value="swimming">Swimming</option>
          <option value="camping">Camping</option>
          <option value="sightseeing">Sightseeing</option>
          <option value="dining">Dining</option>
        </select>
        <button type="submit" className="search-button" disabled={isLoading}>
          {isLoading ? "Searching..." : "Search"}
        </button>
      </form>
      {error && <div className="error-message">Error: {error}</div>}
    </div>
  );
}

export default SearchBar;
