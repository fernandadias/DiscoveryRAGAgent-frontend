
import { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from '@/lib/utils';
import ChatSourceReference from './ChatSourceReference';

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

const ChatMessage = ({ content, isUser, isLoading, sources }: MessageProps) => {
  const [liked, setLiked] = useState<boolean | null>(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
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
    setFeedbackOpen(false);
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
      <div className="bg-secondary/30 p-4 rounded-lg max-w-[90%] shadow-sm relative">
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce-soft" style={{ animationDelay: "0ms" }}></div>
              <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce-soft" style={{ animationDelay: "150ms" }}></div>
              <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce-soft" style={{ animationDelay: "300ms" }}></div>
            </div>
            <p className="text-white/70 italic">A IA está elaborando uma resposta...</p>
          </div>
        ) : (
          <>
            <p className="text-white leading-relaxed">{content}</p>
            
            {sources && sources.length > 0 && (
              <div className="mt-4 pt-3 border-t border-white/10">
                <p className="text-muted-foreground text-sm mb-2">Fontes utilizadas:</p>
                <div className="flex flex-col space-y-2">
                  {sources.map(source => (
                    <ChatSourceReference key={source.id} source={source} />
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex items-center mt-3 pt-3 border-t border-white/10">
              <button 
                onClick={() => setLiked(true)} 
                className={cn(
                  "p-1 rounded-md mr-2 transition-all", 
                  liked === true ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-white"
                )}
              >
                <ThumbsUp size={18} />
              </button>
              
              <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
                <DialogTrigger asChild>
                  <button 
                    onClick={() => setLiked(false)} 
                    className={cn(
                      "p-1 rounded-md transition-all", 
                      liked === false ? "bg-destructive/20 text-destructive" : "text-muted-foreground hover:text-white"
                    )}
                  >
                    <ThumbsDown size={18} />
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-lg">Como podemos melhorar?</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-2 my-4">
                    {FeedbackOptions.map(option => (
                      <button
                        key={option.id}
                        onClick={() => toggleFeedbackOption(option.id)}
                        className={cn(
                          "px-3 py-2 text-sm rounded-md border transition-all",
                          selectedFeedback.includes(option.id)
                            ? "border-primary bg-primary/20 text-white"
                            : "border-muted bg-secondary/30 text-muted-foreground hover:text-white hover:bg-secondary/50"
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Comentários adicionais (opcional)"
                    className="w-full p-2 text-sm bg-secondary/30 border border-muted rounded-md focus:outline-none focus:border-primary transition-colors"
                    rows={3}
                  />
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={handleFeedbackSubmit}
                      className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-md transition-colors"
                    >
                      Enviar feedback
                    </button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
