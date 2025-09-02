"use client"

import { useState, useRef, useEffect } from 'react';

type TerrainType = 'tree' | 'volcano' | 'water' | 'sand' | 'mountain' | 'grass' | 'cave' | 'swamp';

interface Terrain {
  name: string;
  color: string;
  count: number;
  resource: string;
  rareResource: string;
  epicResource: string;
  collected: number;
  rareCollected: number;
  epicCollected: number;
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
  Resin: number;
  Ruby: number;
  Coral: number;
  Silver: number;
  Iron: number;
  Emerald: number;
  Coal: number;
  Herbs: number;
  Crystal: number;
  Moss: number;
  Mushrooms: number;
  Frogs: number;
  Pickaxe: number;
  Potion: number;
  Axe: number;
  FishingRod: number;
  Torch: number;
  Planks: number;
  StoneBricks: number;
  CopperIngot: number;
  IronIngot: number;
  GoldIngot: number;
  SilverIngot: number;
  ObsidianShard: number;
  PolishedDiamond: number;
  PolishedRuby: number;
  PolishedEmerald: number;
  CrystalShard: number;
  GemCluster: number;
  Bread: number;
  CookedFish: number;
  Stew: number;
  HealingSyrup: number;
  HoneyCake: number;
  FrogLegs: number;
  HealingPotion: number;
  ManaPotion: number;
  StaminaPotion: number;
  WaterBreathingPotion: number;
  InvisibilityPotion: number;
  FireResistancePotion: number;
  JumpBoostPotion: number;
  DiamondRing: number;
  PearlNecklace: number;
  RubyPendant: number;
  EmeraldEarring: number;
  CoralCirclet: number;
  IronSword: number;
  GoldDagger: number;
  DiamondPickaxe: number;
  ObsidianBlade: number;
  CrystalWand: number;
  OceanAmulet: number;
  ForestTalisman: number;
  VolcanicGauntlet: number;
  RoyalScepter: number;
  ArtisanLens: number;
  CraftingTable: number;
  StoneFurnace: number;
  ReinforcedWindow: number;
  WoodenChest: number;
  MetalChest: number;
  Bow: number;
  Arrow: number;
  Waterskin: number;
  EnchantedScroll: number;
  Spyglass: number;
}

interface PixelCooldown {
  x: number;
  y: number;
  cooldownUntil: number;
}

interface Recipe {
  inputs: Partial<Inventory>; // required resources
  output: keyof Inventory;    // crafted item
  amount: number;             // how many produced
}

// Define item values for selling
const ITEM_VALUES: Partial<Record<keyof Inventory, number>> = {
  // Basic Resources
  Wood: 1,
  Stone: 2,
  Copper: 3,
  Iron: 5,
  Silver: 8,
  Gold: 12,
  Coal: 2,
  Glass: 3,
  Obsidian: 6,
  Fish: 4,
  Wheat: 2,
  Herbs: 3,
  Honey: 5,
  Resin: 4,
  Moss: 2,
  Mushrooms: 3,
  Frogs: 4,
  Pearl: 15,
  Diamond: 25,
  Ruby: 20,
  Emerald: 18,
  Coral: 12,
  Gem: 10,
  Crystal: 8,
  Planks: 3,
  StoneBricks: 5,
  CopperIngot: 10,
  IronIngot: 15,
  GoldIngot: 25,
  SilverIngot: 20,
  ObsidianShard: 15,
  PolishedDiamond: 40,
  PolishedRuby: 35,
  PolishedEmerald: 30,
  CrystalShard: 12,
  GemCluster: 25,
  Bread: 6,
  CookedFish: 10,
  Stew: 12,
  HealingSyrup: 15,
  HoneyCake: 18,
  FrogLegs: 12,
  HealingPotion: 20,
  ManaPotion: 25,
  StaminaPotion: 22,
  WaterBreathingPotion: 30,
  InvisibilityPotion: 35,
  FireResistancePotion: 28,
  JumpBoostPotion: 25,
  Pickaxe: 15,
  Axe: 12,
  FishingRod: 18,
  Torch: 5,
  IronSword: 30,
  GoldDagger: 35,
  DiamondPickaxe: 60,
  ObsidianBlade: 45,
  CrystalWand: 40,
  Bow: 25,
  Arrow: 2,
  Waterskin: 10,
  Spyglass: 35,
  DiamondRing: 75,
  PearlNecklace: 65,
  RubyPendant: 70,
  EmeraldEarring: 60,
  CoralCirclet: 55,
  OceanAmulet: 100,
  ForestTalisman: 90,
  VolcanicGauntlet: 110,
  RoyalScepter: 150,
  ArtisanLens: 85,
  EnchantedScroll: 95,
  CraftingTable: 25,
  StoneFurnace: 35,
  ReinforcedWindow: 40,
  WoodenChest: 20,
  MetalChest: 45,
};

