import React from 'react';
import { AutoTraderSettings } from '../../types';
import { formatNumber } from '../../utils/formatters';

interface AutoTraderFormProps {
    settings: AutoTraderSettings;
    onUpdate: (settings: Partial<AutoTraderSettings>) => void;
    currentPrice: number;
}

const AutoTraderForm: React.FC<AutoTraderFormProps> = ({ settings, onUpdate, currentPrice }) => {
    
    const handleNumberChange = (field: keyof AutoTraderSettings, value: string) => {
        const numValue = value === '' ? null : parseFloat(value);
        if (numValue === null || (!isNaN(numValue) && numValue >= 0)) {
            onUpdate({ [field]: numValue });
        }
    };
    
    const handleIntChange = (field: keyof AutoTraderSettings, value: string) => {
        const intValue = value === '' ? 0 : parseInt(value, 10);
        if (!isNaN(intValue) && intValue >= 0) {
            onUpdate({ [field]: intValue });
        }
    };

    return (
        <div className="bg-cyber-bg/50 p-3 rounded-lg mt-3 border border-cyber-border/50 text-sm animate-[fadeIn_0.3s_ease-in-out]">
            <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-cyber-yellow font-orbitron">Auto-Trader AI</h4>
                <label className="flex items-center cursor-pointer">
                    <span className="mr-2 text-cyber-dim">Disabled</span>
                    <div className="relative">
                        <input type="checkbox" className="sr-only" checked={settings.enabled} onChange={(e) => onUpdate({ enabled: e.target.checked })} />
                        <div className="block bg-cyber-border w-10 h-6 rounded-full"></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.enabled ? 'transform translate-x-full bg-cyber-cyan' : ''}`}></div>
                    </div>
                    <span className="ml-2 text-cyber-cyan">Enabled</span>
                </label>
            </div>
            
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 transition-opacity ${settings.enabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                {/* Buy Section */}
                <div className="space-y-2">
                    <p className="font-semibold text-cyber-green">BUY ORDER</p>
                    <div className="flex items-center gap-2">
                        <label className="w-24 text-cyber-dim">Buy at $</label>
                        <input 
                            type="number"
                            placeholder="Price"
                            value={settings.buyPrice ?? ''}
                            onChange={e => handleNumberChange('buyPrice', e.target.value)}
                            className="bg-cyber-bg border border-cyber-border rounded px-2 py-1 w-full text-cyber-text"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="w-24 text-cyber-dim">Quantity</label>
                         <input 
                            type="number"
                            placeholder="Qty"
                            value={settings.buyQuantity}
                            onChange={e => handleIntChange('buyQuantity', e.target.value)}
                            className="bg-cyber-bg border border-cyber-border rounded px-2 py-1 w-full text-cyber-text"
                        />
                    </div>
                </div>

                {/* Sell Section */}
                <div className="space-y-2">
                    <p className="font-semibold text-cyber-pink">SELL ORDERS</p>
                     <div className="flex items-center gap-2">
                        <label className="w-24 text-cyber-dim">Profit at $</label>
                        <input 
                            type="number"
                            placeholder="Take Profit"
                            value={settings.sellPriceHigh ?? ''}
                            onChange={e => handleNumberChange('sellPriceHigh', e.target.value)}
                            className="bg-cyber-bg border border-cyber-border rounded px-2 py-1 w-full text-cyber-text"
                        />
                    </div>
                     <div className="flex items-center gap-2">
                        <label className="w-24 text-cyber-dim">Stop Loss $</label>
                         <input 
                            type="number"
                            placeholder="Stop Loss"
                            value={settings.sellPriceLow ?? ''}
                            onChange={e => handleNumberChange('sellPriceLow', e.target.value)}
                            className="bg-cyber-bg border border-cyber-border rounded px-2 py-1 w-full text-cyber-text"
                        />
                    </div>
                     <div className="flex items-center gap-2">
                        <label className="w-24 text-cyber-dim">Quantity</label>
                         <input 
                            type="number"
                            placeholder="Qty"
                            value={settings.sellQuantity}
                            onChange={e => handleIntChange('sellQuantity', e.target.value)}
                            className="bg-cyber-bg border border-cyber-border rounded px-2 py-1 w-full text-cyber-text"
                        />
                    </div>
                </div>
            </div>
            <p className="text-xs text-center text-cyber-dim mt-3">Current Price: ${formatNumber(currentPrice)}. Rules are reset after triggering once.</p>
        </div>
    );
};

export default AutoTraderForm;
