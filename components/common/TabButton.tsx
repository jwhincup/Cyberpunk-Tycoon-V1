import React from 'react';

interface TabButtonProps {
    onClick: () => void;
    isActive: boolean;
    children: React.ReactNode;
    disabled?: boolean;
}

const TabButton: React.FC<TabButtonProps> = ({ onClick, isActive, children, disabled = false }) => {
    const baseClasses = 'px-4 py-2 text-sm font-bold font-orbitron border-t border-l border-r rounded-t-md -mb-px transition-colors';
    const activeClasses = 'bg-cyber-surface border-cyber-border text-cyber-cyan';
    const inactiveClasses = 'bg-transparent border-transparent text-cyber-dim hover:bg-cyber-border/50 hover:text-cyber-text';
    const disabledClasses = 'text-gray-600 bg-gray-900/50 cursor-not-allowed border-transparent';

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${disabled ? disabledClasses : (isActive ? activeClasses : inactiveClasses)}`}
        >
            {children}
        </button>
    );
};

export default TabButton;