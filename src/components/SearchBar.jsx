import React, { useState } from "react";
import "./SearchBar.css";
import { useGemini } from "../utils/geminiService";
import { useGlobe } from "../context/GlobeContext";

function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("");
  const [filters, setFilters] = useState({});
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const { sendMessage, isLoading, error } = useGemini(apiKey);
  const { setCoordinates, setPlaces } = useGlobe();

  // Activity-specific filter options
  const activityFilters = {
    hiking: {
      difficulty: ["Easy", "Moderate", "Challenging", "Expert"],
      length: ["Short (< 2 miles)", "Medium (2-5 miles)", "Long (> 5 miles)"],
      elevation: ["Low", "Moderate", "High"],
    },
    swimming: {
      type: ["Beach", "Pool", "Lake", "River"],
      facilities: ["Lifeguard", "Changing Rooms", "Showers"],
      waterType: ["Salt Water", "Fresh Water"],
    },
    camping: {
      type: ["Tent", "RV", "Cabin"],
      amenities: ["Electricity", "Water", "Restrooms"],
      environment: ["Forest", "Mountain", "Beach", "Desert"],
    },
    sightseeing: {
      type: ["Historical", "Natural", "Cultural", "Architectural"],
      duration: ["Quick Visit", "Half Day", "Full Day"],
      accessibility: [
        "Wheelchair Accessible",
        "Family Friendly",
        "Senior Friendly",
      ],
    },
    dining: {
      cuisine: ["Local", "International", "Fusion", "Traditional"],
      price: ["Budget", "Moderate", "Upscale", "Fine Dining"],
      atmosphere: ["Casual", "Family", "Romantic", "Business"],
    },
  };

  const handleActivityChange = (e) => {
    const activity = e.target.value;
    setSelectedActivity(activity);
    setFilters({}); // Reset filters when activity changes
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery || !selectedActivity) return;

    const filterString = Object.entries(filters)
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ");

    const prompt = `Given the city: ${searchQuery} and the activity: ${selectedActivity}${
      filterString ? ` with filters: ${filterString}` : ""
    }, provide:
1. The latitude and longitude of the city as a JSON object: { "lat": ..., "lng": ... }
2. A list of 5 places in that city suitable for ${selectedActivity}${
      filterString ? ` matching these criteria: ${filterString}` : ""
    }, as a JSON array of objects with:
   - "name": name of the place
   - "address": full address
   - "lat": latitude of the place
   - "lng": longitude of the place
   - "rating": number between 0-5 (can include decimals)
   - "reviews": array of 3 recent reviews (each review should be a string)
   - "description": brief description of the place
   - "mapsUrl": Google Maps URL for the place in the format "https://www.google.com/maps/search/?api=1&query=<place_name>"
Respond ONLY with a JSON object: { "coordinates": { "lat": ..., "lng": ... }, "places": [ ... ] }`;

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
        <div className="search-row">
          <input
            type="text"
            placeholder="Search destinations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <select
            value={selectedActivity}
            onChange={handleActivityChange}
            className="activity-select"
          >
            <option value="">Select Activity</option>
            <option value="hiking">Hiking</option>
            <option value="swimming">Swimming</option>
            <option value="camping">Camping</option>
            <option value="sightseeing">Sightseeing</option>
            <option value="dining">Dining</option>
          </select>
        </div>
        {selectedActivity && activityFilters[selectedActivity] && (
          <div className="filters-row">
            <div className="filters-container">
              {Object.entries(activityFilters[selectedActivity]).map(
                ([filterType, options]) => (
                  <select
                    key={filterType}
                    value={filters[filterType] || ""}
                    onChange={(e) =>
                      handleFilterChange(filterType, e.target.value)
                    }
                    className="activity-select"
                  >
                    <option value="">Select {filterType}</option>
                    {options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )
              )}
            </div>
            <button
              type="submit"
              className="search-button"
              disabled={isLoading}
            >
              {isLoading ? "Searching..." : "Search"}
            </button>
          </div>
        )}
      </form>
      {error && <div className="error-message">Error: {error}</div>}
    </div>
  );
}

export default SearchBar;
