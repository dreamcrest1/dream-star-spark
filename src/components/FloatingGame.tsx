import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, X, RotateCcw, ChevronLeft, Bird, Zap, Grid3X3, Target, Hash, Circle, Palette, Calculator, MousePointer, Square } from 'lucide-react';

const CANVAS_WIDTH = 200;
const CANVAS_HEIGHT = 280;

type GameType = 'menu' | 'flappy' | 'snake' | 'memory' | 'reaction' | 'tictactoe' | 'pong' | 'colormatch' | 'mathquiz' | 'whackamole' | 'brickbreaker';

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

// ============= TIC TAC TOE GAME =============
const TicTacToeGame = ({ onBack }: { onBack: () => void }) => {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [wins, setWins] = useState(() => {
    const saved = localStorage.getItem('tictactoeWins');
    return saved ? parseInt(saved) : 0;
  });

  const checkWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const aiMove = useCallback((currentBoard: (string | null)[]) => {
    const empty = currentBoard.map((v, i) => v === null ? i : -1).filter(i => i !== -1);
    if (empty.length === 0) return;
    
    // Simple AI: try to win, block, or random
    for (const idx of empty) {
      const test = [...currentBoard];
      test[idx] = 'O';
      if (checkWinner(test) === 'O') {
        setTimeout(() => {
          setBoard(test);
          setWinner('O');
        }, 300);
        return;
      }
    }
    
    for (const idx of empty) {
      const test = [...currentBoard];
      test[idx] = 'X';
      if (checkWinner(test) === 'X') {
        const block = [...currentBoard];
        block[idx] = 'O';
        setTimeout(() => {
          setBoard(block);
          setIsPlayerTurn(true);
        }, 300);
        return;
      }
    }
    
    const randomIdx = empty[Math.floor(Math.random() * empty.length)];
    const newBoard = [...currentBoard];
    newBoard[randomIdx] = 'O';
    setTimeout(() => {
      setBoard(newBoard);
      if (checkWinner(newBoard) === 'O') {
        setWinner('O');
      } else {
        setIsPlayerTurn(true);
      }
    }, 300);
  }, []);

  const handleClick = (index: number) => {
    if (board[index] || winner || !isPlayerTurn) return;
    
    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    
    const win = checkWinner(newBoard);
    if (win) {
      setWinner(win);
      if (win === 'X') {
        const newWins = wins + 1;
        setWins(newWins);
        localStorage.setItem('tictactoeWins', newWins.toString());
      }
    } else if (!newBoard.includes(null)) {
      setWinner('draw');
    } else {
      setIsPlayerTurn(false);
      aiMove(newBoard);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setWinner(null);
  };

  return (
    <div className="relative bg-background p-3" style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}>
      <div className="flex items-center justify-between mb-2">
        <button onClick={onBack} className="p-1 hover:bg-muted rounded">
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <span className="text-xs text-neon-cyan">Wins: {wins}</span>
        <button onClick={resetGame} className="p-1 hover:bg-muted rounded">
          <RotateCcw className="w-3 h-3 text-muted-foreground" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-6 mx-auto" style={{ width: 150 }}>
        {board.map((cell, i) => (
          <motion.button
            key={i}
            onClick={() => handleClick(i)}
            className="aspect-square rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center text-2xl font-bold"
            whileTap={{ scale: 0.95 }}
          >
            {cell === 'X' && <span className="text-neon-cyan">X</span>}
            {cell === 'O' && <span className="text-neon-pink">O</span>}
          </motion.button>
        ))}
      </div>

      <p className="text-center text-xs mt-4 text-muted-foreground">
        {!winner && (isPlayerTurn ? 'Your turn (X)' : 'AI thinking...')}
      </p>

      {winner && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="text-center">
            <p className="text-sm font-bold mb-2">
              {winner === 'X' ? '🎉 You Won!' : winner === 'O' ? '😢 AI Wins!' : '🤝 Draw!'}
            </p>
            <button onClick={resetGame} className="text-xs text-neon-cyan underline">Play Again</button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// ============= PONG GAME =============
const PongGame = ({ onBack }: { onBack: () => void }) => {
  const [playerY, setPlayerY] = useState(120);
  const [aiY, setAiY] = useState(120);
  const [ball, setBall] = useState({ x: 100, y: 140, vx: 2, vy: 1.5 });
  const [score, setScore] = useState({ player: 0, ai: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const gameLoopRef = useRef<number>();

  const PADDLE_HEIGHT = 50;
  const PADDLE_WIDTH = 8;
  const BALL_SIZE = 8;

  const resetBall = useCallback((direction: number) => {
    setBall({ x: 100, y: 140, vx: 2 * direction, vy: (Math.random() - 0.5) * 3 });
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const gameLoop = () => {
      setBall((prev) => {
        let { x, y, vx, vy } = prev;
        x += vx;
        y += vy;

        // Top/bottom bounce
        if (y <= 0 || y >= CANVAS_HEIGHT - BALL_SIZE) vy = -vy;

        // Player paddle collision
        if (x <= PADDLE_WIDTH + 5 && y >= playerY && y <= playerY + PADDLE_HEIGHT) {
          vx = Math.abs(vx) * 1.05;
          vy += (y - playerY - PADDLE_HEIGHT / 2) * 0.1;
        }

        // AI paddle collision
        if (x >= CANVAS_WIDTH - PADDLE_WIDTH - 10 && y >= aiY && y <= aiY + PADDLE_HEIGHT) {
          vx = -Math.abs(vx) * 1.05;
          vy += (y - aiY - PADDLE_HEIGHT / 2) * 0.1;
        }

        // Score
        if (x <= 0) {
          setScore((s) => ({ ...s, ai: s.ai + 1 }));
          resetBall(1);
          return { x: 100, y: 140, vx: 2, vy: 1.5 };
        }
        if (x >= CANVAS_WIDTH) {
          setScore((s) => ({ ...s, player: s.player + 1 }));
          resetBall(-1);
          return { x: 100, y: 140, vx: -2, vy: 1.5 };
        }

        return { x, y, vx: Math.max(-6, Math.min(6, vx)), vy: Math.max(-4, Math.min(4, vy)) };
      });

      // Simple AI
      setAiY((prev) => {
        const target = ball.y - PADDLE_HEIGHT / 2;
        const speed = 2;
        if (prev < target) return Math.min(prev + speed, CANVAS_HEIGHT - PADDLE_HEIGHT);
        if (prev > target) return Math.max(prev - speed, 0);
        return prev;
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => { if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current); };
  }, [isPlaying, ball.y, playerY, aiY, resetBall]);

  const movePlayer = (dir: number) => {
    if (!isPlaying) setIsPlaying(true);
    setPlayerY((prev) => Math.max(0, Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, prev + dir * 20)));
  };

  return (
    <div className="relative bg-background" style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}>
      <button onClick={onBack} className="absolute top-1 left-1 z-10 p-1 hover:bg-muted rounded">
        <ChevronLeft className="w-4 h-4 text-muted-foreground" />
      </button>

      <div className="absolute top-1 left-1/2 -translate-x-1/2 text-xs font-bold">
        <span className="text-neon-cyan">{score.player}</span>
        <span className="text-muted-foreground mx-2">-</span>
        <span className="text-neon-pink">{score.ai}</span>
      </div>

      {/* Player paddle */}
      <div className="absolute bg-neon-cyan rounded" style={{ left: 5, top: playerY, width: PADDLE_WIDTH, height: PADDLE_HEIGHT }} />
      
      {/* AI paddle */}
      <div className="absolute bg-neon-pink rounded" style={{ right: 5, top: aiY, width: PADDLE_WIDTH, height: PADDLE_HEIGHT }} />
      
      {/* Ball */}
      <div className="absolute bg-white rounded-full" style={{ left: ball.x, top: ball.y, width: BALL_SIZE, height: BALL_SIZE }} />

      {/* Center line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-muted-foreground/30" style={{ borderLeft: '2px dashed' }} />

      {/* Controls */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-4">
        <button onClick={() => movePlayer(-1)} className="p-3 bg-muted rounded hover:bg-muted/80">↑</button>
        <button onClick={() => movePlayer(1)} className="p-3 bg-muted rounded hover:bg-muted/80">↓</button>
      </div>

      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
          <p className="text-sm font-medium">Use arrows to start!</p>
        </div>
      )}
    </div>
  );
};

// ============= COLOR MATCH GAME =============
const COLORS = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181'];

const ColorMatchGame = ({ onBack }: { onBack: () => void }) => {
  const [targetColor, setTargetColor] = useState(COLORS[0]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('colormatchHighScore');
    return saved ? parseInt(saved) : 0;
  });
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const newTarget = useCallback(() => {
    setTargetColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
  }, []);

  useEffect(() => {
    if (!isPlaying || gameOver) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameOver(true);
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('colormatchHighScore', score.toString());
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, gameOver, score, highScore]);

  const handleColorClick = (color: string) => {
    if (!isPlaying) {
      setIsPlaying(true);
      newTarget();
      return;
    }
    if (gameOver) return;
    
    if (color === targetColor) {
      setScore((s) => s + 1);
      newTarget();
    } else {
      setScore((s) => Math.max(0, s - 1));
    }
  };

  const resetGame = () => {
    setScore(0);
    setTimeLeft(30);
    setIsPlaying(false);
    setGameOver(false);
    newTarget();
  };

  return (
    <div className="relative bg-background p-3" style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}>
      <div className="flex items-center justify-between mb-2">
        <button onClick={onBack} className="p-1 hover:bg-muted rounded">
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <span className="text-xs text-neon-yellow">{timeLeft}s | Best: {highScore}</span>
        <button onClick={resetGame} className="p-1 hover:bg-muted rounded">
          <RotateCcw className="w-3 h-3 text-muted-foreground" />
        </button>
      </div>

      <div className="text-center my-4">
        <p className="text-xs text-muted-foreground mb-2">Match this color:</p>
        <div className="w-16 h-16 mx-auto rounded-lg shadow-lg" style={{ backgroundColor: targetColor }} />
        <p className="text-2xl font-bold text-neon-cyan mt-2">{score}</p>
      </div>

      <div className="grid grid-cols-5 gap-2 mt-4">
        {COLORS.map((color, i) => (
          <motion.button
            key={i}
            onClick={() => handleColorClick(color)}
            className="aspect-square rounded-lg shadow-md"
            style={{ backgroundColor: color }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>

      {!isPlaying && !gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
          <p className="text-sm font-medium">Click any color to start!</p>
        </div>
      )}

      {gameOver && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="text-center">
            <p className="text-sm font-bold text-neon-yellow mb-1">Time's Up!</p>
            <p className="text-xs">Score: {score}</p>
            <button onClick={resetGame} className="text-xs text-neon-cyan underline mt-2">Play Again</button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// ============= MATH QUIZ GAME =============
const MathQuizGame = ({ onBack }: { onBack: () => void }) => {
  const [problem, setProblem] = useState({ a: 0, b: 0, op: '+', answer: 0 });
  const [options, setOptions] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('mathquizHighScore');
    return saved ? parseInt(saved) : 0;
  });
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const generateProblem = useCallback(() => {
    const ops = ['+', '-', '×'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a = Math.floor(Math.random() * 12) + 1;
    let b = Math.floor(Math.random() * 12) + 1;
    let answer = 0;

    if (op === '+') answer = a + b;
    else if (op === '-') {
      if (a < b) [a, b] = [b, a];
      answer = a - b;
    } else answer = a * b;

    const wrongAnswers = new Set<number>();
    while (wrongAnswers.size < 3) {
      const wrong = answer + (Math.floor(Math.random() * 10) - 5);
      if (wrong !== answer && wrong >= 0) wrongAnswers.add(wrong);
    }

    const allOptions = [answer, ...wrongAnswers].sort(() => Math.random() - 0.5);
    setProblem({ a, b, op, answer });
    setOptions(allOptions);
  }, []);

  useEffect(() => {
    generateProblem();
  }, [generateProblem]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameOver(true);
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('mathquizHighScore', score.toString());
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, gameOver, score, highScore]);

  const handleAnswer = (answer: number) => {
    if (!isPlaying) {
      setIsPlaying(true);
    }
    if (gameOver) return;

    if (answer === problem.answer) {
      setScore((s) => s + 10 + streak * 2);
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }
    generateProblem();
  };

  const resetGame = () => {
    setScore(0);
    setStreak(0);
    setTimeLeft(60);
    setIsPlaying(false);
    setGameOver(false);
    generateProblem();
  };

  return (
    <div className="relative bg-background p-3" style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}>
      <div className="flex items-center justify-between mb-2">
        <button onClick={onBack} className="p-1 hover:bg-muted rounded">
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <span className="text-xs text-neon-green">{timeLeft}s | Best: {highScore}</span>
        <button onClick={resetGame} className="p-1 hover:bg-muted rounded">
          <RotateCcw className="w-3 h-3 text-muted-foreground" />
        </button>
      </div>

      <div className="text-center mt-4">
        <p className="text-xs text-muted-foreground">Streak: {streak} 🔥</p>
        <p className="text-3xl font-bold my-4">
          {problem.a} {problem.op} {problem.b} = ?
        </p>
        <p className="text-2xl font-bold text-neon-cyan">{score}</p>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-6">
        {options.map((opt, i) => (
          <motion.button
            key={i}
            onClick={() => handleAnswer(opt)}
            className="py-3 rounded-lg bg-muted hover:bg-muted/80 text-lg font-bold"
            whileTap={{ scale: 0.95 }}
          >
            {opt}
          </motion.button>
        ))}
      </div>

      {!isPlaying && !gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
          <p className="text-sm font-medium">Click an answer to start!</p>
        </div>
      )}

      {gameOver && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="text-center">
            <p className="text-sm font-bold text-neon-green mb-1">Time's Up!</p>
            <p className="text-xs">Score: {score}</p>
            <button onClick={resetGame} className="text-xs text-neon-cyan underline mt-2">Play Again</button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// ============= WHACK A MOLE GAME =============
const WhackAMoleGame = ({ onBack }: { onBack: () => void }) => {
  const [moles, setMoles] = useState<boolean[]>(Array(9).fill(false));
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('whackamoleHighScore');
    return saved ? parseInt(saved) : 0;
  });
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const moleInterval = setInterval(() => {
      setMoles((prev) => {
        const newMoles = Array(9).fill(false);
        const numMoles = Math.min(3, Math.floor(score / 5) + 1);
        for (let i = 0; i < numMoles; i++) {
          newMoles[Math.floor(Math.random() * 9)] = true;
        }
        return newMoles;
      });
    }, 800);

    return () => clearInterval(moleInterval);
  }, [isPlaying, gameOver, score]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameOver(true);
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('whackamoleHighScore', score.toString());
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, gameOver, score, highScore]);

  const whackMole = (index: number) => {
    if (!isPlaying) {
      setIsPlaying(true);
      return;
    }
    if (gameOver) return;

    if (moles[index]) {
      setScore((s) => s + 1);
      setMoles((prev) => {
        const newMoles = [...prev];
        newMoles[index] = false;
        return newMoles;
      });
    }
  };

  const resetGame = () => {
    setMoles(Array(9).fill(false));
    setScore(0);
    setTimeLeft(30);
    setIsPlaying(false);
    setGameOver(false);
  };

  return (
    <div className="relative bg-background p-3" style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}>
      <div className="flex items-center justify-between mb-2">
        <button onClick={onBack} className="p-1 hover:bg-muted rounded">
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <span className="text-xs text-neon-orange">{timeLeft}s | Best: {highScore}</span>
        <button onClick={resetGame} className="p-1 hover:bg-muted rounded">
          <RotateCcw className="w-3 h-3 text-muted-foreground" />
        </button>
      </div>

      <p className="text-center text-2xl font-bold text-neon-cyan mb-4">{score}</p>

      <div className="grid grid-cols-3 gap-2 mx-auto" style={{ width: 160 }}>
        {moles.map((isMole, i) => (
          <motion.button
            key={i}
            onClick={() => whackMole(i)}
            className={`aspect-square rounded-lg flex items-center justify-center text-2xl transition-colors ${
              isMole ? 'bg-neon-orange' : 'bg-muted hover:bg-muted/80'
            }`}
            whileTap={{ scale: 0.9 }}
          >
            {isMole && '🐹'}
          </motion.button>
        ))}
      </div>

      {!isPlaying && !gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
          <p className="text-sm font-medium">Click any hole to start!</p>
        </div>
      )}

      {gameOver && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="text-center">
            <p className="text-sm font-bold text-neon-orange mb-1">Time's Up!</p>
            <p className="text-xs">Score: {score}</p>
            <button onClick={resetGame} className="text-xs text-neon-cyan underline mt-2">Play Again</button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// ============= BRICK BREAKER GAME =============
const BrickBreakerGame = ({ onBack }: { onBack: () => void }) => {
  const [paddleX, setPaddleX] = useState(75);
  const [ball, setBall] = useState({ x: 100, y: 200, vx: 2, vy: -2 });
  const [bricks, setBricks] = useState<boolean[][]>([]);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const gameLoopRef = useRef<number>();

  const PADDLE_WIDTH = 50;
  const PADDLE_HEIGHT = 8;
  const BALL_SIZE = 6;
  const BRICK_ROWS = 4;
  const BRICK_COLS = 5;
  const BRICK_WIDTH = 36;
  const BRICK_HEIGHT = 12;

  const initBricks = useCallback(() => {
    const newBricks = Array(BRICK_ROWS).fill(null).map(() => Array(BRICK_COLS).fill(true));
    setBricks(newBricks);
  }, []);

  useEffect(() => {
    initBricks();
  }, [initBricks]);

  useEffect(() => {
    if (!isPlaying || gameOver || won) return;

    const gameLoop = () => {
      setBall((prev) => {
        let { x, y, vx, vy } = prev;
        x += vx;
        y += vy;

        // Wall bounces
        if (x <= 0 || x >= CANVAS_WIDTH - BALL_SIZE) vx = -vx;
        if (y <= 30) vy = -vy;

        // Paddle collision
        if (y >= CANVAS_HEIGHT - 30 && y <= CANVAS_HEIGHT - 20 && x >= paddleX && x <= paddleX + PADDLE_WIDTH) {
          vy = -Math.abs(vy);
          vx += (x - paddleX - PADDLE_WIDTH / 2) * 0.1;
        }

        // Game over
        if (y >= CANVAS_HEIGHT) {
          setGameOver(true);
          return prev;
        }

        // Brick collision
        setBricks((prevBricks) => {
          const newBricks = prevBricks.map((row) => [...row]);
          let hitBrick = false;

          for (let r = 0; r < BRICK_ROWS; r++) {
            for (let c = 0; c < BRICK_COLS; c++) {
              if (newBricks[r][c]) {
                const brickX = c * (BRICK_WIDTH + 4) + 8;
                const brickY = r * (BRICK_HEIGHT + 4) + 40;

                if (x >= brickX && x <= brickX + BRICK_WIDTH && y >= brickY && y <= brickY + BRICK_HEIGHT) {
                  newBricks[r][c] = false;
                  hitBrick = true;
                  setScore((s) => s + 10);
                }
              }
            }
          }

          if (hitBrick) vy = -vy;

          // Check win
          if (newBricks.every((row) => row.every((b) => !b))) {
            setWon(true);
          }

          return newBricks;
        });

        return { x, y, vx: Math.max(-4, Math.min(4, vx)), vy };
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => { if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current); };
  }, [isPlaying, gameOver, won, paddleX]);

  const movePaddle = (dir: number) => {
    if (!isPlaying) setIsPlaying(true);
    setPaddleX((prev) => Math.max(0, Math.min(CANVAS_WIDTH - PADDLE_WIDTH, prev + dir * 20)));
  };

  const resetGame = () => {
    setPaddleX(75);
    setBall({ x: 100, y: 200, vx: 2, vy: -2 });
    initBricks();
    setScore(0);
    setIsPlaying(false);
    setGameOver(false);
    setWon(false);
  };

  return (
    <div className="relative bg-background" style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}>
      <button onClick={onBack} className="absolute top-1 left-1 z-10 p-1 hover:bg-muted rounded">
        <ChevronLeft className="w-4 h-4 text-muted-foreground" />
      </button>
      <button onClick={resetGame} className="absolute top-1 right-6 z-10 p-1 hover:bg-muted rounded">
        <RotateCcw className="w-3 h-3 text-muted-foreground" />
      </button>

      <div className="absolute top-1 left-1/2 -translate-x-1/2 text-xs font-bold text-neon-purple">{score}</div>

      {/* Bricks */}
      {bricks.map((row, r) =>
        row.map((brick, c) =>
          brick && (
            <div
              key={`${r}-${c}`}
              className="absolute rounded-sm"
              style={{
                left: c * (BRICK_WIDTH + 4) + 8,
                top: r * (BRICK_HEIGHT + 4) + 40,
                width: BRICK_WIDTH,
                height: BRICK_HEIGHT,
                backgroundColor: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3'][r],
              }}
            />
          )
        )
      )}

      {/* Ball */}
      <div className="absolute bg-white rounded-full" style={{ left: ball.x, top: ball.y, width: BALL_SIZE, height: BALL_SIZE }} />

      {/* Paddle */}
      <div className="absolute bg-neon-cyan rounded" style={{ left: paddleX, bottom: 20, width: PADDLE_WIDTH, height: PADDLE_HEIGHT }} />

      {/* Controls */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-4">
        <button onClick={() => movePaddle(-1)} className="p-2 bg-muted rounded hover:bg-muted/80">←</button>
        <button onClick={() => movePaddle(1)} className="p-2 bg-muted rounded hover:bg-muted/80">→</button>
      </div>

      {!isPlaying && !gameOver && !won && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
          <p className="text-sm font-medium">Use arrows to start!</p>
        </div>
      )}

      {(gameOver || won) && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="text-center">
            <p className="text-sm font-bold mb-1">{won ? '🎉 You Won!' : '😢 Game Over!'}</p>
            <p className="text-xs">Score: {score}</p>
            <button onClick={resetGame} className="text-xs text-neon-cyan underline mt-2">Play Again</button>
          </div>
        </motion.div>
      )}
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
    { id: 'tictactoe' as GameType, name: 'Tic-Tac-Toe', icon: Hash, color: 'text-neon-pink' },
    { id: 'pong' as GameType, name: 'Pong', icon: Circle, color: 'text-neon-yellow' },
    { id: 'colormatch' as GameType, name: 'Color Match', icon: Palette, color: 'text-neon-orange' },
    { id: 'mathquiz' as GameType, name: 'Math Quiz', icon: Calculator, color: 'text-neon-green' },
    { id: 'whackamole' as GameType, name: 'Whack-a-Mole', icon: MousePointer, color: 'text-neon-cyan' },
    { id: 'brickbreaker' as GameType, name: 'Brick Breaker', icon: Square, color: 'text-neon-purple' },
  ];

  const renderGame = () => {
    switch (currentGame) {
      case 'flappy': return <FlappyGame onBack={() => setCurrentGame('menu')} />;
      case 'snake': return <SnakeGame onBack={() => setCurrentGame('menu')} />;
      case 'memory': return <MemoryGame onBack={() => setCurrentGame('menu')} />;
      case 'reaction': return <ReactionGame onBack={() => setCurrentGame('menu')} />;
      case 'tictactoe': return <TicTacToeGame onBack={() => setCurrentGame('menu')} />;
      case 'pong': return <PongGame onBack={() => setCurrentGame('menu')} />;
      case 'colormatch': return <ColorMatchGame onBack={() => setCurrentGame('menu')} />;
      case 'mathquiz': return <MathQuizGame onBack={() => setCurrentGame('menu')} />;
      case 'whackamole': return <WhackAMoleGame onBack={() => setCurrentGame('menu')} />;
      case 'brickbreaker': return <BrickBreakerGame onBack={() => setCurrentGame('menu')} />;
      default: return null;
    }
  };

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
              <div className="p-3 grid grid-cols-2 gap-2 max-h-[320px] overflow-y-auto" style={{ width: CANVAS_WIDTH }}>
                {games.map((game) => (
                  <motion.button
                    key={game.id}
                    onClick={() => setCurrentGame(game.id)}
                    className="flex flex-col items-center gap-1 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <game.icon className={`w-5 h-5 ${game.color}`} />
                    <span className="text-[10px]">{game.name}</span>
                  </motion.button>
                ))}
              </div>
            ) : renderGame()}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingGame;
