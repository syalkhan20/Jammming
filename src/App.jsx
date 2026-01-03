import { useMemo, useState } from "react";
import styles from "./App.module.css";

import SearchBar from "./components/SearchBar/SearchBar.jsx";
import SearchResults from "./components/SearchResults/SearchResults.jsx";
import Playlist from "./components/Playlist/Playlist.jsx";

import Spotify from "./utils/Spotify.js";
import MusicApi from "./utils/musicApi.js";

const DEFAULT_PLAYLIST_NAME = "My Playlist";

export default function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [playlistName, setPlaylistName] = useState(DEFAULT_PLAYLIST_NAME);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [status, setStatus] = useState({ type: "info", message: "" });
  const [isWorking, setIsWorking] = useState(false);

  // Spotify readiness is build-time (env vars); memo avoids unnecessary checks.
  const spotifyReady = useMemo(() => Spotify.isConfigured(), []);

  async function handleSearch({ term, artist }) {
    if (!term.trim()) {
      setStatus({ type: "warning", message: "Please enter a song title to search." });
      return;
    }

    setIsWorking(true);
    setStatus({ type: "info", message: "Searching…" });

    try {
      let results = [];

      // Prefer Spotify if configured and token is available/obtainable.
      // Otherwise fallback to a keyless public API (iTunes Search).
      const canUseSpotify = spotifyReady && Spotify.hasOrCanGetAccessToken();

      if (canUseSpotify) {
        results = await Spotify.search(term, artist);
        setStatus({ type: "success", message: `Found ${results.length} result(s) via Spotify.` });
      } else {
        results = await MusicApi.search(term, artist);
        setStatus({
          type: "success",
          message:
            `Found ${results.length} result(s) via public search fallback (no API key required). ` +
            `To enable "Save to Spotify", add Spotify env vars when available.`
        });
      }

      setSearchResults(results);
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        message: "Search failed. Please try again. (Check console for details.)"
      });
    } finally {
      setIsWorking(false);
    }
  }

  function addTrack(track) {
    setPlaylistTracks((prev) => {
      const alreadyAdded = prev.some((t) => t.id === track.id);
      if (alreadyAdded) return prev;
      return [...prev, track];
    });
  }

  function removeTrack(track) {
    setPlaylistTracks((prev) => prev.filter((t) => t.id !== track.id));
  }

  function updatePlaylistName(name) {
    setPlaylistName(name);
  }

  async function savePlaylist() {
    if (!playlistTracks.length) {
      setStatus({ type: "warning", message: "Add at least one track before saving." });
      return;
    }

    setIsWorking(true);
    setStatus({ type: "info", message: "Saving playlist…" });

    try {
      // Spotify save requires Spotify URIs (only Spotify results contain these).
      const hasSpotifyUris = playlistTracks.every((t) => Boolean(t.uri));
      const canUseSpotify = spotifyReady && Spotify.hasOrCanGetAccessToken() && hasSpotifyUris;

      if (canUseSpotify) {
        const uris = playlistTracks.map((t) => t.uri);
        await Spotify.savePlaylist(playlistName, uris);

        setStatus({ type: "success", message: "Playlist saved to your Spotify account!" });

        // Reset playlist state after successful save (project requirement).
        setPlaylistName(DEFAULT_PLAYLIST_NAME);
        setPlaylistTracks([]);
        return;
      }

      // Fallback: export playlist locally as JSON when Spotify cannot be used.
      const exportPayload = {
        name: playlistName,
        createdAt: new Date().toISOString(),
        tracks: playlistTracks.map(({ id, name, artist, album, uri, previewUrl, artworkUrl }) => ({
          id,
          name,
          artist,
          album,
          uri: uri ?? null,
          previewUrl: previewUrl ?? null,
          artworkUrl: artworkUrl ?? null
        }))
      };

      const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${(playlistName || "playlist").replaceAll(" ", "_")}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      setStatus({
        type: "success",
        message:
          "Spotify save is unavailable (missing Spotify app credentials / URIs). " +
          "Your playlist has been exported as a JSON file instead."
      });
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        message: "Save failed. Please try again. (Check console for details.)"
      });
    } finally {
      setIsWorking(false);
    }
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          Jam<span className={styles.accent}>mm</span>ing
        </h1>

        <p className={styles.subtitle}>
          Search tracks, build a playlist, and export it. Spotify save is supported when credentials are available.
        </p>
      </header>

      <main className={styles.main}>
        <SearchBar onSearch={handleSearch} isWorking={isWorking} />

        <div className={styles.columns}>
          <section className={styles.panel}>
            <SearchResults tracks={searchResults} onAdd={addTrack} isWorking={isWorking} />
          </section>

          <section className={styles.panel}>
            <Playlist
              playlistName={playlistName}
              tracks={playlistTracks}
              onRemove={removeTrack}
              onNameChange={updatePlaylistName}
              onSave={savePlaylist}
              isWorking={isWorking}
              spotifyReady={spotifyReady}
            />
          </section>
        </div>

        {status.message ? (
          <div
            className={[
              styles.status,
              status.type === "success" ? styles.success : "",
              status.type === "warning" ? styles.warning : "",
              status.type === "error" ? styles.error : ""
            ].join(" ")}
            role="status"
            aria-live="polite"
          >
            {status.message}
          </div>
        ) : null}
      </main>

      <footer className={styles.footer}>
        <small>Built with React. Search uses Spotify when available; otherwise uses a public fallback API.</small>
      </footer>
    </div>
  );
}