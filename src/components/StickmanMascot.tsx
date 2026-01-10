import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { X, RefreshCw, Sparkles, Volume2, VolumeX } from 'lucide-react';

interface Fact {
  text: string;
  type: 'trivia' | 'joke' | 'quote';
}

const facts: Fact[] = [
  { text: "The first computer virus was created in 1983 and was called 'Elk Cloner'!", type: 'trivia' },
  { text: "Why do programmers prefer dark mode? Because light attracts bugs! 🐛", type: 'joke' },
  { text: "The future belongs to those who believe in the beauty of their dreams.", type: 'quote' },
  { text: "The average person spends 6 months of their lifetime waiting for red lights!", type: 'trivia' },
  { text: "Why did the AI go to therapy? It had too many unresolved issues! 🤖", type: 'joke' },
  { text: "Honey never spoils. 3000-year-old honey found in Egyptian tombs was edible!", type: 'trivia' },
  { text: "Innovation distinguishes between a leader and a follower. - Steve Jobs", type: 'quote' },
  { text: "The first email was sent in 1971 by Ray Tomlinson to himself!", type: 'trivia' },
  { text: "Why do Java developers wear glasses? Because they can't C#! 😎", type: 'joke' },
  { text: "Octopuses have three hearts and blue blood!", type: 'trivia' },
  { text: "Stay hungry, stay foolish. - Steve Jobs", type: 'quote' },
  { text: "Netflix uses 15% of the world's internet bandwidth!", type: 'trivia' },
  { text: "Get 80% OFF on premium tools at Dreamstar! 🚀", type: 'trivia' },
];

const STORAGE_KEY = 'mascot_dialog_closed';

