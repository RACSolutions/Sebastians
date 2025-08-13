// RiddlesTab component for Sebastian's Silly App
const RiddlesTab = () => {
    const [currentRiddle, setCurrentRiddle] = React.useState(0);
    const [showAnswer, setShowAnswer] = React.useState(false);
    const [score, setScore] = React.useState(0);
    const [riddlesCompleted, setRiddlesCompleted] = React.useState([]);
    const [difficulty, setDifficulty] = React.useState('easy');
    const [showHint, setShowHint] = React.useState(false);

    // Riddle collections by difficulty
    const riddles = {
        easy: [
            {
                question: "What has keys but no locks?",
                answer: "A piano",
                hint: "🎹 You can play music with it!",
                emoji: "🎹"
            },
            {
                question: "What gets wetter the more it dries?",
                answer: "A towel",
                hint: "🛁 You use it after a bath!",
                emoji: "🏖️"
            },
            {
                question: "What has a face and two hands but no arms or legs?",
                answer: "A clock",
                hint: "⏰ It tells you what time it is!",
                emoji: "🕐"
            },
            {
                question: "What goes up but never comes down?",
                answer: "Your age",
                hint: "🎂 It happens every birthday!",
                emoji: "📈"
            },
            {
                question: "What has teeth but cannot bite?",
                answer: "A zipper",
                hint: "👕 It's on your jacket!",
                emoji: "🤐"
            },
            {
                question: "What can you catch but not throw?",
                answer: "A cold",
                hint: "🤧 You might get this when you're sick!",
                emoji: "🤒"
            },
            {
                question: "What has one eye but cannot see?",
                answer: "A needle",
                hint: "🪡 Used for sewing!",
                emoji: "🪡"
            },
            {
                question: "What runs around the whole yard without moving?",
                answer: "A fence",
                hint: "🏡 It goes around your house!",
                emoji: "🚧"
            }
        ],
        medium: [
            {
                question: "The more you take, the more you leave behind. What am I?",
                answer: "Footsteps",
                hint: "👣 You make these when you walk!",
                emoji: "👣"
            },
            {
                question: "What comes once in a minute, twice in a moment, but never in a thousand years?",
                answer: "The letter M",
                hint: "🔤 Look at the letters in those words!",
                emoji: "Ⓜ️"
            },
            {
                question: "What starts with T, ends with T, and has T in it?",
                answer: "A teapot",
                hint: "🫖 You make tea with it!",
                emoji: "🫖"
            },
            {
                question: "What gets smaller every time it takes a bath?",
                answer: "Soap",
                hint: "🧼 You use it to wash your hands!",
                emoji: "🧼"
            },
            {
                question: "What has a bottom at the top?",
                answer: "Your legs",
                hint: "🦵 Think about where your bottom sits!",
                emoji: "🪑"
            },
            {
                question: "What can travel around the world while staying in a corner?",
                answer: "A stamp",
                hint: "📮 You put it on letters!",
                emoji: "📬"
            }
        ],
        hard: [
            {
                question: "What word becomes shorter when you add two letters to it?",
                answer: "Short",
                hint: "📏 Think about the word 'short' + 'er'!",
                emoji: "📐"
            },
            {
                question: "What can you break, even if you never pick it up or touch it?",
                answer: "A promise",
                hint: "🤝 It's something you make with words!",
                emoji: "💔"
            },
            {
                question: "What has many keys but can't open a single lock?",
                answer: "A computer keyboard",
                hint: "💻 You type on it every day!",
                emoji: "⌨️"
            },
            {
                question: "What is so fragile that saying its name breaks it?",
                answer: "Silence",
                hint: "🤫 When you speak, this disappears!",
                emoji: "🔇"
            }
        ]
    };

    const difficulties = [
        { id: 'easy', name: '😊 Easy', color: 'bg-green-500', count: riddles.easy.length },
        { id: 'medium', name: '🤔 Medium', color: 'bg-yellow-500', count: riddles.medium.length },
        { id: 'hard', name: '🤯 Hard', color: 'bg-red-500', count: riddles.hard.length }
    ];

    const currentRiddleData = riddles[difficulty][currentRiddle] || riddles[difficulty][0];
    const totalRiddles = riddles[difficulty].length;

    // Check if current riddle is completed
    const isCompleted = riddlesCompleted.includes(`${difficulty}-${currentRiddle}`);

    const showAnswerHandler = () => {
        setShowAnswer(true);
        if (!isCompleted) {
            setScore(score + 10);
            setRiddlesCompleted([...riddlesCompleted, `${difficulty}-${currentRiddle}`]);
        }
        
        // Play success sound
        if (window.playPopSound) {
            window.playPopSound();
        }
    };

    const nextRiddle = () => {
        if (currentRiddle < totalRiddles - 1) {
            setCurrentRiddle(currentRiddle + 1);
        } else {
            setCurrentRiddle(0); // Loop back to start
        }
        setShowAnswer(false);
        setShowHint(false);
    };

    const prevRiddle = () => {
        if (currentRiddle > 0) {
            setCurrentRiddle(currentRiddle - 1);
        } else {
            setCurrentRiddle(totalRiddles - 1); // Loop to end
        }
        setShowAnswer(false);
        setShowHint(false);
    };

    const changeDifficulty = (newDifficulty) => {
        setDifficulty(newDifficulty);
        setCurrentRiddle(0);
        setShowAnswer(false);
        setShowHint(false);
    };

    const showHintHandler = () => {
        setShowHint(true);
    };

    // Get completion stats for current difficulty
    const getCompletionStats = () => {
        const completed = riddlesCompleted.filter(id => id.startsWith(difficulty)).length;
        return { completed, total: totalRiddles };
    };

    const stats = getCompletionStats();

    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 text-center">Brain Riddles 🧩</h3>
            
            {/* Difficulty Selection */}
            <div className="flex justify-center gap-2">
                {difficulties.map((diff) => (
                    <button
                        key={diff.id}
                        onClick={() => changeDifficulty(diff.id)}
                        className={`px-4 py-2 rounded-lg font-semibold text-white transition-all duration-200 hover:scale-105 ${
                            difficulty === diff.id
                                ? `${diff.color} shadow-lg transform scale-105`
                                : 'bg-gray-400 hover:bg-gray-500'
                        }`}
                    >
                        {diff.name} ({diff.count})
                    </button>
                ))}
            </div>

            {/* Score and Progress */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-200">
                <div className="flex justify-between items-center mb-3">
                    <div className="text-lg font-bold text-purple-600">Score: {score} points</div>
                    <div className="text-sm text-gray-600">
                        {stats.completed}/{stats.total} completed
                    </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${(stats.completed / stats.total) * 100}%` }}
                    ></div>
                </div>
            </div>

            {/* Riddle Navigation */}
            <div className="flex justify-between items-center">
                <button
                    onClick={prevRiddle}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                    ← Previous
                </button>
                
                <div className="text-center">
                    <div className="text-sm text-gray-600">Riddle {currentRiddle + 1} of {totalRiddles}</div>
                    <div className="text-lg font-bold text-gray-800 capitalize">{difficulty} Level</div>
                </div>
                
                <button
                    onClick={nextRiddle}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                    Next →
                </button>
            </div>

            {/* Riddle Card */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-200 shadow-lg">
                <div className="text-center mb-6">
                    <div className="text-6xl mb-4">{currentRiddleData.emoji}</div>
                    <div className="text-xl font-bold text-gray-800 leading-relaxed">
                        {currentRiddleData.question}
                    </div>
                </div>

                {/* Hint Section */}
                {showHint && !showAnswer && (
                    <div className="bg-blue-100 border border-blue-300 rounded-lg p-4 mb-4">
                        <div className="text-center">
                            <div className="text-lg font-semibold text-blue-800 mb-2">💡 Hint:</div>
                            <div className="text-blue-700">{currentRiddleData.hint}</div>
                        </div>
                    </div>
                )}

                {/* Answer Section */}
                {showAnswer && (
                    <div className="bg-green-100 border border-green-300 rounded-lg p-4 mb-4">
                        <div className="text-center">
                            <div className="text-lg font-semibold text-green-800 mb-2">✅ Answer:</div>
                            <div className="text-xl font-bold text-green-700">{currentRiddleData.answer}</div>
                            {isCompleted && (
                                <div className="text-sm text-green-600 mt-2">Already solved! +0 points</div>
                            )}
                            {!isCompleted && (
                                <div className="text-sm text-green-600 mt-2">Great job! +10 points</div>
                            )}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                    {!showAnswer && (
                        <>
                            <button
                                onClick={showHintHandler}
                                disabled={showHint}
                                className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
                            >
                                {showHint ? '💡 Hint Shown' : '💡 Show Hint'}
                            </button>
                            <button
                                onClick={showAnswerHandler}
                                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
                            >
                                ✅ Show Answer
                            </button>
                        </>
                    )}
                    
                    {showAnswer && (
                        <button
                            onClick={nextRiddle}
                            className="col-span-2 bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
                        >
                            🧩 Next Riddle
                        </button>
                    )}
                </div>
            </div>

            {/* Achievement Badges */}
            {stats.completed > 0 && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
                    <div className="text-center">
                        <div className="text-lg font-bold text-yellow-800 mb-2">🏆 Achievements</div>
                        <div className="flex justify-center gap-2 flex-wrap">
                            {stats.completed >= 1 && (
                                <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
                                    🌟 First Riddle
                                </span>
                            )}
                            {stats.completed >= 3 && (
                                <span className="bg-orange-400 text-orange-900 px-3 py-1 rounded-full text-sm font-bold">
                                    🔥 Triple Solver
                                </span>
                            )}
                            {stats.completed >= 5 && (
                                <span className="bg-red-400 text-red-900 px-3 py-1 rounded-full text-sm font-bold">
                                    🧠 Brain Master
                                </span>
                            )}
                            {stats.completed === stats.total && (
                                <span className="bg-purple-400 text-purple-900 px-3 py-1 rounded-full text-sm font-bold">
                                    👑 Perfect Score
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Instructions */}
            <div className="text-center text-sm text-gray-600 bg-purple-50 rounded-lg p-3 border border-purple-200">
                <div className="font-semibold mb-1">How to Play:</div>
                <div>🤔 Read the riddle carefully</div>
                <div>💡 Use hints if you need help</div>
                <div>✅ Reveal the answer when ready</div>
                <div>🏆 Collect points and achievements!</div>
            </div>
        </div>
    );
};