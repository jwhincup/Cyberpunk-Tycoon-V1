import React from 'react';
import { Business, BusinessUpgrade } from '../types';
import { formatNumber, formatTime } from '../utils/formatters';

interface BusinessGrowthTreeProps {
    business: Business;
    balance: number;
    onPurchaseUpgrade: (businessId: string, upgradeId: string) => void;
}

const UpgradeNode: React.FC<{
    upgrade: BusinessUpgrade;
    isAffordable: boolean;
    isUnlocked: boolean;
    onPurchase: () => void;
}> = ({ upgrade, isAffordable, isUnlocked, onPurchase }) => {
    const isConstructing = upgrade.status === 'CONSTRUCTING';
    const isOwned = upgrade.status === 'OWNED';
    const isDisabled = isOwned || !isAffordable || !isUnlocked || isConstructing;

    const buttonColor = isOwned 
        ? 'bg-green-900/50 text-green-400/50'
        : isConstructing
        ? 'bg-yellow-900/50 text-yellow-400/50 animate-pulse'
        : !isUnlocked
        ? 'bg-gray-800/50 text-gray-500/50'
        : !isAffordable
        ? 'bg-red-900/50 text-red-400/50'
        : 'bg-cyber-border hover:bg-cyber-cyan hover:text-cyber-bg';

    return (
        <div className="flex flex-col items-center text-center w-32">
            <button
                onClick={onPurchase}
                disabled={isDisabled}
                className={`w-20 h-20 rounded-lg border-2 border-cyber-border flex flex-col items-center justify-center p-2 transition-all duration-200 ${buttonColor} ${!isDisabled && !isConstructing ? 'shadow-cyber-glow-cyan' : ''}`}
                title={`${upgrade.description} | Cost: $${formatNumber(upgrade.cost)}`}
            >
                <span className="text-3xl">{upgrade.icon}</span>
                
            </button>
            <p className="text-xs mt-1 font-bold text-cyber-text">{upgrade.name}</p>
             <p className={`text-xs font-orbitron h-4 ${isOwned ? 'text-green-400/70' : isConstructing ? 'text-yellow-400/70' : 'text-cyber-dim'}`}>
                {isOwned 
                    ? 'PURCHASED' 
                    : isConstructing
                    ? formatTime(upgrade.constructionTimeLeft)
                    : `$${formatNumber(upgrade.cost)}`}
            </p>
        </div>
    );
};


const BusinessGrowthTree: React.FC<BusinessGrowthTreeProps> = ({ business, balance, onPurchaseUpgrade }) => {
    const tiers = business.upgrades.reduce<Record<number, BusinessUpgrade[]>>((acc, upg) => {
        acc[upg.tier] = [...(acc[upg.tier] || []), upg];
        return acc;
    }, {});

    const ownedUpgradeIds = new Set(business.upgrades.filter(u => u.status === 'OWNED').map(u => u.id));

    return (
        <div className="bg-cyber-bg/50 border-2 border-dashed border-cyber-border p-4 rounded-lg -mt-2 mb-3 animate-[fadeIn_0.5s_ease_in_out]">
            <h4 className="text-center font-orbitron text-cyber-yellow mb-4 border-b border-cyber-border/50 pb-2">Tech Tree: {business.name}</h4>
            <div className="flex flex-col items-center space-y-8">
                {Object.keys(tiers).map(tier => (
                    <div key={tier} className="flex flex-col items-center w-full">
                        {/* Connecting lines for tiers > 1 */}
                        {Number(tier) > 1 && (
                             <div className="h-8 w-px bg-cyber-border/50"></div>
                        )}
                        <div className="flex justify-center items-start gap-8 relative">
                           {/* Horizontal connecting lines */}
                           {tiers[Number(tier)].length > 1 && (
                                <div className="absolute top-1/2 -translate-y-12 h-px bg-cyber-border/50 w-full z-0"></div>
                           )}
                           
                            {tiers[Number(tier)].map(upg => {
                                const isUnlocked = !upg.requiredUpgradeId || ownedUpgradeIds.has(upg.requiredUpgradeId);
                                return (
                                   <div key={upg.id} className="flex flex-col items-center z-10 relative">
                                        {/* Vertical line from connector to node */}
                                        {tiers[Number(tier)].length > 1 && (
                                            <div className="h-6 w-px bg-cyber-border/50 absolute bottom-full mb-8"></div>
                                        )}
                                        <UpgradeNode
                                            upgrade={upg}
                                            isAffordable={balance >= upg.cost}
                                            isUnlocked={isUnlocked}
                                            onPurchase={() => onPurchaseUpgrade(business.id, upg.id)}
                                        />
                                   </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BusinessGrowthTree;