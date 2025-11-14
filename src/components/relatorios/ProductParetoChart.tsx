import { ComposedChart, Bar, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useMemo } from 'react';
import { useAppData } from '@/context/AppDataContext';
import { DateRange } from 'react-day-picker';
import { useNavigate } from 'react-router-dom';

interface ProductParetoChartProps {
  pdfMode?: boolean;
  dateRange?: DateRange;
}

export const ProductParetoChart = ({ pdfMode = false, dateRange }: ProductParetoChartProps) => {
  const { salesOrders, products } = useAppData();
  const navigate = useNavigate();

  const chartData = useMemo(() => {
    const filteredOrders = salesOrders.filter(order => {
      if (order.status !== 'Faturado') return false;
      if (!dateRange?.from) return true;
      const orderDate = new Date(order.date);
      const toDate = dateRange.to ? new Date(dateRange.to.getTime() + 86400000) : new Date();
      return orderDate >= dateRange.from && orderDate < toDate;
    });

    const productSales: { [key: string]: number } = {};
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        productSales[item.productId] = (productSales[item.productId] || 0) + (item.quantity * item.unitPrice);
      });
    });

    const totalSales = Object.values(productSales).reduce((acc, value) => acc + value, 0);
    if (totalSales === 0) return [];

    let cumulativeValue = 0;
    return Object.entries(productSales)
      .map(([productId, sales]) => ({
        productId,
        name: products.find(p => p.id === productId)?.description.substring(0, 20) + '...' || 'Desconhecido',
        Vendas: sales,
      }))
      .sort((a, b) => b.Vendas - a.Vendas)
      .map(product => {
        cumulativeValue += product.Vendas;
        return {
          ...product,
          Cumulativo: parseFloat(((cumulativeValue / totalSales) * 100).toFixed(1)),
        };
      });
  }, [salesOrders, products, dateRange]);

  const handleBarClick = (data: any) => {
    if (data && data.activePayload && data.activePayload[0]?.payload.productId) {
      navigate(`/estoque/${data.activePayload[0].payload.productId}`);
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
        <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 75 }} onClick={handleBarClick}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} tick={{ fontSize: 10 }} />
          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" tickFormatter={(value) => `R$${value / 1000}k`} />
          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
          <Tooltip formatter={(value: number, name: string) => name === 'Vendas' ? value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : `${value}%`} />
          <Legend verticalAlign="top" />
          <Bar isAnimationActive={!pdfMode} dataKey="Vendas" yAxisId="left" fill="#8884d8" name="Vendas (R$)" className="cursor-pointer" />
          <Line isAnimationActive={!pdfMode} type="monotone" dataKey="Cumulativo" yAxisId="right" stroke="#82ca9d" name="Acumulado (%)" dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};