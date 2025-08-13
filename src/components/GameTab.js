// GameTab component for Sebastian's Silly App
const GameTab = () => {
    const [score, setScore] = React.useState(0);
    const [timeLeft, setTimeLeft] = React.useState(30);
    const [gameActive, setGameActive] = React.useState(false);
    const [emojiPosition, setEmojiPosition] = React.useState({ x: 50, y: 50 });
    const [currentEmoji, setCurrentEmoji] = React.useState('🎈');
    const [popEffect, setPopEffect] = React.useState({ show: false, x: 0, y: 0 });
    const [emojiVisible, setEmojiVisible] = React.useState(true);
    const [highScore, setHighScore] = React.useState(() => {
        const saved = localStorage.getItem('sebastianHighScore');
        return saved ? parseInt(saved) : 0;
    });

    const emojis = ['🎈', '🎉', '⭐', '🍎', '🍌', '🐸', '🌈', '⚽', '🎯', '🎊'];

    // Progressive difficulty - emoji stays visible for less time as score increases
    const getEmojiDisplayTime = (currentScore) => {
        const baseTime = 3000; // Start at 3 seconds
        const minTime = 800;   // Minimum 0.8 seconds
        const reduction = Math.floor(currentScore / 3) * 200; // Reduce by 200ms every 3 points
        return Math.max(minTime, baseTime - reduction);
    };

    const gameTimerRef = React.useRef(null);
    const emojiTimerRef = React.useRef(null);

    // Main game timer
    React.useEffect(() => {
        if (gameActive) {
            gameTimerRef.current = setInterval(() => {
                setTimeLeft(prevTime => {
                    if (prevTime <= 1) {
                        setGameActive(false);
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }

        return () => {
            if (gameTimerRef.current) {
                clearInterval(gameTimerRef.current);
            }
        };
    }, [gameActive]);

    // Handle game end
    React.useEffect(() => {
        if (!gameActive && timeLeft === 0) {
            if (score > highScore) {
                setHighScore(score);
                localStorage.setItem('sebastianHighScore', score.toString());
            }
            if (emojiTimerRef.current) {
                clearTimeout(emojiTimerRef.current);
            }
        }
    }, [gameActive, timeLeft, score, highScore]);

    const startGame = () => {
        if (gameTimerRef.current) {
            clearInterval(gameTimerRef.current);
        }
        if (emojiTimerRef.current) {
            clearTimeout(emojiTimerRef.current);
        }

        setScore(0);
        setTimeLeft(30);
        setGameActive(true);
        setEmojiVisible(true);
        moveEmoji();
    };

    const moveEmoji = () => {
        if (!gameActive) return;

        setEmojiPosition({
            x: Math.random() * 70 + 15,
            y: Math.random() * 60 + 20
        });
        setCurrentEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
        setEmojiVisible(true);

        const displayTime = getEmojiDisplayTime(score);
        emojiTimerRef.current = setTimeout(() => {
            setEmojiVisible(false);
            setTimeout(() => {
                if (gameActive) moveEmoji();
            }, 500);
        }, displayTime);
    };

    const popEmoji = (e) => {
        if (gameActive && emojiVisible) {
            // Use the global playPopSound function
            if (window.playPopSound) {
                window.playPopSound();
            }
            
            const rect = e.currentTarget.parentElement.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            setPopEffect({ show: true, x, y });
            setTimeout(() => setPopEffect({ show: false, x: 0, y: 0 }), 600);
            
            setScore(prevScore => prevScore + 1);
            
            if (emojiTimerRef.current) {
                clearTimeout(emojiTimerRef.current);
            }
            setTimeout(() => {
                if (gameActive) moveEmoji();
            }, 100);
        }
    };

    // Cleanup on unmount
    React.useEffect(() => {
        return () => {
            if (gameTimerRef.current) {
                clearInterval(gameTimerRef.current);
            }
            if (emojiTimerRef.current) {
                clearTimeout(emojiTimerRef.current);
            }
        };
    }, []);

    const difficultyLevel = Math.floor(score / 3) + 1;
    const currentDisplayTime = getEmojiDisplayTime(score);

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800 text-center">Emoji Pop!</h3>
            
            <div className="flex justify-between text-lg font-semibold">
                <span>Score: {score}</span>
                <span className={timeLeft <= 5 ? 'text-red-500 animate-pulse' : ''}>
                    Time: {timeLeft}s
                </span>
            </div>
            
            <div className="text-center space-y-1">
                <div className="text-sm font-semibold text-purple-600">
                    🏆 High Score: {highScore}
                </div>
                {gameActive && (
                    <div className="text-xs text-gray-600">
                        Level {difficultyLevel} • {(currentDisplayTime/1000).toFixed(1)}s display time
                    </div>
                )}
            </div>
            
            {!gameActive ? (
                <div className="space-y-3">
                    <button
                        onClick={startGame}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 w-full"
                    >
                        🎮 Start Game
                    </button>
                    <div className="text-xs text-gray-500 text-center">
                        Starts easy, gets harder! Emojis disappear faster as you score more.
                    </div>
                </div>
            ) : (
                <div className="w-full px-2">
                    <div 
                        className="relative bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg border-2 border-dashed border-blue-300 w-full mx-auto"
                        style={{ height: '180px' }}
                    >
                        {emojiVisible && (
                            <div
                                onClick={popEmoji}
                                className="absolute w-16 h-16 cursor-pointer hover:scale-110 transition-all duration-200 flex items-center justify-center text-4xl animate-bounce select-none"
                                style={{ 
                                    left: `${emojiPosition.x}%`, 
                                    top: `${emojiPosition.y}%`,
                                    transform: 'translate(-50%, -50%)'
                                }}
                            >
                                {currentEmoji}
                            </div>
                        )}
                        
                        {popEffect.show && (
                            <div 
                                className="absolute pointer-events-none"
                                style={{ left: popEffect.x, top: popEffect.y, transform: 'translate(-50%, -50%)' }}
                            >
                                <div className="text-6xl animate-ping">💥</div>
                                <div className="text-2xl font-bold text-yellow-500 animate-bounce absolute top-8 left-1/2 transform -translate-x-1/2">
                                    +1
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            {timeLeft === 0 && !gameActive && (
                <div className="text-center space-y-2">
                    <div className="text-xl font-bold text-purple-600">
                        Game Over! Final Score: {score}
                    </div>
                    <div className="text-sm text-gray-600">
                        Reached Level {difficultyLevel}!
                    </div>
                    {score === highScore && score > 0 && (
                        <div className="text-lg font-bold text-yellow-500 animate-pulse">
                            🎉 NEW HIGH SCORE! 🎉
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};