import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, RefreshCw } from 'lucide-react';
import mascotImage from '@/assets/mascot-chibi.png';

interface Fact {
  text: string;
  type: 'trivia' | 'joke' | 'quote';
}

const facts: Fact[] = [
  { text: "The first computer virus was created in 1983 and was called 'Elk Cloner'!", type: 'trivia' },
  { text: "Why do programmers prefer dark mode? Because light attracts bugs! 🐛", type: 'joke' },
  { text: "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt", type: 'quote' },
  { text: "The average person spends 6 months of their lifetime waiting for red lights!", type: 'trivia' },
  { text: "Why did the AI go to therapy? It had too many unresolved issues! 🤖", type: 'joke' },
  { text: "Honey never spoils. 3000-year-old honey in Egyptian tombs was still edible!", type: 'trivia' },
  { text: "Innovation distinguishes between a leader and a follower. - Steve Jobs", type: 'quote' },
  { text: "The first email was sent in 1971 by Ray Tomlinson to himself!", type: 'trivia' },
  { text: "Why do Java developers wear glasses? Because they can't C#! 😎", type: 'joke' },
  { text: "Octopuses have three hearts and blue blood!", type: 'trivia' },
  { text: "Stay hungry, stay foolish. - Steve Jobs", type: 'quote' },
  { text: "Netflix uses 15% of the world's internet bandwidth!", type: 'trivia' },
];

const Mascot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentFact, setCurrentFact] = useState<Fact | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState('');

  const getRandomFact = useCallback(() => {
    const newFact = facts[Math.floor(Math.random() * facts.length)];
    setCurrentFact(newFact);
    setIsTyping(true);
    setDisplayedText('');
  }, []);

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
      }, 25);
      return () => clearInterval(timer);
    }
  }, [isTyping, currentFact]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setIsOpen(true);
        getRandomFact();
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [getRandomFact, isOpen]);

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
    <div className="fixed bottom-6 left-6 z-50">
      <AnimatePresence>
        {isOpen && currentFact && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-32 left-0 w-72 md:w-80 glass-card rounded-2xl p-4 border border-neon-pink/30"
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
              {isTyping && <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} className="text-neon-pink">|</motion.span>}
            </p>
            <div className="absolute -bottom-2 left-12 w-4 h-4 glass-card border-r border-b border-neon-pink/30 transform rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => { setIsOpen(!isOpen); if (!isOpen) getRandomFact(); }}
        className="relative group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {/* Breathing glow */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-neon-pink/40 to-neon-cyan/40 blur-xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Mascot with idle animation */}
        <motion.img
          src={mascotImage}
          alt="Dreamstar Mascot"
          className="w-28 h-28 object-contain relative z-10 drop-shadow-[0_0_20px_rgba(255,51,153,0.6)]"
          animate={{
            y: [0, -8, 0],
            rotate: [0, 2, -2, 0],
          }}
          transition={{
            y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          }}
        />

        {/* Sparkle particles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ top: `${20 + i * 15}%`, right: `${-5 + i * 10}%` }}
            animate={{
              y: [-5, 5, -5],
              opacity: [0.5, 1, 0.5],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          >
            <Sparkles className="w-4 h-4 text-neon-cyan" />
          </motion.div>
        ))}

        {!isOpen && (
          <motion.div
            className="absolute -top-1 -right-1 w-5 h-5 bg-neon-pink rounded-full flex items-center justify-center"
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

export default Mascot;
