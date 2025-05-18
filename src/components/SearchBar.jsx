import React, { useState } from "react";
import "../styles/SearchBar.css";
import { useGemini } from "../utils/geminiService";
import { useGlobe } from "../context/GlobeContext";
import { activityFilters } from "../config/activityFilters";

/**
 * SearchBar Component
 * Handles user input for location search and activity selection
 * Manages the search state and communicates with the Gemini API
 */
function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("");
  const [filters, setFilters] = useState({});
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const { sendMessage, isLoading, error } = useGemini(apiKey);
  const { setCoordinates, setPlaces } = useGlobe();

  /**
   * Handles activity selection change
   * Resets filters when a new activity is selected
   */
  const handleActivityChange = (e) => {
    const activity = e.target.value;
    setSelectedActivity(activity);
    setFilters({});
  };

  /**
   * Updates filter state when a filter option is selected
   */
  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  /**
   * Handles form submission and communicates with Gemini API
   * Processes the response and updates the globe state
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery || !selectedActivity) return;

    // Format filters for the API prompt
    const filterString = Object.entries(filters)
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ");

    const prompt = `Given the city: ${searchQuery} and the activity: ${selectedActivity}${
      filterString ? ` with filters: ${filterString}` : ""
    }, provide a JSON response in the following format:

If places are found:
{
  "coordinates": {
    "lat": number,
    "lng": number
  },
  "places": [
    {
      "name": string,
      "address": string,
      "lat": number,
      "lng": number,
      "rating": number,
      "reviews": string[],
      "description": string,
      "mapsUrl": string
    }
  ]
}

If no places are found or there's an error:
{
  "error": true,
  "message": string,
  "suggestions": string[]
}

Important:
1. Always return valid JSON
2. Include at least 3 suggestions if no places are found
3. For coordinates, use the city's center coordinates
4. For places, include 5 locations if found
5. Each place must have all required fields
6. Do not include any text outside the JSON structure
7. Coordinates must be valid numbers between -90 and 90 for latitude, and -180 and 180 for longitude`;

    try {
      const response = await sendMessage(prompt);
      let jsonString = response?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!jsonString) {
        throw new Error("Invalid response format from API");
      }

      // Parse and clean the API response
      jsonString = jsonString.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(jsonString);

      if (parsed.error) {
        setPlaces([parsed]);
        setCoordinates(null);
        return;
      }

      // Validate and process coordinates
      if (
        !parsed.coordinates ||
        typeof parsed.coordinates.lat !== "number" ||
        typeof parsed.coordinates.lng !== "number" ||
        isNaN(parsed.coordinates.lat) ||
        isNaN(parsed.coordinates.lng) ||
        parsed.coordinates.lat < -90 ||
        parsed.coordinates.lat > 90 ||
        parsed.coordinates.lng < -180 ||
        parsed.coordinates.lng > 180
      ) {
        throw new Error("Invalid coordinates in response");
      }

      // Update coordinates with validated data
      setCoordinates({
        lat: Number(parsed.coordinates.lat),
        lng: Number(parsed.coordinates.lng),
        name: searchQuery,
      });

      // Validate and process places
      if (!parsed.places?.length) {
        throw new Error("No places found in response");
      }

      const validPlaces = parsed.places.filter(
        (place) =>
          place.name &&
          place.address &&
          typeof place.lat === "number" &&
          typeof place.lng === "number" &&
          !isNaN(place.lat) &&
          !isNaN(place.lng) &&
          place.lat >= -90 &&
          place.lat <= 90 &&
          place.lng >= -180 &&
          place.lng <= 180
      );

      if (validPlaces.length === 0) {
        throw new Error("No valid places found in response");
      }

      // Ensure all coordinates are numbers and update places
      const processedPlaces = validPlaces.map((place) => ({
        ...place,
        lat: Number(place.lat),
        lng: Number(place.lng),
      }));
      setPlaces(processedPlaces);
    } catch (error) {
      console.error("Error:", error);
      setPlaces([
        {
          error: true,
          message: error.message || "An error occurred. Please try again.",
          suggestions: [
            "Try a different location",
            "Adjust your activity filters",
            "Search for a more general area",
            "Try a different activity type",
          ],
        },
      ]);
      setCoordinates(null);
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
            <option value="hiking">⛰️ Hiking/Trekking</option>
            <option value="beaches">🏖️ Beaches/Relaxation</option>
            <option value="wildlife">🦁 Wildlife/Safari</option>
            <option value="camping">🏕️ Camping/Glamping</option>
            <option value="waterSports">🏄 Water Sports</option>
            <option value="historical">🏛️ Historical Sites</option>
            <option value="museums">🖼️ Museums/Art</option>
            <option value="culture">🌍 Local Culture</option>
            <option value="foodie">🍜 Foodie Experiences</option>
            <option value="sightseeing">🏙️ Sightseeing</option>
            <option value="shopping">🛍️ Shopping</option>
            <option value="nightlife">🌃 Nightlife</option>
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
