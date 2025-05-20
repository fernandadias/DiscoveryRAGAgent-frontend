import React, { useState } from 'react';
import { Select } from '@heroui/react';

interface ChatObjectiveSelectorProps {
  objectives: { id: string; label: string }[];
  selectedObjective: string | null;
  onSelect: (objectiveId: string) => void;
}

const ChatObjectiveSelector: React.FC<ChatObjectiveSelectorProps> = ({
  objectives,
  selectedObjective,
  onSelect
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Find the selected objective label
  const selectedLabel = selectedObjective 
    ? objectives.find(obj => obj.id === selectedObjective)?.label 
    : "Selecione um objetivo";

  return (
    <div className="w-full max-w-xs">
      <label className="block text-sm font-medium text-white/70 mb-1">
        Objetivo da conversa
      </label>
      
      {/* Custom select implementation using @heroui/react Select as base */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between bg-white/5 border border-white/10 text-white rounded px-3 py-2"
        >
          <span>{selectedLabel}</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
        
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-gray-800 border border-white/10 rounded shadow-lg">
            <ul className="py-1">
              {objectives.map((objective) => (
                <li 
                  key={objective.id}
                  className={`px-3 py-2 cursor-pointer hover:bg-white/10 ${
                    selectedObjective === objective.id ? 'bg-white/5 text-green-400' : 'text-white'
                  }`}
                  onClick={() => {
                    onSelect(objective.id);
                    setIsOpen(false);
                  }}
                >
                  {objective.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatObjectiveSelector;
