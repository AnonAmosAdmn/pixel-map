"use client"

import { useState, useRef, useEffect } from 'react';
import { useToast } from '../components/Toast';
type TerrainType =
| "tree"
| "volcano"
| "water"
| "sand"
| "mountain"
| "grass"
| "cave"
| "swamp";

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

interface SavedMapState {
  pixels: TerrainType[][];
  terrainCounts: Record<TerrainType, Terrain>;
  pixelCooldowns: PixelCooldown[];
  lastGenerated: number; // timestamp to prevent cheating by refreshing
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
  FishSandwich: number;
  MushroomSoup: number;
  FrogBites: number;
  StickyPotion: number;
  SweetPotion: number;
  SwampPotion: number;
  GemBrooch: number;
  PearlBracelet: number;
  CoralRing: number;
  EmeraldNecklace: number;
  CopperSword: number;
  SilverDagger: number;
  RubySword: number;
  EmeraldAxe: number;
  GemKnife: number;
  StickyGlue: number;
  OceanCharm: number;
  SwampCharm: number;
  VolcanicCharm: number;
  CrystalCharm: number;
  GlassTable: number;
  WoodenChair: number;
  StoneStool: number;
  MetalLantern: number;
  GemmedCandle: number;
  CrystalVase: number;
  CoralDisplay: number;
  PearlFrame: number;
  EmeraldCarving: number;
  RubySculpture: number;
  DiamondPrism: number;
  ObsidianPickaxe: number;
  FlamingSword: number;
  NatureWand: number;
  OceanDagger: number;
  CrystalBow: number;
  CoralFishingRod: number;
  EternalTorch: number;
  Spellbook: number;
  CrystalBall: number;
  NatureAmulet: number;
  FireAmulet: number;
  WaterAmulet: number;
  LightAmulet: number;
  HerbalTea: number;
  SwampStew: number;
  Sushi: number;
  HoneyBread: number;
  MagicJam: number;
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
  Bow: 25,
  Arrow: 2,
  Waterskin: 10,
  Spyglass: 35,
  FishSandwich: 8,
  MushroomSoup: 7,
  FrogBites: 6,
  StickyPotion: 18,
  SweetPotion: 15,
  SwampPotion: 20,
  GemBrooch: 45,
  PearlBracelet: 40,
  CoralRing: 35,
  EmeraldNecklace: 50,
  CopperSword: 20,
  SilverDagger: 25,
  RubySword: 45,
  EmeraldAxe: 40,
  GemKnife: 30,
  StickyGlue: 5,
  OceanCharm: 25,
  SwampCharm: 22,
  VolcanicCharm: 28,
  CrystalCharm: 30,
  GlassTable: 35,
  WoodenChair: 15,
  StoneStool: 12,
  MetalLantern: 20,
  GemmedCandle: 25,
  CrystalVase: 30,
  CoralDisplay: 28,
  PearlFrame: 32,
  EmeraldCarving: 40,
  RubySculpture: 42,
  DiamondPrism: 60,
  ObsidianPickaxe: 70,
  FlamingSword: 65,
  NatureWand: 55,
  OceanDagger: 50,
  CrystalBow: 45,
  CoralFishingRod: 40,
  EternalTorch: 35,
  Spellbook: 80,
  CrystalBall: 75,
  NatureAmulet: 65,
  FireAmulet: 68,
  WaterAmulet: 62,
  LightAmulet: 70,
  HerbalTea: 8,
  SwampStew: 12,
  Sushi: 15,
  HoneyBread: 10,
  MagicJam: 20,
};

