import React from 'react';
import { formatNumber } from '../utils/formatters';

interface HeaderProps {
    balance: number;
    ips: number;
    planetName: string;
    onTitleClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ balance, ips, planetName, onTitleClick }) => {
    return (
        <header className="bg-cyber-surface/50 border border-cyber-border rounded-lg p-4 flex flex-col md:flex-row justify-between items-center backdrop-blur-sm">
            <div className="text-center md:text-left">
                <h1 
                    className="text-3xl md:text-4xl font-orbitron text-cyber-cyan animate-flicker cursor-pointer"
                    onClick={onTitleClick}
                    title="Enter Dev Mode"
                >
                    Cyberpunk Tycoon
                </h1>
                <p className="text-sm text-cyber-dim font-orbitron -mt-1">{planetName}</p>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 mt-4 md:mt-0">
                <div className="text-center">
                    <p className="text-sm text-cyber-dim">Net Worth</p>
                    <p className="text-2xl font-orbitron text-cyber-green">
                        <span className="text-cyber-dim">$</span>{formatNumber(balance, 2)}
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-sm text-cyber-dim">Income/sec</p>
                    <p className="text-2xl font-orbitron text-cyber-yellow">
                        <span className="text-cyber-dim">$</span>{formatNumber(ips, 2)}
                    </p>
                </div>
            </div>
        </header>
    );
};

export default Header;