
import { useState } from 'react';
import { Button } from '@heroui/react';

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
        <Button
          key={objective.id}
          onClick={() => handleSelect(objective.id)}
          variant={selectedObjective === objective.id ? "solid" : "ghost"}
          color={selectedObjective === objective.id ? "primary" : "default"}
          size="sm"
          className="animate-fade-in rounded-full"
        >
          {objective.label}
        </Button>
      ))}
    </div>
  );
};

export default ChatObjectiveSelector;
