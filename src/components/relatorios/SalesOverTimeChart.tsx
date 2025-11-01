import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { mockSalesOrders } from '@/data/salesOrders';
import { useMemo } from 'react';

export const SalesOverTimeChart = () => {
  const chartData = useMemo(() => {
    const faturadoOrders = mockSalesOrders.filter(order => order.status === 'Faturado');
    return faturadoOrders.map(order => ({
      date: new Date(order.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      Faturamento: order.totalValue,
    })).sort((a, b) => {
        const dateA = new Date(a.date.split('/').reverse().join('-')).getTime();
        const dateB = new Date(b.date.split('/').reverse().join('-')).getTime();
        return dateA - dateB;
    });
  }, []);

  return (
    <div className="h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis tickFormatter={(value) => `R$${value}`} />
          <Tooltip formatter={(value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
          <Legend />
          <Line type="monotone" dataKey="Faturamento" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};