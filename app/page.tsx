"use client"

import { useState, useRef, useEffect } from 'react';

// Define terrain types with rare resources
type TerrainType = 'tree' | 'volcano' | 'water' | 'sand' | 'mountain' | 'grass';

interface Terrain {
  name: string;
  color: string;
  count: number;
  resource: string;
  rareResource: string;
  collected: number;
  rareCollected: number;
  maxCollection: number;
}

interface Inventory {
  Wood: number;
  Obsidian: number;
  Fish: number;
  Glass: number;
  Stone: number;
  Wheat: number;
  Pearl: number;
  Diamond: number;
  Gold: number;
  Copper: number;
  Gem: number;
  Honey: number;
}

interface PixelCooldown {
  x: number;
  y: number;
  cooldownUntil: number;
}

const TERRAIN_TYPES: Record<TerrainType, Terrain> = {
  tree: { 
    name: 'Forest', 
    color: '#00AA00', 
    count: 0, 
    resource: 'Wood', 
    rareResource: 'Honey',
    collected: 0, 
    rareCollected: 0,
    maxCollection: 0 
  },
  volcano: { 
    name: 'Volcano', 
    color: '#FF3300', 
    count: 0, 
    resource: 'Obsidian', 
    rareResource: 'Diamond',
    collected: 0, 
    rareCollected: 0,
    maxCollection: 0 
  },
  water: { 
    name: 'Water', 
    color: '#0066FF', 
    count: 0, 
    resource: 'Fish', 
    rareResource: 'Pearl',
    collected: 0, 
    rareCollected: 0,
    maxCollection: 0 
  },
  sand: { 
    name: 'Sand', 
    color: '#FFEE44', 
    count: 0, 
    resource: 'Glass', 
    rareResource: 'Gold',
    collected: 0, 
    rareCollected: 0,
    maxCollection: 0 
  },
  mountain: { 
    name: 'Mountain', 
    color: '#888888', 
    count: 0, 
    resource: 'Stone', 
    rareResource: 'Gem',
    collected: 0, 
    rareCollected: 0,
    maxCollection: 0 
  },
  grass: { 
    name: 'Grass', 
    color: '#88FF88', 
    count: 0, 
    resource: 'Wheat', 
    rareResource: 'Copper',
    collected: 0, 
    rareCollected: 0,
    maxCollection: 0 
  },
};

const INITIAL_INVENTORY: Inventory = {
  Wood: 0,
  Obsidian: 0,
  Fish: 0,
  Glass: 0,
  Stone: 0,
  Wheat: 0,
  Pearl: 0,
  Diamond: 0,
  Gold: 0,
  Copper: 0,
  Gem: 0,
  Honey: 0
};

// Improved cellular automata function for terrain generation
const generateTerrain = (grid: TerrainType[][], targetTerrain: TerrainType, iterations: number, threshold: number): TerrainType[][] => {
  const newGrid = JSON.parse(JSON.stringify(grid));
  const height = grid.length;
  const width = grid[0].length;

  for (let iter = 0; iter < iterations; iter++) {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // Skip if already the target terrain
        if (newGrid[y][x] === targetTerrain) continue;
        
        let count = 0;
        
        // Count neighbors of the target terrain type
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            
            const ny = y + dy;
            const nx = x + dx;
            
            if (ny >= 0 && ny < height && nx >= 0 && nx < width && grid[ny][nx] === targetTerrain) {
              count++;
            }
          }
        }
        
        // Convert to target terrain if enough neighbors
        if (count >= threshold) {
          newGrid[y][x] = targetTerrain;
        }
      }
    }
    
    // Update the grid for the next iteration
    grid = JSON.parse(JSON.stringify(newGrid));
  }
  
  return newGrid;
};

// Function to create initial seeds for terrain
const createSeeds = (grid: TerrainType[][], terrain: TerrainType, count: number): TerrainType[][] => {
  const newGrid = JSON.parse(JSON.stringify(grid));
  const height = grid.length;
  const width = grid[0].length;
  
  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    newGrid[y][x] = terrain;
  }
  
  return newGrid;
};

