
import React, { useState, useEffect, useCallback } from 'react';
// FIX: Imported types and constants for market simulation feature.
import { GameState, Business, Upgrade, Project, Stock, Item, Panel, BusinessUpgrade, AutoTraderSettings, FlippableProperty, Mission, MissionRarity, MissionReward, UnlockRequirement, Personnel, ImprovementType, MarketEvent, NewsEvent } from '../types';
import { 
    INITIAL_BUSINESSES, INITIAL_UPGRADES, INITIAL_PROJECTS, INITIAL_STOCKS, INITIAL_ITEMS, STOCK_HISTORY_LENGTH, 
    INITIAL_FLIPPABLE_PROPERTIES,
    MISSION_GENERATION_INTERVAL, MAX_MISSIONS, MISSION_TEMPLATES, RARITY_CONFIG, MISSION_EXPIRATION_TIME,
    INITIAL_STAFF, INITIAL_SECURITY, INITIAL_MERGERS,
    PRESTIGE_REQUIREMENT, PLANETS,
    MARKET_EVENT_CHANCE, NEWS_EVENT_CHANCE, NORMAL_MARKET_STATUS, MARKET_EVENT_TEMPLATES, NEWS_EVENT_TEMPLATES
} from '../constants';
import { formatNumber } from '../utils/formatters';
import { useGameLoop } from '../hooks/useGameLoop';
import { getClickerUpgradeInfo } from './gameLogic/clickerUpgrades';

import Header from '../components/Header';
import Clicker from '../components/Clicker';
import MainPanel from '../components/MainPanel';
import BusinessPanel from '../components/BusinessPanel';
import UpgradesPanel from '../components/UpgradesPanel';
import CompanyUpgradesPanel from '../components/CompanyUpgradesPanel';
import ProjectsPanel from '../components/ProjectsPanel';
import MarketPanel from '../components/MarketPanel';
import StockMarketPanel from '../components/StockMarketPanel';
import StatsPanel from '../components/StatsPanel';
import DevPanel from '../components/DevPanel';
import RealEstatePanel from '../components/RealEstatePanel';

// FIX: Added missing marketStatus and activeNews properties to initial game state.
const createInitialGameState = (): GameState => ({
    balance: 20,
    clickValue: 1,
    clickerLevel: 1,
    businesses: JSON.parse(JSON.stringify(INITIAL_BUSINESSES)),
    upgrades: JSON.parse(JSON.stringify(INITIAL_UPGRADES)),
    projects: JSON.parse(JSON.stringify(INITIAL_PROJECTS)),
    stocks: JSON.parse(JSON.stringify(INITIAL_STOCKS)),
    items: JSON.parse(JSON.stringify(INITIAL_ITEMS)),
    flippableProperties: JSON.parse(JSON.stringify(INITIAL_FLIPPABLE_PROPERTIES)),
    autoTraderUnlocked: false,
    activeBoosts: [],
    missions: [],
    lastMissionCheck: Date.now(),
    marketStatus: JSON.parse(JSON.stringify(NORMAL_MARKET_STATUS)),
    activeNews: [],
    staff: JSON.parse(JSON.stringify(INITIAL_STAFF)),
    security: JSON.parse(JSON.stringify(INITIAL_SECURITY)),
    mergers: JSON.parse(JSON.stringify(INITIAL_MERGERS)),
    assignedCarId: null,
    prestigePoints: 0,
    planetsVisited: 0,
    contrabandLimit: 5,
});


