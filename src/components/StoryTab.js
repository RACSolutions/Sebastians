// StoryTab component for Sebastian's Silly App
const StoryTab = () => {
    const [currentStory, setCurrentStory] = React.useState(null);
    const [userInputs, setUserInputs] = React.useState({});
    const [currentStep, setCurrentStep] = React.useState(0);
    const [completedStory, setCompletedStory] = React.useState('');
    const [showStory, setShowStory] = React.useState(false);

    // Story templates with blanks to fill in
    const storyTemplates = [
        {
            id: 'adventure',
            title: '🏴‍☠️ Pirate Adventure',
            emoji: '🏴‍☠️',
            prompts: [
                { key: 'name', type: 'Your name' },
                { key: 'adjective1', type: 'Adjective (like big, silly, scary)' },
                { key: 'animal', type: 'Animal' },
                { key: 'place', type: 'Place' },
                { key: 'food', type: 'Food' },
                { key: 'color', type: 'Color' },
                { key: 'verb', type: 'Action word (like run, jump, dance)' },
                { key: 'number', type: 'Number' }
            ],
            template: `Once upon a time, {name} was a {adjective1} pirate sailing the seven seas! One day, they found a treasure map drawn by a magical {animal}. The map led to {place}, where the legendary {food} treasure was buried. When {name} arrived, they saw a {color} chest guarded by {number} dancing parrots! {name} had to {verb} around the parrots to get the treasure. In the end, {name} became the richest pirate in all the land and shared the {food} with everyone!`
        },
        {
            id: 'space',
            title: '🚀 Space Adventure',
            emoji: '🚀',
            prompts: [
                { key: 'name', type: 'Your name' },
                { key: 'adjective1', type: 'Adjective (like tiny, enormous, sparkly)' },
                { key: 'planet', type: 'Made-up planet name' },
                { key: 'alien', type: 'What the alien looks like' },
                { key: 'vehicle', type: 'Type of vehicle' },
                { key: 'superpower', type: 'Superpower' },
                { key: 'snack', type: 'Favorite snack' },
                { key: 'sound', type: 'Funny sound' }
            ],
            template: `Astronaut {name} was flying through space in their {adjective1} spaceship when they discovered the planet {planet}! On this strange world, they met a friendly alien who looked like {alien}. The alien was riding a {vehicle} and had the amazing power of {superpower}! The alien offered {name} some delicious space {snack} that made a "{sound}" noise when you ate it. Together, they had the most {adjective1} adventure exploring the galaxy and became best friends forever!`
        },
        {
            id: 'school',
            title: '🏫 Silly School Day',
            emoji: '🏫',
            prompts: [
                { key: 'name', type: 'Your name' },
                { key: 'teacher', type: 'Funny teacher name' },
                { key: 'subject', type: 'School subject' },
                { key: 'object', type: 'Random object' },
                { key: 'adjective1', type: 'Adjective (like wobbly, sticky, fluffy)' },
                { key: 'animal', type: 'Animal' },
                { key: 'activity', type: 'Fun activity' },
                { key: 'exclamation', type: 'Something you shout' }
            ],
            template: `{name} walked into school and discovered that their teacher, Mrs. {teacher}, was teaching a new subject called {subject}! Instead of books, everyone had to use a {object} to learn. The classroom was {adjective1} and full of {animal}s walking around everywhere! For recess, all the kids got to {activity} while shouting "{exclamation}!" at the top of their lungs. It was the silliest school day {name} had ever experienced!`
        },
        {
            id: 'superhero',
            title: '🦸‍♀️ Superhero Story',
            emoji: '🦸‍♀️',
            prompts: [
                { key: 'name', type: 'Your superhero name' },
                { key: 'power', type: 'Superpower' },
                { key: 'villain', type: 'Villain name' },
                { key: 'adjective1', type: 'Adjective (like slimy, sparkly, giant)' },
                { key: 'city', type: 'City name' },
                { key: 'weapon', type: 'Silly weapon' },
                { key: 'food', type: 'Food' },
                { key: 'celebration', type: 'Way to celebrate' }
            ],
            template: `In the city of {city}, the amazing superhero {name} used their power of {power} to protect everyone! One day, the evil villain {villain} appeared with a {adjective1} plan to steal all the {food} in the world! {name} grabbed their trusty {weapon} and flew into action. After an epic battle involving lots of {power}, {name} defeated {villain} and saved the day! The whole city celebrated by {celebration} and everyone lived happily ever after!`
        },
        {
            id: 'monster',
            title: '👹 Friendly Monster',
            emoji: '👹',
            prompts: [
                { key: 'monster', type: 'Monster name' },
                { key: 'color', type: 'Color' },
                { key: 'size', type: 'Size (like tiny, huge, medium)' },
                { key: 'hobby', type: 'Hobby or activity' },
                { key: 'food', type: 'Favorite food' },
                { key: 'place', type: 'Place where monster lives' },
                { key: 'friend', type: 'Friend\'s name' },
                { key: 'talent', type: 'Special talent' }
            ],
            template: `Deep in {place} lived a {color} monster named {monster}. Despite being {size}, {monster} was the friendliest creature around! Every day, {monster} loved to {hobby} and eat lots of {food}. One day, {monster} met a human named {friend} and they became instant best friends! {monster} showed off their amazing talent of {talent}, and {friend} was so impressed! From then on, they had adventures together every single day, proving that monsters and humans make the best of friends!`
        }
    ];

    const selectStory = (story) => {
        setCurrentStory(story);
        setUserInputs({});
        setCurrentStep(0);
        setShowStory(false);
        setCompletedStory('');
    };

    const handleInputChange = (key, value) => {
        setUserInputs(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const nextStep = () => {
        if (currentStep < currentStory.prompts.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            generateStory();
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const generateStory = () => {
        let story = currentStory.template;
        
        // Replace all placeholders with user inputs
        Object.keys(userInputs).forEach(key => {
            const regex = new RegExp(`{${key}}`, 'g');
            story = story.replace(regex, userInputs[key]);
        });
        
        setCompletedStory(story);
        setShowStory(true);
        
        // Read the story aloud
        if (window.speakText) {
            setTimeout(() => {
                window.speakText(story);
            }, 500);
        }
    };

    const startOver = () => {
        setCurrentStory(null);
        setUserInputs({});
        setCurrentStep(0);
        setShowStory(false);
        setCompletedStory('');
    };

    const generateAnother = () => {
        setUserInputs({});
        setCurrentStep(0);
        setShowStory(false);
        setCompletedStory('');
    };

    // Story selection screen
    if (!currentStory) {
        return (
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 text-center">Story Generator 📚</h3>
                <p className="text-sm text-gray-600 text-center">Choose a story to create your own silly adventure!</p>
                
                <div className="space-y-3">
                    {storyTemplates.map((story) => (
                        <button
                            key={story.id}
                            onClick={() => selectStory(story)}
                            className="w-full bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 px-4 rounded-lg transition-all duration-200 hover:scale-105 shadow-md"
                        >
                            <div className="flex items-center justify-center space-x-2">
                                <span className="text-2xl">{story.emoji}</span>
                                <span className="text-lg">{story.title}</span>
                            </div>
                        </button>
                    ))}
                </div>
                
                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                    <p className="text-xs text-yellow-800 text-center">
                        <strong>📝 How it works:</strong> Pick a story, fill in the blanks with silly words, and create your own funny adventure!
                    </p>
                </div>
            </div>
        );
    }

    // Completed story view
    if (showStory) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-800">Your Story! 📖</h3>
                    <span className="text-2xl">{currentStory.emoji}</span>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg border-2 border-dashed border-purple-300">
                    <h4 className="text-center font-bold text-purple-800 mb-3">{currentStory.title}</h4>
                    <p className="text-gray-800 leading-relaxed text-sm">
                        {completedStory}
                    </p>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={generateAnother}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                        🔄 New Words
                    </button>
                    <button
                        onClick={startOver}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                        📚 New Story
                    </button>
                </div>
                
                <button
                    onClick={() => window.speakText && window.speakText(completedStory)}
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                    🔊 Read Story Aloud
                </button>
            </div>
        );
    }

    // Input collection view
    const currentPrompt = currentStory.prompts[currentStep];
    const isLastStep = currentStep === currentStory.prompts.length - 1;
    const currentInput = userInputs[currentPrompt.key] || '';

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800">{currentStory.title}</h3>
                <span className="text-2xl">{currentStory.emoji}</span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                    className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / currentStory.prompts.length) * 100}%` }}
                ></div>
            </div>
            <div className="text-center text-sm text-gray-600">
                Step {currentStep + 1} of {currentStory.prompts.length}
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                    Enter a {currentPrompt.type}:
                </label>
                <input
                    type="text"
                    value={currentInput}
                    onChange={(e) => handleInputChange(currentPrompt.key, e.target.value)}
                    placeholder={`Type a ${currentPrompt.type.toLowerCase()}...`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    autoFocus
                />
            </div>
            
            <div className="grid grid-cols-3 gap-2">
                <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                    ← Back
                </button>
                
                <button
                    onClick={startOver}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                >
                    🏠 Menu
                </button>
                
                <button
                    onClick={nextStep}
                    disabled={!currentInput.trim()}
                    className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                    {isLastStep ? '✨ Create!' : 'Next →'}
                </button>
            </div>
            
            {/* Preview of inputs so far */}
            {Object.keys(userInputs).length > 0 && (
                <div className="bg-purple-50 p-3 rounded-lg">
                    <h4 className="text-xs font-bold text-purple-800 mb-2">Your Words So Far:</h4>
                    <div className="flex flex-wrap gap-1">
                        {Object.entries(userInputs).map(([key, value]) => (
                            <span key={key} className="bg-purple-200 text-purple-800 px-2 py-1 rounded text-xs">
                                {value}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};