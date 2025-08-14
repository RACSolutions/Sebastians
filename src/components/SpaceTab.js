// SpaceTab component for Sebastian's Silly App
const SpaceTab = () => {
    const [selectedPlanet, setSelectedPlanet] = React.useState(null);
    const [showStars, setShowStars] = React.useState(true);
    const [viewMode, setViewMode] = React.useState('solar-system'); // 'solar-system', 'planet-detail', 'space-quiz'
    const [quizScore, setQuizScore] = React.useState(0);
    const [currentQuizQuestion, setCurrentQuizQuestion] = React.useState(0);
    const [spaceQuizActive, setSpaceQuizActive] = React.useState(false);
    const [highScore, setHighScore] = React.useState(() => {
        const saved = localStorage.getItem('sebastianSpaceQuizHighScore');
        return saved ? parseInt(saved) : 0;
    });
    const [astronaut, setAstronaut] = React.useState({ x: 50, y: 50, visible: true });
    const [showPlanetPopup, setShowPlanetPopup] = React.useState(false);
    const [popupPlanet, setPopupPlanet] = React.useState(null);
    const [showAstronautPopup, setShowAstronautPopup] = React.useState(false);

    // Planet data with fun facts for kids - Updated with custom images
    const planets = [
        {
            name: 'Sun',
            icon: '🌞', // Fallback if image doesn't load
            backgroundImage: 'url("src/images/sun.png")',
            color: 'from-yellow-300 via-orange-400 to-red-500',
            size: 'w-16 h-16',
            position: { x: 50, y: 50 },
            facts: [
                'The Sun is actually a giant star! ⭐',
                'It would take 1.3 million Earths to fill up the Sun! 🌍',
                'The Sun is about 4.6 billion years old! 🎂',
                'Sunlight takes 8 minutes to reach Earth! ⚡',
                'The Sun is so hot, its core is 15 million degrees! 🔥'
            ],
            funFact: 'If the Sun was the size of a basketball, Earth would be the size of a peppercorn!',
            distance: '0 km (You\'re looking at it!)',
            type: 'Star',
            glowEffect: true
        },
        {
            name: 'Mercury',
            icon: '🌑',
            backgroundImage: 'url("src/images/mercury.png")',
            color: 'from-gray-300 via-gray-500 to-gray-700',
            size: 'w-6 h-6',
            position: { x: 35, y: 45 },
            facts: [
                'Mercury is the smallest planet! 🐭',
                'One day on Mercury lasts 59 Earth days! ⏰',
                'It has no atmosphere, so meteors crash right into it! 💥',
                'Mercury is covered in craters like the Moon! 🌙',
                'It\'s the fastest planet, zooming around the Sun! 🏃‍♂️'
            ],
            funFact: 'Mercury has ice at its poles even though it\'s closest to the Sun!',
            distance: '58 million km from Sun',
            type: 'Rocky Planet'
        },
        {
            name: 'Venus',
            icon: '🟡',
            backgroundImage: 'url("src/images/venus.png")',
            color: 'from-yellow-200 via-orange-300 to-yellow-400',
            size: 'w-8 h-8',
            position: { x: 25, y: 60 },
            facts: [
                'Venus is the hottest planet - hotter than Mercury! 🌡️',
                'It rains acid on Venus! ☔',
                'Venus spins backwards compared to Earth! 🔄',
                'A day on Venus is longer than its year! 📅',
                'Venus is covered in thick, poisonous clouds! ☁️'
            ],
            funFact: 'Venus is sometimes called Earth\'s evil twin because it\'s similar in size!',
            distance: '108 million km from Sun',
            type: 'Rocky Planet'
        },
        {
            name: 'Earth',
            icon: '🌍',
            backgroundImage: 'url("src/images/earth.png")',
            color: 'from-blue-400 via-green-400 to-blue-500',
            size: 'w-9 h-9',
            position: { x: 20, y: 35 },
            facts: [
                'Earth is the only planet with life that we know of! 🐸',
                'About 71% of Earth is covered in water! 🌊',
                'Earth has one moon that controls our tides! 🌙',
                'Our planet is about 4.5 billion years old! 🎂',
                'Earth travels around the Sun at 67,000 mph! 🚗'
            ],
            funFact: 'If Earth was the size of an apple, our atmosphere would be as thin as the apple\'s skin!',
            distance: '150 million km from Sun',
            type: 'Rocky Planet'
        },
        {
            name: 'Mars',
            icon: '🔴',
            backgroundImage: 'url("src/images/mars.png")',
            color: 'from-red-400 via-red-600 to-orange-600',
            size: 'w-7 h-7',
            position: { x: 15, y: 20 },
            facts: [
                'Mars is called the Red Planet because of iron rust! 🦀',
                'Mars has the biggest volcano in the solar system! 🌋',
                'A day on Mars is almost the same as Earth! ⏰',
                'Mars has two tiny moons called Phobos and Deimos! 🌙',
                'Scientists are planning to send humans to Mars! 👨‍🚀'
            ],
            funFact: 'Mars has seasons just like Earth, but they last twice as long!',
            distance: '228 million km from Sun',
            type: 'Rocky Planet'
        },
        {
            name: 'Jupiter',
            icon: '🟠',
            backgroundImage: 'url("src/images/jupiter.png")',
            color: 'from-orange-300 via-yellow-500 to-orange-600',
            size: 'w-14 h-14',
            position: { x: 75, y: 25 },
            facts: [
                'Jupiter is the biggest planet - bigger than all others combined! 🐘',
                'Jupiter has a giant storm called the Great Red Spot! 🌪️',
                'Jupiter has at least 79 moons! 🌙',
                'Jupiter is like a failed star - mostly gas! ⭐',
                'Jupiter protects Earth by catching asteroids! 🛡️'
            ],
            funFact: 'Jupiter is so big that all the other planets could fit inside it!',
            distance: '778 million km from Sun',
            type: 'Gas Giant',
            hasStorm: true
        },
        {
            name: 'Saturn',
            icon: '🪐',
            backgroundImage: 'url("src/images/saturn.png")',
            color: 'from-yellow-200 via-amber-300 to-yellow-400',
            size: 'w-12 h-12',
            position: { x: 80, y: 65 },
            facts: [
                'Saturn has beautiful rings made of ice and rock! 💍',
                'Saturn is so light it would float in water! 🏊‍♂️',
                'Saturn has at least 82 moons! 🌙',
                'Its moon Titan is bigger than Mercury! 📏',
                'Saturn\'s rings are only about 30 feet thick! 📄'
            ],
            funFact: 'Saturn\'s rings are made of billions of pieces of ice and rock!',
            distance: '1.4 billion km from Sun',
            type: 'Gas Giant',
            hasRings: true
        },
        {
            name: 'Uranus',
            icon: '🔵',
            backgroundImage: 'url("src/images/uranus.png")',
            color: 'from-cyan-300 via-blue-400 to-teal-400',
            size: 'w-10 h-10',
            position: { x: 85, y: 40 },
            facts: [
                'Uranus spins on its side like a rolling ball! ⚽',
                'Uranus is made mostly of water, methane, and ammonia! 💧',
                'One season on Uranus lasts 21 Earth years! ❄️',
                'Uranus has faint rings like Saturn! 💍',
                'Uranus was the first planet discovered with a telescope! 🔭'
            ],
            funFact: 'Uranus rotates on its side, so its poles take turns facing the Sun!',
            distance: '2.9 billion km from Sun',
            type: 'Ice Giant'
        },
        {
            name: 'Neptune',
            icon: '🔷',
            backgroundImage: 'url("src/images/neptune.png")',
            color: 'from-blue-600 via-blue-700 to-indigo-800',
            size: 'w-10 h-10',
            position: { x: 90, y: 55 },
            facts: [
                'Neptune has the strongest winds in the solar system! 💨',
                'Neptune takes 165 Earth years to orbit the Sun! 📅',
                'Neptune is so far away it was discovered by math! 🧮',
                'Neptune has 14 known moons! 🌙',
                'One day on Neptune is about 16 Earth hours! ⏰'
            ],
            funFact: 'Neptune\'s winds can blow at 1,200 mph - faster than the speed of sound!',
            distance: '4.5 billion km from Sun',
            type: 'Ice Giant'
        }
    ];

    // Space quiz questions
    const spaceQuizQuestions = [
        {
            question: 'Which planet is closest to the Sun?',
            options: ['Venus', 'Mercury', 'Mars', 'Earth'],
            correct: 1,
            emoji: '☿️'
        },
        {
            question: 'Which planet is known as the Red Planet?',
            options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
            correct: 1,
            emoji: '♂️'
        },
        {
            question: 'Which planet has beautiful rings?',
            options: ['Jupiter', 'Saturn', 'Neptune', 'Uranus'],
            correct: 1,
            emoji: '🪐'
        },
        {
            question: 'How many moons does Earth have?',
            options: ['0', '1', '2', '3'],
            correct: 1,
            emoji: '🌙'
        },
        {
            question: 'What is the Sun?',
            options: ['A planet', 'A moon', 'A star', 'An asteroid'],
            correct: 2,
            emoji: '⭐'
        },
        {
            question: 'Which is the biggest planet?',
            options: ['Saturn', 'Jupiter', 'Neptune', 'Uranus'],
            correct: 1,
            emoji: '🪐'
        }
    ];

    // Generate random stars for background
    const generateStars = () => {
        return Array.from({ length: 50 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() > 0.8 ? 'text-lg' : 'text-sm',
            opacity: Math.random() * 0.7 + 0.3
        }));
    };

    const [stars] = React.useState(generateStars());

    // Move astronaut around
    React.useEffect(() => {
        const moveAstronaut = () => {
            setAstronaut(prev => ({
                ...prev,
                x: Math.random() * 80 + 10,
                y: Math.random() * 80 + 10
            }));
        };

        const interval = setInterval(moveAstronaut, 5000);
        return () => clearInterval(interval);
    }, []);

    // Planet click handler
    const handlePlanetClick = (planet) => {
        setPopupPlanet(planet);
        setShowPlanetPopup(true);
        
        // Play sound if available
        if (window.playPopSound) {
            window.playPopSound();
        }
    };

    // Quiz functions
    const startQuiz = () => {
        setSpaceQuizActive(true);
        setCurrentQuizQuestion(0);
        setQuizScore(0);
        setViewMode('space-quiz');
    };

    const handleQuizAnswer = (selectedAnswer) => {
        const correct = selectedAnswer === spaceQuizQuestions[currentQuizQuestion].correct;
        
        if (correct) {
            setQuizScore(prev => prev + 1);
            if (window.playPopSound) {
                window.playPopSound();
            }
        }

        if (currentQuizQuestion < spaceQuizQuestions.length - 1) {
            setTimeout(() => {
                setCurrentQuizQuestion(prev => prev + 1);
            }, 1000);
        } else {
            setTimeout(() => {
                setSpaceQuizActive(false);
                if (window.speakText) {
                    window.speakText(`Quiz complete! You got ${quizScore + (correct ? 1 : 0)} out of ${spaceQuizQuestions.length} questions right!`);
                }
            }, 2000);
        }
    };

    const backToSolarSystem = () => {
        setViewMode('solar-system');
        setSelectedPlanet(null);
    };

    // Close popup and optionally go to planet detail
    const closePlanetPopup = () => {
        setShowPlanetPopup(false);
        setPopupPlanet(null);
    };

    const goToPlanetDetail = (planet) => {
        setSelectedPlanet(planet);
        setViewMode('planet-detail');
        closePlanetPopup();
    };

    // Astronaut click handler
    const handleAstronautClick = () => {
        setShowAstronautPopup(true);
        
        // Play sound if available
        if (window.playPopSound) {
            window.playPopSound();
        }
    };

    const closeAstronautPopup = () => {
        setShowAstronautPopup(false);
    };

    // Solar System View
    const SolarSystemView = () => (
        <div className="space-y-4">
            <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">🚀 Space Explorer 🚀</h3>
                <p className="text-gray-600">Click on planets to learn amazing facts!</p>
            </div>

            {/* Space Scene */}
            <div className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-black rounded-xl p-2 sm:p-4 overflow-hidden" style={{ height: '280px', minHeight: '280px' }}>
                {/* Stars */}
                {showStars && stars.map(star => (
                    <div
                        key={star.id}
                        className={`absolute text-white ${star.size} animate-pulse pointer-events-none`}
                        style={{
                            left: `${star.x}%`,
                            top: `${star.y}%`,
                            opacity: star.opacity
                        }}
                    >
                        ✨
                    </div>
                ))}

                {/* Astronaut - Better representation */}
                <div
                    className="absolute text-2xl sm:text-3xl transition-all duration-3000 ease-in-out cursor-pointer hover:scale-110 z-20"
                    style={{ left: `${astronaut.x}%`, top: `${astronaut.y}%` }}
                    onClick={handleAstronautClick}
                >
                    🧑‍🚀
                </div>

                {/* Planets - Mobile Optimized with Better Icons */}
                {planets.map((planet) => {
                    // Mobile-specific positioning and sizing
                    const mobileSize = planet.name === 'Sun' ? 'w-12 h-12 sm:w-16 sm:h-16' :
                                     planet.name === 'Jupiter' ? 'w-10 h-10 sm:w-14 sm:h-14' :
                                     planet.name === 'Saturn' ? 'w-9 h-9 sm:w-12 sm:h-12' :
                                     planet.name === 'Uranus' || planet.name === 'Neptune' ? 'w-7 h-7 sm:w-10 sm:h-10' :
                                     planet.name === 'Earth' ? 'w-7 h-7 sm:w-9 sm:h-9' :
                                     planet.name === 'Mars' ? 'w-6 h-6 sm:w-7 sm:h-7' :
                                     planet.name === 'Venus' ? 'w-6 h-6 sm:w-8 sm:h-8' :
                                     'w-5 h-5 sm:w-6 sm:h-6'; // Mercury

                    return (
                        <div
                            key={planet.name}
                            className="absolute group cursor-pointer transform transition-all duration-300 hover:scale-110 active:scale-95 z-10"
                            style={{ 
                                left: `${planet.position.x}%`, 
                                top: `${planet.position.y}%`,
                                transform: 'translate(-50%, -50%)'
                            }}
                            onClick={() => handlePlanetClick(planet)}
                        >
                            <div 
                                className={`${mobileSize} rounded-full shadow-lg border-2 border-white/30 flex items-center justify-center relative overflow-hidden ${planet.glowEffect ? 'shadow-yellow-400/50' : ''} ${planet.hasRings ? 'ring-2 ring-yellow-300/40 ring-offset-2 ring-offset-transparent' : ''}`}
                                style={{
                                    backgroundImage: planet.backgroundImage,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundColor: 'transparent'
                                }}
                            >
                                {/* Only show emoji if background image fails to load */}
                                <img 
                                    src={planet.backgroundImage.replace('url("', '').replace('")', '')}
                                    alt={planet.name}
                                    className="w-full h-full object-cover rounded-full"
                                    onError={(e) => {
                                        // Hide the img and show fallback
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'block';
                                    }}
                                    onLoad={(e) => {
                                        // Hide the fallback emoji when image loads successfully
                                        e.target.nextSibling.style.display = 'none';
                                    }}
                                />
                                {/* Fallback emoji */}
                                <span className={`text-sm sm:text-lg absolute inset-0 flex items-center justify-center text-white font-bold bg-gradient-to-br ${planet.color} rounded-full`} style={{ display: 'none' }}>
                                    {planet.icon}
                                </span>
                                
                                {/* Planet name tooltip - hidden on mobile */}
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap hidden sm:block">
                                    {planet.name}
                                </div>
                                
                                {/* Mobile planet name - shows on touch */}
                                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white text-xs px-1 py-0.5 rounded opacity-0 group-active:opacity-100 transition-opacity duration-200 whitespace-nowrap sm:hidden">
                                    {planet.name}
                                </div>
                                
                                {/* Special effects for planets */}
                                {planet.hasStorm && (
                                    <div className="absolute inset-0 rounded-full bg-red-500/20 animate-pulse"></div>
                                )}
                                {planet.glowEffect && (
                                    <div className="absolute inset-0 rounded-full bg-yellow-300/30 animate-pulse"></div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Astronaut Popup */}
            {showAstronautPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden">
                        {/* Popup Header */}
                        <div className={`bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 flex justify-between items-center`}>
                            <div className="flex items-center space-x-2">
                                <span className="text-2xl">🧑‍🚀</span>
                                <div>
                                    <h3 className="text-lg font-bold">Space Explorer</h3>
                                    <div className="text-xs opacity-90">Astronaut</div>
                                </div>
                            </div>
                            <button
                                onClick={closeAstronautPopup}
                                className="text-white hover:text-gray-200 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20 transition-colors duration-200 flex-shrink-0"
                            >
                                ×
                            </button>
                        </div>
                        
                        {/* Popup Content */}
                        <div className="p-3">
                            <div className="mb-3">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-gray-800 text-sm leading-relaxed">
                                    🚀 Hello from space! I'm exploring the solar system and learning about all the amazing planets!
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <div className="bg-yellow-50 rounded-lg p-2 text-gray-800 text-xs">
                                    ⭐ Did you know astronauts float in space because there's no gravity?
                                </div>
                                <div className="bg-green-50 rounded-lg p-2 text-gray-800 text-xs">
                                    🌍 From space, Earth looks like a beautiful blue marble!
                                </div>
                                <div className="bg-purple-50 rounded-lg p-2 text-gray-800 text-xs">
                                    🌌 Space is completely silent because there's no air to carry sound!
                                </div>
                            </div>
                        </div>
                        
                        {/* Popup Footer */}
                        <div className="bg-gray-50 px-3 py-2 border-t">
                            <button
                                onClick={closeAstronautPopup}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded-lg transition-colors duration-200 text-sm"
                            >
                                Continue Exploring! 🚀
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Planet Info Popup - Mobile Optimized */}
            {showPlanetPopup && popupPlanet && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm max-h-[85vh] overflow-hidden">
                        {/* Popup Header */}
                        <div className={`bg-gradient-to-r ${popupPlanet.color} text-white p-3 flex justify-between items-center`}>
                            <div className="flex items-center space-x-2">
                                <span className="text-2xl">{popupPlanet.icon}</span>
                                <div>
                                    <h3 className="text-lg font-bold">{popupPlanet.name}</h3>
                                    <div className="text-xs opacity-90">{popupPlanet.type}</div>
                                </div>
                            </div>
                            <button
                                onClick={closePlanetPopup}
                                className="text-white hover:text-gray-200 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20 transition-colors duration-200 flex-shrink-0"
                            >
                                ×
                            </button>
                        </div>
                        
                        {/* Popup Content */}
                        <div className="p-3 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 140px)' }}>
                            <div className="mb-3">
                                <div className="text-sm font-semibold text-gray-700 mb-2">Fun Fact:</div>
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 text-gray-800 text-sm leading-relaxed">
                                    {popupPlanet.funFact}
                                </div>
                            </div>
                            
                            <div className="mb-3">
                                <div className="text-sm font-semibold text-gray-700 mb-1">Distance from Sun:</div>
                                <div className="text-blue-600 font-medium text-sm">{popupPlanet.distance}</div>
                            </div>

                            <div className="mb-3">
                                <div className="text-sm font-semibold text-gray-700 mb-2">Quick Facts:</div>
                                <div className="space-y-2">
                                    {popupPlanet.facts.slice(0, 3).map((fact, index) => (
                                        <div key={index} className="bg-blue-50 rounded-lg p-2 text-gray-800 text-xs leading-relaxed">
                                            {fact}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        {/* Popup Footer */}
                        <div className="bg-gray-50 px-3 py-2 flex gap-2 border-t">
                            <button
                                onClick={closePlanetPopup}
                                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-3 rounded-lg transition-colors duration-200 text-sm"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => goToPlanetDetail(popupPlanet)}
                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded-lg transition-colors duration-200 text-sm"
                            >
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Controls */}
            <div className="grid grid-cols-2 gap-2">
                <button
                    onClick={() => setShowStars(!showStars)}
                    className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 sm:py-3 px-2 sm:px-4 rounded-lg transition-colors duration-200 text-sm"
                >
                    {showStars ? '🌟 Hide Stars' : '⭐ Show Stars'}
                </button>
                <button
                    onClick={startQuiz}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 sm:py-3 px-2 sm:px-4 rounded-lg transition-colors duration-200 text-sm"
                >
                    🧠 Space Quiz
                </button>
            </div>

            {/* Quick Facts */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-3 border border-purple-200">
                <h4 className="font-bold text-purple-800 mb-2 text-center text-sm">🌌 Did You Know?</h4>
                <div className="text-xs text-purple-700 space-y-1">
                    <div>🚀 There are over 200 billion stars in our galaxy!</div>
                    <div>🌍 Earth is the only planet we know that has life!</div>
                    <div>🌙 Jupiter has 79 moons - that's a lot of nightlights!</div>
                    <div>⚡ Light from the Sun takes 8 minutes to reach Earth!</div>
                </div>
            </div>
        </div>
    );

    // Planet Detail View
    const PlanetDetailView = () => (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <button
                    onClick={backToSolarSystem}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                    ← Back to Space
                </button>
                <h3 className="text-xl font-bold text-gray-800">Planet Explorer</h3>
                <div className="w-24"></div>
            </div>

            {selectedPlanet && (
                <>
                    {/* Planet Header */}
                    <div 
                        className={`bg-gradient-to-br ${selectedPlanet.color} rounded-2xl p-6 text-white text-center shadow-lg relative overflow-hidden`}
                        style={{
                            backgroundImage: selectedPlanet.backgroundImage,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundBlendMode: 'overlay'
                        }}
                    >
                        <div className="relative z-10">
                            <div className="text-6xl mb-3">{selectedPlanet.icon}</div>
                            <h2 className="text-3xl font-bold mb-2">{selectedPlanet.name}</h2>
                            <div className="bg-white bg-opacity-20 rounded-lg p-3">
                                <div className="text-lg">{selectedPlanet.funFact}</div>
                            </div>
                        </div>
                    </div>

                    {/* Planet Stats */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-blue-50 rounded-lg p-4 text-center">
                            <div className="text-2xl mb-2">📏</div>
                            <div className="text-sm font-semibold text-gray-700">Type</div>
                            <div className="text-lg font-bold text-blue-600">{selectedPlanet.type}</div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4 text-center">
                            <div className="text-2xl mb-2">🚀</div>
                            <div className="text-sm font-semibold text-gray-700">Distance</div>
                            <div className="text-sm font-bold text-green-600">{selectedPlanet.distance}</div>
                        </div>
                    </div>

                    {/* Fun Facts */}
                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                        <h4 className="font-bold text-yellow-800 mb-3 text-center">🎉 Amazing Facts!</h4>
                        <div className="space-y-2">
                            {selectedPlanet.facts.map((fact, index) => (
                                <div key={index} className="bg-white rounded-lg p-3 text-gray-800 text-sm">
                                    {fact}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-1 gap-3">
                        <button
                            onClick={() => {
                                const randomFact = selectedPlanet.facts[Math.floor(Math.random() * selectedPlanet.facts.length)];
                                // Show popup instead of speaking
                                alert(`Random fact about ${selectedPlanet.name}: ${randomFact}`);
                            }}
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
                        >
                            🎲 Random Fact
                        </button>
                    </div>
                </>
            )}
        </div>
    );

    // Quiz View
    const QuizView = () => {
        const question = spaceQuizQuestions[currentQuizQuestion];
        
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <button
                        onClick={backToSolarSystem}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                        ← Back to Space
                    </button>
                    <h3 className="text-xl font-bold text-gray-800">Space Quiz</h3>
                    <div className="w-24"></div>
                </div>

                {spaceQuizActive ? (
                    <>
                        {/* Progress */}
                        <div className="text-center">
                            <div className="text-lg font-semibold">Question {currentQuizQuestion + 1} of {spaceQuizQuestions.length}</div>
                            <div className="text-sm text-gray-600">Score: {quizScore}/{currentQuizQuestion}</div>
                        </div>

                        {/* Question */}
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
                            <div className="text-center">
                                <div className="text-4xl mb-4">{question.emoji}</div>
                                <div className="text-xl font-bold text-gray-800">{question.question}</div>
                            </div>
                        </div>

                        {/* Answer Options */}
                        <div className="grid grid-cols-1 gap-3">
                            {question.options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleQuizAnswer(index)}
                                    className="bg-white hover:bg-blue-100 border-2 border-blue-300 text-gray-800 font-bold py-4 px-6 rounded-lg transition-all duration-200 hover:scale-105"
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center space-y-4">
                        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                            <div className="text-4xl mb-4">🎉</div>
                            <div className="text-2xl font-bold text-green-600 mb-2">Quiz Complete!</div>
                            <div className="text-lg">You got {quizScore} out of {spaceQuizQuestions.length} questions right!</div>
                            <div className="text-sm text-gray-600 mt-2">
                                {quizScore === spaceQuizQuestions.length ? 'Perfect! You\'re a space expert! 🚀' :
                                 quizScore >= spaceQuizQuestions.length * 0.7 ? 'Great job! You know a lot about space! ⭐' :
                                 'Good try! Keep exploring to learn more! 🌟'}
                            </div>
                        </div>
                        
                        <button
                            onClick={startQuiz}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                        >
                            🔄 Try Again
                        </button>
                    </div>
                )}
            </div>
        );
    };

    // Main render
    return (
        <div className="space-y-4">
            {viewMode === 'solar-system' && <SolarSystemView />}
            {viewMode === 'planet-detail' && <PlanetDetailView />}
            {viewMode === 'space-quiz' && <QuizView />}
        </div>
    );
};