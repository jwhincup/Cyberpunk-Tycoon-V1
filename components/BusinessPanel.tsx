import React, { useState } from 'react';
import { Business } from '../types';
import { formatNumber } from '../utils/formatters';
import Card from './common/Card';
import BusinessGrowthTree from './BusinessGrowthTree';

interface BusinessPanelProps {
    businesses: Business[];
    balance: number;
    onPurchase: (id: string) => void;
    onPurchaseUpgrade: (businessId: string, upgradeId: string) => void;
}

const BusinessPanel: React.FC<BusinessPanelProps> = ({ businesses, balance, onPurchase, onPurchaseUpgrade }) => {
    const [expandedBusinessId, setExpandedBusinessId] = useState<string | null>(null);

    const toggleExpansion = (id: string) => {
        setExpandedBusinessId(prevId => (prevId === id ? null : id));
    };

    return (
        <div className="space-y-3">
            {businesses.map(biz => {
                if (biz.hidden) {
                    return (
                        <Card key={biz.id}>
                            <div className="relative">
                                <div className="flex items-center gap-4 filter blur-sm pointer-events-none">
                                    <div className="text-4xl">{biz.icon}</div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg text-cyber-cyan">{biz.name}</h3>
                                        <p className="text-sm text-cyber-dim">{biz.description}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <div className="bg-gray-700 text-white font-bold py-2 px-4 rounded w-full text-center">
                                            <span className="font-orbitron">$ ???</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute inset-0 bg-black/50 rounded-lg flex flex-col items-center justify-center text-center p-2">
                                    <p className="text-lg font-bold text-cyber-dim">LOCKED</p>
                                    <p className="text-xs text-cyber-dim mt-1">{biz.unlockDescription}</p>
                                </div>
                            </div>
                        </Card>
                    );
                }

                const canAfford = balance >= biz.cost;
                const isVisible = biz.unlocked || balance >= biz.cost * 0.75;
                const isExpanded = expandedBusinessId === biz.id;
                const incomePerSecond = biz.baseIncome * biz.incomeMultiplier * biz.owned;

                if (!isVisible) return null;

                return (
                    <React.Fragment key={biz.id}>
                        <Card isDimmed={!biz.unlocked}>
                            <div className="flex items-start gap-4">
                                <div className="text-4xl pt-1">{biz.icon}</div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-lg text-cyber-cyan">{biz.name}</h3>
                                        {biz.owned > 0 && (
                                            <span className="text-xs font-bold text-cyber-yellow bg-cyber-yellow/10 px-2 py-1 rounded-md">
                                                ${formatNumber(incomePerSecond)}/s
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-cyber-dim">{biz.description}</p>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs mt-1">
                                        <span>Owned: <span className="text-cyber-yellow">{biz.owned}</span></span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2 min-w-[120px]">
                                    <button
                                        onClick={() => onPurchase(biz.id)}
                                        disabled={!canAfford || !biz.unlocked}
                                        className="bg-cyber-border hover:bg-cyber-pink disabled:bg-gray-700 disabled:cursor-not-allowed disabled:text-gray-500 text-white font-bold py-2 px-4 rounded transition-colors w-full text-center"
                                    >
                                        <span className="font-orbitron">${formatNumber(biz.cost)}</span>
                                    </button>
                                     {biz.owned > 0 && biz.upgrades.length > 0 && (
                                        <button onClick={() => toggleExpansion(biz.id)} className="text-xs text-cyber-cyan hover:underline">
                                            {isExpanded ? 'Hide Tree' : 'Tech Tree'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </Card>
                        {isExpanded && (
                             <BusinessGrowthTree 
                                business={biz} 
                                balance={balance}
                                onPurchaseUpgrade={onPurchaseUpgrade}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default BusinessPanel;