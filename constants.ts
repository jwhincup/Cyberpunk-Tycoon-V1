import { Business, Upgrade, Project, Stock, Item, FlippableProperty, MissionReward, MissionRarity, Personnel, Merger, PropertyCondition, ImprovementType, UnlockRequirement, MarketEvent, NewsEvent, StockCategory } from './types';

export const PRESTIGE_REQUIREMENT = 1_000_000_000_000; // 1 Trillion

export const PLANETS = [
    { id: 'earth', name: 'Neo-Kyoto, Earth', description: 'The neon-drenched cradle of your corporate empire.' },
    { id: 'mars', name: 'Olympus Mons, Mars', description: 'A rugged frontier, rich in rare minerals and opportunity.' },
    { id: 'europa', name: 'Biolume Depths, Europa', description: 'Beneath the ice, strange energies fuel new technologies.' },
    { id: 'titan', name: 'Xylos Methane Sea, Titan', description: 'Harness the hydrocarbon seas for unimaginable power.' },
    { id: 'kepler', name: 'Kepler-186f, The Gardens', description: 'A lush world where corporate espionage blooms like alien flora.' },
];

export const STOCK_HISTORY_LENGTH = 1000;

// Mission System Constants
export const MISSION_GENERATION_INTERVAL = 60 * 1000; // 1 minute in milliseconds
export const MAX_MISSIONS = 4; // Max available missions at any time
export const MISSION_EXPIRATION_TIME = 5 * 60; // 5 minutes in seconds for a mission to be available

// Market Simulation Constants
export const MARKET_EVENT_CHANCE = 0.01; // 1% chance per second
export const NEWS_EVENT_CHANCE = 0.02; // 2% chance per second

export const NORMAL_MARKET_STATUS: MarketEvent = {
    type: 'NORMAL',
    name: 'Stable Market',
    description: 'The market is stable. Prices are moving predictably.',
    multiplier: 1,
    duration: Infinity,
    timeLeft: Infinity,
};

export const MARKET_EVENT_TEMPLATES: Omit<MarketEvent, 'duration' | 'timeLeft'>[] = [
    { type: 'BOOM', name: 'Market Boom', description: 'A surge of investor confidence is driving all prices up!', multiplier: 1.15 },
    { type: 'BOOM', name: 'Bull Run', description: 'Unprecedented growth across the board. To the moon!', multiplier: 1.25 },
    { type: 'CRASH', name: 'Market Crash', description: 'A sudden panic is causing a massive sell-off. Prices are plummeting!', multiplier: 0.85 },
    { type: 'CRASH', name: 'Recession', description: 'Economic downturn is dragging the whole market down.', multiplier: 0.75 },
];

export const NEWS_EVENT_TEMPLATES: { category: StockCategory; name: string; description: string; multiplier: number }[] = [
    // Blue Chip
    { category: 'Blue Chip', name: 'Regulatory Approval', description: 'OmniCorp and other giants receive favorable government contracts.', multiplier: 1.1 },
    { category: 'Blue Chip', name: 'Antitrust Investigation', description: 'Mega-corporations face government scrutiny, spooking investors.', multiplier: 0.9 },
    // Growth Stock
    { category: 'Growth Stock', name: 'Tech Breakthrough', description: 'A major technological leap by ZetaTech excites the growth sector.', multiplier: 1.2 },
    { category: 'Growth Stock', name: 'Supply Chain Disruption', description: 'Key component shortages are hindering tech production.', multiplier: 0.85 },
    // Speculative
    { category: 'Speculative', name: 'Viral Trend', description: 'A GlitchNet-powered meme has gone viral, boosting speculative assets.', multiplier: 1.4 },
    { category: 'Speculative', name: 'Scandal Hits', description: 'A waste disposal scandal involving Scav-Life has tainted the speculative market.', multiplier: 0.7 },
    // Crypto
    { category: 'Crypto', name: 'Mainstream Adoption', description: 'A major financial institution announced it will accept Aetherium.', multiplier: 1.3 },
    { category: 'Crypto', name: 'Quantum Hack', description: 'Rumors of a quantum computer breaking crypto encryption are causing a panic.', multiplier: 0.75 },
];


export const RARITY_CONFIG: Record<MissionRarity, { color: string; weight: number; rewards: MissionReward[] }> = {
    Common: {
        color: 'border-cyber-dim text-cyber-dim',
        weight: 6, // 60% chance
        rewards: [
            { type: 'INCOME_BOOST', multiplier: 1.10, duration: 24 * 3600 }, // +10% for 24h
            { type: 'COST_REDUCTION', multiplier: 0.95, duration: 24 * 3600 }, // -5% for 24h
        ]
    },
    Uncommon: {
        color: 'border-cyber-cyan text-cyber-cyan',
        weight: 3, // 30% chance
        rewards: [
            { type: 'INCOME_BOOST', multiplier: 1.20, duration: 48 * 3600 }, // +20% for 48h
            { type: 'COST_REDUCTION', multiplier: 0.90, duration: 48 * 3600 }, // -10% for 48h
        ]
    },
    Rare: {
        color: 'border-cyber-pink text-cyber-pink',
        weight: 1, // 10% chance
        rewards: [
            { type: 'INCOME_BOOST', multiplier: 1.30, duration: 72 * 3600 }, // +30% for 72h
            { type: 'COST_REDUCTION', multiplier: 0.80, duration: 72 * 3600 }, // -20% for 72h
        ]
    },
};

export const MISSION_TEMPLATES = [
    { id: 'm_heist', boss: 'Mr. Silhouette', title: 'Data Heist', description: 'Acquire competitor research data from a secure server. Discretion is paramount.', isLocked: false },
    { id: 'm_extract', boss: 'Fixer Fade', title: 'Asset Extraction', description: 'A valuable corporate asset needs to be... relocated. Ensure they arrive safely.', isLocked: false },
    { id: 'm_market', boss: 'Auntie Nuyen', title: 'Market Manipulation', description: 'Artificially inflate the value of a shell-corp stock before a major sell-off.', isLocked: false },
    { id: 'm_disrupt', boss: 'The Glitch', title: 'Network Disruption', description: 'Launch a DDoS attack against a rival corporation\'s logistics network. Cause chaos.', isLocked: false },
    { id: 'm_proto', boss: 'Ms. Chrome', title: 'Prototype Acquisition', description: 'A new piece of cyberware is about to hit the market. Secure the prototype before it does.', isLocked: false },
    { id: 'm_takeover', boss: 'The Broker', title: 'Hostile Takeover', description: 'Weaken a smaller company from the inside, paving the way for a corporate acquisition.', isLocked: false },
    // New, locked missions
    { id: 'm_assassin', boss: 'Zero', title: 'Wetwork', description: 'A rival exec is becoming a problem. Eliminate the problem.', isLocked: true },
    { id: 'm_sabotage', boss: 'The Glitch', title: 'Industrial Sabotage', description: 'Infiltrate a rival\'s automated factory and introduce a catastrophic "bug" in their assembly line.', isLocked: true },
    { id: 'm_smuggle', boss: 'Auntie Nuyen', title: 'Arms Deal', description: 'Smuggle a shipment of military-grade weapons past a corporate blockade.', isLocked: true },
];

