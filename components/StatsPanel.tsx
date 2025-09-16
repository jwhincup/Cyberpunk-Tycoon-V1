import React from 'react';
import { GameState } from '../types';
import { formatNumber } from '../utils/formatters';
import Card from './common/Card';
import { PRESTIGE_REQUIREMENT, PLANETS } from '../../constants';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';


interface StatsPanelProps {
    gameState: GameState;
    onPrestige: () => void;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ gameState, onPrestige }) => {
    const { balance, stocks, items, flippableProperties, prestigePoints, planetsVisited } = gameState;

    const stockValue = stocks.reduce((total, stock) => total + stock.owned * stock.price, 0);
    const propertyValue = flippableProperties.reduce((total, prop) => total + (prop.owned ? prop.baseValue : 0), 0);
    const itemValue = items.reduce((total, item) => total + item.owned * item.price, 0);
    
    const totalNetWorth = balance + stockValue + propertyValue + itemValue;

    const portfolio = [
        { name: 'Liquid Assets (Cash)', value: balance, color: 'bg-cyber-green' },
        { name: 'Stock Portfolio', value: stockValue, color: 'bg-cyber-cyan' },
        { name: 'Real Estate', value: propertyValue, color: 'bg-cyber-yellow' },
        { name: 'Valuable Items', value: itemValue, color: 'bg-cyber-pink' },
    ].filter(item => item.value > 0);

    const canPrestige = balance >= PRESTIGE_REQUIREMENT;
    const currentPlanet = PLANETS[planetsVisited % PLANETS.length];
    const prestigeBonus = prestigePoints * 10;
    
    const PIE_COLORS: Record<string, string> = {
        'bg-cyber-green': '#00ff7f',
        'bg-cyber-cyan': '#00ffff',
        'bg-cyber-yellow': '#ffff00',
        'bg-cyber-pink': '#ff00ff',
    };

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        if (percent < 0.05) return null; // Don't render label for small slices

        return (
            <text x={x} y={y} fill="black" textAnchor="middle" dominantBaseline="central" className="font-bold text-xs">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <div className="space-y-4">
            <Card>
                <h2 className="text-xl font-orbitron text-cyber-cyan mb-2">Total Net Worth</h2>
                <p className="text-4xl font-orbitron text-cyber-green">${formatNumber(totalNetWorth)}</p>
            </Card>

            <Card>
                <h2 className="text-xl font-orbitron text-cyber-cyan mb-4">Portfolio Distribution</h2>
                {portfolio.length > 0 ? (
                    <>
                    <div style={{ width: '100%', height: 250 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={portfolio}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    nameKey="name"
                                >
                                    {portfolio.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[entry.color]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: 'rgba(20, 20, 44, 0.9)', 
                                        borderColor: '#3a3a5e',
                                        borderRadius: '0.5rem'
                                    }}
                                    formatter={(value: number) => `$${formatNumber(value)}`}
                                />
                                <Legend wrapperStyle={{fontSize: "12px"}}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-3 mt-4">
                        {portfolio.map(item => (
                            <div key={item.name}>
                                <div className="flex justify-between items-center text-sm mb-1">
                                    <span className="font-semibold text-cyber-text">{item.name}</span>
                                    <span className="text-cyber-dim">${formatNumber(item.value)}</span>
                                </div>
                                <div className="w-full bg-cyber-border rounded-full h-4">
                                    <div
                                        className={`${item.color} h-4 rounded-full flex items-center justify-center text-xs font-bold text-cyber-bg`}
                                        style={{ width: `${totalNetWorth > 0 ? (item.value / totalNetWorth) * 100 : 0}%` }}
                                    >
                                        {totalNetWorth > 0 && ((item.value / totalNetWorth) * 100) > 10 ? `${((item.value / totalNetWorth) * 100).toFixed(1)}%` : ''}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    </>
                ) : (
                    <p className="text-center text-cyber-dim">No assets to display.</p>
                )}
            </Card>

            {(prestigePoints > 0 || canPrestige) && (
                 <Card>
                    <h2 className="text-xl font-orbitron text-cyber-cyan mb-2">Intergalactic Endeavor</h2>
                     <div className="text-sm space-y-1">
                        <p><span className="font-semibold text-cyber-dim">Current Location:</span> {currentPlanet.name}</p>
                        <p><span className="font-semibold text-cyber-dim">Prestige Points:</span> <span className="text-cyber-yellow">{prestigePoints}</span></p>
                        <p><span className="font-semibold text-cyber-dim">Permanent Income Bonus:</span> <span className="text-cyber-green">+{prestigeBonus}%</span></p>
                     </div>
                </Card>
            )}

            {canPrestige && (
                <div className="bg-cyber-surface/70 border-2 border-dashed border-cyber-yellow p-4 rounded-lg text-center animate-[fadeIn_1s_ease-in-out]">
                    <h2 className="text-xl font-orbitron text-cyber-yellow mb-2">Message from the Syndicate</h2>
                    <p className="text-cyber-dim mb-4">You've amassed over a trillion credits, proving your exceptional value. Your success has not gone unnoticed. You are being promoted and relocated to a new planet to expand our intergalactic effort. Greater challenges and profits await.</p>
                     <button
                        onClick={onPrestige}
                        className="w-full bg-cyber-yellow/80 hover:bg-cyber-yellow text-cyber-bg font-bold text-lg py-3 px-4 rounded transition-colors shadow-lg shadow-cyber-yellow/20"
                    >
                        Begin the Intergalactic Effort
                    </button>
                </div>
            )}
        </div>
    );
};

export default StatsPanel;