const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>(createInitialGameState);
    const [activePanel, setActivePanel] = useState<Panel>(Panel.Businesses);
    const [totalIPS, setTotalIPS] = useState(0);
    const [isDevMode, setIsDevMode] = useState(false);
    const [unlockedMissions, setUnlockedMissions] = useState<Set<string>>(new Set(['m_heist', 'm_extract', 'm_market', 'm_disrupt', 'm_proto', 'm_takeover']));

    const calculateIPS = useCallback(() => {
        const businessSpecificItemMultipliers = gameState.items.reduce((acc, item) => {
            if (item.owned > 0 && item.effect.type === 'BUSINESS_IPS_MULTIPLIER') {
                const targetId = item.effect.targetId;
                acc[targetId] = (acc[targetId] || 1) * Math.pow(item.effect.value, item.owned);
            }
            return acc;
        }, {} as Record<string, number>);

        const businessIPS = gameState.businesses.reduce((total, business) => {
            const itemMultiplier = businessSpecificItemMultipliers[business.id] || 1;
            
            let effectiveBaseIncome = business.baseIncome;
            let effectiveIncomeMultiplier = business.incomeMultiplier;

            business.upgrades.forEach(upg => {
                if (upg.status === 'OWNED') {
                    switch (upg.effect.type) {
                        case 'BASE_INCOME_MULTIPLIER':
                            effectiveBaseIncome *= upg.effect.value;
                            break;
                        case 'INCOME_MULTIPLIER_ADD':
                            effectiveIncomeMultiplier += upg.effect.value;
                            break;
                    }
                }
            });

            const finalMultiplier = effectiveIncomeMultiplier * itemMultiplier;
            return total + (business.owned * effectiveBaseIncome * finalMultiplier);
        }, 0);

        const propertyIPS = gameState.flippableProperties.reduce((total, prop) => {
            if (prop.owned && prop.isRented) {
                return total + prop.baseIncome;
            }
            return total;
        }, 0);

        const totalBase = businessIPS + propertyIPS;

        let totalMultiplier = 1;
        
        const upgradeBoosts = gameState.upgrades
            .reduce((sum, u) => {
                if (u.owned > 0 && u.effect.type === 'GLOBAL_IPS_MULTIPLIER') {
                    return sum + u.effect.value * u.owned;
                }
                return sum;
            }, 0);
        
        const itemBoosts = gameState.items
            .reduce((sum, i) => {
                if (i.owned > 0 && i.effect.type === 'GLOBAL_IPS_MULTIPLIER') {
                    return sum + i.effect.value * i.owned;
                }
                return sum;
            }, 0);

        const staffBoosts = gameState.staff
            .reduce((sum, s) => sum + s.effect.value * s.owned, 0);
        
        const assignedCarBoost = (() => {
            if (!gameState.assignedCarId) return 0;
            const car = gameState.items.find(i => i.id === gameState.assignedCarId);
            if (car && car.effect.type === 'COMPANY_CAR_IPS_BOOST') {
                return car.effect.value;
            }
            return 0;
        })();

        totalMultiplier += upgradeBoosts + itemBoosts + staffBoosts + assignedCarBoost;

        gameState.activeBoosts
            .filter(b => b.type === 'INCOME')
            .forEach(b => { totalMultiplier *= b.multiplier });

        const prestigeMultiplier = 1 + (gameState.prestigePoints * 0.10);

        return totalBase * totalMultiplier * prestigeMultiplier;
    }, [gameState.businesses, gameState.upgrades, gameState.items, gameState.flippableProperties, gameState.activeBoosts, gameState.staff, gameState.assignedCarId, gameState.prestigePoints]);

    useEffect(() => {
        setTotalIPS(calculateIPS());
    }, [gameState.businesses, gameState.upgrades, gameState.items, gameState.flippableProperties, gameState.activeBoosts, gameState.staff, gameState.assignedCarId, gameState.prestigePoints, calculateIPS]);
    
    const checkRequirements = useCallback((requirements: UnlockRequirement[] | undefined, state: GameState): boolean => {
        if (!requirements || requirements.length === 0) {
            return true;
        }
        return requirements.every(req => {
            switch (req.type) {
                case 'balance': return state.balance >= req.quantity;
                case 'business': return (state.businesses.find(b => b.id === req.id)?.owned || 0) >= req.quantity;
                case 'item': return (state.items.find(i => i.id === req.id)?.owned || 0) >= req.quantity;
                case 'project': return (state.projects.find(p => p.id === req.id)?.status) === 'COMPLETED';
                case 'property': return (state.flippableProperties.find(p => p.id === req.id)?.owned ? 1 : 0) >= req.quantity;
                default: return false;
            }
        });
    }, []);

    const generateMission = (): Mission | null => {
        const availableTemplates = MISSION_TEMPLATES.filter(t => unlockedMissions.has(t.id));
        if (availableTemplates.length === 0) return null;

        const rarityKeys = Object.keys(RARITY_CONFIG) as MissionRarity[];
        const totalWeight = rarityKeys.reduce((sum, key) => sum + RARITY_CONFIG[key].weight, 0);

        let randomWeight = Math.random() * totalWeight;
        let rarity: MissionRarity = 'Common';

        for (const key of rarityKeys) {
            const config = RARITY_CONFIG[key];
            if (randomWeight < config.weight) {
                rarity = key;
                break;
            }
            randomWeight -= config.weight;
        }

        const template = availableTemplates[Math.floor(Math.random() * availableTemplates.length)];
        const rewardTemplate = RARITY_CONFIG[rarity].rewards[Math.floor(Math.random() * RARITY_CONFIG[rarity].rewards.length)];
        
        const missionDurationModifier = gameState.items.reduce((mod, item) => {
            if (item.owned > 0 && item.effect.type === 'MISSION_DURATION_MODIFIER') {
                return mod * item.effect.value;
            }
            return mod;
        }, 1);
        
        return {
            id: `mission-${Date.now()}-${Math.random()}`,
            status: 'AVAILABLE',
            rarity,
            ...template,
            reward: { ...rewardTemplate },
            duration: (10 + Math.random() * 50) * missionDurationModifier,
            expiresIn: MISSION_EXPIRATION_TIME,
        };
    };

    // FIX: Added market simulation logic to update stock prices and market events.
    const handleGameTick = () => {
        const now = Date.now();
        const corpShellProject = gameState.projects.find(p => p.id === 'proj2');
        const isCorpUnlocked = corpShellProject?.status === 'COMPLETED';

        setGameState(prev => {
            let newBalance = prev.balance + totalIPS;
            let newMissions = [...prev.missions];
            let newActiveBoosts = [...prev.activeBoosts];
            let lastMissionCheck = prev.lastMissionCheck;

            if (isCorpUnlocked) {
                if (now - prev.lastMissionCheck > MISSION_GENERATION_INTERVAL) {
                    lastMissionCheck = now;
                    const availableMissions = prev.missions.filter(m => m.status === 'AVAILABLE').length;
                    if (availableMissions < MAX_MISSIONS) {
                        const newMission = generateMission();
                        if (newMission) newMissions.push(newMission);
                    }
                }

                newMissions = newMissions.map(m => {
                    if (m.status === 'AVAILABLE') {
                        const expiresIn = m.expiresIn - 1;
                        if (expiresIn <= 0) return null;
                        return { ...m, expiresIn };
                    }
                    if (m.status === 'IN_PROGRESS' && m.timeLeft !== undefined) {
                        const timeLeft = m.timeLeft - 1;
                        if (timeLeft <= 0) {
                            const reward = m.reward;
                            const boostId = `boost-${m.id}`;
                            let boostDescription = reward.type === 'INCOME_BOOST'
                                ? `+${(reward.multiplier - 1) * 100}% Income from ${m.boss}`
                                : `${(1 - reward.multiplier) * 100}% Cost Reduction from ${m.boss}`;

                            newActiveBoosts.push({
                                id: boostId,
                                description: boostDescription,
                                type: reward.type === 'INCOME_BOOST' ? 'INCOME' : 'COST_REDUCTION',
                                multiplier: reward.multiplier,
                                expiresAt: now + reward.duration * 1000,
                            });
                            return { ...m, status: 'COMPLETED' as const, timeLeft: 0 };
                        }
                        return { ...m, timeLeft };
                    }
                    return m;
                }).filter(m => m !== null) as Mission[];
            }
            
            // START: NEW MARKET SIMULATION LOGIC
            let newMarketStatus = { ...prev.marketStatus };
            let newActiveNews = [...prev.activeNews];

            // 1. Update timers and expire events
            if (newMarketStatus.type !== 'NORMAL') {
                newMarketStatus.timeLeft -= 1;
                if (newMarketStatus.timeLeft <= 0) {
                    newMarketStatus = JSON.parse(JSON.stringify(NORMAL_MARKET_STATUS));
                }
            }
            newActiveNews = newActiveNews.map(news => ({ ...news, timeLeft: news.timeLeft - 1 })).filter(news => news.timeLeft > 0);

            // 2. Potentially trigger new events
            if (newMarketStatus.type === 'NORMAL' && Math.random() < MARKET_EVENT_CHANCE) {
                const template = MARKET_EVENT_TEMPLATES[Math.floor(Math.random() * MARKET_EVENT_TEMPLATES.length)];
                const duration = 60 + Math.floor(Math.random() * 240); // 1 to 5 minutes
                newMarketStatus = { ...template, duration, timeLeft: duration };
            }

            const activeNewsCategories = new Set(newActiveNews.map(n => n.category));
            if (newActiveNews.length < 3 && Math.random() < NEWS_EVENT_CHANCE) {
                const availableTemplates = NEWS_EVENT_TEMPLATES.filter(t => !activeNewsCategories.has(t.category));
                if (availableTemplates.length > 0) {
                    const template = availableTemplates[Math.floor(Math.random() * availableTemplates.length)];
                    const duration = 120 + Math.floor(Math.random() * 480); // 2 to 10 minutes
                    newActiveNews.push({
                        ...template,
                        id: `news-${Date.now()}`,
                        duration,
                        timeLeft: duration
                    });
                }
            }

            // 3. Apply event multipliers to stock prices
            const newStocks = prev.stocks.map(stock => {
                const cycle = stock.simulationCycle + 1;

                // --- START OF NEW CHAOTIC PRICE LOGIC ---
                // 1. Main Sine Wave (Macro-trend)
                const macroSine = Math.sin(cycle * stock.simulationFrequency);
                const macroOffset = macroSine * stock.simulationAmplitude;

                // 2. Secondary Sine Wave (Micro-trend) for more frequent, smaller fluctuations
                const microSine = Math.sin(cycle * stock.simulationFrequency * 5.5); // Using a non-integer multiple to avoid perfect overlaps
                const microOffset = microSine * (stock.simulationAmplitude * 0.25); // 25% of the main amplitude

                // 3. Dynamic Noise with a varying scale
                // The noise scale itself follows a very slow wave, creating periods of high and low volatility.
                const noiseScaleModulator = (Math.sin(cycle * (stock.simulationFrequency / 10)) + 1.5) / 2.5; // Varies between 0.2 and 1.0
                const currentVolatility = stock.volatility * noiseScaleModulator;
                const randomNoise = (Math.random() - 0.5) * currentVolatility * stock.basePrice;

                // 4. Combine all factors around the base price
                const basePriceWithFluctuations = stock.basePrice + macroOffset + microOffset + randomNoise;
                // --- END OF NEW CHAOTIC PRICE LOGIC ---

                const marketMultiplier = newMarketStatus.multiplier;
                const newsMultiplier = newActiveNews.find(n => n.category === stock.category)?.multiplier || 1;

                const newPrice = Math.max(0.01, basePriceWithFluctuations * marketMultiplier * newsMultiplier);
                
                const newHistory = [...stock.priceHistory, newPrice].slice(-STOCK_HISTORY_LENGTH);
                
                let baseTickVolume: number;
                switch (stock.id) {
                    case 'stock_omni': baseTickVolume = 50000; break;
                    case 'stock_zeta': baseTickVolume = 35000; break;
                    case 'stock_cybr': baseTickVolume = 30000; break;
                    case 'stock_glitch': baseTickVolume = 15000; break;
                    case 'stock_scav': baseTickVolume = 10000; break;
                    case 'crypto_eth': baseTickVolume = 8000; break;
                    case 'crypto_doge': baseTickVolume = 25000; break;
                    case 'crypto_bitc': baseTickVolume = 2000; break;
                    default: baseTickVolume = 10000;
                }
                const volumeRandomness = 1 + (Math.random() - 0.5) * stock.volatility * 10;
                let volumeMultiplier = 1;
                if (newMarketStatus.type === 'CRASH') volumeMultiplier = 1.5;
                if (newMarketStatus.type === 'BOOM') volumeMultiplier = 1.2;

                const newVolume = Math.floor(baseTickVolume * volumeRandomness * volumeMultiplier);
                const newVolumeHistory = [...stock.volumeHistory, newVolume].slice(-STOCK_HISTORY_LENGTH);

                return { ...stock, price: newPrice, priceHistory: newHistory, volumeHistory: newVolumeHistory, simulationCycle: cycle };
            });
            // END: NEW MARKET SIMULATION LOGIC

            const newUpgradesWithTimers = prev.upgrades.map(upgrade => {
                if (upgrade.isConstructing && upgrade.constructionTimeLeft && upgrade.constructionTimeLeft > 0) {
                     const newTimeLeft = upgrade.constructionTimeLeft - 1;
                     if (newTimeLeft <= 0) {
                        return { ...upgrade, isConstructing: false, constructionTimeLeft: 0 };
                     }
                     return { ...upgrade, constructionTimeLeft: newTimeLeft };
                }
                return upgrade;
            });

            const newBusinessesWithTimers = prev.businesses.map(business => {
                const updatedUpgrades = business.upgrades.map(upgrade => {
                    if (upgrade.status === 'CONSTRUCTING' && upgrade.constructionTimeLeft && upgrade.constructionTimeLeft > 0) {
                        const newTimeLeft = upgrade.constructionTimeLeft - 1;
                        if (newTimeLeft <= 0) {
                            return { ...upgrade, status: 'OWNED' as const, constructionTimeLeft: 0 };
                        }
                        return { ...upgrade, constructionTimeLeft: newTimeLeft };
                    }
                    return upgrade;
                });
                return { ...business, upgrades: updatedUpgrades };
            });

            const newBusinesses = newBusinessesWithTimers.map(business => {
                if (!business.unlocked && checkRequirements(business.unlockRequirements, prev)) {
                    console.log(`Unlocking ${business.name}`);
                    return { ...business, unlocked: true, hidden: false };
                }
                return business;
            });
            
            const activeBoosts = newActiveBoosts.filter(b => b.expiresAt > now);

            return { 
                ...prev, 
                balance: newBalance, 
                stocks: newStocks,
                businesses: newBusinesses,
                upgrades: newUpgradesWithTimers,
                activeBoosts,
                missions: newMissions,
                lastMissionCheck,
                marketStatus: newMarketStatus,
                activeNews: newActiveNews,
            };
        });
    };

    useGameLoop(handleGameTick, 1000);

    const handleManualClick = () => {
        setGameState(prev => ({ ...prev, balance: prev.balance + prev.clickValue }));
    };

    const getCostReduction = (state: GameState) => {
        const boostReduction = state.activeBoosts
            .filter(b => b.type === 'COST_REDUCTION')
            .reduce((multiplier, b) => multiplier * b.multiplier, 1);
        
        const securityReduction = 1 - state.security.reduce((sum, s) => sum + (s.effect.value * s.owned), 0);

        const upgradeReduction = 1 - state.upgrades
            .reduce((sum, u) => {
                if (u.owned > 0 && u.effect.type === 'GLOBAL_COST_REDUCTION') {
                    return sum + (u.effect.value * u.owned);
                }
                return sum;
            }, 0);
        
        const itemReduction = state.items.reduce((multiplier, item) => {
            if (item.owned > 0 && item.effect.type === 'GLOBAL_COST_REDUCTION') {
                return multiplier * (1 - item.effect.value * item.owned);
            }
            return multiplier;
        }, 1);

        return boostReduction * securityReduction * upgradeReduction * itemReduction;
    };

    const purchaseClickerUpgrade = () => {
        setGameState(prev => {
            const { cost, clickValueIncrease } = getClickerUpgradeInfo(prev.clickerLevel);
            const finalCost = cost * getCostReduction(prev);

            if (prev.balance < finalCost) return prev;
            
            return {
                ...prev,
                balance: prev.balance - finalCost,
                clickValue: prev.clickValue + clickValueIncrease,
                clickerLevel: prev.clickerLevel + 1,
            }
        });
    };

    const purchaseBusiness = (id: string) => {
        setGameState(prev => {
            const business = prev.businesses.find(b => b.id === id);
            if (!business) return prev;
            const finalCost = business.cost * getCostReduction(prev);
            if(prev.balance < finalCost) return prev;

            const newBalance = prev.balance - finalCost;
            const newBusinesses = prev.businesses.map(b => 
                b.id === id ? { ...b, owned: b.owned + 1, cost: b.cost * b.costMultiplier } : b
            );
            return { ...prev, balance: newBalance, businesses: newBusinesses };
        });
    };
    
    const purchaseBusinessUpgrade = (businessId: string, upgradeId: string) => {
        setGameState(prev => {
            const business = prev.businesses.find(b => b.id === businessId);
            if (!business) return prev;

            const upgrade = business.upgrades.find(u => u.id === upgradeId);
            if (!upgrade || upgrade.status !== 'AVAILABLE') return prev;

            const finalCost = upgrade.cost * getCostReduction(prev);
            if (prev.balance < finalCost) return prev;

            const newBalance = prev.balance - finalCost;
            const newBusinesses = prev.businesses.map(b => {
                if (b.id !== businessId) return b;
                const newUpgrades = b.upgrades.map(u => 
                    u.id === upgradeId ? { ...u, status: 'CONSTRUCTING' as const, constructionTimeLeft: u.constructionTime } : u
                );
                return { ...b, upgrades: newUpgrades };
            });
            
            return { ...prev, balance: newBalance, businesses: newBusinesses };
        });
    };

    const purchaseUpgrade = (id: string) => {
         setGameState(prev => {
            const upgrade = prev.upgrades.find(u => u.id === id);
            if (!upgrade || upgrade.isConstructing || upgrade.isLocked) return prev;
            const isMaxed = upgrade.maxOwned && upgrade.owned >= upgrade.maxOwned;
            if (isMaxed) return prev;

            const finalCost = upgrade.cost * getCostReduction(prev);
            if (prev.balance < finalCost) return prev;

            const newBalance = prev.balance - finalCost;
            
            const constructionTime = upgrade.baseConstructionTime 
                ? upgrade.baseConstructionTime * (upgrade.owned + 1) 
                : upgrade.constructionTime;
            
            let newClickValue = prev.clickValue;
            let newContrabandLimit = prev.contrabandLimit;

            let newUpgrades = prev.upgrades.map(u => {
                if (u.id === id) {
                    if (u.effect.type === 'CLICK_VALUE_MULTIPLIER') {
                         newClickValue *= u.effect.value;
                    }
                    if (u.effect.type === 'INCREASE_CONTRABAND_LIMIT') {
                         newContrabandLimit += u.effect.value;
                    }

                    if (u.mutuallyExclusiveWith) {
                        const other = prev.upgrades.find(upg => upg.id === u.mutuallyExclusiveWith);
                        if (other) other.isLocked = true;
                    }
                    return { ...u, isConstructing: true, constructionTimeLeft: constructionTime, owned: u.owned + 1 };
                }
                 if (upgrade.mutuallyExclusiveWith === u.id) {
                    return { ...u, isLocked: true };
                }
                return u;
            });
            
            return { ...prev, balance: newBalance, upgrades: newUpgrades, clickValue: newClickValue, contrabandLimit: newContrabandLimit };
        });
    };

    const startProject = (id: string) => {
        setGameState(prev => {
            const project = prev.projects.find(p => p.id === id);
            if (!project || project.status !== 'LOCKED') return prev;

            const finalCost = project.cost * getCostReduction(prev);
            if (prev.balance < finalCost) return prev;

            const newBalance = prev.balance - finalCost;
            const newProjects = prev.projects.map((p): Project =>
                p.id === id ? { ...p, status: 'COMPLETED' } : p
            );

            return { ...prev, balance: newBalance, projects: newProjects };
        });
    };
    
    const tradeStock = (id: string, quantity: number) => {
        setGameState(prev => {
            const stock = prev.stocks.find(s => s.id === id);
            if (!stock) return prev;

            const tradeCost = stock.price * quantity;
            if (quantity > 0 && prev.balance < tradeCost) return prev;
            if (quantity < 0 && stock.owned < Math.abs(quantity)) return prev;

            const newBalance = prev.balance - tradeCost;
            const newStocks = prev.stocks.map(s =>
                s.id === id ? { ...s, owned: s.owned + quantity, tradingVolume: s.tradingVolume + Math.abs(quantity) } : s
            );

            return { ...prev, balance: newBalance, stocks: newStocks };
        });
    };

    const handleUpdateAutoTraderSettings = (stockId: string, settings: Partial<AutoTraderSettings>) => {
        setGameState(prev => ({
            ...prev,
            stocks: prev.stocks.map(s => s.id === stockId ? { ...s, autoTrader: { ...s.autoTrader, ...settings } } : s)
        }));
    };

    const tradeItem = (id: string, quantity: number) => {
        setGameState(prev => {
            const item = prev.items.find(i => i.id === id);
            if (!item) return prev;

            const isBuying = quantity > 0;
            
            if (isBuying && item.type === 'contraband' && item.owned + quantity > prev.contrabandLimit) {
                console.log("Contraband limit reached!");
                return prev;
            }

            const tradeCost = item.price * quantity * (isBuying ? getCostReduction(prev) : 1);
            if (isBuying && prev.balance < tradeCost) return prev;
            if (!isBuying && item.owned < Math.abs(quantity)) return prev;
            
            let newAssignedCarId = prev.assignedCarId;
            if (!isBuying && item.id === prev.assignedCarId && item.owned + quantity <= 0) {
                newAssignedCarId =