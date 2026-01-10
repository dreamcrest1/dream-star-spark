import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, VolumeX, Volume1, 
  Play, Pause, SkipBack, SkipForward, 
  X, Music, Shuffle, Repeat, 
  ChevronDown, Heart
} from 'lucide-react';
import { Howl } from 'howler';

// Curated playlist with royalty-free tracks that match the indie/dreamy vibe
// These are placeholder URLs - in production, use actual audio file URLs
const playlist = [
  {
    id: 1,
    title: "Dreamy Sunset",
    artist: "Indie Vibes",
    duration: 180,
    // Using existing audio as fallback
    src: "/audio/background-music.mp3",
    cover: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=100&h=100&fit=crop"
  },
  {
    id: 2,
    title: "Midnight Drive",
    artist: "Lo-Fi Dreams",
    duration: 210,
    src: "/audio/background-music.mp3",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop"
  },
  {
    id: 3,
    title: "Neon Lights",
    artist: "Synth Wave",
    duration: 195,
    src: "/audio/background-music.mp3",
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&h=100&fit=crop"
  },
  {
    id: 4,
    title: "Ocean Breeze",
    artist: "Chill Beats",
    duration: 165,
    src: "/audio/background-music.mp3",
    cover: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100&h=100&fit=crop"
  },
  {
    id: 5,
    title: "City Nights",
    artist: "Urban Sounds",
    duration: 200,
    src: "/audio/background-music.mp3",
    cover: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=100&h=100&fit=crop"
  },
  {
    id: 6,
    title: "Golden Hour",
    artist: "Ambient Flow",
    duration: 185,
    src: "/audio/background-music.mp3",
    cover: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=100&h=100&fit=crop"
  }
];

