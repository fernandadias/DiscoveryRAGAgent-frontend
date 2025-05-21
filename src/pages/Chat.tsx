import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save } from 'lucide-react';
import { nanoid } from 'nanoid';
import { Button } from '@heroui/react';
import ChatObjectiveSelector from '@/components/ChatObjectiveSelector';
import ChatMessage, { MessageProps } from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import { useSendMessage, useSaveConversation, useObjectives } from '@/hooks/use-api';
import { toast } from '@/hooks/use-toast';

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
  const { data: objectives = [] } = useObjectives();

  // Definir o objetivo padrão quando os objetivos são carregados
  useEffect(() => {
    if (objectives.length > 0 && !selectedObjective) {
      // Encontrar o objetivo "Sobre a discovery" ou usar o primeiro
      const defaultObjective = objectives.find(obj => 
        obj.title.toLowerCase().includes('discovery')
      ) || objectives[0];
      
      if (defaultObjective) {
        setSelectedObjective(defaultObjective.id);
      }
    }
  }, [objectives, selectedObjective]);

  const handleMessageSent = (userMessage: string, response: string, sources: any[]) => {
    // Atualizar o título da conversa se for a primeira mensagem
    if (messages.length === 0 && !isSaved) {
      const newTitle = userMessage.length > 50 ? userMessage.substring(0, 50) + '...' : userMessage;
      setConversationTitle(newTitle);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;
    
    // Add user message
    const userMessage: MessageProps = {
      id: nanoid(),
      content,
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    
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
    
    // Send message to API
    setIsLoading(true);
    
    try {
      const response = await sendMessageMutation.mutateAsync({
        message: content,
        conversationId: conversationId,
        objectiveId: selectedObjective
      });
      
      // Set conversation ID if not already set
      if (!conversationId) {
        setConversationId(response.conversation_id);
      }
      
      // Remove loading message and add real response
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
      
      // Notificar sobre a mensagem enviada
      handleMessageSent(content, response.response, response.sources);
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Remove loading message and add error message
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== loadingMessageId);
        return [
          ...filtered, 
          {
            id: nanoid(),
            content: "Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.",
            isUser: false,
            timestamp: new Date()
          }
        ];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveConversation = () => {
    if (messages.length === 0) {
      toast({
        title: "Nada para salvar",
        description: "Inicie uma conversa antes de salvar.",
        variant: "destructive",
      });
      return;
    }

    // Preparar mensagens para salvar
    const messagesToSave = messages.map(msg => ({
      content: msg.content,
      isUser: msg.isUser,
      timestamp: msg.timestamp
    }));

    // Salvar conversa via API
    saveConversationMutation.mutate(
      {
        title: conversationTitle,
        messages: messagesToSave
      },
      {
        onSuccess: (data) => {
          setIsSaved(true);
          // Se não temos um ID de conversa, usar o retornado pela API
          if (!conversationId) {
            setConversationId(data.id);
          }
          
          toast({
            title: "Conversa salva",
            description: "Sua conversa foi salva com sucesso!",
          });
        },
        onError: () => {
          toast({
            title: "Erro ao salvar",
            description: "Não foi possível salvar a conversa. Tente novamente.",
            variant: "destructive",
          });
        }
      }
    );
  };

  // Sugestões iniciais para o chat
  const initialSuggestions = [
    "Como podemos melhorar o processo de discovery do nosso produto?",
    "Quais métricas são mais relevantes para validar hipóteses de produto?",
    "Preciso de insights sobre o comportamento dos usuários no nosso app"
  ];

  return (
    <div className="flex flex-col h-full max-h-screen">
      <div className="border-b border-white/10 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <ChatObjectiveSelector 
              objectives={objectives}
              selectedObjective={selectedObjective}
              onSelectObjective={setSelectedObjective}
              disabled={isLoading}
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
            <h2 className="text-2xl font-bold mb-2 text-white">IA Discovery Assistant</h2>
            <p className="text-white/70 max-w-md mb-8">
              Responda suas dúvidas sobre produtos, valide hipóteses de negócio e obtenha insights valiosos com base nos nossos dados.
            </p>
            
            {/* Sugestões iniciais */}
            <div className="w-full max-w-md space-y-2">
              <p className="text-white/60 text-sm">Experimente perguntar:</p>
              {initialSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(suggestion)}
                  className="w-full text-left p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/80 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map(message => (
            <ChatMessage key={message.id} {...message} />
          ))
        )}
      </div>
      
      <ChatInput 
        conversationId={conversationId}
        onMessageSent={handleMessageSent}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default Chat;
