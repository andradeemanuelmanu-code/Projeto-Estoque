import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Trash2 } from "lucide-react";
import { SalesOrder } from "@/data/salesOrders";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SalesOrderTableProps {
  orders: SalesOrder[];
  onViewDetails: (orderId: string) => void;
  onCancel: (orderId: string) => void;
}

const statusStyles = {
  Pendente: "bg-orange-500",
  Faturado: "bg-green-500",
  Cancelado: "bg-red-500",
};

export const SalesOrderTable = ({ orders, onViewDetails, onCancel }: SalesOrderTableProps) => {
  return (
    <div className="bg-card">
      <Table>
        <TableHeader className="hidden md:table-header-group">
          <TableRow>
            <TableHead>Número</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Valor Total</TableHead>
            <TableHead className="text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="block md:table-row-group">
          {orders.map((order) => (
            <TableRow key={order.id} className="block md:table-row mb-4 md:mb-0 border md:border-0 rounded-lg shadow-md md:shadow-none">
              <TableCell data-label="Número:" className="block md:table-cell text-right md:text-left p-2 md:p-4 before:content-[attr(data-label)] before:float-left before:font-bold md:before:content-none font-medium">{order.number}</TableCell>
              <TableCell data-label="Cliente:" className="block md:table-cell text-right md:text-left p-2 md:p-4 before:content-[attr(data-label)] before:float-left before:font-bold md:before:content-none">{order.customerName}</TableCell>
              <TableCell data-label="Data:" className="block md:table-cell text-right md:text-left p-2 md:p-4 before:content-[attr(data-label)] before:float-left before:font-bold md:before:content-none">{new Date(order.date).toLocaleDateString('pt-BR')}</TableCell>
              <TableCell data-label="Status:" className="block md:table-cell text-right md:text-center p-2 md:p-4 before:content-[attr(data-label)] before:float-left before:font-bold md:before:content-none">
                <Badge className={cn("text-white", statusStyles[order.status])}>{order.status}</Badge>
              </TableCell>
              <TableCell data-label="Valor Total:" className="block md:table-cell text-right md:text-right p-2 md:p-4 before:content-[attr(data-label)] before:float-left before:font-bold md:before:content-none">
                {order.totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </TableCell>
              <TableCell className="block md:table-cell text-right md:text-center p-2 md:p-4">
                <div className="flex items-center justify-end md:justify-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onViewDetails(order.id)}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Ver Detalhes</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Ver Detalhes</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onCancel(order.id)}
                        disabled={order.status === 'Cancelado'}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                        <span className="sr-only">Cancelar Pedido</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Cancelar Pedido</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};