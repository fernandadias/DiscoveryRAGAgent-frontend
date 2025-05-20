import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Save } from 'lucide-react';
import { nanoid } from 'nanoid';
import { Button } from '@heroui/react';
import ChatObjectiveSelector from '@/components/ChatObjectiveSelector';
import ChatMessage, { MessageProps, Source } from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import { useSendMessage, useSaveConversation } from '@/hooks/use-api';

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

const Chat = () => {
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedObjective, setSelectedObjective] = useState<string | null>(null);
  const [conversationTitle, setConversationTitle] = useState<string>('Nova conversa');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const sendMessageMutation = useSendMessage();
  const saveConversationMutation = useSaveConversation();

  const handleSendMessage = async (content: string) => {
    // Adiciona mensagem do usuário
    const userMessage: MessageProps = {
      id: nanoid(),
      content,
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Adiciona mensagem de carregamento
    const loadingMessageId = nanoid();
    const loadingMessage: MessageProps = {
      id: loadingMessageId,
      content: '',
      isUser: false,
      timestamp: new Date(),
      isLoading: true
    };
    setMessages(prev => [...prev, loadingMessage]);
    setIsLoading(true);
    
    try {
      // Envia mensagem para o backend
      const response = await sendMessageMutation.mutateAsync({
        message: content,
        conversationId
      });
      
      // Remove mensagem de carregamento e adiciona resposta real
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== loadingMessageId);
        return [
          ...filtered,
          {
            id: nanoid(),
            content: response.response,
            isUser: false,
            timestamp: new Date(),
            sources: response.sources
          }
        ];
      });
      
      // Atualiza ID da conversa se for a primeira mensagem
      if (!conversationId && response.conversation_id) {
        setConversationId(response.conversation_id);
      }
      
      // Atualiza título automático da conversa se for a primeira mensagem
      if (messages.length === 0 && !isSaved) {
        const newTitle = content.length > 50 ? content.substring(0, 50) + '...' : content;
        setConversationTitle(newTitle);
      }
    } catch (error) {
      // Trata erro e remove mensagem de carregamento
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== loadingMessageId);
        return [
          ...filtered,
          {
            id: nanoid(),
            content: "Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.",
            isUser: false,
            timestamp: new Date(),
            isError: true
          }
        ];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleObjectiveSelect = (objectiveId: string) => {
    setSelectedObjective(objectiveId);
  };

  const handleSaveConversation = async () => {
    if (messages.length === 0) {
      toast({
        title: "Nada para salvar",
        description: "Inicie uma conversa antes de salvar.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await saveConversationMutation.mutateAsync({
        title: conversationTitle,
        messages: messages.map(m => ({
          content: m.content,
          isUser: m.isUser,
          timestamp: m.timestamp
        }))
      });
      
      setIsSaved(true);
      setConversationId(response.id);
      
      toast({
        title: "Conversa salva",
        description: "Sua conversa foi salva com sucesso!",
      });
      
      // Redireciona para a conversa salva
      navigate(`/history/${response.id}`);
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar a conversa. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col h-full max-h-screen">
      <div className="border-b border-white/10 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <ChatObjectiveSelector 
              objectives={objectives}
              onSelect={handleObjectiveSelect}
            />
          </div>
          <Button 
            variant="bordered" 
            size="sm" 
            className={`ml-2 transition-all flex items-center gap-1 ${isSaved ? 'bg-white/10 text-green-400' : 'text-white hover:text-green-400'}`}
            onClick={handleSaveConversation}
          >
            <Save size={16} />
            {isSaved ? 'Salva' : 'Salvar conversa'}
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div 
              className="w-16 h-16 mb-4 rounded-full bg-white/10 flex items-center justify-center"
            >
              <span className="text-green-400 text-xl">AI</span>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-white">Agente de IA para Product Discovery</h2>
            <p className="text-white/70 max-w-md">
              Vou te ajudar a investigar o que já se sabe sobre o seu produto e usuários, validar hipóteses e construir insights com base nos nossos dados.
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
