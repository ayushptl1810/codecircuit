import React, { createContext, useContext, useState } from "react";

const GlobeContext = createContext();

export function GlobeProvider({ children }) {
  const [coordinates, setCoordinates] = useState(null);
  const [places, setPlaces] = useState([]);

  return (
    <GlobeContext.Provider
      value={{ coordinates, setCoordinates, places, setPlaces }}
    >
      {children}
    </GlobeContext.Provider>
  );
}

export function useGlobe() {
  const context = useContext(GlobeContext);
  if (!context) {
    throw new Error("useGlobe must be used within a GlobeProvider");
  }
  return context;
}
