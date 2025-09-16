import React, { useState, useEffect } from 'react';
import { GameState } from '../types';

interface DevPanelProps {
    gameState: GameState;
    onLoad: (code: string) => void;
    onClose: () => void;
}

const DevPanel: React.FC<DevPanelProps> = ({ gameState, onLoad, onClose }) => {
    const [saveCode, setSaveCode] = useState('');
    const [loadCode, setLoadCode] = useState('');
    const [copyButtonText, setCopyButtonText] = useState('Copy Code');

    useEffect(() => {
        try {
            // Using btoa for simple base64 encoding
            const code = btoa(JSON.stringify(gameState));
            setSaveCode(code);
        } catch (error) {
            console.error("Error generating save code:", error);
            setSaveCode('Error: Could not generate save code.');
        }
    }, [gameState]);

    const handleCopy = () => {
        navigator.clipboard.writeText(saveCode).then(() => {
            setCopyButtonText('Copied!');
            setTimeout(() => setCopyButtonText('Copy Code'), 2000);
        }, () => {
            setCopyButtonText('Failed!');
            setTimeout(() => setCopyButtonText('Copy Code'), 2000);
        });
    };

    const handleLoad = () => {
        if (loadCode.trim()) {
            onLoad(loadCode.trim());
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div 
                className="bg-cyber-surface border-2 border-cyber-pink shadow-cyber-glow-pink rounded-lg p-6 w-full max-w-2xl mx-4 animate-[fadeIn_0.3s_ease-out]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-orbitron text-cyber-pink">DEV MODE</h2>
                    <button onClick={onClose} className="text-2xl text-cyber-dim hover:text-cyber-pink">&times;</button>
                </div>

                <div className="space-y-4">
                    {/* Save Section */}
                    <div>
                        <h3 className="font-semibold text-cyber-cyan mb-2">Save Game State</h3>
                        <textarea
                            readOnly
                            value={saveCode}
                            className="w-full h-32 bg-cyber-bg border border-cyber-border rounded p-2 text-xs text-cyber-dim font-mono resize-none"
                        />
                        <button
                            onClick={handleCopy}
                            className="w-full mt-2 bg-cyber-border hover:bg-cyber-pink text-white font-bold py-2 px-4 rounded transition-colors"
                        >
                            {copyButtonText}
                        </button>
                    </div>

                    {/* Load Section */}
                    <div>
                        <h3 className="font-semibold text-cyber-cyan mb-2">Load Game State</h3>
                        <textarea
                            value={loadCode}
                            onChange={(e) => setLoadCode(e.target.value)}
                            placeholder="Paste your save code here..."
                            className="w-full h-32 bg-cyber-bg border border-cyber-border rounded p-2 text-xs text-cyber-text font-mono resize-none"
                        />
                         <button
                            onClick={handleLoad}
                            className="w-full mt-2 bg-cyber-border hover:bg-cyber-green text-white font-bold py-2 px-4 rounded transition-colors"
                        >
                            Load Game
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DevPanel;
