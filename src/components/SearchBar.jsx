import React, { useState } from "react";
import "./SearchBar.css";

function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle search submission here
    console.log("Search:", searchQuery, "Activity:", selectedActivity);
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
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
