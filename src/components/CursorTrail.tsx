import { useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CursorTrail = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Trail positions with different spring configs
  const trail1X = useMotionValue(-100);
  const trail1Y = useMotionValue(-100);
  const trail2X = useMotionValue(-100);
  const trail2Y = useMotionValue(-100);
  const trail3X = useMotionValue(-100);
  const trail3Y = useMotionValue(-100);

  const trail1XSpring = useSpring(trail1X, { damping: 35, stiffness: 350 });
  const trail1YSpring = useSpring(trail1Y, { damping: 35, stiffness: 350 });
  const trail2XSpring = useSpring(trail2X, { damping: 40, stiffness: 300 });
  const trail2YSpring = useSpring(trail2Y, { damping: 40, stiffness: 300 });
  const trail3XSpring = useSpring(trail3X, { damping: 45, stiffness: 250 });
  const trail3YSpring = useSpring(trail3Y, { damping: 45, stiffness: 250 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
    
    setTimeout(() => { trail1X.set(e.clientX); trail1Y.set(e.clientY); }, 50);
    setTimeout(() => { trail2X.set(e.clientX); trail2Y.set(e.clientY); }, 100);
    setTimeout(() => { trail3X.set(e.clientX); trail3Y.set(e.clientY); }, 150);
  }, [cursorX, cursorY, trail1X, trail1Y, trail2X, trail2Y, trail3X, trail3Y]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 hidden md:block">
      {/* Main cursor */}
      <motion.div
        className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-primary to-accent mix-blend-screen"
        style={{ x: cursorXSpring, y: cursorYSpring }}
      />
      
      {/* Trail particles */}
      <motion.div
        className="absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/60 mix-blend-screen"
        style={{ x: trail1XSpring, y: trail1YSpring }}
      />
      <motion.div
        className="absolute w-2.5 h-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/40 mix-blend-screen"
        style={{ x: trail2XSpring, y: trail2YSpring }}
      />
      <motion.div
        className="absolute w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 mix-blend-screen"
        style={{ x: trail3XSpring, y: trail3YSpring }}
      />
    </div>
  );
};

export default CursorTrail;
