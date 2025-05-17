import { useState } from "react";
import "./App.css";
import SearchBar from "./components/SearchBar";
import Globe from "./components/Globe";
import { GlobeProvider } from "./context/GlobeContext";
import PlacesPanel from "./components/PlacesPanel";

function App() {
  const [count, setCount] = useState(0);

  return (
    <GlobeProvider>
      <PlacesPanel />
      <Globe />
      <SearchBar />
    </GlobeProvider>
  );
}

export default App;