// Special function to create rivers with more control
const createRivers = (grid: TerrainType[][]): TerrainType[][] => {
  const newGrid = JSON.parse(JSON.stringify(grid));
  const height = grid.length;
  const width = grid[0].length;
  
  // Create 1-2 rivers (reduced from 1-3)
  const riverCount = Math.floor(Math.random() * 2) + 1;
  
  for (let i = 0; i < riverCount; i++) {
    // Start from a random point on the top or left edge
    const fromTop = Math.random() > 0.5;
    let x = 0, y = 0;
    
    if (fromTop) {
      x = Math.floor(Math.random() * width);
      y = 0;
    } else {
      x = 0;
      y = Math.floor(Math.random() * height);
    }
    
    // Flow to the opposite edge
    const targetX = fromTop ? Math.floor(Math.random() * width) : width - 1;
    const targetY = fromTop ? height - 1 : Math.floor(Math.random() * height);
    
    // Create a winding path to the target
    let currentX = x;
    let currentY = y;
    
    while (currentX !== targetX || currentY !== targetY) {
      // Mark current position as water
      if (currentX >= 0 && currentX < width && currentY >= 0 && currentY < height) {
        newGrid[currentY][currentX] = 'water';
        
        // Also mark adjacent cells with lower probability (reduced from 0.7 to 0.5)
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (Math.random() > 0.5) {
              const nx = currentX + dx;
              const ny = currentY + dy;
              if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                newGrid[ny][nx] = 'water';
              }
            }
          }
        }
      }
      
      // Move toward target with some randomness
      if (currentX < targetX) currentX++;
      else if (currentX > targetX) currentX--;
      
      if (currentY < targetY) currentY++;
      else if (currentY > targetY) currentY--;
      
      // Add some randomness to the path (reduced from 0.6 to 0.7)
      if (Math.random() > 0.7) {
        currentX += Math.floor(Math.random() * 3) - 1;
        currentY += Math.floor(Math.random() * 3) - 1;
        
        // Clamp to grid boundaries
        currentX = Math.max(0, Math.min(width - 1, currentX));
        currentY = Math.max(0, Math.min(height - 1, currentY));
      }
    }
  }
  
  return newGrid;
};

