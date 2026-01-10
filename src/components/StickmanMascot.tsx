import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { X, RefreshCw, Sparkles } from 'lucide-react';

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

const StickmanMascot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentFact, setCurrentFact] = useState<Fact | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isWaving, setIsWaving] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
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

  // Auto-open after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setIsOpen(true);
        getRandomFact();
        setIsWaving(true);
        setTimeout(() => setIsWaving(false), 2000);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [getRandomFact, isOpen]);

  // Random animations
  useEffect(() => {
    const interval = setInterval(() => {
      const random = Math.random();
      if (random > 0.7) {
        setIsJumping(true);
        setTimeout(() => setIsJumping(false), 600);
      } else if (random > 0.4) {
        setIsWaving(true);
        setTimeout(() => setIsWaving(false), 1500);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      getRandomFact();
      setIsJumping(true);
      setTimeout(() => setIsJumping(false), 600);
    }
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
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-muted rounded-full transition-colors">
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

        {/* SVG Stickman */}
        <motion.svg
          width="100"
          height="120"
          viewBox="0 0 100 120"
          className="relative z-10 drop-shadow-[0_0_15px_rgba(255,51,153,0.5)]"
          animate={isJumping ? { y: [0, -20, 0] } : { y: [0, -5, 0] }}
          transition={isJumping ? { duration: 0.6, ease: "easeOut" } : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Head */}
          <motion.circle
            cx="50"
            cy="20"
            r="15"
            fill="none"
            stroke="url(#headGradient)"
            strokeWidth="3"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          {/* Eyes */}
          <motion.circle
            cx="44"
            cy="18"
            r="3"
            fill="hsl(var(--neon-cyan))"
            animate={{ scaleY: [1, 0.1, 1] }}
            transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 4 }}
          />
          <motion.circle
            cx="56"
            cy="18"
            r="3"
            fill="hsl(var(--neon-cyan))"
            animate={{ scaleY: [1, 0.1, 1] }}
            transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 4 }}
          />
          
          {/* Smile */}
          <motion.path
            d="M 42 26 Q 50 32 58 26"
            fill="none"
            stroke="hsl(var(--neon-pink))"
            strokeWidth="2"
            strokeLinecap="round"
            animate={{ d: isOpen ? "M 42 26 Q 50 34 58 26" : "M 42 26 Q 50 32 58 26" }}
          />

          {/* Body */}
          <motion.line
            x1="50"
            y1="35"
            x2="50"
            y2="70"
            stroke="url(#bodyGradient)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Left Arm */}
          <motion.line
            x1="50"
            y1="45"
            x2={isWaving ? "25" : "30"}
            y2={isWaving ? "35" : "60"}
            stroke="url(#bodyGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            animate={isWaving ? { 
              x2: [25, 20, 25, 20, 25],
              y2: [35, 30, 35, 30, 35]
            } : {}}
            transition={{ duration: 0.5, repeat: isWaving ? 2 : 0 }}
          />

          {/* Right Arm */}
          <motion.line
            x1="50"
            y1="45"
            x2="70"
            y2="60"
            stroke="url(#bodyGradient)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Left Leg */}
          <motion.line
            x1="50"
            y1="70"
            x2="35"
            y2="100"
            stroke="url(#bodyGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            animate={isJumping ? { x2: [35, 40, 35] } : {}}
            transition={{ duration: 0.3 }}
          />

          {/* Right Leg */}
          <motion.line
            x1="50"
            y1="70"
            x2="65"
            y2="100"
            stroke="url(#bodyGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            animate={isJumping ? { x2: [65, 60, 65] } : {}}
            transition={{ duration: 0.3 }}
          />

          {/* Cape/Scarf */}
          <motion.path
            d="M 45 38 Q 35 50 25 65"
            fill="none"
            stroke="hsl(var(--neon-purple))"
            strokeWidth="2"
            strokeLinecap="round"
            animate={{ 
              d: ["M 45 38 Q 35 50 25 65", "M 45 38 Q 30 50 20 60", "M 45 38 Q 35 50 25 65"]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Gradients */}
          <defs>
            <linearGradient id="headGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--neon-pink))" />
              <stop offset="100%" stopColor="hsl(var(--neon-cyan))" />
            </linearGradient>
            <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--neon-cyan))" />
              <stop offset="100%" stopColor="hsl(var(--neon-pink))" />
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
