import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, X, RotateCcw, ChevronLeft, Bird, Zap, Grid3X3, Target } from 'lucide-react';

const CANVAS_WIDTH = 200;
const CANVAS_HEIGHT = 280;

type GameType = 'menu' | 'flappy' | 'snake' | 'memory' | 'reaction';

// ============= FLAPPY GAME =============
const BIRD_SIZE = 20;
const PIPE_WIDTH = 40;
const PIPE_GAP = 80;
const GRAVITY = 0.4;
const JUMP_FORCE = -7;

interface Pipe {
  x: number;
  topHeight: number;
  passed: boolean;
}

const FlappyGame = ({ onBack }: { onBack: () => void }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [birdY, setBirdY] = useState(CANVAS_HEIGHT / 2);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('flappyHighScore');
    return saved ? parseInt(saved) : 0;
  });
  const [gameOver, setGameOver] = useState(false);
  const gameLoopRef = useRef<number>();

  const resetGame = useCallback(() => {
    setBirdY(CANVAS_HEIGHT / 2);
    setBirdVelocity(0);
    setPipes([]);
    setScore(0);
    setGameOver(false);
    setIsPlaying(false);
  }, []);

  const jump = useCallback(() => {
    if (gameOver) {
      resetGame();
      return;
    }
    if (!isPlaying) setIsPlaying(true);
    setBirdVelocity(JUMP_FORCE);
  }, [gameOver, isPlaying, resetGame]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const gameLoop = () => {
      setBirdY((prev) => {
        const newY = prev + birdVelocity;
        if (newY <= 0 || newY >= CANVAS_HEIGHT - BIRD_SIZE) {
          setGameOver(true);
          return prev;
        }
        return newY;
      });

      setBirdVelocity((prev) => prev + GRAVITY);

      setPipes((prevPipes) => {
        let newPipes = prevPipes
          .map((pipe) => ({ ...pipe, x: pipe.x - 2 }))
          .filter((pipe) => pipe.x > -PIPE_WIDTH);

        if (newPipes.length === 0 || newPipes[newPipes.length - 1].x < CANVAS_WIDTH - 100) {
          newPipes.push({
            x: CANVAS_WIDTH,
            topHeight: Math.random() * (CANVAS_HEIGHT - PIPE_GAP - 60) + 30,
            passed: false,
          });
        }

        newPipes = newPipes.map((pipe) => {
          const birdLeft = 30;
          const birdRight = birdLeft + BIRD_SIZE;
          const birdTop = birdY;
          const birdBottom = birdY + BIRD_SIZE;

          if (birdRight > pipe.x && birdLeft < pipe.x + PIPE_WIDTH) {
            if (birdTop < pipe.topHeight || birdBottom > pipe.topHeight + PIPE_GAP) {
              setGameOver(true);
            }
          }

          if (!pipe.passed && pipe.x + PIPE_WIDTH < 30) {
            setScore((s) => {
              const newScore = s + 1;
              if (newScore > highScore) {
                setHighScore(newScore);
                localStorage.setItem('flappyHighScore', newScore.toString());
              }
              return newScore;
            });
            return { ...pipe, passed: true };
          }

          return pipe;
        });

        return newPipes;
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => { if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current); };
  }, [isPlaying, gameOver, birdVelocity, birdY, highScore]);

  return (
    <div
      className="relative bg-gradient-to-b from-background via-background/90 to-neon-purple/10 cursor-pointer select-none"
      style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
      onClick={jump}
    >
      <button onClick={(e) => { e.stopPropagation(); onBack(); }} className="absolute top-2 left-2 z-10 p-1 hover:bg-muted rounded">
        <ChevronLeft className="w-4 h-4 text-muted-foreground" />
      </button>
      <button onClick={(e) => { e.stopPropagation(); resetGame(); }} className="absolute top-2 right-8 z-10 p-1 hover:bg-muted rounded">
        <RotateCcw className="w-3 h-3 text-muted-foreground" />
      </button>

      <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold text-neon-cyan">
        {score} | Best: {highScore}
      </div>

      <motion.div
        className="absolute w-5 h-5 rounded-full bg-gradient-to-br from-neon-yellow to-neon-orange shadow-lg"
        style={{ left: 30, top: birdY, transform: `rotate(${Math.min(birdVelocity * 3, 45)}deg)` }}
      >
        <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-white" />
      </motion.div>

      {pipes.map((pipe, index) => (
        <div key={index}>
          <div className="absolute bg-gradient-to-b from-neon-green to-neon-green/70 rounded-b-md"
            style={{ left: pipe.x, top: 0, width: PIPE_WIDTH, height: pipe.topHeight }} />
          <div className="absolute bg-gradient-to-t from-neon-green to-neon-green/70 rounded-t-md"
            style={{ left: pipe.x, top: pipe.topHeight + PIPE_GAP, width: PIPE_WIDTH, height: CANVAS_HEIGHT - pipe.topHeight - PIPE_GAP }} />
        </div>
      ))}

      {!isPlaying && !gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
          <p className="text-sm font-medium">Click to Start!</p>
        </div>
      )}

      {gameOver && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="text-center">
            <p className="text-sm font-bold text-destructive mb-1">Game Over!</p>
            <p className="text-xs text-neon-cyan">Score: {score}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// ============= SNAKE GAME =============
const GRID_SIZE = 14;
const CELL_SIZE = Math.floor(CANVAS_WIDTH / GRID_SIZE);

const SnakeGame = ({ onBack }: { onBack: () => void }) => {
  const [snake, setSnake] = useState([{ x: 7, y: 7 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snakeHighScore');
    return saved ? parseInt(saved) : 0;
  });

  const resetGame = useCallback(() => {
    setSnake([{ x: 7, y: 7 }]);
    setFood({ x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) });
    setDirection({ x: 1, y: 0 });
    setScore(0);
    setGameOver(false);
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const interval = setInterval(() => {
      setSnake((prev) => {
        const newHead = { x: prev[0].x + direction.x, y: prev[0].y + direction.y };
        
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setGameOver(true);
          return prev;
        }
        
        if (prev.some((seg) => seg.x === newHead.x && seg.y === newHead.y)) {
          setGameOver(true);
          return prev;
        }

        const newSnake = [newHead, ...prev];
        
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => {
            const newScore = s + 1;
            if (newScore > highScore) {
              setHighScore(newScore);
              localStorage.setItem('snakeHighScore', newScore.toString());
            }
            return newScore;
          });
          setFood({ x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) });
        } else {
          newSnake.pop();
        }
        
        return newSnake;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isPlaying, gameOver, direction, food, highScore]);

  const handleDirection = (dir: { x: number; y: number }) => {
    if (!isPlaying) setIsPlaying(true);
    if (dir.x !== -direction.x || dir.y !== -direction.y) {
      setDirection(dir);
    }
  };

  return (
    <div className="relative bg-background" style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}>
      <button onClick={onBack} className="absolute top-1 left-1 z-10 p-1 hover:bg-muted rounded">
        <ChevronLeft className="w-4 h-4 text-muted-foreground" />
      </button>
      <button onClick={resetGame} className="absolute top-1 right-6 z-10 p-1 hover:bg-muted rounded">
        <RotateCcw className="w-3 h-3 text-muted-foreground" />
      </button>

      <div className="absolute top-1 left-1/2 -translate-x-1/2 text-xs font-bold text-neon-green">
        {score} | Best: {highScore}
      </div>

      <div className="absolute top-8 left-1/2 -translate-x-1/2" style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}>
        <div className="relative w-full h-full bg-muted/30 rounded border border-neon-green/20">
          {snake.map((seg, i) => (
            <div
              key={i}
              className={`absolute rounded-sm ${i === 0 ? 'bg-neon-green' : 'bg-neon-green/70'}`}
              style={{ left: seg.x * CELL_SIZE, top: seg.y * CELL_SIZE, width: CELL_SIZE - 1, height: CELL_SIZE - 1 }}
            />
          ))}
          <div
            className="absolute rounded-full bg-neon-pink animate-pulse"
            style={{ left: food.x * CELL_SIZE, top: food.y * CELL_SIZE, width: CELL_SIZE - 1, height: CELL_SIZE - 1 }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 grid grid-cols-3 gap-1">
        <div />
        <button onClick={() => handleDirection({ x: 0, y: -1 })} className="p-2 bg-muted rounded hover:bg-muted/80">↑</button>
        <div />
        <button onClick={() => handleDirection({ x: -1, y: 0 })} className="p-2 bg-muted rounded hover:bg-muted/80">←</button>
        <button onClick={() => handleDirection({ x: 0, y: 1 })} className="p-2 bg-muted rounded hover:bg-muted/80">↓</button>
        <button onClick={() => handleDirection({ x: 1, y: 0 })} className="p-2 bg-muted rounded hover:bg-muted/80">→</button>
      </div>

      {!isPlaying && !gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
          <p className="text-sm font-medium">Use arrows to start!</p>
        </div>
      )}

      {gameOver && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="text-center">
            <p className="text-sm font-bold text-destructive mb-1">Game Over!</p>
            <p className="text-xs text-neon-green">Score: {score}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// ============= MEMORY GAME =============
const EMOJIS = ['🎮', '🚀', '⭐', '💎', '🔥', '💜', '🌙', '⚡'];

const MemoryGame = ({ onBack }: { onBack: () => void }) => {
  const [cards, setCards] = useState<{ emoji: string; flipped: boolean; matched: boolean }[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [bestMoves, setBestMoves] = useState(() => {
    const saved = localStorage.getItem('memoryBestMoves');
    return saved ? parseInt(saved) : 999;
  });

  const initGame = useCallback(() => {
    const shuffled = [...EMOJIS, ...EMOJIS].sort(() => Math.random() - 0.5);
    setCards(shuffled.map((emoji) => ({ emoji, flipped: false, matched: false })));
    setFlippedIndices([]);
    setMoves(0);
  }, []);

  useEffect(() => { initGame(); }, [initGame]);

  const handleClick = (index: number) => {
    if (flippedIndices.length === 2 || cards[index].flipped || cards[index].matched) return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [first, second] = newFlipped;
      if (cards[first].emoji === cards[second].emoji) {
        setTimeout(() => {
          const matched = [...cards];
          matched[first].matched = true;
          matched[second].matched = true;
          setCards(matched);
          setFlippedIndices([]);
          
          if (matched.every((c) => c.matched)) {
            const finalMoves = moves + 1;
            if (finalMoves < bestMoves) {
              setBestMoves(finalMoves);
              localStorage.setItem('memoryBestMoves', finalMoves.toString());
            }
          }
        }, 300);
      } else {
        setTimeout(() => {
          const reset = [...cards];
          reset[first].flipped = false;
          reset[second].flipped = false;
          setCards(reset);
          setFlippedIndices([]);
        }, 800);
      }
    }
  };

  const allMatched = cards.every((c) => c.matched);

  return (
    <div className="relative bg-background p-2" style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}>
      <div className="flex items-center justify-between mb-2">
        <button onClick={onBack} className="p-1 hover:bg-muted rounded">
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <span className="text-xs text-neon-purple">Moves: {moves} | Best: {bestMoves === 999 ? '-' : bestMoves}</span>
        <button onClick={initGame} className="p-1 hover:bg-muted rounded">
          <RotateCcw className="w-3 h-3 text-muted-foreground" />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-1.5 mt-4">
        {cards.map((card, i) => (
          <motion.button
            key={i}
            onClick={() => handleClick(i)}
            className={`aspect-square rounded-lg text-lg flex items-center justify-center transition-all ${
              card.flipped || card.matched ? 'bg-neon-purple/30' : 'bg-muted hover:bg-muted/80'
            } ${card.matched ? 'opacity-50' : ''}`}
            whileTap={{ scale: 0.95 }}
          >
            {(card.flipped || card.matched) && card.emoji}
          </motion.button>
        ))}
      </div>

      {allMatched && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="text-center">
            <p className="text-sm font-bold text-neon-purple mb-1">🎉 You Won!</p>
            <p className="text-xs">In {moves} moves</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// ============= REACTION GAME =============
const ReactionGame = ({ onBack }: { onBack: () => void }) => {
  const [state, setState] = useState<'waiting' | 'ready' | 'go' | 'result'>('waiting');
  const [startTime, setStartTime] = useState(0);
  const [reactionTime, setReactionTime] = useState(0);
  const [bestTime, setBestTime] = useState(() => {
    const saved = localStorage.getItem('reactionBest');
    return saved ? parseInt(saved) : 999;
  });
  const timeoutRef = useRef<NodeJS.Timeout>();

  const startGame = () => {
    setState('ready');
    const delay = 2000 + Math.random() * 3000;
    timeoutRef.current = setTimeout(() => {
      setState('go');
      setStartTime(Date.now());
    }, delay);
  };

  const handleClick = () => {
    if (state === 'waiting' || state === 'result') {
      startGame();
    } else if (state === 'ready') {
      clearTimeout(timeoutRef.current);
      setState('waiting');
    } else if (state === 'go') {
      const time = Date.now() - startTime;
      setReactionTime(time);
      if (time < bestTime) {
        setBestTime(time);
        localStorage.setItem('reactionBest', time.toString());
      }
      setState('result');
    }
  };

  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  return (
    <div className="relative" style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}>
      <button onClick={onBack} className="absolute top-2 left-2 z-10 p-1 hover:bg-muted rounded">
        <ChevronLeft className="w-4 h-4 text-muted-foreground" />
      </button>

      <div
        onClick={handleClick}
        className={`w-full h-full flex flex-col items-center justify-center cursor-pointer transition-colors ${
          state === 'waiting' || state === 'result' ? 'bg-neon-cyan/20' :
          state === 'ready' ? 'bg-neon-pink/30' :
          'bg-neon-green/40'
        }`}
      >
        {state === 'waiting' && (
          <div className="text-center">
            <Target className="w-10 h-10 text-neon-cyan mx-auto mb-2" />
            <p className="text-sm font-medium">Click to Start</p>
            <p className="text-xs text-muted-foreground mt-1">Best: {bestTime === 999 ? '-' : `${bestTime}ms`}</p>
          </div>
        )}
        {state === 'ready' && (
          <div className="text-center">
            <p className="text-lg font-bold text-neon-pink">Wait...</p>
            <p className="text-xs text-muted-foreground">Click when green!</p>
          </div>
        )}
        {state === 'go' && (
          <div className="text-center">
            <Zap className="w-12 h-12 text-neon-green mx-auto animate-pulse" />
            <p className="text-lg font-bold text-neon-green">CLICK NOW!</p>
          </div>
        )}
        {state === 'result' && (
          <div className="text-center">
            <p className="text-2xl font-bold text-neon-cyan">{reactionTime}ms</p>
            <p className="text-xs text-muted-foreground mt-1">Click to try again</p>
            <p className="text-xs text-neon-purple mt-2">Best: {bestTime}ms</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ============= MAIN COMPONENT =============
const FloatingGame = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentGame, setCurrentGame] = useState<GameType>('menu');

  const games = [
    { id: 'flappy' as GameType, name: 'Flappy Star', icon: Bird, color: 'text-neon-orange' },
    { id: 'snake' as GameType, name: 'Snake', icon: Grid3X3, color: 'text-neon-green' },
    { id: 'memory' as GameType, name: 'Memory', icon: Grid3X3, color: 'text-neon-purple' },
    { id: 'reaction' as GameType, name: 'Reaction', icon: Zap, color: 'text-neon-cyan' },
  ];

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-40 right-6 z-50 p-3 rounded-full glass-card border border-neon-cyan/40 hover:border-neon-cyan transition-all group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        title="Play Mini Games"
      >
        <Gamepad2 className="w-5 h-5 text-neon-cyan" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-40 right-20 z-50 glass-card border border-neon-cyan/40 rounded-xl overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between px-3 py-2 bg-background/80 border-b border-neon-cyan/20">
              <span className="text-xs font-medium text-neon-cyan">
                {currentGame === 'menu' ? 'Mini Games' : games.find(g => g.id === currentGame)?.name}
              </span>
              <button onClick={() => { setIsOpen(false); setCurrentGame('menu'); }} className="p-1 hover:bg-destructive/20 rounded">
                <X className="w-3 h-3 text-muted-foreground" />
              </button>
            </div>

            {currentGame === 'menu' ? (
              <div className="p-3 grid grid-cols-2 gap-2" style={{ width: CANVAS_WIDTH }}>
                {games.map((game) => (
                  <motion.button
                    key={game.id}
                    onClick={() => setCurrentGame(game.id)}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <game.icon className={`w-6 h-6 ${game.color}`} />
                    <span className="text-xs">{game.name}</span>
                  </motion.button>
                ))}
              </div>
            ) : currentGame === 'flappy' ? (
              <FlappyGame onBack={() => setCurrentGame('menu')} />
            ) : currentGame === 'snake' ? (
              <SnakeGame onBack={() => setCurrentGame('menu')} />
            ) : currentGame === 'memory' ? (
              <MemoryGame onBack={() => setCurrentGame('menu')} />
            ) : (
              <ReactionGame onBack={() => setCurrentGame('menu')} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingGame;
