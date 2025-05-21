import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Source } from '@/hooks/use-api';
import { Loader2 } from 'lucide-react';

export interface MessageProps {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  sources?: Source[];
  isLoading?: boolean;
  thinkingStage?: string;
}

const ChatMessage: React.FC<MessageProps> = ({
  content,
  isUser,
  sources,
  isLoading,
  thinkingStage
}) => {
  // Componente para renderizar o estado de "pensando"
  const ThinkingState = () => (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-3">
        <Loader2 className="h-4 w-4 animate-spin text-green-400" />
        <p className="text-sm text-white/70">{thinkingStage || 'Processando...'}</p>
      </div>
      
      <div className="w-full bg-white/5 rounded-full h-1.5 mt-2">
        <div 
          className="bg-green-500/50 h-1.5 rounded-full animate-pulse" 
          style={{ 
            width: thinkingStage ? 
              (thinkingStage.includes("Analisando") ? "20%" : 
               thinkingStage.includes("Buscando") ? "40%" : 
               thinkingStage.includes("Processando") ? "60%" : 
               thinkingStage.includes("Formulando") ? "80%" : "95%") : "50%" 
          }}
        ></div>
      </div>
    </div>
  );

  // Componente para renderizar as fontes
  const SourcesList = ({ sources }: { sources: Source[] }) => (
    <div className="mt-4 pt-3 border-t border-white/10">
      <p className="text-sm font-medium text-white/70 mb-2">Fontes:</p>
      <div className="space-y-2">
        {sources.map((source) => (
          <div key={source.id} className="p-2 bg-white/5 rounded text-sm">
            <p className="font-medium text-white/80">{source.name}</p>
            <p className="text-white/60 text-xs mt-1">{source.snippet}</p>
          </div>
        ))}
      </div>
    </div>
  );

  // Componentes personalizados para o ReactMarkdown
  const components = {
    h1: ({ node, ...props }) => <h1 className="text-xl font-bold text-white mt-4 mb-2" {...props} />,
    h2: ({ node, ...props }) => <h2 className="text-lg font-bold text-white mt-3 mb-2" {...props} />,
    h3: ({ node, ...props }) => <h3 className="text-md font-bold text-white mt-2 mb-1" {...props} />,
    p: ({ node, ...props }) => <p className="text-white/90 mb-3" {...props} />,
    ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />,
    ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />,
    li: ({ node, ...props }) => <li className="text-white/80 mb-1" {...props} />,
    a: ({ node, ...props }) => <a className="text-blue-400 hover:underline" {...props} />,
    blockquote: ({ node, ...props }) => (
      <blockquote className="border-l-4 border-green-500/50 pl-4 py-1 my-3 text-white/70 italic" {...props} />
    ),
    code: ({ node, inline, ...props }) => 
      inline ? (
        <code className="bg-white/10 px-1 py-0.5 rounded text-green-300 font-mono text-sm" {...props} />
      ) : (
        <pre className="bg-zinc-800 p-3 rounded-md overflow-x-auto my-3 font-mono text-sm text-white/80" {...props} />
      ),
    table: ({ node, ...props }) => (
      <div className="overflow-x-auto my-3">
        <table className="min-w-full border border-white/10 rounded" {...props} />
      </div>
    ),
    thead: ({ node, ...props }) => <thead className="bg-white/5" {...props} />,
    tbody: ({ node, ...props }) => <tbody className="divide-y divide-white/10" {...props} />,
    tr: ({ node, ...props }) => <tr className="border-b border-white/10" {...props} />,
    th: ({ node, ...props }) => <th className="px-4 py-2 text-left text-white/80 font-medium" {...props} />,
    td: ({ node, ...props }) => <td className="px-4 py-2 text-white/70" {...props} />,
  };

  // Processamento especial para callouts
  const processCallouts = (content: string) => {
    // Substituir padrões de callout por HTML personalizado
    let processedContent = content;
    
    // Callout de informação
    processedContent = processedContent.replace(
      />\s*\[!INFO\]([\s\S]*?)(?=>\s*\[!|$)/g, 
      '<div class="callout info">$1</div>'
    );
    
    // Callout de aviso
    processedContent = processedContent.replace(
      />\s*\[!WARNING\]([\s\S]*?)(?=>\s*\[!|$)/g, 
      '<div class="callout warning">$1</div>'
    );
    
    // Callout de dica
    processedContent = processedContent.replace(
      />\s*\[!TIP\]([\s\S]*?)(?=>\s*\[!|$)/g, 
      '<div class="callout tip">$1</div>'
    );
    
    return processedContent;
  };

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`rounded-lg p-4 max-w-[85%] ${
          isUser
            ? "bg-green-600/20 text-white"
            : "bg-white/5 border border-white/10 text-white/90"
        }`}
      >
        {isLoading ? (
          <ThinkingState />
        ) : (
          <>
            {isUser ? (
              <p className="whitespace-pre-wrap">{content}</p>
            ) : (
              <div className="markdown-content">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={components}
                >
                  {processCallouts(content)}
                </ReactMarkdown>
                
                {/* Estilos para callouts */}
                <style jsx global>{`
                  .callout {
                    margin: 1rem 0;
                    padding: 1rem;
                    border-radius: 0.5rem;
                    border-left: 4px solid;
                  }
                  .callout.info {
                    background-color: rgba(59, 130, 246, 0.1);
                    border-left-color: rgba(59, 130, 246, 0.5);
                  }
                  .callout.warning {
                    background-color: rgba(245, 158, 11, 0.1);
                    border-left-color: rgba(245, 158, 11, 0.5);
                  }
                  .callout.tip {
                    background-color: rgba(16, 185, 129, 0.1);
                    border-left-color: rgba(16, 185, 129, 0.5);
                  }
                `}</style>
              </div>
            )}
            
            {sources && sources.length > 0 && !isUser && (
              <SourcesList sources={sources} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
