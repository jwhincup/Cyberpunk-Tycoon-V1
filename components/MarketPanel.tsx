import React from 'react';
import { Item } from '../types';
import { formatNumber } from '../utils/formatters';
import Card from './common/Card';

interface MarketPanelProps {
    items: Item[];
    balance: number;
    onTrade: (id: string, quantity: number) => void;
    contrabandLimit: number;
}

const CATEGORY_ICONS: Record<Item['type'], string> = {
    contraband: '💀',
    car: '🚗',
    yacht: '🛥️',
    plane: '✈️',
    residence: '🏰'
};

const MarketPanel: React.FC<MarketPanelProps> = ({ items, balance, onTrade, contrabandLimit }) => {
    
    const categories = items.reduce((acc, item) => {
        if (!item.hidden) {
            (acc[item.type] = acc[item.type] || []).push(item);
        }
        return acc;
    }, {} as Record<Item['type'], Item[]>);

    const categoryOrder: Item['type'][] = ['contraband', 'car', 'yacht', 'plane', 'residence'];

    return (
        <div className="space-y-4">
            {categoryOrder.map(category => categories[category] && (
                <div key={category}>
                    <div className="flex justify-between items-baseline">
                        <h2 className="text-xl font-orbitron text-cyber-cyan mb-2 capitalize">{category}s</h2>
                        {category === 'contraband' && <p className="text-sm text-cyber-dim">Storage Limit: {contrabandLimit}</p>}
                    </div>
                    <div className="space-y-3">
                        {categories[category].map(item => {
                            const isContraband = item.type === 'contraband';
                            const atContrabandLimit = isContraband && item.owned >= contrabandLimit && item.effect.type !== 'UNLOCK_MISSIONS';
                            const isOneTimeBuy = item.effect.type === 'UNLOCK_MISSIONS' && item.owned > 0;
                            const canAffordBuy = balance >= item.price && !atContrabandLimit && !isOneTimeBuy;
                            const canAffordSell = item.owned > 0 && !isOneTimeBuy;
                            const icon = CATEGORY_ICONS[item.type];

                            return (
                                <Card key={item.id} isDimmed={isOneTimeBuy}>
                                    <div className="flex items-center gap-4">
                                        <div className="text-4xl">{icon}</div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg text-cyber-yellow">{item.name}</h3>
                                            <p className="text-sm text-cyber-cyan font-semibold">{item.description}</p>
                                            <div className="flex gap-4 text-xs mt-1">
                                                <span>Price: <span className="text-cyber-yellow">${formatNumber(item.price)}</span></span>
                                                <span>Owned: <span className="text-cyber-yellow">{item.owned}</span></span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2 w-24">
                                            <button
                                                onClick={() => onTrade(item.id, 1)}
                                                disabled={!canAffordBuy}
                                                className="bg-cyber-green/20 hover:bg-cyber-green/40 text-cyber-green font-bold py-1 px-3 rounded transition-colors disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
                                            >
                                                {isOneTimeBuy ? 'PURCHASED' : atContrabandLimit ? 'LIMIT' : 'Buy'}
                                            </button>
                                            <button
                                                onClick={() => onTrade(item.id, -1)}
                                                disabled={!canAffordSell}
                                                className="bg-cyber-pink/20 hover:bg-cyber-pink/40 text-cyber-pink font-bold py-1 px-3 rounded transition-colors disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
                                            >
                                                Sell
                                            </button>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MarketPanel;