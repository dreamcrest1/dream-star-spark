import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { Howl } from 'howler';

const MusicToggle = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const soundRef = useRef<Howl | null>(null);

  useEffect(() => {
    // Free cyberpunk/synthwave ambient music
    soundRef.current = new Howl({
      src: ['https://cdn.pixabay.com/audio/2022/03/10/audio_cc684e8f82.mp3'],
      loop: true,
      volume: 0.3,
      html5: true, // Enable HTML5 Audio to avoid CORS issues
      onload: () => setIsLoaded(true),
      onloaderror: (id, error) => {
        console.log('Music failed to load, trying fallback...', error);
        // Try fallback URL
        soundRef.current = new Howl({
          src: ['https://cdn.pixabay.com/audio/2021/11/25/audio_91b32e02f9.mp3'],
          loop: true,
          volume: 0.3,
          html5: true,
          onload: () => setIsLoaded(true),
          onloaderror: () => console.log('Fallback also failed'),
        });
      },
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
      className="fixed bottom-24 right-6 z-50 p-3 rounded-full glass-card border border-neon-purple/40 hover:border-neon-purple transition-all group disabled:opacity-50"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8 }}
      title={isPlaying ? 'Pause Music' : 'Play Ambient Music'}
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
  );
};

export default MusicToggle;
