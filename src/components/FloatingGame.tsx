import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, X, RotateCcw } from 'lucide-react';

const CANVAS_WIDTH = 200;
const CANVAS_HEIGHT = 280;
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

const FloatingGame = () => {
  const [isOpen, setIsOpen] = useState(false);
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
    if (!isPlaying) {
      setIsPlaying(true);
    }
    setBirdVelocity(JUMP_FORCE);
  }, [gameOver, isPlaying, resetGame]);

  useEffect(() => {
    if (!isOpen || !isPlaying || gameOver) return;

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

        // Add new pipe
        if (newPipes.length === 0 || newPipes[newPipes.length - 1].x < CANVAS_WIDTH - 100) {
          newPipes.push({
            x: CANVAS_WIDTH,
            topHeight: Math.random() * (CANVAS_HEIGHT - PIPE_GAP - 60) + 30,
            passed: false,
          });
        }

        // Check collisions and score
        newPipes = newPipes.map((pipe) => {
          const birdLeft = 30;
          const birdRight = birdLeft + BIRD_SIZE;
          const birdTop = birdY;
          const birdBottom = birdY + BIRD_SIZE;

          const pipeLeft = pipe.x;
          const pipeRight = pipe.x + PIPE_WIDTH;

          if (birdRight > pipeLeft && birdLeft < pipeRight) {
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

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [isOpen, isPlaying, gameOver, birdVelocity, birdY, highScore]);

  return (
    <>
      {/* Game Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-40 right-6 z-50 p-3 rounded-full glass-card border border-neon-cyan/40 hover:border-neon-cyan transition-all group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        title="Play Mini Game"
      >
        <Gamepad2 className="w-5 h-5 text-neon-cyan" />
      </motion.button>

      {/* Game Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-40 right-20 z-50 glass-card border border-neon-cyan/40 rounded-xl overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 bg-background/80 border-b border-neon-cyan/20">
              <span className="text-xs font-medium text-neon-cyan">Flappy Star</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={resetGame}
                  className="p-1 hover:bg-neon-cyan/20 rounded transition-colors"
                  title="Reset"
                >
                  <RotateCcw className="w-3 h-3 text-muted-foreground" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-destructive/20 rounded transition-colors"
                >
                  <X className="w-3 h-3 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Game Canvas */}
            <div
              className="relative bg-gradient-to-b from-background via-background/90 to-neon-purple/10 cursor-pointer select-none"
              style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
              onClick={jump}
              onKeyDown={(e) => e.key === ' ' && jump()}
              tabIndex={0}
            >
              {/* Score */}
              <div className="absolute top-2 left-2 text-xs font-bold text-neon-cyan">
                Score: {score}
              </div>
              <div className="absolute top-2 right-2 text-xs text-muted-foreground">
                Best: {highScore}
              </div>

              {/* Bird */}
              <motion.div
                className="absolute w-5 h-5 rounded-full bg-gradient-to-br from-neon-yellow to-neon-orange shadow-lg"
                style={{
                  left: 30,
                  top: birdY,
                  transform: `rotate(${Math.min(birdVelocity * 3, 45)}deg)`,
                }}
              >
                <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-white" />
              </motion.div>

              {/* Pipes */}
              {pipes.map((pipe, index) => (
                <div key={index}>
                  {/* Top pipe */}
                  <div
                    className="absolute bg-gradient-to-b from-neon-green to-neon-green/70 rounded-b-md"
                    style={{
                      left: pipe.x,
                      top: 0,
                      width: PIPE_WIDTH,
                      height: pipe.topHeight,
                    }}
                  />
                  {/* Bottom pipe */}
                  <div
                    className="absolute bg-gradient-to-t from-neon-green to-neon-green/70 rounded-t-md"
                    style={{
                      left: pipe.x,
                      top: pipe.topHeight + PIPE_GAP,
                      width: PIPE_WIDTH,
                      height: CANVAS_HEIGHT - pipe.topHeight - PIPE_GAP,
                    }}
                  />
                </div>
              ))}

              {/* Start/Game Over Overlay */}
              {!isPlaying && !gameOver && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground mb-1">Click to Start!</p>
                    <p className="text-xs text-muted-foreground">Tap to fly</p>
                  </div>
                </div>
              )}

              {gameOver && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm"
                >
                  <div className="text-center">
                    <p className="text-sm font-bold text-destructive mb-1">Game Over!</p>
                    <p className="text-xs text-muted-foreground mb-2">Score: {score}</p>
                    <p className="text-xs text-neon-cyan">Click to retry</p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingGame;
