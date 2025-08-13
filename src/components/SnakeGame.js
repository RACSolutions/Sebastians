// SnakeGame component for Sebastian's Silly App
const SnakeGame = () => {
    const [snake, setSnake] = React.useState([{ x: 10, y: 10 }]);
    const [food, setFood] = React.useState({ x: 5, y: 5 });
    const [direction, setDirection] = React.useState({ x: 0, y: 0 });
    const [gameRunning, setGameRunning] = React.useState(false);
    const [score, setScore] = React.useState(0);
    const [gameOver, setGameOver] = React.useState(false);
    const [highScore, setHighScore] = React.useState(() => {
        const saved = localStorage.getItem('sebastianSnakeHighScore');
        return saved ? parseInt(saved) : 0;
    });

    const BOARD_SIZE = 20;
    const GAME_SPEED = 150;

    // Generate random food position
    const generateFood = React.useCallback(() => {
        return {
            x: Math.floor(Math.random() * BOARD_SIZE),
            y: Math.floor(Math.random() * BOARD_SIZE)
        };
    }, []);

    // Game loop
    React.useEffect(() => {
        if (!gameRunning) return;

        const gameInterval = setInterval(() => {
            setSnake(prevSnake => {
                const newSnake = [...prevSnake];
                const head = { ...newSnake[0] };
                
                head.x += direction.x;
                head.y += direction.y;

                // Check wall collision
                if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
                    setGameOver(true);
                    setGameRunning(false);
                    return prevSnake;
                }

                // Check self collision
                if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
                    setGameOver(true);
                    setGameRunning(false);
                    return prevSnake;
                }

                newSnake.unshift(head);

                // Check food collision
                if (head.x === food.x && head.y === food.y) {
                    setScore(prev => prev + 10);
                    setFood(generateFood());
                    
                    // Play eating sound
                    if (window.playPopSound) {
                        window.playPopSound();
                    }
                } else {
                    newSnake.pop();
                }

                return newSnake;
            });
        }, GAME_SPEED);

        return () => clearInterval(gameInterval);
    }, [gameRunning, direction, food, generateFood]);

    // Handle keyboard input
    React.useEffect(() => {
        const handleKeyPress = (e) => {
            if (!gameRunning) return;

            switch (e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    e.preventDefault();
                    setDirection(prev => prev.y !== 1 ? { x: 0, y: -1 } : prev);
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    e.preventDefault();
                    setDirection(prev => prev.y !== -1 ? { x: 0, y: 1 } : prev);
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    e.preventDefault();
                    setDirection(prev => prev.x !== 1 ? { x: -1, y: 0 } : prev);
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    e.preventDefault();
                    setDirection(prev => prev.x !== -1 ? { x: 1, y: 0 } : prev);
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [gameRunning]);

    const startGame = () => {
        setSnake([{ x: 10, y: 10 }]);
        setFood(generateFood());
        setDirection({ x: 1, y: 0 });
        setScore(0);
        setGameRunning(true);
        setGameOver(false);
    };

    const stopGame = () => {
        setGameRunning(false);
        if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('sebastianSnakeHighScore', score.toString());
        }
    };

    // Touch controls for mobile
    const handleDirectionClick = (newDirection) => {
        if (!gameRunning) return;
        
        setDirection(prev => {
            // Prevent reversing into self
            if (newDirection.x === -prev.x && newDirection.y === -prev.y) {
                return prev;
            }
            return newDirection;
        });
    };

    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 text-center">Snake Game 🐍</h3>
            
            {/* Score Display */}
            <div className="flex justify-between items-center bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">{score}</div>
                    <div className="text-sm text-gray-500 font-medium">Score</div>
                </div>
                <div className="text-center">
                    <div className="text-lg font-semibold text-gray-700">{snake.length}</div>
                    <div className="text-sm text-gray-500 font-medium">Length</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{highScore}</div>
                    <div className="text-sm text-gray-500 font-medium">Best</div>
                </div>
            </div>

            {/* Game Board */}
            <div className="flex justify-center">
                <div className="relative">
                    <div 
                        className="inline-grid bg-gradient-to-br from-emerald-900 to-green-900 rounded-3xl p-3 shadow-2xl border-4 border-emerald-800"
                        style={{ 
                            gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
                            gap: '1px',
                            width: '400px',
                            height: '400px'
                        }}
                    >
                        {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, index) => {
                            const x = index % BOARD_SIZE;
                            const y = Math.floor(index / BOARD_SIZE);
                            
                            const isSnake = snake.some(segment => segment.x === x && segment.y === y);
                            const isHead = snake[0] && snake[0].x === x && snake[0].y === y;
                            const isFood = food.x === x && food.y === y;
                            
                            return (
                                <div
                                    key={index}
                                    className={`flex items-center justify-center transition-all duration-200 ${
                                        isHead ? 'bg-gradient-to-br from-yellow-300 to-orange-400 shadow-lg' :
                                        isSnake ? 'bg-gradient-to-br from-emerald-400 to-green-500 shadow-md' :
                                        isFood ? 'bg-gradient-to-br from-red-400 to-rose-500 shadow-lg animate-pulse' :
                                        (x + y) % 2 === 0 ? 'bg-emerald-50/90' : 'bg-emerald-100/90'
                                    }`}
                                    style={{
                                        width: `${(400 - 24 - 19) / BOARD_SIZE}px`, // Account for padding and gaps
                                        height: `${(400 - 24 - 19) / BOARD_SIZE}px`,
                                        borderRadius: isSnake || isFood ? '6px' : '2px'
                                    }}
                                >
                                    {isFood && <span className="text-white text-xs">🍎</span>}
                                    {isHead && <span className="text-orange-800 text-xs font-bold">●</span>}
                                </div>
                            );
                        })}
                    </div>
                    
                    {/* Game Status Overlay */}
                    {!gameRunning && !gameOver && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-3xl backdrop-blur-sm">
                            <div className="text-white text-xl font-bold">Press Start to Play!</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Controls */}
            <div className="flex justify-center">
                <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                    <div className="grid grid-cols-3 gap-3">
                        <div></div>
                        <button
                            onClick={() => handleDirectionClick({ x: 0, y: -1 })}
                            className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-40 disabled:hover:scale-100 flex items-center justify-center"
                            disabled={!gameRunning}
                        >
                            <span className="text-lg">↑</span>
                        </button>
                        <div></div>
                        
                        <button
                            onClick={() => handleDirectionClick({ x: -1, y: 0 })}
                            className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-40 disabled:hover:scale-100 flex items-center justify-center"
                            disabled={!gameRunning}
                        >
                            <span className="text-lg">←</span>
                        </button>
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl shadow-inner flex items-center justify-center">
                            <span className="text-gray-600 text-lg">🕹</span>
                        </div>
                        <button
                            onClick={() => handleDirectionClick({ x: 1, y: 0 })}
                            className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-40 disabled:hover:scale-100 flex items-center justify-center"
                            disabled={!gameRunning}
                        >
                            <span className="text-lg">→</span>
                        </button>
                        
                        <div></div>
                        <button
                            onClick={() => handleDirectionClick({ x: 0, y: 1 })}
                            className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-40 disabled:hover:scale-100 flex items-center justify-center"
                            disabled={!gameRunning}
                        >
                            <span className="text-lg">↓</span>
                        </button>
                        <div></div>
                    </div>
                </div>
            </div>

            {/* Game Controls */}
            <div className="grid grid-cols-2 gap-4">
                {!gameRunning ? (
                    <button
                        onClick={startGame}
                        className="col-span-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-200 hover:scale-105 shadow-lg text-lg"
                    >
                        {gameOver ? '🔄 Play Again' : '🎮 Start Game'}
                    </button>
                ) : (
                    <button
                        onClick={stopGame}
                        className="col-span-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-200 hover:scale-105 shadow-lg text-lg"
                    >
                        ⏹️ Stop Game
                    </button>
                )}
            </div>

            {/* Game Over Message */}
            {gameOver && (
                <div className="text-center bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 shadow-lg border-2 border-red-200">
                    <div className="text-5xl mb-4">💥</div>
                    <div className="text-2xl font-bold text-red-600 mb-3">Game Over!</div>
                    <div className="bg-white rounded-xl p-4 mb-4">
                        <div className="text-lg font-semibold text-gray-700 mb-1">Final Score: <span className="text-emerald-600">{score}</span></div>
                        <div className="text-sm text-gray-600">Snake Length: {snake.length} • Apples Eaten: {score / 10}</div>
                    </div>
                    {score === highScore && score > 0 && (
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold py-2 px-4 rounded-xl animate-pulse shadow-lg">
                            🏆 New High Score! 🏆
                        </div>
                    )}
                </div>
            )}

            {/* Instructions */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-200 shadow-sm">
                <div className="text-center">
                    <div className="text-lg font-bold text-emerald-800 mb-3 flex items-center justify-center gap-2">
                        🎮 <span>How to Play</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-emerald-700">
                        <div className="flex items-center gap-2">
                            <span className="text-lg">🐍</span>
                            <span>Control your snake to eat apples</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-lg">📈</span>
                            <span>Grow longer and score points</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-lg">⌨️</span>
                            <span>Use arrow keys or touch controls</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-lg">❌</span>
                            <span>Avoid walls and your own tail!</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};