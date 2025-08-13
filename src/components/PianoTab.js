// PianoTab component for Sebastian's Silly App
const PianoTab = () => {
    const [isPlaying, setIsPlaying] = React.useState({});
    const [currentOctave, setCurrentOctave] = React.useState(4);
    const [selectedInstrument, setSelectedInstrument] = React.useState('piano');
    
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

    // Create different instrument sounds
    const createSound = (frequency, instrument, duration = 0.5) => {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
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
                    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.05);
                    gainNode.gain.exponentialRampToValueAtTime(0.1, audioContext.currentTime + 0.3);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
                    break;
                    
                case 'organ':
                    oscillator.type = 'sawtooth';
                    filter.type = 'lowpass';
                    filter.frequency.setValueAtTime(1000, audioContext.currentTime);
                    
                    // Organ-like: sustained sound
                    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                    gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.1);
                    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime + duration - 0.1);
                    gainNode.gain.linearRampToValueAtTime(0.01, audioContext.currentTime + duration);
                    break;
                    
                case 'bell':
                    oscillator.type = 'sine';
                    filter.type = 'highpass';
                    filter.frequency.setValueAtTime(200, audioContext.currentTime);
                    
                    // Bell-like: sharp attack, long decay
                    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                    gainNode.gain.linearRampToValueAtTime(0.4, audioContext.currentTime + 0.01);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
                    break;
                    
                case 'funny':
                    oscillator.type = 'square';
                    filter.type = 'bandpass';
                    filter.frequency.setValueAtTime(800, audioContext.currentTime);
                    
                    // Funny sound with vibrato
                    const lfo = audioContext.createOscillator();
                    const lfoGain = audioContext.createGain();
                    lfo.frequency.setValueAtTime(6, audioContext.currentTime);
                    lfoGain.gain.setValueAtTime(10, audioContext.currentTime);
                    lfo.connect(lfoGain);
                    lfoGain.connect(oscillator.frequency);
                    
                    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.05);
                    gainNode.gain.linearRampToValueAtTime(0.01, audioContext.currentTime + duration);
                    
                    lfo.start(audioContext.currentTime);
                    lfo.stop(audioContext.currentTime + duration);
                    break;
            }
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
            
            return { oscillator, gainNode };
        } catch (error) {
            console.log('Audio not supported:', error);
            return null;
        }
    };

    const playNote = (note) => {
        const frequency = noteFrequencies[note][currentOctave - 1];
        if (frequency) {
            const sound = createSound(frequency, selectedInstrument);
            setIsPlaying(prev => ({ ...prev, [note]: true }));
            
            // Visual feedback duration
            setTimeout(() => {
                setIsPlaying(prev => ({ ...prev, [note]: false }));
            }, 200);
        }
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

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800 text-center">Virtual Piano 🎹</h3>
            
            {/* Instrument Selection */}
            <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-700 text-center">Choose Sound:</h4>
                <div className="grid grid-cols-2 gap-2">
                    {instruments.map((instrument) => (
                        <button
                            key={instrument.id}
                            onClick={() => setSelectedInstrument(instrument.id)}
                            className={`py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                                selectedInstrument === instrument.id
                                    ? 'bg-purple-500 text-white shadow-md transform scale-105'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            {instrument.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Octave Selection */}
            <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-700 text-center">Pitch Level:</h4>
                <div className="grid grid-cols-4 gap-1">
                    {octaves.map((octave) => (
                        <button
                            key={octave.value}
                            onClick={() => setCurrentOctave(octave.value)}
                            className={`py-1 px-2 rounded text-xs font-medium transition-all duration-200 ${
                                currentOctave === octave.value
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            {octave.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Piano Keys */}
            <div className="bg-gray-800 p-2 rounded-lg w-full overflow-hidden">
                <div className="relative mx-auto" style={{ width: 'fit-content' }}>
                    {/* White Keys */}
                    <div className="flex gap-0">
                        {whiteKeys.map((note, index) => (
                            <button
                                key={note}
                                onClick={() => playNote(note)}
                                className={`relative bg-white hover:bg-gray-100 border-r border-gray-300 last:border-r-0 transition-all duration-150 select-none flex-shrink-0 ${
                                    isPlaying[note] ? 'bg-yellow-200 transform scale-95' : ''
                                }`}
                                style={{
                                    width: '42px',
                                    height: '140px',
                                    borderRadius: '0 0 8px 8px',
                                    border: '1px solid #d1d5db',
                                    borderTop: 'none'
                                }}
                            >
                                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-700">
                                    {note}
                                </div>
                            </button>
                        ))}
                    </div>
                    
                    {/* Black Keys */}
                    <div className="absolute top-0 left-0 pointer-events-none">
                        {blackKeys.map((key) => (
                            <button
                                key={key.note}
                                onClick={() => playNote(key.note)}
                                className={`absolute bg-gray-900 hover:bg-gray-700 text-white font-bold transition-all duration-150 select-none pointer-events-auto ${
                                    isPlaying[key.note] ? 'bg-yellow-600 transform scale-95' : ''
                                }`}
                                style={{
                                    left: `${key.position * 42 - 15}px`,
                                    width: '30px',
                                    height: '90px',
                                    borderRadius: '0 0 6px 6px',
                                    zIndex: 10,
                                    border: '1px solid #374151'
                                }}
                            >
                                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs">
                                    {key.note.replace('#', '♯')}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Instructions */}
            <div className="text-center space-y-1">
                <div className="text-sm text-gray-600">
                    Tap the keys to make music! 🎵
                </div>
                <div className="text-xs text-gray-500">
                    White keys: {whiteKeys.join(', ')} • Black keys: C♯, D♯, F♯, G♯, A♯
                </div>
            </div>

            {/* Fun Facts */}
            <div className="bg-purple-50 p-3 rounded-lg">
                <div className="text-xs text-purple-700 text-center">
                    <strong>🎼 Fun Fact:</strong> A real piano has 88 keys! This mini piano has 12 keys in different octaves.
                </div>
            </div>
        </div>
    );
};