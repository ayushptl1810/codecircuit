import React from "react";
import "./PlacesPanel.css";
import { useGlobe } from "../context/GlobeContext";
import Logo from "../assets/Logo.png";

function PlacesPanel() {
  const { places } = useGlobe();

  const renderStars = (rating) => {
    return (
      <div className="stars">
        {[...Array(5)].map((_, i) => {
          const starValue = Math.max(0, Math.min(1, rating - i));
          const starClass =
            starValue === 0 ? "empty" : starValue === 1 ? "full" : "partial";
          const partialStyle =
            starValue < 1
              ? {
                  "--fill-percentage": `${starValue * 100}%`,
                }
              : {};

          return (
            <span key={i} className={`star ${starClass}`} style={partialStyle}>
              ★
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="places-panel">
      {places.length === 0 ? (
        <div className="welcome-message">
          <img src={Logo} alt="Logo" className="welcome-logo" />
          <h1>Discover Amazing Places</h1>
          <p>
            Search for your favorite destinations and activities to find the
            best spots around the world. From hiking trails to dining
            experiences, we'll help you explore what each city has to offer.
          </p>
        </div>
      ) : (
        <div className="places-container">
          <h2>Recommended Places</h2>
          <div className="places-list">
            {places.map((place, index) => (
              <div key={index} className="place-card">
                <h3>{place.name}</h3>
                <p className="address">{place.address}</p>
                <div className="rating-container">
                  {renderStars(place.rating)}
                  <span className="rating-number">
                    {place.rating.toFixed(1)}
                  </span>
                </div>
                <p className="description">{place.description}</p>
                <div className="reviews">
                  <h4>Recent Reviews</h4>
                  {place.reviews.map((review, i) => (
                    <p key={i} className="review">
                      "{review}"
                    </p>
                  ))}
                </div>
                {place.mapsUrl && (
                  <a
                    href={place.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="maps-link"
                  >
                    View on Google Maps
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PlacesPanel;
