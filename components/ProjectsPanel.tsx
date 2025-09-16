
import React from 'react';
import { Project } from '../types';
import { formatNumber } from '../utils/formatters';
import Card from './common/Card';

interface ProjectsPanelProps {
    projects: Project[];
    balance: number;
    onStart: (id: string) => void;
}

const ProjectsPanel: React.FC<ProjectsPanelProps> = ({ projects, balance, onStart }) => {
    return (
        <div className="space-y-3">
            {projects.map(proj => {
                const canAfford = balance >= proj.cost;
                const isCompleted = proj.status === 'COMPLETED';

                return (
                    <Card key={proj.id} isDimmed={isCompleted}>
                        <div className="flex items-center gap-4">
                            <div className="text-4xl">📋</div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg text-cyber-cyan">{proj.name}</h3>
                                <p className="text-sm text-cyber-dim">{proj.description}</p>
                            </div>
                             <button
                                onClick={() => onStart(proj.id)}
                                disabled={!canAfford || isCompleted}
                                className="bg-cyber-border hover:bg-cyber-green disabled:bg-green-900/50 disabled:cursor-not-allowed disabled:text-green-400/50 text-white font-bold py-2 px-4 rounded transition-colors"
                            >
                               {isCompleted ? 'COMPLETED' : <span className="font-orbitron">${formatNumber(proj.cost)}</span>}
                            </button>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
};

export default ProjectsPanel;
