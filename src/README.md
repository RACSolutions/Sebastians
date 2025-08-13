# Sebastian's Silly App 🎉

A fun, interactive web app designed for kids with four engaging activities: text-to-speech buttons, drawing canvas, emoji pop game, and a virtual puppy companion.

## Features

### 📊 Buttons Tab
- Text-to-speech functionality with silly preset phrases
- Custom text input for personalized messages
- Kid-friendly phrases like "Barnabus", "Poo Poo Pee Pee", etc.

### 🎨 Draw Tab
- Full-screen drawing canvas optimized for mobile touch
- 18 preset colors plus custom color picker with preview
- Variable brush and eraser sizes
- Touch and mouse support with smooth drawing
- Save/load drawings with localStorage
- Clear button to start fresh

### 🎮 Game Tab
- "Emoji Pop" game with progressive difficulty
- High score tracking with local storage
- Sound effects and visual feedback
- Level system that gets faster as you score more

### 🐕 Buddy Tab
- Virtual puppy that moves around autonomously
- Interactive feeding, petting, and playing
- Realistic bark, chomp, and sniff sounds
- Multiple sound layers for authentic experience
- No maintenance required - just pure fun!

## File Structure

```
sebastian-silly-app/
├── index.html                 # Main HTML file with embedded audio utilities
├── src/
│   ├── components/
│   │   ├── ButtonsTab.js      # Text-to-speech component
│   │   ├── DrawTab.js         # Drawing canvas component
│   │   ├── GameTab.js         # Emoji pop game component
│   │   └── PuppyTab.js        # Virtual puppy component
│   ├── styles/
│   │   └── main.css           # Custom CSS styles
│   └── App.js                 # Main application component
├── sounds/ (optional)
│   ├── dog-bark.mp3           # Real dog bark sound file
│   ├── Chomp.mp3              # Eating sound file
│   └── dog-sniff.mp3          # Sniffing sound file
└── README.md                  # This file
```

## Technologies Used

- **React 18** - Component-based UI framework
- **Tailwind CSS** - Utility-first CSS framework
- **Web Audio API** - For synthesized sound generation
- **HTML5 Audio** - For real sound file playback
- **HTML5 Canvas** - For drawing functionality
- **Local Storage** - For saving drawings, high scores and preferences
- **Speech Synthesis API** - For text-to-speech features

## Audio System

The app uses a hybrid audio approach:
- **Synthesized Sounds**: Pop sounds and fallback bark sounds using Web Audio API
- **Real Audio Files**: Authentic dog bark, chomp, and sniff sounds (optional)
- **Graceful Fallback**: If audio files aren't available, synthesized alternatives play instead

All audio functions are embedded directly in `index.html` and made globally available.

## Mobile Optimization

- Touch-friendly interface with proper touch targets (44px minimum)
- Responsive canvas that adapts to screen size
- Prevented zoom on input focus for iOS
- Touch events for drawing functionality
- Optimized button sizes for finger interaction
- Touch-action: none for proper canvas drawing

## Drawing Features

- **18 Preset Colors**: Black, white, primary colors, and popular shades
- **Custom Color Picker**: Full spectrum color selection with preview
- **Dialog-based Color Selection**: Persistent color picker with OK/Cancel buttons
- **Variable Brush Sizes**: 1px to 20px for different line weights
- **Smart Eraser**: Multiple eraser sizes with proper transparency
- **Save/Load System**: Name and store drawings locally
- **Touch Optimized**: Smooth drawing on both desktop and mobile

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development

### Running Locally

1. Clone or download the files
2. Open `index.html` in a web browser
3. Or serve via a local server for best performance

### Adding Audio Files

Place these optional audio files in the same directory as `index.html`:
- `dog-bark.mp3` - Real dog bark sound
- `Chomp.mp3` - Eating/chomping sound  
- `dog-sniff.mp3` - Dog sniffing sound

If files aren't present, the app will use synthesized fallback sounds.

### Deployment

The app is designed to work as static files and can be deployed to:
- Netlify
- Vercel
- GitHub Pages
- Any static file hosting service

## Performance Considerations

- Components are modularized to prevent unnecessary re-renders
- Audio contexts are created only when needed
- Canvas is optimized for both desktop and mobile
- Minimal external dependencies
- Efficient drawing with proper event handling

## Future Enhancements

- More drawing tools (shapes, stamps, etc.)
- Additional game modes and difficulty levels
- More puppy personalities and interactions
- Offline functionality with service workers
- Export drawings as PNG files
- More sound effects and animations

## Credits

Created with ❤️ for Sebastian! 🎈

---

*This app demonstrates modern web development practices with a focus on user experience, mobile optimization, and clean code architecture.*