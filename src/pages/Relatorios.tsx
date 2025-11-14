import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { File, Loader2 } from "lucide-react";
import { ReportCard } from "@/components/relatorios/ReportCard";
import { ProductParetoChart } from "@/components/relatorios/ProductParetoChart";
import { TopCustomersChart } from "@/components/relatorios/TopCustomersChart";
import { PurchasesBySupplierChart } from "@/components/relatorios/PurchasesBySupplierChart";
import { showLoading, showSuccess, dismissToast, showError } from "@/utils/toast";
import { PdfDocument } from "@/components/pdf/PdfDocument";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useAppData } from "@/context/AppDataContext";
import { TotalRevenueCard } from "@/components/relatorios/TotalRevenueCard";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { DateRange } from "react-day-picker";
import { subDays } from "date-fns";
import { StockValueCard } from "@/components/relatorios/StockValueCard";
import { SalesByCategoryChart } from "@/components/relatorios/SalesByCategoryChart";
import { IdleStockTable } from "@/components/relatorios/IdleStockTable";
import { ProfitabilityByProductTable } from "@/components/relatorios/ProfitabilityByProductTable";

const Relatorios = () => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);
  const appData = useAppData();
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const handleExportPDF = async () => {
    if (!pdfRef.current) return;
    setIsGeneratingPdf(true);
    const toastId = showLoading("Gerando PDF do relatório...");

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageElements = pdfRef.current.querySelectorAll<HTMLElement>('.pdf-page');

      for (let i = 0; i < pageElements.length; i++) {
        const element = pageElements[i];
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
        });

        const imgData = canvas.toDataURL('image/png');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        if (i > 0) {
          pdf.addPage();
        }
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      }

      pdf.save(`relatorio-geral-${new Date().toISOString().split('T')[0]}.pdf`);
      dismissToast(toastId);
      showSuccess("Relatório exportado com sucesso!");
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
      dismissToast(toastId);
      showError("Ocorreu um erro ao gerar o PDF.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <>
      <div style={{ position: 'fixed', left: '-9999px', top: 0 }}>
        <PdfDocument ref={pdfRef} data={appData} dateRange={date} />
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-lg font-semibold md:text-2xl text-foreground">Relatórios Gerenciais</h1>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <DatePickerWithRange date={date} setDate={setDate} />
          <Button onClick={handleExportPDF} disabled={isGeneratingPdf} className="w-full sm:w-auto">
            {isGeneratingPdf ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <File className="h-4 w-4 mr-2" />
            )}
            {isGeneratingPdf ? "Exportando..." : "Exportar PDF"}
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 mt-4">
        <TotalRevenueCard dateRange={date} />
        <StockValueCard />
        <ReportCard
          title="Análise de Lucratividade por Produto"
          description="Lucro bruto e margem para cada produto vendido no período."
        >
          <ProfitabilityByProductTable dateRange={date} />
        </ReportCard>
        <ReportCard
          title="Produtos sem Giro no Período"
          description="Itens em estoque que não tiveram vendas no período selecionado."
        >
          <IdleStockTable dateRange={date} />
        </ReportCard>
        <ReportCard
          title="Vendas por Categoria"
          description="Faturamento total agrupado por categoria de produto."
        >
          <SalesByCategoryChart dateRange={date} />
        </ReportCard>
        <ReportCard
          title="Análise de Pareto de Produtos"
          description="Produtos que representam a maior parte do faturamento (Curva ABC)."
        >
          <ProductParetoChart dateRange={date} />
        </ReportCard>
        <ReportCard
          title="Top 5 Clientes por Faturamento"
          description="Clientes que mais geraram receita para a empresa."
        >
          <TopCustomersChart dateRange={date} />
        </ReportCard>
        <ReportCard
          title="Top 5 Fornecedores por Compras"
          description="Fornecedores com o maior volume de compras."
        >
          <PurchasesBySupplierChart dateRange={date} />
        </ReportCard>
      </div>
    </>
  );
};

export default Relatorios;