import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, ChevronUp, ChevronDown } from 'lucide-react';
import { Howl } from 'howler';

const MusicToggle = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const soundRef = useRef<Howl | null>(null);
  const progressInterval = useRef<NodeJS.Timeout>();

  useEffect(() => {
    soundRef.current = new Howl({
      src: ['/audio/background-music.mp3'],
      loop: true,
      volume: volume,
      html5: true,
      onload: () => {
        setIsLoaded(true);
        setDuration(soundRef.current?.duration() || 0);
      },
      onloaderror: (id, error) => {
        console.log('Music failed to load:', error);
      },
    });

    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  // Update progress bar
  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        if (soundRef.current) {
          const seek = soundRef.current.seek() as number;
          const dur = soundRef.current.duration();
          setProgress((seek / dur) * 100);
        }
      }, 500);
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

  const toggleMusic = useCallback(() => {
    if (!soundRef.current || !isLoaded) return;

    if (isPlaying) {
      soundRef.current.pause();
    } else {
      soundRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, isLoaded]);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (soundRef.current) {
      soundRef.current.volume(newVolume);
    }
  }, []);

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!soundRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const seekTime = percentage * duration;
    soundRef.current.seek(seekTime);
    setProgress(percentage * 100);
  }, [duration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-24 right-6 z-50">
      {/* Expanded Controls Panel */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-14 right-0 glass-card border border-neon-purple/40 rounded-xl p-3 w-48 shadow-xl"
          >
            {/* Progress Bar */}
            <div className="mb-3">
              <div 
                className="h-1.5 bg-muted rounded-full cursor-pointer overflow-hidden"
                onClick={handleProgressClick}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-neon-purple to-neon-pink rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>{formatTime((progress / 100) * duration)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <VolumeX className="w-3 h-3 text-muted-foreground" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="flex-1 h-1 accent-neon-purple bg-muted rounded-full cursor-pointer"
              />
              <Volume2 className="w-3 h-3 text-muted-foreground" />
            </div>

            {/* Volume Percentage */}
            <div className="text-center text-[10px] text-muted-foreground mt-1">
              {Math.round(volume * 100)}%
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expand/Collapse Button */}
      <motion.button
        onClick={() => setShowControls(!showControls)}
        className="absolute -top-2 right-0 p-1 rounded-full glass-card border border-neon-purple/30 hover:border-neon-purple/60 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {showControls ? (
          <ChevronDown className="w-3 h-3 text-muted-foreground" />
        ) : (
          <ChevronUp className="w-3 h-3 text-muted-foreground" />
        )}
      </motion.button>

      {/* Main Toggle Button */}
      <motion.button
        onClick={toggleMusic}
        disabled={!isLoaded}
        className="p-3 rounded-full glass-card border border-neon-purple/40 hover:border-neon-purple transition-all group disabled:opacity-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
        title={isPlaying ? 'Pause Music' : 'Play Music'}
      >
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.div
              key="playing"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <Volume2 className="w-5 h-5 text-neon-purple" />
            </motion.div>
          ) : (
            <motion.div
              key="muted"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <VolumeX className="w-5 h-5 text-muted-foreground group-hover:text-neon-purple transition-colors" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Equalizer Animation */}
        {isPlaying && (
          <div className="absolute -top-1 -right-1 flex gap-0.5">
            {[0.2, 0.4, 0.3].map((delay, i) => (
              <motion.div
                key={i}
                className="w-1 bg-neon-purple rounded-full"
                animate={{
                  height: [4, 12, 4],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  delay: delay,
                }}
              />
            ))}
          </div>
        )}

        {/* Pulse Ring */}
        {isPlaying && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-neon-purple"
            animate={{
              scale: [1, 1.5],
              opacity: [0.5, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          />
        )}
      </motion.button>
    </div>
  );
};

export default MusicToggle;
