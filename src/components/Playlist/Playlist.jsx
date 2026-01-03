import styles from "./Playlist.module.css";
import TrackList from "../TrackList/TrackList.jsx";

export default function Playlist({
  playlistName,
  tracks,
  onRemove,
  onNameChange,
  onSave,
  isWorking,
  spotifyReady
}) {
  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h2 className={styles.title}>Playlist</h2>
          <span className={styles.badge}>{tracks.length}</span>
        </div>

        <label className={styles.label}>
          Playlist name
          <input
            className={styles.input}
            value={playlistName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Name your playlist…"
            aria-label="Playlist name"
          />
        </label>

        <button className={styles.saveButton} onClick={onSave} disabled={isWorking}>
          {isWorking ? "Working…" : "Save To Spotify"}
        </button>

        <p className={styles.note}>
          {spotifyReady
            ? "If you complete Spotify setup, this will save directly to your account."
            : "Spotify setup not detected. Saving will export a JSON file instead (until Spotify credentials are available)."}
        </p>
      </div>

      <TrackList
        tracks={tracks}
        onAction={onRemove}
        actionLabel="–"
        actionAriaLabel="Remove track"
        emptyMessage="Your playlist is empty. Add tracks from results."
      />
    </div>
  );
}
