
import { useState } from 'react';
import { cn } from '@/lib/utils';

type Objective = {
  id: string;
  label: string;
};

interface ChatObjectiveSelectorProps {
  objectives: Objective[];
  onSelect: (objective: string) => void;
}

const ChatObjectiveSelector = ({ objectives, onSelect }: ChatObjectiveSelectorProps) => {
  const [selectedObjective, setSelectedObjective] = useState<string | null>(null);

  const handleSelect = (objectiveId: string) => {
    setSelectedObjective(objectiveId);
    onSelect(objectiveId);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4 p-2">
      {objectives.map((objective) => (
        <button
          key={objective.id}
          onClick={() => handleSelect(objective.id)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 animate-fade-in",
            selectedObjective === objective.id 
              ? "bg-primary text-white shadow-lg shadow-primary/20" 
              : "bg-secondary/50 hover:bg-secondary/80 text-white/80 hover:text-white"
          )}
        >
          {objective.label}
        </button>
      ))}
    </div>
  );
};

export default ChatObjectiveSelector;
