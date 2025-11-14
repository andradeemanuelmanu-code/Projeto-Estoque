import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useAppData } from '@/context/AppDataContext';
import { useMemo } from 'react';
import { DateRange } from 'react-day-picker';
import { useNavigate } from 'react-router-dom';

interface PurchasesBySupplierChartProps {
  pdfMode?: boolean;
  dateRange?: DateRange;
}

export const PurchasesBySupplierChart = ({ pdfMode = false, dateRange }: PurchasesBySupplierChartProps) => {
  const { purchaseOrders } = useAppData();
  const navigate = useNavigate();

  const chartData = useMemo(() => {
    const filteredOrders = purchaseOrders.filter(order => {
      if (order.status !== 'Recebido') return false;
      if (!dateRange?.from) return true;
      const orderDate = new Date(order.date);
      const toDate = dateRange.to ? new Date(dateRange.to.getTime() + 86400000) : new Date();
      return orderDate >= dateRange.from && orderDate < toDate;
    });

    const purchasesBySupplier: { [key: string]: { name: string; value: number } } = {};
    filteredOrders.forEach(order => {
      purchasesBySupplier[order.supplierId] = {
        name: order.supplierName,
        value: (purchasesBySupplier[order.supplierId]?.value || 0) + order.totalValue,
      };
    });

    return Object.entries(purchasesBySupplier)
      .map(([supplierId, data]) => ({
        supplierId,
        name: data.name,
        Compras: data.value,
      }))
      .sort((a, b) => b.Compras - a.Compras)
      .slice(0, 5);
  }, [purchaseOrders, dateRange]);

  const handleBarClick = (data: any) => {
    if (data && data.activePayload && data.activePayload[0]?.payload.supplierId) {
      navigate(`/mapa?selectedId=${data.activePayload[0].payload.supplierId}`);
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
          <Bar isAnimationActive={!pdfMode} dataKey="Compras" fill="#d88488" className="cursor-pointer" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};