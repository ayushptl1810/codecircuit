import React from "react";
import "../styles/WelcomeMessage.css";
import Logo from "../assets/Logo.png";

function WelcomeMessage() {
  return (
    <div className="welcome-message">
      <img src={Logo} alt="Logo" className="welcome-logo" />
      <h1>Discover Amazing Places</h1>
      <p>
        Search for your favorite destinations and activities to find the best
        spots around the world. From hiking trails to experiencing local
        culture, we'll help you explore what each city or country has to offer.
        Explore destinations and activities around the world. Search for a
        location to get started!
      </p>
    </div>
  );
}

export default WelcomeMessage;
