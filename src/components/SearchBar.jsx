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
      Difficulty: ["Easy 🟢", "Moderate 🟡", "Challenging 🔴"],
      Terrain: ["Forest 🌲", "Mountain ⛰️", "Scenic 🏞️", "Trail 👣"],
      Duration: ["Short ⏱️", "Medium ➡️", "Long 🏁"],
    },
    beaches: {
      Type: ["Shell Beach 🐚", "Coral Reef 🐠", "Surf Beach 🏄"],
      Amenities: ["Beach Umbrellas ⛱️", "Restrooms 🚻", "Food Vendors 🍔"],
      "Crowd Level": ["Quiet 👤", "Moderate 👥", "Busy 👥👥👥"],
    },
    wildlife: {
      "Animal Focus": ["Big Cats 🦁", "Elephants 🐘", "Birds 🐦"],
      "Safari Type": [
        "Vehicle Safari 🚗",
        "Walking Safari 🚶",
        "Boat Safari 🛶",
      ],
      Duration: ["Half Day ⏱️", "Full Day ☀️", "Overnight 🌙"],
    },
    camping: {
      Accommodation: ["Tent ⛺", "Cabin 🏡", "Luxury ⭐"],
      Facilities: ["Campfire 🔥", "Restrooms 🚻", "Electricity 🔌"],
      Location: ["Forest 🌲", "Scenic 🏞️", "Mountain ⛰️"],
    },
    waterSports: {
      "Sport Type": ["Surfing 🏄", "Diving 🤿", "Sailing ⛵"],
      "Experience Level": ["Beginner 🟢", "Intermediate 🟡", "Advanced 🔴"],
      "Water Body": ["Ocean 🌊", "Lake/River 🏞️"],
    },
    historical: {
      Era: ["Ancient 🗿", "Medieval 🏰", "Modern 🏢"],
      "Site Type": ["Ruins 🧱", "Museum 🖼️", "Landmark 🏛️"],
      Accessibility: [
        "Wheelchair Accessible ♿",
        "Walking Distance 🚶",
        "Public Transport 🚌",
      ],
    },
    museums: {
      "Art Style": ["Fine Art 🎨", "Antiquities 🏺", "Contemporary 🖼️"],
      "Time Period": ["Modern", "Classical", "Ancient"],
      Interactive: ["Touch Screens 📱", "Audio Guides 🎧", "Guided Tours 🗣️"],
    },
    culture: {
      "Experience Type": ["Performances 🎭", "Cooking 🧑‍🍳", "Music 🎶"],
      Theme: ["Festivals 🎉", "Community 🤝", "Traditional 🧺"],
      Immersion: ["Observational 👀", "Interactive 👂", "Hands-on ✋"],
    },
    foodie: {
      Cuisine: ["Italian 🇮🇹", "Japanese 🇯🇵", "Mexican 🇲🇽"],
      "Dining Style": ["Fine Dining 🍽️", "Cooking Class 🧑‍🍳", "Food Tour 🚚"],
      "Price Range": ["Budget 💲", "Moderate 💲💲", "Luxury 💲💲💲"],
    },
    sightseeing: {
      Transport: ["Walking 🚶", "Bus Tour 🚌", "Bicycle 🚲"],
      Theme: ["Historic", "Modern", "Iconic"],
      Pace: ["Relaxed", "Brisk", "Focused"],
    },
    shopping: {
      Goods: ["Local Crafts 🛍️", "Art 🎨", "Local Products 🏺"],
      Area: ["Shopping Mall", "Street Market", "Boutique"],
      "Price Range": ["Budget 💲", "Moderate 💲💲", "Luxury 💲💲💲"],
    },
    nightlife: {
      "Venue Type": ["Bar 🍹", "Live Music 🎶", "Dance Club 💃"],
      Vibe: ["Relaxed", "Lively", "Sophisticated"],
      "Dress Code": ["Casual", "Smart Casual", "Formal"],
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
      let jsonString = "";

      if (response?.candidates?.[0]?.content?.parts?.[0]?.text) {
        jsonString = response.candidates[0].content.parts[0].text;
      } else {
        throw new Error("Invalid response format from API");
      }

      try {
        // Clean up the response string
        jsonString = jsonString.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(jsonString);

        if (parsed.error) {
          // Handle error response
          setPlaces([parsed]);
          setCoordinates(null);
        } else {
          // Validate coordinates
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

          // Set coordinates if valid
          setCoordinates({
            lat: Number(parsed.coordinates.lat),
            lng: Number(parsed.coordinates.lng),
            name: searchQuery,
          });

          // Validate places
          if (
            parsed.places &&
            Array.isArray(parsed.places) &&
            parsed.places.length > 0
          ) {
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

            if (validPlaces.length > 0) {
              // Ensure all coordinates are numbers
              const processedPlaces = validPlaces.map((place) => ({
                ...place,
                lat: Number(place.lat),
                lng: Number(place.lng),
              }));
              setPlaces(processedPlaces);
            } else {
              throw new Error("No valid places found in response");
            }
          } else {
            throw new Error("No places found in response");
          }
        }
      } catch (parseError) {
        console.error("Error parsing response:", parseError);
        setPlaces([
          {
            error: true,
            message: "Unable to process the response. Please try again.",
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
    } catch (apiError) {
      console.error("API Error:", apiError);
      setPlaces([
        {
          error: true,
          message: "Error connecting to the service. Please try again.",
          suggestions: [
            "Check your internet connection",
            "Try searching again",
            "Try different search terms",
            "Contact support if the problem persists",
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
