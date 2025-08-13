// DrawTab component for Sebastian's Silly App
const DrawTab = () => {
    const canvasRef = React.useRef(null);
    const [isDrawing, setIsDrawing] = React.useState(false);
    const [currentColor, setCurrentColor] = React.useState('#000000');

    React.useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.lineWidth = 3;
            
            // Make canvas much bigger - almost full container
            const container = canvas.parentElement;
            const containerWidth = container.clientWidth - 10; // Minimal margin
            const canvasHeight = Math.round(containerWidth * 0.75); // Taller aspect ratio
            
            canvas.width = containerWidth;
            canvas.height = canvasHeight;
            canvas.style.width = containerWidth + 'px';
            canvas.style.height = canvasHeight + 'px';
        }
    }, []);

    const getEventPos = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        
        // Handle both mouse and touch events
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const startDrawing = (e) => {
        e.preventDefault(); // Prevent scrolling on mobile
        setIsDrawing(true);
        const pos = getEventPos(e);
        
        const ctx = canvasRef.current.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        e.preventDefault(); // Prevent scrolling on mobile
        
        const pos = getEventPos(e);
        const ctx = canvasRef.current.getContext('2d');
        ctx.strokeStyle = currentColor;
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    };

    const stopDrawing = (e) => {
        if (e) e.preventDefault();
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    return (
        <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-800 text-center">Draw Something!</h3>
            
            <div className="flex justify-center gap-1 mb-3 flex-wrap">
                {['#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500'].map(color => (
                    <button
                        key={color}
                        onClick={() => setCurrentColor(color)}
                        className={`w-6 h-6 rounded-full border-2 ${currentColor === color ? 'border-black' : 'border-gray-300'} m-0.5`}
                        style={{ backgroundColor: color }}
                    />
                ))}
            </div>
            
            <div className="w-full px-1">
                <canvas
                    ref={canvasRef}
                    className="border-2 border-gray-300 rounded-lg bg-white cursor-crosshair touch-none w-full"
                    style={{ touchAction: 'none' }}
                    // Mouse events
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    // Touch events for mobile
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    onTouchCancel={stopDrawing}
                />
            </div>
            
            <button
                onClick={clearCanvas}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 w-full"
            >
                🗑️ Clear Drawing
            </button>
        </div>
    );
};