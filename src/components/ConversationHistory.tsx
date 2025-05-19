
import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export interface Conversation {
  id: string;
  title: string;
  timestamp: Date;
  preview: string;
}

interface ConversationHistoryProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onConversationSelect: (id: string) => void;
  onConversationTitleChange: (id: string, newTitle: string) => void;
}

const ConversationHistory: React.FC<ConversationHistoryProps> = ({
  conversations,
  activeConversationId,
  onConversationSelect,
  onConversationTitleChange,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState<string>('');
  
  const handleEditStart = (conversation: Conversation) => {
    setEditingId(conversation.id);
    setEditedTitle(conversation.title);
  };
  
  const handleEditSave = () => {
    if (editingId && editedTitle.trim()) {
      onConversationTitleChange(editingId, editedTitle);
      setEditingId(null);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditSave();
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-medium mb-4 px-4 text-white/90">Histórico de conversas</h2>
      
      <div className="overflow-y-auto flex-grow px-4 space-y-2">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => {
              if (editingId !== conversation.id) {
                onConversationSelect(conversation.id);
              }
            }}
            className={cn(
              "p-3 rounded-lg transition-all duration-200 cursor-pointer border",
              activeConversationId === conversation.id 
                ? "bg-secondary/50 border-primary/50"
                : "bg-secondary/30 border-transparent hover:bg-secondary/40"
            )}
          >
            <div className="flex justify-between items-start mb-2">
              {editingId === conversation.id ? (
                <input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onBlur={handleEditSave}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  className="bg-secondary p-1 rounded text-sm font-medium flex-grow focus:outline-none focus:ring-1 focus:ring-primary"
                />
              ) : (
                <h3 
                  className="text-sm font-medium text-white/90 truncate flex-grow cursor-text"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditStart(conversation);
                  }}
                >
                  {conversation.title}
                </h3>
              )}
              
              <span className="text-xs text-muted-foreground flex items-center whitespace-nowrap ml-2">
                <Clock size={12} className="mr-1" />
                {format(conversation.timestamp, 'dd/MM/yy HH:mm')}
              </span>
            </div>
            
            <p className="text-xs text-muted-foreground line-clamp-2">
              {conversation.preview}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversationHistory;
