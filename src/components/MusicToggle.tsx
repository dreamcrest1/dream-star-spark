import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { Howl } from 'howler';

const MusicToggle = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const soundRef = useRef<Howl | null>(null);

  useEffect(() => {
    // Using a royalty-free synthwave loop from a CDN
    soundRef.current = new Howl({
      src: ['https://assets.mixkit.co/music/preview/mixkit-synthwave-night-drive-1180.mp3'],
      loop: true,
      volume: 0.3,
      onload: () => setIsLoaded(true),
      onloaderror: () => console.log('Music failed to load'),
    });

    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
    };
  }, []);

  const toggleMusic = () => {
    if (!soundRef.current || !isLoaded) return;

    if (isPlaying) {
      soundRef.current.pause();
    } else {
      soundRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <motion.button
      onClick={toggleMusic}
      disabled={!isLoaded}
      className="fixed bottom-6 right-6 z-50 p-4 rounded-full glass-card border border-neon-cyan/30 hover:border-neon-cyan transition-all group disabled:opacity-50"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <AnimatePresence mode="wait">
        {isPlaying ? (
          <motion.div
            key="playing"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <Volume2 className="w-6 h-6 text-neon-cyan" />
          </motion.div>
        ) : (
          <motion.div
            key="muted"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <VolumeX className="w-6 h-6 text-muted-foreground group-hover:text-neon-pink transition-colors" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Equalizer Animation */}
      {isPlaying && (
        <div className="absolute -top-1 -right-1 flex gap-0.5">
          {[0.2, 0.4, 0.3].map((delay, i) => (
            <motion.div
              key={i}
              className="w-1 bg-neon-pink rounded-full"
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
          className="absolute inset-0 rounded-full border-2 border-neon-cyan"
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
  );
};

export default MusicToggle;
