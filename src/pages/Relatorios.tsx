import { Button } from "@/components/ui/button";
import { File } from "lucide-react";
import { ReportCard } from "@/components/relatorios/ReportCard";
import { SalesOverTimeChart } from "@/components/relatorios/SalesOverTimeChart";
import { SalesByCategoryChart } from "@/components/relatorios/SalesByCategoryChart";

const Relatorios = () => {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl text-foreground">Relatórios</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            Filtrar por Data
          </Button>
          <Button>
            <File className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 mt-4">
        <ReportCard
          title="Faturamento ao Longo do Tempo"
          description="Receita de vendas faturadas no período selecionado."
        >
          <SalesOverTimeChart />
        </ReportCard>
        <ReportCard
          title="Vendas por Categoria"
          description="Total de vendas agrupado por categoria de produto."
        >
          <SalesByCategoryChart />
        </ReportCard>
      </div>
    </>
  );
};

export default Relatorios;