const StickmanMascot = () => {
  // Check localStorage for persistent close state
  const [isClosed, setIsClosed] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [isOpen, setIsOpen] = useState(false);
  const [currentFact, setCurrentFact] = useState<Fact | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isWaving, setIsWaving] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [isDancing, setIsDancing] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [headTilt, setHeadTilt] = useState(0);
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);

  const getRandomFact = useCallback(() => {
    const newFact = facts[Math.floor(Math.random() * facts.length)];
    setCurrentFact(newFact);
    setIsTyping(true);
    setDisplayedText('');
  }, []);

  // Typing effect
  useEffect(() => {
    if (isTyping && currentFact) {
      let index = 0;
      const timer = setInterval(() => {
        if (index < currentFact.text.length) {
          setDisplayedText(currentFact.text.slice(0, index + 1));
          index++;
        } else {
          setIsTyping(false);
          clearInterval(timer);
        }
      }, 30);
      return () => clearInterval(timer);
    }
  }, [isTyping, currentFact]);

  // Auto-open after delay (only if not closed by user)
  useEffect(() => {
    if (isClosed) return;
    
    const timer = setTimeout(() => {
      if (!isOpen) {
        setIsOpen(true);
        getRandomFact();
        setIsWaving(true);
        setTimeout(() => setIsWaving(false), 2000);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [getRandomFact, isOpen, isClosed]);

  // Random animations
  useEffect(() => {
    const interval = setInterval(() => {
      const random = Math.random();
      if (random > 0.85) {
        setIsSpinning(true);
        setTimeout(() => setIsSpinning(false), 1000);
      } else if (random > 0.7) {
        setIsDancing(true);
        setTimeout(() => setIsDancing(false), 2000);
      } else if (random > 0.55) {
        setIsJumping(true);
        setTimeout(() => setIsJumping(false), 600);
      } else if (random > 0.4) {
        setIsWaving(true);
        setTimeout(() => setIsWaving(false), 1500);
      } else if (random > 0.3) {
        setHeadTilt(Math.random() * 20 - 10);
        setTimeout(() => setHeadTilt(0), 1000);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    if (isClosed) {
      // Re-open and reset the closed state
      setIsClosed(false);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
    }
    setIsOpen(!isOpen);
    if (!isOpen) {
      getRandomFact();
      setIsJumping(true);
      setTimeout(() => setIsJumping(false), 600);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsClosed(true);
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {}
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'trivia': return 'text-neon-cyan';
      case 'joke': return 'text-neon-pink';
      case 'quote': return 'text-neon-purple';
      default: return 'text-foreground';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'trivia': return '💡 Fun Fact';
      case 'joke': return '😄 Joke';
      case 'quote': return '✨ Quote';
      default: return 'Info';
    }
  };

  return (
    <div ref={containerRef} className="fixed bottom-6 left-6 z-50">
      {/* Speech Bubble */}
      <AnimatePresence>
        {isOpen && currentFact && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-36 left-0 w-72 md:w-80 glass-card rounded-2xl p-4 border border-neon-pink/30"
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-display ${getTypeColor(currentFact.type)}`}>
                {getTypeLabel(currentFact.type)}
              </span>
              <div className="flex gap-1">
                <button onClick={getRandomFact} className="p-1 hover:bg-muted rounded-full transition-colors">
                  <RefreshCw className="w-4 h-4 text-muted-foreground hover:text-neon-cyan" />
                </button>
                <button onClick={handleClose} className="p-1 hover:bg-muted rounded-full transition-colors">
                  <X className="w-4 h-4 text-muted-foreground hover:text-neon-pink" />
                </button>
              </div>
            </div>
            <p className="text-sm font-body leading-relaxed">
              {displayedText}
              {isTyping && (
                <motion.span 
                  animate={{ opacity: [1, 0] }} 
                  transition={{ duration: 0.5, repeat: Infinity }} 
                  className="text-neon-pink"
                >|</motion.span>
              )}
            </p>
            <div className="absolute -bottom-2 left-16 w-4 h-4 glass-card border-r border-b border-neon-pink/30 transform rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stickman Character */}
      <motion.button
        onClick={handleClick}
        className="relative group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-neon-pink/30 to-neon-cyan/30 blur-2xl"
          animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* 3D-style SVG Character */}
        <motion.svg
          width="120"
          height="140"
          viewBox="0 0 120 140"
          className="relative z-10 drop-shadow-[0_0_20px_rgba(255,51,153,0.6)]"
          animate={
            isSpinning 
              ? { rotateY: [0, 360], y: [0, -10, 0] }
              : isDancing 
                ? { rotate: [-5, 5, -5, 5, 0], y: [0, -8, 0, -8, 0] }
                : isJumping 
                  ? { y: [0, -25, 0], scale: [1, 1.1, 1] } 
                  : { y: [0, -5, 0] }
          }
          transition={
            isSpinning 
              ? { duration: 1, ease: "easeInOut" }
              : isDancing 
                ? { duration: 0.5, repeat: 3 }
                : isJumping 
                  ? { duration: 0.6, ease: "easeOut" } 
                  : { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* 3D Shadow/Depth layer */}
          <ellipse cx="60" cy="135" rx="25" ry="5" fill="hsl(var(--neon-purple))" opacity="0.3" />
          
          {/* Body - 3D capsule shape */}
          <motion.ellipse
            cx="60"
            cy="75"
            rx="18"
            ry="30"
            fill="url(#bodyGradient3D)"
            stroke="url(#bodyStroke)"
            strokeWidth="2"
          />
          
          {/* Body shine */}
          <ellipse cx="52" cy="65" rx="6" ry="15" fill="hsl(var(--neon-cyan))" opacity="0.3" />
          
          {/* Head - 3D sphere effect */}
          <motion.g
            animate={{ rotate: headTilt }}
            style={{ transformOrigin: '60px 30px' }}
          >
            <motion.circle
              cx="60"
              cy="30"
              r="22"
              fill="url(#headGradient3D)"
              stroke="url(#headStroke)"
              strokeWidth="2"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            {/* Head shine */}
            <circle cx="52" cy="22" r="8" fill="hsl(var(--neon-pink))" opacity="0.3" />
            
            {/* Eyes with 3D depth */}
            <motion.g
              animate={{ scaleY: [1, 0.1, 1] }}
              transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 4 }}
            >
              <ellipse cx="52" cy="28" rx="5" ry="6" fill="white" />
              <ellipse cx="68" cy="28" rx="5" ry="6" fill="white" />
              <motion.circle
                cx="53"
                cy="28"
                r="3"
                fill="hsl(var(--neon-cyan))"
                animate={{ x: [-1, 1, -1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.circle
                cx="69"
                cy="28"
                r="3"
                fill="hsl(var(--neon-cyan))"
                animate={{ x: [-1, 1, -1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              {/* Eye sparkle */}
              <circle cx="50" cy="26" r="1.5" fill="white" />
              <circle cx="66" cy="26" r="1.5" fill="white" />
            </motion.g>
            
            {/* Mouth */}
            <motion.path
              d={isOpen ? "M 52 40 Q 60 48 68 40" : "M 52 40 Q 60 44 68 40"}
              fill="none"
              stroke="hsl(var(--neon-pink))"
              strokeWidth="3"
              strokeLinecap="round"
            />
            
            {/* Blush */}
            <circle cx="45" cy="35" r="4" fill="hsl(var(--neon-pink))" opacity="0.4" />
            <circle cx="75" cy="35" r="4" fill="hsl(var(--neon-pink))" opacity="0.4" />
            
            {/* Antenna/Hair */}
            <motion.path
              d="M 60 8 Q 65 -5 70 8"
              fill="none"
              stroke="hsl(var(--neon-purple))"
              strokeWidth="3"
              strokeLinecap="round"
              animate={{ d: ["M 60 8 Q 65 -5 70 8", "M 60 8 Q 55 -5 60 8", "M 60 8 Q 65 -5 70 8"] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.circle
              cx="70"
              cy="5"
              r="4"
              fill="hsl(var(--neon-cyan))"
              animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.g>

          {/* Left Arm - 3D with continuous movement */}
          <motion.path
            d={isWaving 
              ? "M 42 60 Q 25 45 20 30" 
              : "M 42 60 Q 30 70 25 85"
            }
            fill="none"
            stroke="url(#armGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            animate={isWaving ? { 
              d: ["M 42 60 Q 25 45 20 30", "M 42 60 Q 20 40 15 25", "M 42 60 Q 25 45 20 30"]
            } : {
              d: ["M 42 60 Q 30 70 25 85", "M 42 60 Q 28 65 22 78", "M 42 60 Q 32 72 28 88", "M 42 60 Q 30 70 25 85"]
            }}
            transition={isWaving ? { duration: 0.3, repeat: 4 } : { duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Left hand */}
          <motion.circle
            r="6"
            fill="url(#headGradient3D)"
            stroke="url(#headStroke)"
            strokeWidth="1"
            animate={isWaving ? {
              cx: [20, 15, 20],
              cy: [30, 25, 30]
            } : {
              cx: [25, 22, 28, 25],
              cy: [85, 78, 88, 85]
            }}
            transition={isWaving ? { duration: 0.3, repeat: 4 } : { duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Right Arm - 3D with continuous movement */}
          <motion.path
            fill="none"
            stroke="url(#armGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            animate={{
              d: ["M 78 60 Q 90 70 95 85", "M 78 60 Q 92 65 98 78", "M 78 60 Q 88 72 92 88", "M 78 60 Q 90 70 95 85"]
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.75 }}
          />
          {/* Right hand */}
          <motion.circle
            r="6"
            fill="url(#headGradient3D)"
            stroke="url(#headStroke)"
            strokeWidth="1"
            animate={{
              cx: [95, 98, 92, 95],
              cy: [85, 78, 88, 85]
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.75 }}
          />

          {/* Left Leg - 3D with continuous walking motion */}
          <motion.path
            fill="none"
            stroke="url(#legGradient)"
            strokeWidth="10"
            strokeLinecap="round"
            animate={isDancing ? { 
              d: ["M 52 100 Q 45 115 40 130", "M 52 100 Q 40 110 35 125", "M 52 100 Q 45 115 40 130"] 
            } : {
              d: ["M 52 100 Q 45 115 40 130", "M 52 100 Q 48 112 45 128", "M 52 100 Q 42 118 38 132", "M 52 100 Q 45 115 40 130"]
            }}
            transition={isDancing ? { duration: 0.25, repeat: 6 } : { duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Left foot */}
          <motion.ellipse
            rx="8"
            ry="4"
            fill="hsl(var(--neon-purple))"
            animate={isDancing ? {
              cx: [40, 35, 40],
              cy: [132, 127, 132]
            } : {
              cx: [40, 45, 38, 40],
              cy: [132, 128, 134, 132]
            }}
            transition={isDancing ? { duration: 0.25, repeat: 6 } : { duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Right Leg - 3D with continuous walking motion */}
          <motion.path
            fill="none"
            stroke="url(#legGradient)"
            strokeWidth="10"
            strokeLinecap="round"
            animate={isDancing ? { 
              d: ["M 68 100 Q 75 115 80 130", "M 68 100 Q 80 110 85 125", "M 68 100 Q 75 115 80 130"] 
            } : {
              d: ["M 68 100 Q 75 115 80 130", "M 68 100 Q 78 118 82 132", "M 68 100 Q 72 112 75 128", "M 68 100 Q 75 115 80 130"]
            }}
            transition={isDancing ? { duration: 0.25, repeat: 6, delay: 0.125 } : { duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          />
          {/* Right foot */}
          <motion.ellipse
            rx="8"
            ry="4"
            fill="hsl(var(--neon-purple))"
            animate={isDancing ? {
              cx: [80, 85, 80],
              cy: [132, 127, 132]
            } : {
              cx: [80, 82, 75, 80],
              cy: [132, 134, 128, 132]
            }}
            transition={isDancing ? { duration: 0.25, repeat: 6, delay: 0.125 } : { duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          />

          {/* Cape */}
          <motion.path
            d="M 45 52 Q 30 70 20 100 Q 35 95 45 85"
            fill="hsl(var(--neon-purple))"
            opacity="0.6"
            animate={{ 
              d: [
                "M 45 52 Q 30 70 20 100 Q 35 95 45 85",
                "M 45 52 Q 25 65 15 95 Q 30 90 45 85",
                "M 45 52 Q 30 70 20 100 Q 35 95 45 85"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* 3D Gradients */}
          <defs>
            <radialGradient id="headGradient3D" cx="40%" cy="30%" r="60%">
              <stop offset="0%" stopColor="hsl(var(--neon-pink))" />
              <stop offset="70%" stopColor="hsl(320 100% 40%)" />
              <stop offset="100%" stopColor="hsl(320 100% 25%)" />
            </radialGradient>
            <linearGradient id="headStroke" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--neon-cyan))" />
              <stop offset="100%" stopColor="hsl(var(--neon-pink))" />
            </linearGradient>
            <radialGradient id="bodyGradient3D" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="hsl(var(--neon-cyan))" />
              <stop offset="60%" stopColor="hsl(190 100% 40%)" />
              <stop offset="100%" stopColor="hsl(190 100% 25%)" />
            </radialGradient>
            <linearGradient id="bodyStroke" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--neon-pink))" />
              <stop offset="100%" stopColor="hsl(var(--neon-purple))" />
            </linearGradient>
            <linearGradient id="armGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--neon-cyan))" />
              <stop offset="100%" stopColor="hsl(190 100% 35%)" />
            </linearGradient>
            <linearGradient id="legGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--neon-purple))" />
              <stop offset="100%" stopColor="hsl(280 100% 35%)" />
            </linearGradient>
          </defs>
        </motion.svg>

        {/* Floating sparkles */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ 
              top: `${10 + i * 20}%`, 
              right: `${-10 + (i % 2) * 20}%`,
              left: i % 2 === 0 ? 'auto' : `${-5}%`
            }}
            animate={{
              y: [-5, 5, -5],
              opacity: [0.4, 1, 0.4],
              scale: [0.8, 1.2, 0.8],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 2 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.4,
            }}
          >
            <Sparkles className="w-3 h-3 text-neon-cyan" />
          </motion.div>
        ))}

        {/* Notification badge */}
        {!isOpen && (
          <motion.div
            className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-neon-pink to-neon-purple rounded-full flex items-center justify-center shadow-lg"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span className="text-xs">💬</span>
          </motion.div>
        )}
      </motion.button>
    </div>
  );
};

export default StickmanMascot;
