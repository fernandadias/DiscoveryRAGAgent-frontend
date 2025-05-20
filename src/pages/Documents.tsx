import { useState, useEffect } from 'react';
import { useDocuments, useUploadDocument, useDeleteDocument, Document } from '@/hooks/use-api';
import { Button } from '@heroui/react';
import { Upload, Trash2, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Documents = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const { data: documents = [], isLoading, refetch } = useDocuments();
  const uploadDocumentMutation = useUploadDocument();
  const deleteDocumentMutation = useDeleteDocument();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Por favor, selecione um arquivo para upload.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      await uploadDocumentMutation.mutateAsync(selectedFile);
      toast({
        title: "Upload concluído",
        description: "Documento enviado com sucesso.",
      });
      setSelectedFile(null);
      refetch(); // Atualiza a lista de documentos
    } catch (error) {
      console.error('Error uploading document:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (documentId: string) => {
    try {
      await deleteDocumentMutation.mutateAsync(documentId);
      toast({
        title: "Documento excluído",
        description: "O documento foi removido com sucesso.",
      });
      refetch(); // Atualiza a lista de documentos
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-white">Documentos</h1>
      
      <div className="bg-secondary/30 p-4 rounded-lg mb-8">
        <h2 className="text-lg font-semibold mb-4 text-white">Upload de Documento</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.txt"
            />
            <label
              htmlFor="file-upload"
              className="flex items-center gap-2 p-2 border border-dashed border-white/30 rounded-lg cursor-pointer hover:bg-white/5 transition-colors"
            >
              <Upload size={20} />
              <span className="text-white/70">
                {selectedFile ? selectedFile.name : 'Selecionar arquivo...'}
              </span>
            </label>
          </div>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            variant="solid"
            color="primary"
            className="whitespace-nowrap"
          >
            {isUploading ? 'Enviando...' : 'Enviar Documento'}
          </Button>
        </div>
      </div>
      
      <div>
        <h2 className="text-lg font-semibold mb-4 text-white">Documentos Disponíveis</h2>
        
        {isLoading ? (
          <div className="text-center py-8 text-white/70">Carregando documentos...</div>
        ) : documents.length === 0 ? (
          <div className="text-center py-8 text-white/70">
            Nenhum documento disponível. Faça upload de documentos para começar.
          </div>
        ) : (
          <div className="grid gap-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-white/5 p-4 rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary/20 p-2 rounded">
                    <FileText size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{doc.title}</h3>
                    <div className="text-sm text-white/60 flex gap-3">
                      <span>{formatFileSize(doc.size)}</span>
                      <span>•</span>
                      <span>{formatDate(doc.uploaded_at)}</span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => handleDelete(doc.id)}
                  variant="ghost"
                  size="sm"
                  className="text-white/70 hover:text-red-400"
                  aria-label="Excluir documento"
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Documents;
