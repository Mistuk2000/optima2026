import React, { useState, useRef } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';
import { cn } from '../lib/utils';

const STATIONS = [
  { id: 'bpOSxM0rNPM', name: 'Do I Wanna Know?', genre: 'Indie Rock' },
  { id: 'wqOnB_Yv_hA', name: 'I Wanna Be Yours', genre: 'Dream Pop' },
  { id: '6366dxFf-Os', name: '505', genre: 'Indie Rock' },
  { id: 'VQH8OH6YZpY', name: 'R U Mine?', genre: 'Hard Rock' },
  { id: 'peH6XnLAs-s', name: 'I Bet You Look Good On The Dancefloor', genre: 'Garage Rock' },
  { id: 'ma9I9uKVn80', name: 'Fluorescent Adolescent', genre: 'Indie Pop' },
  { id: '6u9I_Z-I_YI', name: "Why'd You Only Call Me When You're High?", genre: 'R&B / Rock' },
  { id: '00Sndv0oB2c', name: 'Crying Lightning', genre: 'Post-Punk' },
  { id: 'M67f6S8S-C8', name: 'Arabella', genre: 'Psychedelic Rock' },
  { id: 'uN7S69_T_y8', name: 'When The Sun Goes Down', genre: 'Garage Rock' },
];

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStation, setCurrentStation] = useState(0);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const playerRef = useRef<any>(null);

  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    playerRef.current = event.target;
    setIsReady(true);
    setIsLoading(false);
    event.target.setVolume(volume);
  };

  const onPlayerStateChange: YouTubeProps['onStateChange'] = (event) => {
    const state = event.data;
    // YT.PlayerState.PLAYING = 1
    if (state === 1) {
      setIsPlaying(true);
      setIsLoading(false);
    } 
    // YT.PlayerState.PAUSED = 2
    else if (state === 2) {
      setIsPlaying(false);
    } 
    // YT.PlayerState.BUFFERING = 3
    else if (state === 3) {
      setIsLoading(true);
    } 
    // YT.PlayerState.ENDED = 0
    else if (state === 0) {
      nextStation();
    }
  };

  const onPlayerError: YouTubeProps['onError'] = () => {
    setIsLoading(false);
    nextStation();
  };

  const togglePlay = () => {
    if (!isReady || !playerRef.current) return;

    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      // Unmute and play to handle browser autoplay restrictions
      playerRef.current.unMute();
      playerRef.current.playVideo();
    }
  };

  const nextStation = () => {
    setCurrentStation((prev) => (prev + 1) % STATIONS.length);
  };

  const prevStation = () => {
    setCurrentStation((prev) => (prev - 1 + STATIONS.length) % STATIONS.length);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (playerRef.current) {
      playerRef.current.setVolume(newVolume);
      if (newVolume > 0 && isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      }
    }
  };

  const toggleMute = () => {
    if (!isReady || !playerRef.current) return;
    if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  const opts: YouTubeProps['opts'] = {
    height: '1',
    width: '1',
    playerVars: {
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      rel: 0,
      modestbranding: 1,
      origin: window.location.origin,
    },
  };

  return (
    <div className="bg-zinc-950/90 backdrop-blur-2xl border border-zinc-800 rounded-3xl p-8 flex flex-col space-y-6 shadow-2xl overflow-hidden relative max-w-md mx-auto">
      {/* Hidden YouTube Player */}
      <div className="fixed -top-[999px] -left-[999px] opacity-0 pointer-events-none">
        <YouTube
          videoId={STATIONS[currentStation].id}
          opts={opts}
          onReady={onPlayerReady}
          onStateChange={onPlayerStateChange}
          onError={onPlayerError}
        />
      </div>

      <div className="flex items-center space-x-4">
        <div className="w-20 h-20 bg-zinc-800 rounded-2xl flex items-center justify-center relative overflow-hidden">
          <Music
            className={cn(
              'w-10 h-10 transition-all duration-700',
              isPlaying ? 'text-red-500 scale-110 rotate-12' : 'text-zinc-600',
              isLoading && 'animate-pulse'
            )}
          />
          {isPlaying && !isLoading && (
            <div className="absolute bottom-2 flex items-end justify-center space-x-1 h-6 w-full">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-1 bg-red-500 animate-bounce"
                  style={{ height: '60%', animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white text-lg font-bold truncate">{STATIONS[currentStation].name}</h3>
          <p className="text-zinc-400 text-sm font-semibold uppercase tracking-tighter">
            Arctic Monkeys
          </p>
          <span className="text-zinc-600 text-[10px] uppercase font-bold bg-zinc-800 px-2 py-0.5 rounded mt-1 inline-block">
            {STATIONS[currentStation].genre}
          </span>
        </div>
      </div>

      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-center space-x-8">
          <button
            onClick={prevStation}
            className="text-zinc-400 hover:text-white transition-transform active:scale-90"
          >
            <SkipBack className="w-8 h-8 fill-current" />
          </button>
          <button
            onClick={togglePlay}
            disabled={!isReady}
            className={cn(
              'w-16 h-16 rounded-full flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 shadow-lg',
              isReady ? 'bg-white text-black hover:bg-zinc-200' : 'bg-zinc-800 text-zinc-600'
            )}
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-zinc-600 border-t-black rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-8 h-8 fill-current" />
            ) : (
              <Play className="w-8 h-8 fill-current ml-1" />
            )}
          </button>
          <button
            onClick={nextStation}
            className="text-zinc-400 hover:text-white transition-transform active:scale-90"
          >
            <SkipForward className="w-8 h-8 fill-current" />
          </button>
        </div>

        <div className="flex items-center space-x-3 px-2">
          <button onClick={toggleMute} disabled={!isReady} className="text-zinc-400 hover:text-white">
            {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="flex-1 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-500"
          />
        </div>
      </div>
      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-red-600/10 blur-[100px] rounded-full pointer-events-none" />
    </div>
  );
}
