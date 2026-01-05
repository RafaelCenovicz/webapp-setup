
import React from 'react';
import { PCComponent } from '../types';

interface ComponentCardProps {
  component: PCComponent;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

const ComponentCard: React.FC<ComponentCardProps> = ({ component, isSelected, onToggle }) => {
  return (
    <button
      onClick={() => onToggle(component.id)}
      className={`flex flex-col items-start p-4 rounded-xl transition-all duration-300 text-left border-2 ${
        isSelected 
          ? 'bg-cyan-500/10 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
          : 'bg-slate-800/40 border-slate-700 hover:border-slate-500'
      }`}
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
        isSelected ? 'bg-cyan-400 text-slate-900' : 'bg-slate-700 text-cyan-400'
      }`}>
        <i className={`fas ${component.icon} text-lg`}></i>
      </div>
      <h3 className="font-semibold text-sm mb-1">{component.name}</h3>
      <p className="text-xs text-slate-400 line-clamp-2">{component.description}</p>
    </button>
  );
};

export default ComponentCard;
