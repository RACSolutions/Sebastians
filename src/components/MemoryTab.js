// MemoryTab component for Sebastian's Silly App
const MemoryTab = () => {
    const [cards, setCards] = React.useState([]);
    const [flippedCards, setFlippedCards] = React.useState([]);
    const [matchedCards, setMatchedCards] = React.useState([]);
    const [moves, setMoves] = React.useState(0);
    const [gameStarted, setGameStarted] = React.useState(false);
    const [gameCompleted, setGameCompleted] = React.useState(false);
    const [difficulty, setDifficulty] = React.useState('easy');
    const [startTime, setStartTime] = React.useState(null);
    const [endTime, setEndTime] = React.useState(null);
    const [bestTimes, setBestTimes] = React.useState(() => {
        const saved = localStorage.getItem('sebastianMemoryBestTimes');
        return saved ? JSON.parse(saved) : { easy: null, medium: null, hard: null };
    });

    // Emoji sets for different difficulties
    const emojiSets = {
        easy: ['🐶', '🐱', '🐰', '🦊', '🐻', '🐼'],  // 6 pairs = 12 cards
        medium: ['🐶', '🐱', '🐰', '🦊', '🐻', '🐼', '🐸', '🐵', '🦁'],  // 9 pairs = 18 cards
        hard: ['🐶', '🐱', '🐰', '🦊', '🐻', '🐼', '🐸', '🐵', '🦁', '🐯', '🐨', '🐧']  // 12 pairs = 24 cards
    };

    const gridSizes = {
        easy: { cols: 3, rows: 4 },    // 3x4 grid
        medium: { cols: 3, rows: 6 },  // 3x6 grid  
        hard: { cols: 4, rows: 6 }     // 4x6 grid
    };

    // Sound effects using Web Audio API
    const playMatchSound = () => {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Happy chime sound
            const oscillator1 = audioContext.createOscillator();
            const oscillator2 = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator1.connect(gainNode);
            oscillator2.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator1.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
            oscillator2.frequency.setValueAtTime(659.25, audioContext.currentTime); // E5
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator1.start(audioContext.currentTime);
            oscillator2.start(audioContext.currentTime);
            oscillator1.stop(audioContext.currentTime + 0.5);
            oscillator2.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            console.log('Audio not supported');
        }
    };

    const playFlipSound = () => {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Quick pop sound
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.02);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (error) {
            console.log('Audio not supported');
        }
    };

    const playWinSound = () => {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Victory fanfare
            const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
            notes.forEach((freq, index) => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                const startTime = audioContext.currentTime + index * 0.15;
                oscillator.frequency.setValueAtTime(freq, startTime);
                
                gainNode.gain.setValueAtTime(0, startTime);
                gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.1);
                gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);
                
                oscillator.start(startTime);
                oscillator.stop(startTime + 0.4);
            });
        } catch (error) {
            console.log('Audio not supported');
        }
    };

    // Shuffle array utility
    const shuffleArray = (array) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    // Initialize game
    const initializeGame = (selectedDifficulty = difficulty) => {
        const emojis = emojiSets[selectedDifficulty];
        const pairs = [...emojis, ...emojis]; // Create pairs
        const shuffledCards = shuffleArray(pairs).map((emoji, index) => ({
            id: index,
            emoji: emoji,
            isFlipped: false,
            isMatched: false
        }));

        setCards(shuffledCards);
        setFlippedCards([]);
        setMatchedCards([]);
        setMoves(0);
        setGameStarted(true);
        setGameCompleted(false);
        setStartTime(Date.now());
        setEndTime(null);
        setDifficulty(selectedDifficulty);
    };

    // Handle card click
    const handleCardClick = (cardId) => {
        if (!gameStarted || gameCompleted) return;
        
        const card = cards.find(c => c.id === cardId);
        if (card.isFlipped || card.isMatched || flippedCards.length >= 2) return;

        playFlipSound();

        const newFlippedCards = [...flippedCards, cardId];
        setFlippedCards(newFlippedCards);

        // Update card state
        setCards(prevCards => prevCards.map(c => 
            c.id === cardId ? { ...c, isFlipped: true } : c
        ));

        // Check for match after 2 cards are flipped
        if (newFlippedCards.length === 2) {
            setMoves(prev => prev + 1);
            
            const [firstCardId, secondCardId] = newFlippedCards;
            const firstCard = cards.find(c => c.id === firstCardId);
            const secondCard = cards.find(c => c.id === secondCardId);

            if (firstCard.emoji === secondCard.emoji) {
                // Match found!
                playMatchSound();
                
                setTimeout(() => {
                    setMatchedCards(prev => [...prev, firstCardId, secondCardId]);
                    setCards(prevCards => prevCards.map(c => 
                        (c.id === firstCardId || c.id === secondCardId) 
                            ? { ...c, isMatched: true } : c
                    ));
                    setFlippedCards([]);
                    
                    // Check if game is completed
                    const newMatchedCount = matchedCards.length + 2;
                    if (newMatchedCount === cards.length) {
                        setGameCompleted(true);
                        setEndTime(Date.now());
                        playWinSound();
                        
                        // Save best time
                        const gameTime = Date.now() - startTime;
                        if (!bestTimes[difficulty] || gameTime < bestTimes[difficulty]) {
                            const newBestTimes = { ...bestTimes, [difficulty]: gameTime };
                            setBestTimes(newBestTimes);
                            localStorage.setItem('sebastianMemoryBestTimes', JSON.stringify(newBestTimes));
                        }
                    }
                }, 500);
            } else {
                // No match - flip cards back
                setTimeout(() => {
                    setCards(prevCards => prevCards.map(c => 
                        (c.id === firstCardId || c.id === secondCardId) 
                            ? { ...c, isFlipped: false } : c
                    ));
                    setFlippedCards([]);
                }, 1000);
            }
        }
    };

    // Format time for display
    const formatTime = (milliseconds) => {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // Get current game time
    const getCurrentTime = () => {
        if (!startTime) return '0:00';
        const currentTime = gameCompleted ? endTime : Date.now();
        return formatTime(currentTime - startTime);
    };

    // Start screen
    if (!gameStarted) {
        return (
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 text-center">Memory Match 🧠</h3>
                <p className="text-sm text-gray-600 text-center">Find all the matching pairs!</p>
                
                {/* Difficulty Selection */}
                <div className="space-y-3">
                    <h4 className="text-md font-semibold text-gray-700 text-center">Choose Difficulty:</h4>
                    
                    <button
                        onClick={() => initializeGame('easy')}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-4 rounded-lg transition-all duration-200 hover:scale-105"
                    >
                        <div className="text-2xl mb-1">😊</div>
                        <div className="text-lg">Easy</div>
                        <div className="text-sm opacity-75">6 pairs • 3×4 grid</div>
                    </button>
                    
                    <button
                        onClick={() => initializeGame('medium')}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 px-4 rounded-lg transition-all duration-200 hover:scale-105"
                    >
                        <div className="text-2xl mb-1">🤔</div>
                        <div className="text-lg">Medium</div>
                        <div className="text-sm opacity-75">9 pairs • 3×6 grid</div>
                    </button>
                    
                    <button
                        onClick={() => initializeGame('hard')}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-4 rounded-lg transition-all duration-200 hover:scale-105"
                    >
                        <div className="text-2xl mb-1">🤯</div>
                        <div className="text-lg">Hard</div>
                        <div className="text-sm opacity-75">12 pairs • 4×6 grid</div>
                    </button>
                </div>
                
                {/* Best Times */}
                {(bestTimes.easy || bestTimes.medium || bestTimes.hard) && (
                    <div className="bg-purple-50 p-3 rounded-lg">
                        <h4 className="text-sm font-bold text-purple-800 mb-2 text-center">🏆 Best Times:</h4>
                        <div className="text-xs text-purple-700 space-y-1">
                            {bestTimes.easy && <div>Easy: {formatTime(bestTimes.easy)}</div>}
                            {bestTimes.medium && <div>Medium: {formatTime(bestTimes.medium)}</div>}
                            {bestTimes.hard && <div>Hard: {formatTime(bestTimes.hard)}</div>}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    const grid = gridSizes[difficulty];

    return (
        <div className="space-y-4">
            {/* Game Header */}
            <div className="flex justify-between items-center text-sm">
                <div className="font-semibold">Moves: {moves}</div>
                <div className="font-semibold capitalize">{difficulty}</div>
                <div className="font-semibold">Time: {getCurrentTime()}</div>
            </div>

            {/* Game Completed */}
            {gameCompleted && (
                <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">🎉 Congratulations! 🎉</div>
                    <div className="text-sm text-green-800">
                        <div>Completed in {moves} moves!</div>
                        <div>Time: {formatTime(endTime - startTime)}</div>
                        {bestTimes[difficulty] === (endTime - startTime) && (
                            <div className="font-bold text-yellow-600">⭐ NEW BEST TIME! ⭐</div>
                        )}
                    </div>
                </div>
            )}

            {/* Game Grid */}
            <div 
                className="grid gap-2 mx-auto justify-center"
                style={{ 
                    gridTemplateColumns: `repeat(${grid.cols}, 1fr)`,
                    maxWidth: `${grid.cols * 60 + (grid.cols - 1) * 8}px`
                }}
            >
                {cards.map((card) => (
                    <button
                        key={card.id}
                        onClick={() => handleCardClick(card.id)}
                        className={`
                            w-14 h-14 rounded-lg font-bold text-2xl transition-all duration-300 select-none
                            ${card.isFlipped || card.isMatched 
                                ? 'bg-white border-2 border-purple-300 transform scale-105' 
                                : 'bg-gradient-to-br from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 text-white border-2 border-purple-700'
                            }
                            ${card.isMatched ? 'opacity-75' : ''}
                            ${!gameCompleted && !card.isMatched ? 'hover:scale-110 cursor-pointer' : ''}
                        `}
                        disabled={gameCompleted}
                    >
                        {card.isFlipped || card.isMatched ? card.emoji : '?'}
                    </button>
                ))}
            </div>

            {/* Game Controls */}
            <div className="grid grid-cols-2 gap-2">
                <button
                    onClick={() => {
                        setGameStarted(false);
                        setGameCompleted(false);
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                    🏠 Menu
                </button>
                <button
                    onClick={() => initializeGame(difficulty)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                    🔄 New Game
                </button>
            </div>
        </div>
    );
};