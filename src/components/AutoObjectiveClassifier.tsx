import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { ObjectiveClassifierService } from '@/services/ObjectiveClassifierService';
import { ObjectiveClassification } from '@/types/ObjectiveClassification';
import { Button } from '@heroui/react';

interface AutoObjectiveClassifierProps {
  query: string;
  onClassificationComplete: (objectiveId: string, autoAccepted: boolean) => void;
  onCancel: () => void;
  objectives: Array<{ id: string; title: string }>;
}

const AutoObjectiveClassifier = ({
  query,
  onClassificationComplete,
  onCancel,
  objectives
}: AutoObjectiveClassifierProps) => {
  const [classification, setClassification] = useState<ObjectiveClassification | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedObjectiveId, setSelectedObjectiveId] = useState<string | null>(null);

  useEffect(() => {
    const classifyQuery = async () => {
      if (!query.trim()) {
        setError('A pergunta não pode estar vazia');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const result = await ObjectiveClassifierService.classifyObjective(query);
        setClassification(result);
        setSelectedObjectiveId(result.objective_id);
        
        // Se a confiança for alta o suficiente, aceitar automaticamente
        if (result.auto_accept) {
          onClassificationComplete(result.objective_id, true);
        }
      } catch (err) {
        setError('Erro ao classificar objetivo. Selecione manualmente.');
        console.error('Erro na classificação:', err);
      } finally {
        setIsLoading(false);
      }
    };

    classifyQuery();
  }, [query, onClassificationComplete]);

  const handleAccept = () => {
    if (selectedObjectiveId) {
      onClassificationComplete(selectedObjectiveId, false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-400';
    if (confidence >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const formatConfidence = (confidence: number) => {
    return `${Math.round(confidence * 100)}%`;
  };

  if (isLoading) {
    return (
      <div className="p-4 bg-zinc-800/50 rounded-lg border border-white/10 animate-pulse">
        <p className="text-white/70">Analisando sua pergunta...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-900/20 rounded-lg border border-red-500/30">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle size={16} className="text-red-400" />
          <p className="text-red-400 font-medium">Erro na classificação</p>
        </div>
        <p className="text-white/70 mb-3">{error}</p>
        <div className="flex justify-end gap-2">
          <Button
            variant="bordered"
            size="sm"
            className="text-white/70"
            onClick={onCancel}
          >
            Cancelar
          </Button>
        </div>
      </div>
    );
  }

  if (!classification || classification.auto_accept) {
    return null; // Não mostrar nada se foi aceito automaticamente
  }

  return (
    <div className="p-4 bg-zinc-800/50 rounded-lg border border-white/10">
      <div className="flex items-center gap-2 mb-2">
        <CheckCircle2 size={16} className="text-green-400" />
        <p className="text-white font-medium">Objetivo identificado</p>
        <span 
          className={`ml-auto text-sm font-medium ${getConfidenceColor(classification.confidence)}`}
        >
          Confiança: {formatConfidence(classification.confidence)}
        </span>
      </div>
      
      <p className="text-white/70 mb-3">
        Identificamos que sua pergunta tem o objetivo de <strong>{classification.objective_description}</strong>.
      </p>
      
      <div className="mb-3">
        <select
          className="w-full p-2 bg-zinc-900 border border-white/10 rounded text-white"
          value={selectedObjectiveId || ''}
          onChange={(e) => setSelectedObjectiveId(e.target.value)}
        >
          {objectives.map((objective) => (
            <option key={objective.id} value={objective.id}>
              {objective.title}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button
          variant="bordered"
          size="sm"
          className="text-white/70"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={handleAccept}
        >
          Confirmar e enviar
        </Button>
      </div>
    </div>
  );
};

export default AutoObjectiveClassifier;
