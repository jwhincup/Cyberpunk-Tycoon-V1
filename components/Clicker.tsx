import React from 'react';
import { formatNumber } from '../utils/formatters';
import { ClickerUpgradeInfo } from '../src/gameLogic/clickerUpgrades';

interface ClickerProps {
    onClick: () => void;
    clickValue: number;
    level: number;
    balance: number;
    onUpgrade: () => void;
    nextUpgradeInfo: ClickerUpgradeInfo;
}

const Clicker: React.FC<ClickerProps> = ({ onClick, clickValue, level, balance, onUpgrade, nextUpgradeInfo }) => {
    const canAffordUpgrade = balance >= nextUpgradeInfo.cost;
    
    return (
        <div className="bg-cyber-surface border border-cyber-border rounded-lg p-6 flex flex-col items-center justify-between h-full">
            <div>
                <h2 className="text-xl font-bold font-orbitron text-cyber-cyan text-center">DATA NODE</h2>
                <p className="text-cyber-dim mb-4 text-center">Tap the node to extract raw data. Every packet has value.</p>
            </div>
            
            <button
                onClick={onClick}
                className="w-48 h-48 bg-cyber-bg rounded-full border-4 border-cyber-pink shadow-cyber-glow-pink flex flex-col items-center justify-center transition-transform duration-100 ease-in-out active:scale-95 group my-4"
            >
                <div className="text-6xl group-hover:animate-pulse">💎</div>
                <span className="text-lg font-bold text-cyber-green mt-2 font-orbitron">
                    +${formatNumber(clickValue)}
                </span>
            </button>
            
            <div className="w-full text-center">
                <p className="text-cyber-dim text-sm">Value per Click: ${formatNumber(clickValue, 2)}</p>
                <div className="mt-4">
                     <p className="text-sm font-semibold text-cyber-cyan">Direct Interface Upgrade (Lvl {level})</p>
                     <p className="text-xs text-cyber-yellow h-4">Next: {nextUpgradeInfo.description}</p>
                     <button
                        onClick={onUpgrade}
                        disabled={!canAffordUpgrade}
                        className="w-full bg-cyber-border hover:bg-cyber-pink disabled:bg-gray-700 disabled:cursor-not-allowed disabled:text-gray-500 text-white font-bold py-2 px-4 rounded transition-colors mt-1"
                     >
                        <span className="font-orbitron">Cost: ${formatNumber(nextUpgradeInfo.cost)}</span>
                     </button>
                </div>
            </div>
        </div>
    );
};

export default Clicker;