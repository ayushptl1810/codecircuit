import { useState } from "react";
import "./App.css";
import SearchBar from "./components/SearchBar";
import Globe from "./components/Globe";
import { GlobeProvider } from "./context/GlobeContext";
import GeminiTest from "./components/GeminiTest";

function App() {
  const [count, setCount] = useState(0);

  return (
    <GlobeProvider>
      <Globe />
      <SearchBar />
      <GeminiTest />
    </GlobeProvider>
  );
}

export default App;
