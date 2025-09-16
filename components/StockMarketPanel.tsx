import React, { useState } from 'react';
import { Stock, StockCategory, AutoTraderSettings, MarketEvent, NewsEvent } from '../types';
import { formatNumber } from '../utils/formatters';
import Card from './common/Card';
import AutoTraderForm from './common/AutoTraderForm';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import TabButton from './common/TabButton';

interface StockMarketPanelProps {
    stocks: Stock[];
    balance: number;
    onTradeStock: (id: string, quantity: number) => void;
    autoTraderUnlocked: boolean;
    onUpdateAutoTraderSettings: (stockId: string, settings: Partial<AutoTraderSettings>) => void;
    marketStatus: MarketEvent;
    activeNews: NewsEvent[];
}

type Timeframe = '1m' | '5m' | '15m' | 'All';
type InvestmentTab = 'Stocks' | 'Crypto';

const TIMEFRAME_CONFIG: Record<Timeframe, { label: string; ticks: number }> = {
    '1m': { label: '1m', ticks: 60 },
    '5m': { label: '5m', ticks: 300 },
    '15m': { label: '15m', ticks: 900 },
    'All': { label: 'All', ticks: 1000 },
};

const TRADE_QUANTITIES = [1, 10, 100];

const CATEGORY_STYLES: Record<StockCategory, { color: string; label: string }> = {
    'Blue Chip': { color: 'bg-cyber-cyan/30 text-cyber-cyan', label: 'Blue Chip' },
    'Growth Stock': { color: 'bg-cyber-yellow/30 text-cyber-yellow', label: 'Growth' },
    'Speculative': { color: 'bg-cyber-pink/30 text-cyber-pink', label: 'Speculative' },
    'Crypto': { color: 'bg-purple-500/30 text-purple-400', label: 'Crypto' },
};

// Custom Tooltip Component for Stock Charts
const CustomTooltip: React.FC<any> = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const price = data.price;
        const percentChange = data.percentChange;
        const volume = data.volume;
        
        const trendColor = percentChange >= 0 ? 'text-cyber-green' : 'text-cyber-pink';

        return (
            <div className="bg-cyber-surface/90 border border-cyber-border p-3 rounded-lg text-sm shadow-lg backdrop-blur-sm">
                <p className="font-bold text-cyber-cyan">Price: <span className="font-orbitron">${formatNumber(price)}</span></p>
                <p className={`font-semibold ${trendColor}`}>
                    Change: {percentChange >= 0 ? '+' : ''}{percentChange.toFixed(2)}%
                </p>
                <p className="text-cyber-dim">Volume: <span className="font-orbitron">{formatNumber(volume, 0)}</span></p>
            </div>
        );
    }
    return null;
};

const MarketStatusDisplay: React.FC<{ marketStatus: MarketEvent; activeNews: NewsEvent[] }> = ({ marketStatus, activeNews }) => {
    const newsItems = activeNews.map(n => `${n.name.toUpperCase()}: ${n.description}`).join(' ••• ');

    const marketStatusStyle = {
        'NORMAL': 'bg-cyber-surface/50 border-cyber-border',
        'BOOM': 'bg-green-500/20 border-cyber-green text-cyber-green animate-pulse',
        'CRASH': 'bg-red-500/20 border-cyber-pink text-cyber-pink animate-pulse',
    }[marketStatus.type];
    
    return (
        <div className="mb-4 space-y-2">
            <div className={`p-3 rounded-lg border-2 text-center ${marketStatusStyle}`}>
                <h3 className="font-orbitron font-bold text-lg">{marketStatus.name}</h3>
                <p className="text-sm text-cyber-dim">{marketStatus.description}</p>
            </div>
            {activeNews.length > 0 && (
                <div className="bg-cyber-surface/50 border border-cyber-border rounded-lg p-2 overflow-hidden whitespace-nowrap">
                     <div className="inline-block animate-[scroll_40s_linear_infinite] pr-full">
                        <span className="font-bold text-cyber-yellow mx-4">LATEST NEWS:</span>
                        <span className="text-cyber-text">{newsItems}</span>
                     </div>
                </div>
            )}
            <style>{`
                @keyframes scroll {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
                 .pr-full { padding-right: 100%; }
            `}</style>
        </div>
    );
};


