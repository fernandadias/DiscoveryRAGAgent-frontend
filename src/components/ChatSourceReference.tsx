
import { ExternalLink } from 'lucide-react';

interface Source {
  id: string;
  name: string;
  snippet: string;
  link: string;
}

interface ChatSourceReferenceProps {
  source: Source;
}

const ChatSourceReference = ({ source }: ChatSourceReferenceProps) => {
  return (
    <div 
      className="p-3 bg-secondary/20 rounded-md border-l-2 border-primary/50 hero-card"
    >
      <div className="flex items-center justify-between mb-1">
        <p className="font-medium text-sm">{source.name}</p>
        <a 
          href={source.link} 
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-xs text-primary hover:underline"
        >
          <span className="mr-1">Fonte</span>
          <ExternalLink size={12} />
        </a>
      </div>
      <p className="text-xs text-white/70 leading-relaxed">
        {source.snippet}
      </p>
    </div>
  );
};

export default ChatSourceReference;
