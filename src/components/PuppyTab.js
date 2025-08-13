// PuppyTab component for Sebastian's Silly App
const PuppyTab = ({ puppyAction, setPuppyAction, puppyPosition, setPuppyPosition, puppyMood, setPuppyMood }) => {

    const getPuppyEmoji = () => {
        switch (puppyAction) {
            case 'eating': return '😋';
            case 'excited': return '😍';
            case 'playing': return '🤪';
            case 'barking': return '😤';
            case 'sleepy': return '😴';
            case 'walking': return '🙂';
            default: return '😊';
        }
    };

    const feedPuppy = (food) => {
        setPuppyAction('excited');
        setTimeout(() => {
            setPuppyAction('eating');
            setTimeout(() => {
                const reactions = ['happy', 'excited', 'sleepy'];
                setPuppyMood(reactions[Math.floor(Math.random() * reactions.length)]);
                setPuppyAction('idle');
            }, 2000);
        }, 500);
    };

    const petPuppy = () => {
        setPuppyAction('excited');
        setTimeout(() => setPuppyAction('idle'), 2000);
        setPuppyMood('happy');
    };

    const playWithPuppy = () => {
        setPuppyAction('playing');
        setTimeout(() => {
            setPuppyAction('barking');
            playBarkSound(); // From audioUtils.js
            setTimeout(() => setPuppyAction('idle'), 1000);
        }, 2000);
        setPuppyMood('playful');
    };

    const makePuppyBark = () => {
        setPuppyAction('barking');
        playBarkSound(); // From audioUtils.js
        setTimeout(() => setPuppyAction('idle'), 1000);
    };

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800 text-center">Meet Buddy! 🐕</h3>
            
            <div 
                className="relative bg-gradient-to-br from-green-100 to-blue-100 rounded-lg border-2 border-dashed border-green-300 overflow-hidden w-full mx-auto"
                style={{ maxWidth: '100%', height: '180px' }}
            >
                <div
                    className={`absolute transition-all duration-1500 ease-in-out cursor-pointer ${
                        puppyAction === 'eating' ? 'animate-bounce' : 
                        puppyAction === 'excited' ? 'animate-pulse' : 
                        puppyAction === 'playing' ? 'animate-spin' : 
                        puppyAction === 'barking' ? 'animate-bounce' :
                        puppyAction === 'walking' ? '' : ''
                    }`}
                    style={{ 
                        left: `${puppyPosition.x}%`, 
                        top: `${puppyPosition.y}%`,
                        transform: 'translate(-50%, -50%)'
                    }}
                    onClick={makePuppyBark}
                >
                    <div className="text-6xl select-none">
                        🐕{getPuppyEmoji()}
                    </div>
                </div>

                <div className="absolute bottom-2 left-2 text-sm font-semibold">
                    {puppyAction === 'eating' && (
                        <span className="text-green-600 animate-pulse">*munch munch* 🍽️</span>
                    )}
                    {puppyAction === 'barking' && (
                        <span className="text-blue-600 animate-pulse">WOOF! WOOF! 🔊</span>
                    )}
                    {puppyAction === 'playing' && (
                        <span className="text-purple-600 animate-pulse">*playing happily* 🎾</span>
                    )}
                    {puppyAction === 'excited' && (
                        <span className="text-pink-600 animate-pulse">*tail wagging* ❤️</span>
                    )}
                    {puppyAction === 'walking' && (
                        <span className="text-gray-600">*walking around* 🐾</span>
                    )}
                    {puppyAction === 'idle' && (
                        <span className="text-gray-500">*sniffing around* 👃</span>
                    )}
                </div>
            </div>

            <div className="text-center text-sm text-gray-600">
                Click Buddy to make him bark! 🔊
            </div>

            <div>
                <h4 className="text-md font-semibold text-gray-700 mb-2 text-center">Feed Buddy:</h4>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {[
                        { emoji: '🦴', name: 'Bone' },
                        { emoji: '🥩', name: 'Meat' },
                        { emoji: '🍖', name: 'Steak' },
                        { emoji: '🍞', name: 'Bread' },
                        { emoji: '🥕', name: 'Carrot' }
                    ].map((food) => (
                        <button
                            key={food.emoji}
                            onClick={() => feedPuppy(food.emoji)}
                            className="bg-yellow-100 hover:bg-yellow-200 border border-yellow-300 rounded-lg p-2 text-xl transition-colors duration-200 flex flex-col items-center hover:scale-105"
                        >
                            {food.emoji}
                            <span className="text-xs mt-1">{food.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-3 gap-1">
                <button
                    onClick={petPuppy}
                    className="bg-pink-200 hover:bg-pink-300 text-gray-800 font-semibold py-2 px-1 rounded-lg transition-all duration-200 hover:scale-105 text-xs"
                >
                    🤚 Pet
                </button>
                <button
                    onClick={playWithPuppy}
                    className="bg-blue-200 hover:bg-blue-300 text-gray-800 font-semibold py-2 px-1 rounded-lg transition-all duration-200 hover:scale-105 text-xs"
                >
                    🎾 Play
                </button>
                <button
                    onClick={makePuppyBark}
                    className="bg-orange-200 hover:bg-orange-300 text-gray-800 font-semibold py-2 px-1 rounded-lg transition-all duration-200 hover:scale-105 text-xs"
                >
                    🔊 Bark
                </button>
            </div>

            <div className="text-xs text-gray-500 text-center">
                Buddy loves to play! He moves around on his own and reacts to everything! 🐾
            </div>
        </div>
    );
};