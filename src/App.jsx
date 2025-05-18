import SearchBar from "./components/SearchBar";
import Globe from "./components/Globe";
import { GlobeProvider } from "./context/GlobeContext";
import PlacesPanel from "./components/PlacesPanel";

function App() {
  return (
    <GlobeProvider>
      <div className="app-container">
        <PlacesPanel />
        <Globe />
        <SearchBar />
      </div>
    </GlobeProvider>
  );
}

export default App;
