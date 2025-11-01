import React from 'react';
import { KpiCard } from "@/components/dashboard/KpiCard";
import { StockAlertsCard } from "@/components/dashboard/StockAlertsCard";
import { TopProductsCard } from "@/components/dashboard/TopProductsCard";
import { MarginChartCard } from "@/components/dashboard/MarginChartCard";
import { OrderStatusChart } from "@/components/dashboard/OrderStatusChart";
import { StockMovementChart } from "@/components/dashboard/StockMovementChart";
import { InventoryValueCard } from "@/components/relatorios/InventoryValueCard";
import { ProductParetoChart } from "@/components/relatorios/ProductParetoChart";
import { TopCustomersChart } from "@/components/relatorios/TopCustomersChart";
import { PurchasesBySupplierChart } from "@/components/relatorios/PurchasesBySupplierChart";
import { DollarSign, Activity, Car } from "lucide-react";

export const PdfDocument = React.forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <div
      ref={ref}
      className="bg-white text-black p-8"
      style={{
        position: 'absolute',
        left: '-9999px',
        top: '0',
        width: '210mm',
        minHeight: '297mm',
        color: 'black',
      }}
    >
      <header className="flex items-center justify-between pb-4 border-b mb-6">
        <div className="flex items-center gap-3 font-semibold">
          <Car className="h-8 w-8 text-primary" />
          <span className="text-2xl">Relatório Geral - Autoparts</span>
        </div>
        <div className="text-right text-sm">
          <p>Gerado em:</p>
          <p>{new Date().toLocaleString('pt-BR')}</p>
        </div>
      </header>

      <main className="space-y-6">
        <section className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Visão Geral do Dashboard</h2>
          <div className="grid grid-cols-4 gap-4">
            <KpiCard title="Faturamento Total" value="R$ 45.231,89" change="+20.1% do último mês" changeType="positive" Icon={DollarSign} />
            <KpiCard title="Giro de Estoque" value="573" change="-2.4% da última hora" changeType="negative" Icon={Activity} />
            <StockAlertsCard />
            <MarginChartCard pdfMode={true} />
          </div>
          <div className="grid grid-cols-2 gap-6 mt-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-center">Status dos Pedidos de Venda</h3>
              <OrderStatusChart pdfMode={true} />
            </div>
            <div>
              <TopProductsCard />
            </div>
          </div>
          <div className="mt-6 space-y-2">
            <h3 className="font-semibold text-center">Movimentação de Estoque</h3>
            <StockMovementChart pdfMode={true} />
          </div>
        </section>

        <section className="p-4 border rounded-lg" style={{ pageBreakBefore: 'always' }}>
          <h2 className="text-xl font-semibold mb-4">Relatórios Gerenciais</h2>
          <div className="grid grid-cols-1 gap-6">
            <InventoryValueCard />
            <div className="space-y-2">
                <h3 className="font-semibold text-center">Análise de Pareto de Produtos</h3>
                <ProductParetoChart pdfMode={true} />
            </div>
            <div className="space-y-2">
                <h3 className="font-semibold text-center">Top 5 Clientes por Faturamento</h3>
                <TopCustomersChart pdfMode={true} />
            </div>
            <div className="space-y-2">
                <h3 className="font-semibold text-center">Top 5 Fornecedores por Compras</h3>
                <PurchasesBySupplierChart pdfMode={true} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
});