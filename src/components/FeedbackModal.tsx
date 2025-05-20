import React, { useState, useEffect } from 'react';
import { Button } from '@heroui/react';
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

  // Close modal with ESC key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

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

  if (!isOpen) return null;

  return (
    <>
      {/* Modal backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 border border-white/10 text-white max-w-md w-full rounded-lg shadow-lg">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-white/10">
            <h2 className="text-xl font-semibold">O que poderia ser melhor?</h2>
            <button 
              onClick={onClose} 
              className="text-white/70 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              {feedbackReasons.map(reason => (
                <div key={reason.id} className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id={reason.id}
                    checked={reasons.includes(reason.id)}
                    onChange={() => handleReasonToggle(reason.id)}
                    className="mt-1"
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
              <textarea
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                placeholder="Descreva o problema ou como poderíamos melhorar..."
                className="w-full bg-white/5 border border-white/10 text-white rounded p-2 resize-none"
                rows={3}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 p-4 border-t border-white/10">
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
          </div>
        </div>
      </div>
    </>
  );
};

export default FeedbackModal;
