import { Button } from "@/components/ui/button";
import { File } from "lucide-react";
import { ReportCard } from "@/components/relatorios/ReportCard";
import { ProductParetoChart } from "@/components/relatorios/ProductParetoChart";
import { InventoryValueCard } from "@/components/relatorios/InventoryValueCard";
import { TopCustomersChart } from "@/components/relatorios/TopCustomersChart";
import { PurchasesBySupplierChart } from "@/components/relatorios/PurchasesBySupplierChart";
import { showLoading, showSuccess, dismissToast } from "@/utils/toast";

const Relatorios = () => {
  const handleExportPDF = () => {
    const toastId = showLoading("Gerando PDF do relatório...");
    setTimeout(() => {
      dismissToast(toastId);
      showSuccess("Relatório exportado com sucesso!");
    }, 1500);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl text-foreground">Relatórios Gerenciais</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            Filtrar por Data
          </Button>
          <Button onClick={handleExportPDF}>
            <File className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 mt-4">
        <InventoryValueCard />
        <ReportCard
          title="Análise de Pareto de Produtos"
          description="Produtos que representam a maior parte do faturamento (Curva ABC)."
        >
          <ProductParetoChart />
        </ReportCard>
        <ReportCard
          title="Top 5 Clientes por Faturamento"
          description="Clientes que mais geraram receita para a empresa."
        >
          <TopCustomersChart />
        </ReportCard>
        <ReportCard
          title="Top 5 Fornecedores por Compras"
          description="Fornecedores com o maior volume de compras."
        >
          <PurchasesBySupplierChart />
        </ReportCard>
      </div>
    </>
  );
};

export default Relatorios;