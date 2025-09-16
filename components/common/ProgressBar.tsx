
import React from 'react';

interface ProgressBarProps {
    progress: number; // 0 to 100
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
    const clampedProgress = Math.max(0, Math.min(100, progress));

    return (
        <div className="w-full bg-cyber-border rounded-full h-2.5">
            <div 
                className="bg-cyber-cyan h-2.5 rounded-full" 
                style={{ width: `${clampedProgress}%` }}
            ></div>
        </div>
    );
};

export default ProgressBar;
