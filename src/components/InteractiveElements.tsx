import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface FloatingObject {
  id: number;
  x: number;
  y: number;
  size: number;
  type: 'star' | 'spaceship' | 'planet' | 'comet';
  speed: number;
  rotation: number;
}

const InteractiveElements = () => {
  const [objects, setObjects] = useState<FloatingObject[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [clickEffects, setClickEffects] = useState<{ id: number; x: number; y: number }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize floating objects
  useEffect(() => {
    const initialObjects: FloatingObject[] = [];
    const types: FloatingObject['type'][] = ['star', 'spaceship', 'planet', 'comet'];
    
    for (let i = 0; i < 15; i++) {
      initialObjects.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 20 + Math.random() * 30,
        type: types[Math.floor(Math.random() * types.length)],
        speed: 0.5 + Math.random() * 1.5,
        rotation: Math.random() * 360,
      });
    }
    setObjects(initialObjects);
  }, []);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Handle click effects
  const handleClick = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const newEffect = {
      id: Date.now(),
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    setClickEffects(prev => [...prev, newEffect]);
    setTimeout(() => {
      setClickEffects(prev => prev.filter(ef => ef.id !== newEffect.id));
    }, 1000);
  };

  const renderObject = (obj: FloatingObject) => {
    const distance = Math.sqrt(
      Math.pow((obj.x / 100) * window.innerWidth - mousePos.x, 2) +
      Math.pow((obj.y / 100) * window.innerHeight - mousePos.y, 2)
    );
    const isNear = distance < 150;

    switch (obj.type) {
      case 'star':
        return (
          <motion.svg
            width={obj.size}
            height={obj.size}
            viewBox="0 0 24 24"
            fill="none"
            animate={{
              scale: isNear ? [1, 1.5, 1] : 1,
              rotate: isNear ? [0, 180, 360] : obj.rotation,
            }}
            transition={{ duration: isNear ? 0.5 : 2, repeat: isNear ? 0 : Infinity }}
          >
            <path
              d="M12 2L14.09 8.26L21 9.27L16 14.14L17.18 21.02L12 17.77L6.82 21.02L8 14.14L3 9.27L9.91 8.26L12 2Z"
              fill={isNear ? "hsl(var(--neon-pink))" : "hsl(var(--neon-cyan))"}
              className="drop-shadow-[0_0_10px_currentColor]"
            />
          </motion.svg>
        );
      
      case 'spaceship':
        return (
          <motion.svg
            width={obj.size}
            height={obj.size}
            viewBox="0 0 40 40"
            fill="none"
            animate={{
              x: isNear ? [-10, 10, -10] : 0,
              y: isNear ? [-5, 5, -5] : 0,
              rotate: isNear ? obj.rotation + 15 : obj.rotation,
            }}
            transition={{ duration: 0.3 }}
          >
            {/* UFO body */}
            <ellipse cx="20" cy="22" rx="15" ry="6" fill="hsl(var(--neon-purple))" />
            <ellipse cx="20" cy="20" rx="10" ry="8" fill="hsl(var(--neon-cyan))" />
            <ellipse cx="20" cy="18" rx="5" ry="4" fill="hsl(var(--neon-pink))" opacity="0.8" />
            {/* Lights */}
            {isNear && (
              <>
                <circle cx="12" cy="24" r="2" fill="hsl(var(--neon-orange))" className="animate-pulse" />
                <circle cx="20" cy="26" r="2" fill="hsl(var(--neon-orange))" className="animate-pulse" />
                <circle cx="28" cy="24" r="2" fill="hsl(var(--neon-orange))" className="animate-pulse" />
              </>
            )}
            {/* Beam when near */}
            {isNear && (
              <motion.path
                d="M15 28 L10 45 L30 45 L25 28"
                fill="hsl(var(--neon-cyan))"
                opacity="0.3"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.1, 0.4, 0.1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            )}
          </motion.svg>
        );
      
      case 'planet':
        return (
          <motion.svg
            width={obj.size}
            height={obj.size}
            viewBox="0 0 40 40"
            fill="none"
            animate={{
              scale: isNear ? 1.3 : 1,
              rotate: obj.rotation + (isNear ? 30 : 0),
            }}
            transition={{ duration: 0.3 }}
          >
            <circle cx="20" cy="20" r="12" fill="hsl(var(--neon-purple))" />
            <ellipse cx="20" cy="20" rx="18" ry="4" fill="none" stroke="hsl(var(--neon-pink))" strokeWidth="2" opacity="0.7" />
            {isNear && (
              <circle cx="20" cy="20" r="16" fill="none" stroke="hsl(var(--neon-cyan))" strokeWidth="1" className="animate-ping" />
            )}
          </motion.svg>
        );
      
      case 'comet':
        return (
          <motion.svg
            width={obj.size * 1.5}
            height={obj.size}
            viewBox="0 0 60 40"
            fill="none"
            animate={{
              x: isNear ? [0, -20, 0] : [0, -5, 0],
            }}
            transition={{ duration: isNear ? 0.3 : 2, repeat: Infinity }}
          >
            <ellipse cx="50" cy="20" rx="8" ry="8" fill="hsl(var(--neon-cyan))" />
            <path
              d="M50 20 Q30 15 5 20 Q30 25 50 20"
              fill="url(#cometGradient)"
              opacity="0.6"
            />
            <defs>
              <linearGradient id="cometGradient" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="100%" stopColor="hsl(var(--neon-cyan))" />
              </linearGradient>
            </defs>
          </motion.svg>
        );
      
      default:
        return null;
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[5] overflow-hidden"
      onClick={handleClick}
      style={{ pointerEvents: 'auto' }}
    >
      {/* Floating Objects */}
      {objects.map((obj) => (
        <motion.div
          key={obj.id}
          className="absolute cursor-pointer"
          style={{
            left: `${obj.x}%`,
            top: `${obj.y}%`,
          }}
          animate={{
            x: [0, Math.sin(obj.id) * 20, 0],
            y: [0, Math.cos(obj.id) * 15, 0],
          }}
          transition={{
            duration: 5 + obj.speed,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {renderObject(obj)}
        </motion.div>
      ))}

      {/* Click Effects */}
      {clickEffects.map((effect) => (
        <motion.div
          key={effect.id}
          className="absolute pointer-events-none"
          style={{ left: effect.x, top: effect.y }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Ripple rings */}
          <div className="absolute -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-2 border-neon-pink" />
          <motion.div
            className="absolute -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-2 border-neon-cyan"
            initial={{ scale: 0.5 }}
            animate={{ scale: 2 }}
            transition={{ duration: 0.6 }}
          />
          {/* Sparkle burst */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-neon-pink rounded-full -translate-x-1/2 -translate-y-1/2"
              initial={{ x: 0, y: 0 }}
              animate={{
                x: Math.cos((i * Math.PI * 2) / 8) * 50,
                y: Math.sin((i * Math.PI * 2) / 8) * 50,
                opacity: 0,
              }}
              transition={{ duration: 0.5 }}
            />
          ))}
        </motion.div>
      ))}
    </div>
  );
};

export default InteractiveElements;
