/**
 * Keyless fallback search (no API keys required).
 * Uses the iTunes Search API to return track-like objects compatible with the app.
 *
 * This exists because Spotify app creation may be unavailable
 * (e.g., "new integrations are currently on hold").
 */
const MusicApi = {
  async search(term, artist = "") {
    const combined = `${term} ${artist}`.trim();
    const url = new URL("https://itunes.apple.com/search");
    url.searchParams.set("term", combined);
    url.searchParams.set("entity", "song");
    url.searchParams.set("limit", "25");

    const res = await fetch(url.toString());
    if (!res.ok) {
      throw new Error(`iTunes API error: ${res.status}`);
    }

    const data = await res.json();
    const results = Array.isArray(data.results) ? data.results : [];

    return results.map((item) => ({
      id: String(item.trackId),
      name: item.trackName || "Unknown Title",
      artist: item.artistName || "Unknown Artist",
      album: item.collectionName || "Unknown Album",
      // No Spotify URI available from iTunes; required for saving to Spotify.
      uri: null,
      previewUrl: item.previewUrl || null,
      artworkUrl: item.artworkUrl100 || null
    }));
  }
};

export default MusicApi;
