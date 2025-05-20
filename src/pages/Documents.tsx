import { useState, useEffect } from 'react';
import { useDocuments, useDeleteDocument } from '@/hooks/use-api';
import { Button } from '@heroui/react';
import { RefreshCw, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import api from '@/lib/api';

const Documents = () => {
  const { data: documents = [], refetch, isLoading, isError } = useDocuments();
  const deleteMutation = useDeleteDocument();
  const [isReindexing, setIsReindexing] = useState(false);
  
  // Forçar refetch na montagem do componente
  useEffect(() => {
    refetch();
  }, [refetch]);
  
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
      // Refetch após um pequeno delay para dar tempo ao backend processar
      setTimeout(() => refetch(), 2000);
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
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-12 bg-white/5 rounded-lg">
          <p className="text-white/70">Carregando documentos...</p>
        </div>
      ) : isError ? (
        <div className="text-center py-12 bg-white/5 rounded-lg border border-red-500/30">
          <p className="text-red-400">Erro ao carregar documentos.</p>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => refetch()}
            className="mt-2 text-white/70"
          >
            Tentar novamente
          </Button>
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-12 bg-white/5 rounded-lg">
          <p className="text-white/70">Nenhum documento encontrado.</p>
          <p className="text-white/50 text-sm mt-2">
            Os documentos são gerenciados pelo administrador do sistema.
          </p>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => refetch()}
            className="mt-2 text-white/70"
          >
            Atualizar lista
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <div key={doc.id} className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-white/10">
                <h3 className="text-white font-medium truncate">{doc.title}</h3>
                <div className="text-white/50 text-sm mt-1">
                  {new Date(doc.uploaded_at).toLocaleDateString()}
                </div>
              </div>
              <div className="p-4">
                <p className="text-white/70 text-sm">
                  Tipo: {doc.type}
                </p>
                <p className="text-white/70 text-sm">
                  Tamanho: {(doc.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <div className="p-4 border-t border-white/10 flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleDeleteDocument(doc.id)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
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