const CRAFTING_RECIPES: Recipe[] = [
  { inputs: { Wood: 2, Stone: 1 }, output: "Pickaxe", amount: 1 },
  { inputs: { Wood: 1, Stone: 1 }, output: "Axe", amount: 1 },
  { inputs: { Wood: 2, Iron: 1 }, output: "FishingRod", amount: 1 },
  { inputs: { Wood: 3, Resin: 2 }, output: "Torch", amount: 4 },
  { inputs: { Wood: 4 }, output: "Planks", amount: 4 },
  { inputs: { Stone: 2 }, output: "StoneBricks", amount: 1 },
  { inputs: { Copper: 3, Coal: 1 }, output: "CopperIngot", amount: 1 },
  { inputs: { Iron: 3, Coal: 1 }, output: "IronIngot", amount: 1 },
  { inputs: { Gold: 3, Coal: 1 }, output: "GoldIngot", amount: 1 },
  { inputs: { Silver: 3, Coal: 1 }, output: "SilverIngot", amount: 1 },
  { inputs: { Obsidian: 2, Coal: 2 }, output: "ObsidianShard", amount: 1 },
  { inputs: { Diamond: 1 }, output: "PolishedDiamond", amount: 1 },
  { inputs: { Ruby: 1 }, output: "PolishedRuby", amount: 1 },
  { inputs: { Emerald: 1 }, output: "PolishedEmerald", amount: 1 },
  { inputs: { Crystal: 2 }, output: "CrystalShard", amount: 4 },
  { inputs: { Gem: 3 }, output: "GemCluster", amount: 1 },
  { inputs: { Wheat: 3 }, output: "Bread", amount: 1 },
  { inputs: { Fish: 1, Herbs: 1 }, output: "CookedFish", amount: 1 },
  { inputs: { Mushrooms: 2, Herbs: 1 }, output: "Stew", amount: 1 },
  { inputs: { Honey: 2, Herbs: 1 }, output: "HealingSyrup", amount: 1 },
  { inputs: { Wheat: 1, Honey: 1 }, output: "HoneyCake", amount: 2 },
  { inputs: { Frogs: 2, Herbs: 1 }, output: "FrogLegs", amount: 2 },
  { inputs: { Mushrooms: 2, Crystal: 1 }, output: "ManaPotion", amount: 1 },
  { inputs: { Honey: 1, Resin: 1, Herbs: 1 }, output: "StaminaPotion", amount: 1 },
  { inputs: { Coral: 1, Pearl: 1 }, output: "WaterBreathingPotion", amount: 1 },
  { inputs: { Emerald: 1, Moss: 2 }, output: "InvisibilityPotion", amount: 1 },
  { inputs: { Ruby: 1, Coal: 2 }, output: "FireResistancePotion", amount: 1 },
  { inputs: { GoldIngot: 2, Diamond: 1 }, output: "DiamondRing", amount: 1 },
  { inputs: { SilverIngot: 2, Pearl: 1 }, output: "PearlNecklace", amount: 1 },
  { inputs: { GoldIngot: 1, Ruby: 1 }, output: "RubyPendant", amount: 1 },
  { inputs: { SilverIngot: 1, Emerald: 1 }, output: "EmeraldEarring", amount: 2 },
  { inputs: { IronIngot: 2, Wood: 2 }, output: "IronSword", amount: 1 },
  { inputs: { GoldIngot: 2, Wood: 1 }, output: "GoldDagger", amount: 1 },
  { inputs: { Diamond: 1, IronIngot: 2 }, output: "DiamondPickaxe", amount: 1 },
  { inputs: { ObsidianShard: 2, IronIngot: 1 }, output: "ObsidianBlade", amount: 1 },
  { inputs: { CrystalShard: 3, SilverIngot: 1 }, output: "CrystalWand", amount: 1 },
  { inputs: { Pearl: 3, Coral: 2, GoldIngot: 1 }, output: "OceanAmulet", amount: 1 },
  { inputs: { Emerald: 2, Moss: 3, Wood: 2 }, output: "ForestTalisman", amount: 1 },
  { inputs: { Ruby: 2, Coal: 3, IronIngot: 2 }, output: "VolcanicGauntlet", amount: 1 },
  { inputs: { Diamond: 3, Crystal: 2, GoldIngot: 3 }, output: "RoyalScepter", amount: 1 },
  { inputs: { GemCluster: 1, SilverIngot: 2, Resin: 2 }, output: "ArtisanLens", amount: 1 },
  { inputs: { Planks: 4 }, output: "CraftingTable", amount: 1 },
  { inputs: { StoneBricks: 8 }, output: "StoneFurnace", amount: 1 },
  { inputs: { IronIngot: 5, Glass: 3 }, output: "ReinforcedWindow", amount: 1 },
  { inputs: { Wood: 3, Resin: 1 }, output: "WoodenChest", amount: 1 },
  { inputs: { IronIngot: 4, GoldIngot: 1 }, output: "MetalChest", amount: 1 },
  { inputs: { Glass: 1, GoldIngot: 1 }, output: "Spyglass", amount: 1 },
  { inputs: { HealingSyrup: 1, Herbs: 2 }, output: "HealingPotion", amount: 1 },
  { inputs: { CrystalShard: 1, Moss: 2 }, output: "JumpBoostPotion", amount: 1 },
  { inputs: { Coral: 3, SilverIngot: 1 }, output: "CoralCirclet", amount: 1 },
  { inputs: { Wood: 3, Resin: 1 }, output: "Bow", amount: 1 },
  { inputs: { Stone: 1, Wood: 1, Resin: 1 }, output: "Arrow", amount: 6 },
  { inputs: { Moss: 2, Resin: 1 }, output: "Waterskin", amount: 1 },
  { inputs: { CrystalShard: 1, Gem: 2 }, output: "EnchantedScroll", amount: 1 },
];

