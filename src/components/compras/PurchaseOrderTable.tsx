import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Eye, Trash2 } from "lucide-react";
import { PurchaseOrder } from "@/data/purchaseOrders";
import { cn } from "@/lib/utils";

interface PurchaseOrderTableProps {
  orders: PurchaseOrder[];
  onViewDetails: (orderId: string) => void;
  onCancel: (orderId: string) => void;
}

const statusStyles = {
  Pendente: "bg-orange-500",
  Recebido: "bg-green-500",
  Cancelado: "bg-red-500",
};

export const PurchaseOrderTable = ({ orders, onViewDetails, onCancel }: PurchaseOrderTableProps) => {
  return (
    <div className="rounded-lg border shadow-sm bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Número</TableHead>
            <TableHead>Fornecedor</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Valor Total</TableHead>
            <TableHead className="text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.number}</TableCell>
              <TableCell>{order.supplierName}</TableCell>
              <TableCell>{new Date(order.date).toLocaleDateString('pt-BR')}</TableCell>
              <TableCell className="text-center">
                <Badge className={cn("text-white", statusStyles[order.status])}>{order.status}</Badge>
              </TableCell>
              <TableCell className="text-right">
                {order.totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </TableCell>
              <TableCell className="text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onViewDetails(order.id)}><Eye className="mr-2 h-4 w-4" /> Detalhes</DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-500" 
                      onClick={() => onCancel(order.id)}
                      disabled={order.status === 'Cancelado'}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Cancelar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};