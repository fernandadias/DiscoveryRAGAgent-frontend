import { useState } from 'react';
import { useDocuments, useDeleteDocument } from '@/hooks/use-api';
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@heroui/react';
import { RefreshCw, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import api from '@/lib/api';

const Documents = () => {
  const { data: documents = [], refetch } = useDocuments();
  const deleteMutation = useDeleteDocument();
  const [isReindexing, setIsReindexing] = useState(false);
  
  const handleDeleteDocument = async (documentId: string) => {
    try {
      await deleteMutation.mutateAsync(documentId);
      toast({
        title: "Documento excluído",
        description: "O documento foi removido com sucesso.",
      });
      refetch();
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };
  
  const handleReindexDocuments = async () => {
    try {
      setIsReindexing(true);
      await api.post('/api/documents/reindex');
      toast({
        title: "Reindexação iniciada",
        description: "A reindexação dos documentos foi iniciada com sucesso.",
      });
    } catch (error) {
      console.error('Error reindexing documents:', error);
      toast({
        title: "Erro na reindexação",
        description: "Não foi possível iniciar a reindexação dos documentos.",
        variant: "destructive",
      });
    } finally {
      setIsReindexing(false);
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Documentos</h1>
        <div className="flex gap-2">
          <Button 
            variant="bordered" 
            size="sm"
            onClick={handleReindexDocuments}
            disabled={isReindexing}
            className="flex items-center gap-1"
          >
            <RefreshCw size={16} className={isReindexing ? "animate-spin" : ""} />
            {isReindexing ? 'Reindexando...' : 'Reindexar Documentos'}
          </Button>
          
          {/* Upload button removed as requested */}
        </div>
      </div>
      
      {documents.length === 0 ? (
        <div className="text-center py-12 bg-white/5 rounded-lg">
          <p className="text-white/70">Nenhum documento encontrado.</p>
          <p className="text-white/50 text-sm mt-2">
            Os documentos são gerenciados pelo administrador do sistema.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <Card key={doc.id} className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white truncate">{doc.title}</CardTitle>
                <CardDescription className="text-white/50">
                  {new Date(doc.uploaded_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-white/70 text-sm">
                  Tipo: {doc.type}
                </p>
                <p className="text-white/70 text-sm">
                  Tamanho: {(doc.size / 1024).toFixed(2)} KB
                </p>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleDeleteDocument(doc.id)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                >
                  <Trash2 size={16} />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10">
        <h2 className="text-lg font-medium text-white mb-2">Nota sobre upload de documentos</h2>
        <p className="text-white/70">
          O upload de novos documentos está temporariamente desabilitado. 
          Estamos utilizando um conjunto fixo de documentos para o RAG neste momento.
          Para adicionar novos documentos, entre em contato com o administrador do sistema.
        </p>
      </div>
    </div>
  );
};

export default Documents;
