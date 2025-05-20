import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Infrastructure = () => {
  return (
    <div className="h-full flex flex-col p-4">
      <h1 className="text-xl font-medium text-white">Infraestrutura</h1>
      <p className="text-white/70 mb-4">Detalhes técnicos da implementação do sistema de IA.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="glass-morphism">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <h3 className="text-white font-medium">GPT-4o</h3>
            <p className="text-white/60 text-sm">Modelo LLM</p>
          </CardContent>
        </Card>
        
        <Card className="glass-morphism">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <h3 className="text-white font-medium">Weaviate</h3>
            <p className="text-white/60 text-sm">Banco de Dados Vetorial</p>
          </CardContent>
        </Card>
        
        <Card className="glass-morphism">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <h3 className="text-white font-medium">FastAPI</h3>
            <p className="text-white/60 text-sm">Backend Python</p>
          </CardContent>
        </Card>
        
        <Card className="glass-morphism">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <h3 className="text-white font-medium">Render + Vercel</h3>
            <p className="text-white/60 text-sm">Hospedagem</p>
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
                    <p><strong>Temperatura:</strong> 0.7</p>
                    <p><strong>Max tokens:</strong> 1500</p>
                    <p><strong>API:</strong> OpenAI API v1.0.0+</p>
                    <p><strong>Features:</strong> Citações diretas das fontes, reranking de resultados, chunking inteligente</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger>Banco de Dados Vetorial</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 text-white/80">
                    <p><strong>Solução:</strong> Weaviate Cloud</p>
                    <p><strong>Instância:</strong> discoveryragagent-backend</p>
                    <p><strong>Região:</strong> us-west3 (GCP)</p>
                    <p><strong>Modelo de Embeddings:</strong> OpenAI (text-embedding-ada-002)</p>
                    <p><strong>Classe principal:</strong> Document</p>
                    <p><strong>Plano recomendado:</strong> Starter ($7/mês)</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger>Processamento RAG (Retrieval-Augmented Generation)</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 text-white/80">
                    <p><strong>Fluxo:</strong> RAG &gt; Diretrizes &gt; Objetivo &gt; LLM &gt; Resposta</p>
                    <p><strong>Chunking:</strong> Inteligente com sobreposição</p>
                    <p><strong>Top-K recuperação:</strong> 5 documentos</p>
                    <p><strong>Reranking:</strong> Implementado para priorizar resultados mais relevantes</p>
                    <p><strong>Embedding model:</strong> OpenAI ada-002</p>
                    <p><strong>Citações:</strong> Diretas das fontes nas respostas</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger>Autenticação e Segurança</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 text-white/80">
                    <p><strong>Método:</strong> JWT (JSON Web Tokens)</p>
                    <p><strong>Credenciais:</strong> Hardcoded (Mario/Bros)</p>
                    <p><strong>Expiração de token:</strong> 24 horas</p>
                    <p><strong>Proteção:</strong> Todas as rotas da API requerem autenticação</p>
                    <p><strong>Armazenamento:</strong> LocalStorage no frontend</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger>Arquitetura e Integração</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 text-white/80">
                    <p><strong>Frontend:</strong> React com TypeScript (Vite)</p>
                    <p><strong>Backend:</strong> Python com FastAPI</p>
                    <p><strong>Hospedagem Frontend:</strong> Vercel</p>
                    <p><strong>Hospedagem Backend:</strong> Render (Plano Starter recomendado)</p>
                    <p><strong>Estrutura de diretórios:</strong> Objetivos e diretrizes em arquivos MD</p>
                    <p><strong>Feedback:</strong> Sistema de avaliação de respostas com motivos e detalhes</p>
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
