// Main App component for Sebastian's Silly App
const { useState } = React;

function SebastianApp() {
    const [activeTab, setActiveTab] = useState('buttons');
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

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-purple-200 p-8">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md w-full">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Sebastian's Silly App</h1>
                
                {/* Tab Navigation */}
                <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setActiveTab('buttons')}
                        className={`flex-1 py-2 px-3 rounded-md font-medium transition-colors duration-200 text-sm ${
                            activeTab === 'buttons' 
                                ? 'bg-blue-500 text-white' 
                                : 'text-gray-700 hover:text-blue-500'
                        }`}
                    >
                        🔊 Buttons
                    </button>
                    <button
                        onClick={() => setActiveTab('draw')}
                        className={`flex-1 py-2 px-3 rounded-md font-medium transition-colors duration-200 text-sm ${
                            activeTab === 'draw' 
                                ? 'bg-blue-500 text-white' 
                                : 'text-gray-700 hover:text-blue-500'
                        }`}
                    >
                        🎨 Draw
                    </button>
                    <button
                        onClick={() => setActiveTab('game')}
                        className={`flex-1 py-2 px-3 rounded-md font-medium transition-colors duration-200 text-sm ${
                            activeTab === 'game' 
                                ? 'bg-blue-500 text-white' 
                                : 'text-gray-700 hover:text-blue-500'
                        }`}
                    >
                        🎮 Game
                    </button>
                    <button
                        onClick={() => setActiveTab('puppy')}
                        className={`flex-1 py-2 px-3 rounded-md font-medium transition-colors duration-200 text-sm ${
                            activeTab === 'puppy' 
                                ? 'bg-blue-500 text-white' 
                                : 'text-gray-700 hover:text-blue-500'
                        }`}
                    >
                        🐕 Buddy
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'buttons' && (
                    <ButtonsTab 
                        customText={customText}
                        setCustomText={setCustomText}
                        handleSpeak={handleSpeak}
                        stopSpeech={handleStopSpeech}
                        isPlaying={isPlaying}
                        message={message}
                    />
                )}
                {activeTab === 'draw' && <DrawTab />}
                {activeTab === 'game' && <GameTab />}
                {activeTab === 'puppy' && (
                    <PuppyTab 
                        puppyAction={puppyAction}
                        setPuppyAction={setPuppyAction}
                        puppyPosition={puppyPosition}
                        setPuppyPosition={setPuppyPosition}
                        puppyMood={puppyMood}
                        setPuppyMood={setPuppyMood}
                    />
                )}
                
                <div className="mt-6 text-xs text-gray-500">
                    Made for Sebastian! 🎉
                </div>
            </div>
        </div>
    );
}

// Initialize the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<SebastianApp />);