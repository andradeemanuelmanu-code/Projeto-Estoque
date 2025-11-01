import { ComposedChart, Bar, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { mockSalesOrders } from '@/data/salesOrders';
import { mockProducts } from '@/data/products';
import { useMemo } from 'react';

export const ProductParetoChart = () => {
  const chartData = useMemo(() => {
    const productSales: { [key: string]: number } = {};

    // 1. Agrega as vendas por produto
    mockSalesOrders
      .filter(order => order.status === 'Faturado')
      .forEach(order => {
        order.items.forEach(item => {
          if (!productSales[item.productId]) {
            productSales[item.productId] = 0;
          }
          productSales[item.productId] += item.quantity * item.unitPrice;
        });
      });

    // 2. Calcula o total de vendas
    const totalSales = Object.values(productSales).reduce((acc, value) => acc + value, 0);

    // 3. Mapeia para um array, ordena e calcula a porcentagem cumulativa
    let cumulativeValue = 0;
    const sortedProducts = Object.entries(productSales)
      .map(([productId, sales]) => {
        const product = mockProducts.find(p => p.id === productId);
        return {
          name: product ? product.description.substring(0, 20) + '...' : 'Desconhecido', // Limita o nome
          Vendas: sales,
        };
      })
      .sort((a, b) => b.Vendas - a.Vendas)
      .map(product => {
        cumulativeValue += product.Vendas;
        return {
          ...product,
          Cumulativo: parseFloat(((cumulativeValue / totalSales) * 100).toFixed(1)),
        };
      });

    return sortedProducts;
  }, []);

  return (
    <div className="h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 75 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end" 
            interval={0}
            tick={{ fontSize: 10 }}
          />
          <YAxis 
            yAxisId="left" 
            orientation="left" 
            stroke="#8884d8"
            tickFormatter={(value) => `R$${value / 1000}k`}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            stroke="#82ca9d"
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip 
            formatter={(value, name) => {
              if (name === 'Vendas (R$)') {
                return (value as number).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
              }
              if (name === 'Acumulado (%)') {
                return `${value}%`;
              }
              return value;
            }}
          />
          <Legend verticalAlign="top" />
          <Bar dataKey="Vendas" yAxisId="left" fill="#8884d8" name="Vendas (R$)" />
          <Line type="monotone" dataKey="Cumulativo" yAxisId="right" stroke="#82ca9d" name="Acumulado (%)" dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};