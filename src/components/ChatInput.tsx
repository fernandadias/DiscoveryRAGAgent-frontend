
import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button, Input, Box, Text, Flex } from '@heroui/react';

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
    <Box width="full">
      {suggestions.length > 0 && message.length === 0 && (
        <Box mb={4}>
          <Text size="sm" color="muted" mb={2}>Sugestões para iniciar:</Text>
          <Flex wrap="wrap" gap={2}>
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                variant="subtle"
                size="sm"
                color="muted"
              >
                {suggestion}
              </Button>
            ))}
          </Flex>
        </Box>
      )}
      
      <Box 
        position="relative" 
        display="flex" 
        alignItems="end" 
        bg="bg-secondary/30" 
        rounded="lg" 
        border="1px solid"
        borderColor="secondary"
        p={2}
        className="focus-within:border-primary transition-colors"
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
          colorScheme={!message.trim() || isLoading ? "gray" : "primary"}
          variant="solid"
          className="ml-2"
          isDisabled={!message.trim() || isLoading}
          aria-label="Enviar mensagem"
        >
          <Send size={18} />
        </Button>
      </Box>
    </Box>
  );
};

export default ChatInput;