const TERRAIN_TYPES: Record<TerrainType, Terrain> = {
  tree: { 
    name: 'Forest', 
    color: '#00AA00', 
    count: 0, 
    resource: 'Wood', 
    rareResource: 'Honey',
    epicResource: 'Resin',
    collected: 0, 
    rareCollected: 0,
    epicCollected: 0,
    maxCollection: 0 
  },
  volcano: { 
    name: 'Volcano', 
    color: '#FF3300', 
    count: 0, 
    resource: 'Obsidian', 
    rareResource: 'Ruby',
    epicResource: 'Diamond',
    collected: 0, 
    rareCollected: 0,
    epicCollected: 0,
    maxCollection: 0 
  },
  water: { 
    name: 'Water', 
    color: '#0066FF', 
    count: 0, 
    resource: 'Fish', 
    rareResource: 'Pearl',
    epicResource: 'Coral',
    collected: 0, 
    rareCollected: 0,
    epicCollected: 0,
    maxCollection: 0 
  },
  sand: { 
    name: 'Sand', 
    color: '#FFEE44', 
    count: 0, 
    resource: 'Glass', 
    rareResource: 'Silver',
    epicResource: 'Gold',
    collected: 0, 
    rareCollected: 0,
    epicCollected: 0,
    maxCollection: 0 
  },
  mountain: { 
    name: 'Mountain', 
    color: '#888888', 
    count: 0, 
    resource: 'Stone', 
    rareResource: 'Iron',
    epicResource: 'Gem',
    collected: 0, 
    rareCollected: 0,
    epicCollected: 0,
    maxCollection: 0 
  },
  grass: { 
    name: 'Grass', 
    color: '#88FF88', 
    count: 0, 
    resource: 'Wheat', 
    rareResource: 'Herbs',
    epicResource: 'Copper',
    collected: 0, 
    rareCollected: 0,
    epicCollected: 0,
    maxCollection: 0 
  },
  cave: { 
    name: 'Cave', 
    color: '#444444', 
    count: 0, 
    resource: 'Coal', 
    rareResource: 'Emerald',
    epicResource: 'Crystal',
    collected: 0, 
    rareCollected: 0,
    epicCollected: 0,
    maxCollection: 0 
  },
  swamp: { 
    name: 'Swamp', 
    color: '#556B2F', 
    count: 0, 
    resource: 'Moss', 
    rareResource: 'Mushrooms',
    epicResource: 'Frogs',
    collected: 0, 
    rareCollected: 0,
    epicCollected: 0,
    maxCollection: 0 
  },
};

