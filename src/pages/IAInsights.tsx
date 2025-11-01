import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lightbulb, TrendingUp, AlertTriangle, Sparkles } from "lucide-react";

const IAInsights = () => {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-semibold md:text-2xl text-foreground">IA Insights</h1>
        </div>
      </div>
      <div className="grid gap-6 mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Previsão de Demanda
            </CardTitle>
            <CardDescription>
              Análise preditiva para otimizar seus níveis de estoque.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Com base nas tendências de vendas históricas e sazonalidade, prevemos que a demanda por <span className="font-semibold text-primary">"Vela de Ignição Laser Iridium"</span> aumentará em <span className="font-semibold text-green-500">15%</span> no próximo mês.
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Recomendação:</strong> Aumentar o pedido de compra em <span className="font-semibold text-primary">20 unidades</span> para evitar ruptura de estoque.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Oportunidades de Venda Cruzada (Cross-selling)
            </CardTitle>
            <CardDescription>
              Sugestões inteligentes para aumentar o valor médio dos pedidos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Clientes que compram <span className="font-semibold text-primary">"Pastilha de Freio Dianteira"</span> frequentemente também compram <span className="font-semibold text-primary">"Filtro de Óleo do Motor"</span>.
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Recomendação:</strong> Oferecer um desconto de 5% na compra conjunta desses itens.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Análise de Risco de Fornecedores
            </CardTitle>
            <CardDescription>
              Identificação de potenciais gargalos na sua cadeia de suprimentos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              O fornecedor <span className="font-semibold text-primary">"Fornecedora Minas Parts"</span> está atualmente com status <span className="font-semibold text-destructive">Inativo</span>.
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Recomendação:</strong> Buscar fornecedores alternativos para os produtos que eram fornecidos por eles para garantir a continuidade do estoque.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default IAInsights;