import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { SalesOrder } from '@/types/SalesOrder';

const COLORS = {
  Faturado: '#22c55e', // green
  Pendente: '#f97316', // orange
  Cancelado: '#ef4444', // red
};

interface OrderStatusChartProps {
  pdfMode?: boolean;
  salesOrders: SalesOrder[];
  onStatusClick?: (status: string) => void;
}

export const OrderStatusChart = ({ pdfMode = false, salesOrders, onStatusClick }: OrderStatusChartProps) => {
  const chartData = useMemo(() => {
    const statusCounts = salesOrders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value,
    }));
  }, [salesOrders]);

  if (chartData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        Não há pedidos para exibir no período selecionado.
      </div>
    );
  }

  const handlePieClick = (data: any) => {
    if (onStatusClick && data && data.name) {
      onStatusClick(data.name);
    }
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Tooltip
          formatter={(value) => `${value} pedido(s)`}
        />
        <Legend />
        <Pie
          isAnimationActive={!pdfMode}
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          onClick={handlePieClick}
          className={onStatusClick ? 'cursor-pointer' : ''}
        >
          {chartData.map((entry) => (
            <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};