const CRAFTING_RECIPES: Recipe[] = [
  // Basic Tools
  { inputs: { Wood: 2, Stone: 1 }, output: "Pickaxe", amount: 1 },
  { inputs: { Wood: 1, Stone: 1 }, output: "Axe", amount: 1 },
  { inputs: { Wood: 2, Iron: 1 }, output: "FishingRod", amount: 1 },
  { inputs: { Wood: 3, Resin: 2 }, output: "Torch", amount: 4 },
  { inputs: { Wood: 3, Resin: 1 }, output: "Bow", amount: 1 },
  { inputs: { Stone: 1, Wood: 1, Resin: 1 }, output: "Arrow", amount: 6 },
  
  // Basic Materials
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
  
  // Food Items
  { inputs: { Wheat: 3 }, output: "Bread", amount: 1 },
  { inputs: { Fish: 1, Herbs: 1 }, output: "CookedFish", amount: 1 },
  { inputs: { Mushrooms: 2, Herbs: 1 }, output: "Stew", amount: 1 },
  { inputs: { Honey: 2, Herbs: 1 }, output: "HealingSyrup", amount: 1 },
  { inputs: { Wheat: 1, Honey: 1 }, output: "HoneyCake", amount: 2 },
  { inputs: { Frogs: 2, Herbs: 1 }, output: "FrogLegs", amount: 2 },
  { inputs: { Fish: 1, Wheat: 1 }, output: "FishSandwich", amount: 1 },
  { inputs: { Mushrooms: 2, Wheat: 1 }, output: "MushroomSoup", amount: 1 },
  { inputs: { Frogs: 1, Wheat: 1 }, output: "FrogBites", amount: 2 },
  
  // Potions
  { inputs: { Mushrooms: 2, Crystal: 1 }, output: "ManaPotion", amount: 1 },
  { inputs: { Honey: 1, Resin: 1, Herbs: 1 }, output: "StaminaPotion", amount: 1 },
  { inputs: { Coral: 1, Pearl: 1 }, output: "WaterBreathingPotion", amount: 1 },
  { inputs: { Emerald: 1, Moss: 2 }, output: "InvisibilityPotion", amount: 1 },
  { inputs: { Ruby: 1, Coal: 2 }, output: "FireResistancePotion", amount: 1 },
  { inputs: { HealingSyrup: 1, Herbs: 2 }, output: "HealingPotion", amount: 1 },
  { inputs: { CrystalShard: 1, Moss: 2 }, output: "JumpBoostPotion", amount: 1 },
  { inputs: { Resin: 2, Herbs: 1 }, output: "StickyPotion", amount: 1 },
  { inputs: { Honey: 2, Crystal: 1 }, output: "SweetPotion", amount: 1 },
  { inputs: { Moss: 2, Mushrooms: 1 }, output: "SwampPotion", amount: 1 },
  
  // Jewelry
  { inputs: { GoldIngot: 2, Diamond: 1 }, output: "DiamondRing", amount: 1 },
  { inputs: { SilverIngot: 2, Pearl: 1 }, output: "PearlNecklace", amount: 1 },
  { inputs: { GoldIngot: 1, Ruby: 1 }, output: "RubyPendant", amount: 1 },
  { inputs: { SilverIngot: 1, Emerald: 1 }, output: "EmeraldEarring", amount: 2 },
  { inputs: { Coral: 3, SilverIngot: 1 }, output: "CoralCirclet", amount: 1 },
  { inputs: { GoldIngot: 1, Gem: 2 }, output: "GemBrooch", amount: 1 },
  { inputs: { SilverIngot: 1, Pearl: 2 }, output: "PearlBracelet", amount: 1 },
  { inputs: { GoldIngot: 2, Coral: 2 }, output: "CoralRing", amount: 1 },
  { inputs: { SilverIngot: 1, Emerald: 2 }, output: "EmeraldNecklace", amount: 1 },
  
  // Weapons & Tools
  { inputs: { IronIngot: 2, Wood: 2 }, output: "IronSword", amount: 1 },
  { inputs: { GoldIngot: 2, Wood: 1 }, output: "GoldDagger", amount: 1 },
  { inputs: { Diamond: 1, IronIngot: 2 }, output: "DiamondPickaxe", amount: 1 },
  { inputs: { ObsidianShard: 2, IronIngot: 1 }, output: "ObsidianBlade", amount: 1 },
  { inputs: { CrystalShard: 3, SilverIngot: 1 }, output: "CrystalWand", amount: 1 },
  { inputs: { CopperIngot: 2, Wood: 2 }, output: "CopperSword", amount: 1 },
  { inputs: { SilverIngot: 2, Wood: 1 }, output: "SilverDagger", amount: 1 },
  { inputs: { Ruby: 1, IronIngot: 2 }, output: "RubySword", amount: 1 },
  { inputs: { Emerald: 1, IronIngot: 2 }, output: "EmeraldAxe", amount: 1 },
  { inputs: { Gem: 2, Wood: 2 }, output: "GemKnife", amount: 1 },
  
  // Special Items
  { inputs: { Pearl: 3, Coral: 2, GoldIngot: 1 }, output: "OceanAmulet", amount: 1 },
  { inputs: { Emerald: 2, Moss: 3, Wood: 2 }, output: "ForestTalisman", amount: 1 },
  { inputs: { Ruby: 2, Coal: 3, IronIngot: 2 }, output: "VolcanicGauntlet", amount: 1 },
  { inputs: { Diamond: 3, Crystal: 2, GoldIngot: 3 }, output: "RoyalScepter", amount: 1 },
  { inputs: { GemCluster: 1, SilverIngot: 2, Resin: 2 }, output: "ArtisanLens", amount: 1 },
  { inputs: { CrystalShard: 1, Gem: 2 }, output: "EnchantedScroll", amount: 1 },
  { inputs: { Glass: 1, GoldIngot: 1 }, output: "Spyglass", amount: 1 },
  { inputs: { Moss: 2, Resin: 1 }, output: "Waterskin", amount: 1 },
  { inputs: { Honey: 2, Resin: 1 }, output: "StickyGlue", amount: 2 },
  { inputs: { Coral: 2, Pearl: 1 }, output: "OceanCharm", amount: 1 },
  { inputs: { Emerald: 1, Moss: 1 }, output: "SwampCharm", amount: 1 },
  { inputs: { Ruby: 1, Coal: 1 }, output: "VolcanicCharm", amount: 1 },
  { inputs: { Diamond: 1, Crystal: 1 }, output: "CrystalCharm", amount: 1 },
  
  // Storage & Furniture
  { inputs: { Planks: 4 }, output: "CraftingTable", amount: 1 },
  { inputs: { StoneBricks: 8 }, output: "StoneFurnace", amount: 1 },
  { inputs: { IronIngot: 5, Glass: 3 }, output: "ReinforcedWindow", amount: 1 },
  { inputs: { Wood: 3, Resin: 1 }, output: "WoodenChest", amount: 1 },
  { inputs: { IronIngot: 4, GoldIngot: 1 }, output: "MetalChest", amount: 1 },
  { inputs: { StoneBricks: 4, Glass: 2 }, output: "GlassTable", amount: 1 },
  { inputs: { Wood: 4, Resin: 2 }, output: "WoodenChair", amount: 1 },
  { inputs: { Stone: 4, Coal: 1 }, output: "StoneStool", amount: 1 },
  { inputs: { IronIngot: 3, Glass: 1 }, output: "MetalLantern", amount: 1 },
  
  // Decorative Items
  { inputs: { Gem: 1, GoldIngot: 1 }, output: "GemmedCandle", amount: 1 },
  { inputs: { Crystal: 1, SilverIngot: 1 }, output: "CrystalVase", amount: 1 },
  { inputs: { Coral: 2, Glass: 1 }, output: "CoralDisplay", amount: 1 },
  { inputs: { Pearl: 2, GoldIngot: 1 }, output: "PearlFrame", amount: 1 },
  { inputs: { Emerald: 1, Wood: 2 }, output: "EmeraldCarving", amount: 1 },
  { inputs: { Ruby: 1, Stone: 2 }, output: "RubySculpture", amount: 1 },
  { inputs: { Diamond: 1, Glass: 2 }, output: "DiamondPrism", amount: 1 },
  
  // Advanced Equipment
  { inputs: { DiamondPickaxe: 1, ObsidianShard: 3 }, output: "ObsidianPickaxe", amount: 1 },
  { inputs: { IronSword: 1, Ruby: 2 }, output: "FlamingSword", amount: 1 },
  { inputs: { CrystalWand: 1, Emerald: 2 }, output: "NatureWand", amount: 1 },
  { inputs: { GoldDagger: 1, Pearl: 2 }, output: "OceanDagger", amount: 1 },
  { inputs: { Bow: 1, CrystalShard: 3 }, output: "CrystalBow", amount: 1 },
  { inputs: { FishingRod: 1, Coral: 2 }, output: "CoralFishingRod", amount: 1 },
  { inputs: { Torch: 4, Resin: 3 }, output: "EternalTorch", amount: 1 },
  
  // Magical Items
  { inputs: { EnchantedScroll: 1, GemCluster: 1 }, output: "Spellbook", amount: 1 },
  { inputs: { CrystalShard: 5, GoldIngot: 2 }, output: "CrystalBall", amount: 1 },
  { inputs: { Emerald: 2, Moss: 3 }, output: "NatureAmulet", amount: 1 },
  { inputs: { Ruby: 2, Coal: 3 }, output: "FireAmulet", amount: 1 },
  { inputs: { Pearl: 2, Coral: 3 }, output: "WaterAmulet", amount: 1 },
  { inputs: { Diamond: 2, Crystal: 3 }, output: "LightAmulet", amount: 1 },
  
  // Consumable Items
  { inputs: { Herbs: 2, Honey: 1 }, output: "HerbalTea", amount: 2 },
  { inputs: { Mushrooms: 3, Frogs: 1 }, output: "SwampStew", amount: 1 },
  { inputs: { Wheat: 2, Honey: 1 }, output: "HoneyBread", amount: 2 },
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
  Spyglass: 0,
  FishSandwich: 0,
  MushroomSoup: 0,
  FrogBites: 0,
  StickyPotion: 0,
  SweetPotion: 0,
  SwampPotion: 0,
  GemBrooch: 0,
  PearlBracelet: 0,
  CoralRing: 0,
  EmeraldNecklace: 0,
  CopperSword: 0,
  SilverDagger: 0,
  RubySword: 0,
  EmeraldAxe: 0,
  GemKnife: 0,
  StickyGlue: 0,
  OceanCharm: 0,
  SwampCharm: 0,
  VolcanicCharm: 0,
  CrystalCharm: 0,
  GlassTable: 0,
  WoodenChair: 0,
  StoneStool: 0,
  MetalLantern: 0,
  GemmedCandle: 0,
  CrystalVase: 0,
  CoralDisplay: 0,
  PearlFrame: 0,
  EmeraldCarving: 0,
  RubySculpture: 0,
  DiamondPrism: 0,
  ObsidianPickaxe: 0,
  FlamingSword: 0,
  NatureWand: 0,
  OceanDagger: 0,
  CrystalBow: 0,
  CoralFishingRod: 0,
  EternalTorch: 0,
  Spellbook: 0,
  CrystalBall: 0,
  NatureAmulet: 0,
  FireAmulet: 0,
  WaterAmulet: 0,
  LightAmulet: 0,
  HerbalTea: 0,
  SwampStew: 0,
  Sushi: 0,
  HoneyBread: 0,
  MagicJam: 0,
};

