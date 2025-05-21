import React, { useState } from 'react';

interface Objective {
  id: string;
  title: string;
  description?: string;
}

interface ChatObjectiveSelectorProps {
  objectives: Objective[];
  selectedObjective: string | null;
  onSelectObjective: (objectiveId: string) => void;
  disabled?: boolean;
}

const ChatObjectiveSelector: React.FC<ChatObjectiveSelectorProps> = ({
  objectives,
  selectedObjective,
  onSelectObjective,
  disabled = false
}) => {
  // Ordenar os objetivos para garantir que "Explorar o que já foi descoberto" seja o primeiro
  const sortedObjectives = [...objectives].sort((a, b) => {
    // Colocar "Explorar o que já foi descoberto" como primeiro item
    if (a.title.includes("Explorar o que já foi descoberto")) return -1;
    if (b.title.includes("Explorar o que já foi descoberto")) return 1;
    return 0;
  });

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-white/70 mb-2">
        Objetivo da conversa
      </label>
      
      <div className="flex flex-wrap gap-2">
        {sortedObjectives.map((objective) => (
          <button
            key={objective.id}
            onClick={() => onSelectObjective(objective.id)}
            disabled={disabled}
            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
              selectedObjective === objective.id 
                ? 'bg-green-600/30 text-green-400 border border-green-500/50' 
                : 'bg-white/5 text-white/80 border border-white/10 hover:bg-white/10'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            title={objective.description || objective.title}
          >
            {objective.title.replace("Objetivo da Conversa: ", "")}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatObjectiveSelector;
