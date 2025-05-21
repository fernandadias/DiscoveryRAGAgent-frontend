import { useState, useEffect } from 'react';
import { useDocuments } from '@/hooks/use-api';
import { Button } from '@heroui/react';
import { RefreshCw, FileText, Eye, FileIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import api from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Documents = () => {
  const { data: documents = [], refetch, isLoading, isError } = useDocuments();
  const [isReindexing, setIsReindexing] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState<string>('');
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  
  // Forçar refetch na montagem do componente e a cada 5 segundos
  useEffect(() => {
    refetch();
    
    // Refetch periódico para garantir que todos os documentos sejam exibidos
    const interval = setInterval(() => {
      refetch();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [refetch]);
  
  const handlePreviewDocument = async (doc: any) => {
    setPreviewDoc(doc);
    setIsPreviewOpen(true);
    setIsLoadingPreview(true);
    
    try {
      // Tentar buscar o conteúdo do documento para pré-visualização
      const response = await api.get(`/api/documents/${doc.id}/preview`);
      if (response.data && response.data.content) {
        setPreviewContent(response.data.content);
      } else {
        setPreviewContent('Não foi possível carregar o conteúdo deste documento.');
      }
    } catch (error) {
      console.error('Error fetching document preview:', error);
      setPreviewContent('Erro ao carregar a pré-visualização do documento.');
    } finally {
      setIsLoadingPreview(false);
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
  
  // Função para determinar o ícone com base no tipo de documento
  const getDocumentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText className="text-red-400" size={18} />;
      case 'docx':
      case 'doc':
        return <FileText className="text-blue-400" size={18} />;
      case 'txt':
        return <FileText className="text-gray-400" size={18} />;
      case 'md':
        return <FileText className="text-purple-400" size={18} />;
      default:
        return <FileIcon className="text-white/60" size={18} />;
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
            <div 
              key={doc.id} 
              className="bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:border-white/20 transition-all cursor-pointer"
              onClick={() => handlePreviewDocument(doc)}
            >
              <div className="p-4 border-b border-white/10">
                <div className="flex items-start gap-3">
                  {getDocumentIcon(doc.type)}
                  <h3 className="text-white font-medium">{doc.title}</h3>
                </div>
                <div className="text-white/50 text-sm mt-2 ml-7">
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
                  className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                >
                  <Eye size={16} />
                  <span className="ml-2">Visualizar</span>
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

      {/* Modal de pré-visualização do documento */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto bg-zinc-900 border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              {previewDoc && getDocumentIcon(previewDoc.type)}
              {previewDoc?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/70 text-sm">
                  Tipo: {previewDoc?.type}
                </p>
                <p className="text-white/70 text-sm">
                  Tamanho: {previewDoc ? (previewDoc.size / 1024).toFixed(2) : 0} KB
                </p>
                <p className="text-white/70 text-sm">
                  Data: {previewDoc ? new Date(previewDoc.uploaded_at).toLocaleDateString() : ''}
                </p>
              </div>
            </div>
            
            {isLoadingPreview ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              </div>
            ) : (
              <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10 text-white/80">
                <h3 className="text-white font-medium mb-2">Conteúdo do documento</h3>
                {previewContent ? (
                  <div className="mt-2 p-3 bg-white/5 rounded border border-white/10 max-h-[400px] overflow-y-auto">
                    <pre className="text-white/80 text-sm font-mono whitespace-pre-wrap">
                      {previewContent}
                    </pre>
                  </div>
                ) : (
                  <p className="text-white/70 italic">
                    Este documento está indexado no sistema RAG e pode ser consultado através do chat.
                    A visualização direta do conteúdo completo não está disponível nesta interface.
                  </p>
                )}
                <div className="mt-4 p-3 bg-white/5 rounded border border-white/10">
                  <p className="text-white/60 text-sm font-mono">
                    Documento indexado em: {previewDoc ? new Date(previewDoc.uploaded_at).toLocaleString() : ''}
                  </p>
                  <p className="text-white/60 text-sm font-mono mt-1">
                    ID: {previewDoc?.id}
                  </p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Documents;
