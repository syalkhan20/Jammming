/**
 * Spotify Web API utility (Implicit Grant Flow).
 *
 * Requires:
 * - VITE_SPOTIFY_CLIENT_ID
 * - VITE_SPOTIFY_REDIRECT_URI
 *
 * If Spotify app creation is blocked, the app still functions via a fallback API
 * and exports playlists as JSON until Spotify becomes available.
 */

const SPOTIFY_AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const SPOTIFY_API_BASE = "https://api.spotify.com/v1";
const SCOPES = ["playlist-modify-public", "playlist-modify-private"];

let accessToken = "";
let tokenExpiryMs = 0;

const Spotify = {
  isConfigured() {
    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
    return Boolean(clientId && redirectUri);
  },

  hasOrCanGetAccessToken() {
    if (accessToken && Date.now() < tokenExpiryMs) return true;

    const hash = window.location.hash.startsWith("#") ? window.location.hash.substring(1) : "";
    const params = new URLSearchParams(hash);

    const tokenFromUrl = params.get("access_token");
    const expiresIn = params.get("expires_in");

    if (tokenFromUrl && expiresIn) {
      accessToken = tokenFromUrl;
      tokenExpiryMs = Date.now() + Number(expiresIn) * 1000;

      // Remove token from URL after parsing
      window.history.replaceState({}, document.title, window.location.pathname + window.location.search);

      return true;
    }

    // If configured, we can obtain a token via redirect when needed.
    return this.isConfigured();
  },

  redirectToAuth() {
    if (!this.isConfigured()) {
      throw new Error("Spotify is not configured. Add VITE_SPOTIFY_CLIENT_ID and VITE_SPOTIFY_REDIRECT_URI.");
    }

    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

    const authUrl = new URL(SPOTIFY_AUTH_ENDPOINT);
    authUrl.searchParams.set("client_id", clientId);
    authUrl.searchParams.set("response_type", "token");
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("scope", SCOPES.join(" "));
    authUrl.searchParams.set("show_dialog", "true");

    window.location.assign(authUrl.toString());
  },

  async getAccessToken() {
    if (accessToken && Date.now() < tokenExpiryMs) return accessToken;

    if (this.hasOrCanGetAccessToken() && accessToken) return accessToken;

    if (this.isConfigured()) {
      this.redirectToAuth();
    }

    throw new Error("Spotify token unavailable.");
  },

  async spotifyFetch(path, options = {}) {
    const token = await this.getAccessToken();

    const res = await fetch(`${SPOTIFY_API_BASE}${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    });

    if (res.status === 401) {
      accessToken = "";
      tokenExpiryMs = 0;
      this.redirectToAuth();
      throw new Error("Spotify authorization required (401).");
    }

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Spotify API error ${res.status}: ${text}`);
    }

    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) return res.json();
    return null;
  },

  async search(term, artist = "") {
    const query = artist ? `${term} artist:${artist}` : term;

    const url = new URL(`${SPOTIFY_API_BASE}/search`);
    url.searchParams.set("type", "track");
    url.searchParams.set("q", query);
    url.searchParams.set("limit", "25");

    const token = await this.getAccessToken();
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.status === 401) {
      accessToken = "";
      tokenExpiryMs = 0;
      this.redirectToAuth();
      throw new Error("Spotify authorization required (401).");
    }

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Spotify search failed ${res.status}: ${text}`);
    }

    const data = await res.json();
    const items = data?.tracks?.items || [];

    return items.map((t) => ({
      id: t.id,
      name: t.name,
      artist: t.artists?.map((a) => a.name).join(", ") || "Unknown Artist",
      album: t.album?.name || "Unknown Album",
      uri: t.uri,
      previewUrl: t.preview_url || null,
      artworkUrl: t.album?.images?.[2]?.url || t.album?.images?.[1]?.url || t.album?.images?.[0]?.url || null
    }));
  },

  async savePlaylist(playlistName, trackUris) {
    if (!playlistName.trim()) throw new Error("Playlist name is required.");
    if (!Array.isArray(trackUris) || trackUris.length === 0) {
      throw new Error("At least one track URI is required.");
    }

    const me = await this.spotifyFetch("/me");
    const userId = me?.id;
    if (!userId) throw new Error("Unable to read Spotify user profile (/me).");

    const created = await this.spotifyFetch(`/users/${encodeURIComponent(userId)}/playlists`, {
      method: "POST",
      body: JSON.stringify({
        name: playlistName,
        description: "Created with Jammming",
        public: false
      })
    });

    const playlistId = created?.id;
    if (!playlistId) throw new Error("Playlist creation failed (no playlist id returned).");

    await this.spotifyFetch(`/playlists/${encodeURIComponent(playlistId)}/tracks`, {
      method: "POST",
      body: JSON.stringify({ uris: trackUris })
    });

    return true;
  }
};

export default Spotify;
