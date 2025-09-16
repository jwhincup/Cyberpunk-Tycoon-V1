import React, { useState } from 'react';
import { FlippableProperty, PropertyCondition, ImprovementType } from '../types';
import { formatNumber } from '../utils/formatters';
import Card from './common/Card';
import TabButton from './common/TabButton';
import ProgressBar from './common/ProgressBar';

interface RealEstatePanelProps {
    properties: FlippableProperty[];
    balance: number;
    onPurchase: (id: string) => void;
    onUpgrade: (id: string, type: ImprovementType) => void;
    onSell: (id: string) => void;
    // onRentToggle: (id: string) => void; // Future feature
}
type RealEstateTab = 'My Properties' | 'Auction House';

const CONDITION_STYLES: Record<PropertyCondition, { color: string; label: string }> = {
    [PropertyCondition.Derelict]: { color: 'text-red-500', label: 'Derelict' },
    [PropertyCondition.Rundown]: { color: 'text-orange-400', label: 'Rundown' },
    [PropertyCondition.Fair]: { color: 'text-yellow-400', label: 'Fair' },
    [PropertyCondition.Good]: { color: 'text-green-400', label: 'Good' },
    [PropertyCondition.Excellent]: { color: 'text-cyan-400', label: 'Excellent' },
    [PropertyCondition.Pristine]: { color: 'text-purple-400', label: 'Pristine' },
};

const IMPROVEMENT_ICONS: Record<ImprovementType, string> = {
    [ImprovementType.Plumbing]: '💧',
    [ImprovementType.Electrical]: '⚡',
    [ImprovementType.Structural]: '🏗️',
    [ImprovementType.Cosmetics]: '🎨',
    [ImprovementType.Security]: '🛡️',
    [ImprovementType.Tech]: '🤖',
};

// Property Card for lists
const PropertyCard: React.FC<{
    prop: FlippableProperty;
    onButtonClick: () => void;
    buttonText: string;
    buttonDisabled: boolean;
}> = ({ prop, onButtonClick, buttonText, buttonDisabled }) => (
    <Card>
        <div className="flex items-center gap-4">
            <div className="text-4xl">🏢</div>
            <div className="flex-1">
                <h3 className="font-bold text-lg text-cyber-cyan">{prop.name}</h3>
                <p className="text-sm text-cyber-dim">{prop.description}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs mt-1">
                    <span>Condition: <span className={CONDITION_STYLES[prop.condition].color}>{prop.condition}</span></span>
                    <span>Value: <span className="text-cyber-yellow">${formatNumber(prop.baseValue)}</span></span>
                    {prop.isRented && <span>Income: <span className="text-cyber-green">${formatNumber(prop.baseIncome)}/s</span></span>}
                </div>
            </div>
            <button
                onClick={onButtonClick}
                disabled={buttonDisabled}
                className="bg-cyber-border hover:bg-cyber-pink disabled:bg-gray-700 disabled:cursor-not-allowed disabled:text-gray-500 text-white font-bold py-2 px-4 rounded transition-colors w-40 text-center"
            >
                <span className="font-orbitron">{buttonText}</span>
            </button>
        </div>
    </Card>
);

