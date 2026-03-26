import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';
import { cn } from '../lib/utils';

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

// Updated with Top 10 Arctic Monkeys tracks
const STATIONS = [
  { id: 'bpOSxM0rNPM', name: 'Do I Wanna Know?', genre: 'Indie Rock' },
  { id: 'wqOnB_Yv_hA', name: 'I Wanna Be Yours', genre: 'Dream Pop' },
  { id: '6366dxFf-Os', name: '505', genre: 'Indie Rock' },
  { id: 'VQH8OH6YZpY', name: 'R U Mine?', genre: 'Hard Rock' },
  { id: 'peH6XnLAs-s', name: 'I Bet You Look Good On The Dancefloor', genre: 'Garage Rock' },
  { id: 'ma9I9uKVn80', name: 'Fluorescent Adolescent', genre: 'Indie Pop' },
  { id: '6u9I_Z-I_YI', name: 'Why\'d You Only Call Me When You\'re High?', genre: 'R&B / Rock' },
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
  const [isLoading, setIsLoading] = useState(false);
  
  const playerRef = useRef<any>(null);

  // Initialize YouTube API and player
  useEffect(() => {
    const loadYoutubeAPI = () => {
      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = () => {
          initPlayer();
        };
      } else if (window.YT && window.YT.Player) {
        initPlayer();
      } else {
        // YT script is loading but Player constructor not yet available
        const interval = setInterval(() => {
          if (window.YT && window.YT.Player) {
            initPlayer();
            clearInterval(interval);
          }
        }, 100);
        return () => clearInterval(interval);
      }
    };

    loadYoutubeAPI();

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, []);

  // Handle track changes
  useEffect(() => {
    if (isReady && playerRef.current) {
      setIsLoading(true);
      playerRef.current.loadVideoById(STATIONS[currentStation].id);
    }
  }, [currentStation, isReady]);

  const initPlayer = () => {
    if (playerRef.current) return;
    
    // Small delay to ensure DOM element is ready
    setTimeout(() => {
      if (playerRef.current) return;
      console.log('Initializing YouTube Player with station:', STATIONS[currentStation].name);

      playerRef.current = new window.YT.Player('youtube-player-element', {
        height: '1',
        width: '1',
        videoId: STATIONS[currentStation].id,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          modestbranding: 1,
          rel: 0,
          origin: window.location.origin || '*',
          enablejsapi: 1,
        },
        events: {
          onReady: (event: any) => {
            console.log('Player ready');
            setIsReady(true);
            event.target.setVolume(volume);
            setIsLoading(false);
          },
          onStateChange: (event: any) => {
            console.log('Player state:', event.data);
            
            switch (event.data) {
              case window.YT.PlayerState.PLAYING:
                setIsPlaying(true);
                setIsLoading(false);
                break;
              case window.YT.PlayerState.PAUSED:
                setIsPlaying(false);
                setIsLoading(false);
                break;
              case window.YT.PlayerState.ENDED:
                setIsPlaying(false);
                nextStation();
                break;
              case window.YT.PlayerState.BUFFERING:
                setIsLoading(true);
                break;
              case window.YT.PlayerState.CUED:
                setIsLoading(false);
                break;
              default:
                break;
            }
          },
          onError: (e: any) => {
            console.error('YouTube Player Error:', e.data);
            setIsLoading(false);
            // Auto-skip on common embedding errors
            if ([100, 101, 150].includes(e.data)) {
              nextStation();
            }
          }
        },
      });
    }, 100);
  };

  const togglePlay = () => {
    if (!isReady || isLoading) return;
    
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const nextStation = () => {
    if (!isReady) return;
    const next = (currentStation + 1) % STATIONS.length;
    setCurrentStation(next);
  };

  const prevStation = () => {
    if (!isReady) return;
    const prev = (currentStation - 1 + STATIONS.length) % STATIONS.length;
    setCurrentStation(prev);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (isReady && playerRef.current) {
      playerRef.current.setVolume(newVolume);
      if (newVolume > 0 && isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      }
    }
  };

  const toggleMute = () => {
    if (!isReady) return;
    
    if (isMuted) {
      playerRef.current.unMute();
      playerRef.current.setVolume(volume);
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  return (
    <div className="bg-zinc-950/90 backdrop-blur-2xl border border-zinc-800 rounded-3xl p-8 flex flex-col space-y-6 shadow-2xl overflow-hidden relative max-w-md mx-auto">
      {/* Hidden YouTube Player Element */}
      <div className="absolute opacity-0 pointer-events-none">
        <div id="youtube-player-element"></div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="w-20 h-20 bg-zinc-800 rounded-2xl flex items-center justify-center relative overflow-hidden">
          <Music className={cn(
            "w-10 h-10 transition-all duration-700", 
            isPlaying ? "text-red-500 scale-110 rotate-12" : "text-zinc-600",
            isLoading && "animate-pulse"
          )} />
          {isPlaying && !isLoading && (
             <div className="absolute bottom-2 flex items-end justify-center space-x-1 h-6 w-full">
               {[1, 2, 3, 4, 5].map(i => (
                 <div 
                   key={i} 
                   className="w-1 bg-red-500 animate-bounce" 
                   style={{ height: '60%', animationDelay: `${i * 0.15}s` }} 
                 />
               ))}
             </div>
          )}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white text-lg font-bold truncate">{STATIONS[currentStation].name}</h3>
          <p className="text-zinc-400 text-sm font-semibold uppercase tracking-tighter">Arctic Monkeys</p>
          <span className="text-zinc-600 text-[10px] uppercase font-bold bg-zinc-800 px-2 py-0.5 rounded mt-1 inline-block">
            {STATIONS[currentStation].genre}
          </span>
        </div>
      </div>

      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-center space-x-8">
          <button 
            onClick={prevStation} 
            disabled={!isReady || isLoading}
            className="text-zinc-400 hover:text-white transition-transform active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SkipBack className="w-8 h-8 fill-current" />
          </button>
          <button 
            onClick={togglePlay}
            disabled={!isReady || isLoading}
            className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 shadow-lg",
              isReady && !isLoading ? "bg-white text-black hover:bg-zinc-200" : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
            )}
          >
            {!isReady || isLoading ? (
              <div className="w-6 h-6 border-2 border-zinc-600 border-t-white rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-8 h-8 fill-current" />
            ) : (
              <Play className="w-8 h-8 fill-current ml-1" />
            )}
          </button>
          <button 
            onClick={nextStation} 
            disabled={!isReady || isLoading}
            className="text-zinc-400 hover:text-white transition-transform active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SkipForward className="w-8 h-8 fill-current" />
          </button>
        </div>

        <div className="flex items-center space-x-3 px-2">
          <button 
            onClick={toggleMute} 
            disabled={!isReady}
            className="text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
          >
            {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            disabled={!isReady}
            className="flex-1 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-500 disabled:opacity-50"
          />
          <span className="text-zinc-400 text-xs w-8">
            {isMuted ? 0 : volume}%
          </span>
        </div>
      </div>

      {/* Arctic Monkeys Aesthetic Gradient */}
      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-red-600/10 blur-[100px] rounded-full pointer-events-none" />
    </div>
  );
}