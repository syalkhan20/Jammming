import styles from "./TrackList.module.css";
import Track from "../Track/Track.jsx";

export default function TrackList({
  tracks,
  onAction,
  actionLabel,
  actionAriaLabel,
  emptyMessage
}) {
  if (!tracks.length) {
    return <div className={styles.empty}>{emptyMessage}</div>;
  }

  return (
    <ul className={styles.list}>
      {tracks.map((track) => (
        <li key={track.id} className={styles.item}>
          <Track
            track={track}
            onAction={() => onAction(track)}
            actionLabel={actionLabel}
            actionAriaLabel={actionAriaLabel}
          />
        </li>
      ))}
    </ul>
  );
}
