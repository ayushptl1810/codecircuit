import React from "react";
import "../styles/ErrorState.css";

function ErrorState({ errorData }) {
  return (
    <div className="no-results-message">
      <h2>No Places Found</h2>
      <p>{errorData.message}</p>
      <div className="suggestions">
        <h3>Try these suggestions:</h3>
        <ul>
          {errorData.suggestions.map((suggestion, index) => (
            <li key={index}>{suggestion}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ErrorState;
