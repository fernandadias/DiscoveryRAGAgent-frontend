import { useMutation } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import api from '@/lib/api';

export interface SendMessageParams {
  message: string;
  conversationId?: string | null;
  objectiveId?: string | null;
}

export interface Source {
  id: string;
  name: string;
  snippet: string;
  link?: string;
}

export interface ChatResponse {
  response: string;
  conversation_id: string;
  sources: Source[];
}

export function useSendMessage() {
  return useMutation({
    mutationFn: async ({ message, conversationId = null, objectiveId = null }: SendMessageParams): Promise<ChatResponse> => {
      try {
        const response = await api.post('/api/chat', {
          query: message,
          conversation_id: conversationId,
          objective_id: objectiveId
        });
        return response.data;
      } catch (error) {
        console.error('Error sending message:', error);
        toast({
          title: "Erro ao enviar mensagem",
          description: "Não foi possível processar sua mensagem. Tente novamente.",
          variant: "destructive",
        });
        throw error;
      }
    },
  });
}
