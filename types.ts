
// FIX: Removed circular self-import of StockCategory.

export interface GameState {
    balance: number;
    clickValue: number;
    clickerLevel: number;
    businesses: Business[];
    upgrades: Upgrade[];
    projects: Project[];
    stocks: Stock[];
    items: Item[];
    flippableProperties: FlippableProperty[];
    autoTraderUnlocked: boolean;
    activeBoosts: Boost[];
    missions: Mission[];
    lastMissionCheck: number; // timestamp
    // New market state
    marketStatus: MarketEvent;
    activeNews: NewsEvent[];
    // New late-game state
    staff: Personnel[];
    security: Personnel[];
    mergers: Merger[];
    assignedCarId: string | null;
    // Prestige state
    prestigePoints: number;
    planetsVisited: number;
    // New gameplay mechanics
    contrabandLimit: number;
}

export type BusinessUpgradeEffect = 
    | { type: 'BASE_INCOME_MULTIPLIER'; value: number }
    | { type: 'INCOME_MULTIPLIER_ADD'; value: number };

export interface BusinessUpgrade {
    id: string;
    name: string;
    description: string;
    cost: number;
    status: 'AVAILABLE' | 'CONSTRUCTING' | 'OWNED';
    constructionTime: number; // in seconds
    constructionTimeLeft?: number; // in seconds
    icon: string;
    tier: number;
    requiredUpgradeId?: string;
    effect: BusinessUpgradeEffect;
}

export interface Business {
    id:string;
    name: string;
    description: string;
    icon: string;
    cost: number;
    baseIncome: number;
    costMultiplier: number;
    owned: number;
    incomeMultiplier: number;
    unlocked: boolean;
    unlockRequirements?: UnlockRequirement[];
    upgrades: BusinessUpgrade[];
    hidden?: boolean;
    unlockDescription?: string;
}

export type UpgradeEffect = 
    | { type: 'CLICK_VALUE_ADD'; value: number }
    | { type: 'CLICK_VALUE_MULTIPLIER'; value: number }
    | { type: 'BUSINESS_IPS_MULTIPLIER'; targetId: string; value: number }
    | { type: 'GLOBAL_IPS_MULTIPLIER'; value: number }
    | { type: 'BUSINESS_COST_MULTIPLIER'; targetId: string; value: number }
    | { type: 'UNLOCK_FEATURE'; feature: 'AUTO_TRADER' }
    | { type: 'GLOBAL_COST_REDUCTION'; value: number }
    | { type: 'INCREASE_CONTRABAND_LIMIT'; value: number };

export interface Upgrade {
    id: string;
    name: string;
    description: string;
    cost: number;
    owned: number;
    costMultiplier?: number;
    maxOwned?: number;
    baseConstructionTime?: number; // in seconds, for multi-level upgrades
    constructionTime?: number; // in seconds, for single-level upgrades
    isConstructing?: boolean;
    constructionTimeLeft?: number; // in seconds
    effect: UpgradeEffect;
    category: 'wetware' | 'corporate';
    hidden?: boolean;
    unlockDescription?: string;
    mutuallyExclusiveWith?: string; // ID of the other upgrade
    isLocked?: boolean; // To lock out after a choice is made
}

export interface Project {
    id: string;
    name: string;
    description: string;
    cost: number;
    status: 'LOCKED' | 'COMPLETED';
}

export type StockCategory = 'Blue Chip' | 'Growth Stock' | 'Speculative' | 'Crypto';

export interface AutoTraderSettings {
    enabled: boolean;
    buyPrice: number | null;
    buyQuantity: number;
    sellPriceHigh: number | null; // Take profit
    sellPriceLow: number | null;  // Stop loss
    sellQuantity: number;
}

export interface Stock {
    id: string;
    name: string;
    ticker: string;
    price: number;
    owned: number;
    volatility: number;
    category: StockCategory;
    type: 'Stock' | 'Crypto';
    tradingVolume: number;
    priceHistory: number[];
    volumeHistory: number[];
    autoTrader: AutoTraderSettings;
    // New properties for sine wave simulation
    basePrice: number;
    simulationCycle: number;
    simulationFrequency: number;
    simulationAmplitude: number;
}

