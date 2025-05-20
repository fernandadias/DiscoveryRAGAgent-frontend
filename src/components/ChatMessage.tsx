import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, BookOpen, FileText, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Button } from '@heroui/react';
import FeedbackModal from './FeedbackModal';
import { Source } from '@/hooks/use-api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export interface MessageProps {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  sources?: Source[];
  isLoading?: boolean;
}

const ChatMessage: React.FC<MessageProps> = ({
  id,
  content,
  isUser,
  timestamp,
  sources = [],
  isLoading = false
}) => {
  const [showSources, setShowSources] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<'positive' | 'negative' | null>(null);

  const handlePositiveFeedback = () => {
    setFeedbackGiven('positive');
    // Em uma implementação real, enviar feedback positivo para o backend
  };

  const handleNegativeFeedback = () => {
    setFeedbackModalOpen(true);
    setFeedbackGiven('negative');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Componentes personalizados para o ReactMarkdown
  const components = {
    h1: ({ node, ...props }) => <h1 className="text-2xl font-bold text-white/90 mt-6 mb-4 pb-2 border-b border-white/10" {...props} />,
    h2: ({ node, ...props }) => <h2 className="text-xl font-bold text-white/90 mt-5 mb-3 pb-1 border-b border-white/10" {...props} />,
    h3: ({ node, ...props }) => <h3 className="text-lg font-bold text-white/90 mt-4 mb-2" {...props} />,
    h4: ({ node, ...props }) => <h4 className="text-base font-bold text-white/90 mt-3 mb-2" {...props} />,
    p: ({ node, ...props }) => <p className="text-white/80 my-3 leading-relaxed" {...props} />,
    ul: ({ node, ...props }) => <ul className="list-disc pl-6 my-3 space-y-1 text-white/80" {...props} />,
    ol: ({ node, ...props }) => <ol className="list-decimal pl-6 my-3 space-y-1 text-white/80" {...props} />,
    li: ({ node, ...props }) => <li className="my-1" {...props} />,
    blockquote: ({ node, ...props }) => (
      <blockquote className="border-l-4 border-green-500/50 pl-4 py-1 my-4 bg-white/5 rounded-r" {...props} />
    ),
    code: ({ node, inline, className, children, ...props }) => {
      if (inline) {
        return <code className="bg-white/10 px-1 py-0.5 rounded text-green-300 font-mono text-sm" {...props}>{children}</code>;
      }
      return (
        <div className="bg-zinc-900 rounded-md my-4 overflow-hidden">
          <div className="bg-zinc-800 px-4 py-1 text-xs text-white/60 font-mono border-b border-white/10">Código</div>
          <pre className="p-4 overflow-x-auto">
            <code className={className} {...props}>
              {children}
            </code>
          </pre>
        </div>
      );
    },
    table: ({ node, ...props }) => (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full divide-y divide-white/10 border border-white/10 rounded" {...props} />
      </div>
    ),
    thead: ({ node, ...props }) => <thead className="bg-white/5" {...props} />,
    th: ({ node, ...props }) => <th className="px-4 py-2 text-left text-xs font-medium text-white/70 uppercase tracking-wider" {...props} />,
    td: ({ node, ...props }) => <td className="px-4 py-2 text-white/80 border-t border-white/10" {...props} />,
    a: ({ node, ...props }) => <a className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
    img: ({ node, ...props }) => (
      <div className="my-4">
        <img className="max-w-full h-auto rounded-md" {...props} />
      </div>
    ),
    hr: ({ node, ...props }) => <hr className="my-6 border-white/10" {...props} />,
  };

  // Processamento de callouts personalizados
  const processedContent = !isUser ? content
    .replace(/:::info\s+([\s\S]*?):::/g, '<div class="p-3 bg-blue-500/10 border-l-4 border-blue-500 rounded my-4"><div class="font-bold text-blue-400 mb-1">ℹ️ Informação</div>$1</div>')
    .replace(/:::warning\s+([\s\S]*?):::/g, '<div class="p-3 bg-yellow-500/10 border-l-4 border-yellow-500 rounded my-4"><div class="font-bold text-yellow-400 mb-1">⚠️ Atenção</div>$1</div>')
    .replace(/:::success\s+([\s\S]*?):::/g, '<div class="p-3 bg-green-500/10 border-l-4 border-green-500 rounded my-4"><div class="font-bold text-green-400 mb-1">✅ Sucesso</div>$1</div>')
    .replace(/:::error\s+([\s\S]*?):::/g, '<div class="p-3 bg-red-500/10 border-l-4 border-red-500 rounded my-4"><div class="font-bold text-red-400 mb-1">❌ Erro</div>$1</div>')
    : content;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`rounded-lg p-4 max-w-[85%] ${isUser ? 'bg-green-600/20 text-white' : 'bg-white/10 text-white'}`}>
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${isUser ? 'bg-green-600/30' : 'bg-white/20'}`}>
            {isUser ? 'U' : 'AI'}
          </div>
          <span className="text-xs text-white/50">{formatTime(timestamp)}</span>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col space-y-4 py-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-white/50 animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-white/50 animate-pulse delay-75"></div>
              <div className="w-2 h-2 rounded-full bg-white/50 animate-pulse delay-150"></div>
            </div>
            <div className="text-sm text-white/60 italic">
              Processando sua consulta e buscando informações relevantes...
            </div>
          </div>
        ) : (
          <div className="prose prose-invert max-w-none markdown-custom">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={components}
            >
              {processedContent}
            </ReactMarkdown>
          </div>
        )}
        
        {!isUser && !isLoading && (
          <div className="mt-4 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between">
              {sources && sources.length > 0 && (
                <button
                  onClick={() => setShowSources(!showSources)}
                  className="text-xs flex items-center gap-1 text-white/50 hover:text-white/80 transition-colors"
                >
                  <BookOpen size={14} />
                  {showSources ? 'Ocultar fontes' : `Mostrar fontes (${sources.length})`}
                </button>
              )}
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={handlePositiveFeedback}
                  disabled={feedbackGiven !== null}
                  className={`p-1.5 rounded-full ${feedbackGiven === 'positive' ? 'text-green-400 bg-green-400/10' : 'text-white/50 hover:text-white/80 hover:bg-white/5'}`}
                >
                  <ThumbsUp size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={handleNegativeFeedback}
                  disabled={feedbackGiven !== null}
                  className={`p-1.5 rounded-full ${feedbackGiven === 'negative' ? 'text-red-400 bg-red-400/10' : 'text-white/50 hover:text-white/80 hover:bg-white/5'}`}
                >
                  <ThumbsDown size={14} />
                </Button>
              </div>
            </div>
            
            {showSources && (
              <div className="mt-3 space-y-2">
                <h4 className="text-xs font-medium text-white/70 flex items-center gap-1">
                  <FileText size={14} />
                  Fontes utilizadas:
                </h4>
                <div className="space-y-2">
                  {sources.map((source) => (
                    <div key={source.id} className="bg-white/5 p-3 rounded text-xs">
                      <div className="font-medium text-white/90">{source.name}</div>
                      <div className="text-white/70 mt-1 leading-relaxed">{source.snippet}</div>
                      {source.link && (
                        <a 
                          href={source.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline mt-2 inline-block text-xs"
                        >
                          Ver documento completo
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Feedback Modal */}
      <FeedbackModal 
        isOpen={feedbackModalOpen} 
        onClose={() => setFeedbackModalOpen(false)} 
        messageId={id}
      />
    </div>
  );
};

export default ChatMessage;
