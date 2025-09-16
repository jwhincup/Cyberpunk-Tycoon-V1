import React from 'react';
import { Panel } from '../types';
import TabButton from './common/TabButton';

interface MainPanelProps {
    children: React.ReactNode;
    activePanel: Panel;
    setActivePanel: (panel: Panel) => void;
    isCorpUnlocked: boolean;
}

const MainPanel: React.FC<MainPanelProps> = ({ children, activePanel, setActivePanel, isCorpUnlocked }) => {
    return (
        <div className="bg-cyber-surface border border-cyber-border rounded-lg p-1 h-full">
            <div className="flex flex-wrap border-b border-cyber-border">
                {Object.values(Panel).map((panel) => {
                    const isDisabled = panel === Panel.CompanyUpgrades && !isCorpUnlocked;
                    return (
                        <TabButton 
                            key={panel} 
                            onClick={() => setActivePanel(panel)} 
                            isActive={activePanel === panel}
                            disabled={isDisabled}
                        >
                            {panel}
                        </TabButton>
                    );
                })}
            </div>
            <div className="p-4 h-[600px] overflow-y-auto">
                {children}
            </div>
        </div>
    );
};

export default MainPanel;