import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getTopTracks, getNowPlaying, pausePlayback, playTrack } from '@/lib/spotify';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = session.user.accessToken;
    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    const trackId = url.searchParams.get('trackId');

    if (action === 'stop') {
      await pausePlayback(token);
    } else if (action === 'play') {
      if (!trackId) {
        return NextResponse.json({ error: 'trackId is required for action=play' }, { status: 400 });
      }
      const uri = `spotify:track:${trackId}`;
      await playTrack(token, uri);
    }

    const [topTracks, nowPlaying] = await Promise.all([
      getTopTracks(token, 10),
      getNowPlaying(token),
    ]);
    return NextResponse.json({ topTracks, nowPlaying });
  } catch (error: any) {
    console.error('Spotify API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
