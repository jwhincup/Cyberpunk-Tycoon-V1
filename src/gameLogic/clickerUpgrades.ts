export interface ClickerUpgradeInfo {
    level: number;
    cost: number;
    clickValueIncrease: number;
    description: string;
}

const BASE_COST = 10;
const BASE_MULTIPLIER = 1.2;
const TIER_COST_MULTIPLIER = 10;

export const getClickerUpgradeInfo = (currentLevel: number): ClickerUpgradeInfo => {
    const nextLevel = currentLevel + 1;
    let clickValueIncrease = 1;
    let description = "";

    // Determine the bonus for the next level
    if (nextLevel % 25 === 0) {
        // Major bonus every 25 levels
        clickValueIncrease = currentLevel * 10;
        description = `+${clickValueIncrease} (Major Interface Overhaul)`;
    } else if (nextLevel % 5 === 0) {
        // Medium bonus every 5 levels
        clickValueIncrease = Math.floor(currentLevel * 1.5);
        description = `+${clickValueIncrease} (Efficiency Boost)`;
    } else {
        // Standard small bonus
        clickValueIncrease = Math.floor(1 + (currentLevel / 2));
        description = `+${clickValueIncrease}`;
    }

    // Calculate cost with scaling tiers
    const tier = Math.floor((currentLevel - 1) / 10);
    const cost = Math.floor(BASE_COST * Math.pow(BASE_MULTIPLIER, currentLevel) * Math.pow(TIER_COST_MULTIPLIER, tier));
    
    return {
        level: nextLevel,
        cost,
        clickValueIncrease,
        description,
    };
};
