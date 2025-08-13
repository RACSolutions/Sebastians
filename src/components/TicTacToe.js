// TicTacToe component for Sebastian's Silly App
const TicTacToe = () => {
    const [board, setBoard] = React.useState(Array(9).fill(null));
    const [isXNext, setIsXNext] = React.useState(true);
    const [winner, setWinner] = React.useState(null);
    const [gameMode, setGameMode] = React.useState('human'); // 'human' or 'computer'
    const [scores, setScores] = React.useState(() => {
        const saved = localStorage.getItem('sebastianTicTacToeScores');
        return saved ? JSON.parse(saved) : { x: 0, o: 0, draws: 0 };
    });

    // Check for winner
    const checkWinner = (squares) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6] // diagonals
        ];

        for (let line of lines) {
            const [a, b, c] = line;
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return { winner: squares[a], line };
            }
        }

        // Check for draw
        if (squares.every(square => square !== null)) {
            return { winner: 'draw', line: null };
        }

        return null;
    };

    // Computer AI move (simple strategy)
    const getComputerMove = (squares) => {
        // Check if computer can win
        for (let i = 0; i < 9; i++) {
            if (squares[i] === null) {
                const testBoard = [...squares];
                testBoard[i] = 'O';
                if (checkWinner(testBoard)?.winner === 'O') {
                    return i;
                }
            }
        }

        // Check if computer needs to block player
        for (let i = 0; i < 9; i++) {
            if (squares[i] === null) {
                const testBoard = [...squares];
                testBoard[i] = 'X';
                if (checkWinner(testBoard)?.winner === 'X') {
                    return i;
                }
            }
        }

        // Take center if available
        if (squares[4] === null) return 4;

        // Take corners
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(i => squares[i] === null);
        if (availableCorners.length > 0) {
            return availableCorners[Math.floor(Math.random() * availableCorners.length)];
        }

        // Take any available space
        const available = squares.map((square, index) => square === null ? index : null).filter(val => val !== null);
        return available[Math.floor(Math.random() * available.length)];
    };

    // Handle square click
    const handleClick = (index) => {
        if (board[index] || winner) return;

        const newBoard = [...board];
        newBoard[index] = isXNext ? 'X' : 'O';
        setBoard(newBoard);

        const gameResult = checkWinner(newBoard);
        if (gameResult) {
            setWinner(gameResult);
            updateScores(gameResult.winner);
            
            // Play sound effect
            if (window.playPopSound) {
                window.playPopSound();
            }
        } else {
            setIsXNext(!isXNext);
        }
    };

    // Computer move effect
    React.useEffect(() => {
        if (gameMode === 'computer' && !isXNext && !winner) {
            const timer = setTimeout(() => {
                const computerMove = getComputerMove(board);
                if (computerMove !== undefined) {
                    const newBoard = [...board];
                    newBoard[computerMove] = 'O';
                    setBoard(newBoard);

                    const gameResult = checkWinner(newBoard);
                    if (gameResult) {
                        setWinner(gameResult);
                        updateScores(gameResult.winner);
                    } else {
                        setIsXNext(true);
                    }
                }
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [isXNext, board, gameMode, winner]);

    // Update scores
    const updateScores = (gameWinner) => {
        const newScores = { ...scores };
        if (gameWinner === 'X') newScores.x++;
        else if (gameWinner === 'O') newScores.o++;
        else if (gameWinner === 'draw') newScores.draws++;
        
        setScores(newScores);
        localStorage.setItem('sebastianTicTacToeScores', JSON.stringify(newScores));
    };

    // Reset game
    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setIsXNext(true);
        setWinner(null);
    };

    // Reset scores
    const resetScores = () => {
        const newScores = { x: 0, o: 0, draws: 0 };
        setScores(newScores);
        localStorage.setItem('sebastianTicTacToeScores', JSON.stringify(newScores));
    };

    // Render square
    const renderSquare = (index) => {
        const isWinningSquare = winner?.line?.includes(index);
        return (
            <button
                onClick={() => handleClick(index)}
                className={`w-20 h-20 border-2 border-gray-400 text-4xl font-bold transition-all duration-200 ${
                    board[index] === 'X' ? 'text-blue-600' : 'text-red-600'
                } ${isWinningSquare ? 'bg-yellow-200 animate-pulse' : 'bg-white hover:bg-gray-100'} ${
                    board[index] || winner ? 'cursor-default' : 'cursor-pointer hover:scale-105'
                }`}
                disabled={board[index] || winner}
            >
                {board[index]}
            </button>
        );
    };

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800 text-center">Tic Tac Toe ⭕</h3>
            
            {/* Game Mode Selection */}
            <div className="flex justify-center gap-2">
                <button
                    onClick={() => {
                        setGameMode('human');
                        resetGame();
                    }}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                        gameMode === 'human'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    👥 2 Players
                </button>
                <button
                    onClick={() => {
                        setGameMode('computer');
                        resetGame();
                    }}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                        gameMode === 'computer'
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    🤖 vs Computer
                </button>
            </div>

            {/* Scores */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="text-2xl font-bold text-blue-600">{scores.x}</div>
                        <div className="text-sm text-blue-700">X Wins</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-600">{scores.draws}</div>
                        <div className="text-sm text-gray-700">Draws</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-red-600">{scores.o}</div>
                        <div className="text-sm text-red-700">O Wins</div>
                    </div>
                </div>
            </div>

            {/* Game Status */}
            <div className="text-center">
                {winner ? (
                    <div className="text-xl font-bold">
                        {winner.winner === 'draw' ? (
                            <span className="text-gray-600">🤝 It's a Draw!</span>
                        ) : (
                            <span className={winner.winner === 'X' ? 'text-blue-600' : 'text-red-600'}>
                                🎉 Player {winner.winner} Wins!
                            </span>
                        )}
                    </div>
                ) : (
                    <div className="text-lg font-semibold">
                        <span className={isXNext ? 'text-blue-600' : 'text-red-600'}>
                            {gameMode === 'computer' && !isXNext ? '🤖 Computer\'s Turn (O)' : `Player ${isXNext ? 'X' : 'O'}'s Turn`}
                        </span>
                    </div>
                )}
            </div>

            {/* Game Board */}
            <div className="flex justify-center">
                <div className="grid grid-cols-3 gap-1 bg-gray-400 p-1 rounded-lg">
                    {Array.from({ length: 9 }).map((_, index) => renderSquare(index))}
                </div>
            </div>

            {/* Game Controls */}
            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={resetGame}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
                >
                    🔄 New Game
                </button>
                <button
                    onClick={resetScores}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
                >
                    📊 Reset Scores
                </button>
            </div>

            {/* Instructions */}
            <div className="text-center text-sm text-gray-600 bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                <div className="font-semibold mb-1">How to Play:</div>
                <div>🎯 Get 3 in a row (horizontal, vertical, or diagonal)</div>
                <div>👥 Take turns placing X's and O's</div>
            </div>
        </div>
    );
};