// Enhanced PianoTab component with Songs for Sebastian's Silly App
const PianoTab = () => {
    const [isPlaying, setIsPlaying] = React.useState({});
    const [currentOctave, setCurrentOctave] = React.useState(4);
    const [selectedInstrument, setSelectedInstrument] = React.useState('piano');
    const [currentView, setCurrentView] = React.useState('freeplay'); // 'freeplay' or 'songs'
    const [selectedSong, setSelectedSong] = React.useState(null);
    const [songProgress, setSongProgress] = React.useState(0);
    const [isPlayingSong, setIsPlayingSong] = React.useState(false);
    const [autoPlayMode, setAutoPlayMode] = React.useState(false);
    const [nextNote, setNextNote] = React.useState(null);
    const [showCompletionModal, setShowCompletionModal] = React.useState(false);
    const [freePlaySelectedSong, setFreePlaySelectedSong] = React.useState(null);
    
    // Note frequencies in Hz for different octaves
    const noteFrequencies = {
        C: [130.81, 261.63, 523.25, 1046.50],
        'C#': [138.59, 277.18, 554.37, 1108.73],
        D: [146.83, 293.66, 587.33, 1174.66],
        'D#': [155.56, 311.13, 622.25, 1244.51],
        E: [164.81, 329.63, 659.25, 1318.51],
        F: [174.61, 349.23, 698.46, 1396.91],
        'F#': [185.00, 369.99, 739.99, 1479.98],
        G: [196.00, 392.00, 783.99, 1567.98],
        'G#': [207.65, 415.30, 830.61, 1661.22],
        A: [220.00, 440.00, 880.00, 1760.00],
        'A#': [233.08, 466.16, 932.33, 1864.66],
        B: [246.94, 493.88, 987.77, 1975.53]
    };

    // White keys in order
    const whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    
    // Black keys and their positions
    const blackKeys = [
        { note: 'C#', position: 0.5 },
        { note: 'D#', position: 1.5 },
        { note: 'F#', position: 3.5 },
        { note: 'G#', position: 4.5 },
        { note: 'A#', position: 5.5 }
    ];

    // Simple songs for learning - sorted by difficulty
    const songs = [
        // Easy Songs First
        {
            id: 'mary',
            title: '🐑 Mary Had a Little Lamb',
            difficulty: 'Easy',
            notes: ['E', 'D', 'C', 'D', 'E', 'E', 'E', 'D', 'D', 'D', 'E', 'G', 'G'],
            lyrics: ['Ma', 'ry', 'had', 'a', 'lit', 'tle', 'lamb', 'lit', 'tle', 'lamb', 'lit', 'tle', 'lamb'],
            tempo: 600 // milliseconds per note
        },
        {
            id: 'twinkle',
            title: '⭐ Twinkle Twinkle Little Star',
            difficulty: 'Easy',
            notes: ['C', 'C', 'G', 'G', 'A', 'A', 'G', 'F', 'F', 'E', 'E', 'D', 'D', 'C'],
            lyrics: ['Twin', 'kle', 'twin', 'kle', 'lit', 'tle', 'star', 'how', 'I', 'won', 'der', 'what', 'you', 'are'],
            tempo: 500
        },
        {
            id: 'hotcross',
            title: '🥖 Hot Cross Buns',
            difficulty: 'Easy',
            notes: ['E', 'D', 'C', 'E', 'D', 'C', 'C', 'C', 'C', 'C', 'D', 'D', 'D', 'D', 'E', 'D', 'C'],
            lyrics: ['Hot', 'cross', 'buns', 'hot', 'cross', 'buns', 'one', 'a', 'pen', 'ny', 'two', 'a', 'pen', 'ny', 'hot', 'cross', 'buns'],
            tempo: 500
        },
        {
            id: 'london',
            title: '🌉 London Bridge',
            difficulty: 'Easy',
            notes: ['G', 'A', 'G', 'F', 'E', 'F', 'G', 'D', 'E', 'F', 'E', 'F', 'G'],
            lyrics: ['Lon', 'don', 'bridge', 'is', 'fall', 'ing', 'down', 'fall', 'ing', 'down', 'fall', 'ing', 'down'],
            tempo: 550
        },
        {
            id: 'baa',
            title: '🐑 Baa Baa Black Sheep',
            difficulty: 'Easy',
            notes: ['C', 'C', 'G', 'G', 'A', 'A', 'G', 'F', 'F', 'E', 'E', 'D', 'D', 'C'],
            lyrics: ['Baa', 'baa', 'black', 'sheep', 'have', 'you', 'any', 'wool', 'yes', 'sir', 'yes', 'sir', 'three', 'bags'],
            tempo: 600
        },
        {
            id: 'row',
            title: '🚣 Row Row Row Your Boat',
            difficulty: 'Easy',
            notes: ['C', 'C', 'C', 'D', 'E', 'E', 'D', 'E', 'F', 'G'],
            lyrics: ['Row', 'row', 'row', 'your', 'boat', 'gent', 'ly', 'down', 'the', 'stream'],
            tempo: 600
        },
        // Medium Songs Second
        {
            id: 'happy',
            title: '🎂 Happy Birthday',
            difficulty: 'Medium',
            notes: ['C', 'C', 'D', 'C', 'F', 'E', 'C', 'C', 'D', 'C', 'G', 'F'],
            lyrics: ['Hap', 'py', 'birth', 'day', 'to', 'you', 'hap', 'py', 'birth', 'day', 'to', 'you'],
            tempo: 700
        },
        {
            id: 'oldmacdonald',
            title: '🚜 Old MacDonald',
            difficulty: 'Medium',
            notes: ['C', 'C', 'C', 'G', 'A', 'A', 'G', 'E', 'E', 'D', 'D', 'C'],
            lyrics: ['Old', 'Mac', 'Don', 'ald', 'had', 'a', 'farm', 'E', 'I', 'E', 'I', 'O'],
            tempo: 550
        },
        {
            id: 'wheels',
            title: '🚌 Wheels on the Bus',
            difficulty: 'Medium',
            notes: ['C', 'C', 'C', 'C', 'D', 'E', 'E', 'E', 'E', 'D', 'C', 'E', 'G', 'G'],
            lyrics: ['The', 'wheels', 'on', 'the', 'bus', 'go', 'round', 'and', 'round', 'round', 'and', 'round', 'round', 'and'],
            tempo: 500
        },
        {
            id: 'jingle',
            title: '🔔 Jingle Bells',
            difficulty: 'Medium',
            notes: ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'G', 'C', 'D', 'E'],
            lyrics: ['Jin', 'gle', 'bells', 'jin', 'gle', 'bells', 'jin', 'gle', 'all', 'the', 'way'],
            tempo: 500
        },
        {
            id: 'frere',
            title: '🔔 Frère Jacques',
            difficulty: 'Medium',
            notes: ['C', 'D', 'E', 'C', 'C', 'D', 'E', 'C', 'E', 'F', 'G', 'E', 'F', 'G'],
            lyrics: ['Frè', 're', 'Jac', 'ques', 'Frè', 're', 'Jac', 'ques', 'dor', 'mez', 'vous', 'dor', 'mez', 'vous'],
            tempo: 550
        },
        {
            id: 'yankee',
            title: '🇺🇸 Yankee Doodle',
            difficulty: 'Medium',
            notes: ['C', 'D', 'E', 'F', 'G', 'G', 'C', 'D', 'E', 'F', 'G'],
            lyrics: ['Yan', 'kee', 'Doo', 'dle', 'went', 'to', 'town', 'rid', 'ing', 'on', 'a'],
            tempo: 450
        },
        {
            id: 'if',
            title: '😊 If You\'re Happy',
            difficulty: 'Medium',
            notes: ['C', 'C', 'C', 'C', 'E', 'E', 'E', 'E', 'G', 'G', 'G', 'G', 'E'],
            lyrics: ['If', 'you\'re', 'hap', 'py', 'and', 'you', 'know', 'it', 'clap', 'your', 'hands', 'clap', 'clap'],
            tempo: 500
        },
        // Hard Songs Last
        {
            id: 'ode',
            title: '🎵 Ode to Joy',
            difficulty: 'Hard',
            notes: ['E', 'E', 'F', 'G', 'G', 'F', 'E', 'D', 'C', 'C', 'D', 'E', 'E', 'D', 'D'],
            lyrics: ['Joy', 'ful', 'joy', 'ful', 'we', 'a', 'dore', 'thee', 'God', 'of', 'glo', 'ry', 'lord', 'of', 'love'],
            tempo: 650
        },
        {
            id: 'amazing',
            title: '✨ Amazing Grace',
            difficulty: 'Hard',
            notes: ['C', 'F', 'A', 'F', 'A', 'G', 'F', 'D', 'C', 'F', 'A', 'F'],
            lyrics: ['A', 'ma', 'zing', 'grace', 'how', 'sweet', 'the', 'sound', 'that', 'saved', 'a', 'wretch'],
            tempo: 800
        },
        {
            id: 'inspired',
            title: '💭 Dreamy Melody',
            difficulty: 'Hard',
            notes: ['C', 'E', 'G', 'E', 'F', 'E', 'D', 'C', 'E', 'G', 'A', 'G', 'F', 'E'],
            lyrics: ['Dream', 'y', 'mel', 'o', 'dy', 'soft', 'and', 'slow', 'gen', 'tle', 'notes', 'that', 'ebb', 'flow'],
            tempo: 800
        }
    ];

    // Shared audio context for better performance
    const audioContextRef = React.useRef(null);
    const activeNotesRef = React.useRef(new Map());
    const songTimeoutRef = React.useRef(null);

    // Initialize audio context once
    React.useEffect(() => {
        try {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            
            // Resume context on user interaction (required by some browsers)
            const resumeContext = () => {
                if (audioContextRef.current?.state === 'suspended') {
                    audioContextRef.current.resume();
                }
            };
            
            document.addEventListener('touchstart', resumeContext, { once: true });
            document.addEventListener('click', resumeContext, { once: true });
            
            return () => {
                document.removeEventListener('touchstart', resumeContext);
                document.removeEventListener('click', resumeContext);
            };
        } catch (error) {
            console.log('Audio context not supported:', error);
        }
    }, []);

    // Cleanup song timeout on unmount
    React.useEffect(() => {
        return () => {
            if (songTimeoutRef.current) {
                clearTimeout(songTimeoutRef.current);
            }
        };
    }, []);

    // Update next note when song or progress changes
    React.useEffect(() => {
        if (selectedSong && songProgress < selectedSong.notes.length) {
            setNextNote(selectedSong.notes[songProgress]);
        } else {
            setNextNote(null);
        }
    }, [selectedSong, songProgress]);

    // Create different instrument sounds with shared context
    const createSound = (frequency, instrument, duration = 0.5) => {
        try {
            const audioContext = audioContextRef.current;
            if (!audioContext) return null;
            
            // Resume context if suspended
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
            
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            const filter = audioContext.createBiquadFilter();
            
            // Connect the audio graph
            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Set frequency
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            
            // Configure instrument-specific sounds
            switch(instrument) {
                case 'piano':
                    oscillator.type = 'triangle';
                    filter.type = 'lowpass';
                    filter.frequency.setValueAtTime(2000, audioContext.currentTime);
                    
                    // Piano-like envelope: quick attack, gradual decay
                    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                    gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.02);
                    gainNode.gain.exponentialRampToValueAtTime(0.05, audioContext.currentTime + 0.2);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
                    break;
                    
                case 'organ':
                    oscillator.type = 'sawtooth';
                    filter.type = 'lowpass';
                    filter.frequency.setValueAtTime(1000, audioContext.currentTime);
                    
                    // Organ-like: sustained sound
                    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                    gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.05);
                    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime + duration - 0.1);
                    gainNode.gain.linearRampToValueAtTime(0.001, audioContext.currentTime + duration);
                    break;
                    
                case 'bell':
                    oscillator.type = 'sine';
                    filter.type = 'highpass';
                    filter.frequency.setValueAtTime(200, audioContext.currentTime);
                    
                    // Bell-like: sharp attack, long decay
                    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                    gainNode.gain.linearRampToValueAtTime(0.25, audioContext.currentTime + 0.01);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
                    break;
                    
                case 'funny':
                    oscillator.type = 'square';
                    filter.type = 'bandpass';
                    filter.frequency.setValueAtTime(800, audioContext.currentTime);
                    
                    // Funny sound with vibrato - simplified to avoid complexity
                    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                    gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.03);
                    gainNode.gain.linearRampToValueAtTime(0.001, audioContext.currentTime + duration);
                    break;
            }
            
            // Clean up after playing
            oscillator.addEventListener('ended', () => {
                try {
                    oscillator.disconnect();
                    gainNode.disconnect();
                    filter.disconnect();
                } catch (e) {
                    // Already disconnected
                }
            });
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
            
            return { oscillator, gainNode };
        } catch (error) {
            console.log('Audio not supported:', error);
            return null;
        }
    };

    const playNote = (note, fromSong = false) => {
        // Prevent multiple rapid clicks on the same note
        if (activeNotesRef.current.has(note)) {
            return;
        }
        
        const frequency = noteFrequencies[note][currentOctave - 1];
        if (frequency && audioContextRef.current) {
            // Mark note as active
            activeNotesRef.current.set(note, true);
            
            const sound = createSound(frequency, selectedInstrument, 0.8);
            setIsPlaying(prev => ({ ...prev, [note]: true }));
            
            // If playing a song, check if correct note
            if (selectedSong && !autoPlayMode) {
                if (note === selectedSong.notes[songProgress]) {
                    // Correct note! Advance progress
                    setSongProgress(prev => prev + 1);
                    
                    // Play success sound effect
                    if (window.playPopSound) {
                        setTimeout(() => window.playPopSound(), 100);
                    }
                    
                    // Check if song is complete
                    if (songProgress + 1 >= selectedSong.notes.length) {
                        setTimeout(() => {
                            setShowCompletionModal(true);
                            setSongProgress(0);
                        }, 500);
                    }
                }
            }
            
            // Visual feedback duration
            setTimeout(() => {
                setIsPlaying(prev => ({ ...prev, [note]: false }));
            }, 150);
            
            // Clear active note after a short delay
            setTimeout(() => {
                activeNotesRef.current.delete(note);
            }, 100);
        }
    };

    // Auto-play song
    const autoPlaySong = () => {
        if (!selectedSong) return;
        
        setAutoPlayMode(true);
        setIsPlayingSong(true);
        setSongProgress(0);
        
        const playNextNote = (index) => {
            if (index >= selectedSong.notes.length) {
                setIsPlayingSong(false);
                setAutoPlayMode(false);
                setSongProgress(0);
                return;
            }
            
            const note = selectedSong.notes[index];
            playNote(note, true);
            setSongProgress(index);
            
            songTimeoutRef.current = setTimeout(() => {
                playNextNote(index + 1);
            }, selectedSong.tempo);
        };
        
        playNextNote(0);
    };

    // Stop auto-play
    const stopAutoPlay = () => {
        if (songTimeoutRef.current) {
            clearTimeout(songTimeoutRef.current);
        }
        setIsPlayingSong(false);
        setAutoPlayMode(false);
        setSongProgress(0);
    };

    // Reset song progress
    const resetSong = () => {
        setSongProgress(0);
        stopAutoPlay();
    };

    const instruments = [
        { id: 'piano', name: '🎹 Piano', emoji: '🎹' },
        { id: 'organ', name: '🎵 Organ', emoji: '🎵' },
        { id: 'bell', name: '🔔 Bells', emoji: '🔔' },
        { id: 'funny', name: '🤪 Funny', emoji: '🤪' }
    ];

    const octaves = [
        { value: 1, label: 'Very Low' },
        { value: 2, label: 'Low' },
        { value: 3, label: 'Medium' },
        { value: 4, label: 'High' }
    ];

    // Song Selection View
    const SongSelection = () => (
        <div className="space-y-4">
            <div className="text-center">
                <h4 className="text-lg font-bold text-gray-800 mb-2">🎵 Choose a Song to Learn!</h4>
                <p className="text-sm text-gray-600">Pick a song and follow the highlighted keys</p>
            </div>
            
            <div className="space-y-3">
                {songs.map((song) => (
                    <button
                        key={song.id}
                        onClick={() => {
                            setSelectedSong(song);
                            setSongProgress(0);
                        }}
                        className="w-full bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 px-4 rounded-lg transition-all duration-200 hover:scale-105 shadow-md"
                    >
                        <div className="flex items-center justify-between">
                            <div className="text-left">
                                <div className="text-lg">{song.title}</div>
                                <div className="text-sm opacity-75">
                                    {song.difficulty} • {song.notes.length} notes
                                </div>
                            </div>
                            <div className="text-2xl">🎼</div>
                        </div>
                    </button>
                ))}
            </div>
            
            <button
                onClick={() => setCurrentView('freeplay')}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
            >
                🎹 Back to Free Play
            </button>
        </div>
    );

    // Song Learning View
    const SongLearning = () => (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <button
                    onClick={() => setSelectedSong(null)}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-3 rounded-lg transition-colors duration-200"
                >
                    ← Songs
                </button>
                <h4 className="text-lg font-bold text-gray-800">{selectedSong.title}</h4>
                <div className="w-16"></div>
            </div>
            
            {/* Progress Bar */}
            <div className="bg-gray-200 rounded-full h-3">
                <div 
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${(songProgress / selectedSong.notes.length) * 100}%` }}
                ></div>
            </div>
            <div className="text-center text-sm text-gray-600">
                Progress: {songProgress} / {selectedSong.notes.length} notes
                {songProgress < selectedSong.notes.length && (
                    <div className="font-semibold text-blue-600 mt-1">
                        Next note: {nextNote} 
                        {selectedSong.lyrics[songProgress] && (
                            <span className="text-gray-500"> ("{selectedSong.lyrics[songProgress]}")</span>
                        )}
                    </div>
                )}
            </div>
            
            {/* Song Controls */}
            <div className="grid grid-cols-3 gap-2">
                <button
                    onClick={autoPlaySong}
                    disabled={isPlayingSong}
                    className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-bold py-2 px-3 rounded-lg transition-colors duration-200 text-sm"
                >
                    {isPlayingSong ? '🎵 Playing...' : '▶️ Play Song'}
                </button>
                
                {isPlayingSong ? (
                    <button
                        onClick={stopAutoPlay}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded-lg transition-colors duration-200 text-sm"
                    >
                        ⏹️ Stop
                    </button>
                ) : (
                    <button
                        onClick={resetSong}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-3 rounded-lg transition-colors duration-200 text-sm"
                    >
                        🔄 Reset
                    </button>
                )}
                
                <div className="bg-purple-100 rounded-lg p-2 text-center">
                    <div className="text-xs text-purple-700 font-semibold">{selectedSong.difficulty}</div>
                </div>
            </div>
            
            {songProgress >= selectedSong.notes.length && (
                <div className="bg-green-100 border-2 border-green-300 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">🎉</div>
                    <div className="text-lg font-bold text-green-700">Song Complete!</div>
                    <div className="text-sm text-green-600">Great job learning {selectedSong.title}!</div>
                </div>
            )}
        </div>
    );

    // Completion Modal Component
    const CompletionModal = () => {
        if (!showCompletionModal) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full">
                    <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-6 rounded-t-xl text-center">
                        <div className="text-6xl mb-4">🎉</div>
                        <h3 className="text-2xl font-bold mb-2">Amazing!</h3>
                        <p className="text-lg">You played the whole song!</p>
                    </div>
                    
                    <div className="p-6 text-center">
                        <div className="text-lg font-semibold text-gray-800 mb-2">
                            🎵 {selectedSong?.title}
                        </div>
                        <div className="text-sm text-gray-600 mb-6">
                            You're becoming a great pianist! 🎹
                        </div>
                        
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowCompletionModal(false);
                                    resetSong();
                                }}
                                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
                            >
                                🔄 Play Again
                            </button>
                            <button
                                onClick={() => {
                                    setShowCompletionModal(false);
                                    setSelectedSong(null);
                                }}
                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
                            >
                                🎵 New Song
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Main Piano View
    const PianoInterface = () => (
        <div className="space-y-4">
            {/* View Toggle */}
            <div className="flex justify-center gap-2">
                <button
                    onClick={() => setCurrentView('freeplay')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                        currentView === 'freeplay'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    🎹 Free Play
                </button>
                <button
                    onClick={() => setCurrentView('songs')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                        currentView === 'songs'
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    🎵 Learn Songs
                </button>
            </div>

            {/* Instrument and Pitch Selection - Dropdowns */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-700 text-center">Choose Sound:</h4>
                    <select
                        value={selectedInstrument}
                        onChange={(e) => setSelectedInstrument(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-700 font-medium"
                    >
                        {instruments.map((instrument) => (
                            <option key={instrument.id} value={instrument.id}>
                                {instrument.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-700 text-center">Pitch Level:</h4>
                    <select
                        value={currentOctave}
                        onChange={(e) => setCurrentOctave(parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700 font-medium"
                    >
                        {octaves.map((octave) => (
                            <option key={octave.value} value={octave.value}>
                                {octave.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Piano Keys */}
            <div className="bg-gray-800 p-2 rounded-lg w-full overflow-hidden">
                <div className="relative mx-auto" style={{ width: 'fit-content' }}>
                    {/* White Keys */}
                    <div className="flex gap-0">
                        {whiteKeys.map((note, index) => {
                            const isNextNote = selectedSong && !autoPlayMode && nextNote === note;
                            const isCorrectNote = selectedSong && autoPlayMode && selectedSong.notes[songProgress] === note && isPlaying[note];
                            
                            return (
                                <button
                                    key={note}
                                    onClick={() => playNote(note)}
                                    className={`relative border-r border-gray-300 last:border-r-0 transition-all duration-150 select-none flex-shrink-0 ${
                                        isPlaying[note] ? 'bg-yellow-200 transform scale-95' : 
                                        isNextNote ? 'bg-green-200 animate-pulse ring-2 ring-green-400' :
                                        isCorrectNote ? 'bg-blue-200' :
                                        'bg-white hover:bg-gray-100'
                                    }`}
                                    style={{
                                        width: '42px',
                                        height: '140px',
                                        borderRadius: '0 0 8px 8px',
                                        border: '1px solid #d1d5db',
                                        borderTop: 'none'
                                    }}
                                    disabled={isPlayingSong && autoPlayMode}
                                >
                                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-700">
                                        {note}
                                    </div>
                                    {isNextNote && (
                                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-green-600 text-xs font-bold">
                                            ⬇️
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                    
                    {/* Black Keys */}
                    <div className="absolute top-0 left-0 pointer-events-none">
                        {blackKeys.map((key) => {
                            const isNextNote = selectedSong && !autoPlayMode && nextNote === key.note;
                            const isCorrectNote = selectedSong && autoPlayMode && selectedSong.notes[songProgress] === key.note && isPlaying[key.note];
                            
                            return (
                                <button
                                    key={key.note}
                                    onClick={() => playNote(key.note)}
                                    className={`absolute text-white font-bold transition-all duration-150 select-none pointer-events-auto ${
                                        isPlaying[key.note] ? 'bg-yellow-600 transform scale-95' :
                                        isNextNote ? 'bg-green-600 animate-pulse ring-2 ring-green-400' :
                                        isCorrectNote ? 'bg-blue-600' :
                                        'bg-gray-900 hover:bg-gray-700'
                                    }`}
                                    style={{
                                        left: `${key.position * 42 - 15}px`,
                                        width: '30px',
                                        height: '90px',
                                        borderRadius: '0 0 6px 6px',
                                        zIndex: 10,
                                        border: '1px solid #374151'
                                    }}
                                    disabled={isPlayingSong && autoPlayMode}
                                >
                                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs">
                                        {key.note.replace('#', '♯')}
                                    </div>
                                    {isNextNote && (
                                        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-green-300 text-xs font-bold">
                                            ⬇️
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Free Play Song Reference - Right under piano */}
            {currentView === 'freeplay' && freePlaySelectedSong && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 border border-blue-200 -mt-2">
                    <div className="text-center mb-2">
                        <h5 className="text-sm font-bold text-blue-800">
                            🎵 {freePlaySelectedSong.title}
                        </h5>
                    </div>
                    
                    {/* Compact Notes Display */}
                    <div className="bg-white rounded-lg p-2 mb-2">
                        <div className="text-xs font-semibold text-gray-700 mb-1 text-center">
                            Notes:
                        </div>
                        <div className="flex flex-wrap justify-center gap-1">
                            {freePlaySelectedSong.notes.map((note, index) => (
                                <span
                                    key={index}
                                    className={`px-1.5 py-0.5 rounded text-xs font-bold ${
                                        note.includes('#') 
                                            ? 'bg-gray-800 text-white' 
                                            : 'bg-blue-500 text-white'
                                    }`}
                                >
                                    {note}
                                </span>
                            ))}
                        </div>
                    </div>
                    
                    <div className="text-center">
                        <button
                            onClick={() => setFreePlaySelectedSong(null)}
                            className="text-xs text-blue-600 hover:text-blue-800 bg-white px-2 py-1 rounded"
                        >
                            ✕ Hide Notes
                        </button>
                    </div>
                </div>
            )}

            {/* Instructions */}
            <div className="text-center space-y-1">
                <div className="text-sm text-gray-600">
                    {selectedSong && !autoPlayMode ? 
                        `🎯 Press the highlighted ${nextNote || 'key'} to continue the song!` :
                        freePlaySelectedSong ?
                        `🎵 Playing "${freePlaySelectedSong.title}" - Follow the notes above!` :
                        'Tap the keys to make music! 🎵'
                    }
                </div>
                <div className="text-xs text-gray-500">
                    White keys: {whiteKeys.join(', ')} • Black keys: C♯, D♯, F♯, G♯, A♯
                </div>
            </div>

            {/* Free Play Song Selection Grid */}
            {currentView === 'freeplay' && (
                <div className="space-y-3">
                    <div className="text-center">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">
                            🎼 Quick Song Reference
                        </h4>
                        <p className="text-xs text-gray-500 mb-3">
                            Click a song to see its notes right under the piano!
                        </p>
                    </div>
                    
                    {/* Song Grid */}
                    <div className="grid grid-cols-2 gap-2">
                        {songs.map((song) => (
                            <button
                                key={song.id}
                                onClick={() => setFreePlaySelectedSong(
                                    freePlaySelectedSong?.id === song.id ? null : song
                                )}
                                className={`text-xs p-2 rounded-lg transition-all duration-200 ${
                                    freePlaySelectedSong?.id === song.id
                                        ? 'bg-blue-500 text-white shadow-md'
                                        : song.difficulty === 'Easy' 
                                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                        : song.difficulty === 'Medium'
                                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                                }`}
                            >
                                <div className="font-semibold">
                                    {song.title.replace(/[🐑⭐🎂🥖🚜🌉🔔🚌🚣🇺🇸✨😊🎵]/g, '').trim()}
                                </div>
                                <div className="text-xs opacity-75">{song.difficulty}</div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Fun Facts */}
            <div className="bg-purple-50 p-3 rounded-lg">
                <div className="text-xs text-purple-700 text-center">
                    <strong>🎼 Fun Fact:</strong> {selectedSong ? 
                        `${selectedSong.title} was one of the first songs many kids learn to play!` :
                        freePlaySelectedSong ?
                        `${freePlaySelectedSong.title} has ${freePlaySelectedSong.notes.length} notes to master!` :
                        'A real piano has 88 keys! This mini piano has 12 keys in different octaves.'
                    }
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800 text-center">Virtual Piano 🎹</h3>
            
            {currentView === 'songs' && !selectedSong && <SongSelection />}
            {selectedSong && <SongLearning />}
            {(currentView === 'freeplay' || selectedSong) && <PianoInterface />}
            
            {/* Completion Modal */}
            <CompletionModal />
        </div>
    );
};