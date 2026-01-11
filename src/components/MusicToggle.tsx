import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { Howl } from 'howler';

const MusicToggle = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const soundRef = useRef<Howl | null>(null);

  useEffect(() => {
    soundRef.current = new Howl({
      src: ['/audio/background-music.mp3'],
      html5: true,
      loop: true,
      volume: 0.3,
      onload: () => setIsLoaded(true),
      onloaderror: (_, error) => console.log('Audio failed to load:', error),
    });

    return () => {
      soundRef.current?.unload();
    };
  }, []);

  const togglePlay = useCallback(() => {
    if (!soundRef.current || !isLoaded) return;

    if (isPlaying) {
      soundRef.current.pause();
    } else {
      soundRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, isLoaded]);

  return (
    <motion.button
      onClick={togglePlay}
      className="fixed bottom-24 right-6 z-50 p-3 rounded-full bg-background/80 backdrop-blur-sm border border-primary/30 hover:border-primary transition-all"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      title={isPlaying ? 'Pause Music' : 'Play Music'}
      aria-label={isPlaying ? 'Pause background music' : 'Play background music'}
    >
      {isPlaying ? (
        <Volume2 className="w-5 h-5 text-primary" />
      ) : (
        <VolumeX className="w-5 h-5 text-muted-foreground" />
      )}
      
      {isPlaying && (
        <motion.div
          className="absolute inset-0 rounded-full border border-primary/50"
          animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
};

export default MusicToggle;
