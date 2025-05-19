
import { useState } from 'react';
import { Source } from './ChatMessage';
import { cn } from '@/lib/utils';

interface ChatSourceReferenceProps {
  source: Source;
}

const ChatSourceReference = ({ source }: ChatSourceReferenceProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div 
      className="bg-secondary/50 rounded-md p-2 cursor-pointer hover:bg-secondary/80 transition-all duration-200"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm text-white">{source.name}</h4>
        <button className="text-xs text-primary hover:underline">
          {expanded ? 'Ocultar' : 'Ver detalhes'}
        </button>
      </div>
      
      <div className={cn(
        "mt-2 text-sm transition-all duration-200 overflow-hidden",
        expanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      )}>
        <p className="text-muted-foreground mb-2">{source.snippet}</p>
        <a 
          href={source.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:underline text-xs inline-block"
          onClick={(e) => e.stopPropagation()}
        >
          Ver documento completo →
        </a>
      </div>
    </div>
  );
};

export default ChatSourceReference;
