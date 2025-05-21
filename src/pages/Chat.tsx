import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Trash2 } from 'lucide-react';
import { nanoid } from 'nanoid';
import { Button } from '@heroui/react';
import ChatObjectiveSelector from '@/components/ChatObjectiveSelector';
import ChatMessage, { MessageProps } from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import AutoObjectiveClassifier from '@/components/AutoObjectiveClassifier';
import { useSendMessage, useSaveConversation, useObjectives, useDeleteConversation } from '@/hooks/use-api';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Chat = () => {
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedObjective, setSelectedObjective] = useState<string | null>(null);
  const [conversationTitle, setConversationTitle] = useState<string>('Nova conversa');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [thinkingStage, setThinkingStage] = useState<string>('');
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const [showObjectiveClassifier, setShowObjectiveClassifier] = useState(false);
  
  const navigate = useNavigate();
  const sendMessageMutation = useSendMessage();
  const saveConversationMutation = useSaveConversation();
  const deleteConversationMutation = useDeleteConversation();
  const { data: objectives = [] } = useObjectives();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Definir o objetivo padrão quando os objetivos são carregados
  useEffect(() => {
    if (objectives.length > 0 && !selectedObjective) {
      // Encontrar o objetivo "Explorar o que já foi descoberto" ou usar o primeiro
      const defaultObjective = objectives.find(obj => 
        obj.title.toLowerCase().includes('explorar o que já foi descoberto')
      ) || objectives[0];
      
      if (defaultObjective) {
        setSelectedObjective(defaultObjective.id);
      }
    }
  }, [objectives, selectedObjective]);

  // Rolar para o final das mensagens quando novas mensagens são adicionadas
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleMessageSent = (userMessage: string, response: string, sources: any[]) => {
    // Atualizar o título da conversa se for a primeira mensagem
    if (messages.length === 0 && !isSaved) {
      const newTitle = userMessage.length > 50 ? userMessage.substring(0, 50) + '...' : userMessage;
      setConversationTitle(newTitle);
    }
  };

  const handleClassificationComplete = (objectiveId: string, autoAccepted: boolean) => {
    setSelectedObjective(objectiveId);
    setShowObjectiveClassifier(false);
    
    // Se a mensagem estava pendente, enviá-la agora com o objetivo classificado
    if (pendingMessage) {
      processSendMessage(pendingMessage, objectiveId);
      setPendingMessage(null);
    }
    
    // Mostrar toast informativo se foi aceito automaticamente
    if (autoAccepted) {
      const objectiveTitle = objectives.find(obj => obj.id === objectiveId)?.title || 'desconhecido';
      toast({
        title: "Objetivo identificado automaticamente",
        description: `Sua pergunta foi classificada como "${objectiveTitle}"`,
      });
    }
  };

  const handleClassificationCancel = () => {
    setShowObjectiveClassifier(false);
    // Se a mensagem estava pendente, enviá-la com o objetivo selecionado manualmente
    if (pendingMessage && selectedObjective) {
      processSendMessage(pendingMessage, selectedObjective);
      setPendingMessage(null);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;
    
    // Se o usuário já selecionou um objetivo manualmente, usar esse
    if (selectedObjective) {
      processSendMessage(content, selectedObjective);
    } else {
      // Caso contrário, mostrar o classificador automático
      setPendingMessage(content);
      setShowObjectiveClassifier(true);
    }
  };

  const processSendMessage = async (content: string, objectiveId: string) => {
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
    
    // Simular estágios de pensamento
    const thinkingStages = [
      'Analisando a consulta...',
      'Buscando documentos relevantes...',
      'Processando informações...',
      'Formulando resposta...',
      'Finalizando...'
    ];
    
    let stageIndex = 0;
    const thinkingInterval = setInterval(() => {
      if (stageIndex < thinkingStages.length) {
        setThinkingStage(thinkingStages[stageIndex]);
        stageIndex++;
      } else {
        clearInterval(thinkingInterval);
      }
    }, 1000);
    
    try {
      const response = await sendMessageMutation.mutateAsync({
        message: content,
        conversationId: conversationId,
        objectiveId: objectiveId
      });
      
      // Limpar intervalo de pensamento
      clearInterval(thinkingInterval);
      
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
            sources: response.sources,
            objectiveId: response.objective_id,
            autoClassified: response.auto_classified
          }
        ];
      });
      
      // Notificar sobre a mensagem enviada
      handleMessageSent(content, response.response, response.sources);
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Limpar intervalo de pensamento
      clearInterval(thinkingInterval);
      
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
      setThinkingStage('');
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
      timestamp: msg.timestamp,
      sources: msg.sources,
      objectiveId: msg.objectiveId,
      autoClassified: msg.autoClassified
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

  const handleDeleteConversation = () => {
    if (!conversationId) return;
    
    deleteConversationMutation.mutate(conversationId, {
      onSuccess: () => {
        // Redirecionar para a página inicial após excluir
        navigate('/');
      }
    });
  };

  // Sugestões iniciais para o chat
  const initialSuggestions = [
    "Como podemos melhorar a home do app para aumentar o engajamento dos usuários?",
    "Quais são os principais problemas que os usuários enfrentam com a home do app?",
    "Nossa hipótese é que usuários preferem uma home com menos elementos. Os dados confirmam isso?"
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
          <div className="flex gap-2">
            <Button 
              variant="bordered" 
              size="sm" 
              className={`transition-all flex items-center gap-1 ${isSaved ? 'bg-white/10 text-green-400' : 'text-white hover:text-green-400'}`}
              onClick={handleSaveConversation}
            >
              <Save size={16} />
              {isSaved ? 'Salva' : 'Salvar conversa'}
            </Button>
            
            {isSaved && (
              <Button 
                variant="bordered" 
                size="sm" 
                className="text-red-400 hover:bg-red-500/10 flex items-center gap-1"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 size={16} />
                Excluir
              </Button>
            )}
          </div>
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
              Responda suas dúvidas sobre a home do app, valide hipóteses de design e obtenha insights valiosos com base nos nossos dados.
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
          <>
            {messages.map(message => (
              <ChatMessage 
                key={message.id} 
                {...message} 
                thinkingStage={message.isLoading ? thinkingStage : undefined}
              />
            ))}
            
            {/* Componente de classificação automática */}
            {showObjectiveClassifier && pendingMessage && (
              <AutoObjectiveClassifier
                query={pendingMessage}
                onClassificationComplete={handleClassificationComplete}
                onCancel={handleClassificationCancel}
                objectives={objectives}
              />
            )}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      <ChatInput 
        conversationId={conversationId}
        onMessageSent={handleMessageSent}
        isLoading={isLoading || showObjectiveClassifier}
        setIsLoading={setIsLoading}
        onSendMessage={handleSendMessage}
      />
      
      {/* Diálogo de confirmação para exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-zinc-900 border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Excluir conversa</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              Tem certeza que deseja excluir esta conversa? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 text-white hover:bg-white/10 border-white/10">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
              onClick={handleDeleteConversation}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Chat;