const StockMarketPanel: React.FC<StockMarketPanelProps> = ({ stocks, balance, onTradeStock, autoTraderUnlocked, onUpdateAutoTraderSettings, marketStatus, activeNews }) => {
    const [activeTab, setActiveTab] = useState<InvestmentTab>('Stocks');

    const renderStocks = (type: 'Stock' | 'Crypto') => (
        <StockListView
            stocks={stocks.filter(s => s.type === type)}
            balance={balance}
            onTrade={onTradeStock}
            autoTraderUnlocked={autoTraderUnlocked}
            onUpdateAutoTraderSettings={onUpdateAutoTraderSettings}
        />
    );

    return (
        <div>
            <MarketStatusDisplay marketStatus={marketStatus} activeNews={activeNews} />
        
            <div className="flex flex-wrap border-b border-cyber-border mb-4">
                {(['Stocks', 'Crypto'] as InvestmentTab[]).map(tab => (
                    <TabButton
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        isActive={activeTab === tab}
                    >
                        {tab}
                    </TabButton>
                ))}
            </div>

            {activeTab === 'Stocks' && renderStocks('Stock')}
            {activeTab === 'Crypto' && renderStocks('Crypto')}
        </div>
    );
};

// Sub-component for listing stocks/crypto
const StockListView: React.FC<{
    stocks: Stock[];
    balance: number;
    onTrade: (id: string, quantity: number) => void;
    autoTraderUnlocked: boolean;
    onUpdateAutoTraderSettings: (stockId: string, settings: Partial<AutoTraderSettings>) => void;
}> = ({ stocks, balance, onTrade, autoTraderUnlocked, onUpdateAutoTraderSettings }) => {
    const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>({});
    const [selectedTimeframes, setSelectedTimeframes] = useState<Record<string, Timeframe>>({});
    const [showAutoTrader, setShowAutoTrader] = useState<Record<string, boolean>>({});

    const getChartData = (priceHistory: number[], volumeHistory: number[], timeframe: Timeframe) => {
        const ticks = TIMEFRAME_CONFIG[timeframe]?.ticks || priceHistory.length;
        const priceSlice = priceHistory.slice(-ticks);
        const volHistory = Array.isArray(volumeHistory) ? volumeHistory : [];
        const volumeSlice = volHistory.slice(-ticks);
    
        if (priceSlice.length === 0) return [];
    
        const startPrice = priceSlice[0];
    
        return priceSlice.map((price, index) => {
            const percentageChange = startPrice > 0 ? ((price - startPrice) / startPrice) * 100 : 0;
            return {
                name: index,
                price: price,
                volume: volumeSlice[index] || 0,
                percentChange: percentageChange,
            };
        });
    };

    return (
        <div className="space-y-4">
            {stocks.map(stock => {
                const currentQuantity = selectedQuantities[stock.id] || 1;
                const currentTimeframe = selectedTimeframes[stock.id] || '1m';
                
                const canAffordBuy = balance >= stock.price * currentQuantity;
                const canAffordSell = stock.owned >= currentQuantity;
                const canAffordAny = balance >= stock.price;
                const canSellAny = stock.owned > 0;
                
                // For chart line color - reflects immediate change
                const trendLastTick = stock.priceHistory.length > 1 && stock.priceHistory[stock.priceHistory.length - 1] > stock.priceHistory[stock.priceHistory.length - 2];
                const chartData = getChartData(stock.priceHistory, stock.volumeHistory, currentTimeframe);

                // For text display - reflects change over selected timeframe
                const priceAtStartOfTimeframe = chartData.length > 0 ? chartData[0].price : (stock.priceHistory[0] || 0);
                const priceChange = stock.price - priceAtStartOfTimeframe;
                const percentageChange = priceAtStartOfTimeframe > 0 ? (priceChange / priceAtStartOfTimeframe) * 100 : 0;
                const trendForTimeframe = priceChange >= 0;

                return (
                    <Card key={stock.id}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                                        <div className="flex-grow">
                                            <h3 className="font-bold text-lg text-cyber-cyan">{stock.name} ({stock.ticker})</h3>
                                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${CATEGORY_STYLES[stock.category].color}`}>
                                                {CATEGORY_STYLES[stock.category].label}
                                            </span>
                                        </div>
                                         {autoTraderUnlocked && (
                                            <button onClick={() => setShowAutoTrader(prev => ({ ...prev, [stock.id]: !prev[stock.id] }))}
                                                className="text-sm font-semibold text-cyber-yellow hover:text-cyber-cyan transition-colors font-orbitron px-2 py-1 border border-cyber-yellow/50 rounded-lg hover:border-cyber-cyan/50 whitespace-nowrap"
                                                title={showAutoTrader[stock.id] ? 'Hide AI Trader' : 'Show AI Trader'}>
                                                🤖 {showAutoTrader[stock.id] ? 'Hide AI' : 'Show AI'}
                                            </button>
                                        )}
                                    </div>
                                    <div className="mt-1">
                                        <p className={`text-2xl font-orbitron ${trendForTimeframe ? 'text-cyber-green' : 'text-cyber-pink'}`}>
                                            ${formatNumber(stock.price)}
                                        </p>
                                        <p className={`text-sm font-semibold ${trendForTimeframe ? 'text-cyber-green' : 'text-cyber-pink'}`}>
                                            {trendForTimeframe ? '+' : ''}{formatNumber(priceChange, 2)} ({percentageChange.toFixed(2)}%)
                                            <span className="text-xs text-cyber-dim ml-1">({TIMEFRAME_CONFIG[currentTimeframe].label})</span>
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-cyber-dim">Portfolio:</p>
                                    <p className="font-bold text-cyber-yellow">{stock.owned} shares</p>
                                    <p className="text-cyber-dim text-sm">Value: ${formatNumber(stock.owned * stock.price)}</p>
                                </div>
                            </div>
                            <div className="md:col-span-2 h-28 flex flex-col">
                                <div className="flex gap-1 justify-end -mb-1">
                                    {(Object.keys(TIMEFRAME_CONFIG) as Timeframe[]).map(tf => (
                                        <button
                                            key={tf}
                                            onClick={() => setSelectedTimeframes(prev => ({ ...prev, [stock.id]: tf }))}
                                            className={`px-2 py-0.5 text-xs rounded-t-md transition-colors font-orbitron ${currentTimeframe === tf ? 'bg-cyber-surface text-cyber-cyan' : 'bg-transparent text-cyber-dim hover:bg-cyber-border/50 hover:text-cyber-text'}`}
                                        >
                                            {TIMEFRAME_CONFIG[tf].label}
                                        </button>
                                    ))}
                                </div>
                               <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData} margin={{ top: 5, right: 45, left: 0, bottom: 5 }}>
                                        <Tooltip 
                                          content={<CustomTooltip />}
                                          cursor={{ stroke: '#8b8bb3', strokeDasharray: '3 3' }}
                                        />
                                        <Line type="monotone" dataKey="price" stroke={trendLastTick ? '#00ff7f' : '#ff00ff'} strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                                        <YAxis domain={['dataMin * 0.95', 'dataMax * 1.05']} orientation="right" stroke="#8b8bb3" tick={{ fontSize: 10, fill: '#8b8bb3' }} tickFormatter={(value) => `$${formatNumber(Number(value), 0)}`} width={45} axisLine={false} tickLine={false} />
                                        <XAxis dataKey="name" hide={true}/>
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                            <div>
                                <span className="text-sm text-cyber-dim mr-2 font-semibold">QTY:</span>
                                <div className="inline-flex rounded-md shadow-sm" role="group">
                                    {TRADE_QUANTITIES.map(q => (
                                        <button key={q} type="button" onClick={() => setSelectedQuantities(prev => ({...prev, [stock.id]: q}))}
                                            className={`px-3 py-1 text-sm font-orbitron border border-cyber-border transition-colors ${currentQuantity === q ? 'bg-cyber-cyan text-cyber-bg' : 'bg-cyber-surface text-cyber-dim hover:bg-cyber-border'} first:rounded-l-lg last:rounded-r-lg`}>
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="w-full sm:w-auto grid grid-cols-2 gap-2">
                                <button onClick={() => onTrade(stock.id, currentQuantity)} disabled={!canAffordBuy} className="bg-cyber-green/20 hover:bg-cyber-green/40 text-cyber-green font-bold py-2 px-3 rounded transition-colors disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed">
                                    Buy {currentQuantity}
                                </button>
                                 <button 
                                    onClick={() => {
                                        const maxQty = Math.floor(balance / stock.price);
                                        if (maxQty > 0) onTrade(stock.id, maxQty);
                                    }} 
                                    disabled={!canAffordAny} 
                                    className="bg-cyber-green/20 hover:bg-cyber-green/40 text-cyber-green font-bold py-2 px-3 rounded transition-colors disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
                                >
                                    Buy Max
                                </button>
                                <button onClick={() => onTrade(stock.id, -currentQuantity)} disabled={!canAffordSell} className="bg-cyber-pink/20 hover:bg-cyber-pink/40 text-cyber-pink font-bold py-2 px-3 rounded transition-colors disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed">
                                    Sell {currentQuantity}
                                </button>
                                <button 
                                    onClick={() => {
                                        if (stock.owned > 0) onTrade(stock.id, -stock.owned);
                                    }} 
                                    disabled={!canSellAny} 
                                    className="bg-cyber-pink/20 hover:bg-cyber-pink/40 text-cyber-pink font-bold py-2 px-3 rounded transition-colors disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
                                >
                                    Sell Max
                                </button>
                            </div>
                        </div>
                        {autoTraderUnlocked && showAutoTrader[stock.id] && (
                            <AutoTraderForm settings={stock.autoTrader} onUpdate={(settings) => onUpdateAutoTraderSettings(stock.id, settings)} currentPrice={stock.price} />
                        )}
                    </Card>
                );
            })}
        </div>
    );
}

export default StockMarketPanel;
