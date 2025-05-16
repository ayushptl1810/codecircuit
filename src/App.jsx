import { useState } from "react";
import "./App.css";
import SearchBar from "./components/SearchBar";
import Globe from "./components/Globe";
import { GlobeProvider } from "./context/GlobeContext";
import GeminiTest from "./components/GeminiTest";
import PlacesPanel from "./components/PlacesPanel";

function App() {
  const [count, setCount] = useState(0);

  return (
    <GlobeProvider>
      <PlacesPanel />
      <Globe />
      <SearchBar />
      <GeminiTest />
    </GlobeProvider>
  );
}

export default App;