const INITIAL_INVENTORY: Inventory = {
  Wood: 0,
  Honey: 0,
  Resin: 0,
  Obsidian: 0,
  Ruby: 0,
  Diamond: 0,
  Fish: 0,
  Pearl: 0,
  Coral: 0,
  Glass: 0,
  Silver: 0,
  Gold: 0,
  Stone: 0,
  Iron: 0,
  Gem: 0,
  Wheat: 0,
  Herbs: 0,
  Copper: 0,
  Coal: 0,
  Emerald: 0,
  Crystal: 0,
  Moss: 0,
  Mushrooms: 0,
  Frogs: 0,
  Pickaxe: 0,
  Potion: 0,
  Axe: 0,
  FishingRod: 0,
  Torch: 0,
  Planks: 0,
  StoneBricks: 0,
  CopperIngot: 0,
  IronIngot: 0,
  GoldIngot: 0,
  SilverIngot: 0,
  ObsidianShard: 0,
  PolishedDiamond: 0,
  PolishedRuby: 0,
  PolishedEmerald: 0,
  CrystalShard: 0,
  GemCluster: 0,
  Bread: 0,
  CookedFish: 0,
  Stew: 0,
  HealingSyrup: 0,
  HoneyCake: 0,
  FrogLegs: 0,
  HealingPotion: 0,
  ManaPotion: 0,
  StaminaPotion: 0,
  WaterBreathingPotion: 0,
  InvisibilityPotion: 0,
  FireResistancePotion: 0,
  JumpBoostPotion: 0,
  DiamondRing: 0,
  PearlNecklace: 0,
  RubyPendant: 0,
  EmeraldEarring: 0,
  CoralCirclet: 0,
  IronSword: 0,
  GoldDagger: 0,
  DiamondPickaxe: 0,
  ObsidianBlade: 0,
  CrystalWand: 0,
  OceanAmulet: 0,
  ForestTalisman: 0,
  VolcanicGauntlet: 0,
  RoyalScepter: 0,
  ArtisanLens: 0,
  CraftingTable: 0,
  StoneFurnace: 0,
  ReinforcedWindow: 0,
  WoodenChest: 0,
  MetalChest: 0,
  Bow: 0,
  Arrow: 0,
  Waterskin: 0,
  EnchantedScroll: 0,
  Spyglass: 0
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
    grass: { ...TERRAIN_TYPES.grass, count: 0, collected: 0, maxCollection: 0 },
    cave: { ...TERRAIN_TYPES.cave, count: 0, collected: 0, maxCollection: 0 },
    swamp: { ...TERRAIN_TYPES.swamp, count: 0, collected: 0, maxCollection: 0 }
  });
  const [inventory, setInventory] = useState<Inventory>(INITIAL_INVENTORY);
  const [pixelCooldowns, setPixelCooldowns] = useState<PixelCooldown[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hoveredPixel, setHoveredPixel] = useState<{x: number, y: number} | null>(null);
  const [activeTab, setActiveTab] = useState<"inventory" | "crafting" | "selling">("inventory");
  const [gold, setGold] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load inventory and gold from localStorage on component mount
  useEffect(() => {
    const savedInventory = localStorage.getItem('pixelMapInventory');
    const savedGold = localStorage.getItem('pixelMapGold');
    
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
    
    if (savedGold) {
      try {
        setGold(parseInt(savedGold));
      } catch (e) {
        console.error('Failed to parse saved gold:', e);
        setGold(0);
      }
    }
  }, []);

  // Save inventory and gold to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('pixelMapInventory', JSON.stringify(inventory));
    localStorage.setItem('pixelMapGold', gold.toString());
  }, [inventory, gold]);

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
      
      // Determine which resource to get (common 94%, rare 5%, epic 1%)
      const random = Math.random();
      let resourceType: keyof Inventory;
      let isRare = false;
      let isEpic = false;
      
      if (random < 0.01) { // 1% chance for epic
        resourceType = TERRAIN_TYPES[terrainType].epicResource as keyof Inventory;
        isEpic = true;
      } else if (random < 0.06) { // 5% chance for rare
        resourceType = TERRAIN_TYPES[terrainType].rareResource as keyof Inventory;
        isRare = true;
      } else { // 94% chance for common
        resourceType = TERRAIN_TYPES[terrainType].resource as keyof Inventory;
      }
      
      // Update collected count for this terrain type and add to persistent inventory
      setTerrainCounts(prev => ({
        ...prev,
        [terrainType]: {
          ...prev[terrainType],
          collected: (!isRare && !isEpic) ? prev[terrainType].collected + 1 : prev[terrainType].collected,
          rareCollected: isRare ? prev[terrainType].rareCollected + 1 : prev[terrainType].rareCollected,
          epicCollected: isEpic ? prev[terrainType].epicCollected + 1 : prev[terrainType].epicCollected
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
      newPixels = createSeeds(newPixels, 'cave', 5);
      newPixels = createSeeds(newPixels, 'swamp', 7);
    
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
    
    // Caves should form near mountains
    newPixels = generateTerrain(newPixels, 'cave', 3, 2);
    
    // Swamps should form near water
    newPixels = generateTerrain(newPixels, 'swamp', 3, 2);
    
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
      setGold(0);
    }
  };

  // Check if a specific pixel is on cooldown
  const isPixelOnCooldown = (x: number, y: number) => {
    return pixelCooldowns.some(cooldown => 
      cooldown.x === x && cooldown.y === y && cooldown.cooldownUntil > Date.now()
    );
  };

  function craftItem(
    recipe: Recipe,
    inventory: Inventory,
    setInventory: (inv: Inventory) => void
  ) {
    // Check requirements
    for (const [resource, required] of Object.entries(recipe.inputs)) {
      if ((inventory[resource as keyof Inventory] || 0) < required) {
        alert(`Not enough ${resource} to craft ${recipe.output}`);
        return;
      }
    }

    // Deduct resources
    const newInventory = { ...inventory };
    for (const [resource, required] of Object.entries(recipe.inputs)) {
      newInventory[resource as keyof Inventory] -= required;
    }

    // Add crafted item
    newInventory[recipe.output] =
      (newInventory[recipe.output] || 0) + recipe.amount;

    setInventory(newInventory);
  }

  // Sell items for gold
  const sellItem = (item: keyof Inventory, amount: number) => {
    const value = ITEM_VALUES[item] || 0;
    
    if (value === 0) {
      alert("This item cannot be sold.");
      return;
    }
    
    if (inventory[item] < amount) {
      alert(`You don't have enough ${item} to sell.`);
      return;
    }
    
    const totalValue = value * amount;
    
    setInventory(prev => ({
      ...prev,
      [item]: prev[item] - amount
    }));
    
    setGold(prev => prev + totalValue);
    
    alert(`Sold ${amount}x ${item} for ${totalValue} gold!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto bg-gradient-to-b from-blue-800 to-blue-900 rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 border-2 border-blue-700">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-yellow-300 to-yellow-400 bg-clip-text text-transparent mb-2">
            Pixel Harvester
          </h1>
          <p className="text-blue-200 text-sm sm:text-base mb-1">Click on terrain to collect resources!</p>
          <p className="text-blue-200 text-sm sm:text-base mb-4 md:mb-6">Each pixel has a 5-minute cooldown.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Canvas and controls */}
          <div className="flex-1">
            <div className="border-4 border-blue-600 rounded-xl p-2 sm:p-3 bg-blue-900/50 shadow-inner">
              <canvas
                ref={canvasRef}
                width={512}
                height={512}
                className="w-full h-auto cursor-crosshair rounded-lg"
                onClick={handleCanvasClick}
                onMouseMove={handleCanvasMouseMove}
                onMouseLeave={handleCanvasMouseLeave}
              />
            </div>
        
            <div className="flex flex-col sm:flex-row justify-center mt-4 sm:mt-6 gap-3 sm:gap-4">
              <button
                onClick={generateMap}
                disabled={isGenerating}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold flex items-center justify-center transition-all ${
                  isGenerating 
                    ? 'bg-blue-700 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-md hover:shadow-lg'
                } text-white text-sm sm:text-base`}
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    Generate Map
                  </>
                )}
              </button>
              <button
                onClick={handleExport}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-semibold hover:from-green-500 hover:to-green-400 transition-all shadow-md hover:shadow-lg flex items-center justify-center text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                Export PNG
              </button>
            </div>
          </div>
          
          {/* Terrain Information */}
          <div className="w-full lg:w-80">           
            <div className="mb-6 max-h-150 overflow-y-auto">
              <h2 className="text-center text-blue-100 mt-2 mb-3 font-bold text-lg flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Available Resources
              </h2>

              {/* Outer card container */}
              <div className="rounded-xl border border-blue-600 bg-blue-800/40 backdrop-blur-sm shadow-md p-2">
                {Object.entries(TERRAIN_TYPES).map(([key, terrain], idx) => {
                  const terrainData = terrainCounts[key as TerrainType];

                  return (
                    <div
                      key={key}
                      className={`flex items-center justify-between p-2 sm:p-3 rounded-lg transition-all hover:bg-blue-700/50 ${
                        idx !== Object.keys(TERRAIN_TYPES).length - 1 ? "mb-2" : ""
                      }`}
                    >
                      <div className="flex items-center">
                        <div
                          className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 rounded-md border-2 border-blue-400 shadow-sm"
                          style={{ backgroundColor: terrain.color }}
                        />
                        <div className="max-w-[120px] sm:max-w-none">
                          <div className="text-blue-100 font-medium text-sm sm:text-base">{terrain.name}</div>
                          <div className="text-xs text-blue-300 hidden xs:block">
                            ({terrain.resource} / {terrain.rareResource} / {terrain.epicResource})
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-mono px-2 py-1 rounded-md text-xs bg-blue-900/70 text-blue-100 mb-1 shadow-inner">
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

        <div className="bg-gradient-to-b from-blue-900 to-indigo-900 p-4 sm:p-6 rounded-xl border-2 border-blue-700 shadow-2xl mt-6 mb-6">
          {/* Tab buttons with modern styling */}
          <div className="flex space-x-2 sm:space-x-3 mb-4 sm:mb-6 p-1 bg-blue-800/30 rounded-lg">
            {(["inventory", "crafting", "selling"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 sm:px-5 py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 flex-1 ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "bg-blue-900/50 text-blue-200 hover:bg-blue-800/70"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Gold display with coin icon */}
          <div className="mb-4 sm:mb-6 p-2 sm:p-3 bg-gradient-to-r from-yellow-600 to-yellow-500 border-2 border-yellow-400 rounded-lg text-center shadow-md flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-bold text-yellow-100 text-base sm:text-lg">Gold: {gold}</span>
          </div>

          {/* Inventory tab */}
          {activeTab === "inventory" && (
            <>
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-blue-100 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Inventory
                </h2>
                <button
                  onClick={resetInventory}
                  className="text-xs sm:text-sm bg-red-600 hover:bg-red-700 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-md flex items-center gap-1 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset
                </button>
              </div>
              <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
                {Object.entries(inventory)
                  .filter(([_, count]) => count > 0)
                  .map(([resource, count]) => (
                    <div
                      key={resource}
                      className="bg-blue-800/40 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-blue-600/30 hover:border-blue-500 transition-all hover:scale-105 flex flex-col items-center justify-center shadow-md"
                    >
                      <span className="text-blue-200 text-xs sm:text-sm truncate w-full text-center">{resource}</span>
                      <span className="font-bold text-white mt-1 text-sm sm:text-base">{count}</span>
                    </div>
                  ))}
              </div>
            </>
          )}

          {/* Crafting tab */}
          {activeTab === "crafting" && (
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-blue-100 mb-3 sm:mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                Crafting
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {CRAFTING_RECIPES.filter(recipe => {
                  return Object.entries(recipe.inputs).every(
                    ([resource, required]) => 
                      (inventory[resource as keyof Inventory] || 0) >= required
                  );
                }).map((recipe, idx) => (
                  <div
                    key={idx}
                    className="bg-blue-800/40 backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-blue-600/30 hover:border-blue-500 transition-all shadow-md"
                  >
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-100 font-medium text-sm sm:text-base">{recipe.output}</span>
                      </div>
                      <span className="bg-blue-700 text-blue-100 text-xs px-2 py-1 rounded-full">
                        x{recipe.amount}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-between text-xs sm:text-sm mb-3 sm:mb-4 gap-1">
                      <div className="text-blue-300 flex flex-wrap items-center gap-1">
                        {Object.entries(recipe.inputs).map(([res, qty]) => (
                          <span key={res} className="bg-blue-900/70 px-2 py-1 rounded-md whitespace-nowrap">
                            {res} ×{qty}
                          </span>
                        ))}
                      </div>
                      <span className="text-blue-200 hidden sm:inline">→</span>
                    </div>
                    
                    <button
                      onClick={() => craftItem(recipe, inventory, setInventory)}
                      className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white py-2 rounded-md text-xs sm:text-sm font-medium transition-all shadow-md hover:shadow-lg"
                    >
                      Craft
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selling tab */}
          {activeTab === "selling" && (
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-blue-100 mb-3 sm:mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Sell Items
              </h2>
              <div className="grid grid-cols-1 gap-2 sm:gap-3">
                {Object.entries(inventory)
                  .filter(([item, count]) => count > 0 && ITEM_VALUES[item as keyof Inventory] !== undefined)
                  .map(([item, count]) => {
                    const value = ITEM_VALUES[item as keyof Inventory] || 0;
                    
                    return (
                      <div
                        key={item}
                        className="bg-blue-800/40 backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-blue-600/30 hover:border-blue-500 transition-all flex flex-col sm:flex-row items-center justify-between shadow-md gap-2"
                      >
                        {/* Left side: Item info */}
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="font-bold text-white text-sm sm:text-base truncate">{item}</span>
                            <div className="flex justify-between text-xs sm:text-sm">
                              <span className="text-blue-200">Stock: {count}</span>
                              <span className="text-yellow-300">Value: {value} gold</span>
                            </div>
                          </div>
                        </div>

                        {/* Right side: Buttons */}
                        <div className="flex flex-row sm:flex-col md:flex-row gap-1 sm:gap-2 w-full sm:w-auto justify-end">
                          <button
                            onClick={() => sellItem(item as keyof Inventory, 1)}
                            className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 sm:px-3 sm:py-2 rounded-md transition-colors shadow-sm flex-1 sm:flex-none"
                          >
                            Sell 1
                          </button>
                          <button
                            onClick={() => sellItem(item as keyof Inventory, 5)}
                            className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 sm:px-3 sm:py-2 rounded-md transition-colors shadow-sm flex-1 sm:flex-none"
                          >
                            Sell 5
                          </button>
                          <button
                            onClick={() => sellItem(item as keyof Inventory, count)}
                            className="text-xs bg-amber-600 hover:bg-amber-500 text-white px-2 py-1 sm:px-3 sm:py-2 rounded-md transition-colors shadow-sm flex-1 sm:flex-none"
                          >
                            Sell All
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}