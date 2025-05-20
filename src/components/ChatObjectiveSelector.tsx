
import { useState } from 'react';
import { ButtonGroup, Button } from '@heroui/react';

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
    <ButtonGroup gap={2} className="flex flex-wrap mb-4 p-2">
      {objectives.map((objective) => (
        <Button
          key={objective.id}
          onClick={() => handleSelect(objective.id)}
          variant={selectedObjective === objective.id ? "solid" : "subtle"}
          colorScheme={selectedObjective === objective.id ? "primary" : "gray"}
          size="sm"
          className="animate-fade-in"
          rounded="full"
        >
          {objective.label}
        </Button>
      ))}
    </ButtonGroup>
  );
};

export default ChatObjectiveSelector;
