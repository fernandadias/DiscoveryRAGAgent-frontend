import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button, Input } from '@heroui/react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  suggestions?: string[];
}

const ChatInput = ({ onSendMessage, isLoading, suggestions = [] }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSendMessage = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
      
      if (inputRef.current) {
        inputRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onSendMessage(suggestion);
  };

  return (
    <div className="w-full">
      {suggestions.length > 0 && message.length === 0 && (
        <div className="mb-4">
          <p className="text-sm text-white/50 mb-2">Sugestões para iniciar:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-white"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      <div 
        className="relative flex items-end bg-secondary/30 rounded-lg border border-secondary p-2 focus-within:border-primary transition-colors"
      >
        <textarea
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite sua mensagem..."
          className="flex-grow resize-none bg-transparent border-none focus:outline-none py-2 px-3 max-h-[120px] text-white"
          disabled={isLoading}
          rows={1}
        />
        <Button
          onClick={handleSendMessage}
          disabled={!message.trim() || isLoading}
          variant="solid"
          color={!message.trim() || isLoading ? "default" : "primary"}
          className="ml-2"
          aria-label="Enviar mensagem"
        >
          <Send size={18} />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
