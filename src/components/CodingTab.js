// CodingTab component for Sebastian's Silly App - Learn to Code!
const CodingTab = () => {
    const [currentLesson, setCurrentLesson] = React.useState(null);
    const [completedLessons, setCompletedLessons] = React.useState(() => {
        const saved = localStorage.getItem('sebastianCodingProgress');
        return saved ? JSON.parse(saved) : [];
    });
    const [showCelebration, setShowCelebration] = React.useState(false);
    
    // Drag and Drop state
    const [draggedBlock, setDraggedBlock] = React.useState(null);
    const [codeBlocks, setCodeBlocks] = React.useState([]);
    const [robotPosition, setRobotPosition] = React.useState({ x: 0, y: 0 });
    const [robotDirection, setRobotDirection] = React.useState('right');
    const [isRunning, setIsRunning] = React.useState(false);
    const [gameGrid, setGameGrid] = React.useState([]);

    // Coding lessons for kids
    const lessons = [
        {
            id: 'first-steps',
            title: '👶 First Steps',
            emoji: '👶',
            difficulty: 'Super Easy',
            description: 'Learn how to make the robot move!',
            type: 'drag-drop',
            goal: 'Move the robot 1 step to the right!',
            gridSize: 3,
            startPos: { x: 0, y: 1 },
            targetPos: { x: 1, y: 1 },
            obstacles: [],
            availableBlocks: [
                { id: 'move-right', label: '➡️ Move Right', color: 'bg-blue-500', action: 'move-right' }
            ]
        },
        {
            id: 'sequences',
            title: '🚶 Walking Path',
            emoji: '🚶',
            difficulty: 'Easy',
            description: 'Make the robot walk in a line!',
            type: 'drag-drop',
            goal: 'Walk to the star in 3 steps!',
            gridSize: 4,
            startPos: { x: 0, y: 1 },
            targetPos: { x: 3, y: 1 },
            obstacles: [],
            availableBlocks: [
                { id: 'move-right', label: '➡️ Move Right', color: 'bg-blue-500', action: 'move-right' }
            ]
        },
        {
            id: 'directions',
            title: '🧭 Four Directions',
            emoji: '🧭',
            difficulty: 'Easy',
            description: 'Learn all four directions!',
            type: 'drag-drop',
            goal: 'Go up, then right to reach the star!',
            gridSize: 4,
            startPos: { x: 1, y: 2 },
            targetPos: { x: 2, y: 1 },
            obstacles: [],
            availableBlocks: [
                { id: 'move-right', label: '➡️ Move Right', color: 'bg-blue-500', action: 'move-right' },
                { id: 'move-left', label: '⬅️ Move Left', color: 'bg-green-500', action: 'move-left' },
                { id: 'move-up', label: '⬆️ Move Up', color: 'bg-purple-500', action: 'move-up' },
                { id: 'move-down', label: '⬇️ Move Down', color: 'bg-orange-500', action: 'move-down' }
            ]
        },
        {
            id: 'planning',
            title: '🗺️ Make a Plan',
            emoji: '🗺️',
            difficulty: 'Medium',
            description: 'Think before you code!',
            type: 'drag-drop',
            goal: 'Plan your path around the wall!',
            gridSize: 5,
            startPos: { x: 0, y: 2 },
            targetPos: { x: 4, y: 2 },
            obstacles: [{ x: 2, y: 2 }],
            availableBlocks: [
                { id: 'move-right', label: '➡️ Move Right', color: 'bg-blue-500', action: 'move-right' },
                { id: 'move-up', label: '⬆️ Move Up', color: 'bg-purple-500', action: 'move-up' },
                { id: 'move-down', label: '⬇️ Move Down', color: 'bg-orange-500', action: 'move-down' }
            ]
        },
        {
            id: 'loops-intro',
            title: '🔄 Magic Repeat',
            emoji: '🔄',
            difficulty: 'Medium',
            description: 'Learn the magic of repeating!',
            type: 'drag-drop',
            goal: 'Use repeat to move 3 steps!',
            gridSize: 5,
            startPos: { x: 0, y: 2 },
            targetPos: { x: 3, y: 2 },
            obstacles: [],
            availableBlocks: [
                { id: 'move-right', label: '➡️ Move Right', color: 'bg-blue-500', action: 'move-right' },
                { id: 'repeat-3', label: '🔄 Repeat 3 times', color: 'bg-purple-500', action: 'repeat', count: 3, container: true }
            ]
        },
        {
            id: 'collect-gems',
            title: '💎 Gem Collector',
            emoji: '💎',
            difficulty: 'Medium',
            description: 'Collect all the shiny gems!',
            type: 'drag-drop',
            goal: 'Collect all 4 gems in a row!',
            gridSize: 6,
            startPos: { x: 0, y: 2 },
            targetPos: { x: 5, y: 2 },
            gems: [{ x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 }],
            obstacles: [],
            availableBlocks: [
                { id: 'move-right', label: '➡️ Move Right', color: 'bg-blue-500', action: 'move-right' },
                { id: 'repeat-5', label: '🔄 Repeat 5 times', color: 'bg-purple-500', action: 'repeat', count: 5, container: true }
            ]
        },
        {
            id: 'smart-robot',
            title: '🤖 Smart Robot',
            emoji: '🤖',
            difficulty: 'Hard',
            description: 'Teach robot to think and decide!',
            type: 'drag-drop',
            goal: 'Go around the wall automatically!',
            gridSize: 5,
            startPos: { x: 0, y: 2 },
            targetPos: { x: 4, y: 2 },
            obstacles: [{ x: 2, y: 2 }],
            availableBlocks: [
                { id: 'move-right', label: '➡️ Move Right', color: 'bg-blue-500', action: 'move-right' },
                { id: 'move-up', label: '⬆️ Move Up', color: 'bg-purple-500', action: 'move-up' },
                { id: 'move-down', label: '⬇️ Move Down', color: 'bg-orange-500', action: 'move-down' },
                { id: 'if-obstacle', label: '🚧 If blocked, then...', color: 'bg-red-500', action: 'if-obstacle', container: true }
            ]
        },
        {
            id: 'square-dance',
            title: '💃 Square Dance',
            emoji: '💃',
            difficulty: 'Fun',
            description: 'Make the robot dance in a square!',
            type: 'drag-drop',
            goal: 'Dance in a square and return home!',
            gridSize: 4,
            startPos: { x: 1, y: 1 },
            targetPos: { x: 1, y: 1 },
            path: [{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 1, y: 2 }, { x: 1, y: 1 }],
            obstacles: [],
            availableBlocks: [
                { id: 'move-right', label: '➡️ Move Right', color: 'bg-blue-500', action: 'move-right' },
                { id: 'move-down', label: '⬇️ Move Down', color: 'bg-orange-500', action: 'move-down' },
                { id: 'move-left', label: '⬅️ Move Left', color: 'bg-green-500', action: 'move-left' },
                { id: 'move-up', label: '⬆️ Move Up', color: 'bg-purple-500', action: 'move-up' },
                { id: 'repeat-4', label: '🔄 Repeat 4 times', color: 'bg-pink-500', action: 'repeat', count: 4, container: true }
            ]
        },
        {
            id: 'treasure-hunt',
            title: '🏴‍☠️ Treasure Hunt',
            emoji: '🏴‍☠️',
            difficulty: 'Challenge',
            description: 'Navigate like a pirate to find treasure!',
            type: 'drag-drop',
            goal: 'Avoid all obstacles and find the treasure!',
            gridSize: 6,
            startPos: { x: 0, y: 0 },
            targetPos: { x: 5, y: 5 },
            obstacles: [{ x: 2, y: 1 }, { x: 3, y: 2 }, { x: 1, y: 4 }, { x: 4, y: 3 }],
            availableBlocks: [
                { id: 'move-right', label: '➡️ Move Right', color: 'bg-blue-500', action: 'move-right' },
                { id: 'move-left', label: '⬅️ Move Left', color: 'bg-green-500', action: 'move-left' },
                { id: 'move-up', label: '⬆️ Move Up', color: 'bg-purple-500', action: 'move-up' },
                { id: 'move-down', label: '⬇️ Move Down', color: 'bg-orange-500', action: 'move-down' },
                { id: 'repeat-3', label: '🔄 Repeat 3 times', color: 'bg-pink-500', action: 'repeat', count: 3, container: true }
            ]
        }
    ];

    // Initialize grid for current lesson
    React.useEffect(() => {
        if (currentLesson) {
            const lesson = lessons.find(l => l.id === currentLesson);
            if (lesson && lesson.type === 'drag-drop') {
                const grid = Array(lesson.gridSize).fill().map(() => Array(lesson.gridSize).fill('empty'));
                
                // Place obstacles
                if (lesson.obstacles) {
                    lesson.obstacles.forEach(obs => {
                        grid[obs.y][obs.x] = 'obstacle';
                    });
                }
                
                // Place gems
                if (lesson.gems) {
                    lesson.gems.forEach(gem => {
                        grid[gem.y][gem.x] = 'gem';
                    });
                }
                
                // Place target
                grid[lesson.targetPos.y][lesson.targetPos.x] = 'target';
                
                setGameGrid(grid);
                setRobotPosition(lesson.startPos);
                setRobotDirection('right');
            }
        }
    }, [currentLesson]);

    const selectLesson = (lessonId) => {
        setCurrentLesson(lessonId);
        setCodeBlocks([]);
        setIsRunning(false);
    };

    const goBackToMenu = () => {
        setCurrentLesson(null);
        setCodeBlocks([]);
        setIsRunning(false);
    };

    // Drag and Drop handlers
    const handleDragStart = (e, block) => {
        setDraggedBlock(block);
        e.dataTransfer.effectAllowed = 'copy';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    };

    const handleDrop = (e, index = null, parentId = null) => {
        e.preventDefault();
        if (draggedBlock) {
            const newBlock = { 
                ...draggedBlock, 
                id: `${draggedBlock.id}-${Date.now()}`,
                children: draggedBlock.container ? [] : undefined
            };
            
            if (parentId) {
                // Adding to a container block
                setCodeBlocks(prev => prev.map(block => {
                    if (block.id === parentId && block.container) {
                        return {
                            ...block,
                            children: [...(block.children || []), newBlock]
                        };
                    }
                    return block;
                }));
            } else if (index !== null) {
                // Insert at specific position
                const newBlocks = [...codeBlocks];
                newBlocks.splice(index, 0, newBlock);
                setCodeBlocks(newBlocks);
            } else {
                // Add to end
                setCodeBlocks(prev => [...prev, newBlock]);
            }
        }
        setDraggedBlock(null);
    };

    const removeBlock = (index, parentId = null) => {
        if (parentId) {
            // Remove from container
            setCodeBlocks(prev => prev.map(block => {
                if (block.id === parentId && block.container) {
                    return {
                        ...block,
                        children: (block.children || []).filter((_, i) => i !== index)
                    };
                }
                return block;
            }));
        } else {
            // Remove from main list
            setCodeBlocks(prev => prev.filter((_, i) => i !== index));
        }
    };

    // Execute the code
    const runCode = async () => {
        if (isRunning) return;
        
        setIsRunning(true);
        const lesson = lessons.find(l => l.id === currentLesson);
        
        if (lesson.type === 'drag-drop') {
            await executeRobotCommands();
        } else if (lesson.type === 'pattern-drawing') {
            await executePatternDrawing();
        }
        
        setIsRunning(false);
    };

    const executeRobotCommands = async () => {
        const lesson = lessons.find(l => l.id === currentLesson);
        let pos = { ...lesson.startPos };
        let collectedGems = 0;
        const totalGems = lesson.gems ? lesson.gems.length : 0;
        
        for (const block of codeBlocks) {
            if (block.action === 'repeat') {
                // Execute repeat block
                for (let i = 0; i < block.count; i++) {
                    for (const childBlock of block.children || []) {
                        pos = await executeMove(pos, childBlock.action, lesson);
                        if (lesson.gems && gameGrid[pos.y] && gameGrid[pos.y][pos.x] === 'gem') {
                            collectedGems++;
                            // Remove gem from grid
                            const newGrid = [...gameGrid];
                            newGrid[pos.y][pos.x] = 'empty';
                            setGameGrid(newGrid);
                        }
                        await new Promise(resolve => setTimeout(resolve, 500));
                    }
                }
            } else if (block.action === 'if-obstacle') {
                // Check if there's an obstacle ahead
                const nextPos = getNextPosition(pos, 'right');
                if (gameGrid[nextPos.y] && gameGrid[nextPos.y][nextPos.x] === 'obstacle') {
                    // Execute children blocks
                    for (const childBlock of block.children || []) {
                        pos = await executeMove(pos, childBlock.action, lesson);
                        await new Promise(resolve => setTimeout(resolve, 500));
                    }
                }
            } else {
                pos = await executeMove(pos, block.action, lesson);
                if (lesson.gems && gameGrid[pos.y] && gameGrid[pos.y][pos.x] === 'gem') {
                    collectedGems++;
                    // Remove gem from grid
                    const newGrid = [...gameGrid];
                    newGrid[pos.y][pos.x] = 'empty';
                    setGameGrid(newGrid);
                }
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
        
        // Check win condition
        if ((pos.x === lesson.targetPos.x && pos.y === lesson.targetPos.y) && 
            (totalGems === 0 || collectedGems === totalGems)) {
            celebrateSuccess();
        }
    };

    const executeMove = async (currentPos, action, lesson) => {
        const newPos = { ...currentPos };
        
        switch (action) {
            case 'move-right':
                if (newPos.x < lesson.gridSize - 1) newPos.x++;
                break;
            case 'move-left':
                if (newPos.x > 0) newPos.x--;
                break;
            case 'move-up':
                if (newPos.y > 0) newPos.y--;
                break;
            case 'move-down':
                if (newPos.y < lesson.gridSize - 1) newPos.y++;
                break;
        }
        
        // Check for obstacles
        if (gameGrid[newPos.y] && gameGrid[newPos.y][newPos.x] === 'obstacle') {
            // Can't move to obstacle, stay in place
            return currentPos;
        }
        
        setRobotPosition(newPos);
        return newPos;
    };

    const getNextPosition = (pos, direction) => {
        const nextPos = { ...pos };
        switch (direction) {
            case 'right':
                nextPos.x++;
                break;
            case 'left':
                nextPos.x--;
                break;
            case 'up':
                nextPos.y--;
                break;
            case 'down':
                nextPos.y++;
                break;
        }
        return nextPos;
    };

    const celebrateSuccess = () => {
        setShowCelebration(true);
        
        // Save progress
        if (!completedLessons.includes(currentLesson)) {
            const newCompleted = [...completedLessons, currentLesson];
            setCompletedLessons(newCompleted);
            localStorage.setItem('sebastianCodingProgress', JSON.stringify(newCompleted));
        }
        
        // Play success sound
        if (window.playPopSound) {
            window.playPopSound();
        }
        
        // Don't auto-hide anymore - let user choose what to do next
    };

    // Pattern drawing execution
    const executePatternDrawing = async () => {
        // Simple pattern drawing logic would go here
        // For now, just show success
        await new Promise(resolve => setTimeout(resolve, 2000));
        celebrateSuccess();
    };

    // Lesson selection screen
    if (!currentLesson) {
        const allCompleted = completedLessons.length === lessons.length;
        
        return (
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 text-center">Learn to Code! 💻</h3>
                <p className="text-sm text-gray-600 text-center">
                    {allCompleted ? "🎉 You're a Coding Master! Choose any lesson to practice!" : "Choose a coding lesson to start your adventure!"}
                </p>
                
                {/* Coding Master Certificate */}
                {allCompleted && (
                    <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-300 rounded-xl p-6 text-center mb-6">
                        <div className="text-6xl mb-4">🏆</div>
                        <div className="text-2xl font-bold text-orange-800 mb-2">CODING MASTER</div>
                        <div className="text-lg font-semibold text-orange-700 mb-3">Certificate of Completion</div>
                        <div className="text-sm text-orange-600 mb-4">
                            This certifies that you have successfully completed all {lessons.length} coding lessons!
                            You now understand:
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-orange-700 mb-4">
                            <div className="bg-white rounded-lg p-2">📝 Sequences</div>
                            <div className="bg-white rounded-lg p-2">🔄 Loops</div>
                            <div className="bg-white rounded-lg p-2">🤔 Conditionals</div>
                            <div className="bg-white rounded-lg p-2">🧠 Problem Solving</div>
                        </div>
                        <div className="text-xs text-orange-600 mt-4 font-semibold">
                            🌟 You're ready to learn real programming languages! 🌟
                        </div>
                    </div>
                )}
                
                <div className="space-y-3">
                    {lessons.map((lesson, lessonIndex) => {
                        const isCompleted = completedLessons.includes(lesson.id);
                        return (
                            <button
                                key={lesson.id}
                                onClick={() => selectLesson(lesson.id)}
                                className={`w-full p-3 rounded-lg transition-all duration-200 hover:scale-105 shadow-md relative ${
                                    isCompleted 
                                        ? allCompleted 
                                            ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-lg' 
                                            : 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                                        : 'bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-2xl">{lesson.emoji}</span>
                                        <div className="text-left">
                                            <div className="text-base font-bold">{lesson.title}</div>
                                            <div className="text-sm opacity-90">{lesson.description}</div>
                                            <div className="text-xs opacity-75">
                                                {isCompleted ? (allCompleted ? 'Mastered!' : 'Completed!') : `Difficulty: ${lesson.difficulty}`}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Multiple small trophies for completed lessons */}
                                    <div className="flex items-center gap-1">
                                        {isCompleted && (
                                            <div className="flex flex-wrap gap-1 max-w-20">
                                                {Array.from({ length: Math.min(3, lessonIndex + 1) }, (_, i) => (
                                                    <span key={i} className="text-lg">
                                                        {allCompleted ? '🏆' : '✅'}
                                                    </span>
                                                ))}
                                                {lessonIndex >= 3 && (
                                                    <span className="text-xs text-white/80">+{lessonIndex - 2}</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="text-center">
                        <div className="text-lg font-bold text-blue-800 mb-2">🎯 Your Progress</div>
                        <div className="text-sm text-blue-700">
                            Completed: {completedLessons.length} / {lessons.length} lessons
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-3 mt-2">
                            <div 
                                className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                                style={{ width: `${(completedLessons.length / lessons.length) * 100}%` }}
                            ></div>
                        </div>
                        {allCompleted && (
                            <div className="text-xs text-blue-600 mt-2 font-semibold animate-pulse">
                                🎊 100% Complete - You're Amazing! 🎊
                            </div>
                        )}
                    </div>
                </div>
                
                {/* What's Next section */}
                {allCompleted && (
                    <div className="space-y-4">
                        {/* Fun Videos Section */}
                        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                            <div className="text-center mb-3">
                                <div className="text-lg font-bold text-red-800 mb-2">🎬 Fun Coding Videos</div>
                                <div className="text-sm text-red-700 mb-3">Watch these amazing videos to learn more!</div>
                            </div>
                            <div className="grid grid-cols-1 gap-2 text-sm">
                                <a href="https://www.youtube.com/watch?v=Ok6LbV6bqaE" target="_blank" rel="noopener noreferrer" 
                                   className="bg-white rounded-lg p-3 hover:bg-red-100 transition-colors duration-200 text-left">
                                    <div className="font-semibold text-red-800">📺 "What is Coding?" by Code.org</div>
                                    <div className="text-red-600 text-xs">Fun explanation for kids!</div>
                                </a>
                                <a href="https://www.youtube.com/watch?v=cDA3_5982h8" target="_blank" rel="noopener noreferrer"
                                   className="bg-white rounded-lg p-3 hover:bg-red-100 transition-colors duration-200 text-left">
                                    <div className="font-semibold text-red-800">🎯 "Coding for Kids" by Crash Course Kids</div>
                                    <div className="text-red-600 text-xs">Easy to understand basics</div>
                                </a>
                                <a href="https://www.youtube.com/watch?v=jjqgP9dpD1k" target="_blank" rel="noopener noreferrer"
                                   className="bg-white rounded-lg p-3 hover:bg-red-100 transition-colors duration-200 text-left">
                                    <div className="font-semibold text-red-800">🤖 "How Do Computers Work?" by SciShow Kids</div>
                                    <div className="text-red-600 text-xs">Learn about computers!</div>
                                </a>
                            </div>
                        </div>

                        {/* Interactive Websites */}
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <div className="text-center mb-3">
                                <div className="text-lg font-bold text-green-800 mb-2">🌐 Cool Coding Websites</div>
                                <div className="text-sm text-green-700 mb-3">Ask a grown-up to help you visit these!</div>
                            </div>
                            <div className="grid grid-cols-1 gap-2 text-sm">
                                <div className="bg-white rounded-lg p-3 text-left">
                                    <div className="font-semibold text-green-800">🎨 Scratch Jr (ScratchJr.org)</div>
                                    <div className="text-green-600 text-xs">Perfect for tablets - drag blocks like here!</div>
                                </div>
                                <div className="bg-white rounded-lg p-3 text-left">
                                    <div className="font-semibold text-green-800">🏴‍☠️ Code.org (Hour of Code)</div>
                                    <div className="text-green-600 text-xs">Minecraft, Star Wars, and Disney coding!</div>
                                </div>
                                <div className="bg-white rounded-lg p-3 text-left">
                                    <div className="font-semibold text-green-800">🎮 Kodable.com</div>
                                    <div className="text-green-600 text-xs">Fun games that teach programming</div>
                                </div>
                                <div className="bg-white rounded-lg p-3 text-left">
                                    <div className="font-semibold text-green-800">🐛 Lightbot.com</div>
                                    <div className="text-green-600 text-xs">Puzzle game with programming logic</div>
                                </div>
                            </div>
                        </div>

                        {/* Apps for Tablets */}
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <div className="text-center mb-3">
                                <div className="text-lg font-bold text-blue-800 mb-2">📱 Awesome Coding Apps</div>
                                <div className="text-sm text-blue-700 mb-3">Download these apps on your tablet!</div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="bg-white rounded-lg p-2 text-center">
                                    <div className="text-lg mb-1">🎨</div>
                                    <div className="font-semibold text-blue-800">Scratch Jr</div>
                                    <div className="text-blue-600">Ages 5-7</div>
                                </div>
                                <div className="bg-white rounded-lg p-2 text-center">
                                    <div className="text-lg mb-1">🤖</div>
                                    <div className="font-semibold text-blue-800">Kodable</div>
                                    <div className="text-blue-600">Ages 5+</div>
                                </div>
                                <div className="bg-white rounded-lg p-2 text-center">
                                    <div className="text-lg mb-1">🐛</div>
                                    <div className="font-semibold text-blue-800">Lightbot Jr</div>
                                    <div className="text-blue-600">Ages 4-8</div>
                                </div>
                                <div className="bg-white rounded-lg p-2 text-center">
                                    <div className="text-lg mb-1">🏗️</div>
                                    <div className="font-semibold text-blue-800">Toca Builders</div>
                                    <div className="text-blue-600">Creative</div>
                                </div>
                            </div>
                        </div>

                        {/* Books & Physical Activities */}
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                            <div className="text-center mb-3">
                                <div className="text-lg font-bold text-purple-800 mb-2">📚 Fun Coding Books & Activities</div>
                                <div className="text-sm text-purple-700 mb-3">Ask at your library or bookstore!</div>
                            </div>
                            <div className="grid grid-cols-1 gap-2 text-sm">
                                <div className="bg-white rounded-lg p-2">
                                    <div className="font-semibold text-purple-800">📖 "Hello Ruby" by Linda Liukas</div>
                                    <div className="text-purple-600 text-xs">Adventures in coding (no computer needed!)</div>
                                </div>
                                <div className="bg-white rounded-lg p-2">
                                    <div className="font-semibold text-purple-800">🎲 Robot Turtles Board Game</div>
                                    <div className="text-purple-600 text-xs">Programming concepts as a board game</div>
                                </div>
                                <div className="bg-white rounded-lg p-2">
                                    <div className="font-semibold text-purple-800">🏃 "Human Programming" Activities</div>
                                    <div className="text-purple-600 text-xs">Give step-by-step instructions to family!</div>
                                </div>
                            </div>
                        </div>

                        {/* Special Activities */}
                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                            <div className="text-center mb-3">
                                <div className="text-lg font-bold text-yellow-800 mb-2">🎪 Fun Coding Activities</div>
                                <div className="text-sm text-yellow-700 mb-3">Try these with family and friends!</div>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="bg-white rounded-lg p-3">
                                    <div className="font-semibold text-yellow-800">🥪 Make a Sandwich Algorithm</div>
                                    <div className="text-yellow-600 text-xs">Write exact steps to make a peanut butter sandwich - be super specific!</div>
                                </div>
                                <div className="bg-white rounded-lg p-3">
                                    <div className="font-semibold text-yellow-800">🎵 Dance Programming</div>
                                    <div className="text-yellow-600 text-xs">Create dance moves using "repeat," "if," and "then" commands!</div>
                                </div>
                                <div className="bg-white rounded-lg p-3">
                                    <div className="font-semibold text-yellow-800">🏠 Treasure Hunt Coding</div>
                                    <div className="text-yellow-600 text-xs">Write step-by-step directions to hidden treasures around your house!</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Simple next steps for incomplete */}
                {!allCompleted && (
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <div className="text-center">
                            <div className="text-lg font-bold text-purple-800 mb-2">🚀 What's Next?</div>
                            <div className="text-sm text-purple-700 space-y-1">
                                <div>• Complete all lessons to unlock resources!</div>
                                <div>• Try Scratch Jr on a tablet</div>
                                <div>• Ask a grown-up about coding videos</div>
                                <div>• Practice these lessons again anytime!</div>
                            </div>
                        </div>
                    </div>
                )}
                
                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                    <p className="text-xs text-yellow-800 text-center">
                        <strong>🚀 How it works:</strong> Drag and drop code blocks to make the robot move and solve puzzles!
                    </p>
                </div>
            </div>
        );
    }

    const lesson = lessons.find(l => l.id === currentLesson);

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button
                    onClick={goBackToMenu}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                    ← Back
                </button>
                <h3 className="text-lg font-bold text-gray-800">{lesson.title}</h3>
                <span className="text-2xl">{lesson.emoji}</span>
            </div>

            {/* Goal */}
            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <div className="text-center text-sm font-semibold text-yellow-800">
                    🎯 Goal: {lesson.goal}
                </div>
            </div>

            {/* Game Grid */}
            {lesson.type === 'drag-drop' && (
                <div className="flex justify-center">
                    <div 
                        className="inline-grid gap-1 bg-gray-800 p-2 rounded-lg"
                        style={{ gridTemplateColumns: `repeat(${lesson.gridSize}, 1fr)` }}
                    >
                        {gameGrid.map((row, y) => 
                            row.map((cell, x) => (
                                <div
                                    key={`${x}-${y}`}
                                    className={`w-10 h-10 rounded flex items-center justify-center text-lg ${
                                        cell === 'obstacle' ? 'bg-gray-600' :
                                        cell === 'target' ? 'bg-yellow-400' :
                                        cell === 'gem' ? 'bg-green-400' :
                                        'bg-white'
                                    }`}
                                >
                                    {cell === 'obstacle' && '🚧'}
                                    {cell === 'target' && '⭐'}
                                    {cell === 'gem' && '💎'}
                                    {robotPosition.x === x && robotPosition.y === y && '🤖'}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Available Blocks */}
            <div className="space-y-2">
                <h4 className="text-sm font-bold text-gray-700">📦 Drag these blocks:</h4>
                <div className="flex flex-wrap gap-2">
                    {lesson.availableBlocks.map((block) => (
                        <div
                            key={block.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, block)}
                            className={`${block.color} text-white px-3 py-2 rounded-lg cursor-move text-sm font-bold hover:scale-105 transition-transform duration-200 select-none`}
                        >
                            {block.label}
                        </div>
                    ))}
                </div>
            </div>

            {/* Code Area */}
            <div className="space-y-2">
                <h4 className="text-sm font-bold text-gray-700">🔧 Your Code:</h4>
                <div 
                    className="min-h-24 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-3 space-y-2"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e)}
                >
                    {codeBlocks.length === 0 ? (
                        <div className="text-gray-500 text-center text-sm">
                            Drop code blocks here to build your program! 👆
                        </div>
                    ) : (
                        codeBlocks.map((block, index) => (
                            <div key={block.id} className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className={`${block.color} text-white px-3 py-2 rounded-lg text-sm font-bold flex-grow`}>
                                        <div className="flex items-center justify-between">
                                            <span>{block.label}</span>
                                            <button
                                                onClick={() => removeBlock(index)}
                                                className="bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs ml-2"
                                            >
                                                ×
                                            </button>
                                        </div>
                                        
                                        {/* Container for child blocks */}
                                        {block.container && (
                                            <div 
                                                className="mt-3 ml-2 border-l-2 border-white/30 pl-3 min-h-8 bg-white/10 rounded"
                                                onDragOver={handleDragOver}
                                                onDrop={(e) => {
                                                    e.stopPropagation();
                                                    handleDrop(e, null, block.id);
                                                }}
                                            >
                                                {block.children && block.children.length > 0 ? (
                                                    <div className="space-y-1">
                                                        {block.children.map((child, childIndex) => (
                                                            <div key={childIndex} className="flex items-center justify-between bg-white/20 rounded px-2 py-1">
                                                                <span className="text-xs">{child.label}</span>
                                                                <button
                                                                    onClick={() => removeBlock(childIndex, block.id)}
                                                                    className="bg-red-500 hover:bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                                                                >
                                                                    ×
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-xs text-white/70 italic py-2">
                                                        Drop blocks here to repeat them
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Run Button */}
            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={runCode}
                    disabled={isRunning || codeBlocks.length === 0}
                    className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
                >
                    {isRunning ? '🏃 Running...' : '▶️ Run Code'}
                </button>
                <button
                    onClick={() => setCodeBlocks([])}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
                >
                    🗑️ Clear
                </button>
            </div>

            {/* Success Celebration */}
            {showCelebration && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-8 text-center max-w-sm mx-4">
                        <div className="text-6xl mb-4 animate-bounce">🎉</div>
                        <div className="text-2xl font-bold text-green-600 mb-2">
                            Awesome Job!
                        </div>
                        <div className="text-lg text-gray-700 mb-2">
                            You solved the puzzle! 🚀
                        </div>
                        <div className="text-sm text-gray-500 mb-6">
                            You're becoming a great programmer! 💻
                        </div>
                        
                        {/* Progress indicator */}
                        <div className="bg-green-50 rounded-lg p-3 mb-6">
                            <div className="text-sm font-semibold text-green-800">
                                ✅ Lesson Complete!
                            </div>
                            <div className="text-xs text-green-600 mt-1">
                                Progress: {completedLessons.includes(currentLesson) ? completedLessons.length : completedLessons.length + 1} / {lessons.length} lessons
                            </div>
                        </div>
                        
                        {/* Action buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={() => {
                                    setShowCelebration(false);
                                    goBackToMenu();
                                }}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                            >
                                📚 Back to Lessons
                            </button>
                            
                            {/* Show "Next Lesson" button if there are more lessons */}
                            {(() => {
                                const currentIndex = lessons.findIndex(l => l.id === currentLesson);
                                const nextLesson = lessons[currentIndex + 1];
                                return nextLesson ? (
                                    <button
                                        onClick={() => {
                                            setShowCelebration(false);
                                            selectLesson(nextLesson.id);
                                        }}
                                        className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                                    >
                                        ➡️ Next: {nextLesson.title}
                                    </button>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="text-lg font-bold text-yellow-600 bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                                            🏆 Amazing! You're now a CODING MASTER! 🏆
                                        </div>
                                        <button
                                            onClick={() => {
                                                setShowCelebration(false);
                                                goBackToMenu();
                                            }}
                                            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                                        >
                                            🎓 View My Achievements
                                        </button>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            )}

            {/* Coding Tips */}
            <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <div className="text-xs text-purple-700 text-center">
                    <strong>💡 Coding Tip:</strong> {
                        currentLesson === 'sequences' ? "Every step matters! Plan your moves carefully." :
                        currentLesson === 'loops' ? "Loops help you repeat actions without writing them again and again!" :
                        currentLesson === 'conditionals' ? "If-then statements help computers make smart decisions!" :
                        "Code is like giving step-by-step instructions to a friend!"
                    }
                </div>
            </div>
        </div>
    );
};