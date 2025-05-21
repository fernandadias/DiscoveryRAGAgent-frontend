import { useState, useEffect } from 'react';
import { useSendMessage, SendMessageParams } from '@/hooks/use-send-message';
import { useObjectives } from '@/hooks/use-api';
import { Button } from '@heroui/react';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  conversationId: string | null;
  onMessageSent: (message: string, response: string, sources: any[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onSendMessage: (message: string) => Promise<void>;
}

const ChatInput: React.FC<ChatInputProps> = ({
  conversationId,
  onMessageSent,
  isLoading,
  setIsLoading,
  onSendMessage
}) => {
  const [message, setMessage] = useState('');
  const [loadingStage, setLoadingStage] = useState<string>('');
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  
  // Simular estágios de processamento com progresso quando estiver carregando
  useEffect(() => {
    if (!isLoading) {
      setLoadingStage('');
      setLoadingProgress(0);
      return;
    }
    
    const stages = [
      'Analisando consulta...',
      'Buscando documentos relevantes...',
      'Consultando diretrizes e objetivos...',
      'Gerando resposta personalizada...',
      'Finalizando...'
    ];
    
    let currentStage = 0;
    const stageInterval = setInterval(() => {
      if (currentStage < stages.length) {
        setLoadingStage(stages[currentStage]);
        setLoadingProgress(Math.floor((currentStage / (stages.length - 1)) * 100));
        currentStage++;
      } else {
        clearInterval(stageInterval);
      }
    }, 1500);
    
    return () => clearInterval(stageInterval);
  }, [isLoading]);

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;
    
    const userMessage = message;
    setMessage('');
    
    try {
      await onSendMessage(userMessage);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="border-t border-white/10 bg-zinc-900/80 backdrop-blur-sm p-4">
      {isLoading && (
        <div className="mb-4 bg-white/5 rounded-lg p-3">
          <div className="flex items-center gap-3">
            <Loader2 className="animate-spin text-green-400" size={18} />
            <div className="flex-1">
              <div className="text-sm text-white/80">{loadingStage}</div>
              <div className="w-full bg-white/10 rounded-full h-1.5 mt-2">
                <div 
                  className="bg-green-500 h-1.5 rounded-full transition-all duration-300" 
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua mensagem..."
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-green-500/50 resize-none h-[60px] max-h-[120px]"
            disabled={isLoading}
          />
          <div className="absolute bottom-2 right-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleSendMessage}
              disabled={!message.trim() || isLoading}
              className="rounded-full w-8 h-8 p-0 flex items-center justify-center"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Send size={16} />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
