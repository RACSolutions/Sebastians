// ButtonsTab component for Sebastian's Silly App
const ButtonsTab = ({ customText, setCustomText, handleSpeak, stopSpeech, isPlaying, message }) => (
    <div className="space-y-6">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                What should I say?
            </label>
            <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter text to speak..."
            />
        </div>
        
        <div className="space-y-3">
            {!isPlaying ? (
                <button 
                    onClick={handleSpeak}
                    disabled={!customText.trim()}
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 w-full"
                >
                    🔊 Speak: "{customText}"
                </button>
            ) : (
                <button 
                    onClick={stopSpeech}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 w-full animate-pulse"
                >
                    ⏹️ Stop Speaking
                </button>
            )}
        </div>
        
        <div className="flex gap-2 flex-wrap justify-center">
            {['Barnabus', 'Poo Poo Pee Pee', 'Eat Beans With Me', 'Reeee'].map((preset) => (
                <button
                    key={preset}
                    onClick={() => setCustomText(preset)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm transition-colors duration-200"
                >
                    {preset}
                </button>
            ))}
        </div>
        
        {message && (
            <div className="mt-6 text-2xl font-semibold text-purple-600 animate-bounce">
                "{message}"
            </div>
        )}
    </div>
);