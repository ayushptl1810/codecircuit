import { useState } from "react";
import "./App.css";
import SearchBar from "./components/SearchBar";
import Globe from "./components/Globe";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Globe />
      <SearchBar />
    </>
  );
}

export default App;
