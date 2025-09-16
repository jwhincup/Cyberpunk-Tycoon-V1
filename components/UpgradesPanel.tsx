import React from 'react';
import { Upgrade } from '../types';
import { formatNumber, formatTime } from '../utils/formatters';
import Card from './common/Card';

interface UpgradesPanelProps {
    upgrades: Upgrade[];
    balance: number;
    onPurchase: (id: string) => void;
}

const UpgradeCard: React.FC<{
    upg: Upgrade;
    balance: number;
    onPurchase: (id: string) => void;
    isChoice?: boolean;
}> = ({ upg, balance, onPurchase, isChoice }) => {
    const canAfford = balance >= upg.cost;
    const isMaxed = upg.maxOwned && upg.owned >= upg.maxOwned;
    const isVisible = upg.owned > 0 || balance >= upg.cost * 0.75 || upg.isConstructing || upg.isLocked;
                
    if (!isVisible && !isChoice) return null;

    const isDisabled = !canAfford || isMaxed || upg.isConstructing || upg.isLocked;

    return (
        <Card isDimmed={isMaxed || upg.isLocked}>
            <div className="flex items-center gap-4">
                 <div className="text-4xl">⚙️</div>
                <div className="flex-1">
                    <h3 className={`font-bold text-lg ${upg.isLocked ? 'text-cyber-dim' : 'text-cyber-cyan'}`}>{upg.name} {upg.owned > 0 && !upg.maxOwned ? `(Lvl ${upg.owned + 1})` : ''}</h3>
                    <p className="text-sm text-cyber-dim">{upg.description}</p>
                </div>
                <button
                    onClick={() => onPurchase(upg.id)}
                    disabled={isDisabled}
                    className="bg-cyber-border hover:bg-cyber-pink disabled:bg-gray-700 disabled:cursor-not-allowed disabled:text-gray-500 text-white font-bold py-2 px-4 rounded transition-colors w-48 text-center"
                >
                   {upg.isConstructing 
                    ? <span className="font-orbitron animate-pulse">UPGRADING... {formatTime(upg.constructionTimeLeft)}</span>
                    : isMaxed 
                    ? 'PURCHASED'
                    : upg.isLocked
                    ? 'LOCKED'
                    : <span className="font-orbitron">${formatNumber(upg.cost)}</span>}
                </button>
            </div>
        </Card>
    );
}

const UpgradesPanel: React.FC<UpgradesPanelProps> = ({ upgrades, balance, onPurchase }) => {
    const processedUpgrades: ( { type: 'single', upgrade: Upgrade } | { type: 'choice', options: [Upgrade, Upgrade] } )[] = [];
    const handledIds = new Set<string>();

    upgrades.forEach(upg => {
        if (handledIds.has(upg.id)) return;

        if (upg.mutuallyExclusiveWith) {
            const other = upgrades.find(u => u.id === upg.mutuallyExclusiveWith);
            if (other && !handledIds.has(other.id)) {
                processedUpgrades.push({ type: 'choice', options: [upg, other] });
                handledIds.add(upg.id);
                handledIds.add(other.id);
                return;
            }
        }
        processedUpgrades.push({ type: 'single', upgrade: upg });
        handledIds.add(upg.id);
    });

    return (
        <div className="space-y-3">
            {processedUpgrades.map((item, index) => {
                if (item.type === 'single') {
                    if (item.upgrade.hidden) {
                        return (
                            <Card key={item.upgrade.id}>
                                <div className="relative">
                                    <div className="flex items-center gap-4 filter blur-sm pointer-events-none">
                                        <div className="text-4xl">⚙️</div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg text-cyber-cyan">{item.upgrade.name}</h3>
                                            <p className="text-sm text-cyber-dim">{item.upgrade.description}</p>
                                        </div>
                                        <div className="bg-gray-700 text-white font-bold py-2 px-4 rounded">
                                            <span className="font-orbitron">$ ???</span>
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 bg-black/50 rounded-lg flex flex-col items-center justify-center text-center p-2">
                                        <p className="text-lg font-bold text-cyber-dim">LOCKED</p>
                                        <p className="text-xs text-cyber-dim mt-1">{item.upgrade.unlockDescription}</p>
                                    </div>
                                </div>
                            </Card>
                        );
                    }
                    return <UpgradeCard key={item.upgrade.id} upg={item.upgrade} balance={balance} onPurchase={onPurchase} />;
                } else { // 'choice'
                    const [optionA, optionB] = item.options;
                    const isDecided = optionA.owned > 0 || optionB.owned > 0 || optionA.isLocked || optionB.isLocked;
                    return (
                        <div key={`${optionA.id}-${optionB.id}`} className="border-2 border-dashed border-cyber-border p-4 rounded-lg space-y-4 bg-cyber-bg/30">
                            <h4 className="text-center font-orbitron text-cyber-yellow">STRATEGIC CHOICE</h4>
                            <UpgradeCard upg={optionA} balance={balance} onPurchase={onPurchase} isChoice={true} />
                            <div className="text-center font-bold text-cyber-dim">OR</div>
                            <UpgradeCard upg={optionB} balance={balance} onPurchase={onPurchase} isChoice={true} />
                        </div>
                    );
                }
            })}
        </div>
    );
};

export default UpgradesPanel;