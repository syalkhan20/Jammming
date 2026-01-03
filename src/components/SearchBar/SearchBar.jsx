import { useState } from "react";
import styles from "./SearchBar.module.css";

export default function SearchBar({ onSearch, isWorking }) {
  const [term, setTerm] = useState("");
  const [artist, setArtist] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onSearch({ term, artist });
  }

  return (
    <form className={styles.searchBar} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <input
          className={styles.input}
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Search by song title…"
          aria-label="Song title"
        />

        <input
          className={styles.input}
          type="text"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          placeholder="Optional: artist name…"
          aria-label="Artist name"
        />

        <button className={styles.button} type="submit" disabled={isWorking}>
          {isWorking ? "Searching…" : "Search"}
        </button>
      </div>

      <p className={styles.hint}>
        Tip: If Spotify credentials aren’t available, the app automatically uses a public search fallback.
      </p>
    </form>
  );
}
