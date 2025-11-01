import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, TrendingUp, AlertTriangle, Sparkles, Loader2 } from "lucide-react";
import { showLoading, dismissToast } from "@/utils/toast";

type InsightType = 'demand' | 'crossSell' | 'supplier';

const IAInsights = () => {
  const [demandInsight, setDemandInsight] = useState<string | null>(null);
  const [crossSellInsight, setCrossSellInsight] = useState<string | null>(null);
  const [supplierInsight, setSupplierInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState<InsightType | null>(null);

  const handleGenerateInsight = (type: InsightType) => {
    setLoadingInsight(type);
    const toastId = showLoading(`Analisando dados e gerando insight...`);

    setTimeout(() => {
      dismissToast(toastId);
      setLoadingInsight(null);
      switch (type) {
        case 'demand':
          setDemandInsight(
            'Analisamos os dados de vendas dos últimos 6 meses e identificamos um padrão de crescimento consistente de 5% ao mês para **"Vela de Ignição Laser Iridium"**. Além disso, nossos modelos sazonais indicam um aumento adicional de 10% neste período do ano, historicamente ligado à preparação para viagens de férias. A combinação desses fatores resulta em uma previsão de aumento de **15% na demanda** para o próximo mês.' +
            '\n\n**Recomendação Estratégica:** Considerando o estoque atual de 150 unidades e o tempo de entrega de 15 dias do fornecedor principal, recomendamos um pedido de compra de **50 unidades** para manter o estoque de segurança e atender à demanda projetada sem risco de ruptura.'
          );
          break;
        case 'crossSell':
          setCrossSellInsight(
            'Nossa análise de **1.245 transações** revelou que **68%** dos clientes que adquiriram **"Pastilha de Freio Dianteira"** também compraram **"Filtro de Óleo do Motor"** na mesma transação ou em até 30 dias. Este é o par de produtos com a maior correlação de compra em seu catálogo.' +
            '\n\n**Recomendação de Ação:** Implementar uma campanha de **"Compre Junto"** no ponto de venda, oferecendo um desconto de 5% no filtro de óleo na compra da pastilha de freio. Estimamos que essa ação pode aumentar o ticket médio em até **R$ 12,50** por transação elegível e impulsionar as vendas de filtros em 25%.'
          );
          break;
        case 'supplier':
          setSupplierInsight(
            'Identificamos que o fornecedor **"Fornecedora Minas Parts"**, cujo status é **"Inativo"**, é o fornecedor exclusivo de 2 produtos de alta criticidade: "Amortecedor Traseiro" e "Kit Correia Alternador". O estoque atual desses itens (12 e 8 unidades, respectivamente) representa uma autonomia de apenas **2 semanas** com base na média de vendas.' +
            '\n\n**Recomendação de Risco:**\n**Ação Imediata:** Contatar os fornecedores secundários "Distribuidora de Peças São Paulo" e "Autopeças Rio" para verificar a disponibilidade e negociar preços para esses itens. \n**Ação Preventiva:** Revisar e diversificar o portfólio de fornecedores para todos os produtos de "Curva A" para mitigar riscos futuros na cadeia de suprimentos.'
          );
          break;
      }
    }, 2000); // Simula o tempo de processamento da IA
  };

  const renderInsightContent = (
    type: InsightType,
    insight: string | null,
    description: string
  ) => {
    if (insight) {
      return (
        <div className="space-y-2">
          {insight.split('\n\n').map((paragraph, index) => (
            <div key={index} className="text-sm text-muted-foreground space-y-1" dangerouslySetInnerHTML={{ __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />') }} />
          ))}
        </div>
      );
    }

    return (
      <div className="flex flex-col items-start gap-4">
        <p className="text-sm text-muted-foreground">{description}</p>
        <Button onClick={() => handleGenerateInsight(type)} disabled={!!loadingInsight}>
          {loadingInsight === type ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          {loadingInsight === type ? 'Gerando...' : 'Gerar Insight'}
        </Button>
      </div>
    );
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-semibold text-foreground">IA Insights</h1>
        </div>
      </div>
      <div className="grid gap-6 mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Previsão de Demanda
            </CardTitle>
            <CardDescription>Análise preditiva para otimizar seus níveis de estoque.</CardDescription>
          </CardHeader>
          <CardContent>
            {renderInsightContent(
              'demand',
              demandInsight,
              'A IA analisará seus dados de vendas para prever a demanda futura de produtos-chave, ajudando a evitar falta ou excesso de estoque.'
            )}
          </-CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Oportunidades de Venda Cruzada
            </CardTitle>
            <CardDescription>Sugestões inteligentes para aumentar o valor médio dos pedidos.</CardDescription>
          </CardHeader>
          <CardContent>
            {renderInsightContent(
              'crossSell',
              crossSellInsight,
              'A IA identificará padrões de compra em seu histórico de vendas para sugerir produtos que são frequentemente comprados juntos.'
            )}
          </-CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Análise de Risco de Fornecedores
            </CardTitle>
            <CardDescription>Identificação de potenciais gargalos na sua cadeia de suprimentos.</CardDescription>
          </CardHeader>
          <CardContent>
            {renderInsightContent(
              'supplier',
              supplierInsight,
              'A IA avaliará os dados dos seus fornecedores, como status e histórico, para identificar riscos potenciais que possam impactar seu estoque.'
            )}
          </-CardContent>
        </Card>
      </div>
    </>
  );
};

export default IAInsights;