// Helper to generate an initial price history based on a sine wave to make charts readable from the start
const generateInitialSineHistory = (
    basePrice: number, 
    length: number, 
    frequency: number, 
    amplitude: number, 
    volatility: number
): number[] => {
    const history: number[] = [];
    for (let i = 0; i < length; i++) {
        const sineWave = Math.sin(i * frequency);
        const priceOffset = sineWave * amplitude;
        const randomNoise = (Math.random() - 0.5) * volatility * basePrice;
        const price = basePrice + priceOffset + randomNoise;
        history.push(Math.max(0.01, price));
    }
    return history;
};

const generateInitialVolumeHistory = (
    baseTickVolume: number,
    length: number,
    volatility: number,
): number[] => {
    const history: number[] = [];
    for (let i = 0; i < length; i++) {
        const randomFactor = 1 + (Math.random() - 0.5) * 2 * volatility * 5;
        const volume = Math.floor(baseTickVolume * randomFactor);
        history.push(Math.max(0, volume));
    }
    return history;
};


export const INITIAL_BUSINESSES: Business[] = [
    {
        id: 'biz1',
        name: 'Synth-Coffee Stall',
        description: 'Slinging hot, questionably-sourced synth-caf to the masses.',
        icon: '☕',
        cost: 10,
        baseIncome: 0.5,
        costMultiplier: 1.1,
        owned: 0,
        incomeMultiplier: 1,
        unlocked: true,
        upgrades: [
            { id: 'biz1_upg1', name: 'Industrial Espresso Machine', description: 'Doubles base income.', cost: 100, status: 'AVAILABLE', constructionTime: 5, icon: '🔧', tier: 1, effect: { type: 'BASE_INCOME_MULTIPLIER', value: 2 }},
            { id: 'biz1_upg2', name: 'Roaster-Bot 5000', description: 'Doubles base income again.', cost: 500, status: 'AVAILABLE', constructionTime: 15, icon: '🤖', tier: 2, requiredUpgradeId: 'biz1_upg1', effect: { type: 'BASE_INCOME_MULTIPLIER', value: 2 }},
            { id: 'biz1_upg3', name: 'Secret Ingredient', description: 'Adds +0.5 to the income multiplier.', cost: 1000, status: 'AVAILABLE', constructionTime: 15, icon: '🧪', tier: 2, requiredUpgradeId: 'biz1_upg1', effect: { type: 'INCOME_MULTIPLIER_ADD', value: 0.5 }},
            { id: 'biz1_upg4', name: 'Franchise Deal', description: 'Adds +1.0 to the income multiplier.', cost: 5000, status: 'AVAILABLE', constructionTime: 30, icon: '📜', tier: 3, requiredUpgradeId: 'biz1_upg3', effect: { type: 'INCOME_MULTIPLIER_ADD', value: 1.0 }},
            { id: 'biz1_upg5', name: 'Neuro-Marketing', description: 'Subliminal ads in the coffee foam. Doubles base income.', cost: 25000, status: 'AVAILABLE', constructionTime: 45, icon: '📡', tier: 3, requiredUpgradeId: 'biz1_upg2', effect: { type: 'BASE_INCOME_MULTIPLIER', value: 2 }},
            { id: 'biz1_upg6', name: 'Global Distribution Deal', description: 'Your brand is everywhere. Adds +2.0 to income multiplier.', cost: 75000, status: 'AVAILABLE', constructionTime: 60, icon: '🌍', tier: 4, requiredUpgradeId: 'biz1_upg4', effect: { type: 'INCOME_MULTIPLIER_ADD', value: 2.0 }},
            { id: 'biz1_upg7', name: 'Barista-Bot Automation', description: 'Fully automated chain. Doubles base income.', cost: 150000, status: 'AVAILABLE', constructionTime: 90, icon: '🤖', tier: 4, requiredUpgradeId: 'biz1_upg5', effect: { type: 'BASE_INCOME_MULTIPLIER', value: 2 }},
            { id: 'biz1_upg8', name: 'Zero-G Coffee Beans', description: 'Grown in orbit. A luxury product. Adds +5.0 to income multiplier.', cost: 500000, status: 'AVAILABLE', constructionTime: 120, icon: '🚀', tier: 5, requiredUpgradeId: 'biz1_upg7', effect: { type: 'INCOME_MULTIPLIER_ADD', value: 5.0 }},
        ]
    },
    {
        id: 'biz2',
        name: 'Data Scavenging Rig',
        description: 'Scraping discarded data streams for valuable info-nuggets.',
        icon: '💾',
        cost: 150,
        baseIncome: 5,
        costMultiplier: 1.15,
        owned: 0,
        incomeMultiplier: 1,
        unlocked: true,
        upgrades: [
             { id: 'biz2_upg1', name: 'Advanced Scraping Algorithms', description: 'Doubles base income.', cost: 1500, status: 'AVAILABLE', constructionTime: 10, icon: '🧠', tier: 1, effect: { type: 'BASE_INCOME_MULTIPLIER', value: 2 }},
             { id: 'biz2_upg2', name: 'AI Data-Sorters', description: 'Adds +0.5 to the income multiplier.', cost: 7500, status: 'AVAILABLE', constructionTime: 20, icon: '🤖', tier: 2, requiredUpgradeId: 'biz2_upg1', effect: { type: 'INCOME_MULTIPLIER_ADD', value: 0.5 }},
             { id: 'biz2_upg3', name: 'Dark Web Access', description: 'Doubles base income again from more... lucrative sources.', cost: 15000, status: 'AVAILABLE', constructionTime: 30, icon: '💀', tier: 2, requiredUpgradeId: 'biz2_upg1', effect: { type: 'BASE_INCOME_MULTIPLIER', value: 2 }},
             { id: 'biz2_upg4', name: 'Quantum Encryption Breakers', description: 'Access higher-grade data streams. Doubles base income.', cost: 50000, status: 'AVAILABLE', constructionTime: 45, icon: '🔑', tier: 3, requiredUpgradeId: 'biz2_upg3', effect: { type: 'BASE_INCOME_MULTIPLIER', value: 2 }},
             { id: 'biz2_upg5', name: 'Predictive Analytics Suite', description: 'Sell future trends. Adds +1.0 to income multiplier.', cost: 120000, status: 'AVAILABLE', constructionTime: 60, icon: '📈', tier: 3, requiredUpgradeId: 'biz2_upg2', effect: { type: 'INCOME_MULTIPLIER_ADD', value: 1.0 }},
             { id: 'biz2_upg6', name: 'Data Laundering Services', description: 'Clean dirty data for corporate clients. Doubles base income.', cost: 300000, status: 'AVAILABLE', constructionTime: 90, icon: '🧼', tier: 4, requiredUpgradeId: 'biz2_upg4', effect: { type: 'BASE_INCOME_MULTIPLIER', value: 2 }},
             { id: 'biz2_upg7', name: 'Neural Network Farm', description: 'Massive AI farm for data processing. Adds +2.5 to income multiplier.', cost: 750000, status: 'AVAILABLE', constructionTime: 120, icon: '🧠', tier: 4, requiredUpgradeId: 'biz2_upg5', effect: { type: 'INCOME_MULTIPLIER_ADD', value: 2.5 }},
             { id: 'biz2_upg8', name: 'Sentient Data-Spirit', description: 'An AI ghost in the machine finds the best data. Doubles base income.', cost: 2000000, status: 'AVAILABLE', constructionTime: 180, icon: '👻', tier: 5, requiredUpgradeId: 'biz2_upg6', effect: { type: 'BASE_INCOME_MULTIPLIER', value: 2 }},
        ]
    },
    {
        id: 'biz3',
        name: 'Black Market Courier Service',
        description: 'Delivering "sensitive" packages with a no-questions-asked policy.',
        icon: '📦',
        cost: 2000,
        baseIncome: 25,
        costMultiplier: 1.2,
        owned: 0,
        incomeMultiplier: 1,
        unlocked: true,
        upgrades: [
            { id: 'biz3_upg1', name: 'Hover-Drone Fleet', description: 'Faster deliveries. Doubles base income.', cost: 20000, status: 'AVAILABLE', constructionTime: 25, icon: '✈️', tier: 1, effect: { type: 'BASE_INCOME_MULTIPLIER', value: 2 }},
            { id: 'biz3_upg2', name: 'Stealth Shielding', description: 'Avoids authorities. Adds +0.5 to income multiplier.', cost: 100000, status: 'AVAILABLE', constructionTime: 45, icon: '👻', tier: 2, requiredUpgradeId: 'biz3_upg1', effect: { type: 'INCOME_MULTIPLIER_ADD', value: 0.5 }},
            { id: 'biz3_upg3', name: 'Sub-orbital Drop Pods', description: 'Minutes-to-anywhere delivery. Doubles base income.', cost: 250000, status: 'AVAILABLE', constructionTime: 60, icon: '🚀', tier: 2, requiredUpgradeId: 'biz3_upg1', effect: { type: 'BASE_INCOME_MULTIPLIER', value: 2 }},
            { id: 'biz3_upg4', name: 'Corporate Espionage Contracts', description: 'Deliver secrets, not just packages. Adds +1.0 to income multiplier.', cost: 600000, status: 'AVAILABLE', constructionTime: 90, icon: '🤫', tier: 3, requiredUpgradeId: 'biz3_upg2', effect: { type: 'INCOME_MULTIPLIER_ADD', value: 1.0 }},
            { id: 'biz3_upg5', name: 'Quantum Tunneling Storage', description: 'Packages that exist nowhere and everywhere. Doubles base income.', cost: 1500000, status: 'AVAILABLE', constructionTime: 120, icon: '🌀', tier: 3, requiredUpgradeId: 'biz3_upg3', effect: { type: 'BASE_INCOME_MULTIPLIER', value: 2 }},
            { id: 'biz3_upg6', name: 'Diplomatic Immunity', description: 'Bribe the right people. Adds +2.0 to income multiplier.', cost: 4000000, status: 'AVAILABLE', constructionTime: 150, icon: '⚖️', tier: 4, requiredUpgradeId: 'biz3_upg4', effect: { type: 'INCOME_MULTIPLIER_ADD', value: 2.0 }},
            { id: 'biz3_upg7', name: 'AI Route Prediction', description: 'Always 10 steps ahead of the competition and law. Doubles base income.', cost: 10000000, status: 'AVAILABLE', constructionTime: 180, icon: '🗺️', tier: 4, requiredUpgradeId: 'biz3_upg5', effect: { type: 'BASE_INCOME_MULTIPLIER', value: 2 }},
            { id: 'biz3_upg8', name: 'Exclusive Mil-Tech Contract', description: 'Become the sole logistics provider for a private army. Adds +5.0 to income multiplier.', cost: 25000000, status: 'AVAILABLE', constructionTime: 240, icon: '💥', tier: 5, requiredUpgradeId: 'biz3_upg7', effect: { type: 'INCOME_MULTIPLIER_ADD', value: 5.0 }},
        ]
    },
    {
        id: 'biz8',
        name: 'Cyber-Cab Co.',
        description: 'Automated taxi fleet navigating the neon grid.',
        icon: '🚕',
        cost: 10000,
        baseIncome: 80,
        costMultiplier: 1.22,
        owned: 0,
        incomeMultiplier: 1,
        unlocked: true,
        upgrades: []
    },
    {
        id: 'biz4',
        name: 'AI Influencer Farm',
        description: 'Virtual personalities pushing real-world agendas and products.',
        icon: '🤖',
        cost: 25000,
        baseIncome: 150,
        costMultiplier: 1.25,
        owned: 0,
        incomeMultiplier: 1,
        unlocked: false,
        unlockRequirements: [{ type: 'project', id: 'proj1' }],
        upgrades: [
            { id: 'biz4_upg1', name: 'Deepfake Engine', description: 'Flawless digital impersonations. Doubles base income.', cost: 300000, status: 'AVAILABLE', constructionTime: 45, icon: '🎭', tier: 1, effect: { type: 'BASE_INCOME_MULTIPLIER', value: 2 }},
            { id: 'biz4_upg2', name: 'Viral Algorithm', description: 'Guaranteed to trend. Adds +0.5 to income multiplier.', cost: 800000, status: 'AVAILABLE', constructionTime: 60, icon: '📈', tier: 1, effect: { type: 'INCOME_MULTIPLIER_ADD', value: 0.5 }},
            { id: 'biz4_upg3', name: 'Sentience Simulation', description: 'Your influencers are now indistinguishable from humans. Doubles base income.', cost: 2000000, status: 'AVAILABLE', constructionTime: 90, icon: '🧠', tier: 2, requiredUpgradeId: 'biz4_upg1', effect: { type: 'BASE_INCOME_MULTIPLIER', value: 2 }},
            { id: 'biz4_upg4', name: 'Subliminal Messaging', description: 'Embed hidden commands in their content. Adds +1.0 to income multiplier.', cost: 5000000, status: 'AVAILABLE', constructionTime: 120, icon: '👁️', tier: 2, requiredUpgradeId: 'biz4_upg2', effect: { type: 'INCOME_MULTIPLIER_ADD', value: 1.0 }},
            { id: 'biz4_upg5', name: 'Political Campaign Contracts', description: 'Install your own puppet politicians. Adds +1.5 to income multiplier.', cost: 12000000, status: 'AVAILABLE', constructionTime: 150, icon: '🗳️', tier: 3, requiredUpgradeId: 'biz4_upg4', effect: { type: 'INCOME_MULTIPLIER_ADD', value: 1.5 }},
            { id: 'biz4_upg6', name: 'Global Culture AI', description: 'Shape the culture of the entire planet. Triples base income.', cost: 25000000, status: 'AVAILABLE', constructionTime: 180, icon: '🌍', tier: 3, requiredUpgradeId: 'biz4_upg3', effect: { type: 'BASE_INCOME_MULTIPLIER', value: 3 }},
            { id: 'biz4_upg7', name: 'Mass Hysteria Engine', description: 'Create and control social movements. Adds +2.0 to income multiplier.', cost: 50000000, status: 'AVAILABLE', constructionTime: 240, icon: '🔥', tier: 4, requiredUpgradeId: 'biz4_upg5', effect: { type: 'INCOME_MULTIPLIER_ADD', value: 2.0 }},
            { id: 'biz4_upg8', name: 'AI Godhead', description: 'Your prime influencer is worshipped as a digital deity. Triples base income.', cost: 100000000, status: 'AVAILABLE', constructionTime: 300, icon: '👑', tier: 5, requiredUpgradeId: 'biz4_upg6', effect: { type: 'BASE_INCOME_MULTIPLIER', value: 3 }},
        ]
    },
    {
        id: 'biz9',
        name: 'Auto-Forge Garage',
        description: 'A chop-shop for the future. Required for vehicle flipping.',
        icon: '🛠️',
        cost: 100000,
        baseIncome: 400,
        costMultiplier: 1.28,
        owned: 0,
        incomeMultiplier: 1,
        unlocked: false,
        hidden: true,
        unlockRequirements: [{ type: 'property', id: 'prop2', quantity: 1 }],
        unlockDescription: 'Requires owning the Japantown Condo.',
        upgrades: [
            { id: 'biz9_upg1', name: 'Pneumatic Wrench Set', description: 'Faster teardowns and rebuilds. Doubles base income.', cost: 1000000, status: 'AVAILABLE', constructionTime: 45, icon: '🔧', tier: 1, effect: { type: 'BASE_INCOME_MULTIPLIER', value: 2 }},
            { id: 'biz9_upg2', name: 'Hydro-lift Bays', description: 'Service more vehicles at once. Doubles base income again.', cost: 5000000, status: 'AVAILABLE', constructionTime: 60, icon: '🔩', tier: 2, requiredUpgradeId: 'biz9_upg1', effect: { type: 'BASE_INCOME_MULTIPLIER', value: 2 }},
            { id: 'biz9_upg3', name: 'Paint & Decal Booth', description: 'Cosmetic mods are pure profit. Adds +0.5 to the income multiplier.', cost: 12000000, status: 'AVAILABLE', constructionTime: 90, icon: '🎨', tier: 2, requiredUpgradeId: 'biz9_upg1', effect: { type: 'INCOME_MULTIPLIER_ADD', value: 0.5 }},
            { id: 'biz9_upg4', name: 'Performance Tuning Dyno', description: 'Squeeze every last bit of power out of an engine. Doubles base income.', cost: 25000000, status: 'AVAILABLE', constructionTime: 120, icon: '📈', tier: 3, requiredUpgradeId: 'biz9_upg2', effect: { type: 'BASE_INCOME_MULTIPLIER', value: 2 }},
            { id: 'biz9_upg5', name: 'Custom Fabrication Unit', description: '3D-print bespoke parts for high-end clients. Adds +1.0 to the income multiplier.', cost: 60000000, status: 'AVAILABLE', constructionTime: 180, icon: '🤖', tier: 3, requiredUpgradeId: 'biz9_upg3', effect: { type: 'INCOME_MULTIPLIER_ADD', value: 1.0 }},
        ],
    },
    {
        id: 'biz5',
        name: 'OmniCorp Subsidiary',
        description: 'A "legitimate" branch of the biggest player in Neo-Kyoto.',
        icon: '🏢',
        cost: 500000,
        baseIncome: 1000,
        costMultiplier: 1.3,
        owned: 0,
        incomeMultiplier: 1,
        unlocked: false,
        unlockRequirements: [{ type: 'project', id: 'proj2' }],
        upgrades: [
            { id: 'biz5_upg1', name: 'Hostile Takeover Division', description: 'Acquire smaller companies by force. Doubles base income.', cost: 5000000, status: 'AVAILABLE', constructionTime: 60, icon: '💼', tier: 1, effect: { type: 'BASE_INCOME_MULTIPLIER', value: 2 }},
            { id: 'biz5_upg2', name: 'Offshore Accounting', description: 'Taxes are for the little people. Adds +0.5 to income multiplier.', cost: 12000000, status: 'AVAILABLE', constructionTime: 90, icon: '💰', tier: 1, effect: { type: 'INCOME_MULTIPLIER_ADD', value: 0.5 }},
            { id: 'biz5_upg3', name: 'R&D Sabotage Unit', description: 'Steal and destroy rival research. Doubles base income.', cost: 25000000, status: 'AVAILABLE', constructionTime: 120, icon: '💥', tier: 2, requiredUpgradeId: 'biz5_upg1', effect: { type: 'BASE_INCOME_MULTIPLIER', value: 2 }},
            { id: 'biz5_upg4', name: 'Lobbying Powerhouse', description: 'Rewrite the laws in your favor. Adds +1.0 to income multiplier.', cost: 60000000, status: 'AVAILABLE', constructionTime: 150, icon: '🏛️', tier: 2, requiredUpgradeId: 'biz5_upg2', effect: { type: 'INCOME_MULTIPLIER_ADD', value: 1.0 }},
            { id: 'biz5_upg5', name: 'Private Military Contract', description: 'Your own army for special projects. Adds +1.5 to income multiplier.', cost: 150000000, status: 'AVAILABLE', constructionTime: 180, icon: '🛡️', tier: 3, requiredUpgradeId: 'biz5_upg4', effect: { type: 'INCOME_MULTIPLIER_ADD', value: 1.5 }},
            { id: 'biz5_upg6', name: 'Genetic Engineering Wing', description: 'Design custom lifeforms. Triples base income.', cost: 300000000, status: 'AVAILABLE', constructionTime: 240, icon: '🧬', tier: 3, requiredUpgradeId: 'biz5_upg3', effect: { type: 'BASE_INCOME_MULTIPLIER', value: 3 }},
            { id: 'biz5_upg7', name: 'Board of Directors Control', description: 'You are the board. Adds +2.0 to income multiplier.', cost: 750000000, status: 'AVAILABLE', constructionTime: 300, icon: '👑', tier: 4, requiredUpgradeId: 'biz5_upg5', effect: { type: 'INCOME_MULTIPLIER_ADD', value: 2.0 }},
            { id: 'biz5_upg8', name: 'Project Chimera', description: 'Unleash your bio-engineered creations. Triples base income.', cost: 1500000000, status: 'AVAILABLE', constructionTime: 360, icon: '👹', tier: 5, requiredUpgradeId: 'biz5_upg6', effect: { type: 'BASE_INCOME_MULTIPLIER', value: 3 }},
        ]
    },
    {
        id: 'biz6',
        name: 'Neural Interface Lab',
        description: 'Researching and developing next-gen brain-computer interfaces.',
        icon: '🧠',
        cost: 1000000,
        baseIncome: 5000,
        costMultiplier: 1.3,
        owned: 0,
        incomeMultiplier: 1,
        unlocked: false,
        hidden: true,
        unlockRequirements: [{ type: 'business', id: 'biz2', quantity: 50 }],
        unlockDescription: 'Requires owning 50 Data Scavenging Rigs.',
        upgrades: [
            { id: 'biz6_upg1', name: 'Memory Playback Tech', description: 'Relive memories, for a price. Doubles base income.', cost: 10000000, status: 'AVAILABLE', constructionTime: 90, icon: '🎞️', tier: 1, effect: { type: 'BASE_INCOME_MULTIPLIER', value: 2 }},
            { id: 'biz6_upg2', name: 'Braindance Partnership', description: 'License your tech for immersive entertainment. Adds +0.5 to income multiplier.', cost: 25000000, status: 'AVAILABLE', constructionTime: 120, icon: '💃', tier: 1, effect: { type: 'INCOME_MULTIPLIER_ADD', value: 0.5 }},
            { id: 'biz6_upg3', name: 'Skill Uploading R&D', description: 'Learn kung-fu in seconds. Doubles base income.', cost: 60000000, status: 'AVAILABLE', constructionTime: 150, icon: '📚', tier: 2, requiredUpgradeId: 'biz6_upg1', effect: { type: 'BASE_INCOME_MULTIPLIER', value: 2 }},
            { id: 'biz6_upg4', name: 'Dream Weaving Suite', description: 'Design and sell custom dreams. Adds +1.0 to income multiplier.', cost: 150000000, status: 'AVAILABLE', constructionTime: 180, icon: '🛌', tier: 2, requiredUpgradeId: 'biz6_upg2', effect: { type: 'INCOME_MULTIPLIER_ADD', value: 1.0 }},
            { id: 'biz6_upg5', name: 'Cognitive Transfer Protocol', description: 'Move a consciousness from one body to another. Adds +1.5 to income multiplier.', cost: 400000000, status: 'AVAILABLE', constructionTime: 240, icon: '🔄', tier: 3, requiredUpgradeId: 'biz6_upg4', effect: { type: 'INCOME_MULTIPLIER_ADD', value: 1.5 }},
            { id: 'biz6_upg6', name: 'AI Consciousness Merging', description: 'Fuse human and AI minds. Triples base income.', cost: 1000000000, status: 'AVAILABLE', constructionTime: 300, icon: '🤖', tier: 3, requiredUpgradeId: 'biz6_upg3', effect: { type: 'BASE_INCOME_MULTIPLIER', value: 3 }},
            { id: 'biz6_upg7', name: 'Hive Mind Network', description: 'Link multiple minds into one. Adds +2.0 to income multiplier.', cost: 2500000000, status: 'AVAILABLE', constructionTime: 360, icon: '🐝', tier: 4, requiredUpgradeId: 'biz6_upg5', effect: { type: 'INCOME_MULTIPLIER_ADD', value: 2.0 }},
            { id: 'biz6_upg8', name: 'Digital Immortality Project', description: 'Offer eternal life in the machine. Triples base income.', cost: 5000000000, status: 'AVAILABLE', constructionTime: 420, icon: '✨', tier: 5, requiredUpgradeId: 'biz6_upg6', effect: { type: 'BASE_INCOME_MULTIPLIER', value: 3 }},
        ]
    },
    {
        id: 'biz10', name: 'Corner Bodega', description: 'Selling synth-snacks and stim-packs on a street corner.', icon: '🏪', cost: 2500000, baseIncome: 12000, costMultiplier: 1.35, owned: 0, incomeMultiplier: 1, unlocked: false, unlockRequirements: [{ type: 'project', id: 'proj2' }], upgrades: []
    },
    {
        id: 'biz11', name: 'Mega-Supermarket', description: 'A city-block sized supermarket. A pillar of the community.', icon: '🛒', cost: 15000000, baseIncome: 70000, costMultiplier: 1.38, owned: 0, incomeMultiplier: 1, unlocked: false, hidden: true, unlockRequirements: [{ type: 'business', id: 'biz10', quantity: 50 }], unlockDescription: "Own 50 Corner Bodegas", upgrades: []
    },
    {
        id: 'biz12', name: 'HyperMall Chain', description: 'A nationwide chain of colossal shopping malls.', icon: '🛍️', cost: 100000000, baseIncome: 450000, costMultiplier: 1.4, owned: 0, incomeMultiplier: 1, unlocked: false, hidden: true, unlockRequirements: [{ type: 'business', id: 'biz11', quantity: 50 }], unlockDescription: "Own 50 Mega-Supermarkets", upgrades: []
    },
    {
        id: 'biz13', name: 'Sub-Orbital Logistics', description: 'Global distribution network with rocket-powered delivery.', icon: '🚀', cost: 500000000, baseIncome: 2000000, costMultiplier: 1.42, owned: 0, incomeMultiplier: 1, unlocked: false, hidden: true, unlockRequirements: [{ type: 'business', id: 'biz3', quantity: 100 }], unlockDescription: "Own 100 Black Market Courier Services", upgrades: []
    },
    {
        id: 'biz14', name: 'Neo-Kyoto Central Bank', description: 'Control the flow of capital in the entire city. The true endgame.', icon: '🏦', cost: 10000000000, baseIncome: 35000000, costMultiplier: 1.5, owned: 0, incomeMultiplier: 1, unlocked: false, hidden: true, unlockDescription: "Requires a Corporate Merger.", upgrades: []
    },
    {
        id: 'biz7',
        name: 'Cogni-Simulations Megacorp',
        description: 'A market leader in bespoke simulated realities and neural experiences.',
        icon: '🌐',
        cost: 100_000_000,
        baseIncome: 250_000,
        costMultiplier: 1.5,
        owned: 0,
        incomeMultiplier: 1,
        unlocked: false,
        hidden: true,
        unlockDescription: 'Formed through a corporate merger.',
        upgrades: [
            { id: 'biz7_upg1', name: 'Full-Immersion Worlds', description: 'Create entire digital universes. Doubles base income.', cost: 10000000000, status: 'AVAILABLE', constructionTime: 180, icon: '🌍', tier: 1, effect: { type: 'BASE_INCOME_MULTIPLIER', value: 2 }},
            { id: 'biz7_upg2', name: 'Custom Reality Subscription', description: 'Sell bespoke realities to the mega-rich. Adds +0.5 to income multiplier.', cost: 25000000000, status: 'AVAILABLE', constructionTime: 240, icon: '🎟️', tier: 1, effect: { type: 'INCOME_MULTIPLIER_ADD', value: 0.5 }},
            { id: 'biz7_upg3', name: 'Time-Dilated Simulations', description: 'Clients can live a lifetime in a day. Doubles base income.', cost: 60000000000, status: 'AVAILABLE', constructionTime: 300, icon: '⏳', tier: 2, requiredUpgradeId: 'biz7_upg1', effect: { type: 'BASE_INCOME_MULTIPLIER', value: 2 }},
            { id: 'biz7_upg4', name: 'Corporate Training Sims', description: 'The ultimate training ground for corporate armies. Adds +1.0 to income multiplier.', cost: 150000000000, status: 'AVAILABLE', constructionTime: 360, icon: '👨‍💼', tier: 2, requiredUpgradeId: 'biz7_upg2', effect: { type: 'INCOME_MULTIPLIER_ADD', value: 1.0 }},
            { id: 'biz7_upg5', name: 'Simulated Afterlife Packages', description: 'Digitize the souls of the dying. Adds +1.5 to income multiplier.', cost: 400000000000, status: 'AVAILABLE', constructionTime: 420, icon: '👻', tier: 3, requiredUpgradeId: 'biz7_upg4', effect: { type: 'INCOME_MULTIPLIER_ADD', value: 1.5 }},
            { id: 'biz7_upg6', name: 'Construct Creation Engine', description: 'Build sentient AI to populate your worlds. Triples base income.', cost: 1000000000000, status: 'AVAILABLE', constructionTime: 480, icon: '🛠️', tier: 3, requiredUpgradeId: 'biz7_upg3', effect: { type: 'BASE_INCOME_MULTIPLIER', value: 3 }},
            { id: 'biz7_upg7', name: 'Control of the "Real" World', description: 'Blur the line between simulation and reality. Adds +2.0 to income multiplier.', cost: 2500000000000, status: 'AVAILABLE', constructionTime: 540, icon: '🕹️', tier: 4, requiredUpgradeId: 'biz7_upg5', effect: { type: 'INCOME_MULTIPLIER_ADD', value: 2.0 }},
            { id: 'biz7_upg8', name: 'Become the Architect', description: 'You are the master of reality. 5x base income.', cost: 5000000000000, status: 'AVAILABLE', constructionTime: 600, icon: '👑', tier: 5, requiredUpgradeId: 'biz7_upg6', effect: { type: 'BASE_INCOME_MULTIPLIER', value: 5 }},
        ]
    }
];

