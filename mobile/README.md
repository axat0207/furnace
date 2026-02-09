# FURNACE Mobile

This is the mobile companion app for the FURNACE personal OS.

## Tech Stack
- **Framework**: Expo (React Native)
- **Styling**: NativeWind (TailwindCSS)
- **Navigation**: Expo Router
- **Icons**: Lucide React Native
- **Fonts**: Inter & Orbitron (via Google Fonts)

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run the App**
   ```bash
   npx expo start
   ```
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator

## Project Structure
- `app/`: Screens and Navigation (File-based routing)
- `components/`: Reusable UI components
- `constants/`: Shared constants (synced with web)
- `services/`: API connection logic

## Backend Connection
The app attempts to connect to the FURNACE web app's API at `http://localhost:3000`. Ensure your web app is running locally for full functionality.
