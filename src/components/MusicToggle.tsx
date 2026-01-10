import { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, VolumeX, Volume1, 
  Play, Pause, SkipBack, SkipForward, 
  X, Music, Shuffle, Repeat, 
  ChevronDown, Heart, Radio, Sparkles, Waves, Circle, Box
} from 'lucide-react';
import { Howl, Howler } from 'howler';

// Lazy load 3D visualizer for performance
const Visualizer3D = lazy(() => import('./Visualizer3D'));

// Curated playlist - Track 1 uses your uploaded file
// Add more MP3 files to public/audio/ for variety
const playlist = [
  {
    id: 1,
    title: "Your Track",
    artist: "Uploaded Music",
    duration: 180,
    src: "/audio/background-music.mp3",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop"
  },
  {
    id: 2,
    title: "Chill Vibes",
    artist: "Royalty Free",
    duration: 120,
    // Pixabay royalty-free tracks
    src: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop"
  },
  {
    id: 3,
    title: "Lofi Study",
    artist: "Ambient Beats",
    duration: 150,
    src: "https://cdn.pixabay.com/download/audio/2022/10/25/audio_946b0939c8.mp3",
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&h=100&fit=crop"
  },
  {
    id: 4,
    title: "Dreamy Night",
    artist: "Chill Beats",
    duration: 165,
    src: "https://cdn.pixabay.com/download/audio/2023/09/05/audio_168a3e0caa.mp3",
    cover: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100&h=100&fit=crop"
  },
  {
    id: 5,
    title: "Electronic Flow",
    artist: "Synth Wave",
    duration: 140,
    src: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_8cb749d484.mp3",
    cover: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=100&h=100&fit=crop"
  },
  {
    id: 6,
    title: "Peaceful Morning",
    artist: "Nature Sounds",
    duration: 185,
    src: "https://cdn.pixabay.com/download/audio/2022/08/02/audio_884fe92c21.mp3",
    cover: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=100&h=100&fit=crop"
  }
];

// Audio Visualizer Component
const AudioVisualizer = ({ analyserRef, isPlaying }: { analyserRef: React.RefObject<AnalyserNode | null>, isPlaying: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [bars, setBars] = useState<number[]>(Array(32).fill(5));

  useEffect(() => {
    if (!isPlaying || !analyserRef.current) {
      // Gentle idle animation
      const idleAnimation = () => {
        setBars(prev => prev.map((_, i) => {
          const base = 5 + Math.sin(Date.now() / 500 + i * 0.3) * 3;
          return Math.max(3, base);
        }));
        animationRef.current = requestAnimationFrame(idleAnimation);
      };
      animationRef.current = requestAnimationFrame(idleAnimation);
      return () => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
      };
    }

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      analyser.getByteFrequencyData(dataArray);
      
      // Sample 32 bars from the frequency data
      const newBars: number[] = [];
      const step = Math.floor(bufferLength / 32);
      
      for (let i = 0; i < 32; i++) {
        const start = i * step;
        let sum = 0;
        for (let j = start; j < start + step; j++) {
          sum += dataArray[j] || 0;
        }
        const average = sum / step;
        const height = Math.max(3, (average / 255) * 60);
        newBars.push(height);
      }
      
      setBars(newBars);
      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, analyserRef]);

  return (
    <div className="flex items-end justify-center gap-[2px] h-16 px-2">
      {bars.map((height, i) => (
        <motion.div
          key={i}
          className="w-1.5 rounded-full"
          style={{
            height: `${height}px`,
            background: `linear-gradient(to top, 
              hsl(${280 + i * 3}, 80%, 60%), 
              hsl(${320 + i * 2}, 70%, 50%)
            )`,
            boxShadow: isPlaying ? `0 0 ${height / 4}px hsl(${280 + i * 3}, 80%, 60%)` : 'none',
          }}
          animate={{ height: `${height}px` }}
          transition={{ duration: 0.05, ease: "easeOut" }}
        />
      ))}
    </div>
  );
};

