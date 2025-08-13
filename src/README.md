# Sebastian's Silly App 🎉

A fun, interactive web app designed for kids with four engaging activities: text-to-speech buttons, drawing canvas, emoji pop game, and a virtual puppy companion.

## Features

### 🔊 Buttons Tab
- Text-to-speech functionality with silly preset phrases
- Custom text input for personalized messages
- Kid-friendly phrases like "Barnabus", "Poo Poo Pee Pee", etc.

### 🎨 Draw Tab
- Full-screen drawing canvas optimized for mobile touch
- 8 color palette for creative expression
- Touch and mouse support with smooth drawing
- Clear button to start fresh

### 🎮 Game Tab
- "Emoji Pop" game with progressive difficulty
- High score tracking with local storage
- Sound effects and visual feedback
- Level system that gets faster as you score more

### 🐕 Buddy Tab
- Virtual puppy that moves around autonomously
- Interactive feeding, petting, and playing
- Realistic bark sounds with multiple frequency layers
- No maintenance required - just pure fun!

## File Structure

```
sebastian-silly-app/
├── index.html                 # Main HTML file
├── src/
│   ├── components/
│   │   ├── ButtonsTab.js      # Text-to-speech component
│   │   ├── DrawTab.js         # Drawing canvas component
│   │   ├── GameTab.js         # Emoji pop game component
│   │   └── PuppyTab.js        # Virtual puppy component
│   ├── utils/
│   │   └── audioUtils.js      # Audio utility functions
│   ├── styles/
│   │   └── main.css           # Custom CSS styles
│   ├── sounds/
│   │   └── dog-bark.mp3       # Real dog bark sound file
│   └── App.js                 # Main application component
└── README.md                  # This file
```

## Technologies Used

- **React 18** - Component-based UI framework
- **Tailwind CSS** - Utility-first CSS framework
- **Web Audio API** - For sound generation
- **HTML5 Canvas** - For drawing functionality
- **Local Storage** - For saving high scores and preferences
- **Speech Synthesis API** - For text-to-speech features

## Mobile Optimization

- Touch-friendly interface with proper touch targets
- Responsive canvas that adapts to screen size
- Prevented zoom on input focus for iOS
- Touch events for drawing functionality
- Optimized button sizes for finger interaction

## Audio Features

- **Text-to-Speech** - Browser-native speech synthesis
- **Pop Sounds** - Synthesized pop effects for game
- **Realistic Bark** - Multi-layered dog bark with frequency modulation
- **Cross-browser compatibility** - Graceful fallback when audio isn't supported

## Development

### Running Locally

1. Clone or download the files
2. Open `index.html` in a web browser
3. Or serve via a local server for best performance

### Deployment

The app is designed to work as static files and can be deployed to:
- Netlify
- Vercel
- GitHub Pages
- Any static file hosting service

### Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Considerations

- Components are modularized to prevent unnecessary re-renders
- Audio contexts are created only when needed
- Canvas is optimized for both desktop and mobile
- Minimal external dependencies

## Future Enhancements

- Save drawings to local storage
- More game modes and difficulty levels
- Additional puppy personalities
- Offline functionality with service workers
- More sound effects and animations

## Credits

Created with ❤️ for Sebastian! 🎈

---

*This app demonstrates modern web development practices with a focus on user experience, mobile optimization, and clean code architecture.*