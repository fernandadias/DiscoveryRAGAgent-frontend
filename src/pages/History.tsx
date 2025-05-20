import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConversations } from '@/hooks/use-api';
import { Button } from '@heroui/react';
import { MessageSquare, Calendar, ArrowRight } from 'lucide-react';

const History = () => {
  const navigate = useNavigate();
  const { data: conversations = [], isLoading } = useConversations();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleViewConversation = (conversationId: string) => {
    navigate(`/history/${conversationId}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-white">Histórico de Conversas</h1>
      
      {isLoading ? (
        <div className="text-center py-8 text-white/70">Carregando histórico...</div>
      ) : conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 mb-4 rounded-full bg-white/10 flex items-center justify-center">
            <MessageSquare size={24} className="text-white/70" />
          </div>
          <h2 className="text-xl font-semibold mb-2 text-white">Nenhuma conversa salva</h2>
          <p className="text-white/70 max-w-md mb-6">
            Suas conversas salvas aparecerão aqui. Inicie uma conversa e salve-a para acessá-la posteriormente.
          </p>
          <Button
            onClick={() => navigate('/')}
            variant="solid"
            color="primary"
          >
            Iniciar Nova Conversa
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              onClick={() => handleViewConversation(conversation.id)}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-white">{conversation.title}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/70"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewConversation(conversation.id);
                  }}
                >
                  <ArrowRight size={18} />
                </Button>
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-white/60">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{formatDate(conversation.created_at)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare size={14} />
                  <span>{conversation.message_count} mensagens</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