export const INITIAL_UPGRADES: Upgrade[] = [
    {
        id: 'upg2',
        name: 'Neural Link Ad-Blocker',
        description: 'Boosts Synth-Coffee income by 100% (2x).',
        cost: 200,
        owned: 0,
        maxOwned: 1,
        constructionTime: 10,
        effect: { type: 'BUSINESS_IPS_MULTIPLIER', targetId: 'biz1', value: 2 },
        category: 'wetware'
    },
    {
        id: 'upg3',
        name: 'Hacker Collective',
        description: 'A shadowy group that boosts all income by 10%.',
        cost: 10000,
        owned: 0,
        costMultiplier: 3,
        baseConstructionTime: 20,
        effect: { type: 'GLOBAL_IPS_MULTIPLIER', value: 0.1 },
        category: 'wetware'
    },
    {
        id: 'upg_choice_1a',
        name: 'Subdermal Dataport',
        description: 'A direct link to your nervous system. Significantly boosts click value by 25%. Locks out Cognitive Enhancers.',
        cost: 50000,
        owned: 0,
        maxOwned: 1,
        constructionTime: 25,
        effect: { type: 'CLICK_VALUE_MULTIPLIER', value: 1.25 },
        category: 'wetware',
        mutuallyExclusiveWith: 'upg_choice_1b',
    },
    {
        id: 'upg_choice_1b',
        name: 'Cognitive Enhancer',
        description: 'Optimizes neural pathways for financial strategy. Boosts all business income by a permanent 5%. Locks out Dataports.',
        cost: 50000,
        owned: 0,
        maxOwned: 1,
        constructionTime: 25,
        effect: { type: 'GLOBAL_IPS_MULTIPLIER', value: 0.05 },
        category: 'wetware',
        mutuallyExclusiveWith: 'upg_choice_1a',
    },
    {
        id: 'upg4',
        name: 'Quantum Processors',
        description: 'Boosts Data Scavenging income by 100% (2x).',
        cost: 1500,
        owned: 0,
        maxOwned: 1,
        constructionTime: 15,
        effect: { type: 'BUSINESS_IPS_MULTIPLIER', targetId: 'biz2', value: 2 },
        category: 'wetware'
    },
    {
        id: 'cupg1',
        name: 'Aggressive Marketing AI',
        description: 'Doubles the income from the Data Scavenging Rig.',
        cost: 3000,
        owned: 0,
        maxOwned: 1,
        constructionTime: 20,
        effect: { type: 'BUSINESS_IPS_MULTIPLIER', targetId: 'biz2', value: 2 },
        category: 'corporate'
    },
    {
        id: 'cupg2',
        name: 'Logistics Optimization',
        description: 'Reduces future purchase cost scaling of Black Market Couriers by 10%.',
        cost: 10000,
        owned: 0,
        maxOwned: 1,
        constructionTime: 30,
        effect: { type: 'BUSINESS_COST_MULTIPLIER', targetId: 'biz3', value: 0.9 },
        category: 'corporate'
    },
    {
        id: 'cupg_choice_1a',
        name: 'Aggressive Negotiations AI',
        description: 'Reduces all business and upgrade costs by 5%. Locks out Supply Chain AI.',
        cost: 125000,
        owned: 0,
        maxOwned: 1,
        constructionTime: 45,
        effect: { type: 'GLOBAL_COST_REDUCTION', value: 0.05 },
        category: 'corporate',
        mutuallyExclusiveWith: 'cupg_choice_1b'
    },
    {
        id: 'cupg_choice_1b',
        name: 'Supply Chain AI',
        description: 'Streamlines all corporate logistics. Boosts all business income by 10%. Locks out Negotiations AI.',
        cost: 125000,
        owned: 0,
        maxOwned: 1,
        constructionTime: 45,
        effect: { type: 'GLOBAL_IPS_MULTIPLIER', value: 0.10 },
        category: 'corporate',
        mutuallyExclusiveWith: 'cupg_choice_1a'
    },
    {
        id: 'cupg3',
        name: 'Synergy Consultants',
        description: 'A shadowy group that boosts all income by 15%. A better deal than the hackers.',
        cost: 25000,
        owned: 0,
        costMultiplier: 3,
        baseConstructionTime: 30,
        effect: { type: 'GLOBAL_IPS_MULTIPLIER', value: 0.15 },
        category: 'corporate'
    },
    {
        id: 'cupg4',
        name: 'Auto-Trade AI',
        description: 'Unlocks the Auto-Trader feature in the St0nk Ex, allowing you to set automatic buy/sell orders.',
        cost: 100000,
        owned: 0,
        maxOwned: 1,
        constructionTime: 60,
        effect: { type: 'UNLOCK_FEATURE', feature: 'AUTO_TRADER' },
        category: 'corporate'
    },
    {
        id: 'cupg5',
        name: 'Expanded Storage',
        description: 'Increases your maximum hold for each contraband item by 5.',
        cost: 500000,
        owned: 0,
        costMultiplier: 4,
        maxOwned: 4, // Allows a total of 5 + (5*4) = 25
        constructionTime: 90,
        effect: { type: 'INCREASE_CONTRABAND_LIMIT', value: 5 },
        category: 'corporate'
    },
    {
        id: 'upg_hidden',
        name: 'Blackout Protocol',
        description: 'Disrupts rival networks, permanently boosting all income by 25%.',
        cost: 500000,
        owned: 0,
        maxOwned: 1,
        constructionTime: 120,
        effect: { type: 'GLOBAL_IPS_MULTIPLIER', value: 0.25 },
        category: 'wetware',
        hidden: true,
        unlockDescription: 'Unlock by completing the "Corporate Shell Acquisition" project.'
    }
];

