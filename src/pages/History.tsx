import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useConversations } from '@/hooks/use-api';
import { Button } from '@heroui/react';
import { Clock, MessageSquare, ArrowRight } from 'lucide-react';

const History = () => {
  const { data: conversations = [], isLoading, refetch } = useConversations();
  const navigate = useNavigate();

  // Refetch conversations when component mounts
  useEffect(() => {
    refetch();
  }, [refetch]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Histórico de Conversas</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : conversations.length === 0 ? (
        <div className="text-center py-12 bg-white/5 rounded-lg">
          <p className="text-white/70">Nenhuma conversa salva.</p>
          <p className="text-white/50 text-sm mt-2">Inicie uma nova conversa e salve-a para vê-la aqui.</p>
          <Button 
            variant="primary" 
            size="sm" 
            className="mt-4"
            onClick={() => navigate('/chat')}
          >
            Nova Conversa
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {conversations.map((conversation) => (
            <div key={conversation.id} className="bg-white/5 border border-white/10 hover:bg-white/10 transition-colors rounded-lg overflow-hidden">
              <div className="p-4 border-b border-white/10">
                <h3 className="text-white font-medium truncate">{conversation.title}</h3>
                <div className="text-white/50 flex items-center gap-1 text-sm mt-1">
                  <Clock size={14} />
                  {formatDate(conversation.updated_at)}
                </div>
              </div>
              <div className="p-4">
                <p className="text-white/70 text-sm flex items-center gap-1">
                  <MessageSquare size={14} />
                  {conversation.message_count} mensagens
                </p>
              </div>
              <div className="p-4 border-t border-white/10 flex justify-end">
                <Link to={`/history/${conversation.id}`}>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-white/70 hover:text-white flex items-center gap-1"
                  >
                    Ver conversa
                    <ArrowRight size={14} />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
