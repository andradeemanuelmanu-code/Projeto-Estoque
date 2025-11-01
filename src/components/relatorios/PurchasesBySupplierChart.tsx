import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { mockPurchaseOrders } from '@/data/purchaseOrders';
import { useMemo } from 'react';

export const PurchasesBySupplierChart = ({ pdfMode = false }: { pdfMode?: boolean }) => {
  const chartData = useMemo(() => {
    const purchasesBySupplier: { [key: string]: number } = {};

    mockPurchaseOrders
      .filter(order => order.status === 'Recebido')
      .forEach(order => {
        if (!purchasesBySupplier[order.supplierName]) {
          purchasesBySupplier[order.supplierName] = 0;
        }
        purchasesBySupplier[order.supplierName] += order.totalValue;
      });

    return Object.keys(purchasesBySupplier)
      .map(supplierName => ({
        name: supplierName,
        Compras: purchasesBySupplier[supplierName],
      }))
      .sort((a, b) => b.Compras - a.Compras)
      .slice(0, 5);
  }, []);

  return (
    <div className="h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" tickFormatter={(value) => `R$${value / 1000}k`} />
          <YAxis type="category" dataKey="name" width={120} />
          <Tooltip formatter={(value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
          <Legend />
          <Bar isAnimationActive={!pdfMode} dataKey="Compras" fill="#d88488" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};