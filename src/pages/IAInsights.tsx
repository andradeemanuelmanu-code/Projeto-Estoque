import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, TrendingUp, AlertTriangle, Sparkles, Loader2, RefreshCw } from "lucide-react";
import { showLoading, dismissToast, showError } from "@/utils/toast";
import { generateInsight, InsightResult, InsightType, InsightAction } from "../services/iaService";

type InsightState = Omit<InsightResult, 'status' | 'action'> & {
  status: 'idle' | 'loading' | 'success' | 'no_insight' | 'error';
  action?: InsightAction;
};

type InsightsState = Record<InsightType, InsightState>;

const initialInsightsState: InsightsState = {
  demand: { status: 'idle' },
  crossSell: { status: 'idle' },
  supplier: { status: 'idle' },
};

const IAInsights = () => {
  const [insights, setInsights] = useState<InsightsState>(initialInsightsState);

  const handleGenerateInsight = async (type: InsightType) => {
    setInsights(prev => ({ ...prev, [type]: { status: 'loading' } }));
    const toastId = showLoading(`Analisando dados e gerando insight de ${type}...`);

    try {
      const result = await generateInsight(type);
      setInsights(prev => ({ ...prev, [type]: result as InsightState }));
    } catch (error: any) {
      setInsights(prev => ({ ...prev, [type]: error }));
      showError(error.errorMessage || "Falha ao gerar insight.");
    } finally {
      dismissToast(toastId);
    }
  };

  const renderInsightContent = (type: InsightType) => {
    const insight = insights[type];

    switch (insight.status) {
      case 'loading':
        return (
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Gerando...
          </Button>
        );
      
      case 'success':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{insight.content?.main}</p>
              <p className="text-sm">
                <strong>Recomendação:</strong> {insight.content?.recommendation}
              </p>
            </div>
            {insight.action && (
              <Button asChild variant="outline">
                <Link to={insight.action.link}>
                  <insight.action.Icon className="mr-2 h-4 w-4" />
                  {insight.action.text}
                </Link>
              </Button>
            )}
          </div>
        );

      case 'no_insight':
        return (
          <div className="flex flex-col items-start gap-4">
            <p className="text-sm text-muted-foreground">Nenhuma oportunidade clara foi identificada no momento.</p>
            <Button onClick={() => handleGenerateInsight(type)}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Analisar Novamente
            </Button>
          </div>
        );

      case 'error':
        return (
          <div className="flex flex-col items-start gap-4">
            <p className="text-sm text-destructive">{insight.errorMessage}</p>
            <Button variant="destructive" onClick={() => handleGenerateInsight(type)}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Tentar Novamente
            </Button>
          </div>
        );

      case 'idle':
      default:
        const descriptions: Record<InsightType, string> = {
          demand: 'A IA analisará seus dados de vendas para prever a demanda futura de produtos-chave, ajudando a evitar falta ou excesso de estoque.',
          crossSell: 'A IA identificará padrões de compra em seu histórico de vendas para sugerir produtos que são frequentemente comprados juntos.',
          supplier: 'A IA avaliará os dados dos seus fornecedores, como status e histórico, para identificar riscos potenciais que possam impactar seu estoque.',
        };
        return (
          <div className="flex flex-col items-start gap-4">
            <p className="text-sm text-muted-foreground">{descriptions[type]}</p>
            <Button onClick={() => handleGenerateInsight(type)}>
              <Sparkles className="mr-2 h-4 w-4" />
              Gerar Insight
            </Button>
          </div>
        );
    }
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
            {renderInsightContent('demand')}
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
            {renderInsightContent('crossSell')}
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
            {renderInsightContent('supplier')}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default IAInsights;