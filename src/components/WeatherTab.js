// WeatherTab component for Sebastian's Silly App
const WeatherTab = () => {
    const [weather, setWeather] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [location, setLocation] = React.useState('Sydney, Australia');
    const [lastUpdated, setLastUpdated] = React.useState(null);

    // Fun weather descriptions for kids
    const getKidFriendlyDescription = (condition, temp) => {
        const descriptions = {
            'clear': [
                "It's super sunny outside! ☀️ Perfect for playing!",
                "The sun is shining bright! Time for outdoor fun! 🌞",
                "Beautiful sunny day! Great weather for adventures! ✨"
            ],
            'clouds': [
                "It's cloudy but cozy! The clouds look like fluffy cotton! ☁️",
                "Cloudy skies today! Perfect for cloud watching! 🌤️",
                "The sky has fluffy white pillows floating around! ☁️"
            ],
            'rain': [
                "It's raining! Time for puddle jumping! 🌧️",
                "Rain drops are dancing from the sky! Perfect for staying cozy inside! ☔",
                "The sky is taking a shower! Great day for indoor activities! 🌦️"
            ],
            'snow': [
                "Snow is falling like magical white confetti! ❄️",
                "Winter wonderland outside! Perfect for snowmen! ⛄",
                "The sky is sprinkling snow flakes! So pretty! 🌨️"
            ],
            'thunderstorm': [
                "Thunder is rumbling like a friendly giant! Stay safe inside! ⛈️",
                "The sky is having a big party with lights and sounds! 🌩️",
                "Nature's fireworks show! Best watched from inside! ⚡"
            ],
            'fog': [
                "It's misty and mysterious outside! Like a fairy tale! 🌫️",
                "The world is wearing a soft gray blanket! So magical! 🌁",
                "Everything looks dreamy and soft today! 🌫️"
            ]
        };

        const conditionKey = condition.toLowerCase();
        let selectedDescriptions = descriptions['clear']; // default

        if (conditionKey.includes('rain') || conditionKey.includes('drizzle')) {
            selectedDescriptions = descriptions['rain'];
        } else if (conditionKey.includes('cloud')) {
            selectedDescriptions = descriptions['clouds'];
        } else if (conditionKey.includes('snow')) {
            selectedDescriptions = descriptions['snow'];
        } else if (conditionKey.includes('thunder') || conditionKey.includes('storm')) {
            selectedDescriptions = descriptions['thunderstorm'];
        } else if (conditionKey.includes('fog') || conditionKey.includes('mist')) {
            selectedDescriptions = descriptions['fog'];
        } else if (conditionKey.includes('clear') || conditionKey.includes('sun')) {
            selectedDescriptions = descriptions['clear'];
        }

        return selectedDescriptions[Math.floor(Math.random() * selectedDescriptions.length)];
    };

    // Get weather icon and animation
    const getWeatherDisplay = (condition, temp) => {
        const conditionLower = condition.toLowerCase();
        
        if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
            return {
                emoji: '🌧️',
                animation: 'animate-bounce',
                background: 'from-blue-200 to-blue-400',
                particles: ['💧', '💧', '💧', '☔']
            };
        } else if (conditionLower.includes('cloud')) {
            return {
                emoji: '☁️',
                animation: 'animate-pulse',
                background: 'from-gray-200 to-gray-400',
                particles: ['☁️', '🌤️', '⛅', '☁️']
            };
        } else if (conditionLower.includes('snow')) {
            return {
                emoji: '❄️',
                animation: 'animate-spin',
                background: 'from-blue-100 to-white',
                particles: ['❄️', '⛄', '🌨️', '❄️']
            };
        } else if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
            return {
                emoji: '⛈️',
                animation: 'animate-pulse',
                background: 'from-gray-600 to-gray-800',
                particles: ['⚡', '🌩️', '⛈️', '⚡']
            };
        } else if (conditionLower.includes('fog') || conditionLower.includes('mist')) {
            return {
                emoji: '🌫️',
                animation: 'animate-pulse',
                background: 'from-gray-300 to-gray-500',
                particles: ['🌫️', '🌁', '🌫️', '🌁']
            };
        } else {
            // Clear/sunny
            return {
                emoji: temp > 25 ? '☀️' : '🌞',
                animation: 'animate-bounce',
                background: 'from-yellow-200 to-orange-400',
                particles: ['☀️', '🌞', '✨', '🌟']
            };
        }
    };

    // Fetch weather data with multiple location strategies
    const fetchWeather = async () => {
        setLoading(true);
        setError(null);
        
        try {
            // Strategy 1: Try GPS location
            console.log('🎯 Trying GPS location...');
            try {
                const position = await getCurrentLocation();
                const { latitude, longitude } = position;
                console.log('✅ GPS location found:', latitude, longitude);
                await fetchWeatherByCoordinates(latitude, longitude);
                return; // Success! Exit early
            } catch (locationError) {
                console.log('❌ GPS location failed:', locationError.message);
            }
            
            // Strategy 2: Try IP-based location
            console.log('🌐 Trying IP-based location...');
            try {
                await fetchWeatherByIP();
                return; // Success! Exit early
            } catch (ipError) {
                console.log('❌ IP location failed:', ipError.message);
            }
            
            // Strategy 3: Default to Sydney
            console.log('🏙️ Using default city: Sydney');
            await fetchWeatherByCity('Sydney');
            
        } catch (err) {
            console.error('❌ All weather methods failed:', err);
            setError('Unable to get weather data. Using demo mode.');
            await fetchMockWeather();
        } finally {
            setLoading(false);
        }
    };

    // Fetch weather using IP-based geolocation
    const fetchWeatherByIP = async () => {
        const API_KEY = '9c0b0d3637044398a4f82511251308';
        
        // WeatherAPI can auto-detect location using IP
        const API_URL = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=auto:ip&aqi=no`;
        
        console.log('📡 Fetching weather by IP...');
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`IP location API error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ IP location weather:', data.location.name, data.location.country);
        setWeatherFromAPI(data);
    };

    // Fetch weather by coordinates
    const fetchWeatherByCoordinates = async (latitude, longitude) => {
        const API_KEY = '9c0b0d3637044398a4f82511251308';
        const API_URL = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${latitude},${longitude}&aqi=no`;
        
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`Weather API error: ${response.status}`);
        }
        
        const data = await response.json();
        setWeatherFromAPI(data);
    };

    // Get user's current location with comprehensive error handling
    const getCurrentLocation = () => {
        return new Promise((resolve, reject) => {
            // Check if geolocation is supported
            if (!navigator.geolocation) {
                reject(new Error('Geolocation not supported by this browser'));
                return;
            }

            console.log('🔍 Attempting to get location...');

            // Try multiple location strategies
            const options = [
                // Strategy 1: High accuracy GPS
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                },
                // Strategy 2: Network-based location (faster, less accurate)
                {
                    enableHighAccuracy: false,
                    timeout: 8000,
                    maximumAge: 60000
                },
                // Strategy 3: Cached location (fastest)
                {
                    enableHighAccuracy: false,
                    timeout: 5000,
                    maximumAge: 300000
                }
            ];

            let attemptCount = 0;

            const tryGetLocation = () => {
                if (attemptCount >= options.length) {
                    reject(new Error('All location attempts failed'));
                    return;
                }

                const currentOptions = options[attemptCount];
                console.log(`📍 Location attempt ${attemptCount + 1}:`, currentOptions);

                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        console.log('✅ Location success:', {
                            lat: position.coords.latitude,
                            lon: position.coords.longitude,
                            accuracy: position.coords.accuracy
                        });
                        
                        resolve({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            accuracy: position.coords.accuracy
                        });
                    },
                    (error) => {
                        console.log(`❌ Location attempt ${attemptCount + 1} failed:`, {
                            code: error.code,
                            message: error.message,
                            PERMISSION_DENIED: error.PERMISSION_DENIED,
                            POSITION_UNAVAILABLE: error.POSITION_UNAVAILABLE,
                            TIMEOUT: error.TIMEOUT
                        });

                        attemptCount++;
                        
                        // If it's a permission denied, don't retry
                        if (error.code === error.PERMISSION_DENIED) {
                            reject(new Error('Location access denied by user'));
                            return;
                        }
                        
                        // Try next strategy
                        setTimeout(tryGetLocation, 500);
                    },
                    currentOptions
                );
            };

            tryGetLocation();
        });
    };

    // Fetch weather by city name (fallback and manual search)
    const fetchWeatherByCity = async (cityName = 'Sydney') => {
        const API_KEY = '9c0b0d3637044398a4f82511251308';
        const API_URL = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(cityName)}&aqi=no`;
        
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`Weather API error: ${response.status} for city: ${cityName}`);
        }
        
        const data = await response.json();
        setWeatherFromAPI(data);
    };

    // Helper function to set weather data from API response
    const setWeatherFromAPI = (data) => {
        // Transform WeatherAPI.com data to match our component structure
        const transformedData = {
            name: data.location.name,
            sys: { country: data.location.country },
            main: { 
                temp: data.current.temp_c, 
                feels_like: data.current.feelslike_c, 
                humidity: data.current.humidity 
            },
            weather: [{ 
                main: data.current.condition.text.split(' ')[0], // First word of condition
                description: data.current.condition.text.toLowerCase(), 
                icon: data.current.condition.icon 
            }],
            wind: { speed: data.current.wind_kph / 3.6 }, // Convert km/h to m/s
            visibility: data.current.vis_km,
            uv: data.current.uv
        };
        
        setWeather(transformedData);
        setLocation(`${data.location.name}, ${data.location.region}, ${data.location.country}`);
        setLastUpdated(new Date());
        setError(null); // Clear any previous errors
    };

    // Manual city search function
    const searchCity = async () => {
        const cityName = prompt('🌍 Enter city name (e.g., "New York", "London", "Tokyo"):');
        if (!cityName || cityName.trim() === '') return;
        
        setLoading(true);
        try {
            await fetchWeatherByCity(cityName.trim());
        } catch (err) {
            setError(`Could not find weather for "${cityName}". Please try another city.`);
            console.error('City search error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Mock weather data fallback
    const fetchMockWeather = async () => {
        const mockWeatherData = {
            sunny: {
                name: 'Demo City',
                sys: { country: 'AU' },
                main: { temp: 28, feels_like: 30, humidity: 65 },
                weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
                wind: { speed: 3.2 },
                visibility: 10,
                uv: 6
            },
            cloudy: {
                name: 'Demo City', 
                sys: { country: 'AU' },
                main: { temp: 22, feels_like: 24, humidity: 78 },
                weather: [{ main: 'Clouds', description: 'scattered clouds', icon: '03d' }],
                wind: { speed: 2.1 },
                visibility: 8,
                uv: 3
            },
            rainy: {
                name: 'Demo City',
                sys: { country: 'AU' },
                main: { temp: 18, feels_like: 16, humidity: 85 },
                weather: [{ main: 'Rain', description: 'light rain', icon: '10d' }],
                wind: { speed: 4.5 },
                visibility: 5,
                uv: 1
            }
        };
        
        // Randomly select weather for demo
        const weatherTypes = ['sunny', 'cloudy', 'rainy'];
        const randomWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
        const data = mockWeatherData[randomWeather];
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setWeather(data);
        setLocation(`${data.name}, Demo State, ${data.sys.country}`);
        setLastUpdated(new Date());
    };

    // Auto-fetch weather on component mount
    React.useEffect(() => {
        fetchWeather();
    }, []);

    // Floating particles animation
    const FloatingParticles = ({ particles }) => (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((particle, index) => (
                <div
                    key={index}
                    className="absolute text-2xl animate-pulse"
                    style={{
                        left: `${Math.random() * 80 + 10}%`,
                        top: `${Math.random() * 80 + 10}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: `${2 + Math.random() * 2}s`
                    }}
                >
                    {particle}
                </div>
            ))}
        </div>
    );

    if (loading) {
        return (
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 text-center">Weather Today 🌈</h3>
                <div className="bg-gradient-to-br from-blue-200 to-purple-300 rounded-lg p-6 text-center">
                    <div className="text-6xl animate-spin mb-4">🌀</div>
                    <div className="text-lg font-semibold text-gray-700">Getting weather info...</div>
                    <div className="text-sm text-gray-600 mt-2">Please wait a moment! 🌟</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 text-center">Weather Today 🌈</h3>
                <div className="bg-red-100 border-2 border-red-300 rounded-lg p-6 text-center">
                    <div className="text-6xl mb-4">😅</div>
                    <div className="text-lg font-semibold text-red-700 mb-2">{error}</div>
                    <button
                        onClick={fetchWeather}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                        🔄 Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!weather) return null;

    const weatherDisplay = getWeatherDisplay(weather.weather[0].main, weather.main.temp);
    const description = getKidFriendlyDescription(weather.weather[0].main, weather.main.temp);
    const temp = Math.round(weather.main.temp);
    const feelsLike = Math.round(weather.main.feels_like);

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800 text-center">Weather Today 🌈</h3>
            
            {/* Main Weather Display */}
            <div className={`relative bg-gradient-to-br ${weatherDisplay.background} rounded-lg p-6 text-center overflow-hidden`}>
                <FloatingParticles particles={weatherDisplay.particles} />
                
                <div className="relative z-10">
                    <div className="text-lg font-bold text-gray-800 mb-2">{location}</div>
                    
                    <div className={`text-8xl mb-4 ${weatherDisplay.animation}`}>
                        {weatherDisplay.emoji}
                    </div>
                    
                    <div className="text-4xl font-bold text-gray-800 mb-2">
                        {temp}°C
                    </div>
                    
                    <div className="text-lg font-semibold text-gray-700 capitalize mb-3">
                        {weather.weather[0].description}
                    </div>
                    
                    <div className="bg-white bg-opacity-70 rounded-lg p-3 text-sm text-gray-800">
                        {description}
                    </div>
                </div>
            </div>

            {/* Weather Details */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-100 rounded-lg p-3 text-center">
                    <div className="text-2xl mb-1">🌡️</div>
                    <div className="text-sm font-semibold text-gray-700">Feels Like</div>
                    <div className="text-lg font-bold text-blue-600">{feelsLike}°C</div>
                </div>
                
                <div className="bg-green-100 rounded-lg p-3 text-center">
                    <div className="text-2xl mb-1">💨</div>
                    <div className="text-sm font-semibold text-gray-700">Wind</div>
                    <div className="text-lg font-bold text-green-600">{Math.round(weather.wind.speed)} m/s</div>
                </div>
                
                {weather.visibility && (
                    <div className="bg-purple-100 rounded-lg p-3 text-center">
                        <div className="text-2xl mb-1">👀</div>
                        <div className="text-sm font-semibold text-gray-700">Visibility</div>
                        <div className="text-lg font-bold text-purple-600">{weather.visibility} km</div>
                    </div>
                )}
                
                {weather.uv && (
                    <div className="bg-yellow-100 rounded-lg p-3 text-center">
                        <div className="text-2xl mb-1">☀️</div>
                        <div className="text-sm font-semibold text-gray-700">UV Index</div>
                        <div className="text-lg font-bold text-yellow-600">{weather.uv}</div>
                    </div>
                )}
            </div>

            {/* Activity Suggestions */}
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                <h4 className="text-md font-bold text-yellow-800 mb-2 text-center">🎯 Perfect Weather For:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                    {temp > 25 ? (
                        <>
                            <div className="bg-yellow-200 rounded p-2 text-center">🏖️ Beach Day!</div>
                            <div className="bg-yellow-200 rounded p-2 text-center">🍦 Ice Cream!</div>
                        </>
                    ) : temp > 15 ? (
                        <>
                            <div className="bg-yellow-200 rounded p-2 text-center">🚶 Walking!</div>
                            <div className="bg-yellow-200 rounded p-2 text-center">⚽ Playing Outside!</div>
                        </>
                    ) : (
                        <>
                            <div className="bg-yellow-200 rounded p-2 text-center">🏠 Indoor Fun!</div>
                            <div className="bg-yellow-200 rounded p-2 text-center">☕ Hot Chocolate!</div>
                        </>
                    )}
                </div>
            </div>

            {/* Refresh Button and Location Info */}
            <div className="text-center space-y-2">
                <div className="flex justify-center gap-2">
                    <button
                        onClick={fetchWeather}
                        className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 hover:scale-105"
                    >
                        🔄 Refresh
                    </button>
                    
                    <button
                        onClick={searchCity}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 hover:scale-105"
                    >
                        📍 Search City
                    </button>
                </div>
                
                {lastUpdated && (
                    <div className="text-xs text-gray-500">
                        Last updated: {lastUpdated.toLocaleTimeString()}
                    </div>
                )}
                
                {error && (
                    <div className="text-xs text-orange-600 bg-orange-100 rounded p-2 mt-2">
                        ℹ️ {error}
                    </div>
                )}

                {/* Debug Info for Development */}
                <div className="text-xs text-gray-400 bg-gray-50 rounded p-2 mt-2">
                    <div>🔧 Location Status: {navigator.geolocation ? 'Available' : 'Not Available'}</div>
                    <div>🌍 HTTPS: {location.protocol === 'https:' ? 'Yes' : 'No (required for GPS)'}</div>
                    <div>📱 User Agent: {navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'}</div>
                </div>
            </div>

            {/* Fun Weather Facts */}
            <div className="bg-purple-50 p-3 rounded-lg">
                <div className="text-xs text-purple-700 text-center">
                    <strong>🌟 Fun Fact:</strong> {
                        weather.main.humidity > 80 ? "It's very humid today - the air is full of tiny water droplets!" :
                        weather.main.humidity < 40 ? "The air is quite dry today - perfect for static electricity experiments!" :
                        "The humidity is just right for a comfortable day!"
                    }
                </div>
            </div>
        </div>
    );
};