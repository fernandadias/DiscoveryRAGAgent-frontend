import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger } from '@heroui/react';
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
        <Tabs defaultValue="objectives" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white/5 border-white/10">
            <TabsTrigger value="objectives" className="data-[state=active]:bg-white/10">
              <Target size={16} className="mr-2" />
              Objetivos
            </TabsTrigger>
            <TabsTrigger value="guidelines" className="data-[state=active]:bg-white/10">
              <Book size={16} className="mr-2" />
              Diretrizes
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="objectives" className="mt-4">
            <div className="grid grid-cols-1 gap-4">
              {objectives.map((objective) => (
                <Card key={objective.id} className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Target size={18} />
                      {objective.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-invert max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {objective.content}
                      </ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="guidelines" className="mt-4">
            <div className="grid grid-cols-1 gap-4">
              {guidelines.map((guideline) => (
                <Card key={guideline.id} className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Book size={18} />
                      {guideline.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-invert max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {guideline.content}
                      </ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Requirements;
