// DrawTab component for Sebastian's Silly App
const DrawTab = () => {
    const canvasRef = React.useRef(null);
    const [isDrawing, setIsDrawing] = React.useState(false);
    const [currentColor, setCurrentColor] = React.useState('#000000');
    const [isEraser, setIsEraser] = React.useState(false);
    const [brushSize, setBrushSize] = React.useState(3);
    const [eraserSize, setEraserSize] = React.useState(15);
    const [showColorPicker, setShowColorPicker] = React.useState(false);
    const [tempColor, setTempColor] = React.useState('#000000'); // Temporary color for picker
    const [savedDrawings, setSavedDrawings] = React.useState(() => {
        const saved = localStorage.getItem('sebastianDrawings');
        return saved ? JSON.parse(saved) : [];
    });
    const [showSaveDialog, setShowSaveDialog] = React.useState(false);
    const [showLoadDialog, setShowLoadDialog] = React.useState(false);
    const [drawingName, setDrawingName] = React.useState('');

    // Predefined colors + custom color
    const defaultColors = [
        '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', 
        '#ff00ff', '#00ffff', '#ffa500', '#800080', '#ffc0cb', '#a52a2a',
        '#808080', '#90ee90', '#add8e6', '#f0e68c', '#dda0dd', '#98fb98'
    ];

    React.useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            
            // Make canvas much bigger - almost full container
            const container = canvas.parentElement;
            const containerWidth = container.clientWidth - 10;
            const canvasHeight = Math.round(containerWidth * 0.75);
            
            canvas.width = containerWidth;
            canvas.height = canvasHeight;
            canvas.style.width = containerWidth + 'px';
            canvas.style.height = canvasHeight + 'px';
            
            // Set white background only once when canvas is created
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }, []); // Remove dependencies to prevent clearing

    const getEventPos = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const startDrawing = (e) => {
        e.preventDefault();
        setIsDrawing(true);
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const pos = getEventPos(e);
        
        // Configure drawing/erasing settings
        if (isEraser) {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.lineWidth = eraserSize;
        } else {
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = currentColor;
            ctx.lineWidth = brushSize;
        }
        
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        e.preventDefault();
        
        const pos = getEventPos(e);
        const ctx = canvasRef.current.getContext('2d');
        
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    };

    const stopDrawing = (e) => {
        if (e) e.preventDefault();
        if (isDrawing) {
            setIsDrawing(false);
            
            // Reset composite operation to normal after erasing
            const ctx = canvasRef.current.getContext('2d');
            ctx.globalCompositeOperation = 'source-over';
        }
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const saveDrawing = () => {
        if (!drawingName.trim()) {
            alert('Please enter a name for your drawing!');
            return;
        }
        
        const canvas = canvasRef.current;
        const imageData = canvas.toDataURL();
        const newDrawing = {
            id: Date.now(),
            name: drawingName,
            data: imageData,
            date: new Date().toLocaleDateString()
        };
        
        const updatedDrawings = [newDrawing, ...savedDrawings];
        setSavedDrawings(updatedDrawings);
        localStorage.setItem('sebastianDrawings', JSON.stringify(updatedDrawings));
        
        setShowSaveDialog(false);
        setDrawingName('');
        alert('Drawing saved! 🎨');
    };

    const loadDrawing = (drawing) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        
        img.src = drawing.data;
        setShowLoadDialog(false);
    };

    const deleteDrawing = (id) => {
        if (confirm('Are you sure you want to delete this drawing?')) {
            const updatedDrawings = savedDrawings.filter(drawing => drawing.id !== id);
            setSavedDrawings(updatedDrawings);
            localStorage.setItem('sebastianDrawings', JSON.stringify(updatedDrawings));
        }
    };

    const selectTool = (tool, color = null) => {
        if (tool === 'eraser') {
            setIsEraser(true);
        } else {
            setIsEraser(false);
            if (color) setCurrentColor(color);
        }
    };

    const openColorPicker = () => {
        setTempColor(currentColor); // Set temp color to current color
        setShowColorPicker(true);
    };

    const confirmColorChoice = () => {
        setCurrentColor(tempColor);
        setIsEraser(false);
        setShowColorPicker(false);
    };

    const cancelColorChoice = () => {
        setTempColor(currentColor); // Reset temp color
        setShowColorPicker(false);
    };

    const handleColorChange = (e) => {
        setTempColor(e.target.value);
    };

    return (
        <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-800 text-center">Draw Something!</h3>
            
            {/* Color and Tool Selection */}
            <div className="space-y-2">
                {/* Default Colors */}
                <div className="flex justify-center gap-1 flex-wrap">
                    {defaultColors.map(color => (
                        <button
                            key={color}
                            onClick={() => selectTool('color', color)}
                            className={`w-6 h-6 rounded-full border-2 ${
                                currentColor === color && !isEraser ? 'border-black border-4' : 'border-gray-300'
                            } m-0.5`}
                            style={{ backgroundColor: color }}
                        />
                    ))}
                    
                    {/* Custom Color Picker Button */}
                    <button
                        onClick={openColorPicker}
                        className="w-6 h-6 rounded-full border-2 border-gray-400 m-0.5 bg-gradient-to-br from-red-400 via-yellow-400 to-blue-400 hover:border-black"
                        title="More colors"
                    >
                        <span className="text-xs">+</span>
                    </button>
                </div>
                
                {/* Tools and Size Controls */}
                <div className="flex justify-center gap-3 items-center flex-wrap">
                    <button
                        onClick={() => selectTool('eraser')}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                            isEraser 
                                ? 'bg-red-500 text-white' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        🧽 Eraser
                    </button>
                    
                    {/* Brush Size Control */}
                    {!isEraser && (
                        <div className="flex items-center gap-1">
                            <span className="text-xs">Brush:</span>
                            <select 
                                value={brushSize} 
                                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                                className="text-xs border rounded px-1 py-0.5"
                            >
                                <option value="1">Thin (1px)</option>
                                <option value="3">Normal (3px)</option>
                                <option value="5">Medium (5px)</option>
                                <option value="8">Thick (8px)</option>
                                <option value="12">Very Thick (12px)</option>
                                <option value="20">Huge (20px)</option>
                            </select>
                        </div>
                    )}
                    
                    {/* Eraser Size Control */}
                    {isEraser && (
                        <div className="flex items-center gap-1">
                            <span className="text-xs">Eraser:</span>
                            <select 
                                value={eraserSize} 
                                onChange={(e) => setEraserSize(parseInt(e.target.value))}
                                className="text-xs border rounded px-1 py-0.5"
                            >
                                <option value="5">Small (5px)</option>
                                <option value="10">Medium (10px)</option>
                                <option value="15">Large (15px)</option>
                                <option value="25">Huge (25px)</option>
                                <option value="40">Massive (40px)</option>
                            </select>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Canvas */}
            <div className="w-full px-1">
                <canvas
                    ref={canvasRef}
                    className={`border-2 border-gray-300 rounded-lg bg-white touch-none w-full ${
                        isEraser ? 'cursor-crosshair' : 'cursor-crosshair'
                    }`}
                    style={{ touchAction: 'none' }}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    onTouchCancel={stopDrawing}
                />
            </div>
            
            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2">
                <button
                    onClick={clearCanvas}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-2 rounded-lg transition-colors duration-200 text-sm"
                >
                    🗑️ Clear All
                </button>
                <button
                    onClick={() => setShowSaveDialog(true)}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-2 rounded-lg transition-colors duration-200 text-sm"
                >
                    💾 Save
                </button>
                <button
                    onClick={() => setShowLoadDialog(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-2 rounded-lg transition-colors duration-200 text-sm"
                >
                    📁 Load
                </button>
            </div>

            {/* Color Picker Dialog */}
            {showColorPicker && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Choose a Color</h3>
                            <button
                                onClick={cancelColorChoice}
                                className="text-gray-500 hover:text-gray-700 text-xl"
                            >
                                ×
                            </button>
                        </div>
                        
                        {/* Color Preview */}
                        <div className="flex items-center gap-3 mb-4">
                            <div 
                                className="w-12 h-12 rounded-lg border-2 border-gray-300"
                                style={{ backgroundColor: tempColor }}
                            ></div>
                            <div>
                                <div className="text-sm font-medium">Preview</div>
                                <div className="text-xs text-gray-500">{tempColor}</div>
                            </div>
                        </div>
                        
                        {/* Color Input */}
                        <input
                            type="color"
                            value={tempColor}
                            onChange={handleColorChange}
                            className="w-full h-16 rounded border border-gray-300 mb-4 cursor-pointer"
                        />
                        
                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={confirmColorChoice}
                                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"
                            >
                                OK
                            </button>
                            <button
                                onClick={cancelColorChoice}
                                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Save Dialog */}
            {showSaveDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Save Drawing</h3>
                            <button
                                onClick={() => {
                                    setShowSaveDialog(false);
                                    setDrawingName('');
                                }}
                                className="text-gray-500 hover:text-gray-700 text-xl"
                            >
                                ×
                            </button>
                        </div>
                        <input
                            type="text"
                            value={drawingName}
                            onChange={(e) => setDrawingName(e.target.value)}
                            placeholder="Enter drawing name..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
                            autoFocus
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={saveDrawing}
                                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => {
                                    setShowSaveDialog(false);
                                    setDrawingName('');
                                }}
                                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Load Dialog */}
            {showLoadDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-4 max-h-96 overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Load Drawing</h3>
                            <button
                                onClick={() => setShowLoadDialog(false)}
                                className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                            >
                                ×
                            </button>
                        </div>
                        {savedDrawings.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No saved drawings yet!</p>
                        ) : (
                            <div className="space-y-2">
                                {savedDrawings.map((drawing) => (
                                    <div key={drawing.id} className="border border-gray-200 rounded-lg p-3">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h4 className="font-medium">{drawing.name}</h4>
                                                <p className="text-xs text-gray-500">{drawing.date}</p>
                                            </div>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => loadDrawing(drawing)}
                                                    className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                                                >
                                                    Load
                                                </button>
                                                <button
                                                    onClick={() => deleteDrawing(drawing.id)}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>
                                        <img 
                                            src={drawing.data} 
                                            alt={drawing.name}
                                            className="w-full h-16 object-cover mt-2 rounded border cursor-pointer"
                                            onClick={() => loadDrawing(drawing)}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                        <button
                            onClick={() => setShowLoadDialog(false)}
                            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg mt-4"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};