export const INITIAL_PROJECTS: Project[] = [
    {
        id: 'proj1',
        name: 'Secure Server Farm',
        description: 'To run an AI Influencer farm, you need a secure, off-grid server location. This unlocks the AI Influencer Farm business.',
        cost: 15000,
        status: 'LOCKED'
    },
    {
        id: 'proj2',
        name: 'Corporate Shell Acquisition',
        description: 'Buy a defunct corporation to use as a legal front. Unlocks the OmniCorp Subsidiary and full Corp HQ functionality.',
        cost: 300000,
        status: 'LOCKED'
    }
];

export const INITIAL_STOCKS: Stock[] = [
    {
        id: 'stock_omni',
        name: 'OmniCorp Dynamics',
        ticker: 'OMNI',
        price: 450,
        owned: 0,
        volatility: 0.01,
        category: 'Blue Chip',
        type: 'Stock',
        tradingVolume: 0,
        basePrice: 450,
        simulationCycle: STOCK_HISTORY_LENGTH,
        simulationFrequency: 0.05,
        simulationAmplitude: 450 * 0.1, // Amplitude is 10% of base price
        priceHistory: generateInitialSineHistory(450, STOCK_HISTORY_LENGTH, 0.05, 450 * 0.1, 0.01),
        volumeHistory: generateInitialVolumeHistory(50000, STOCK_HISTORY_LENGTH, 0.01),
        autoTrader: { enabled: false, buyPrice: null, buyQuantity: 10, sellPriceHigh: null, sellPriceLow: null, sellQuantity: 10 }
    },
    {
        id: 'stock_zeta',
        name: 'ZetaTech Innovations',
        ticker: 'ZETA',
        price: 85,
        owned: 0,
        volatility: 0.03,
        category: 'Growth Stock',
        type: 'Stock',
        tradingVolume: 0,
        basePrice: 85,
        simulationCycle: STOCK_HISTORY_LENGTH,
        simulationFrequency: 0.08,
        simulationAmplitude: 85 * 0.2, // 20%
        priceHistory: generateInitialSineHistory(85, STOCK_HISTORY_LENGTH, 0.08, 85 * 0.2, 0.03),
        volumeHistory: generateInitialVolumeHistory(35000, STOCK_HISTORY_LENGTH, 0.03),
        autoTrader: { enabled: false, buyPrice: null, buyQuantity: 10, sellPriceHigh: null, sellPriceLow: null, sellQuantity: 10 }
    },
    {
        id: 'stock_cybr',
        name: 'CyberSec Solutions',
        ticker: 'CYBR',
        price: 75,
        owned: 0,
        volatility: 0.04,
        category: 'Growth Stock',
        type: 'Stock',
        tradingVolume: 0,
        basePrice: 75,
        simulationCycle: STOCK_HISTORY_LENGTH,
        simulationFrequency: 0.06,
        simulationAmplitude: 75 * 0.18, // 18%
        priceHistory: generateInitialSineHistory(75, STOCK_HISTORY_LENGTH, 0.06, 75 * 0.18, 0.04),
        volumeHistory: generateInitialVolumeHistory(30000, STOCK_HISTORY_LENGTH, 0.04),
        autoTrader: { enabled: false, buyPrice: null, buyQuantity: 10, sellPriceHigh: null, sellPriceLow: null, sellQuantity: 10 }
    },
    {
        id: 'stock_glitch',
        name: 'GlitchNet Solutions',
        ticker: 'GLCH',
        price: 4.20,
        owned: 0,
        volatility: 0.1,
        category: 'Speculative',
        type: 'Stock',
        tradingVolume: 0,
        basePrice: 4.20,
        simulationCycle: STOCK_HISTORY_LENGTH,
        simulationFrequency: 0.2,
        simulationAmplitude: 4.20 * 0.4, // 40%
        priceHistory: generateInitialSineHistory(4.20, STOCK_HISTORY_LENGTH, 0.2, 4.20 * 0.4, 0.1),
        volumeHistory: generateInitialVolumeHistory(15000, STOCK_HISTORY_LENGTH, 0.1),
        autoTrader: { enabled: false, buyPrice: null, buyQuantity: 10, sellPriceHigh: null, sellPriceLow: null, sellQuantity: 10 }
    },
     {
        id: 'stock_scav',
        name: 'Scav-Life Biowaste',
        ticker: 'SCVL',
        price: 1.50,
        owned: 0,
        volatility: 0.15,
        category: 'Speculative',
        type: 'Stock',
        tradingVolume: 0,
        basePrice: 1.50,
        simulationCycle: STOCK_HISTORY_LENGTH,
        simulationFrequency: 0.25,
        simulationAmplitude: 1.50 * 0.6, // 60%
        priceHistory: generateInitialSineHistory(1.50, STOCK_HISTORY_LENGTH, 0.25, 1.50 * 0.6, 0.15),
        volumeHistory: generateInitialVolumeHistory(10000, STOCK_HISTORY_LENGTH, 0.15),
        autoTrader: { enabled: false, buyPrice: null, buyQuantity: 10, sellPriceHigh: null, sellPriceLow: null, sellQuantity: 10 }
    },
    {
        id: 'crypto_eth',
        name: 'Aetherium',
        ticker: 'AETH',
        price: 2500,
        owned: 0,
        volatility: 0.05,
        category: 'Crypto',
        type: 'Crypto',
        tradingVolume: 0,
        basePrice: 2500,
        simulationCycle: STOCK_HISTORY_LENGTH,
        simulationFrequency: 0.12,
        simulationAmplitude: 2500 * 0.25, // 25%
        priceHistory: generateInitialSineHistory(2500, STOCK_HISTORY_LENGTH, 0.12, 2500 * 0.25, 0.05),
        volumeHistory: generateInitialVolumeHistory(8000, STOCK_HISTORY_LENGTH, 0.05),
        autoTrader: { enabled: false, buyPrice: null, buyQuantity: 10, sellPriceHigh: null, sellPriceLow: null, sellQuantity: 10 }
    },
    {
        id: 'crypto_doge',
        name: 'DogeCoin',
        ticker: 'DOGE',
        price: 0.15,
        owned: 0,
        volatility: 0.2,
        category: 'Crypto',
        type: 'Crypto',
        tradingVolume: 0,
        basePrice: 0.15,
        simulationCycle: STOCK_HISTORY_LENGTH,
        simulationFrequency: 0.3,
        simulationAmplitude: 0.15 * 0.8, // 80%
        priceHistory: generateInitialSineHistory(0.15, STOCK_HISTORY_LENGTH, 0.3, 0.15 * 0.8, 0.2),
        volumeHistory: generateInitialVolumeHistory(25000, STOCK_HISTORY_LENGTH, 0.2),
        autoTrader: { enabled: false, buyPrice: null, buyQuantity: 10, sellPriceHigh: null, sellPriceLow: null, sellQuantity: 10 }
    },
    {
        id: 'crypto_bitc',
        name: 'Bit-Credit',
        ticker: 'BITC',
        price: 45000,
        owned: 0,
        volatility: 0.04,
        category: 'Crypto',
        type: 'Crypto',
        tradingVolume: 0,
        basePrice: 45000,
        simulationCycle: STOCK_HISTORY_LENGTH,
        simulationFrequency: 0.09,
        simulationAmplitude: 45000 * 0.2, // 20%
        priceHistory: generateInitialSineHistory(45000, STOCK_HISTORY_LENGTH, 0.09, 45000 * 0.2, 0.04),
        volumeHistory: generateInitialVolumeHistory(2000, STOCK_HISTORY_LENGTH, 0.04),
        autoTrader: { enabled: false, buyPrice: null, buyQuantity: 10, sellPriceHigh: null, sellPriceLow: null, sellQuantity: 10 }
    }
];

