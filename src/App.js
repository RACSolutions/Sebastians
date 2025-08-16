// Main App component for Sebastian's Silly App
const { useState } = React;

function SebastianApp() {
    const [currentPage, setCurrentPage] = useState('menu'); // Start with main menu
    const [message, setMessage] = useState('');
    const [customText, setCustomText] = useState('Barnabus');
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [showUserSettings, setShowUserSettings] = useState(false);
    const [showDevelopmentWarning, setShowDevelopmentWarning] = useState(false);
    const [pendingPage, setPendingPage] = useState(null);
    const [userName, setUserName] = useState(() => {
        return localStorage.getItem('sebastianUserName') || 'Sebastian';
    });

    // Pet puppy state
    const [puppyAction, setPuppyAction] = useState('idle');
    const [puppyPosition, setPuppyPosition] = useState({ x: 50, y: 50 });
    const [puppyMood, setPuppyMood] = useState('happy');

    // App categories with their respective pages - Added feedback
    const appCategories = {
        all: ['buttons', 'draw', 'piano', 'story', 'memory', 'game', 'journal', 'weather', 'puppy', 'snake', 'tictactoe', 'simon', 'quiz', 'riddles', 'coding', 'space', 'feedback'],
        games: ['memory', 'game', 'puppy', 'snake', 'tictactoe', 'simon', 'quiz'],
        creative: ['draw', 'piano', 'story', 'journal'],
        tools: ['weather', 'buttons', 'coding', 'feedback'],
        learning: ['coding', 'quiz', 'space', 'story'],
        fun: ['buttons', 'piano', 'story', 'game', 'puppy', 'snake', 'tictactoe', 'simon', 'quiz']
    };

    // App information with categories, unique colors, and development status - Added feedback
    const appInfo = {
        buttons: { title: 'Silly Buttons', emoji: '🔊', description: 'Make me say funny things!', category: 'fun', gradient: 'from-blue-400 to-blue-600', status: 'ready' },
        draw: { title: 'Drawing', emoji: '🎨', description: 'Draw pictures with your finger!', category: 'creative', gradient: 'from-green-400 to-emerald-600', status: 'ready' },
        piano: { title: 'Virtual Piano', emoji: '🎹', description: 'Make music with different sounds!', category: 'creative', gradient: 'from-purple-400 to-purple-600', status: 'ready' },
        story: { title: 'Story Generator', emoji: '📚', description: 'Create silly Mad Libs stories!', category: 'creative', gradient: 'from-pink-400 to-rose-600', status: 'ready' },
        memory: { title: 'Memory Match', emoji: '🧠', description: 'Find matching pairs of emojis!', category: 'games', gradient: 'from-teal-400 to-cyan-600', status: 'ready' },
        game: { title: 'Emoji Pop Game', emoji: '🎮', description: 'Pop the emojis before they disappear!', category: 'games', gradient: 'from-red-400 to-red-600', status: 'ready' },
        journal: { title: 'Daily Journal', emoji: '📝', description: 'Write your thoughts and memories!', category: 'creative', gradient: 'from-yellow-400 to-orange-600', status: 'ready' },
        weather: { title: 'Weather Today', emoji: '🌤️', description: 'See today\'s weather with animations!', category: 'tools', gradient: 'from-sky-400 to-blue-600', status: 'ready' },
        puppy: { title: 'Play with Buddy', emoji: '🐕', description: 'Feed and play with your virtual puppy!', category: 'games', gradient: 'from-orange-400 to-amber-600', status: 'ready' },
        riddles: { title: 'Brain Riddles', emoji: '🧩', description: 'Solve fun riddles and brain teasers!', category: 'games', gradient: 'from-indigo-400 to-purple-600', status: 'development' },
        snake: { title: 'Snake Game', emoji: '🐍', description: 'Eat apples and grow your snake!', category: 'games', gradient: 'from-lime-400 to-green-600', status: 'development' },
        tictactoe: { title: 'Tic Tac Toe', emoji: '⭕', description: 'Classic X\'s and O\'s game!', category: 'games', gradient: 'from-indigo-400 to-blue-600', status: 'development' },
        simon: { title: 'Simon Says', emoji: '🔴', description: 'Remember the color sequence!', category: 'games', gradient: 'from-rose-400 to-pink-600', status: 'development' },
        quiz: { title: 'Fun Quiz', emoji: '❓', description: 'Test your knowledge with fun questions!', category: 'games', gradient: 'from-violet-400 to-purple-600', status: 'development' },
        coding: { title: 'Learn to Code', emoji: '💻', description: 'Drag and drop blocks to code!', category: 'learning', gradient: 'from-emerald-400 to-teal-600', status: 'development' },
        space: { title: 'Space Explorer', emoji: '🚀', description: 'Explore planets and learn about space!', category: 'tools', gradient: 'from-indigo-400 to-purple-600', status: 'development' },
        feedback: { title: 'Send Ideas', emoji: '💌', description: 'Share your ideas with the developer!', category: 'tools', gradient: 'from-pink-400 to-rose-600', status: 'ready' }
    };

    // Filter categories
    const filterOptions = [
        { id: 'all', label: '🌟 All Apps', color: 'bg-gray-500' },
        { id: 'games', label: '🎮 Games', color: 'bg-red-500' },
        { id: 'creative', label: '🎨 Creative', color: 'bg-purple-500' },
        { id: 'tools', label: '🛠️ Tools', color: 'bg-blue-500' },
        { id: 'fun', label: '🎉 Fun', color: 'bg-yellow-500' }
    ];

    // Puppy moves around randomly
    React.useEffect(() => {
        const moveInterval = setInterval(() => {
            if (puppyAction === 'idle') {
                setPuppyPosition({
                    x: Math.random() * 60 + 20,
                    y: Math.random() * 40 + 30
                });
                setPuppyAction('walking');
                setTimeout(() => setPuppyAction('idle'), 1500);
            }
        }, 3000 + Math.random() * 2000);

        return () => clearInterval(moveInterval);
    }, [puppyAction]);

    const handleSpeak = () => {
        setMessage(customText);
        
        const success = speakText(customText, () => {
            setIsPlaying(false);
        });
        
        if (success) {
            setIsPlaying(true);
        }
    };

    const handleStopSpeech = () => {
        stopSpeech();
        setIsPlaying(false);
    };

    // Navigation functions
    const goToPage = (page) => {
        // Check if app is in development
        const app = appInfo[page];
        if (app && app.status === 'development') {
            setPendingPage(page);
            setShowDevelopmentWarning(true);
        } else {
            setCurrentPage(page);
        }
    };

    const proceedToDevelopmentApp = () => {
        if (pendingPage) {
            setCurrentPage(pendingPage);
        }
        setShowDevelopmentWarning(false);
        setPendingPage(null);
    };

    const cancelDevelopmentApp = () => {
        setShowDevelopmentWarning(false);
        setPendingPage(null);
    };

    const goBack = () => {
        setCurrentPage('menu');
    };

    // Save user name to localStorage
    const saveUserName = (newName) => {
        setUserName(newName);
        localStorage.setItem('sebastianUserName', newName);
    };

    // Get filtered apps
    const getFilteredApps = () => {
        return appCategories[selectedFilter] || appCategories.all;
    };

    // User Settings Component
    const UserSettings = () => {
        const [tempName, setTempName] = useState(userName);
        
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">⚙️ Settings</h2>
                        <button
                            onClick={() => setShowUserSettings(false)}
                            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                        >
                            ×
                        </button>
                    </div>
                    
                    <div className="space-y-6">
                        {/* User Name Setting */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                👤 Your Name
                            </label>
                            <input
                                type="text"
                                value={tempName}
                                onChange={(e) => setTempName(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                                placeholder="Enter your name..."
                            />
                            <p className="text-xs text-gray-500 mt-1">This will appear throughout the app</p>
                        </div>
                        
                        {/* App Stats */}
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
                            <h3 className="font-bold text-purple-800 mb-3">📊 Your App Stats</h3>
                            <div className="grid grid-cols-2 gap-3 text-center text-sm">
                                <div className="bg-white rounded-lg p-3">
                                    <div className="text-2xl font-bold text-blue-600">{Object.keys(appInfo).length}</div>
                                    <div className="text-blue-700">Total Apps</div>
                                </div>
                                <div className="bg-white rounded-lg p-3">
                                    <div className="text-2xl font-bold text-green-600">∞</div>
                                    <div className="text-green-700">Fun Level</div>
                                </div>
                            </div>
                        </div>
                        
                        {/* About */}
                        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                            <h3 className="font-bold text-yellow-800 mb-2">🌟 About This App</h3>
                            <p className="text-sm text-yellow-700">
                                Created with ❤️ for {userName}! This app contains games, creative tools, and fun activities to spark creativity and learning.
                            </p>
                            <p className="text-xs text-yellow-600 mt-2">Version 1.0 • Made with React & Tailwind CSS</p>
                        </div>
                    </div>
                    
                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={() => setShowUserSettings(false)}
                            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                saveUserName(tempName);
                                setShowUserSettings(false);
                            }}
                            className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Development Warning Modal
    const DevelopmentWarning = () => {
        const app = pendingPage ? appInfo[pendingPage] : null;
        
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                    <div className="text-center">
                        <div className="text-6xl mb-4">⚠️</div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">App In Development</h2>
                        
                        {app && (
                            <div className="mb-4">
                                <div className="text-4xl mb-2">{app.emoji}</div>
                                <div className="text-lg font-semibold text-gray-700">{app.title}</div>
                            </div>
                        )}
                        
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            This app is not finished yet. It might have bugs or missing features. 
                            Do you still want to open it?
                        </p>
                        
                        <div className="flex gap-3">
                            <button
                                onClick={cancelDevelopmentApp}
                                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={proceedToDevelopmentApp}
                                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
                            >
                                Proceed Anyway
                            </button>
                        </div>
                        
                        <div className="mt-4 text-xs text-gray-500">
                            Development apps are still being worked on! 🔨
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Main Menu Component
    const MainMenu = () => (
        <div className="space-y-6">
            {/* Top Action Bar */}
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => setShowUserSettings(true)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-all duration-200 hover:scale-105 flex items-center gap-2"
                >
                    ⚙️ Settings
                </button>
            </div>

            {/* Centered Header */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">✨ {userName}'s Fun App! ✨</h1>
                <p className="text-gray-600">Choose what you want to do!</p>
            </div>
            <div className="bg-pink-100 border-l-4 border-pink-500 text-pink-700 p-4 mb-6 rounded-lg">
            <div className="flex items-center">
                <div className="text-2xl mr-3">💌</div>
                <div>
                    <p className="font-medium">Hi Sebastian!</p>
                    <p className="text-sm">I have added a new option where you can send me a note to fix things. Love, Mum x</p>
                </div>
            </div>
        </div>
            
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2 justify-center mb-6">
                {filterOptions.map((filter) => (
                    <button
                        key={filter.id}
                        onClick={() => setSelectedFilter(filter.id)}
                        className={`px-4 py-2 rounded-lg font-semibold text-white transition-all duration-200 hover:scale-105 ${
                            selectedFilter === filter.id 
                                ? `${filter.color} shadow-lg transform scale-105` 
                                : 'bg-gray-400 hover:bg-gray-500'
                        }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            
            {/* Filtered Apps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getFilteredApps().map((appId) => {
                    const app = appInfo[appId];
                    const isDevelopment = app.status === 'development';
                    
                    return (
                        <button
                            key={appId}
                            onClick={() => goToPage(appId)}
                            className={`hover:scale-105 text-white font-bold py-6 px-6 rounded-xl transition-all duration-200 shadow-lg relative overflow-hidden hover:shadow-xl ${
                                isDevelopment 
                                    ? 'bg-gradient-to-br from-gray-400 to-gray-600 hover:from-gray-500 hover:to-gray-700' 
                                    : `bg-gradient-to-br ${app.gradient} hover:brightness-110`
                            }`}
                        >
                            {/* Development Badge */}
                            {isDevelopment && (
                                <div className="absolute top-2 left-2 text-xs bg-yellow-400 text-black px-2 py-1 rounded-full font-bold shadow-md z-10">
                                    IN DEVELOPMENT
                                </div>
                            )}
                            
                            {/* Category Badge */}
                            <div className="absolute top-2 right-2 text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                                {app.category}
                            </div>
                            
                            <div className="text-4xl mb-2">{app.emoji}</div>
                            <div className="text-xl">{app.title}</div>
                            <div className="text-sm opacity-75">{app.description}</div>
                        </button>
                    );
                })}
            </div>
            
            {/* Filter Results Info */}
            {selectedFilter !== 'all' && (
                <div className="text-center text-sm text-gray-600 bg-purple-50 rounded-lg p-3 border border-purple-200">
                    Showing {getFilteredApps().length} {selectedFilter} apps
                    <button
                        onClick={() => setSelectedFilter('all')}
                        className="ml-2 text-purple-600 hover:text-purple-800 font-medium"
                    >
                        • Show All Apps
                    </button>
                </div>
            )}
            
            <div className="mt-8 text-xs text-gray-500 text-center">
                Made for {userName}! 🎉
            </div>
        </div>
    );

    // Back Button Component
    const BackButton = ({ title }) => (
        <div className="flex items-center justify-between mb-6">
            <button
                onClick={goBack}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center"
            >
                ← Menu
            </button>
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <div className="w-16"></div> {/* Spacer for centering */}
        </div>
    );

    return (
        <div className={`flex flex-col items-center ${currentPage === 'menu' ? 'justify-center' : 'justify-start'} min-h-screen bg-purple-200 p-4`}>
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md md:max-w-2xl lg:max-w-4xl">
                {currentPage === 'menu' && <MainMenu />}
                
                {currentPage === 'buttons' && (
                    <div>
                        <BackButton title="Silly Buttons" />
                        <ButtonsTab 
                            customText={customText}
                            setCustomText={setCustomText}
                            handleSpeak={handleSpeak}
                            stopSpeech={handleStopSpeech}
                            isPlaying={isPlaying}
                            message={message}
                        />
                    </div>
                )}
                
                {currentPage === 'draw' && (
                    <div>
                        <BackButton title="Drawing" />
                        <DrawTab />
                    </div>
                )}
                
                {currentPage === 'piano' && (
                    <div>
                        <BackButton title="Piano" />
                        <PianoTab />
                    </div>
                )}
                
                {currentPage === 'story' && (
                    <div>
                        <BackButton title="Stories" />
                        <StoryTab />
                    </div>
                )}
                
                {currentPage === 'memory' && (
                    <div>
                        <BackButton title="Memory" />
                        <MemoryTab />
                    </div>
                )}
                
                {currentPage === 'game' && (
                    <div>
                        <BackButton title="Emoji Pop" />
                        <GameTab />
                    </div>
                )}
                
                {currentPage === 'journal' && (
                    <div>
                        <BackButton title="Journal" />
                        <JournalTab />
                    </div>
                )}
                
                {currentPage === 'weather' && (
                    <div>
                        <BackButton title="Weather" />
                        <WeatherTab />
                    </div>
                )}
                
                {currentPage === 'puppy' && (
                    <div>
                        <BackButton title="Buddy" />
                        <PuppyTab 
                            puppyAction={puppyAction}
                            setPuppyAction={setPuppyAction}
                            puppyPosition={puppyPosition}
                            setPuppyPosition={setPuppyPosition}
                            puppyMood={puppyMood}
                            setPuppyMood={setPuppyMood}
                        />
                    </div>
                )}
                
                {currentPage === 'riddles' && (
                    <div>
                        <BackButton title="Brain Riddles" />
                        <RiddlesTab />
                    </div>
                )}
                
                {currentPage === 'snake' && (
                    <div>
                        <BackButton title="Snake Game" />
                        <SnakeGame />
                    </div>
                )}
                
                {currentPage === 'tictactoe' && (
                    <div>
                        <BackButton title="Tic Tac Toe" />
                        <TicTacToe />
                    </div>
                )}
                
                {currentPage === 'simon' && (
                    <div>
                        <BackButton title="Simon Says" />
                        <SimonSays />
                    </div>
                )}
                
                {currentPage === 'quiz' && (
                    <div>
                        <BackButton title="Fun Quiz" />
                        <FunQuiz />
                    </div>
                )}
                
                {currentPage === 'coding' && (
                    <div>
                        <BackButton title="Learn to Code" />
                        <CodingTab />
                    </div>
                )}

                {currentPage === 'space' && (  
                    <div>
                        <BackButton title="Space Explorer" />
                        <SpaceTab />
                    </div>
                )}

                {currentPage === 'feedback' && (
                    <div>
                        <BackButton title="Send Ideas" />
                        <FeedbackTab />
                    </div>
                )}
            </div>
            
            {/* User Settings Modal */}
            {showUserSettings && <UserSettings />}
            
            {/* Development Warning Modal */}
            {showDevelopmentWarning && <DevelopmentWarning />}
        </div>
    );
}

// Initialize the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<SebastianApp />);