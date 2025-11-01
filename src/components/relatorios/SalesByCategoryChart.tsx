import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { mockSalesOrders } from '@/data/salesOrders';
import { mockProducts } from '@/data/products';
import { useMemo } from 'react';

export const SalesByCategoryChart = () => {
  const chartData = useMemo(() => {
    const salesByCategory: { [key: string]: number } = {};

    mockSalesOrders
      .filter(order => order.status === 'Faturado')
      .forEach(order => {
        order.items.forEach(item => {
          const product = mockProducts.find(p => p.id === item.productId);
          if (product) {
            const category = product.category;
            const saleValue = item.quantity * item.unitPrice;
            if (!salesByCategory[category]) {
              salesByCategory[category] = 0;
            }
            salesByCategory[category] += saleValue;
          }
        });
      });

    return Object.keys(salesByCategory).map(category => ({
      name: category,
      Vendas: salesByCategory[category],
    }));
  }, []);

  return (
    <div className="h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" tickFormatter={(value) => `R$${value / 1000}k`} />
          <YAxis type="category" dataKey="name" width={80} />
          <Tooltip formatter={(value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
          <Legend />
          <Bar dataKey="Vendas" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};