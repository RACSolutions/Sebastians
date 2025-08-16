// FeedbackTab component for Sebastian's Silly App
const FeedbackTab = () => {
    const [message, setMessage] = React.useState('');
    const [name, setName] = React.useState(() => {
        return localStorage.getItem('sebastianUserName') || 'Sebastian';
    });
    const [email, setEmail] = React.useState('');
    const [category, setCategory] = React.useState('idea');
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [submitted, setSubmitted] = React.useState(false);
    const [error, setError] = React.useState('');

    const categories = [
        { id: 'idea', label: '💡 New App Idea', emoji: '💡' },
        { id: 'improvement', label: '⭐ Make Something Better', emoji: '⭐' },
        { id: 'bug', label: '🐛 Something is Broken', emoji: '🐛' },
        { id: 'fun', label: '🎉 Just Saying Hi!', emoji: '🎉' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!message.trim()) {
            setError('Please write a message! 📝');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            // Create form data
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('category', category);
            formData.append('message', message);
            formData.append('timestamp', new Date().toISOString());
            formData.append('userAgent', navigator.userAgent);

            // Submit to Netlify Forms
            const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    'form-name': 'sebastian-feedback',
                    'name': name,
                    'email': email,
                    'category': category,
                    'message': message,
                    'timestamp': new Date().toISOString()
                })
            });

            if (response.ok) {
                setSubmitted(true);
                setMessage('');
                setEmail('');
                
                // Play success sound
                if (window.playPopSound) {
                    window.playPopSound();
                }
                
                // Reset after 5 seconds
                setTimeout(() => {
                    setSubmitted(false);
                }, 5000);
            } else {
                throw new Error('Failed to send message');
            }
        } catch (err) {
            console.error('Feedback submission error:', err);
            setError('Oops! Something went wrong. Please try again later. 😅');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getRandomPrompt = () => {
        const prompts = [
            "I wish there was a game where...",
            "It would be cool if I could...",
            "What if you added...",
            "I noticed that...",
            "My favorite part is... but maybe...",
            "Can you make it so...",
            "I had an idea about...",
            "It might be fun to...",
            "The app would be even better if...",
            "I love using... but I think..."
        ];
        
        const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
        setMessage(message + (message ? '\n\n' : '') + randomPrompt + ' ');
    };

    if (submitted) {
        return (
            <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800 text-center">Message Sent! 📨</h3>
                
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-6 text-center border-2 border-green-300">
                    <div className="text-6xl mb-4 animate-bounce">🎉</div>
                    <div className="text-2xl font-bold text-green-600 mb-3">
                        Thank You, {name}!
                    </div>
                    <div className="text-lg text-green-700 mb-4">
                        Your message has been sent successfully!
                    </div>
                    <div className="bg-white rounded-lg p-4 text-sm text-green-600">
                        The developer will read your message and might use your ideas to make the app even more awesome! 🚀
                    </div>
                </div>

                <div className="text-center">
                    <button
                        onClick={() => setSubmitted(false)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                        📝 Send Another Message
                    </button>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="text-center text-sm text-purple-700">
                        <strong>💡 Fun Fact:</strong> Your ideas help make this app better for all kids who use it! 
                        Every suggestion is read and appreciated! 🌟
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800 text-center">Share Your Ideas! 💭</h3>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                <div className="text-center">
                    <div className="text-lg font-bold text-blue-800 mb-2">Help Make This App Even Better!</div>
                    <div className="text-sm text-blue-700">
                        Have an idea for a new game? Found something that could be improved? 
                        Want to say hello? Send a message to the developer! 📬
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Hidden form for Netlify */}
                <input type="hidden" name="form-name" value="sebastian-feedback" />
                
                {/* Category Selection */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                        What kind of message is this?
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => setCategory(cat.id)}
                                className={`p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                                    category === cat.id
                                        ? 'border-purple-500 bg-purple-100 text-purple-800'
                                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                                }`}
                            >
                                <div className="text-2xl mb-1">{cat.emoji}</div>
                                <div className="text-xs font-medium">{cat.label.replace(/^[💡⭐🐛🎉] /, '')}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Name Field */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Your Name:
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="What should I call you?"
                        required
                    />
                </div>

                {/* Email Field (Optional) */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email (optional):
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="If you want a reply (optional)"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                        Only needed if you want the developer to email you back!
                    </div>
                </div>

                {/* Message Field */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-semibold text-gray-700">
                            Your Message:
                        </label>
                        <button
                            type="button"
                            onClick={getRandomPrompt}
                            className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold py-1 px-3 rounded-full text-xs transition-colors duration-200"
                        >
                            💡 Need Ideas?
                        </button>
                    </div>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-32"
                        placeholder="Share your ideas, suggestions, or just say hello! Be as detailed as you want..."
                        required
                        rows={6}
                    />
                    <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
                        <div>{message.length} characters</div>
                        <div>The developer reads every message! 📖</div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-100 border border-red-300 rounded-lg p-3 text-red-700 text-sm">
                        {error}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting || !message.trim()}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="animate-spin">🔄</span>
                            Sending Message...
                        </span>
                    ) : (
                        <span className="flex items-center justify-center gap-2">
                            <span>📨</span>
                            Send My Message!
                        </span>
                    )}
                </button>
            </form>

            {/* Encouragement */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
                <div className="text-center">
                    <div className="text-lg font-bold text-yellow-800 mb-2">🌟 Your Ideas Matter!</div>
                    <div className="text-sm text-yellow-700 space-y-1">
                        <div>💡 Suggest new games or activities</div>
                        <div>⭐ Tell what you like or what could be better</div>
                        <div>🐛 Report if something isn't working</div>
                        <div>🎉 Or just say hello and share what you're up to!</div>
                    </div>
                </div>
            </div>

            <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <div className="text-xs text-purple-700 text-center">
                    <strong>🔒 Privacy Note:</strong> Your messages are sent securely and only seen by the developer. 
                    Email addresses (if provided) are only used to reply to you and never shared! 🛡️
                </div>
            </div>
        </div>
    );
};