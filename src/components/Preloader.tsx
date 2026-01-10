import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader = ({ onComplete }: PreloaderProps) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const duration = 2500;
    const interval = 30;
    const steps = duration / interval;
    let current = 0;

    const timer = setInterval(() => {
      current += 100 / steps;
      setProgress(Math.min(current, 100));
      
      if (current >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          setIsComplete(true);
          setTimeout(onComplete, 500);
        }, 300);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
        >
          {/* Grid Background */}
          <div className="absolute inset-0 grid-bg animate-grid-scroll opacity-30" />
          
          {/* Scanlines */}
          <div className="absolute inset-0 scanlines" />

          {/* Glowing Orb */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute w-64 h-64 rounded-full bg-gradient-radial from-neon-pink/30 via-neon-purple/20 to-transparent blur-3xl"
          />

          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 mb-8"
          >
            <motion.h1
              className="text-4xl md:text-6xl font-display font-bold tracking-wider"
              animate={{
                textShadow: [
                  "0 0 20px hsl(320 100% 60% / 0.8), 0 0 40px hsl(320 100% 60% / 0.4)",
                  "0 0 30px hsl(180 100% 50% / 0.8), 0 0 60px hsl(180 100% 50% / 0.4)",
                  "0 0 20px hsl(320 100% 60% / 0.8), 0 0 40px hsl(320 100% 60% / 0.4)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-neon-pink">DREAM</span>
              <span className="text-neon-cyan">STAR</span>
            </motion.h1>
            
            {/* Glitch Effect */}
            <motion.div
              className="absolute inset-0 text-4xl md:text-6xl font-display font-bold tracking-wider text-neon-cyan/50"
              animate={{
                x: [0, -3, 3, 0],
                opacity: [0, 0.5, 0.5, 0],
              }}
              transition={{
                duration: 0.2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              <span className="text-neon-pink">DREAM</span>
              <span className="text-neon-cyan">STAR</span>
            </motion.div>
          </motion.div>

          {/* Loading Bar Container */}
          <div className="relative z-10 w-64 md:w-80">
            {/* Bar Background */}
            <div className="h-2 bg-muted rounded-full overflow-hidden neon-border">
              {/* Progress Bar */}
              <motion.div
                className="h-full bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            {/* Progress Text */}
            <div className="flex justify-between items-center mt-3">
              <span className="text-sm font-body text-muted-foreground">LOADING SYSTEM</span>
              <span className="text-sm font-display text-neon-cyan">{Math.round(progress)}%</span>
            </div>
          </div>

          {/* Loading Messages */}
          <motion.p
            key={Math.floor(progress / 25)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-sm font-body text-muted-foreground tracking-widest uppercase"
          >
            {progress < 25 && "Initializing neural network..."}
            {progress >= 25 && progress < 50 && "Loading product matrix..."}
            {progress >= 50 && progress < 75 && "Syncing data streams..."}
            {progress >= 75 && progress < 100 && "Activating interface..."}
            {progress >= 100 && "System ready!"}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
