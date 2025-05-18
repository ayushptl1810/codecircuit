import React from "react";
import "../styles/PlacesPanel.css";
import { useGlobe } from "../context/GlobeContext";
import WelcomeMessage from "./WelcomeMessage";
import ErrorState from "./ErrorState";
import PlaceCard from "./PlaceCard";

/**
 * PlacesPanel Component
 * Displays the list of recommended places or appropriate messages
 * Handles different states: welcome, error, and results
 */
function PlacesPanel() {
  const { places } = useGlobe();

  return (
    <div className="places-panel">
      {places.length === 0 ? (
        <WelcomeMessage />
      ) : places[0]?.error ? (
        <ErrorState errorData={places[0]} />
      ) : (
        <div className="places-container">
          <h2>Recommended Places</h2>
          <div className="places-list">
            {places.map((place, index) => (
              <PlaceCard key={index} place={place} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PlacesPanel;
