
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConversationHistory, { Conversation } from '@/components/ConversationHistory';

// Mock data
const mockConversations: Conversation[] = [
  {
    id: '1',
    title: 'Análise de mercado para 2025',
    timestamp: new Date(2025, 4, 15, 14, 30),
    preview: 'Como será o cenário de mercado para startups de IA em 2025?'
  },
  {
    id: '2',
    title: 'Validação do modelo de negócios',
    timestamp: new Date(2025, 4, 14, 10, 15),
    preview: 'Quero validar meu modelo de assinatura para software B2B de IA generativa.'
  },
  {
    id: '3',
    title: 'Insights sobre comportamento do consumidor',
    timestamp: new Date(2025, 4, 10, 16, 45),
    preview: 'Quais são as tendências de comportamento dos consumidores em relação a produtos com IA?'
  },
  {
    id: '4',
    title: 'Comparação com concorrentes',
    timestamp: new Date(2025, 4, 8, 9, 20),
    preview: 'Como podemos nos diferenciar dos concorrentes no mercado de IA?'
  },
];

const History = () => {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const handleConversationSelect = (id: string) => {
    setActiveConversationId(id);
    // In a real app, this would load the conversation and navigate to the chat page
    setTimeout(() => {
      navigate('/');
    }, 300);
  };
  
  const handleConversationTitleChange = (id: string, newTitle: string) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === id ? { ...conv, title: newTitle } : conv
      )
    );
  };

  return (
    <div className="h-full p-4">
      <ConversationHistory 
        conversations={conversations}
        activeConversationId={activeConversationId}
        onConversationSelect={handleConversationSelect}
        onConversationTitleChange={handleConversationTitleChange}
      />
    </div>
  );
};

export default History;
