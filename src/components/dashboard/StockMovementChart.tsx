import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { useMemo } from 'react';
import { SalesOrder } from '@/data/salesOrders';
import { PurchaseOrder } from '@/data/purchaseOrders';

interface StockMovementChartProps {
  pdfMode?: boolean;
  salesOrders: SalesOrder[];
  purchaseOrders: PurchaseOrder[];
}

export const StockMovementChart = ({ pdfMode = false, salesOrders, purchaseOrders }: StockMovementChartProps) => {
  const chartData = useMemo(() => {
    const movements: { [date: string]: { entradas: number; saidas: number } } = {};

    purchaseOrders.filter(o => o.status === 'Recebido').forEach(order => {
      const date = new Date(order.date).toLocaleDateString('pt-BR');
      if (!movements[date]) movements[date] = { entradas: 0, saidas: 0 };
      movements[date].entradas += order.items.reduce((acc, item) => acc + item.quantity, 0);
    });

    salesOrders.filter(o => o.status === 'Faturado').forEach(order => {
      const date = new Date(order.date).toLocaleDateString('pt-BR');
      if (!movements[date]) movements[date] = { entradas: 0, saidas: 0 };
      movements[date].saidas += order.items.reduce((acc, item) => acc + item.quantity, 0);
    });

    return Object.keys(movements).map(date => ({
      date,
      Entradas: movements[date].entradas,
      Saídas: movements[date].saidas,
    })).sort((a, b) => new Date(a.date.split('/').reverse().join('-')).getTime() - new Date(b.date.split('/').reverse().join('-')).getTime());
  }, [salesOrders, purchaseOrders]);

  if (chartData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        Nenhuma movimentação de estoque no período.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" stroke="#888888" fontSize={12} />
        <YAxis stroke="#888888" fontSize={12} />
        <Tooltip />
        <Legend />
        <Line isAnimationActive={!pdfMode} type="monotone" dataKey="Entradas" stroke="#22c55e" />
        <Line isAnimationActive={!pdfMode} type="monotone" dataKey="Saídas" stroke="#ef4444" />
      </LineChart>
    </ResponsiveContainer>
  );
};