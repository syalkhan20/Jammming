# Jammming (React Playlist Builder)

## Live Demo
- GitHub Pages: https://syalkhan20.github.io/Jammming/

---

## Purpose
Jammming is a React web app that allows users to search for songs, build a custom playlist, rename it, and export it.

The project was built to demonstrate:
- React component design and unidirectional data flow
- State management with hooks
- HTTP requests/responses with real APIs
- Authentication-ready integration (Spotify)
- Deployment to a live URL

---

## Technologies Used
- **React** (Vite)
- **JavaScript (ES6+)**
- **HTML5**
- **CSS Modules**
- **Fetch API** (HTTP requests / responses)
- **Git + GitHub** (version control + repo hosting)
- **GitHub Pages** (deployment)

---

## Features
- **Search tracks by song title**
- **Optional search by artist name**
- View track details including:
  - Title
  - Artist
  - Album
  - Artwork (when available)
  - Preview audio (when available)
- **Add tracks** to a custom playlist (duplicate prevention)
- **Remove tracks** from the playlist
- **Rename** the playlist
- **Export playlist**
  - If Spotify credentials are available: save playlist to the user’s Spotify account
  - If Spotify credentials are not available: export playlist as a downloadable JSON file

---

## API Integration (Spotify + Fallback)

### Spotify (implemented in code)
Spotify integration is implemented using the Spotify Web API (Implicit Grant Flow), including:
- Access token handling
- Track search (`/v1/search`)
- Create playlist (`/v1/users/{user_id}/playlists`)
- Add tracks to playlist (`/v1/playlists/{playlist_id}/tracks`)

**Current limitation:** Spotify’s developer dashboard may block creating new apps (e.g., “new integrations are currently on hold”). If you cannot obtain a Client ID, the app still works using the fallback API and exports playlists as JSON.

### Fallback API (works without keys)
When Spotify is unavailable, Jammming uses a public search endpoint (iTunes Search API) so searching remains fully functional without any API key.

---

## Prerequisites Covered (Project Requirements)
This project uses and demonstrates:
- **HTML**
- **CSS**
- **JavaScript**
- **React**
- **HTTP Requests and Responses**
- **Authentication** (Spotify token flow implemented and ready when credentials are available)

---

## Local Setup

### 1) Install dependencies
```bash
npm install
