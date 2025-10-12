const API_BASE = 'https://api.spotify.com/v1';


export interface Track {
  id: string;
  name: string;
  artists: string[];
  album: string;
  uri: string;
  external_url: string;
}

export interface NowPlaying {
  is_playing: boolean;
  progress_ms: number;
  item: Track | null;
}

export async function getTopTracks(accessToken: string, limit = 10, time_range = 'medium_term'): Promise<Track[]> {
  const token = accessToken;
  const url = `${API_BASE}/me/top/tracks?limit=${limit}&time_range=${time_range}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to fetch top tracks: ${response.status} ${text}`);
  }
  const json = await response.json();
  return json.items.map((item: any) => ({
    id: item.id,
    name: item.name,
    artists: item.artists.map((a: any) => a.name),
    album: item.album.name,
    uri: item.uri,
    external_url: item.external_urls.spotify,
  }));
}

export async function getNowPlaying(accessToken: string): Promise<NowPlaying> {
  const token = accessToken;
  const url = `${API_BASE}/me/player/currently-playing`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.status === 204) {
    return { is_playing: false, progress_ms: 0, item: null };
  }
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to fetch now playing: ${response.status} ${text}`);
  }
  const json = await response.json();
  const item = json.item;
  const track: Track | null = item
    ? {
        id: item.id,
        name: item.name,
        artists: item.artists.map((a: any) => a.name),
        album: item.album.name,
        uri: item.uri,
        external_url: item.external_urls.spotify,
      }
    : null;
  return { is_playing: json.is_playing, progress_ms: json.progress_ms, item: track };
}

export async function pausePlayback(accessToken: string): Promise<void> {
  const token = accessToken;
  const url = `${API_BASE}/me/player/pause`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok && response.status !== 204) {
    const text = await response.text();
    throw new Error(`Failed to pause playback: ${response.status} ${text}`);
  }
}

export async function playTrack(accessToken: string, uri: string): Promise<void> {
  const token = accessToken;
  const url = `${API_BASE}/me/player/play`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ uris: [uri] }),
  });
  if (!response.ok && response.status !== 204) {
    const text = await response.text();
    throw new Error(`Failed to play track ${uri}: ${response.status} ${text}`);
  }
}
