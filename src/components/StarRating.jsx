import React from "react";
import "../styles/StarRating.css";

/**
 * StarRating Component
 * Renders a visual star rating display
 * Supports partial star fills based on decimal ratings
 */
function StarRating({ rating }) {
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
}

export default StarRating;
