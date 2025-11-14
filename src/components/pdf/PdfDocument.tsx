import React from 'react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { AppDataContext, AppDataContextType } from '@/context/AppDataContext';
import { Wrench } from "lucide-react";
import { ReportCard } from "@/components/relatorios/ReportCard";
import { TotalRevenueCard } from "@/components/relatorios/TotalRevenueCard";
import { StockValueCard } from "@/components/relatorios/StockValueCard";
import { ProfitabilityByProductTable } from "@/components/relatorios/ProfitabilityByProductTable";
import { IdleStockTable } from "@/components/relatorios/IdleStockTable";
import { SalesByCategoryChart } from "@/components/relatorios/SalesByCategoryChart";
import { ProductParetoChart } from "@/components/relatorios/ProductParetoChart";
import { TopCustomersChart } from "@/components/relatorios/TopCustomersChart";
import { PurchasesBySupplierChart } from "@/components/relatorios/PurchasesBySupplierChart";

const PdfHeader = ({ dateRange }: { dateRange?: DateRange }) => {
  const formattedDateRange = dateRange?.from
    ? `${format(dateRange.from, 'dd/MM/yyyy')} - ${dateRange.to ? format(dateRange.to, 'dd/MM/yyyy') : ''}`
    : 'Período Completo';

  return (
    <header className="flex items-center justify-between pb-4 border-b mb-6">
      <div className="flex items-center gap-3 font-semibold">
        <Wrench className="h-8 w-8 text-primary" />
        <span className="text-2xl">Relatório Gerencial - Autoparts</span>
      </div>
      <div className="text-right text-sm">
        <p><strong>Período:</strong> {formattedDateRange}</p>
        <p><strong>Gerado em:</strong> {new Date().toLocaleString('pt-BR')}</p>
      </div>
    </header>
  );
};

interface PdfDocumentProps {
  data: AppDataContextType;
  dateRange?: DateRange;
}

export const PdfDocument = React.forwardRef<HTMLDivElement, PdfDocumentProps>(({ data, dateRange }, ref) => {
  return (
    <AppDataContext.Provider value={data}>
      <div
        ref={ref}
        className="bg-white text-black"
        style={{
          position: 'absolute',
          left: '-9999px',
          top: '0',
          width: '210mm',
          color: 'black',
        }}
      >
        {/* Página 1 */}
        <div className="pdf-page p-8" style={{ height: '297mm', display: 'flex', flexDirection: 'column' }}>
          <PdfHeader dateRange={dateRange} />
          <main className="flex-1">
            <div className="grid grid-cols-2 gap-4">
              <TotalRevenueCard dateRange={dateRange} />
              <StockValueCard />
              <ReportCard
                title="Análise de Lucratividade por Produto"
                description="Lucro bruto e margem para cada produto vendido."
              >
                <ProfitabilityByProductTable dateRange={dateRange} />
              </ReportCard>
              <ReportCard
                title="Produtos sem Giro no Período"
                description="Itens em estoque que não tiveram vendas."
              >
                <IdleStockTable dateRange={dateRange} />
              </ReportCard>
            </div>
          </main>
        </div>

        {/* Página 2 */}
        <div className="pdf-page p-8" style={{ height: '297mm', display: 'flex', flexDirection: 'column' }}>
          <PdfHeader dateRange={dateRange} />
          <main className="flex-1">
            <div className="grid grid-cols-2 gap-4">
              <ReportCard
                title="Vendas por Categoria"
                description="Faturamento total agrupado por categoria."
              >
                <SalesByCategoryChart pdfMode={true} dateRange={dateRange} />
              </ReportCard>
              <ReportCard
                title="Análise de Pareto de Produtos"
                description="Produtos que representam a maior parte do faturamento."
              >
                <ProductParetoChart pdfMode={true} dateRange={dateRange} />
              </ReportCard>
              <ReportCard
                title="Top 5 Clientes por Faturamento"
                description="Clientes que mais geraram receita."
              >
                <TopCustomersChart pdfMode={true} dateRange={dateRange} />
              </ReportCard>
              <ReportCard
                title="Top 5 Fornecedores por Compras"
                description="Fornecedores com o maior volume de compras."
              >
                <PurchasesBySupplierChart pdfMode={true} dateRange={dateRange} />
              </ReportCard>
            </div>
          </main>
        </div>
      </div>
    </AppDataContext.Provider>
  );
});