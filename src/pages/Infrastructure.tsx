
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Server, HardDrive, BookText } from 'lucide-react';

const Infrastructure = () => {
  return (
    <div className="h-full flex flex-col p-4">
      <h1 className="text-xl font-medium text-white">Infraestrutura</h1>
      <p className="text-white/70 mb-4">Detalhes técnicos da implementação do sistema de IA.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="glass-morphism">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <Server className="h-10 w-10 mb-2 text-primary/80" />
            <h3 className="text-white font-medium">GPT-4o</h3>
            <p className="text-white/60 text-sm">Modelo LLM</p>
          </CardContent>
        </Card>
        
        <Card className="glass-morphism">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <Database className="h-10 w-10 mb-2 text-primary/80" />
            <h3 className="text-white font-medium">Pinecone</h3>
            <p className="text-white/60 text-sm">Banco de Dados Vetorial</p>
          </CardContent>
        </Card>
        
        <Card className="glass-morphism">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <HardDrive className="h-10 w-10 mb-2 text-primary/80" />
            <h3 className="text-white font-medium">Chunk Hybrid</h3>
            <p className="text-white/60 text-sm">Processamento RAG</p>
          </CardContent>
        </Card>
        
        <Card className="glass-morphism">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <BookText className="h-10 w-10 mb-2 text-primary/80" />
            <h3 className="text-white font-medium">38 Documentos</h3>
            <p className="text-white/60 text-sm">Base de Conhecimento</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex-1">
        <Card className="glass-morphism">
          <CardHeader>
            <CardTitle className="text-gradient">Detalhes da Infraestrutura</CardTitle>
          </CardHeader>
          
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Modelo de Linguagem (LLM)</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 text-white/80">
                    <p><strong>Modelo:</strong> GPT-4o</p>
                    <p><strong>Parâmetros:</strong> 1.8 trilhões</p>
                    <p><strong>Temperatura:</strong> 0.7</p>
                    <p><strong>Max tokens:</strong> 4096</p>
                    <p><strong>Latência média:</strong> 1.2s</p>
                    <p><strong>Features:</strong> Multimodal (texto e imagens), suporte a Retrieval-Augmented Generation (RAG), fine-tuning para domínio específico</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger>Banco de Dados Vetorial</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 text-white/80">
                    <p><strong>Solução:</strong> Pinecone</p>
                    <p><strong>Dimensão dos vetores:</strong> 1536</p>
                    <p><strong>Número de índices:</strong> 2</p>
                    <p><strong>Métrica de similaridade:</strong> Cosine</p>
                    <p><strong>Threshold de similaridade:</strong> 0.75</p>
                    <p><strong>Escala:</strong> Auto-scale com limite de 100 QPS</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger>Processamento RAG (Retrieval-Augmented Generation)</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 text-white/80">
                    <p><strong>Método:</strong> Hybrid Chunking</p>
                    <p><strong>Tamanho de chunk:</strong> 512 tokens</p>
                    <p><strong>Overlap:</strong> 50 tokens</p>
                    <p><strong>Top-K recuperação:</strong> 5 documentos</p>
                    <p><strong>Reranking:</strong> Ativado com Cross-Encoder</p>
                    <p><strong>Embedding model:</strong> OpenAI ada-002</p>
                    <p><strong>Estratégia de prompt:</strong> Documentos incorporados com contexto + query reformulation</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger>Base de Conhecimento</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 text-white/80">
                    <p><strong>Documentos totais:</strong> 38</p>
                    <p><strong>Tipos:</strong> PDF (22), Markdown (10), HTML (4), CSV (2)</p>
                    <p><strong>Chunks processados:</strong> 782</p>
                    <p><strong>Atualização:</strong> Automática a cada 24h</p>
                    <p><strong>Fontes:</strong> Documentação interna, pesquisas de mercado, relatórios técnicos, feedback de usuários</p>
                    <p><strong>Metadados:</strong> Autor, data, fonte, tags, relevância</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger>Arquitetura e Integração</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 text-white/80">
                    <p><strong>Frontend:</strong> React com TypeScript</p>
                    <p><strong>Backend:</strong> Node.js com Express e WebSockets</p>
                    <p><strong>Cache:</strong> Redis com TTL de 1h para consultas frequentes</p>
                    <p><strong>Streaming:</strong> Server-Sent Events (SSE) para chat em tempo real</p>
                    <p><strong>Monitoramento:</strong> Prometheus + Grafana</p>
                    <p><strong>Latência e2e:</strong> 1.8s (p95)</p>
                    <p><strong>Disponibilidade:</strong> 99.95% uptime</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Infrastructure;
