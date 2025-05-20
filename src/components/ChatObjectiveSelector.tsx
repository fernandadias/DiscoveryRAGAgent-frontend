import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@heroui/react';

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
  return (
    <div className="w-full max-w-xs">
      <label className="block text-sm font-medium text-white/70 mb-1">
        Objetivo da conversa
      </label>
      <Select
        value={selectedObjective || undefined}
        onValueChange={onSelect}
      >
        <SelectTrigger className="w-full bg-white/5 border-white/10 text-white">
          <SelectValue placeholder="Selecione um objetivo" />
        </SelectTrigger>
        <SelectContent>
          {objectives.map((objective) => (
            <SelectItem key={objective.id} value={objective.id}>
              {objective.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ChatObjectiveSelector;