export const INITIAL_ITEMS: Item[] = [
    {
        id: 'item1',
        name: 'Illegal Neural Mod',
        description: 'Boosts Synth-Coffee income by 50%.',
        price: 2500,
        owned: 0,
        type: 'contraband',
        effect: { type: 'BUSINESS_IPS_MULTIPLIER', targetId: 'biz1', value: 1.5 }
    },
    {
        id: 'item2',
        name: 'Corpo-War Data Chip',
        description: 'Boosts Data Scavenging income by 40%.',
        price: 10000,
        owned: 0,
        type: 'contraband',
        effect: { type: 'BUSINESS_IPS_MULTIPLIER', targetId: 'biz2', value: 1.4 }
    },
    {
        id: 'item_intel1',
        name: 'Black Market Intel',
        description: 'A data shard with encrypted mission parameters. Consumed on purchase, permanently unlocking new, high-stakes missions at Corp HQ.',
        price: 1000000,
        owned: 0,
        type: 'contraband',
        effect: { type: 'UNLOCK_MISSIONS' },
    },
    {
        id: 'item3',
        name: 'Kusanagi T-2077',
        description: 'Legendary street racer. When assigned as Company Car, boosts all income by 2%.',
        price: 500000,
        owned: 0,
        type: 'car',
        effect: { type: 'COMPANY_CAR_IPS_BOOST', value: 0.02 }
    },
    {
        id: 'item4',
        name: 'Rayfield Caliburn',
        description: 'Hypercar of the elite. When assigned as Company Car, boosts all income by 5%.',
        price: 2500000,
        owned: 0,
        type: 'car',
        effect: { type: 'COMPANY_CAR_IPS_BOOST', value: 0.05 }
    },
    {
        id: 'item5',
        name: 'The Leviathan',
        description: 'A discreet submersible yacht. Provides a permanent 5% global cost reduction.',
        price: 25000000,
        owned: 0,
        type: 'yacht',
        effect: { type: 'GLOBAL_COST_REDUCTION', value: 0.05 }
    },
     {
        id: 'item6',
        name: 'AV-9 SkySovereign',
        description: 'Military-grade VTOL. Reduces mission duration by 20%.',
        price: 100000000,
        owned: 0,
        type: 'plane',
        effect: { type: 'MISSION_DURATION_MODIFIER', value: 0.8 }
    },
    {
        id: 'item7',
        name: 'Arasaka Penthouse',
        description: 'Live at the top of the world. Passively boosts all income by 25%.',
        price: 1000000000,
        owned: 0,
        type: 'residence',
        effect: { type: 'GLOBAL_IPS_MULTIPLIER', value: 0.25 },
        hidden: true,
        unlockBalance: 1000000000,
    }
];

