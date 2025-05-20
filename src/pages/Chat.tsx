import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save } from 'lucide-react';
import { nanoid } from 'nanoid';
import { Button } from '@heroui/react';
import ChatObjectiveSelector from '@/components/ChatObjectiveSelector';
import ChatMessage, { MessageProps, Source } from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import { useSendMessage, useSaveConversation } from '@/hooks/use-api';
import api from '@/lib/api';
import { toast } from '@/hooks/use-toast';

const Chat = () => {
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedObjective, setSelectedObjective] = useState<string | null>(null);
  const [objectives, setObjectives] = useState<{id: string, label: string}[]>([]);
  const [conversationTitle, setConversationTitle] = useState<string>('Nova conversa');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const navigate = useNavigate();
  const sendMessageMutation = useSendMessage();
  const saveConversationMutation = useSaveConversation();

  // Carregar objetivos e definir o padrão
  useEffect(() => {
    const fetchObjectives = async () => {
      try {
        // Buscar todos os objetivos
        const objectivesResponse = await api.get('/api/objectives');
        const objectivesList = objectivesResponse.data.map((obj: any) => ({
          id: obj.id,
          label: obj.title
        }));
        setObjectives(objectivesList);
        
        // Buscar o objetivo padrão
        const defaultObjectiveResponse = await api.get('/api/objectives/default');
        setSelectedObjective(defaultObjectiveResponse.data);
      } catch (error) {
        console.error('Error fetching objectives:', error);
        toast({
          title: "Erro ao carregar objetivos",
          description: "Não foi possível carregar os objetivos da conversa.",
          variant: "destructive",
        });
      }
    };
    
    fetchObjectives();
  }, []);

  const handleSendMessage = (content: string) => {
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
    sendMessageMutation.mutate(
      { 
        message: content, 
        conversationId: conversationId,
        objectiveId: selectedObjective 
      },
      {
        onSuccess: (data) => {
          setIsLoading(false);
          
          // Set conversation ID if not already set
          if (!conversationId) {
            setConversationId(data.conversation_id);
          }
          
          // Remove loading message and add real response
          setMessages(prev => {
            const filtered = prev.filter(m => m.id !== loadingMessageId);
            return [
              ...filtered, 
              {
                id: nanoid(),
                content: data.response,
                isUser: false,
                timestamp: new Date(),
                sources: data.sources
              }
            ];
          });
          
          // Se é a primeira mensagem, atualiza o título automático da conversa
          if (messages.length === 0 && !isSaved) {
            // Cria um título baseado na primeira mensagem (limitado a 50 caracteres)
            const newTitle = content.length > 50 ? content.substring(0, 50) + '...' : content;
            setConversationTitle(newTitle);
          }
        },
        onError: () => {
          setIsLoading(false);
          
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
        }
      }
    );
  };

  const handleObjectiveSelect = (objectiveId: string) => {
    setSelectedObjective(objectiveId);
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

  return (
    <div className="flex flex-col h-full max-h-screen">
      <div className="border-b border-white/10 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <ChatObjectiveSelector 
              objectives={objectives}
              selectedObjective={selectedObjective}
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
            <h2 className="text-2xl font-bold mb-2 text-white">IA Discovery Assistant</h2>
            <p className="text-white/70 max-w-md">
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
          suggestions={messages.length === 0 ? [
            "Como podemos melhorar o processo de discovery do nosso produto?",
            "Quais métricas são mais relevantes para validar hipóteses de produto?",
            "Preciso de insights sobre o comportamento dos usuários no nosso app"
          ] : undefined}
        />
      </div>
    </div>
  );
};

export default Chat;
