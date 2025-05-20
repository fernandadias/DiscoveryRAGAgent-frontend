import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@heroui/react';
import { Button, Checkbox, TextArea } from '@heroui/react';
import { X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import api from '@/lib/api';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  messageId: string;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, messageId }) => {
  const [reasons, setReasons] = useState<string[]>([]);
  const [otherReason, setOtherReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const feedbackReasons = [
    { id: 'irrelevant', label: 'Resposta irrelevante para a pergunta' },
    { id: 'incorrect', label: 'Informações incorretas' },
    { id: 'incomplete', label: 'Resposta incompleta' },
    { id: 'unclear', label: 'Explicação confusa ou difícil de entender' },
    { id: 'not_aligned', label: 'Não alinhada com o objetivo da conversa' },
    { id: 'not_following_guidelines', label: 'Não segue as diretrizes estratégicas' },
  ];

  const handleReasonToggle = (reasonId: string) => {
    setReasons(prev => 
      prev.includes(reasonId) 
        ? prev.filter(id => id !== reasonId) 
        : [...prev, reasonId]
    );
  };

  const handleSubmit = async () => {
    if (reasons.length === 0 && !otherReason.trim()) {
      toast({
        title: "Feedback incompleto",
        description: "Por favor, selecione pelo menos um motivo ou forneça detalhes.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Em uma implementação real, enviar para o backend
      await api.post('/api/feedback', {
        message_id: messageId,
        reasons,
        details: otherReason,
      });

      toast({
        title: "Feedback enviado",
        description: "Obrigado pelo seu feedback! Ele nos ajudará a melhorar.",
      });

      // Limpar e fechar o modal
      setReasons([]);
      setOtherReason('');
      onClose();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Erro ao enviar feedback",
        description: "Não foi possível enviar seu feedback. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">O que poderia ser melhor?</DialogTitle>
          <button 
            onClick={onClose} 
            className="absolute right-4 top-4 text-white/70 hover:text-white"
          >
            <X size={18} />
          </button>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="space-y-2">
            {feedbackReasons.map(reason => (
              <div key={reason.id} className="flex items-start gap-2">
                <Checkbox 
                  id={reason.id}
                  checked={reasons.includes(reason.id)}
                  onCheckedChange={() => handleReasonToggle(reason.id)}
                />
                <label 
                  htmlFor={reason.id} 
                  className="text-sm text-white/90 cursor-pointer"
                >
                  {reason.label}
                </label>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white/90 block">
              Detalhes adicionais (opcional)
            </label>
            <TextArea
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
              placeholder="Descreva o problema ou como poderíamos melhorar..."
              className="w-full bg-white/5 border-white/10 text-white"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="ghost" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar feedback'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackModal;
