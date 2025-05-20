
import { useState } from 'react';
import { ThumbsUp, ThumbsDown, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { 
  Box, 
  Flex, 
  Text, 
  Button, 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  Textarea,
  useDisclosure,
  Badge
} from '@heroui/react';
import { cn } from '@/lib/utils';
import ChatSourceReference from './ChatSourceReference';
import ReactMarkdown from 'react-markdown';
import { ChartContainer } from "@/components/ui/chart";
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

export interface Source {
  id: string;
  name: string;
  snippet: string;
  link: string;
}

export interface MessageProps {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  isLoading?: boolean;
  sources?: Source[];
}

const FeedbackOptions = [
  { id: 'vague', label: 'Resposta vaga' },
  { id: 'confusing', label: 'Resposta confusa' },
  { id: 'generic', label: 'Muito genérica' },
  { id: 'outdated', label: 'Informações desatualizadas' },
];

// Função para renderizar os gráficos a partir de markdown code blocks
const renderChart = (chartConfig: string) => {
  try {
    const configStr = chartConfig.trim();
    const parsedConfig = eval(`(${configStr})`);
    
    if (parsedConfig.type === 'line') {
      return (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={parsedConfig.data.labels.map((label: string, i: number) => {
            const dataPoint: any = { name: label };
            parsedConfig.data.datasets.forEach((dataset: any, j: number) => {
              dataPoint[dataset.label] = dataset.data[i];
            });
            return dataPoint;
          })}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="name" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip contentStyle={{ backgroundColor: '#222', border: '1px solid #444' }} />
            <Legend />
            {parsedConfig.data.datasets.map((dataset: any, i: number) => (
              <Line 
                key={i}
                type="monotone" 
                dataKey={dataset.label} 
                stroke={['#9b87f5', '#7E69AB', '#6E59A5', '#D6BCFA'][i % 4]} 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      );
    } else if (parsedConfig.type === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={parsedConfig.data.labels.map((label: string, i: number) => {
            const dataPoint: any = { name: label };
            parsedConfig.data.datasets.forEach((dataset: any, j: number) => {
              dataPoint[dataset.label] = dataset.data[i];
            });
            return dataPoint;
          })}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="name" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip contentStyle={{ backgroundColor: '#222', border: '1px solid #444' }} />
            <Legend />
            {parsedConfig.data.datasets.map((dataset: any, i: number) => (
              <Bar 
                key={i} 
                dataKey={dataset.label} 
                fill={['#9b87f5', '#7E69AB', '#6E59A5', '#D6BCFA'][i % 4]} 
                radius={[4, 4, 0, 0]} 
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      );
    }
    return null;
  } catch (error) {
    console.error("Error rendering chart:", error);
    return <div className="text-destructive text-xs">Erro ao renderizar gráfico</div>;
  }
};

// Componente personalizado para renderizar callouts
const Callout = ({ children, type = 'info' }: { children: React.ReactNode; type?: 'info' | 'warning' | 'success' }) => {
  const styles = {
    info: {
      bg: 'bg-primary/10',
      border: 'border-primary/30',
      icon: <Info size={20} className="text-primary" />
    },
    warning: {
      bg: 'bg-amber-400/10',
      border: 'border-amber-400/30',
      icon: <AlertCircle size={20} className="text-amber-400" />
    },
    success: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      icon: <CheckCircle size={20} className="text-green-500" />
    }
  };

  const style = styles[type];
  
  return (
    <Box 
      className={`${style.bg} ${style.border}`} 
      borderLeftWidth="4px" 
      rounded="md" 
      my={4} 
      p={4}
    >
      <Flex alignItems="start" gap={3}>
        <Box mt={0.5}>{style.icon}</Box>
        <Text size="sm">{children}</Text>
      </Flex>
    </Box>
  );
};

const ChatMessage = ({ content, isUser, isLoading, sources }: MessageProps) => {
  const [liked, setLiked] = useState<boolean | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedFeedback, setSelectedFeedback] = useState<string[]>([]);
  const [comment, setComment] = useState('');

  const toggleFeedbackOption = (id: string) => {
    setSelectedFeedback(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  const handleFeedbackSubmit = () => {
    console.log('Feedback submitted:', { selectedFeedback, comment });
    onClose();
  };

  // Componentes de renderização customizados para markdown
  const renderers = {
    h1: ({ children }: { children: React.ReactNode }) => (
      <Text as="h1" fontSize="2xl" fontWeight="bold" mt={6} mb={3} pb={2} borderBottom="1px solid" borderColor="white/10" color="white">{children}</Text>
    ),
    h2: ({ children }: { children: React.ReactNode }) => (
      <Text as="h2" fontSize="xl" fontWeight="bold" mt={5} mb={3} color="white/90">{children}</Text>
    ),
    h3: ({ children }: { children: React.ReactNode }) => (
      <Text as="h3" fontSize="lg" fontWeight="semibold" mt={4} mb={2} color="white/90">{children}</Text>
    ),
    p: ({ children }: { children: React.ReactNode }) => {
      const text = children?.toString() || '';
      
      if (text.startsWith(':::info')) {
        const content = text.replace(':::info', '');
        return <Callout type="info">{content}</Callout>;
      } else if (text.startsWith(':::warning')) {
        const content = text.replace(':::warning', '');
        return <Callout type="warning">{content}</Callout>;
      } else if (text.startsWith(':::success')) {
        const content = text.replace(':::success', '');
        return <Callout type="success">{content}</Callout>;
      }
      
      return <Text my={2} lineHeight="relaxed">{children}</Text>;
    },
    blockquote: ({ children }: { children: React.ReactNode }) => (
      <Box pl={4} borderLeft="2px solid" borderColor="primary/50" fontStyle="italic" my={4} color="white/80">{children}</Box>
    ),
    ul: ({ children }: { children: React.ReactNode }) => (
      <Box as="ul" className="list-disc" pl={6} my={3} className="space-y-1">{children}</Box>
    ),
    ol: ({ children }: { children: React.ReactNode }) => (
      <Box as="ol" className="list-decimal" pl={6} my={3} className="space-y-1">{children}</Box>
    ),
    li: ({ children }: { children: React.ReactNode }) => (
      <Box as="li" my={1}>{children}</Box>
    ),
    hr: () => <Box as="hr" my={4} borderColor="white/10" />,
    code: ({ node, inline, className, children, ...props }: any) => {
      // Verificando se é um code block de gráfico
      const match = /language-chart/.exec(className || '');
      if (match) {
        return renderChart(children.toString());
      }
      
      if (inline) {
        return <Box as="code" bg="secondary/50" px={1.5} py={0.5} rounded="sm" fontSize="sm" fontFamily="mono" {...props}>{children}</Box>;
      }
      
      return (
        <Box my={4} bg="secondary/30" p={4} rounded="md">
          <Box as="pre" overflow="auto" fontSize="sm" fontFamily="mono" color="white/90">
            <Box as="code" {...props}>{children}</Box>
          </Box>
        </Box>
      );
    }
  };

  if (isUser) {
    return (
      <Flex justify="end" mb={4} className="animate-fade-in">
        <Box bg="primary/10" p={4} rounded="lg" maxW="80%" className="shadow-sm">
          <Text color="white">{content}</Text>
        </Box>
      </Flex>
    );
  }

  return (
    <Flex direction="column" mb={6} className={cn("animate-fade-in", isLoading ? "opacity-80" : "")}>
      <Box bg="secondary/30" p={4} rounded="lg" maxW="90%" className="shadow-sm relative hero-card">
        {isLoading ? (
          <Flex alignItems="center" gap={2}>
            <Flex gap={1}>
              <Box w={2} h={2} bg="primary/60" rounded="full" className="animate-bounce-soft" style={{ animationDelay: "0ms" }}></Box>
              <Box w={2} h={2} bg="primary/60" rounded="full" className="animate-bounce-soft" style={{ animationDelay: "150ms" }}></Box>
              <Box w={2} h={2} bg="primary/60" rounded="full" className="animate-bounce-soft" style={{ animationDelay: "300ms" }}></Box>
            </Flex>
            <Text color="white/70" fontStyle="italic">A IA está elaborando uma resposta...</Text>
          </Flex>
        ) : (
          <>
            <Box className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown components={renderers}>{content}</ReactMarkdown>
            </Box>
            
            {sources && sources.length > 0 && (
              <Box mt={4} pt={3} borderTop="1px solid" borderColor="white/10">
                <Text color="muted" fontSize="sm" mb={2}>Fontes utilizadas:</Text>
                <Flex direction="column" gap={2}>
                  {sources.map(source => (
                    <ChatSourceReference key={source.id} source={source} />
                  ))}
                </Flex>
              </Box>
            )}
            
            <Flex alignItems="center" mt={3} pt={3} borderTop="1px solid" borderColor="white/10">
              <Button 
                onClick={() => setLiked(true)} 
                variant="ghost"
                size="sm"
                colorScheme={liked === true ? "primary" : "gray"}
                mr={2}
                className="transition-all"
                p={1}
              >
                <ThumbsUp size={18} />
              </Button>
              
              <Button 
                onClick={() => {
                  setLiked(false);
                  onOpen();
                }}
                variant="ghost"
                size="sm"
                colorScheme={liked === false ? "red" : "gray"}
                className="transition-all"
                p={1}
              >
                <ThumbsDown size={18} />
              </Button>
              
              <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Como podemos melhorar?</ModalHeader>
                  <ModalBody>
                    <Box 
                      display="grid" 
                      gridTemplateColumns="repeat(2, 1fr)" 
                      gap={2} 
                      my={4}
                    >
                      {FeedbackOptions.map(option => (
                        <Button
                          key={option.id}
                          onClick={() => toggleFeedbackOption(option.id)}
                          variant={selectedFeedback.includes(option.id) ? "solid" : "outline"}
                          colorScheme={selectedFeedback.includes(option.id) ? "primary" : "gray"}
                          size="sm"
                        >
                          {option.label}
                        </Button>
                      ))}
                    </Box>
                    <Textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Comentários adicionais (opcional)"
                      size="sm"
                      rows={3}
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button colorScheme="primary" onClick={handleFeedbackSubmit}>
                      Enviar feedback
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </Flex>
          </>
        )}
      </Box>
    </Flex>
  );
};

export default ChatMessage;
