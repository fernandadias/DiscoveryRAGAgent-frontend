
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Calendar } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// Mock data para requisitos
type Requirement = {
  id: string;
  title: string;
  content: string;
  lastUpdated: Date;
  category: 'discovery' | 'product' | 'design';
};

const mockRequirements: Requirement[] = [
  {
    id: '1',
    title: 'Objetivos da discovery',
    content: `# Objetivos da Discovery

## Propósito
- Entender as necessidades do usuário e do mercado
- Validar hipóteses de produto antes do desenvolvimento
- Identificar oportunidades e diferenciadores competitivos

## Metas
1. Coletar insights significativos sobre comportamento do usuário
2. Validar o problema que estamos resolvendo
3. Definir métricas de sucesso para o produto
4. Alinhar expectativas com stakeholders

## Abordagem
- Entrevistas focadas em problemas, não soluções
- Análise de dados quantitativos e qualitativos
- Workshops colaborativos com equipes multidisciplinares
- Iteração rápida de ideias e conceitos

## Resultados Esperados
- Especificação clara dos requisitos do produto
- Backlog priorizado de funcionalidades
- Definição das personas e jornadas do usuário
- Protótipos iniciais para validação`,
    lastUpdated: new Date(2025, 3, 15),
    category: 'discovery'
  },
  {
    id: '2',
    title: 'Diretrizes de produto',
    content: `# Diretrizes de Produto

## Princípios Fundamentais
- Simplicidade acima de tudo
- Design centrado no usuário
- Performance é uma feature
- Acessibilidade não é opcional

## Processos
1. **Desenvolvimento Iterativo**
   - Ciclos curtos de desenvolvimento
   - Feedback contínuo dos usuários
   - Priorização baseada em impacto x esforço

2. **Testes e Validação**
   - Testes A/B para decisões importantes
   - Sessões de usabilidade regulares
   - Monitoramento de métricas-chave

3. **Lançamento e Aprendizado**
   - Estratégia de lançamento gradual
   - Coleta estruturada de feedback pós-lançamento
   - Ciclos rápidos de melhoria

## Métricas de Sucesso
- Engajamento do usuário (DAU/MAU)
- Tempo de conclusão de tarefas
- NPS e métricas de satisfação
- Conversão e retenção`,
    lastUpdated: new Date(2025, 2, 28),
    category: 'product'
  },
  {
    id: '3',
    title: 'Diretrizes de design',
    content: `# Diretrizes de Design

## Identidade Visual
- Minimalismo consistente
- Paleta de cores escuras com acentos vibrantes
- Tipografia clara e acessível
- Espaço negativo como elemento de design

## Interações
- Animações sutis e significativas
- Feedback imediato para ações do usuário
- Transições suaves entre estados
- Gestos intuitivos em dispositivos móveis

## Acessibilidade
- Contraste adequado (WCAG AA+)
- Suporte para leitores de tela
- Navegação por teclado completa
- Textos alternativos para elementos visuais

## Componentes
- Sistema de design modular
- Reutilização de padrões consistentes
- Adaptação responsiva para todos os tamanhos de tela
- Versões light e dark mode para cada componente`,
    lastUpdated: new Date(2025, 4, 5),
    category: 'design'
  }
];

const Requirements = () => {
  const [activeTab, setActiveTab] = useState<string>('discovery');
  
  const filteredRequirements = mockRequirements.filter(req => req.category === activeTab);
  const currentRequirement = filteredRequirements[0] || mockRequirements[0];

  return (
    <div className="h-full flex flex-col p-4">
      <h1 className="text-xl font-medium text-white">Requisitos e Diretrizes</h1>
      <p className="text-white/70 mb-4">Documentação que guia o comportamento do agente de IA.</p>
      
      <div className="flex-1 flex flex-col min-h-0">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col min-h-0"
        >
          <TabsList className="self-start mb-4">
            <TabsTrigger value="discovery">Objetivos da Discovery</TabsTrigger>
            <TabsTrigger value="product">Diretrizes de Produto</TabsTrigger>
            <TabsTrigger value="design">Diretrizes de Design</TabsTrigger>
          </TabsList>
          
          {['discovery', 'product', 'design'].map((category) => (
            <TabsContent 
              key={category} 
              value={category} 
              className="flex-1 min-h-0 mt-0"
            >
              <Card className="h-full glass-morphism flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gradient">
                    <FileText size={18} />
                    {mockRequirements.find(req => req.category === category)?.title}
                    <span className="ml-auto flex items-center gap-1 text-sm font-normal text-muted-foreground">
                      <Calendar size={14} />
                      {mockRequirements.find(req => req.category === category)?.lastUpdated.toLocaleDateString()}
                    </span>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="flex-1 overflow-hidden p-0">
                  <ScrollArea className="h-full max-h-[65vh]">
                    <div className="p-6 markdown-content">
                      <ReactMarkdown>
                        {mockRequirements.find(req => req.category === category)?.content || ''}
                      </ReactMarkdown>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Requirements;
