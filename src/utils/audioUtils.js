// Audio utility functions for Sebastian's Silly App

// Text-to-speech function
const speakText = (text, onEnd) => {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8;
        utterance.pitch = 1.2;
        utterance.volume = 0.8;
        
        if (onEnd) {
            utterance.onend = onEnd;
        }
        
        window.speechSynthesis.speak(utterance);
        return true;
    }
    return false;
};

// Stop speech synthesis
const stopSpeech = () => {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
};

// Pop sound for game
const playPopSound = () => {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
        console.log('Audio not supported, playing without sound');
    }
};

// Realistic puppy bark sound
const playBarkSound = () => {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create a more realistic "woof" sound with multiple components
        const createBarkComponent = (frequency, startTime, duration, volume) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            const filter = audioContext.createBiquadFilter();
            
            // Setup filter for more natural sound
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(800, audioContext.currentTime);
            
            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // More realistic frequency envelope - quick drop like a real bark
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + startTime);
            oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.3, audioContext.currentTime + startTime + duration);
            
            // Sharp attack and quick decay like a real bark
            gainNode.gain.setValueAtTime(0, audioContext.currentTime + startTime);
            gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + startTime + 0.02);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + startTime + duration);
            
            oscillator.start(audioContext.currentTime + startTime);
            oscillator.stop(audioContext.currentTime + startTime + duration);
        };
        
        // Create a compound bark sound with multiple frequencies
        createBarkComponent(180, 0, 0.15, 0.3);      // Low growl component
        createBarkComponent(320, 0.05, 0.12, 0.25);  // Mid bark
        createBarkComponent(480, 0.08, 0.08, 0.2);   // High bark component
        
        // Add a second bark for realism
        setTimeout(() => {
            createBarkComponent(200, 0, 0.12, 0.25);
            createBarkComponent(340, 0.03, 0.1, 0.2);
        }, 250);
        
    } catch (error) {
        console.log('Audio not supported');
    }
};