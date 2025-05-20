
import { useState } from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, FileText, Calendar, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

// Mock data para documentos RAG
type Document = {
  id: string;
  title: string;
  content: string;
  type: string;
  addedAt: Date;
  metadata: {
    source: string;
    author?: string;
    tags: string[];
  };
};

const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Análise de mercado 2025',
    content: 'Documento com análise detalhada do mercado para o ano de 2025, incluindo tendências e previsões...',
    type: 'PDF',
    addedAt: new Date(2025, 4, 1),
    metadata: {
      source: 'Relatório Interno',
      author: 'Departamento de Pesquisa',
      tags: ['mercado', 'análise', 'tendências']
    }
  },
  {
    id: '2',
    title: 'Feedback de usuários Q1',
    content: 'Compilação de feedbacks dos usuários durante o primeiro trimestre...',
    type: 'CSV',
    addedAt: new Date(2025, 3, 15),
    metadata: {
      source: 'Sistema de Feedback',
      tags: ['feedback', 'usuários', 'produto']
    }
  },
  {
    id: '3',
    title: 'Especificações técnicas',
    content: 'Documentação técnica do produto incluindo arquitetura e componentes...',
    type: 'Markdown',
    addedAt: new Date(2025, 2, 22),
    metadata: {
      source: 'Documentação Técnica',
      author: 'Time de Engenharia',
      tags: ['técnico', 'arquitetura', 'especificações']
    }
  },
  {
    id: '4',
    title: 'Pesquisa de concorrentes',
    content: 'Análise comparativa dos principais concorrentes no mercado...',
    type: 'HTML',
    addedAt: new Date(2025, 4, 10),
    metadata: {
      source: 'Web Scraping',
      tags: ['concorrência', 'análise', 'mercado']
    }
  },
  {
    id: '5',
    title: 'Guia de posicionamento',
    content: 'Diretrizes para posicionamento do produto no mercado...',
    type: 'PDF',
    addedAt: new Date(2025, 1, 5),
    metadata: {
      source: 'Estratégia de Marketing',
      author: 'Time de Produto',
      tags: ['estratégia', 'posicionamento', 'marketing']
    }
  },
];

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  
  const filteredDocuments = mockDocuments.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.metadata.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="h-full flex flex-col space-y-4 p-4">
      <h1 className="text-xl font-medium text-white">Base de Conhecimento (RAG)</h1>
      <p className="text-white/70">Visualize os documentos disponíveis para consulta pela IA.</p>
      
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por título ou tag..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="flex-1 flex flex-col md:flex-row gap-4 h-full overflow-hidden">
        <Card className="flex-1 min-w-0 glass-morphism">
          <CardHeader>
            <CardTitle className="text-gradient text-lg">Documentos ({filteredDocuments.length})</CardTitle>
          </CardHeader>
          
          <CardContent className="p-0 h-[calc(100%-60px)]">
            <ScrollArea className="h-full max-h-[60vh] md:max-h-[70vh]">
              <Table>
                <TableHeader className="sticky top-0 bg-secondary/30 backdrop-blur-sm">
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Adicionado</TableHead>
                    <TableHead>Tags</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((doc) => (
                    <TableRow 
                      key={doc.id}
                      className={`cursor-pointer transition-colors ${selectedDocument?.id === doc.id ? 'bg-primary/10' : ''}`}
                      onClick={() => setSelectedDocument(doc)}
                    >
                      <TableCell className="font-medium flex items-center gap-2">
                        <FileText size={16} className="text-primary/80" />
                        {doc.title}
                      </TableCell>
                      <TableCell>{doc.type}</TableCell>
                      <TableCell>{doc.addedAt.toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {doc.metadata.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="px-2 py-0.5 bg-secondary/50 text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                          {doc.metadata.tags.length > 2 && (
                            <span className="px-2 py-0.5 bg-secondary/30 text-xs rounded-full">
                              +{doc.metadata.tags.length - 2}
                            </span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
        
        {selectedDocument && (
          <Card className="flex-1 min-w-0 glass-morphism">
            <CardHeader>
              <CardTitle className="text-gradient text-lg flex items-center gap-2">
                <FileText size={18} />
                {selectedDocument.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Adicionado em {selectedDocument.addedAt.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag size={16} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Tipo: {selectedDocument.type}
                  </span>
                </div>
              </div>
              
              <h3 className="text-white/90 font-medium mb-1">Conteúdo</h3>
              <div className="p-3 bg-secondary/20 rounded-md mb-4">
                <p className="text-white/80 text-sm line-clamp-10">{selectedDocument.content}</p>
              </div>
              
              <h3 className="text-white/90 font-medium mb-1">Metadados</h3>
              <div className="p-3 bg-secondary/20 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Fonte</p>
                    <p className="text-sm">{selectedDocument.metadata.source}</p>
                  </div>
                  {selectedDocument.metadata.author && (
                    <div>
                      <p className="text-xs text-muted-foreground">Autor</p>
                      <p className="text-sm">{selectedDocument.metadata.author}</p>
                    </div>
                  )}
                </div>
                <div className="mt-3">
                  <p className="text-xs text-muted-foreground mb-1">Tags</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedDocument.metadata.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-primary/20 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Documents;
