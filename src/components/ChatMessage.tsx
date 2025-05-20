
import { useState } from 'react';
import { ThumbsUp, ThumbsDown, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, Modal } from '@heroui/react';
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
    <div 
      className={`${style.bg} ${style.border} border-l-4 rounded-md my-4 p-4`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{style.icon}</div>
        <p className="text-sm">{children}</p>
      </div>
    </div>
  );
};

const ChatMessage = ({ content, isUser, isLoading, sources }: MessageProps) => {
  const [liked, setLiked] = useState<boolean | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    setIsModalOpen(false);
  };

  // Componentes de renderização customizados para markdown
  const renderers = {
    h1: ({ children }: { children: React.ReactNode }) => (
      <h1 className="text-2xl font-bold mt-6 mb-3 pb-2 border-b border-white/10 text-white">{children}</h1>
    ),
    h2: ({ children }: { children: React.ReactNode }) => (
      <h2 className="text-xl font-bold mt-5 mb-3 text-white/90">{children}</h2>
    ),
    h3: ({ children }: { children: React.ReactNode }) => (
      <h3 className="text-lg font-semibold mt-4 mb-2 text-white/90">{children}</h3>
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
      
      return <p className="my-2 leading-relaxed">{children}</p>;
    },
    blockquote: ({ children }: { children: React.ReactNode }) => (
      <div className="pl-4 border-l-2 border-primary/50 italic my-4 text-white/80">{children}</div>
    ),
    ul: ({ children }: { children: React.ReactNode }) => (
      <ul className="list-disc pl-6 my-3 space-y-1">{children}</ul>
    ),
    ol: ({ children }: { children: React.ReactNode }) => (
      <ol className="list-decimal pl-6 my-3 space-y-1">{children}</ol>
    ),
    li: ({ children }: { children: React.ReactNode }) => (
      <li className="my-1">{children}</li>
    ),
    hr: () => <hr className="my-4 border-white/10" />,
    code: ({ node, inline, className, children, ...props }: any) => {
      // Verificando se é um code block de gráfico
      const match = /language-chart/.exec(className || '');
      if (match) {
        return renderChart(children.toString());
      }
      
      if (inline) {
        return <code className="bg-secondary/50 px-1.5 py-0.5 rounded-sm text-sm font-mono" {...props}>{children}</code>;
      }
      
      return (
        <div className="my-4 bg-secondary/30 p-4 rounded-md">
          <pre className="overflow-auto text-sm font-mono text-white/90">
            <code {...props}>{children}</code>
          </pre>
        </div>
      );
    }
  };

  if (isUser) {
    return (
      <div className="flex justify-end mb-4 animate-fade-in">
        <div className="bg-primary/10 p-4 rounded-lg max-w-[80%] shadow-sm">
          <p className="text-white">{content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col mb-6 animate-fade-in", isLoading ? "opacity-80" : "")}>
      <div className="bg-secondary/30 p-4 rounded-lg max-w-[90%] shadow-sm relative hero-card">
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce-soft" style={{ animationDelay: "0ms" }}></div>
              <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce-soft" style={{ animationDelay: "150ms" }}></div>
              <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce-soft" style={{ animationDelay: "300ms" }}></div>
            </div>
            <p className="text-white/70 italic">A IA está elaborando uma resposta...</p>
          </div>
        ) : (
          <>
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown components={renderers}>{content}</ReactMarkdown>
            </div>
            
            {sources && sources.length > 0 && (
              <div className="mt-4 pt-3 border-t border-white/10">
                <p className="text-muted-foreground text-sm mb-2">Fontes utilizadas:</p>
                <div className="flex flex-col gap-2">
                  {sources.map(source => (
                    <ChatSourceReference key={source.id} source={source} />
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex items-center mt-3 pt-3 border-t border-white/10">
              <Button 
                onClick={() => setLiked(true)} 
                variant="ghost"
                size="sm"
                color={liked === true ? "primary" : "default"}
                className="transition-all mr-2 p-1"
              >
                <ThumbsUp size={18} />
              </Button>
              
              <Button 
                onClick={() => {
                  setLiked(false);
                  setIsModalOpen(true);
                }}
                variant="ghost"
                size="sm"
                color={liked === false ? "danger" : "default"}
                className="transition-all p-1"
              >
                <ThumbsDown size={18} />
              </Button>
              
              <Modal 
                open={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
              >
                <div className="bg-background p-6 rounded-lg max-w-md w-full mx-auto">
                  <h3 className="text-lg font-medium mb-4">Como podemos melhorar?</h3>
                  <div 
                    className="grid grid-cols-2 gap-2 my-4"
                  >
                    {FeedbackOptions.map(option => (
                      <Button
                        key={option.id}
                        onClick={() => toggleFeedbackOption(option.id)}
                        variant={selectedFeedback.includes(option.id) ? "solid" : "bordered"}
                        color={selectedFeedback.includes(option.id) ? "primary" : "default"}
                        size="sm"
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Comentários adicionais (opcional)"
                    className="w-full bg-secondary/30 border border-secondary rounded-md px-3 py-2 mt-2 mb-4 text-sm resize-none h-24 focus:outline-none focus:ring-1 focus:ring-primary"
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <Button 
                      color="primary" 
                      onClick={handleFeedbackSubmit}
                    >
                      Enviar feedback
                    </Button>
                  </div>
                </div>
              </Modal>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
