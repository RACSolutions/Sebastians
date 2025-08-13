// FunQuiz component for Sebastian's Silly App
const FunQuiz = () => {
    const [currentQuestion, setCurrentQuestion] = React.useState(0);
    const [score, setScore] = React.useState(0);
    const [showScore, setShowScore] = React.useState(false);
    const [selectedAnswer, setSelectedAnswer] = React.useState(null);
    const [showResult, setShowResult] = React.useState(false);
    const [quizCategory, setQuizCategory] = React.useState('mixed');
    const [highScore, setHighScore] = React.useState(() => {
        const saved = localStorage.getItem('sebastianQuizHighScore');
        return saved ? parseInt(saved) : 0;
    });

    const quizQuestions = {
        animals: [
            { question: "What sound does a cow make?", options: ["Woof", "Moo", "Meow", "Oink"], correct: 1, emoji: "🐄" },
            { question: "Which animal is known as the King of the Jungle?", options: ["Elephant", "Tiger", "Lion", "Bear"], correct: 2, emoji: "🦁" },
            { question: "How many legs does a spider have?", options: ["6", "8", "10", "4"], correct: 1, emoji: "🕷️" },
            { question: "What do pandas love to eat?", options: ["Fish", "Bamboo", "Meat", "Honey"], correct: 1, emoji: "🐼" },
            { question: "Which bird cannot fly?", options: ["Eagle", "Penguin", "Parrot", "Owl"], correct: 1, emoji: "🐧" }
        ],
        colors: [
            { question: "What color do you get when you mix red and yellow?", options: ["Purple", "Orange", "Green", "Pink"], correct: 1, emoji: "🎨" },
            { question: "What color is the sun?", options: ["Yellow", "Orange", "Red", "White"], correct: 0, emoji: "☀️" },
            { question: "What color do you get when you mix blue and yellow?", options: ["Purple", "Orange", "Green", "Pink"], correct: 2, emoji: "💚" },
            { question: "What color is grass?", options: ["Blue", "Red", "Green", "Yellow"], correct: 2, emoji: "🌱" },
            { question: "What color is an apple usually?", options: ["Blue", "Red", "Purple", "Green"], correct: 1, emoji: "🍎" }
        ],
        numbers: [
            { question: "What comes after 9?", options: ["8", "10", "11", "12"], correct: 1, emoji: "🔢" },
            { question: "How many sides does a triangle have?", options: ["2", "3", "4", "5"], correct: 1, emoji: "📐" },
            { question: "What is 5 + 3?", options: ["7", "8", "9", "6"], correct: 1, emoji: "➕" },
            { question: "How many fingers do you have on one hand?", options: ["4", "5", "6", "3"], correct: 1, emoji: "✋" },
            { question: "What is half of 10?", options: ["3", "4", "5", "6"], correct: 2, emoji: "➗" }
        ],
        food: [
            { question: "Which fruit is yellow and curved?", options: ["Apple", "Banana", "Orange", "Grape"], correct: 1, emoji: "🍌" },
            { question: "What do bees make?", options: ["Milk", "Honey", "Butter", "Cheese"], correct: 1, emoji: "🐝" },
            { question: "What vegetable makes you cry when you cut it?", options: ["Carrot", "Onion", "Potato", "Tomato"], correct: 1, emoji: "🧅" },
            { question: "What is pizza usually round?", options: ["True", "False"], correct: 0, emoji: "🍕" },
            { question: "Which drink comes from cows?", options: ["Juice", "Milk", "Soda", "Water"], correct: 1, emoji: "🥛" }
        ]
    };

    const categories = [
        { id: 'mixed', name: '🌟 Mixed Quiz', icon: '🎲' },
        { id: 'animals', name: '🐾 Animals', icon: '🦁' },
        { id: 'colors', name: '🎨 Colors', icon: '🌈' },
        { id: 'numbers', name: '🔢 Numbers', icon: '🧮' },
        { id: 'food', name: '🍎 Food', icon: '🍕' }
    ];

    // Get questions based on category
    const getQuestions = () => {
        if (quizCategory === 'mixed') {
            const allQuestions = Object.values(quizQuestions).flat();
            return allQuestions.sort(() => Math.random() - 0.5).slice(0, 10);
        }
        return quizQuestions[quizCategory] || [];
    };

    const questions = getQuestions();

    const handleAnswerClick = (selectedOption) => {
        setSelectedAnswer(selectedOption);
        setShowResult(true);

        const isCorrect = selectedOption === questions[currentQuestion].correct;
        
        if (isCorrect) {
            setScore(score + 10);
            // Play success sound
            if (window.playPopSound) {
                window.playPopSound();
            }
        }

        setTimeout(() => {
            const nextQuestion = currentQuestion + 1;
            if (nextQuestion < questions.length) {
                setCurrentQuestion(nextQuestion);
                setSelectedAnswer(null);
                setShowResult(false);
            } else {
                const finalScore = score + (isCorrect ? 10 : 0);
                if (finalScore > highScore) {
                    setHighScore(finalScore);
                    localStorage.setItem('sebastianQuizHighScore', finalScore.toString());
                }
                setShowScore(true);
            }
        }, 1500);
    };

    const restartQuiz = () => {
        setCurrentQuestion(0);
        setScore(0);
        setShowScore(false);
        setSelectedAnswer(null);
        setShowResult(false);
    };

    const selectCategory = (category) => {
        setQuizCategory(category);
        restartQuiz();
    };

    if (showScore) {
        return (
            <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800 text-center">Quiz Complete! 🎉</h3>
                
                <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-6 text-center border-2 border-green-300">
                    <div className="text-6xl mb-4">🏆</div>
                    <div className="text-3xl font-bold text-green-600 mb-2">
                        {score} / {questions.length * 10}
                    </div>
                    <div className="text-lg text-gray-700 mb-4">
                        You got {score / 10} out of {questions.length} questions right!
                    </div>
                    
                    {score === questions.length * 10 && (
                        <div className="text-xl font-bold text-yellow-600 animate-bounce">
                            🌟 Perfect Score! Amazing! 🌟
                        </div>
                    )}
                    
                    {score === highScore && score > 0 && (
                        <div className="text-lg font-bold text-purple-600 animate-pulse">
                            🎊 New High Score! 🎊
                        </div>
                    )}
                </div>

                <div className="text-center">
                    <div className="text-sm text-gray-600 mb-4">
                        High Score: {highScore} points
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={restartQuiz}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
                    >
                        🔄 Play Again
                    </button>
                    <button
                        onClick={() => {
                            setShowScore(false);
                            restartQuiz();
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
                    >
                        📚 Change Category
                    </button>
                </div>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800 text-center">Fun Quiz ❓</h3>
                
                <div className="text-center mb-6">
                    <p className="text-gray-600">Choose a quiz category to get started!</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => selectCategory(category.id)}
                            className="bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
                        >
                            <div className="text-2xl mb-1">{category.icon}</div>
                            <div>{category.name}</div>
                        </button>
                    ))}
                </div>

                <div className="text-center text-sm text-gray-600 bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                    <div className="font-semibold">High Score: {highScore} points 🏆</div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800 text-center">Fun Quiz ❓</h3>
            
            {/* Progress and Score */}
            <div className="flex justify-between text-sm font-semibold">
                <span>Question {currentQuestion + 1} / {questions.length}</span>
                <span>Score: {score}</span>
                <span className="text-purple-600">High: {highScore}</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                ></div>
            </div>

            {/* Question */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
                <div className="text-center">
                    <div className="text-4xl mb-4">{questions[currentQuestion].emoji}</div>
                    <div className="text-xl font-bold text-gray-800 mb-4">
                        {questions[currentQuestion].question}
                    </div>
                </div>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 gap-3">
                {questions[currentQuestion].options.map((option, index) => {
                    let buttonClass = "bg-white hover:bg-gray-100 border-2 border-gray-300 text-gray-800";
                    
                    if (showResult) {
                        if (index === questions[currentQuestion].correct) {
                            buttonClass = "bg-green-500 border-green-600 text-white";
                        } else if (index === selectedAnswer && index !== questions[currentQuestion].correct) {
                            buttonClass = "bg-red-500 border-red-600 text-white";
                        } else {
                            buttonClass = "bg-gray-200 border-gray-300 text-gray-600";
                        }
                    } else if (selectedAnswer === index) {
                        buttonClass = "bg-blue-500 border-blue-600 text-white";
                    }

                    return (
                        <button
                            key={index}
                            onClick={() => !showResult && handleAnswerClick(index)}
                            disabled={showResult}
                            className={`font-bold py-4 px-6 rounded-lg transition-all duration-200 ${buttonClass} ${
                                !showResult ? 'hover:scale-105 cursor-pointer' : 'cursor-default'
                            }`}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>

            {/* Result Feedback */}
            {showResult && (
                <div className="text-center">
                    {selectedAnswer === questions[currentQuestion].correct ? (
                        <div className="text-2xl font-bold text-green-600 animate-bounce">
                            🎉 Correct! +10 points
                        </div>
                    ) : (
                        <div className="text-2xl font-bold text-red-600">
                            ❌ Oops! The answer was: {questions[currentQuestion].options[questions[currentQuestion].correct]}
                        </div>
                    )}
                </div>
            )}

            {/* Category Info */}
            <div className="text-center text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
                Category: {categories.find(c => c.id === quizCategory)?.name || 'Mixed Quiz'}
            </div>
        </div>
    );
};