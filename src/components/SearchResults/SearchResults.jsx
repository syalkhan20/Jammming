import styles from "./SearchResults.module.css";
import TrackList from "../TrackList/TrackList.jsx";

export default function SearchResults({ tracks, onAdd, isWorking }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <h2 className={styles.title}>Search Results</h2>
        <span className={styles.badge}>{tracks.length}</span>
      </div>

      <TrackList
        tracks={tracks}
        onAction={onAdd}
        actionLabel="+"
        actionAriaLabel="Add track"
        emptyMessage={isWorking ? "Searching…" : "No results yet. Try a search."}
      />
    </div>
  );
}
