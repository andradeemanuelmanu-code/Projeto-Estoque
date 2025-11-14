import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useMemo } from 'react';
import { useAppData } from '@/context/AppDataContext';
import { DateRange } from 'react-day-picker';
import { useNavigate } from 'react-router-dom';

interface TopCustomersChartProps {
  pdfMode?: boolean;
  dateRange?: DateRange;
}

export const TopCustomersChart = ({ pdfMode = false, dateRange }: TopCustomersChartProps) => {
  const { salesOrders } = useAppData();
  const navigate = useNavigate();

  const chartData = useMemo(() => {
    const filteredOrders = salesOrders.filter(order => {
      if (order.status !== 'Faturado') return false;
      if (!dateRange?.from) return true;
      const orderDate = new Date(order.date);
      const toDate = dateRange.to ? new Date(dateRange.to.getTime() + 86400000) : new Date();
      return orderDate >= dateRange.from && orderDate < toDate;
    });

    const salesByCustomer: { [key: string]: { name: string; value: number } } = {};
    filteredOrders.forEach(order => {
      salesByCustomer[order.customerId] = {
        name: order.customerName,
        value: (salesByCustomer[order.customerId]?.value || 0) + order.totalValue,
      };
    });

    return Object.entries(salesByCustomer)
      .map(([customerId, data]) => ({
        customerId,
        name: data.name,
        Faturamento: data.value,
      }))
      .sort((a, b) => b.Faturamento - a.Faturamento)
      .slice(0, 5);
  }, [salesOrders, dateRange]);

  const handleBarClick = (data: any) => {
    if (data && data.activePayload && data.activePayload[0]?.payload.customerId) {
      navigate(`/vendas/clientes/${data.activePayload[0].payload.customerId}`);
    }
  };

  if (chartData.length === 0) {
    return (
      <div className="h-[350px] flex items-center justify-center text-muted-foreground">
        Não há dados para exibir no período selecionado.
      </div>
    );
  }

  return (
    <div className="h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }} onClick={handleBarClick}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" tickFormatter={(value) => `R$${value / 1000}k`} />
          <YAxis type="category" dataKey="name" width={120} />
          <Tooltip formatter={(value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
          <Legend />
          <Bar isAnimationActive={!pdfMode} dataKey="Faturamento" fill="#8884d8" className="cursor-pointer" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};