// Circular Visualizer
const CircularVisualizer = ({ analyserRef, isPlaying }: { analyserRef: React.RefObject<AnalyserNode | null>, isPlaying: boolean }) => {
  const [points, setPoints] = useState<number[]>(Array(24).fill(30));

  useEffect(() => {
    let animationRef: number;

    if (!isPlaying || !analyserRef.current) {
      const idleAnimation = () => {
        setPoints(prev => prev.map((_, i) => {
          return 30 + Math.sin(Date.now() / 800 + i * 0.5) * 5;
        }));
        animationRef = requestAnimationFrame(idleAnimation);
      };
      animationRef = requestAnimationFrame(idleAnimation);
      return () => cancelAnimationFrame(animationRef);
    }

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      analyser.getByteFrequencyData(dataArray);
      
      const newPoints: number[] = [];
      const step = Math.floor(bufferLength / 24);
      
      for (let i = 0; i < 24; i++) {
        const start = i * step;
        let sum = 0;
        for (let j = start; j < start + step; j++) {
          sum += dataArray[j] || 0;
        }
        const average = sum / step;
        const radius = 30 + (average / 255) * 25;
        newPoints.push(radius);
      }
      
      setPoints(newPoints);
      animationRef = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationRef);
  }, [isPlaying, analyserRef]);

  const createPath = () => {
    const centerX = 40;
    const centerY = 40;
    
    let path = '';
    points.forEach((radius, i) => {
      const angle = (i / points.length) * Math.PI * 2 - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      if (i === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    });
    path += ' Z';
    
    return path;
  };

  return (
    <svg width="80" height="80" className="absolute inset-0">
      <defs>
        <linearGradient id="visualizerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(280, 80%, 60%)" />
          <stop offset="50%" stopColor="hsl(320, 70%, 50%)" />
          <stop offset="100%" stopColor="hsl(200, 80%, 60%)" />
        </linearGradient>
      </defs>
      <motion.path
        d={createPath()}
        fill="none"
        stroke="url(#visualizerGradient)"
        strokeWidth="2"
        style={{
          filter: isPlaying ? 'drop-shadow(0 0 8px hsl(280, 80%, 60%))' : 'none',
        }}
      />
    </svg>
  );
};

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
  const [visualizerMode, setVisualizerMode] = useState<'bars' | 'circular' | 'waveform3d' | 'particles' | 'kaleidoscope' | 'rings'>('bars');
  
  const soundRef = useRef<Howl | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const progressInterval = useRef<NodeJS.Timeout>();
  const previousVolume = useRef(volume);

  const currentTrack = playlist[currentTrackIndex];

  // Setup Web Audio API analyser
  const setupAnalyser = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        // @ts-ignore - Howler exposes ctx
        audioContextRef.current = Howler.ctx;
      }
      
      if (audioContextRef.current && !analyserRef.current) {
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        analyserRef.current.smoothingTimeConstant = 0.8;
        
        // @ts-ignore - Howler exposes masterGain
        if (Howler.masterGain) {
          // @ts-ignore
          Howler.masterGain.connect(analyserRef.current);
          analyserRef.current.connect(audioContextRef.current.destination);
        }
      }
    } catch (e) {
      console.log('Audio analyser setup failed:', e);
    }
  }, []);

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
        setupAnalyser();
      },
      onplay: () => {
        setupAnalyser();
      },
      onend: () => {
        handleNext();
      },
      onloaderror: (_, error) => {
        console.log('Track failed to load:', error);
        // Try next track if loading fails
        if (index < playlist.length - 1) {
          setTimeout(() => loadTrack(index + 1), 500);
        }
      },
    });
  }, [volume, isMuted, setupAnalyser]);

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
              <div className="absolute top-3 right-3 flex items-center gap-1">
                {/* Visualizer Mode Selector */}
                <div className="flex items-center gap-0.5 bg-muted/30 rounded-full p-0.5 mr-1">
                  <motion.button
                    onClick={() => setVisualizerMode('bars')}
                    className={`p-1 rounded-full transition-colors ${visualizerMode === 'bars' ? 'bg-neon-purple/30 text-neon-purple' : 'text-muted-foreground hover:text-foreground'}`}
                    whileTap={{ scale: 0.9 }}
                    title="Bar Visualizer"
                  >
                    <Waves className="w-3 h-3" />
                  </motion.button>
                  <motion.button
                    onClick={() => setVisualizerMode('circular')}
                    className={`p-1 rounded-full transition-colors ${visualizerMode === 'circular' ? 'bg-neon-cyan/30 text-neon-cyan' : 'text-muted-foreground hover:text-foreground'}`}
                    whileTap={{ scale: 0.9 }}
                    title="Circular Visualizer"
                  >
                    <Circle className="w-3 h-3" />
                  </motion.button>
                  <motion.button
                    onClick={() => setVisualizerMode('particles')}
                    className={`p-1 rounded-full transition-colors ${visualizerMode === 'particles' ? 'bg-neon-pink/30 text-neon-pink' : 'text-muted-foreground hover:text-foreground'}`}
                    whileTap={{ scale: 0.9 }}
                    title="3D Particles"
                  >
                    <Sparkles className="w-3 h-3" />
                  </motion.button>
                  <motion.button
                    onClick={() => setVisualizerMode('waveform3d')}
                    className={`p-1 rounded-full transition-colors ${visualizerMode === 'waveform3d' ? 'bg-neon-green/30 text-neon-green' : 'text-muted-foreground hover:text-foreground'}`}
                    whileTap={{ scale: 0.9 }}
                    title="3D Waveform"
                  >
                    <Radio className="w-3 h-3" />
                  </motion.button>
                  <motion.button
                    onClick={() => setVisualizerMode('kaleidoscope')}
                    className={`p-1 rounded-full transition-colors ${visualizerMode === 'kaleidoscope' ? 'bg-neon-yellow/30 text-neon-yellow' : 'text-muted-foreground hover:text-foreground'}`}
                    whileTap={{ scale: 0.9 }}
                    title="Kaleidoscope"
                  >
                    <Box className="w-3 h-3" />
                  </motion.button>
                  <motion.button
                    onClick={() => setVisualizerMode('rings')}
                    className={`p-1 rounded-full transition-colors ${visualizerMode === 'rings' ? 'bg-neon-orange/30 text-neon-orange' : 'text-muted-foreground hover:text-foreground'}`}
                    whileTap={{ scale: 0.9 }}
                    title="3D Rings"
                  >
                    <Circle className="w-3 h-3" />
                  </motion.button>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-full bg-muted/50 hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Now Playing</span>
              </div>
            </div>

            {/* Album Art & Visualizer */}
            <div className="px-4 pb-2">
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 flex-shrink-0">
                  {/* Circular Visualizer behind album art */}
                  {visualizerMode === 'circular' && (
                    <CircularVisualizer analyserRef={analyserRef} isPlaying={isPlaying} />
                  )}
                  <motion.div 
                    className="absolute inset-[6px] rounded-xl overflow-hidden shadow-lg"
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
                </div>
                
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

            {/* 2D Visualizers */}
            {visualizerMode === 'bars' && (
              <div className="px-2 py-2 border-y border-muted/20">
                <AudioVisualizer analyserRef={analyserRef} isPlaying={isPlaying} />
              </div>
            )}

            {/* 3D Visualizers */}
            {(visualizerMode === 'waveform3d' || visualizerMode === 'particles' || visualizerMode === 'kaleidoscope' || visualizerMode === 'rings') && (
              <div className="px-2 py-2 border-y border-muted/20">
                <Suspense fallback={
                  <div className="w-full h-24 flex items-center justify-center bg-gradient-to-b from-background/50 to-muted/30 rounded-lg">
                    <div className="flex gap-1">
                      {[0, 0.1, 0.2, 0.3, 0.4].map((delay, i) => (
                        <div
                          key={i}
                          className="w-1 bg-neon-purple rounded-full animate-pulse"
                          style={{ height: 16 + i * 4, animationDelay: `${delay}s` }}
                        />
                      ))}
                    </div>
                  </div>
                }>
                  <Visualizer3D 
                    analyserRef={analyserRef} 
                    isPlaying={isPlaying} 
                    mode={visualizerMode as 'waveform3d' | 'particles' | 'kaleidoscope' | 'rings'} 
                  />
                </Suspense>
              </div>
            )}

            {/* Progress Bar */}
            <div className="px-4 py-2">
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
                className="p-4 rounded-full bg-gradient-to-r from-neon-purple to-neon-pink shadow-lg shadow-neon-purple/30 disabled:opacity-50"
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(139, 92, 246, 0.5)' }}
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
                {showPlaylist ? 'Hide Playlist' : `Show Playlist (${playlist.length} tracks)`}
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
                        <div className="relative">
                          <img 
                            src={track.cover} 
                            alt={track.title}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          {index === currentTrackIndex && isPlaying && (
                            <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                              <div className="flex gap-0.5">
                                {[0, 0.1, 0.2].map((delay, i) => (
                                  <motion.div
                                    key={i}
                                    className="w-0.5 bg-white rounded-full"
                                    animate={{ height: [3, 10, 3] }}
                                    transition={{ duration: 0.4, repeat: Infinity, delay }}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <p className={`text-sm truncate ${index === currentTrackIndex ? 'text-neon-purple font-medium' : 'text-foreground'}`}>
                            {track.title}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                        </div>
                        {index === 0 && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-neon-cyan/20 text-neon-cyan">
                            YOUR
                          </span>
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
