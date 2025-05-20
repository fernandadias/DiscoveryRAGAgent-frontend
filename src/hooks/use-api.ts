import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from './use-toast';

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

export interface SendMessageParams {
  message: string;
  conversationId?: string | null;
}

export function useSendMessage() {
  return useMutation({
    mutationFn: async ({ message, conversationId = null }: SendMessageParams): Promise<ChatResponse> => {
      try {
        const response = await api.post('/api/chat', {
          query: message,
          conversation_id: conversationId,
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

export interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
}

export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: async (): Promise<Conversation[]> => {
      try {
        const response = await api.get('/api/conversations');
        return response.data;
      } catch (error) {
        console.error('Error fetching conversations:', error);
        toast({
          title: "Erro ao carregar conversas",
          description: "Não foi possível carregar o histórico de conversas.",
          variant: "destructive",
        });
        return [];
      }
    },
  });
}

export interface ConversationDetail {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messages: any[]; // Tipagem mais específica pode ser adicionada conforme necessário
}

export function useConversationDetail(conversationId: string | null) {
  return useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: async (): Promise<ConversationDetail | null> => {
      if (!conversationId) return null;
      
      try {
        const response = await api.get(`/api/conversations/${conversationId}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching conversation detail:', error);
        toast({
          title: "Erro ao carregar conversa",
          description: "Não foi possível carregar os detalhes desta conversa.",
          variant: "destructive",
        });
        return null;
      }
    },
    enabled: !!conversationId,
  });
}

export interface SaveConversationParams {
  title: string;
  messages: {
    content: string;
    isUser: boolean;
    timestamp: Date;
  }[];
}

export function useSaveConversation() {
  return useMutation({
    mutationFn: async (params: SaveConversationParams): Promise<{ id: string }> => {
      try {
        const response = await api.post('/api/conversations', params);
        return response.data.data;
      } catch (error) {
        console.error('Error saving conversation:', error);
        toast({
          title: "Erro ao salvar conversa",
          description: "Não foi possível salvar esta conversa.",
          variant: "destructive",
        });
        throw error;
      }
    },
  });
}

export interface Document {
  id: string;
  title: string;
  type: string;
  uploaded_at: string;
  size: number;
}

export function useDocuments() {
  return useQuery({
    queryKey: ['documents'],
    queryFn: async (): Promise<Document[]> => {
      try {
        const response = await api.get('/api/documents');
        return response.data;
      } catch (error) {
        console.error('Error fetching documents:', error);
        toast({
          title: "Erro ao carregar documentos",
          description: "Não foi possível carregar a lista de documentos.",
          variant: "destructive",
        });
        return [];
      }
    },
  });
}

export function useUploadDocument() {
  return useMutation({
    mutationFn: async (file: File): Promise<{ id: string }> => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await api.post('/api/documents/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        return response.data.data;
      } catch (error) {
        console.error('Error uploading document:', error);
        toast({
          title: "Erro ao enviar documento",
          description: "Não foi possível enviar o documento.",
          variant: "destructive",
        });
        throw error;
      }
    },
  });
}

export function useDeleteDocument() {
  return useMutation({
    mutationFn: async (documentId: string): Promise<void> => {
      try {
        await api.delete(`/api/documents/${documentId}`);
      } catch (error) {
        console.error('Error deleting document:', error);
        toast({
          title: "Erro ao excluir documento",
          description: "Não foi possível excluir o documento.",
          variant: "destructive",
        });
        throw error;
      }
    },
  });
}

export interface Objective {
  id: string;
  title: string;
  description: string;
}

export function useObjectives() {
  return useQuery({
    queryKey: ['objectives'],
    queryFn: async (): Promise<Objective[]> => {
      try {
        const response = await api.get('/api/objectives');
        return response.data;
      } catch (error) {
        console.error('Error fetching objectives:', error);
        toast({
          title: "Erro ao carregar objetivos",
          description: "Não foi possível carregar a lista de objetivos.",
          variant: "destructive",
        });
        return [];
      }
    },
  });
}
