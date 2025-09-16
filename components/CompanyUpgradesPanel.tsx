import React, { useState } from 'react';
import { Upgrade, Mission, MissionRarity, GameState, UnlockRequirement } from '../types';
import { formatNumber, formatTime } from '../utils/formatters';
import Card from './common/Card';
import TabButton from './common/TabButton';
import ProgressBar from './common/ProgressBar';
import { RARITY_CONFIG } from '../../constants';


interface CompanyUpgradesPanelProps {
    upgrades: Upgrade[];
    missions: Mission[];
    balance: number;
    onPurchaseUpgrade: (id: string) => void;
    onStartMission: (id: string) => void;
    isLocked: boolean;
    // New props for expanded Corp HQ functionality
    gameState: GameState;
    onHirePersonnel: (id: string, type: 'staff' | 'security') => void;
    onAssignCar: (itemId: string) => void;
    onExecuteMerger: (mergerId: string) => void;
}
type CorpHQTab = 'Missions' | 'Upgrades' | 'Acquisitions' | 'Personnel' | 'Fleet';


// Sub-component for Missions
const MissionCard: React.FC<{ mission: Mission; onAccept: (id: string) => void }> = ({ mission, onAccept }) => {
    const rarityStyle = RARITY_CONFIG[mission.rarity].color;
    const progress = mission.status === 'IN_PROGRESS' && mission.timeLeft !== undefined
        ? ((mission.duration - mission.timeLeft) / mission.duration) * 100
        : 0;

    const getRewardString = () => {
        const { reward } = mission;
        const durationHours = Math.round(reward.duration / 3600);
        if (reward.type === 'INCOME_BOOST') {
            return `+${((reward.multiplier - 1) * 100).toFixed(0)}% Global Income (${durationHours}h)`;
        }
        return `${((1 - reward.multiplier) * 100).toFixed(0)}% Cost Reduction (${durationHours}h)`;
    };

    return (
        <Card>
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="text-4xl">📡</div>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg text-cyber-cyan">{mission.title}</h3>
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${rarityStyle}`}>
                            {mission.rarity.toUpperCase()}
                        </span>
                    </div>
                    <p className="text-sm text-cyber-dim italic">From: {mission.boss}</p>
                    <p className="text-sm mt-2">{mission.description}</p>
                    <div className="mt-2 p-2 bg-cyber-bg/50 rounded-md">
                        <p className="font-semibold text-cyber-yellow text-sm">Reward:</p>
                        <p className="text-sm text-cyber-yellow">{getRewardString()}</p>
                    </div>
                </div>
                <div className="w-full sm:w-48 flex flex-col items-center gap-2">
                    {mission.status === 'AVAILABLE' && (
                        <>
                            <button
                                onClick={() => onAccept(mission.id)}
                                className="w-full bg-cyber-border hover:bg-cyber-green text-white font-bold py-2 px-4 rounded transition-colors"
                            >
                                Accept Contract
                            </button>
                            <p className="text-xs text-cyber-dim">Expires in: {formatTime(mission.expiresIn)}</p>
                        </>
                    )}
                     {mission.status === 'IN_PROGRESS' && mission.timeLeft !== undefined && (
                        <>
                            <p className="font-orbitron text-cyber-cyan animate-pulse">IN PROGRESS</p>
                            <ProgressBar progress={progress} />
                            <p className="text-xs text-cyber-dim">{formatTime(mission.timeLeft)}</p>
                        </>
                    )}
                    {mission.status === 'COMPLETED' && (
                         <p className="font-orbitron text-cyber-green">COMPLETED</p>
                    )}
                </div>
            </div>
        </Card>
    );
};

// Sub-component for Mergers
const MergersPanel: React.FC<{ gameState: GameState; onExecute: (id: string) => void }> = ({ gameState, onExecute }) => {
    const { mergers } = gameState;

    const getRequirementInfo = (req: UnlockRequirement) => {
        switch(req.type) {
            case 'balance': 
                const current = gameState.balance;
                const target = req.quantity;
                return { 
                    icon: '💰',
                    text: `Have $${formatNumber(target)}`,
                    isMet: current >= target
                };
            case 'business':
                const biz = gameState.businesses.find(b => b.id === req.id);
                return {
                    icon: '🏢',
                    text: `Own ${req.quantity} ${biz?.name || 'Unknown Business'} units`,
                    isMet: (biz?.owned || 0) >= req.quantity
                };
            case 'item':
                 const item = gameState.items.find(i => i.id === req.id);
                return {
                    icon: '💎',
                    text: `Own the ${item?.name || 'Unknown Item'}`,
                    isMet: (item?.owned || 0) >= req.quantity
                };
            case 'project':
                const proj = gameState.projects.find(p => p.id === req.id);
                return {
                    icon: '📋',
                    text: `Complete "${proj?.name || 'Unknown Project'}"`,
                    isMet: proj?.status === 'COMPLETED'
                };
             case 'property':
                const prop = gameState.flippableProperties.find(p => p.id === req.id);
                return {
                    icon: '🏠',
                    text: `Own the ${prop?.name || 'Unknown Property'}`,
                    isMet: (prop?.owned ? 1 : 0) >= req.quantity
                };
        }
    };
    

    return (
        <div className="space-y-6">
            {mergers.map(merger => {
                const allReqsMet = merger.requirements.every(req => getRequirementInfo(req).isMet);
                const isCompleted = merger.status === 'COMPLETED';
                const resultBiz = gameState.businesses.find(b => b.id === merger.result.id);
                
                return (
                    <div key={merger.id} className={`bg-cyber-surface/50 border-2 border-cyber-border p-6 rounded-lg ${isCompleted ? 'opacity-60' : ''}`}>
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <h3 className="font-bold text-2xl font-orbitron text-cyber-yellow">{merger.name}</h3>
                                <p className="text-base text-cyber-dim mt-1">{merger.description}</p>
                                
                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-cyber-bg/50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-lg text-cyber-cyan mb-2">Requirements</h4>
                                        <ul className="space-y-2 text-sm">
                                            {merger.requirements.map((req, i) => {
                                                const { icon, text, isMet } = getRequirementInfo(req);
                                                return (
                                                    <li key={i} className={`flex items-center gap-3 transition-colors ${isMet ? 'text-cyber-green' : 'text-cyber-pink'}`}>
                                                        <span className="text-2xl">{isMet ? '✅' : icon}</span>
                                                        <span>{text}</span>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                    <div className="bg-cyber-bg/50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-lg text-cyber-cyan mb-2">Reward</h4>
                                        <p className="text-base text-cyber-green">Unlocks the <span className="font-bold">{resultBiz?.name || 'new company'}</span>, a powerful new income source.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full md:w-56 flex flex-col justify-center items-center p-4 bg-cyber-bg/30 rounded-lg">
                                <h4 className="font-orbitron text-cyber-dim">Merger Status</h4>
                                <p className={`text-2xl font-bold mt-2 ${isCompleted ? 'text-cyber-green' : allReqsMet ? 'text-cyber-yellow' : 'text-cyber-pink'}`}>
                                    {isCompleted ? 'COMPLETED' : allReqsMet ? 'READY' : 'INCOMPLETE'}
                                </p>
                                <button 
                                    onClick={() => onExecute(merger.id)}
                                    disabled={!allReqsMet || isCompleted}
                                    className="w-full mt-4 bg-cyber-border hover:bg-cyber-green disabled:bg-green-900/50 disabled:cursor-not-allowed disabled:text-green-400/50 text-white font-bold text-lg py-3 px-4 rounded transition-colors"
                                >
                                    {isCompleted ? 'MERGED' : 'Execute Merger'}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
};

// Sub-component for HR and Security
const HRPanel: React.FC<{ gameState: GameState; onHire: (id: string, type: 'staff' | 'security') => void }> = ({ gameState, onHire }) => {
    const { staff, security, balance } = gameState;

    const renderPersonnelList = (list: GameState['staff'], type: 'staff' | 'security') => (
        <div className="space-y-4">
            {list.map(p => {
                const cost = p.cost * Math.pow(p.costMultiplier, p.owned);
                const canAfford = balance >= cost;
                const effectValue = p.effect.value * 100 * p.owned;
                const effectText = p.effect.type === 'GLOBAL_IPS_MULTIPLIER' 
                    ? `+${p.effect.value * 100}% Global IPS`
                    : `${p.effect.value * 100}% Cost Reduction`;
                const totalEffectText = p.effect.type === 'GLOBAL_IPS_MULTIPLIER' 
                    ? `+${effectValue.toFixed(3)}% Total IPS Boost`
                    : `${effectValue.toFixed(3)}% Total Cost Reduction`;

                return (
                    <Card key={p.id}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                            <div className="md:col-span-2 flex gap-4 items-start">
                                <div className="text-5xl mt-1">{type === 'staff' ? '👨‍💼' : '🛡️'}</div>
                                <div>
                                    <h3 className="font-bold text-lg text-cyber-cyan">{p.name}</h3>
                                    <p className="text-sm text-cyber-dim">{p.description}</p>
                                    <div className="mt-2 text-xs bg-cyber-bg/50 px-2 py-1 rounded-md inline-block">
                                        Effect/unit: <span className="font-semibold text-cyber-yellow">{effectText}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-cyber-bg/30 p-3 rounded-lg flex flex-col items-center">
                                <div className="text-center">
                                    <p className="text-cyber-dim text-sm">Owned: <span className="font-orbitron text-2xl text-cyber-text">{p.owned}</span></p>
                                    {p.owned > 0 && <p className="text-xs text-cyber-green">{totalEffectText}</p>}
                                </div>
                                <button
                                    onClick={() => onHire(p.id, type)}
                                    disabled={!canAfford}
                                    className="w-full mt-2 bg-cyber-border hover:bg-cyber-pink disabled:bg-gray-700 disabled:cursor-not-allowed disabled:text-gray-500 text-white font-bold py-2 px-4 rounded transition-colors text-center"
                                >
                                    <span className="font-orbitron">Hire: ${formatNumber(cost)}</span>
                                </button>
                            </div>
                        </div>
                    </Card>
                )
            })}
        </div>
    );
    
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-orbitron text-cyber-cyan mb-3">Human Resources</h2>
                {renderPersonnelList(staff, 'staff')}
            </div>
             <div>
                <h2 className="text-2xl font-orbitron text-cyber-cyan mb-3">Security Division</h2>
                {renderPersonnelList(security, 'security')}
            </div>
        </div>
    );
};

// Sub-component for Company Fleet
const FleetPanel: React.FC<{ gameState: GameState; onAssign: (itemId: string) => void }> = ({ gameState, onAssign }) => {
    const { items, assignedCarId } = gameState;
    const ownedCars = items.filter(i => i.type === 'car' && i.owned > 0);

    if (ownedCars.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-center">
                <p className="text-xl font-orbitron text-cyber-dim">EMPTY GARAGE</p>
                <p className="text-cyber-dim mt-2">Acquire vehicles from the Night Market to build your fleet.</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {ownedCars.map(car => {
                const isAssigned = car.id === assignedCarId;
                const boostValue = (car.effect.type === 'COMPANY_CAR_IPS_BOOST' ? car.effect.value : 0) * 100;

                return (
                    <div key={car.id} className={`bg-cyber-surface/70 border border-cyber-border p-4 rounded-lg transition-all ${isAssigned ? 'ring-2 ring-cyber-cyan shadow-cyber-glow-cyan' : ''}`}>
                        <div className="flex items-center gap-4">
                            <div className="text-5xl">🚗</div>
                            <div className="flex-1">
                                <h3 className="font-bold text-xl text-cyber-yellow">{car.name}</h3>
                                <p className="text-base text-cyber-cyan font-semibold">
                                    Global Income Boost: +{boostValue.toFixed(1)}%
                                </p>
                            </div>
                            <div className="w-40 text-center">
                                {isAssigned ? (
                                    <div className="bg-cyan-900/80 text-cyber-cyan font-bold py-2 px-4 rounded-lg">
                                        ✓ ASSIGNED
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => onAssign(car.id)}
                                        className="w-full bg-cyber-border hover:bg-cyber-cyan hover:text-cyber-bg text-white font-bold py-2 px-4 rounded transition-colors"
                                    >
                                       Assign
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};


const CompanyUpgradesPanel: React.FC<CompanyUpgradesPanelProps> = (props) => {
    const { upgrades, missions, balance, onPurchaseUpgrade, onStartMission, isLocked, gameState, onHirePersonnel, onAssignCar, onExecuteMerger } = props;
    const [activeTab, setActiveTab] = useState<CorpHQTab>('Missions');

    if (isLocked) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-cyber-bg/50 rounded-lg">
                <p className="text-2xl font-orbitron text-cyber-dim">ACCESS DENIED</p>
                <p className="text-cyber-dim mt-2">Complete the "Corporate Shell Acquisition" project under Schematics to unlock corporate infrastructure.</p>
            </div>
        );
    }
    
    const renderMissions = () => {
        const sortedMissions = [...missions].sort((a, b) => {
             const statusOrder = { 'AVAILABLE': 1, 'IN_PROGRESS': 2, 'COMPLETED': 3 };
             return statusOrder[a.status] - statusOrder[b.status];
        });

        if (sortedMissions.length === 0) {
            return (
                 <div className="flex flex-col items-center justify-center h-96 text-center">
                    <p className="text-xl font-orbitron text-cyber-cyan animate-pulse">SCANNING FOR CONTRACTS...</p>
                    <p className="text-cyber-dim mt-2">No missions available. Check back later.</p>
                </div>
            )
        }
        return (
            <div className="space-y-3">
                {sortedMissions.map(mission => (
                    <MissionCard key={mission.id} mission={mission} onAccept={onStartMission} />
                ))}
            </div>
        );
    };

    const renderUpgrades = () => (
        <div className="space-y-3">
            {upgrades.map(upg => {
                const canAfford = balance >= upg.cost;
                const isMaxed = upg.maxOwned && upg.owned >= upg.maxOwned;
                const isVisible = upg.owned > 0 || balance >= upg.cost * 0.75 || upg.isConstructing;
                
                if (!isVisible) return null;
                
                return (
                    <Card key={upg.id} isDimmed={isMaxed && !upg.isConstructing}>
                        <div className="flex items-center gap-4">
                             <div className="text-4xl">💼</div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg text-cyber-cyan">{upg.name} {upg.owned > 0 && !upg.maxOwned ? `(Lvl ${upg.owned + 1})` : ''}</h3>
                                <p className="text-sm text-cyber-dim">{upg.description}</p>
                            </div>
                            <button
                                onClick={() => onPurchaseUpgrade(upg.id)}
                                disabled={!canAfford || isMaxed || upg.isConstructing}
                                className="bg-cyber-border hover:bg-cyber-pink disabled:bg-gray-700 disabled:cursor-not-allowed disabled:text-gray-500 text-white font-bold py-2 px-4 rounded transition-colors w-48 text-center"
                            >
                               {upg.isConstructing 
                                ? <span className="font-orbitron animate-pulse">BUILDING... {formatTime(upg.constructionTimeLeft)}</span>
                                : isMaxed 
                                ? 'MAXED' 
                                : <span className="font-orbitron">${formatNumber(upg.cost)}</span>}
                            </button>
                        </div>
                    </Card>
                );
            })}
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'Missions': return renderMissions();
            case 'Upgrades': return renderUpgrades();
            case 'Acquisitions': return <MergersPanel gameState={gameState} onExecute={onExecuteMerger} />;
            case 'Personnel': return <HRPanel gameState={gameState} onHire={onHirePersonnel} />;
            case 'Fleet': return <FleetPanel gameState={gameState} onAssign={onAssignCar} />;
            default: return null;
        }
    };

    const TABS: { id: CorpHQTab, icon: string, label: string }[] = [
        { id: 'Missions', icon: '📡', label: 'Missions' },
        { id: 'Upgrades', icon: '💼', label: 'Upgrades' },
        { id: 'Acquisitions', icon: '📈', label: 'Acquisitions' },
        { id: 'Personnel', icon: '👥', label: 'Personnel' },
        { id: 'Fleet', icon: '🚗', label: 'Fleet' },
    ];

    return (
        <div>
            <div className="flex justify-between items-center border-b border-cyber-border pb-2 mb-4">
                <h2 className="text-2xl font-orbitron text-cyber-cyan">Corporate Headquarters</h2>
            </div>
            <div className="flex flex-wrap border-b border-cyber-border">
                {TABS.map(tab => (
                    <TabButton key={tab.id} onClick={() => setActiveTab(tab.id)} isActive={activeTab === tab.id}>
                        <span className="mr-2">{tab.icon}</span> {tab.label}
                    </TabButton>
                ))}
            </div>
            <div className="pt-4">
                {renderContent()}
            </div>
        </div>
    );
};

export default CompanyUpgradesPanel;