// Define emojis for all items
const ITEM_EMOJIS: Partial<Record<keyof Inventory, string>> = {
  // ===== BASIC RAW RESOURCES =====
  // Forest resources
  Wood: "🪵",
  Honey: "🍯",
  Resin: "🟤",
  
  // Volcano resources
  Obsidian: "🌋",
  Ruby: "🔴",
  Diamond: "💎",
  
  // Water resources
  Fish: "🐟",
  Pearl: "⚪",
  Coral: "🪸",
  
  // Sand resources
  Glass: "🔍",
  Silver: "🥈",
  Gold: "🥇",
  
  // Mountain resources
  Stone: "🪨",
  Iron: "🪙",
  Gem: "💠",
  
  // Grass resources
  Wheat: "🌾",
  Herbs: "🌿",
  Copper: "🔶",
  
  // Cave resources
  Coal: "⛏️",
  Emerald: "💚",
  Crystal: "🔮",
  
  // Swamp resources
  Moss: "🍃",
  Mushrooms: "🍄",
  Frogs: "🐸",
  
  // ===== PROCESSED MATERIALS =====
  Planks: "🪵",
  StoneBricks: "🧱",
  CopperIngot: "🔶",
  IronIngot: "🪙",
  GoldIngot: "💰",
  SilverIngot: "🥈",
  ObsidianShard: "🌋",
  PolishedDiamond: "💎",
  PolishedRuby: "🔴",
  PolishedEmerald: "💚",
  CrystalShard: "🔮",
  GemCluster: "💠",
  
  // ===== TOOLS =====
  Pickaxe: "⛏️",
  Axe: "🪓",
  FishingRod: "🎣",
  Torch: "🔦",
  Bow: "🏹",
  Spyglass: "🔭",
  
  // ===== WEAPONS =====
  IronSword: "⚔️",
  GoldDagger: "🗡️",
  DiamondPickaxe: "⛏️",
  ObsidianBlade: "🔪",
  CopperSword: "⚔️",
  SilverDagger: "🗡️",
  RubySword: "⚔️",
  EmeraldAxe: "🪓",
  GemKnife: "🔪",
  FlamingSword: "🔥",
  OceanDagger: "🗡️",
  CrystalBow: "🏹",
  CoralFishingRod: "🎣",
  
  // ===== FOOD ITEMS =====
  Bread: "🍞",
  CookedFish: "🐟",
  Stew: "🍲",
  HealingSyrup: "🍯",
  HoneyCake: "🍰",
  FrogLegs: "🍗",
  FishSandwich: "🥪",
  MushroomSoup: "🍄",
  FrogBites: "🍖",
  Sushi: "🍣",
  HoneyBread: "🍞",
  HerbalTea: "🍵",
  SwampStew: "🍲",
  MagicJam: "🍯",
  
  // ===== POTIONS =====
  HealingPotion: "❤️",
  ManaPotion: "🔵",
  StaminaPotion: "💚",
  WaterBreathingPotion: "🌊",
  InvisibilityPotion: "👻",
  FireResistancePotion: "🔥",
  JumpBoostPotion: "🦘",
  StickyPotion: "🟤",
  SweetPotion: "🍯",
  SwampPotion: "🐸",
  
  // ===== JEWELRY =====
  DiamondRing: "💍",
  PearlNecklace: "📿",
  RubyPendant: "📿",
  EmeraldEarring: "📿",
  CoralCirclet: "👑",
  GemBrooch: "📌",
  PearlBracelet: "📿",
  CoralRing: "💍",
  EmeraldNecklace: "📿",
  
  // ===== MAGICAL ITEMS =====
  CrystalWand: "🪄",
  OceanAmulet: "🧿",
  ForestTalisman: "🧿",
  VolcanicGauntlet: "🧤",
  RoyalScepter: "🪄",
  ArtisanLens: "🔍",
  EnchantedScroll: "📜",
  OceanCharm: "🧿",
  SwampCharm: "🧿",
  VolcanicCharm: "🧿",
  CrystalCharm: "🧿",
  Spellbook: "📖",
  CrystalBall: "🔮",
  NatureAmulet: "🧿",
  FireAmulet: "🧿",
  WaterAmulet: "🧿",
  LightAmulet: "🧿",
  
  // ===== CRAFTING STATIONS =====
  CraftingTable: "🛠️",
  StoneFurnace: "🔥",
  
  // ===== STORAGE =====
  WoodenChest: "📦",
  MetalChest: "🗃️",
  
  // ===== BUILDING & FURNITURE =====
  ReinforcedWindow: "🪟",
  GlassTable: "🪑",
  WoodenChair: "🪑",
  StoneStool: "🪑",
  MetalLantern: "🏮",
  GemmedCandle: "🕯️",
  CrystalVase: "🏺",
  CoralDisplay: "🐠",
  PearlFrame: "🖼️",
  EmeraldCarving: "🗿",
  RubySculpture: "🗿",
  DiamondPrism: "🔶",
  
  // ===== MISC ITEMS =====
  Arrow: "🏹",
  Waterskin: "💧",
  StickyGlue: "🧴",
  EternalTorch: "🔦",
  ObsidianPickaxe: "⛏️",
  NatureWand: "🪄",
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
  const [hasGeneratedFirstMap, setHasGeneratedFirstMap] = useState(false);
  const [lastMapGeneration, setLastMapGeneration] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { addToast, ToastContainer } = useToast();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Load map state from localStorage on component mount
  useEffect(() => {
    const savedInventory = localStorage.getItem('pixelMapInventory');
    const savedGold = localStorage.getItem('pixelMapGold');
    const savedMap = localStorage.getItem('pixelMapState');
    
    if (savedInventory) {
      try {
        const parsedInventory = JSON.parse(savedInventory);
        const completeInventory: Inventory = {
          ...INITIAL_INVENTORY,
          ...parsedInventory,
        };
        setInventory(completeInventory);
      } catch (e) {
        console.error('Failed to parse saved inventory:', e);
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

    if (savedMap) {
      try {
        const parsedMap: SavedMapState = JSON.parse(savedMap);
        
        // Check if the map was generated recently (within the last minute)
        const now = Date.now();
        if (now - parsedMap.lastGenerated < 60000) {
          // Load the saved map
          setPixels(parsedMap.pixels);
          setTerrainCounts(parsedMap.terrainCounts);
          setPixelCooldowns(parsedMap.pixelCooldowns);
          setLastMapGeneration(parsedMap.lastGenerated);
          setHasGeneratedFirstMap(true);
          return; // Skip generating a new map
        }
      } catch (e) {
        console.error('Failed to parse saved map:', e);
      }
    }
    
    // If no valid saved map, generate a new one
    generateMap();
  }, []);

  // Save map state to localStorage whenever it changes
  useEffect(() => {
    if (pixels.length > 0) {
      const mapState: SavedMapState = {
        pixels,
        terrainCounts,
        pixelCooldowns,
        lastGenerated: lastMapGeneration
      };
      localStorage.setItem('pixelMapState', JSON.stringify(mapState));
    }
  }, [pixels, terrainCounts, pixelCooldowns, lastMapGeneration]);

  // Save inventory and gold to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('pixelMapInventory', JSON.stringify(inventory));
    localStorage.setItem('pixelMapGold', gold.toString());
  }, [inventory, gold]);

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
      
      // Show collection toast
      const rarity = isEpic ? "Epic" : isRare ? "Rare" : "Common";
      addToast(`Collected ${rarity} ${resourceType} from ${TERRAIN_TYPES[terrainType].name}`, "success");
    }
  };

  // Mountain ranges with occasional volcanoes
  function createMountainRange(map: string[][], length: number) {
    const h = map.length;
    const w = map[0].length;
    let x = Math.floor(Math.random() * w);
    let y = Math.floor(Math.random() * h);

    for (let i = 0; i < length; i++) {
      if (x >= 0 && x < w && y >= 0 && y < h) {
        map[y][x] = Math.random() < 0.05 ? "volcano" : "mountain";
      }
      // Step along a noisy direction
      x += Math.floor(Math.random() * 3) - 1;
      y += Math.floor(Math.random() * 3) - 1;
    }
    return map;
  }

  // Add caves + stone next to mountain/volcano clusters
  function addCavesAndStone(map: string[][]) {
    const h = map.length;
    const w = map[0].length;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (map[y][x] === "mountain" || map[y][x] === "volcano") {
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const ny = y + dy;
              const nx = x + dx;
              if (ny >= 0 && ny < h && nx >= 0 && nx < w) {
                if (map[ny][nx] === "grass") {
                  if (Math.random() < 0.1) map[ny][nx] = "cave";
                }
              }
            }
          }
        }
      }
    }
    return map;
  }

  // Beaches hugging water tiles tightly
  function generateBeaches(map: string[][]) {
    const h = map.length;
    const w = map[0].length;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (map[y][x] === "grass") {
          let nearWater = false;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const ny = y + dy;
              const nx = x + dx;
              if (ny >= 0 && ny < h && nx >= 0 && nx < w) {
                if (map[ny][nx] === "water") nearWater = true;
              }
            }
          }
          if (nearWater && Math.random() > 0.3) {
            map[y][x] = "sand";
          }
        }
      }
    }
    return map;
  }

  // --- Main Map Generation ---
  const generateMap = () => {
    // Check if player has enough gold (only after first map)
    if (hasGeneratedFirstMap && gold < 100) {
      addToast("You need 100 gold to generate a new map!", "error");
      return;
    }

    setIsGenerating(true);

    // Deduct gold or mark first map
    if (hasGeneratedFirstMap) {
      setGold((prev) => prev - 100);
    } else {
      setHasGeneratedFirstMap(true);
    }

    // Set generation timestamp
    const generationTime = Date.now();
    setLastMapGeneration(generationTime);

    // Create a 32x32 grid with all grass
    let newPixels = Array(32)
      .fill(null)
      .map(() => Array(32).fill("grass"));

    // Add initial seeds for water/trees/swamp etc
    newPixels = createSeeds(newPixels, "water", 3);
    newPixels = createSeeds(newPixels, "tree", 12);
    newPixels = createSeeds(newPixels, "swamp", 7);

    // Create rivers
    newPixels = createRivers(newPixels);

    // Expand terrains
    newPixels = generateTerrain(newPixels, "water", 3, 2);
    newPixels = generateTerrain(newPixels, "tree", 4, 2);
    newPixels = generateTerrain(newPixels, "swamp", 3, 2);

    // --- NEW RULES ---
    // Generate mountain ridges with volcano clusters
    for (let i = 0; i < 3; i++) {
      newPixels = createMountainRange(newPixels, 15);
    }

    // Add caves + stone near mountains
    newPixels = addCavesAndStone(newPixels);

    // Generate beaches around coastlines
    newPixels = generateBeaches(newPixels);

    // Reset terrain counts
    setTerrainCounts((prev) => {
      const newCounts = { ...prev };
      for (const key in newCounts) {
        const terrainType = key as TerrainType;
        newCounts[terrainType] = {
          ...newCounts[terrainType],
          count: 0,
          maxCollection: 0,
          collected: 0,
          rareCollected: 0,
        };
      }
      return newCounts;
    });

    // Reset cooldowns
    setPixelCooldowns([]);

    setPixels(newPixels);

    // Simulate a short delay
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
    setInventory(INITIAL_INVENTORY);
    setGold(0);
    addToast("Inventory has been reset", "info");
    setShowResetConfirm(false);
  };

  // Check if a specific pixel is on cooldown
  const isPixelOnCooldown = (x: number, y: number) => {
    return pixelCooldowns.some(cooldown => 
      cooldown.x === x && cooldown.y === y && cooldown.cooldownUntil > Date.now()
    );
  };

  // Craft item function with toast support
  const craftItem = (
    recipe: Recipe,
    inventory: Inventory,
    setInventory: (inv: Inventory) => void
  ) => {
    // Check requirements
    for (const [resource, required] of Object.entries(recipe.inputs)) {
      if ((inventory[resource as keyof Inventory] || 0) < required) {
        addToast(`Not enough ${resource} to craft ${recipe.output}`, "error");
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
    addToast(`Crafted ${recipe.amount}x ${recipe.output}!`, "success");
  };

  // Sell items for gold
  const sellItem = (item: keyof Inventory, amount: number) => {
    const value = ITEM_VALUES[item] || 0;
    
    if (value === 0) {
      addToast("This item cannot be sold.", "error");
      return;
    }
    
    if (inventory[item] < amount) {
      addToast(`You don't have enough ${item} to sell.`, "error");
      return;
    }
    
    const totalValue = value * amount;
    
    setInventory(prev => ({
      ...prev,
      [item]: prev[item] - amount
    }));
    
    setGold(prev => prev + totalValue);
    
    addToast(`Sold ${amount}x ${item} for ${totalValue} gold!`, "success");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto bg-gradient-to-b from-blue-800 to-blue-900 rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 border-2 border-blue-700">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-yellow-600 to-amber-500 bg-clip-text text-transparent mb-2 
                          drop-shadow-[0_0_15px_rgba(255,204,0,0.7)] 
                          hover:drop-shadow-[0_0_20px_rgba(255,204,0,0.9)] hover:scale-105 
                          transition-all duration-500">
            Pixel Harvester
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Canvas and controls */}
          <div className="flex-1">
            <div className="border-6 border-blue-600 rounded-xl p-2 sm:p-3 bg-blue-900/50 shadow-inner">
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
                    Generate Map (100 gold)
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
                      <div className="flex items-center flex-1 min-w-0">
                        <div
                          className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 rounded-md border-2 border-blue-400 shadow-sm flex-shrink-0"
                          style={{ backgroundColor: terrain.color }}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-blue-100 font-medium text-sm sm:text-base truncate">{terrain.name}</div>
                          <div className="text-xs text-blue-300">
                            ( {terrain.resource} / {terrain.rareResource} / {terrain.epicResource} )
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end flex-shrink-0 ml-2">
                        <span className="font-mono px-2 py-1 rounded-md text-xs bg-blue-900/70 text-blue-100 shadow-inner whitespace-nowrap">
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

        <ToastContainer />
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-blue-900 p-6 rounded-xl border border-blue-700">
              <h3 className="text-white text-xl mb-4">Confirm Reset</h3>
              <p className="text-blue-200 mb-6">Are you sure you want to reset your inventory? This cannot be undone.</p>
              <div className="flex gap-4 justify-end">
                <button 
                  onClick={() => setShowResetConfirm(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  onClick={resetInventory}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="relative bg-gradient-to-b from-blue-950/95 to-indigo-950/95 p-6 sm:p-8 rounded-3xl border border-blue-500/40 shadow-[0_0_40px_rgba(0,0,80,0.6)] mb-8 backdrop-blur-md overflow-hidden">

          {/* Subtle glow overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 via-transparent to-indigo-700/10 pointer-events-none"></div>

          {/* Header */}
          <div className="flex justify-between items-center mb-8 pb-3 border-b border-blue-700/50">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-4 tracking-wide">
              Inventory
            </h2>
            <div className="text-blue-200 text-sm bg-blue-900/40 px-4 py-1 rounded-full border border-blue-600/40 shadow-inner">
              {Object.values(inventory).reduce((sum, count) => sum + count, 0)} items
            </div>
          </div>

          {/* Gold display */}
          <div className="mb-8 p-4 bg-gradient-to-r from-yellow-700 to-amber-600 rounded-2xl border border-amber-400/60 shadow-[0_0_25px_rgba(255,200,50,0.4)] flex items-center justify-between relative overflow-hidden">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-yellow-200 text-sm font-semibold uppercase tracking-wide">Currency</p>
                <p className="font-extrabold text-yellow-100 text-2xl sm:text-3xl drop-shadow">{gold} G</p>
              </div>
            </div>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="text-sm bg-red-700/80 hover:bg-red-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all hover:scale-105 shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9" />
              </svg>
              Reset
            </button>
          </div>

          {/* Inventory grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-2">
            {Object.entries(inventory)
              .filter(([_, count]) => count > 0)
              .map(([resource, count]) => {
                const value = ITEM_VALUES[resource as keyof Inventory] || 0;
                const recipe = CRAFTING_RECIPES.find(r => r.output === resource);
                const canCraft = recipe && Object.entries(recipe.inputs).every(
                  ([inputResource, required]) => 
                    (inventory[inputResource as keyof Inventory] || 0) >= required
                );
                const emoji = ITEM_EMOJIS[resource as keyof Inventory] || "📦";

                return (
                  <div
                    key={resource}
                    className="relative bg-gradient-to-b from-blue-800/60 to-blue-900/80 backdrop-blur p-5 rounded-2xl border border-blue-500/40 shadow-[0_0_15px_rgba(50,100,255,0.25)] hover:shadow-[0_0_25px_rgba(80,150,255,0.5)] transition-all"
                  >
                    <div className="flex flex-col mb-4">
                      {/* Resource Name with Emoji */}
                      <h3 className="font-extrabold text-white text-xl mb-2 tracking-wide flex items-center gap-2">
                        <span className="text-2xl">{emoji}</span>
                        {resource}
                      </h3>

                      {/* Stock and Value in a row */}
                      <div className="flex items-center justify-between mb-3">
                        {/* Stock */}
                        <div className="flex items-center gap-2 bg-blue-600 px-3 py-1 rounded-xl shadow-inner">
                          <span className="text-white text-sm font-medium">Stock : </span>
                          <span className="font-mono text-white text-sm">{count}</span>
                        </div>

                        {/* Value */}
                        {value > 0 && (
                          <div className="flex items-center gap-1 bg-amber-700/30 px-3 py-1 rounded-xl shadow-inner">
                            <span className="text-amber-300 text-sm font-semibold">Value : {value}</span>
                          </div>
                        )}
                      </div>

                      {/* Show recipe OR location */}
                      {recipe ? (
                        <div className="p-3 bg-blue-950/40 rounded-xl border border-blue-700/40">
                          <p className="text-white text-xs font-semibold mb-2 uppercase tracking-wider">Recipe : </p>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(recipe.inputs).map(([res, qty]) => (
                              <span
                                key={res}
                                className="text-xs bg-blue-800/50 text-blue-200 px-2 py-1 rounded-lg border border-blue-600/30"
                              >
                                {res}×{qty}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : (() => {
                        const terrain = Object.values(TERRAIN_TYPES).find(
                          t => t.resource === resource || t.rareResource === resource || t.epicResource === resource
                        );
                        return terrain ? (
                          <div className="p-3 bg-green-950/30 rounded-xl border border-green-700/40">
                            <p className="text-white text-xs font-semibold mb-2 uppercase tracking-wider">Location : </p>
                            <div className="flex items-center gap-2">
                              <span
                                className="text-xs font-medium px-3 py-1 rounded-lg"
                                style={{
                                  backgroundColor: terrain.color + "40",
                                  color: terrain.color,
                                  border: `1px solid ${terrain.color}80`,
                                }}
                              >
                                {terrain.name}
                              </span>
                            </div>
                          </div>
                        ) : null;
                      })()}
                    </div>


                    <div className="flex gap-3">
                      {value > 0 && (
                        <>
                          <button
                            onClick={() => sellItem(resource as keyof Inventory, 1)}
                            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg font-semibold transition-all shadow hover:scale-105"
                          >
                            Sell 1
                          </button>
                          <button
                            onClick={() => sellItem(resource as keyof Inventory, count)}
                            className="flex-1 bg-amber-600 hover:bg-amber-500 text-white py-2 rounded-lg font-semibold transition-all shadow hover:scale-105"
                          >
                            Sell All
                          </button>
                        </>
                      )}
                      {canCraft && (
                        <button
                          onClick={() => recipe && craftItem(recipe, inventory, setInventory)}
                          className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg font-semibold transition-all shadow hover:scale-105"
                        >
                          Craft
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            
            {/* Then show craftable items that are not in inventory (count = 0) */}
            {CRAFTING_RECIPES.map(recipe => {
              const resource = recipe.output;
              const count = inventory[resource as keyof Inventory] || 0;
              const emoji = ITEM_EMOJIS[resource as keyof Inventory] || "📦";

              // Skip if already owned
              if (count > 0) return null;

              const canCraft = Object.entries(recipe.inputs).every(
                ([inputResource, required]) =>
                  (inventory[inputResource as keyof Inventory] || 0) >= required
              );

              // Skip if not craftable
              if (!canCraft) return null;

              return (
                <div
                  key={resource}
                  className="relative bg-gradient-to-b from-blue-800/60 to-blue-900/80 backdrop-blur p-5 rounded-2xl border border-blue-500/40 shadow-[0_0_15px_rgba(50,100,255,0.25)] hover:shadow-[0_0_25px_rgba(80,150,255,0.5)] transition-all"
                >
                  {/* Resource Info */}
                  <div className="flex flex-col mb-4">
                    <h3 className="font-extrabold text-white text-xl mb-2 tracking-wide flex items-center gap-2">
                      <span className="text-2xl">{emoji}</span>
                      {resource}
                    </h3>
                    {/* Stock */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 bg-blue-600 px-3 py-1 rounded-xl shadow-inner">
                        <span className="text-white text-sm font-medium">Stock : </span>
                        <span className="font-mono text-white text-sm">{count}</span>
                      </div>
                    </div>

                    {/* Recipe */}
                    <div className="p-3 bg-blue-950/40 rounded-xl border border-blue-700/40">
                      <p className="text-white text-xs font-semibold mb-2 uppercase tracking-wider">Recipe : </p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(recipe.inputs).map(([res, qty]) => (
                          <span
                            key={res}
                            className="text-xs bg-blue-800/50 text-blue-200 px-2 py-1 rounded-lg border border-blue-600/30"
                          >
                            {res}×{qty}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex gap-3">
                    {canCraft && (
                      <button
                        onClick={() => recipe && craftItem(recipe, inventory, setInventory)}
                        className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg font-semibold transition-all shadow hover:scale-105"
                      >
                        Craft
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}