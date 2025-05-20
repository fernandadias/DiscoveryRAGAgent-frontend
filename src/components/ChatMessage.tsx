import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
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

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`rounded-lg p-4 max-w-[80%] ${isUser ? 'bg-green-600/20 text-white' : 'bg-white/10 text-white'}`}>
        <div className="flex items-center gap-2 mb-1">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${isUser ? 'bg-green-600/30' : 'bg-white/20'}`}>
            {isUser ? 'U' : 'AI'}
          </div>
          <span className="text-xs text-white/50">{formatTime(timestamp)}</span>
        </div>
        
        {isLoading ? (
          <div className="flex items-center space-x-2 py-2">
            <div className="w-2 h-2 rounded-full bg-white/50 animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-white/50 animate-pulse delay-75"></div>
            <div className="w-2 h-2 rounded-full bg-white/50 animate-pulse delay-150"></div>
          </div>
        ) : (
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </div>
        )}
        
        {!isUser && !isLoading && (
          <div className="mt-3 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between">
              {sources && sources.length > 0 && (
                <button
                  onClick={() => setShowSources(!showSources)}
                  className="text-xs text-white/50 hover:text-white/80"
                >
                  {showSources ? 'Ocultar fontes' : `Mostrar fontes (${sources.length})`}
                </button>
              )}
              
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={handlePositiveFeedback}
                  disabled={feedbackGiven !== null}
                  className={`p-1 ${feedbackGiven === 'positive' ? 'text-green-400' : 'text-white/50 hover:text-white/80'}`}
                >
                  <ThumbsUp size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={handleNegativeFeedback}
                  disabled={feedbackGiven !== null}
                  className={`p-1 ${feedbackGiven === 'negative' ? 'text-red-400' : 'text-white/50 hover:text-white/80'}`}
                >
                  <ThumbsDown size={14} />
                </Button>
              </div>
            </div>
            
            {showSources && (
              <div className="mt-2 space-y-2">
                <h4 className="text-xs font-medium text-white/70">Fontes utilizadas:</h4>
                <div className="space-y-2">
                  {sources.map((source) => (
                    <div key={source.id} className="bg-white/5 p-2 rounded text-xs">
                      <div className="font-medium text-white/90">{source.name}</div>
                      <div className="text-white/70 mt-1">{source.snippet}</div>
                      {source.link && (
                        <a 
                          href={source.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline mt-1 inline-block"
                        >
                          Ver documento
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
