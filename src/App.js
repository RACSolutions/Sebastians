// Main App component for Sebastian's Silly App
const { useState } = React;

function SebastianApp() {
    const [currentPage, setCurrentPage] = useState('menu'); // Start with main menu
    const [message, setMessage] = useState('');
    const [customText, setCustomText] = useState('Barnabus');
    const [isPlaying, setIsPlaying] = useState(false);

    // Pet puppy state
    const [puppyAction, setPuppyAction] = useState('idle');
    const [puppyPosition, setPuppyPosition] = useState({ x: 50, y: 50 });
    const [puppyMood, setPuppyMood] = useState('happy');

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
        setCurrentPage(page);
    };

    const goBack = () => {
        setCurrentPage('menu');
    };

    // Main Menu Component
    const MainMenu = () => (
        <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Sebastian's Silly App</h1>
            <p className="text-gray-600 text-center mb-6">Choose what you want to do!</p>
            
            <div className="grid grid-cols-1 gap-4">
                <button
                    onClick={() => goToPage('buttons')}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-6 px-6 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
                >
                    <div className="text-4xl mb-2">🔊</div>
                    <div className="text-xl">Silly Buttons</div>
                    <div className="text-sm opacity-75">Make me say funny things!</div>
                </button>
                
                <button
                    onClick={() => goToPage('draw')}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-6 px-6 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
                >
                    <div className="text-4xl mb-2">🎨</div>
                    <div className="text-xl">Drawing</div>
                    <div className="text-sm opacity-75">Draw pictures with your finger!</div>
                </button>
                
                <button
                    onClick={() => goToPage('piano')}
                    className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-6 px-6 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
                >
                    <div className="text-4xl mb-2">🎹</div>
                    <div className="text-xl">Virtual Piano</div>
                    <div className="text-sm opacity-75">Make music with different sounds!</div>
                </button>
                
                <button
                    onClick={() => goToPage('game')}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-6 px-6 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
                >
                    <div className="text-4xl mb-2">🎮</div>
                    <div className="text-xl">Emoji Pop Game</div>
                    <div className="text-sm opacity-75">Pop the emojis before they disappear!</div>
                </button>
                
                <button
                    onClick={() => goToPage('puppy')}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-6 px-6 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
                >
                    <div className="text-4xl mb-2">🐕</div>
                    <div className="text-xl">Play with Buddy</div>
                    <div className="text-sm opacity-75">Feed and play with your virtual puppy!</div>
                </button>
            </div>
            
            <div className="mt-8 text-xs text-gray-500 text-center">
                Made for Sebastian! 🎉
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
                ← Back
            </button>
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <div className="w-16"></div> {/* Spacer for centering */}
        </div>
    );

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-purple-200 p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
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
                
                {currentPage === 'game' && (
                    <div>
                        <BackButton title="Emoji Pop" />
                        <GameTab />
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
            </div>
        </div>
    );
}

// Initialize the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<SebastianApp />);