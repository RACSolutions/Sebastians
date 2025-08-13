// JournalTab component for Sebastian's Silly App
const JournalTab = () => {
    const [entries, setEntries] = React.useState(() => {
        const saved = localStorage.getItem('sebastianJournalEntries');
        return saved ? JSON.parse(saved) : [];
    });
    const [currentEntry, setCurrentEntry] = React.useState('');
    const [selectedDate, setSelectedDate] = React.useState(() => {
        return new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format
    });
    const [showAllEntries, setShowAllEntries] = React.useState(false);
    const [selectedMood, setSelectedMood] = React.useState('😊');
    const [showAlert, setShowAlert] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState('');
    const [alertType, setAlertType] = React.useState('success'); // 'success', 'error', 'confirm'
    const [alertCallback, setAlertCallback] = React.useState(null);

    // Custom alert function
    const showCustomAlert = (message, type = 'success', callback = null) => {
        setAlertMessage(message);
        setAlertType(type);
        setAlertCallback(() => callback);
        setShowAlert(true);
    };

    const hideAlert = (confirmed = false) => {
        setShowAlert(false);
        if (alertCallback) {
            alertCallback(confirmed);
        }
        setAlertCallback(null);
    };

    // Mood options for the journal
    const moodOptions = [
        { emoji: '😊', label: 'Happy' },
        { emoji: '😢', label: 'Sad' },
        { emoji: '😴', label: 'Tired' },
        { emoji: '😆', label: 'Excited' },
        { emoji: '😰', label: 'Worried' },
        { emoji: '😡', label: 'Angry' },
        { emoji: '🤔', label: 'Thoughtful' },
        { emoji: '😌', label: 'Peaceful' },
        { emoji: '🤩', label: 'Amazing' },
        { emoji: '😮', label: 'Surprised' }
    ];

    // Writing prompts to inspire journal entries
    const writingPrompts = [
        "What made me smile today?",
        "Something new I learned today was...",
        "I felt proud when...",
        "My favorite part of today was...",
        "Something I'm looking forward to is...",
        "If I could do anything tomorrow, I would...",
        "I helped someone today by...",
        "Something funny that happened was...",
        "I felt grateful for...",
        "The best thing about this week is...",
        "Something I want to remember about today is...",
        "I felt brave when...",
        "My favorite place to be is...",
        "Something that made me laugh was...",
        "I'm excited about..."
    ];

    // Navigation functions
    const goToPreviousDay = () => {
        const currentDate = new Date(selectedDate);
        currentDate.setDate(currentDate.getDate() - 1);
        setSelectedDate(currentDate.toISOString().split('T')[0]);
    };

    const goToNextDay = () => {
        const currentDate = new Date(selectedDate);
        const tomorrow = new Date(currentDate);
        tomorrow.setDate(currentDate.getDate() + 1);
        
        // Don't allow future dates
        if (tomorrow <= new Date()) {
            setSelectedDate(tomorrow.toISOString().split('T')[0]);
        }
    };

    const goToToday = () => {
        setSelectedDate(new Date().toISOString().split('T')[0]);
    };

    // Check if we can navigate to next day
    const canGoToNextDay = () => {
        const currentDate = new Date(selectedDate);
        const tomorrow = new Date(currentDate);
        tomorrow.setDate(currentDate.getDate() + 1);
        return tomorrow <= new Date();
    };

    // Load existing entry for selected date
    React.useEffect(() => {
        const existingEntry = entries.find(entry => entry.date === selectedDate);
        if (existingEntry) {
            setCurrentEntry(existingEntry.text);
            setSelectedMood(existingEntry.mood || '😊');
        } else {
            setCurrentEntry('');
            setSelectedMood('😊');
        }
    }, [selectedDate, entries]);

    // Save entry to localStorage
    const saveEntry = () => {
        if (!currentEntry.trim()) {
            showCustomAlert('Please write something in your journal first! ✏️', 'error');
            return;
        }

        const newEntry = {
            id: `${selectedDate}-${Date.now()}`,
            date: selectedDate,
            text: currentEntry.trim(),
            mood: selectedMood,
            timestamp: new Date().toISOString(),
            wordCount: currentEntry.trim().split(/\s+/).length
        };

        // Remove existing entry for this date and add new one
        const updatedEntries = entries.filter(entry => entry.date !== selectedDate);
        updatedEntries.push(newEntry);
        
        // Sort entries by date (newest first)
        updatedEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        setEntries(updatedEntries);
        localStorage.setItem('sebastianJournalEntries', JSON.stringify(updatedEntries));
        
        // Success feedback
        showCustomAlert('📝 Journal entry saved! Great job writing! 🌟', 'success');
    };

    // Delete entry
    const deleteEntry = (dateToDelete) => {
        showCustomAlert('Are you sure you want to delete this journal entry? 🗑️', 'confirm', (confirmed) => {
            if (confirmed) {
                const updatedEntries = entries.filter(entry => entry.date !== dateToDelete);
                setEntries(updatedEntries);
                localStorage.setItem('sebastianJournalEntries', JSON.stringify(updatedEntries));
                
                // Clear current entry if we're deleting today's entry
                if (dateToDelete === selectedDate) {
                    setCurrentEntry('');
                    setSelectedMood('😊');
                }
            }
        });
    };

    // Get random writing prompt
    const getRandomPrompt = () => {
        const randomPrompt = writingPrompts[Math.floor(Math.random() * writingPrompts.length)];
        setCurrentEntry(currentEntry + (currentEntry ? '\n\n' : '') + randomPrompt + ' ');
    };

    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (dateString === today.toISOString().split('T')[0]) {
            return 'Today';
        } else if (dateString === yesterday.toISOString().split('T')[0]) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        }
    };

    // Get entry statistics
    const getStats = () => {
        const totalEntries = entries.length;
        const totalWords = entries.reduce((sum, entry) => sum + (entry.wordCount || 0), 0);
        const currentStreak = getCurrentStreak();
        const mostCommonMood = getMostCommonMood();

        return { totalEntries, totalWords, currentStreak, mostCommonMood };
    };

    // Calculate current writing streak
    const getCurrentStreak = () => {
        if (entries.length === 0) return 0;
        
        let streak = 0;
        const today = new Date();
        
        for (let i = 0; i < 30; i++) { // Check last 30 days
            const checkDate = new Date(today);
            checkDate.setDate(today.getDate() - i);
            const dateString = checkDate.toISOString().split('T')[0];
            
            const hasEntry = entries.some(entry => entry.date === dateString);
            if (hasEntry) {
                streak++;
            } else if (i > 0) { // Don't break on first day (today) if no entry yet
                break;
            }
        }
        
        return streak;
    };

    // Get most common mood
    const getMostCommonMood = () => {
        if (entries.length === 0) return '😊';
        
        const moodCounts = {};
        entries.forEach(entry => {
            const mood = entry.mood || '😊';
            moodCounts[mood] = (moodCounts[mood] || 0) + 1;
        });
        
        return Object.keys(moodCounts).reduce((a, b) => 
            moodCounts[a] > moodCounts[b] ? a : b
        );
    };

    const stats = getStats();
    const todaysEntry = entries.find(entry => entry.date === selectedDate);

    // Custom Alert Component
    const CustomAlert = () => {
        if (!showAlert) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4 transform animate-pulse">
                    <div className="text-center">
                        <div className="text-4xl mb-4">
                            {alertType === 'success' && '✅'}
                            {alertType === 'error' && '❌'}
                            {alertType === 'confirm' && '🤔'}
                        </div>
                        <div className="text-lg font-semibold text-gray-800 mb-4">
                            {alertMessage}
                        </div>
                        <div className="flex gap-3 justify-center">
                            {alertType === 'confirm' ? (
                                <>
                                    <button
                                        onClick={() => hideAlert(false)}
                                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => hideAlert(true)}
                                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
                                    >
                                        Delete
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => hideAlert()}
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
                                >
                                    OK
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (showAllEntries) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => setShowAllEntries(false)}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                        ← Back to Today
                    </button>
                    <h3 className="text-xl font-bold text-gray-800">All Journal Entries 📚</h3>
                    <div className="w-24"></div>
                </div>

                {entries.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="text-6xl mb-4">📝</div>
                        <div className="text-lg text-gray-600">No journal entries yet!</div>
                        <div className="text-sm text-gray-500">Start writing to see your entries here.</div>
                    </div>
                ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {entries.map((entry) => (
                            <div key={entry.id} className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-2xl">{entry.mood}</span>
                                        <div>
                                            <div className="font-semibold text-gray-800">{formatDate(entry.date)}</div>
                                            <div className="text-xs text-gray-500">{entry.wordCount} words</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deleteEntry(entry.date)}
                                        className="text-red-500 hover:text-red-700 text-sm"
                                    >
                                        🗑️
                                    </button>
                                </div>
                                <div className="text-gray-700 text-sm leading-relaxed">
                                    {entry.text.length > 150 
                                        ? entry.text.substring(0, 150) + '...' 
                                        : entry.text
                                    }
                                </div>
                                <button
                                    onClick={() => {
                                        setSelectedDate(entry.date);
                                        setShowAllEntries(false);
                                    }}
                                    className="text-purple-600 hover:text-purple-800 text-xs mt-2"
                                >
                                    Read More →
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Stats Section */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-bold text-blue-800 mb-2 text-center">📊 Your Writing Stats</h4>
                    <div className="grid grid-cols-2 gap-3 text-center">
                        <div>
                            <div className="text-2xl font-bold text-blue-600">{stats.totalEntries}</div>
                            <div className="text-xs text-blue-700">Total Entries</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-green-600">{stats.totalWords}</div>
                            <div className="text-xs text-green-700">Total Words</div>
                        </div>
                        <div>
                            <div className="text-2xl">{stats.currentStreak} 🔥</div>
                            <div className="text-xs text-orange-700">Day Streak</div>
                        </div>
                        <div>
                            <div className="text-2xl">{stats.mostCommonMood}</div>
                            <div className="text-xs text-purple-700">Common Mood</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <CustomAlert />
            
            <h3 className="text-xl font-bold text-gray-800 text-center">My Daily Journal 📔</h3>
            
            {/* Notebook-style container */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-100 rounded-lg shadow-lg border-2 border-amber-200 p-1">
                <div className="bg-white rounded-md shadow-inner p-4 relative" style={{
                    backgroundImage: `repeating-linear-gradient(
                        transparent,
                        transparent 28px,
                        #e5e7eb 28px,
                        #e5e7eb 30px
                    )`,
                    backgroundSize: '100% 30px'
                }}>
                    {/* Red margin line */}
                    <div className="absolute left-12 top-0 bottom-0 w-0.5 bg-red-300"></div>
                    
                    {/* Notebook rings */}
                    <div className="absolute left-2 top-4 space-y-8">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="w-4 h-4 rounded-full border-2 border-gray-400 bg-gray-100"></div>
                        ))}
                    </div>

                    {/* Date Navigation */}
                    <div className="flex items-center justify-between mb-6 pl-8">
                        <button
                            onClick={goToPreviousDay}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-3 py-2 rounded-full transition-colors duration-200 text-sm"
                        >
                            ← Prev
                        </button>
                        
                        <div className="text-center flex-1">
                            <div className="text-xl font-bold text-gray-800">{formatDate(selectedDate)}</div>
                            <div className="text-sm text-gray-600">
                                {new Date(selectedDate).toLocaleDateString('en-US', { 
                                    weekday: 'short', 
                                    month: 'short', 
                                    day: 'numeric', 
                                    year: 'numeric' 
                                })}
                            </div>
                            {todaysEntry && (
                                <div className="text-xs text-green-600 font-semibold mt-1">
                                    ✓ {todaysEntry.wordCount} words • {todaysEntry.mood}
                                </div>
                            )}
                        </div>
                        
                        <div className="flex gap-1">
                            <button
                                onClick={goToNextDay}
                                disabled={!canGoToNextDay()}
                                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold px-3 py-2 rounded-full transition-colors duration-200 text-sm"
                            >
                                Next →
                            </button>
                            <button
                                onClick={goToToday}
                                className="bg-green-500 hover:bg-green-600 text-white font-bold px-3 py-2 rounded-full text-xs transition-colors duration-200"
                            >
                                Today
                            </button>
                        </div>
                    </div>

                    {/* Mood Selector */}
                    <div className="mb-6 pl-8">
                        <div className="text-sm font-semibold text-gray-700 mb-3">How are you feeling?</div>
                        <div className="flex flex-wrap gap-2 justify-start">
                            {moodOptions.map((mood) => (
                                <button
                                    key={mood.emoji}
                                    onClick={() => setSelectedMood(mood.emoji)}
                                    className={`text-2xl p-2 rounded-lg transition-all duration-200 ${
                                        selectedMood === mood.emoji 
                                            ? 'bg-yellow-200 scale-110 shadow-md ring-2 ring-yellow-400' 
                                            : 'bg-gray-100 hover:bg-gray-200 hover:scale-105'
                                    }`}
                                    title={mood.label}
                                >
                                    {mood.emoji}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Writing Area */}
                    <div className="pl-8 pr-4">
                        <div className="flex justify-between items-center mb-2">
                            <div className="text-sm font-semibold text-gray-700">
                                Dear Diary...
                            </div>
                            <button
                                onClick={getRandomPrompt}
                                className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold py-1 px-2 rounded text-xs transition-colors duration-200"
                            >
                                💡 Idea
                            </button>
                        </div>
                        
                        <textarea
                            value={currentEntry}
                            onChange={(e) => setCurrentEntry(e.target.value)}
                            placeholder="What happened today? How did you feel? What did you learn? ✨"
                            className="w-full h-52 p-2 bg-transparent border-none outline-none resize-none text-gray-800"
                            style={{ 
                                fontFamily: 'system-ui, -apple-system, sans-serif',
                                fontSize: '16px',
                                lineHeight: '30px', // Match the line height
                                backgroundImage: 'none'
                            }}
                        />
                        
                        <div className="flex justify-between items-center text-xs text-gray-500 mt-3">
                            <div className="font-medium">
                                {currentEntry.trim() ? currentEntry.trim().split(/\s+/).length : 0} words
                            </div>
                            <div className="text-gray-400 italic">
                                Keep writing! ✏️
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={saveEntry}
                    disabled={!currentEntry.trim()}
                    className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                    💾 Save Entry
                </button>
                
                <button
                    onClick={() => setShowAllEntries(true)}
                    className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                    📚 All Entries
                </button>
            </div>

            {/* Progress Stats */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                <div className="text-center">
                    <div className="text-sm font-semibold text-blue-800 mb-3">Your Writing Journey 🌟</div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg p-3 shadow-sm">
                            <div className="text-2xl font-bold text-blue-600">{stats.totalEntries}</div>
                            <div className="text-sm text-blue-700 font-medium">Entries</div>
                        </div>
                        <div className="bg-white rounded-lg p-3 shadow-sm">
                            <div className="text-2xl font-bold text-green-600">{stats.currentStreak} 🔥</div>
                            <div className="text-sm text-green-700 font-medium">Day Streak</div>
                        </div>
                        <div className="bg-white rounded-lg p-3 shadow-sm">
                            <div className="text-2xl font-bold text-purple-600">{stats.totalWords}</div>
                            <div className="text-sm text-purple-700 font-medium">Words</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Encouragement */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-3">
                <div className="text-center text-sm text-yellow-800">
                    {stats.totalEntries === 0 && "🌟 Start your writing adventure today!"}
                    {stats.totalEntries >= 1 && stats.totalEntries < 7 && "🎉 You're doing great! Keep it up!"}
                    {stats.totalEntries >= 7 && stats.totalEntries < 30 && "📚 You're becoming a great writer!"}
                    {stats.totalEntries >= 30 && "🏆 You're a journaling superstar!"}
                </div>
            </div>
        </div>
    );
};