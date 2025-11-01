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
            'Com base nas tendências de vendas históricas e sazonalidade, prevemos que a demanda por "Vela de Ignição Laser Iridium" aumentará em 15% no próximo mês.\n\n**Recomendação:** Aumentar o pedido de compra em 20 unidades para evitar ruptura de estoque.'
          );
          break;
        case 'crossSell':
          setCrossSellInsight(
            'Clientes que compram "Pastilha de Freio Dianteira" frequentemente também compram "Filtro de Óleo do Motor".\n\n**Recomendação:** Oferecer um desconto de 5% na compra conjunta desses itens.'
          );
          break;
        case 'supplier':
          setSupplierInsight(
            'O fornecedor "Fornecedora Minas Parts" está atualmente com status Inativo.\n\n**Recomendação:** Buscar fornecedores alternativos para os produtos que eram fornecidos por eles para garantir a continuidade do estoque.'
          );
          break;
      }
    }, 2000); // Simula o tempo de processamento da IA
  };

  const renderInsightContent = (
    type: InsightType,
    insight: string | null,
    description: string,
    recommendation: string
  ) => {
    if (insight) {
      return (
        <div className="space-y-2">
          {insight.split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
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
          <h1 className="text-lg font-semibold md-text-2xl text-foreground">IA Insights</h1>
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
              'A IA analisará seus dados de vendas para prever a demanda futura de produtos-chave, ajudando a evitar falta ou excesso de estoque.',
              ''
            )}
          </CardContent>
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
              'A IA identificará padrões de compra em seu histórico de vendas para sugerir produtos que são frequentemente comprados juntos.',
              ''
            )}
          </CardContent>
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
              'A IA avaliará os dados dos seus fornecedores, como status e histórico, para identificar riscos potenciais que possam impactar seu estoque.',
              ''
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default IAInsights;