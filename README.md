# Zoom Trip - Interactive 3D Globe Explorer

A modern web application that helps users discover and explore places around the world using an interactive 3D globe visualization. Built with React and Cesium, the application provides an immersive experience for finding destinations and activities.

## 🌟 Features

- **Interactive 3D Globe**: Explore the world with a beautiful, interactive 3D globe powered by Cesium
- **Smart Search**: Find places based on location and activity preferences
- **Dynamic Filtering**: Filter results by various criteria specific to each activity type
- **Real-time Visualization**: See search results instantly displayed on the 3D globe
- **Detailed Place Information**: View comprehensive details about each location including:
  - Ratings and reviews
  - Address and description
  - Direct links to Google Maps
  - Star ratings
- **Smooth Animations**: Enjoy fluid camera transitions and globe rotations
- **Error Handling**: Graceful error states with helpful suggestions

## 🛠️ Technology Stack

- **Frontend Framework**: React
- **3D Globe**: Cesium with Resium
- **State Management**: React Context API
- **API Integration**: Google Gemini AI
- **Styling**: CSS Modules
- **Environment Variables**: Vite

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Gemini API key
- Cesium ion access token

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ayushptl1810/codecircuit.git
   cd codecircuit
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory with your API keys:

   ```
   VITE_GEMINI_API_KEY=your_gemini_api_key
   VITE_CESIUM_ION_ACCESS_TOKEN=your_cesium_token
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## 📁 Project Structure

```
src/
├── assets/          # Static assets like images
├── components/      # React components
├── config/         # Configuration files
├── context/        # React context providers
├── styles/         # CSS styles
└── utils/          # Utility functions and services
```

## 🎯 Key Components

- **Globe**: 3D globe visualization with terrain and imagery
- **SearchBar**: Location and activity search with dynamic filters
- **PlacesPanel**: Displays search results and place details
- **CameraController**: Manages camera behavior and animations
- **StarRating**: Visual star rating component
- **ErrorState**: Handles error messages and suggestions
- **WelcomeMessage**: Initial welcome screen

## 🔧 Configuration

The application uses several configuration files:

- `globeConfig.js`: Globe visualization settings
- `activityFilters.js`: Activity-specific filter options

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgments

- Cesium for the 3D globe technology
- Google Gemini for AI-powered place recommendations
- Resium for React bindings for Cesium
