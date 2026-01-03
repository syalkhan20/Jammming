# Jammming (React + Music Search + Spotify Export)

## Purpose
Jammming is a React web app that lets users search for songs, build a custom playlist, rename it, and export it.  
When Spotify credentials are available, the playlist can be saved directly to the user’s Spotify account.

> Note: If Spotify app creation is unavailable (e.g., “new integrations are currently on hold”), the app still works fully using a public search API fallback and exports playlists as JSON.

---

## Technologies Used
- React (Vite)
- JavaScript (ES6+)
- HTML5
- CSS Modules
- HTTP Requests (Fetch API)
- Spotify Web API (Implicit Grant Flow) — optional
- iTunes Search API — keyless fallback search (no API key needed)

---

## Features
- Search songs by title
- Optional search refinement by artist
- View song details (title, artist, album)
- Add songs to a custom playlist (prevents duplicates)
- Remove songs from a playlist
- Rename playlist
- Save/export playlist:
  - Save to Spotify (when Spotify credentials are available)
  - Fallback export to JSON (when Spotify is unavailable)

---

## Future Work
- Add genre filtering and richer Spotify discovery endpoints
- Add pagination or infinite scrolling
- Add sorting (popularity, release date)
- Authorization Code Flow (more secure; typically requires a backend)
- Persist playlists (localStorage or a database)

---

## Local Setup
Install dependencies:
```bash
npm install
