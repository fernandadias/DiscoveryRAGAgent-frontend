
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Save } from 'lucide-react';
import { nanoid } from 'nanoid';
import { Box, Button, Flex, Heading, Text, Center, Icon } from '@heroui/react';
import ChatObjectiveSelector from '@/components/ChatObjectiveSelector';
import ChatMessage, { MessageProps, Source } from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';

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
  const [conversationTitle, setConversationTitle] = useState<string>('Nova conversa');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const navigate = useNavigate();

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
        
        // Generate a rich response with various formats
        let responseContent = "";
        
        // Generate content based on the user's message
        if (content.toLowerCase().includes('tendência') || content.toLowerCase().includes('mercado')) {
          responseContent = 
          `## Análise de Tendências de Mercado

> De acordo com nossas análises mais recentes, o mercado de IA deve crescer aproximadamente 35% até 2025, com um enfoque particular em soluções personalizadas para pequenas e médias empresas.

### Principais setores impactados:
* Saúde e bem-estar
* Finanças pessoais
* Educação online
* Varejo personalizado

Os dados mostram uma clara tendência de adoção:
1. Fase inicial (2023): Experimentação e casos de uso limitados
2. Fase atual (2025): Integração em processos críticos
3. Próxima fase (2026+): Automação completa de fluxos decisórios

:::info
78% dos consumidores preferem interagir com empresas que oferecem experiências personalizadas baseadas em IA.
:::

---

O gráfico abaixo mostra a evolução da adoção por setor:

\`\`\`chart
type: 'bar',
data: {
  labels: ['Saúde', 'Finanças', 'Educação', 'Varejo'],
  datasets: [{
    label: '2023',
    data: [25, 40, 30, 35]
  },{
    label: '2025 (projeção)',
    data: [65, 70, 55, 78]
  }]
}
\`\`\``;
        } else {
          responseContent = 
          `## Insights sobre sua pergunta

Aqui estão alguns pontos importantes a considerar:

:::warning
Estas informações são baseadas em dados históricos e podem não representar desenvolvimentos muito recentes.
:::

### Aspectos a considerar:
* Comportamento do consumidor está mudando rapidamente
* Novas tecnologias emergentes podem alterar o panorama
* Regulamentações em discussão podem impactar o setor

> "A inovação distingue entre um líder e um seguidor" - Steve Jobs

Recomendamos uma abordagem estruturada:

1. Validar hipóteses com testes de mercado
2. Obter feedback contínuo dos usuários
3. Adaptar estratégias com base em métricas claras

\`\`\`
Lembre-se que o sucesso depende da capacidade de adaptação 
e da velocidade de resposta às mudanças do mercado.
\`\`\``;
        }
        
        return [
          ...filtered, 
          {
            id: nanoid(),
            content: responseContent,
            isUser: false,
            timestamp: new Date(),
            sources: mockSources
          }
        ];
      });
    }, 3000);

    // Se é a primeira mensagem, atualiza o título automático da conversa
    if (messages.length === 0 && !isSaved) {
      // Cria um título baseado na primeira mensagem (limitado a 50 caracteres)
      const newTitle = content.length > 50 ? content.substring(0, 50) + '...' : content;
      setConversationTitle(newTitle);
    }
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

    // Aqui seria a integração com backend para salvar a conversa
    // Por enquanto, apenas simulamos o comportamento
    
    setIsSaved(true);
    toast({
      title: "Conversa salva",
      description: "Sua conversa foi salva com sucesso!",
    });
    
    // Em uma implementação real, redirecionaríamos para a conversa salva
    // navigate(`/history/${conversationId}`);
  };

  return (
    <Flex direction="column" h="full" maxH="screen">
      <Box borderBottom="1px solid" borderColor="white/10" p={4}>
        <Flex alignItems="center" justifyContent="between" mb={4}>
          <Box flex="1">
            <ChatObjectiveSelector 
              objectives={objectives}
              onSelect={handleObjectiveSelect}
            />
          </Box>
          <Button 
            variant="outline" 
            size="sm" 
            colorScheme={isSaved ? "primary" : "gray"}
            leftIcon={<Save size={16} />}
            onClick={handleSaveConversation}
            ml={2}
            className="transition-all"
          >
            {isSaved ? 'Salva' : 'Salvar conversa'}
          </Button>
        </Flex>
      </Box>
      
      <Box flex="1" overflowY="auto" p={4} className="space-y-4">
        {messages.length === 0 ? (
          <Center flexDirection="column" h="full" textAlign="center">
            <Center 
              w="16" 
              h="16" 
              mb={4} 
              rounded="full" 
              bg="primary/20" 
              className="text-gradient-primary"
            >
              <Text className="text-gradient-primary" fontSize="xl">AI</Text>
            </Center>
            <Heading as="h2" size="lg" mb={2} color="white">IA Discovery Assistant</Heading>
            <Text color="muted" maxW="md">
              Responda suas dúvidas sobre produtos, valide hipóteses de negócio e obtenha insights valiosos com base nos nossos dados.
            </Text>
          </Center>
        ) : (
          messages.map(message => (
            <ChatMessage key={message.id} {...message} />
          ))
        )}
      </Box>
      
      <Box p={4} borderTop="1px solid" borderColor="white/10">
        <ChatInput 
          onSendMessage={handleSendMessage} 
          isLoading={isLoading}
          suggestions={messages.length === 0 ? chatSuggestions : undefined}
        />
      </Box>
    </Flex>
  );
};

export default Chat;