const MusicToggle = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'all' | 'one'>('none');
  const [likedTracks, setLikedTracks] = useState<number[]>([]);
  const [showPlaylist, setShowPlaylist] = useState(false);
  
  const soundRef = useRef<Howl | null>(null);
  const progressInterval = useRef<NodeJS.Timeout>();
  const previousVolume = useRef(volume);

  const currentTrack = playlist[currentTrackIndex];

  // Load track
  const loadTrack = useCallback((index: number) => {
    if (soundRef.current) {
      soundRef.current.unload();
    }

    const track = playlist[index];
    soundRef.current = new Howl({
      src: [track.src],
      html5: true,
      volume: isMuted ? 0 : volume,
      onload: () => {
        setIsLoaded(true);
        setDuration(soundRef.current?.duration() || track.duration);
      },
      onend: () => {
        handleNext();
      },
      onloaderror: (_, error) => {
        console.log('Track failed to load:', error);
      },
    });
  }, [volume, isMuted]);

  useEffect(() => {
    loadTrack(currentTrackIndex);
    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  // Update progress
  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        if (soundRef.current) {
          const seek = soundRef.current.seek() as number;
          const dur = soundRef.current.duration();
          setProgress((seek / dur) * 100);
        }
      }, 200);
    } else {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isPlaying]);

  const togglePlay = useCallback(() => {
    if (!soundRef.current || !isLoaded) return;

    if (isPlaying) {
      soundRef.current.pause();
    } else {
      soundRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, isLoaded]);

  const handleNext = useCallback(() => {
    let nextIndex: number;
    
    if (repeatMode === 'one') {
      nextIndex = currentTrackIndex;
    } else if (isShuffled) {
      nextIndex = Math.floor(Math.random() * playlist.length);
    } else {
      nextIndex = (currentTrackIndex + 1) % playlist.length;
    }
    
    if (nextIndex === currentTrackIndex && repeatMode !== 'one') {
      if (repeatMode === 'none' && nextIndex === 0) {
        setIsPlaying(false);
        return;
      }
    }

    setCurrentTrackIndex(nextIndex);
    loadTrack(nextIndex);
    setProgress(0);
    
    setTimeout(() => {
      if (soundRef.current && isPlaying) {
        soundRef.current.play();
      }
    }, 100);
  }, [currentTrackIndex, isShuffled, repeatMode, loadTrack, isPlaying]);

  const handlePrevious = useCallback(() => {
    const currentSeek = soundRef.current?.seek() as number || 0;
    
    if (currentSeek > 3) {
      soundRef.current?.seek(0);
      setProgress(0);
      return;
    }

    const prevIndex = currentTrackIndex === 0 ? playlist.length - 1 : currentTrackIndex - 1;
    setCurrentTrackIndex(prevIndex);
    loadTrack(prevIndex);
    setProgress(0);
    
    setTimeout(() => {
      if (soundRef.current && isPlaying) {
        soundRef.current.play();
      }
    }, 100);
  }, [currentTrackIndex, loadTrack, isPlaying]);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if (soundRef.current) {
      soundRef.current.volume(newVolume);
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (isMuted) {
      setVolume(previousVolume.current);
      soundRef.current?.volume(previousVolume.current);
    } else {
      previousVolume.current = volume;
      setVolume(0);
      soundRef.current?.volume(0);
    }
    setIsMuted(!isMuted);
  }, [isMuted, volume]);

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!soundRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const seekTime = percentage * duration;
    soundRef.current.seek(seekTime);
    setProgress(percentage * 100);
  }, [duration]);

  const toggleLike = useCallback((trackId: number) => {
    setLikedTracks(prev => 
      prev.includes(trackId) 
        ? prev.filter(id => id !== trackId)
        : [...prev, trackId]
    );
  }, []);

  const playTrack = useCallback((index: number) => {
    setCurrentTrackIndex(index);
    loadTrack(index);
    setProgress(0);
    setIsPlaying(true);
    
    setTimeout(() => {
      soundRef.current?.play();
    }, 100);
  }, [loadTrack]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <>
      {/* Main Music Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-50 p-3 rounded-full glass-card border border-neon-purple/40 hover:border-neon-purple transition-all group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
        title="Open Music Player"
      >
        <Music className="w-5 h-5 text-neon-purple" />
        
        {/* Playing Indicator */}
        {isPlaying && (
          <>
            <div className="absolute -top-1 -right-1 flex gap-0.5">
              {[0.1, 0.2, 0.15].map((delay, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-neon-purple rounded-full"
                  animate={{ height: [4, 10, 4] }}
                  transition={{ duration: 0.4, repeat: Infinity, delay }}
                />
              ))}
            </div>
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-neon-purple/50"
              animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </>
        )}
      </motion.button>

      {/* Music Player Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-20 right-4 z-50 w-80 rounded-2xl overflow-hidden shadow-2xl"
            style={{
              background: 'linear-gradient(145deg, rgba(139, 92, 246, 0.15) 0%, rgba(15, 15, 20, 0.98) 50%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
            }}
          >
            {/* Header */}
            <div className="relative p-4 pb-2">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-muted/50 hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
              
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Now Playing</span>
              </div>
            </div>

            {/* Album Art & Track Info */}
            <div className="px-4 pb-4">
              <div className="flex items-center gap-4">
                <motion.div 
                  className="relative w-20 h-20 rounded-xl overflow-hidden shadow-lg flex-shrink-0"
                  animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
                >
                  <img 
                    src={currentTrack.cover} 
                    alt={currentTrack.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </motion.div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-foreground truncate">
                    {currentTrack.title}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">{currentTrack.artist}</p>
                  
                  <button 
                    onClick={() => toggleLike(currentTrack.id)}
                    className="mt-2 p-1.5 rounded-full hover:bg-muted/50 transition-colors"
                  >
                    <Heart 
                      className={`w-4 h-4 transition-colors ${
                        likedTracks.includes(currentTrack.id) 
                          ? 'text-neon-pink fill-neon-pink' 
                          : 'text-muted-foreground hover:text-neon-pink'
                      }`} 
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="px-4 pb-2">
              <div 
                className="h-1.5 bg-muted rounded-full cursor-pointer overflow-hidden group"
                onClick={handleProgressClick}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-neon-purple via-neon-pink to-neon-cyan rounded-full relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
                <span>{formatTime((progress / 100) * duration)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Main Controls */}
            <div className="px-4 py-3 flex items-center justify-center gap-4">
              <motion.button
                onClick={() => setIsShuffled(!isShuffled)}
                className={`p-2 rounded-full transition-colors ${isShuffled ? 'text-neon-cyan' : 'text-muted-foreground hover:text-foreground'}`}
                whileTap={{ scale: 0.9 }}
              >
                <Shuffle className="w-4 h-4" />
              </motion.button>

              <motion.button
                onClick={handlePrevious}
                className="p-2 rounded-full text-foreground hover:text-neon-purple transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <SkipBack className="w-5 h-5" />
              </motion.button>

              <motion.button
                onClick={togglePlay}
                disabled={!isLoaded}
                className="p-4 rounded-full bg-gradient-to-r from-neon-purple to-neon-pink shadow-lg disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-white" />
                ) : (
                  <Play className="w-6 h-6 text-white ml-0.5" />
                )}
              </motion.button>

              <motion.button
                onClick={handleNext}
                className="p-2 rounded-full text-foreground hover:text-neon-purple transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <SkipForward className="w-5 h-5" />
              </motion.button>

              <motion.button
                onClick={() => setRepeatMode(prev => prev === 'none' ? 'all' : prev === 'all' ? 'one' : 'none')}
                className={`p-2 rounded-full transition-colors relative ${repeatMode !== 'none' ? 'text-neon-cyan' : 'text-muted-foreground hover:text-foreground'}`}
                whileTap={{ scale: 0.9 }}
              >
                <Repeat className="w-4 h-4" />
                {repeatMode === 'one' && (
                  <span className="absolute -top-0.5 -right-0.5 text-[8px] font-bold text-neon-cyan">1</span>
                )}
              </motion.button>
            </div>

            {/* Volume Control */}
            <div className="px-4 pb-3 flex items-center gap-3">
              <motion.button 
                onClick={toggleMute}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                whileTap={{ scale: 0.9 }}
              >
                <VolumeIcon className="w-4 h-4" />
              </motion.button>
              <div className="flex-1 relative">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full h-1.5 appearance-none bg-muted rounded-full cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 
                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-neon-purple 
                    [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform"
                  style={{
                    background: `linear-gradient(to right, rgb(139, 92, 246) 0%, rgb(139, 92, 246) ${volume * 100}%, rgb(63, 63, 70) ${volume * 100}%, rgb(63, 63, 70) 100%)`
                  }}
                />
              </div>
              <span className="text-xs text-muted-foreground w-8 text-right">{Math.round(volume * 100)}%</span>
            </div>

            {/* Playlist Toggle */}
            <motion.button
              onClick={() => setShowPlaylist(!showPlaylist)}
              className="w-full py-2 flex items-center justify-center gap-2 border-t border-muted/30 hover:bg-muted/20 transition-colors"
            >
              <span className="text-xs text-muted-foreground">
                {showPlaylist ? 'Hide Playlist' : 'Show Playlist'}
              </span>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showPlaylist ? 'rotate-180' : ''}`} />
            </motion.button>

            {/* Playlist */}
            <AnimatePresence>
              {showPlaylist && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="max-h-48 overflow-y-auto border-t border-muted/30">
                    {playlist.map((track, index) => (
                      <motion.button
                        key={track.id}
                        onClick={() => playTrack(index)}
                        className={`w-full flex items-center gap-3 p-3 hover:bg-muted/30 transition-colors ${
                          index === currentTrackIndex ? 'bg-neon-purple/10' : ''
                        }`}
                        whileHover={{ x: 4 }}
                      >
                        <img 
                          src={track.cover} 
                          alt={track.title}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0 text-left">
                          <p className={`text-sm truncate ${index === currentTrackIndex ? 'text-neon-purple font-medium' : 'text-foreground'}`}>
                            {track.title}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                        </div>
                        {index === currentTrackIndex && isPlaying && (
                          <div className="flex gap-0.5">
                            {[0, 0.1, 0.2].map((delay, i) => (
                              <motion.div
                                key={i}
                                className="w-0.5 bg-neon-purple rounded-full"
                                animate={{ height: [3, 8, 3] }}
                                transition={{ duration: 0.4, repeat: Infinity, delay }}
                              />
                            ))}
                          </div>
                        )}
                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleLike(track.id); }}
                          className="p-1"
                        >
                          <Heart 
                            className={`w-3.5 h-3.5 ${
                              likedTracks.includes(track.id) 
                                ? 'text-neon-pink fill-neon-pink' 
                                : 'text-muted-foreground'
                            }`} 
                          />
                        </button>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MusicToggle;
