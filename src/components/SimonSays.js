// SimonSays component for Sebastian's Silly App
const SimonSays = () => {
    const [sequence, setSequence] = React.useState([]);
    const [playerSequence, setPlayerSequence] = React.useState([]);
    const [isShowingSequence, setIsShowingSequence] = React.useState(false);
    const [activeColor, setActiveColor] = React.useState(null);
    const [gameStarted, setGameStarted] = React.useState(false);
    const [gameOver, setGameOver] = React.useState(false);
    const [score, setScore] = React.useState(0);
    const [highScore, setHighScore] = React.useState(() => {
        const saved = localStorage.getItem('sebastianSimonHighScore');
        return saved ? parseInt(saved) : 0;
    });
    const [level, setLevel] = React.useState(1);

    const colors = [
        { id: 0, name: 'red', bg: 'bg-red-500', activeBg: 'bg-red-300', sound: 261.63 },
        { id: 1, name: 'blue', bg: 'bg-blue-500', activeBg: 'bg-blue-300', sound: 329.63 },
        { id: 2, name: 'green', bg: 'bg-green-500', activeBg: 'bg-green-300', sound: 392.00 },
        { id: 3, name: 'yellow', bg: 'bg-yellow-500', activeBg: 'bg-yellow-300', sound: 523.25 }
    ];

    // Play sound for color
    const playSound = (frequency) => {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.4);
        } catch (error) {
            console.log('Audio not supported');
        }
    };

    // Add new color to sequence
    const addToSequence = React.useCallback(() => {
        const newColor = Math.floor(Math.random() * 4);
        setSequence(prev => [...prev, newColor]);
    }, []);

    // Show sequence to player
    const showSequence = React.useCallback(async (seq) => {
        setIsShowingSequence(true);
        setPlayerSequence([]);
        
        for (let i = 0; i < seq.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 600));
            
            setActiveColor(seq[i]);
            playSound(colors[seq[i]].sound);
            
            await new Promise(resolve => setTimeout(resolve, 400));
            setActiveColor(null);
        }
        
        setIsShowingSequence(false);
    }, [colors]);

    // Start new game
    const startGame = () => {
        const newSequence = [Math.floor(Math.random() * 4)];
        setSequence(newSequence);
        setPlayerSequence([]);
        setGameStarted(true);
        setGameOver(false);
        setScore(0);
        setLevel(1);
        showSequence(newSequence);
    };

    // Handle color click
    const handleColorClick = (colorId) => {
        if (isShowingSequence || gameOver || !gameStarted) return;

        playSound(colors[colorId].sound);
        setActiveColor(colorId);
        setTimeout(() => setActiveColor(null), 200);

        const newPlayerSequence = [...playerSequence, colorId];
        setPlayerSequence(newPlayerSequence);

        // Check if player made a mistake
        if (newPlayerSequence[newPlayerSequence.length - 1] !== sequence[newPlayerSequence.length - 1]) {
            setGameOver(true);
            setGameStarted(false);
            
            if (score > highScore) {
                setHighScore(score);
                localStorage.setItem('sebastianSimonHighScore', score.toString());
            }
            
            // Play error sound
            playSound(150);
            return;
        }

        // Check if player completed the sequence
        if (newPlayerSequence.length === sequence.length) {
            const newScore = score + sequence.length;
            setScore(newScore);
            setLevel(prev => prev + 1);
            
            // Add new color and show sequence after delay
            setTimeout(() => {
                addToSequence();
            }, 1000);
        }
    };

    // Show sequence when it updates
    React.useEffect(() => {
        if (sequence.length > 0 && gameStarted && !gameOver) {
            showSequence(sequence);
        }
    }, [sequence, gameStarted, gameOver, showSequence]);

    // Game speed increases with level
    const getGameSpeed = () => {
        return Math.max(200, 600 - (level * 50));
    };

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800 text-center">Simon Says 🔴</h3>
            
            {/* Score Display */}
            <div className="flex justify-between text-lg font-semibold">
                <span>Score: {score}</span>
                <span>Level: {level}</span>
                <span className="text-purple-600">High Score: {highScore}</span>
            </div>

            {/* Game Status */}
            <div className="text-center">
                {gameOver ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="text-xl font-bold text-red-600 mb-2">💥 Game Over!</div>
                        <div className="text-lg">Final Score: {score}</div>
                        <div className="text-sm text-gray-600">You reached level {level}</div>
                        {score === highScore && score > 0 && (
                            <div className="text-yellow-600 font-bold animate-pulse">🏆 New High Score!</div>
                        )}
                    </div>
                ) : gameStarted ? (
                    <div className="text-lg font-semibold">
                        {isShowingSequence ? (
                            <span className="text-blue-600 animate-pulse">👀 Watch the sequence...</span>
                        ) : (
                            <span className="text-green-600">🎯 Repeat the sequence!</span>
                        )}
                    </div>
                ) : (
                    <div className="text-lg text-gray-600">Press Start to begin!</div>
                )}
            </div>

            {/* Game Board */}
            <div className="flex justify-center">
                <div className="grid grid-cols-2 gap-4 w-64 h-64">
                    {colors.map((color) => (
                        <button
                            key={color.id}
                            onClick={() => handleColorClick(color.id)}
                            disabled={isShowingSequence || gameOver || !gameStarted}
                            className={`rounded-xl border-4 border-gray-300 transition-all duration-200 transform hover:scale-105 ${
                                activeColor === color.id ? color.activeBg : color.bg
                            } ${
                                isShowingSequence || gameOver || !gameStarted 
                                    ? 'cursor-not-allowed opacity-75' 
                                    : 'cursor-pointer hover:brightness-110 active:scale-95'
                            }`}
                        >
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="text-white text-4xl font-bold">
                                    {color.id === 0 && '🔴'}
                                    {color.id === 1 && '🔵'}
                                    {color.id === 2 && '🟢'}
                                    {color.id === 3 && '🟡'}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Progress Indicator */}
            {gameStarted && !gameOver && (
                <div className="bg-gray-100 rounded-lg p-3">
                    <div className="text-sm font-semibold text-gray-700 mb-2">
                        Progress: {playerSequence.length} / {sequence.length}
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-2">
                        <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(playerSequence.length / sequence.length) * 100}%` }}
                        ></div>
                    </div>
                </div>
            )}

            {/* Game Controls */}
            <div className="grid grid-cols-1 gap-3">
                {!gameStarted ? (
                    <button
                        onClick={startGame}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                        {gameOver ? '🔄 Play Again' : '🎮 Start Game'}
                    </button>
                ) : (
                    <button
                        onClick={() => {
                            setGameStarted(false);
                            setGameOver(true);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                        ⏹️ Stop Game
                    </button>
                )}
            </div>

            {/* Instructions */}
            <div className="text-center text-sm text-gray-600 bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="font-semibold mb-1">How to Play:</div>
                <div>🎵 Watch the sequence of colors and sounds</div>
                <div>🔁 Repeat the sequence in the same order</div>
                <div>📈 Each level adds one more color!</div>
            </div>
        </div>
    );
};