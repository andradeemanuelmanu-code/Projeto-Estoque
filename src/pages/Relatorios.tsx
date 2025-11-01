import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { File, Loader2 } from "lucide-react";
import { ReportCard } from "@/components/relatorios/ReportCard";
import { ProductParetoChart } from "@/components/relatorios/ProductParetoChart";
import { InventoryValueCard } from "@/components/relatorios/InventoryValueCard";
import { TopCustomersChart } from "@/components/relatorios/TopCustomersChart";
import { PurchasesBySupplierChart } from "@/components/relatorios/PurchasesBySupplierChart";
import { showLoading, showSuccess, dismissToast, showError } from "@/utils/toast";
import { PdfDocument } from "@/components/pdf/PdfDocument";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Relatorios = () => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = () => {
    setIsGeneratingPdf(true);
  };

  useEffect(() => {
    if (!isGeneratingPdf || !pdfRef.current) return;

    const toastId = showLoading("Gerando PDF do relatório...");
    const element = pdfRef.current;

    // Adiciona um pequeno atraso para garantir que tudo esteja renderizado
    setTimeout(() => {
      html2canvas(element, {
        scale: 2, // Melhora a resolução
        useCORS: true,
        backgroundColor: '#ffffff', // Define um fundo branco
      })
        .then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          const imgWidth = pdfWidth;
          const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
          
          let heightLeft = imgHeight;
          let position = 0;

          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pdfHeight;

          while (heightLeft > 0) {
            position -= pdfHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;
          }
          
          pdf.save(`relatorio-geral-${new Date().toISOString().split('T')[0]}.pdf`);
          dismissToast(toastId);
          showSuccess("Relatório exportado com sucesso!");
        })
        .catch(err => {
          console.error("Erro ao gerar PDF:", err);
          dismissToast(toastId);
          showError("Ocorreu um erro ao gerar o PDF.");
        })
        .finally(() => {
          setIsGeneratingPdf(false);
        });
    }, 500); // Atraso de 500ms
  }, [isGeneratingPdf]);

  return (
    <>
      {isGeneratingPdf && <PdfDocument ref={pdfRef} />}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl text-foreground">Relatórios Gerenciais</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            Filtrar por Data
          </Button>
          <Button onClick={handleExportPDF} disabled={isGeneratingPdf}>
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