export default function PixelMapGame() {
  const [pixels, setPixels] = useState<TerrainType[][]>([]);
  const [terrainCounts, setTerrainCounts] = useState<Record<TerrainType, Terrain>>({
    tree: { ...TERRAIN_TYPES.tree, count: 0, collected: 0, maxCollection: 0 },
    volcano: { ...TERRAIN_TYPES.volcano, count: 0, collected: 0, maxCollection: 0 },
    water: { ...TERRAIN_TYPES.water, count: 0, collected: 0, maxCollection: 0 },
    sand: { ...TERRAIN_TYPES.sand, count: 0, collected: 0, maxCollection: 0 },
    mountain: { ...TERRAIN_TYPES.mountain, count: 0, collected: 0, maxCollection: 0 },
    grass: { ...TERRAIN_TYPES.grass, count: 0, collected: 0, maxCollection: 0 }
  });
  const [inventory, setInventory] = useState<Inventory>(INITIAL_INVENTORY);
  const [pixelCooldowns, setPixelCooldowns] = useState<PixelCooldown[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hoveredPixel, setHoveredPixel] = useState<{x: number, y: number} | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load inventory from localStorage on component mount
  useEffect(() => {
    const savedInventory = localStorage.getItem('pixelMapInventory');
    if (savedInventory) {
      try {
        const parsedInventory = JSON.parse(savedInventory);
        
        // Ensure all inventory fields exist, including rare resources
        const completeInventory: Inventory = {
          ...INITIAL_INVENTORY, // Start with default values
          ...parsedInventory,   // Override with saved values
        };
        
        setInventory(completeInventory);
      } catch (e) {
        console.error('Failed to parse saved inventory:', e);
        // If parsing fails, use initial inventory
        setInventory(INITIAL_INVENTORY);
      }
    }
  }, []);

  // Save inventory to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('pixelMapInventory', JSON.stringify(inventory));
  }, [inventory]);

  // Initialize the pixel grid
  useEffect(() => {
    generateMap();
  }, []);

  // Check for cooldown completion
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const updatedCooldowns = pixelCooldowns.filter(cooldown => cooldown.cooldownUntil > now);
      
      if (updatedCooldowns.length !== pixelCooldowns.length) {
        setPixelCooldowns(updatedCooldowns);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [pixelCooldowns]);

  // Draw the canvas and update counts
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pixelSize = Math.min(
      Math.floor(canvas.width / 32),
      Math.floor(canvas.height / 32)
    );

    const offsetX = (canvas.width - pixelSize * 32) / 2;
    const offsetY = (canvas.height - pixelSize * 32) / 2;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Count terrain types
    const counts = { ...terrainCounts };
    for (const key in counts) {
      counts[key as TerrainType] = { ...counts[key as TerrainType], count: 0 };
    }

    // Draw each pixel and count
    pixels.forEach((row, y) => {
      row.forEach((pixel, x) => {
        ctx.fillStyle = TERRAIN_TYPES[pixel].color;
        ctx.fillRect(
          offsetX + x * pixelSize,
          offsetY + y * pixelSize,
          pixelSize,
          pixelSize
        );
        
        // Count this pixel
        counts[pixel].count++;
        
        // Draw grid lines
        ctx.strokeStyle = '#CCCCCC';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(
          offsetX + x * pixelSize,
          offsetY + y * pixelSize,
          pixelSize,
          pixelSize
        );
      });
    });

    // Draw hover highlight
    if (hoveredPixel) {
      const { x, y } = hoveredPixel;
      const terrainType = pixels[y][x];
      const isOnCooldown = pixelCooldowns.some(cooldown => 
        cooldown.x === x && cooldown.y === y && cooldown.cooldownUntil > Date.now()
      );
      
      ctx.strokeStyle = isOnCooldown ? '#FF0000' : '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.strokeRect(
        offsetX + x * pixelSize,
        offsetY + y * pixelSize,
        pixelSize,
        pixelSize
      );
      
      // Draw crosshair
      const centerX = offsetX + x * pixelSize + pixelSize / 2;
      const centerY = offsetY + y * pixelSize + pixelSize / 2;
      const crosshairSize = pixelSize * 0.7;
      
      ctx.strokeStyle = isOnCooldown ? '#FF0000' : '#FFFFFF';
      ctx.lineWidth = 1.5;
      
      // Horizontal line
      ctx.beginPath();
      ctx.moveTo(centerX - crosshairSize / 2, centerY);
      ctx.lineTo(centerX + crosshairSize / 2, centerY);
      ctx.stroke();
      
      // Vertical line
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - crosshairSize / 2);
      ctx.lineTo(centerX, centerY + crosshairSize / 2);
      ctx.stroke();
      
      // Outer circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, crosshairSize / 2, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Update max collection values based on pixel counts
    for (const key in counts) {
      const terrainType = key as TerrainType;
      counts[terrainType].maxCollection = counts[terrainType].count;
    }
    
    setTerrainCounts(counts);
  }, [pixels, hoveredPixel, pixelCooldowns]);

  // Handle mouse movement on canvas
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    
    // Calculate the scaling factor
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    // Adjust mouse coordinates for canvas scaling
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const pixelSize = Math.min(
      Math.floor(canvas.width / 32),
      Math.floor(canvas.height / 32)
    );

    const offsetX = (canvas.width - pixelSize * 32) / 2;
    const offsetY = (canvas.height - pixelSize * 32) / 2;

    // Calculate which pixel is being hovered
    const pixelX = Math.floor((x - offsetX) / pixelSize);
    const pixelY = Math.floor((y - offsetY) / pixelSize);

    // Check if hover is within the grid
    if (pixelX >= 0 && pixelX < 32 && pixelY >= 0 && pixelY < 32) {
      setHoveredPixel({ x: pixelX, y: pixelY });
    } else {
      setHoveredPixel(null);
    }
  };

  // Handle mouse leaving canvas
  const handleCanvasMouseLeave = () => {
    setHoveredPixel(null);
  };

  // Handle click on canvas to collect resources
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    
    // Calculate the scaling factor
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    // Adjust mouse coordinates for canvas scaling
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const pixelSize = Math.min(
      Math.floor(canvas.width / 32),
      Math.floor(canvas.height / 32)
    );

    const offsetX = (canvas.width - pixelSize * 32) / 2;
    const offsetY = (canvas.height - pixelSize * 32) / 2;

    // Calculate which pixel was clicked
    const pixelX = Math.floor((x - offsetX) / pixelSize);
    const pixelY = Math.floor((y - offsetY) / pixelSize);

    // Check if click was within the grid
    if (pixelX >= 0 && pixelX < 32 && pixelY >= 0 && pixelY < 32) {
      const terrainType = pixels[pixelY][pixelX];
      const terrainData = terrainCounts[terrainType];
      
      // Check if pixel is on cooldown
      const isOnCooldown = pixelCooldowns.some(cooldown => 
        cooldown.x === pixelX && cooldown.y === pixelY && cooldown.cooldownUntil > Date.now()
      );
      
      if (isOnCooldown) {
        return; // Do nothing if on cooldown
      }
      
      // Start cooldown for this specific pixel (5 minutes = 300,000 milliseconds)
      const cooldownUntil = Date.now() + 300000;
      
      setPixelCooldowns(prev => [
        ...prev.filter(cooldown => !(cooldown.x === pixelX && cooldown.y === pixelY)),
        { x: pixelX, y: pixelY, cooldownUntil }
      ]);
      
      // Determine if we get a rare resource (5/100 chance)
      const isRare = Math.random() < 0.05;
      const resourceType = isRare 
        ? TERRAIN_TYPES[terrainType].rareResource as keyof Inventory
        : TERRAIN_TYPES[terrainType].resource as keyof Inventory;
      
      // Update collected count for this terrain type and add to persistent inventory
      setTerrainCounts(prev => ({
        ...prev,
        [terrainType]: {
          ...prev[terrainType],
          collected: isRare ? prev[terrainType].collected : prev[terrainType].collected + 1,
          rareCollected: isRare ? prev[terrainType].rareCollected + 1 : prev[terrainType].rareCollected
        }
      }));
      
      // Update persistent inventory
      setInventory(prev => ({
        ...prev,
        [resourceType]: prev[resourceType] + 1
      }));
    }
  };

  // Generate a new map with balanced terrain features
  const generateMap = () => {
    setIsGenerating(true);
    
    // Create a 32x32 grid with all grass
    let newPixels = Array(32)
      .fill(null)
      .map(() => Array(32).fill('grass'));
    
    // Add seeds for different terrain types with better balance
    newPixels = createSeeds(newPixels, 'water', 3);
    newPixels = createSeeds(newPixels, 'mountain', 8);
    newPixels = createSeeds(newPixels, 'tree', 12);
    newPixels = createSeeds(newPixels, 'volcano', 4);
    newPixels = createSeeds(newPixels, 'sand', 6);
    
    // Apply cellular automata to create grouped terrain
    
    // Create rivers (less aggressive)
    newPixels = createRivers(newPixels);
    
    // Expand water with higher threshold to limit expansion
    newPixels = generateTerrain(newPixels, 'water', 3, 2);
    
    // Mountains should form chains
    newPixels = generateTerrain(newPixels, 'mountain', 5, 3);
    
    // Trees should form forests
    newPixels = generateTerrain(newPixels, 'tree', 4, 2);
    
    // Volcano should form smaller areas
    newPixels = generateTerrain(newPixels, 'volcano', 3, 2);
    
    // Sand should form beaches near water
    const height = newPixels.length;
    const width = newPixels[0].length;
    const waterAdjacent = Array(height).fill(null).map(() => Array(width).fill(false));
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (newPixels[y][x] === 'water') {
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const ny = y + dy;
              const nx = x + dx;
              if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
                waterAdjacent[ny][nx] = true;
              }
            }
          }
        }
      }
    }
    
    // Convert grass to sand near water with higher probability
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (waterAdjacent[y][x] && newPixels[y][x] === 'grass' && Math.random() > 0.3) {
          newPixels[y][x] = 'sand';
        }
      }
    }
    
    // Expand sand a bit
    newPixels = generateTerrain(newPixels, 'sand', 2, 2);
    
    // Reset terrain counts when generating a new map
    setTerrainCounts(prev => {
      const newCounts = { ...prev };
      
      // Reset only the count, maxCollection, collected, and rareCollected for each terrain type
      for (const key in newCounts) {
        const terrainType = key as TerrainType;
        newCounts[terrainType] = {
          ...newCounts[terrainType],
          count: 0,
          maxCollection: 0,
          collected: 0,
          rareCollected: 0
        };
      }
      
      return newCounts;
    });
    
    // Clear all pixel cooldowns when generating a new map
    setPixelCooldowns([]);
    
    setPixels(newPixels);
    
    // Simulate a short delay for visual feedback
    setTimeout(() => setIsGenerating(false), 300);
  };

  const handleExport = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 320;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw each pixel at 10x scale
    pixels.forEach((row, y) => {
      row.forEach((pixel, x) => {
        ctx.fillStyle = TERRAIN_TYPES[pixel].color;
        ctx.fillRect(x * 10, y * 10, 10, 10);
      });
    });

    // Create download link
    const link = document.createElement('a');
    link.download = 'pixel-map-game.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Format time remaining for cooldown
  const formatTimeRemaining = (timestamp: number) => {
    if (timestamp <= Date.now()) return "Ready";
    
    const seconds = Math.ceil((timestamp - Date.now()) / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Reset inventory
  const resetInventory = () => {
    if (confirm('Are you sure you want to reset your inventory? This cannot be undone.')) {
      setInventory(INITIAL_INVENTORY);
    }
  };

  // Check if a specific pixel is on cooldown
  const isPixelOnCooldown = (x: number, y: number) => {
    return pixelCooldowns.some(cooldown => 
      cooldown.x === x && cooldown.y === y && cooldown.cooldownUntil > Date.now()
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">Pixel Map Collector</h1>
        <p className="text-center text-gray-600 mb-6">Click on terrain to collect resources! Each pixel has a 5-minute cooldown.</p>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Canvas and controls */}
          <div className="flex-1">
            <div className="border-2 border-gray-300 rounded-lg p-2 bg-white shadow-inner">
              <canvas
                ref={canvasRef}
                width={512}
                height={512}
                className="w-full h-full cursor-crosshair"
                onClick={handleCanvasClick}
                onMouseMove={handleCanvasMouseMove}
                onMouseLeave={handleCanvasMouseLeave}
              />
            </div>
            
            <div className="flex justify-center mt-4 gap-4">
              <button
                onClick={generateMap}
                disabled={isGenerating}
                className={`px-6 py-3 rounded-lg font-semibold flex items-center ${
                  isGenerating 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white transition-colors`}
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    Generate New Map
                  </>
                )}
              </button>
              <button
                onClick={handleExport}
                className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                Export PNG
              </button>
            </div>
          </div>
          
          <div className="w-full md:w-80">           
          
            <div className="mb-6 max-h-120 overflow-y-auto">
              <h2 className="text-lg font-semibold text-green-800 mb-2">Current Map Resources</h2>

              {/* Outer card container */}
              <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                {Object.entries(TERRAIN_TYPES).map(([key, terrain], idx) => {
                  const terrainData = terrainCounts[key as TerrainType];

                  return (
                    <div
                      key={key}
                      className={`flex items-center justify-between p-2 ${
                        idx !== Object.keys(TERRAIN_TYPES).length - 1 ? "border-b border-gray-200" : ""
                      }`}
                    >
                      <div className="flex items-center">
                        <div
                          className="w-5 h-5 mr-3 rounded-sm border border-gray-300"
                          style={{ backgroundColor: terrain.color }}
                        />
                        <div>
                          <div className="text-gray-700 font-medium">{terrain.name}</div>
                          <div className="text-xs text-gray-500">
                            Collects: {terrain.resource} / {terrain.rareResource}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-mono px-2 py-1 rounded text-xs bg-gray-100 text-gray-700 mb-1">
                          {terrainData.collected}/{terrainData.maxCollection}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mt-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-blue-800">Inventory</h2>
            <button 
              onClick={resetInventory}
              className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
            >
              Reset
            </button>
          </div>
          <div className="space-y-2">
            {Object.entries(inventory).map(([resource, count]) => (
              <div key={resource} className="flex justify-between items-center">
                <span className="text-blue-700">{resource}:</span>
                <span className="font-bold text-blue-900">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}