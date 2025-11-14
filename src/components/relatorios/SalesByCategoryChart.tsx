import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useMemo } from 'react';
import { useAppData } from '@/context/AppDataContext';
import { DateRange } from 'react-day-picker';

interface SalesByCategoryChartProps {
  pdfMode?: boolean;
  dateRange?: DateRange;
}

export const SalesByCategoryChart = ({ pdfMode = false, dateRange }: SalesByCategoryChartProps) => {
  const { salesOrders, products } = useAppData();

  const chartData = useMemo(() => {
    const filteredOrders = salesOrders.filter(order => {
      if (order.status !== 'Faturado') return false;
      if (!dateRange?.from) return true;
      const orderDate = new Date(order.date);
      const toDate = dateRange.to ? new Date(dateRange.to.getTime() + 86400000) : new Date();
      return orderDate >= dateRange.from && orderDate < toDate;
    });

    const salesByCategory: { [category: string]: number } = {};

    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          salesByCategory[product.category] = (salesByCategory[product.category] || 0) + (item.quantity * item.unitPrice);
        }
      });
    });

    return Object.entries(salesByCategory)
      .map(([name, faturamento]) => ({ name, Faturamento: faturamento }))
      .sort((a, b) => b.Faturamento - a.Faturamento);
  }, [salesOrders, products, dateRange]);

  if (chartData.length === 0) {
    return (
      <div className="h-[350px] flex items-center justify-center text-muted-foreground">
        Não há dados de vendas para exibir no período selecionado.
      </div>
    );
  }

  return (
    <div className="h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(value) => `R$${value / 1000}k`} />
          <Tooltip formatter={(value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
          <Legend />
          <Bar isAnimationActive={!pdfMode} dataKey="Faturamento" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};