export type ItemEffect = 
    | { type: 'GLOBAL_IPS_MULTIPLIER'; value: number }
    | { type: 'BUSINESS_IPS_MULTIPLIER'; targetId: string; value: number }
    | { type: 'COMPANY_CAR_IPS_BOOST'; value: number }
    | { type: 'GLOBAL_COST_REDUCTION'; value: number }
    | { type: 'MISSION_DURATION_MODIFIER'; value: number }
    | { type: 'UNLOCK_MISSIONS' };

export interface Item {
    id: string;
    name: string;
    description: string;
    price: number;
    owned: number;
    type: 'contraband' | 'car' | 'yacht' | 'plane' | 'residence';
    effect: ItemEffect;
    hidden?: boolean;
    unlockBalance?: number;
}

export enum PropertyCondition {
    Derelict = 'Derelict',
    Rundown = 'Rundown',
    Fair = 'Fair',
    Good = 'Good',
    Excellent = 'Excellent',
    Pristine = 'Pristine'
}

export enum ImprovementType {
    Plumbing = 'Plumbing',
    Electrical = 'Electrical',
    Structural = 'Structural',
    Cosmetics = 'Cosmetics',
    Security = 'Security',
    Tech = 'Tech'
}

export interface Improvement {
    level: number;
    maxLevel: number;
    baseCost: number;
}

export interface FlippableProperty {
    id: string;
    name: string;
    description: string;
    owned: boolean;
    forSale: boolean; // Is it on the auction house
    auctionPrice: number;
    baseValue: number; // Base value when pristine
    condition: PropertyCondition;
    improvements: Record<ImprovementType, Improvement>;
    isRented: boolean;
    baseIncome: number; // base income when rented & pristine
}


export interface Boost {
    id: string;
    description: string;
    type: 'INCOME' | 'COST_REDUCTION';
    multiplier: number; // e.g., 1.2 for +20% income, or 0.9 for -10% cost
    expiresAt: number; // timestamp
}

export type MissionRarity = 'Common' | 'Uncommon' | 'Rare';

export type MissionReward = 
    | { type: 'INCOME_BOOST'; multiplier: number; duration: number } // duration in seconds
    | { type: 'COST_REDUCTION'; multiplier: number; duration: number }; // duration in seconds

export interface Mission {
    id: string;
    title: string;
    description: string;
    boss: string;
    status: 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED';
    reward: MissionReward;
    duration: number; // time to complete in seconds
    timeLeft?: number; // time remaining to complete
    expiresIn: number; // time until it disappears from the board if not accepted
    rarity: MissionRarity;
}

// Corp HQ: Personnel (Staff & Security)
export interface Personnel {
    id: string;
    name: string;
    description: string;
    cost: number;
    costMultiplier: number;
    owned: number;
    effect: {
        type: 'GLOBAL_IPS_MULTIPLIER' | 'GLOBAL_COST_REDUCTION';
        value: number; // The bonus per person
    };
}

// Corp HQ: Mergers
export type UnlockRequirement = 
    | { type: 'business'; id: string; quantity: number }
    | { type: 'item'; id: string; quantity: number }
    | { type: 'balance'; quantity: number }
    | { type: 'project'; id: string }
    | { type: 'property'; id: string; quantity: number };

export interface Merger {
    id: string;
    name: string;
    description: string;
    requirements: UnlockRequirement[];
    result: {
        type: 'unlock_business';
        id: string;
    };
    status: 'AVAILABLE' | 'COMPLETED';
}

export interface MarketEvent {
    type: 'BOOM' | 'CRASH' | 'NORMAL';
    name: string;
    description: string;
    multiplier: number;
    duration: number; // in seconds
    timeLeft: number; // in seconds
}

export interface NewsEvent {
    id: string; // To uniquely identify for removal
    name: string;
    description: string;
    category: StockCategory;
    multiplier: number;
    duration: number; // in seconds
    timeLeft: number; // in seconds
}


export enum Panel {
    Businesses = "Syndicates",
    Upgrades = "Wetware",
    CompanyUpgrades = "Corp HQ",
    Projects = "Schematics",
    StockMarket = "St0nk Ex",
    Market = "Night Market",
    RealEstate = "Real Estate",
    Stats = "Dashboard"
}