const createDefaultImprovements = (): Record<ImprovementType, { level: number; maxLevel: number; baseCost: number }> => ({
    [ImprovementType.Plumbing]: { level: 0, maxLevel: 5, baseCost: 1000 },
    [ImprovementType.Electrical]: { level: 0, maxLevel: 5, baseCost: 1200 },
    [ImprovementType.Structural]: { level: 0, maxLevel: 5, baseCost: 2500 },
    [ImprovementType.Cosmetics]: { level: 0, maxLevel: 5, baseCost: 800 },
    [ImprovementType.Security]: { level: 0, maxLevel: 5, baseCost: 1500 },
    [ImprovementType.Tech]: { level: 0, maxLevel: 5, baseCost: 2000 },
});

export const INITIAL_FLIPPABLE_PROPERTIES: FlippableProperty[] = [
    {
        id: 'prop1',
        name: 'Container Loft',
        description: 'A cramped but stylish starting point in the Watson District.',
        owned: true,
        forSale: false,
        auctionPrice: 50000,
        baseValue: 75000,
        condition: PropertyCondition.Fair,
        isRented: true,
        baseIncome: 50,
        improvements: {
            ...createDefaultImprovements(),
            [ImprovementType.Cosmetics]: { level: 2, maxLevel: 5, baseCost: 800 },
            [ImprovementType.Tech]: { level: 1, maxLevel: 5, baseCost: 2000 },
        }
    },
    {
        id: 'prop2',
        name: 'Japantown Condo',
        description: 'Sleek, modern, and right in the heart of the action.',
        owned: false,
        forSale: true,
        auctionPrice: 180000,
        baseValue: 300000,
        condition: PropertyCondition.Rundown,
        isRented: false,
        baseIncome: 300,
        improvements: createDefaultImprovements()
    },
    {
        id: 'prop3',
        name: 'Corpo Plaza Skyscraper',
        description: 'An entire floor in a prestigious downtown tower. A true statement of power.',
        owned: false,
        forSale: false, // Appears on auction later
        auctionPrice: 3500000,
        baseValue: 6000000,
        condition: PropertyCondition.Derelict,
        isRented: false,
        baseIncome: 7500,
        improvements: createDefaultImprovements()
    },
    {
        id: 'prop4',
        name: 'Watson Slum Tenement',
        description: 'A crumbling block in the old district. Four walls and a roof, sometimes.',
        owned: false,
        forSale: true,
        auctionPrice: 25000,
        baseValue: 40000,
        condition: PropertyCondition.Derelict,
        isRented: false,
        baseIncome: 20,
        improvements: createDefaultImprovements()
    },
    {
        id: 'prop5',
        name: 'Trailer Park Caravan',
        description: 'Mobile living for the modern nomad. Rust included.',
        owned: false,
        forSale: true,
        auctionPrice: 35000,
        baseValue: 55000,
        condition: PropertyCondition.Rundown,
        isRented: false,
        baseIncome: 35,
        improvements: createDefaultImprovements()
    },
    {
        id: 'prop6',
        name: 'Suburban High-Rise Apt.',
        description: 'A cookie-cutter apartment in a sprawling residential tower. Safe, sterile, profitable.',
        owned: false,
        forSale: true,
        auctionPrice: 350000,
        baseValue: 500000,
        condition: PropertyCondition.Fair,
        isRented: false,
        baseIncome: 450,
        improvements: createDefaultImprovements()
    },
    {
        id: 'prop7',
        name: 'Charter Hill Penthouse',
        description: 'A luxurious sky-high residence with a balcony overlooking the city. For the true elite.',
        owned: false,
        forSale: false, // Appears on auction later
        auctionPrice: 7000000,
        baseValue: 12000000,
        condition: PropertyCondition.Good,
        isRented: false,
        baseIncome: 15000,
        improvements: createDefaultImprovements()
    }
];

