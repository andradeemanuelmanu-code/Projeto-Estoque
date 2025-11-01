import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { mockSalesOrders } from '@/data/salesOrders';

const COLORS = {
  Faturado: '#22c55e', // green
  Pendente: '#f97316', // orange
  Cancelado: '#ef4444', // red
};

export const OrderStatusChart = () => {
  const chartData = useMemo(() => {
    const statusCounts = mockSalesOrders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value,
    }));
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Tooltip
          formatter={(value) => `${value} pedido(s)`}
        />
        <Legend />
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
        >
          {chartData.map((entry) => (
            <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};