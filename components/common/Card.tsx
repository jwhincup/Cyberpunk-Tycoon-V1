
import React from 'react';

interface CardProps {
    children: React.ReactNode;
    isDimmed?: boolean;
}

const Card: React.FC<CardProps> = ({ children, isDimmed = false }) => {
    return (
        <div className={`bg-cyber-surface/70 border border-cyber-border p-4 rounded-lg transition-all ${isDimmed ? 'opacity-50' : ''}`}>
            {children}
        </div>
    );
};

export default Card;
