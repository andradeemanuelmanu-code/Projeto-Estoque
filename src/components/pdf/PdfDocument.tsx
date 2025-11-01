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
      className="bg-background text-foreground p-8"
      style={{
        position: 'absolute',
        left: '-9999px',
        top: '0',
        width: '210mm', // A4 width
        minHeight: '297mm', // A4 height
      }}
    >
      <header className="flex items-center justify-between pb-8 border-b mb-8">
        <div className="flex items-center gap-2 font-semibold">
          <Car className="h-8 w-8 text-primary" />
          <span className="text-2xl">Relatório Geral - Autoparts</span>
        </div>
        <div className="text-right text-sm text-muted-foreground">
          <p>Gerado em:</p>
          <p>{new Date().toLocaleString('pt-BR')}</p>
        </div>
      </header>

      <main className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Visão Geral do Dashboard</h2>
          <div className="grid gap-4 grid-cols-4">
            <KpiCard title="Faturamento Total" value="R$ 45.231,89" change="+20.1% do último mês" changeType="positive" Icon={DollarSign} />
            <KpiCard title="Giro de Estoque" value="573" change="-2.4% da última hora" changeType="negative" Icon={Activity} />
            <StockAlertsCard />
            <MarginChartCard />
          </div>
          <div className="grid gap-4 grid-cols-5 mt-4">
            <div className="col-span-3 space-y-2">
              <h3 className="font-semibold">Status dos Pedidos de Venda</h3>
              <OrderStatusChart />
            </div>
            <div className="col-span-2">
              <TopProductsCard />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <h3 className="font-semibold">Movimentação de Estoque</h3>
            <StockMovementChart />
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Relatórios Gerenciais</h2>
          <div className="grid gap-4 grid-cols-2">
            <InventoryValueCard />
            <div className="space-y-2">
                <h3 className="font-semibold">Análise de Pareto de Produtos</h3>
                <ProductParetoChart />
            </div>
            <div className="space-y-2">
                <h3 className="font-semibold">Top 5 Clientes por Faturamento</h3>
                <TopCustomersChart />
            </div>
            <div className="space-y-2">
                <h3 className="font-semibold">Top 5 Fornecedores por Compras</h3>
                <PurchasesBySupplierChart />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
});