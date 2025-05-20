import { useState, useEffect } from 'react';
import { FileText, Book, Target } from 'lucide-react';
import api from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const Requirements = () => {
  const [objectives, setObjectives] = useState<{id: string, title: string, content: string}[]>([]);
  const [guidelines, setGuidelines] = useState<{id: string, title: string, content: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('objectives');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch objectives
        const objectivesResponse = await api.get('/api/objectives/content');
        setObjectives(objectivesResponse.data);
        
        // Fetch guidelines
        const guidelinesResponse = await api.get('/api/guidelines/content');
        setGuidelines(guidelinesResponse.data);
      } catch (error) {
        console.error('Error fetching requirements:', error);
        toast({
          title: "Erro ao carregar requisitos",
          description: "Não foi possível carregar os objetivos e diretrizes.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Requisitos e Diretrizes</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : (
        <div>
          {/* Custom Tabs Implementation */}
          <div className="flex border-b border-white/10">
            <button
              onClick={() => setActiveTab('objectives')}
              className={`px-4 py-2 flex items-center ${
                activeTab === 'objectives' 
                  ? 'bg-white/10 text-white border-b-2 border-green-400' 
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Target size={16} className="mr-2" />
              Objetivos
            </button>
            <button
              onClick={() => setActiveTab('guidelines')}
              className={`px-4 py-2 flex items-center ${
                activeTab === 'guidelines' 
                  ? 'bg-white/10 text-white border-b-2 border-green-400' 
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Book size={16} className="mr-2" />
              Diretrizes
            </button>
          </div>
          
          {/* Tab Content */}
          <div className="mt-4">
            {activeTab === 'objectives' && (
              <div className="grid grid-cols-1 gap-4">
                {objectives.map((objective) => (
                  <div key={objective.id} className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                    <div className="p-4 border-b border-white/10">
                      <h3 className="text-white font-medium flex items-center gap-2">
                        <Target size={18} />
                        {objective.title}
                      </h3>
                    </div>
                    <div className="p-4">
                      <div className="prose prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {objective.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {activeTab === 'guidelines' && (
              <div className="grid grid-cols-1 gap-4">
                {guidelines.map((guideline) => (
                  <div key={guideline.id} className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                    <div className="p-4 border-b border-white/10">
                      <h3 className="text-white font-medium flex items-center gap-2">
                        <Book size={18} />
                        {guideline.title}
                      </h3>
                    </div>
                    <div className="p-4">
                      <div className="prose prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {guideline.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Requirements;
