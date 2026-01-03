import styles from "./Track.module.css";

export default function Track({ track, onAction, actionLabel, actionAriaLabel }) {
  return (
    <div className={styles.track}>
      {track.artworkUrl ? (
        <img
          className={styles.artwork}
          src={track.artworkUrl}
          alt={`${track.name} artwork`}
          loading="lazy"
        />
      ) : (
        <div className={styles.artworkFallback} aria-hidden="true" />
      )}

      <div className={styles.meta}>
        <div className={styles.topRow}>
          <div className={styles.titleBlock}>
            <div className={styles.name} title={track.name}>{track.name}</div>
            <div className={styles.sub}>
              <span className={styles.artist} title={track.artist}>{track.artist}</span>
              <span className={styles.dot}>•</span>
              <span className={styles.album} title={track.album}>{track.album}</span>
            </div>
          </div>

          <button
            className={styles.action}
            type="button"
            onClick={onAction}
            aria-label={actionAriaLabel}
            title={actionAriaLabel}
          >
            {actionLabel}
          </button>
        </div>

        {track.previewUrl ? (
          <audio className={styles.audio} controls preload="none">
            <source src={track.previewUrl} />
            Your browser does not support the audio element.
          </audio>
        ) : (
          <div className={styles.previewNote}>Preview unavailable for this track.</div>
        )}
      </div>
    </div>
  );
}
