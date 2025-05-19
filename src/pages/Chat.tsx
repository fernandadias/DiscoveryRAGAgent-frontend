
import { useState, useEffect } from 'react';
import ChatObjectiveSelector from '@/components/ChatObjectiveSelector';
import ChatMessage, { MessageProps, Source } from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import { nanoid } from 'nanoid';

// Mock data
const objectives = [
  { id: 'about', label: 'Sobre a discovery' },
  { id: 'validate', label: 'Validar uma hipótese' },
  { id: 'insights', label: 'Pedir insights' },
];

const chatSuggestions = [
  "Como nossa empresa pode se beneficiar da IA?",
  "Quais são as tendências do mercado para 2025?",
  "Quero validar o meu modelo de negócio"
];

const mockSources: Source[] = [
  {
    id: '1',
    name: 'Relatório de Tendências 2025',
    snippet: 'De acordo com nossas análises, o mercado de IA deve crescer 35% até 2025, com foco em soluções personalizadas para pequenas empresas.',
    link: '#'
  },
  {
    id: '2',
    name: 'Pesquisa de Comportamento do Consumidor',
    snippet: '78% dos consumidores preferem interagir com empresas que oferecem experiências personalizadas baseadas em IA.',
    link: '#'
  }
];

const Chat = () => {
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedObjective, setSelectedObjective] = useState<string | null>(null);

  const handleSendMessage = (content: string) => {
    // Add user message
    const userMessage: MessageProps = {
      id: nanoid(),
      content,
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate AI response
    setIsLoading(true);
    
    // Add loading message
    const loadingMessageId = nanoid();
    const loadingMessage: MessageProps = {
      id: loadingMessageId,
      content: '',
      isUser: false,
      timestamp: new Date(),
      isLoading: true
    };
    setMessages(prev => [...prev, loadingMessage]);
    
    // Simulate a delay
    setTimeout(() => {
      setIsLoading(false);
      
      // Remove loading message and add real response
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== loadingMessageId);
        
        return [
          ...filtered, 
          {
            id: nanoid(),
            content: `Esta é uma resposta simulada da IA para sua mensagem: "${content}". Em uma implementação real, isto viria da API de um modelo de linguagem.`,
            isUser: false,
            timestamp: new Date(),
            sources: mockSources
          }
        ];
      });
    }, 3000);
  };

  const handleObjectiveSelect = (objectiveId: string) => {
    setSelectedObjective(objectiveId);
  };

  return (
    <div className="flex flex-col h-full max-h-screen">
      <div className="border-b border-white/10 p-4">
        <ChatObjectiveSelector 
          objectives={objectives}
          onSelect={handleObjectiveSelect}
        />
      </div>
      
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 mb-4 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-gradient-primary text-xl">AI</span>
            </div>
            <h2 className="text-xl font-medium mb-2 text-white">IA Discovery Assistant</h2>
            <p className="text-muted-foreground max-w-md">
              Responda suas dúvidas sobre produtos, valide hipóteses de negócio e obtenha insights valiosos com base nos nossos dados.
            </p>
          </div>
        ) : (
          messages.map(message => (
            <ChatMessage key={message.id} {...message} />
          ))
        )}
      </div>
      
      <div className="p-4 border-t border-white/10">
        <ChatInput 
          onSendMessage={handleSendMessage} 
          isLoading={isLoading}
          suggestions={messages.length === 0 ? chatSuggestions : undefined}
        />
      </div>
    </div>
  );
};

export default Chat;