// Management View for a single property
const PropertyManagementView: React.FC<{
    prop: FlippableProperty;
    balance: number;
    onUpgrade: (id: string, type: ImprovementType) => void;
    onSell: (id: string) => void;
    onBack: () => void;
}> = ({ prop, balance, onUpgrade, onSell, onBack }) => {
    const totalInvestment = Object.values(prop.improvements).reduce((total, improvement) => {
        let investment = 0;
        for (let i = 0; i < improvement.level; i++) {
            investment += improvement.baseCost * Math.pow(1.5, i);
        }
        return total + investment;
    }, 0);

    const potentialSaleValue = (prop.auctionPrice + totalInvestment) * 1.5; // Simplified calculation

    return (
        <div className="bg-cyber-bg/50 p-4 rounded-lg border border-cyber-border animate-[fadeIn_0.5s_ease_in_out]">
            <button onClick={onBack} className="text-sm text-cyber-cyan hover:underline mb-4">{'< Back to Properties'}</button>
            <h2 className="text-xl font-orbitron text-cyber-yellow mb-4">{prop.name} - Management</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                <p><strong>Initial Cost:</strong> ${formatNumber(prop.auctionPrice)}</p>
                <p><strong>Invested:</strong> ${formatNumber(totalInvestment)}</p>
                <p><strong>Current Condition:</strong> <span className={CONDITION_STYLES[prop.condition].color}>{prop.condition}</span></p>
                <p><strong>Potential Sale Value:</strong> ${formatNumber(potentialSaleValue)}</p>
            </div>
            
            <h3 className="font-semibold text-cyber-cyan mb-2">Improvements</h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(prop.improvements).map(([type, details]) => {
                    const upgradeCost = details.baseCost * Math.pow(1.5, details.level);
                    const canAfford = balance >= upgradeCost;
                    const isMaxed = details.level >= details.maxLevel;
                    return (
                        <div key={type} className="bg-cyber-surface p-3 rounded-lg">
                            <p className="font-bold text-sm">{IMPROVEMENT_ICONS[type as ImprovementType]} {type}</p>
                            <p className="text-xs text-cyber-dim">Level: {details.level} / {details.maxLevel}</p>
                            <ProgressBar progress={(details.level / details.maxLevel) * 100} />
                            <button
                                onClick={() => onUpgrade(prop.id, type as ImprovementType)}
                                disabled={isMaxed || !canAfford}
                                className="w-full mt-2 text-xs bg-cyber-border hover:bg-cyber-cyan disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed font-bold py-1 px-2 rounded transition-colors"
                            >
                                {isMaxed ? 'MAX' : `Up: $${formatNumber(upgradeCost)}`}
                            </button>
                        </div>
                    );
                })}
            </div>

            <div className="flex gap-4 mt-4">
                <button 
                    onClick={() => onSell(prop.id)}
                    className="flex-1 bg-cyber-green/80 hover:bg-cyber-green text-cyber-bg font-bold text-lg py-3 px-4 rounded transition-colors"
                >
                    Flip Property (Sell for ${formatNumber(potentialSaleValue)})
                </button>
                 <button 
                    // onClick={() => onRentToggle(prop.id)}
                    disabled // Future feature
                    className="flex-1 bg-cyber-cyan/80 hover:bg-cyber-cyan text-cyber-bg font-bold text-lg py-3 px-4 rounded transition-colors disabled:bg-gray-600"
                >
                    {prop.isRented ? 'Stop Renting' : 'Rent Out'}
                </button>
            </div>
        </div>
    );
};

const RealEstatePanel: React.FC<RealEstatePanelProps> = ({ properties, balance, onPurchase, onUpgrade, onSell }) => {
    const [activeTab, setActiveTab] = useState<RealEstateTab>('My Properties');
    const [managingPropertyId, setManagingPropertyId] = useState<string | null>(null);

    const ownedProperties = properties.filter(p => p.owned);
    const auctionProperties = properties.filter(p => p.forSale && !p.owned);
    const propertyToManage = properties.find(p => p.id === managingPropertyId);

    if (propertyToManage) {
        return <PropertyManagementView 
            prop={propertyToManage}
            balance={balance}
            onUpgrade={onUpgrade}
            onSell={onSell}
            onBack={() => setManagingPropertyId(null)}
        />
    }

    return (
        <div>
            <div className="flex flex-wrap border-b border-cyber-border mb-4">
                {(['My Properties', 'Auction House'] as RealEstateTab[]).map(tab => (
                    <TabButton
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        isActive={activeTab === tab}
                    >
                        {tab}
                    </TabButton>
                ))}
            </div>

            <div className="space-y-3">
                {activeTab === 'My Properties' && (
                    ownedProperties.length > 0 ? ownedProperties.map(prop => (
                        <PropertyCard
                            key={prop.id}
                            prop={prop}
                            onButtonClick={() => setManagingPropertyId(prop.id)}
                            buttonText="Manage"
                            buttonDisabled={false}
                        />
                    )) : <p className="text-center text-cyber-dim">You don't own any properties. Visit the Auction House.</p>
                )}
                {activeTab === 'Auction House' && (
                    auctionProperties.length > 0 ? auctionProperties.map(prop => (
                         <PropertyCard
                            key={prop.id}
                            prop={prop}
                            onButtonClick={() => onPurchase(prop.id)}
                            buttonText={`Buy: $${formatNumber(prop.auctionPrice)}`}
                            buttonDisabled={balance < prop.auctionPrice}
                        />
                    )) : <p className="text-center text-cyber-dim">No properties currently on the auction block. Check back later.</p>
                )}
            </div>
        </div>
    );
};

export default RealEstatePanel;