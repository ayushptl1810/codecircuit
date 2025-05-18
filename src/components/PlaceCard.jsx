import React from "react";
import "../styles/PlaceCard.css";
import StarRating from "./StarRating";

/**
 * PlaceCard Component
 * Displays detailed information about a specific place
 * Includes name, address, rating, description, and reviews
 */
function PlaceCard({ place }) {
  return (
    <div className="place-card">
      <h3>{place.name}</h3>
      <p className="address">{place.address}</p>
      <div className="rating-container">
        <StarRating rating={place.rating} />
        <span className="rating-number">{place.rating.toFixed(1)}</span>
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
  );
}

export default PlaceCard;