export const INITIAL_STAFF: Personnel[] = [
    {
        id: 'staff1',
        name: 'Junior Analyst',
        description: 'Each analyst provides a small but permanent +0.1% boost to global income.',
        cost: 250_000,
        costMultiplier: 1.2,
        owned: 0,
        effect: { type: 'GLOBAL_IPS_MULTIPLIER', value: 0.001 }
    },
    {
        id: 'staff2',
        name: 'Corporate Lawyer',
        description: 'A sharp legal mind. Each lawyer provides a permanent +0.5% boost to global income.',
        cost: 2_000_000,
        costMultiplier: 1.3,
        owned: 0,
        effect: { type: 'GLOBAL_IPS_MULTIPLIER', value: 0.005 }
    }
];

export const INITIAL_SECURITY: Personnel[] = [
     {
        id: 'sec1',
        name: 'Rent-a-Cop',
        description: 'Basic on-site security. Each provides a tiny 0.05% reduction to all costs.',
        cost: 100_000,
        costMultiplier: 1.25,
        owned: 0,
        effect: { type: 'GLOBAL_COST_REDUCTION', value: 0.0005 }
    },
    {
        id: 'sec2',
        name: 'Ex-Military Contractor',
        description: 'Elite corporate soldiers. Each provides a 0.25% reduction to all costs.',
        cost: 1_500_000,
        costMultiplier: 1.35,
        owned: 0,
        effect: { type: 'GLOBAL_COST_REDUCTION', value: 0.0025 }
    }
];

export const INITIAL_MERGERS: Merger[] = [
    {
        id: 'merger1',
        name: 'Cogni-Simulations Megacorp',
        description: 'Merge your AI and Neural Research divisions to create a market leader in simulated realities. This will consume the required businesses.',
        requirements: [
            { type: 'balance', quantity: 1_000_000_000 },
            { type: 'project', id: 'proj2' },
            { type: 'business', id: 'biz4', quantity: 50 }, // AI Influencer Farm
            { type: 'business', id: 'biz6', quantity: 25 }, // Neural Interface Lab
            { type: 'item', id: 'item7', quantity: 1 } // Arasaka Penthouse
        ],
        result: { type: 'unlock_business', id: 'biz7' },
        status: 'AVAILABLE',
    }
];
