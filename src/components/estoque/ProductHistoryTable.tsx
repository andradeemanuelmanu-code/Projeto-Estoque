import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Movement = {
  date: Date;
  type: 'Entrada' | 'Saída';
  document: string;
  documentId: string;
  documentType: 'purchase' | 'sales';
  quantity: number;
  balance: number;
};

interface ProductHistoryTableProps {
  movements: Movement[];
}

export const ProductHistoryTable = ({ movements }: ProductHistoryTableProps) => {
  return (
    <div className="rounded-lg border shadow-sm bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Documento</TableHead>
            <TableHead className="text-center">Quantidade</TableHead>
            <TableHead className="text-right">Saldo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movements.length > 0 ? (
            movements.map((mov, index) => (
              <TableRow key={index}>
                <TableCell>{mov.date.toLocaleDateString('pt-BR')}</TableCell>
                <TableCell>
                  <Badge variant={mov.type === 'Entrada' ? 'default' : 'secondary'} className={cn(mov.type === 'Entrada' ? 'bg-green-500' : 'bg-red-500', 'text-white')}>
                    {mov.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Link 
                    to={`/${mov.documentType === 'purchase' ? 'compras' : 'vendas'}/pedidos/${mov.documentId}`} 
                    className="text-primary hover:underline"
                  >
                    {mov.document}
                  </Link>
                </TableCell>
                <TableCell className={cn("text-center font-medium", mov.type === 'Entrada' ? 'text-green-600' : 'text-red-600')}>
                  {mov.quantity > 0 ? `+${mov.quantity}` : mov.quantity}
                </TableCell>
                <TableCell className="text-right font-semibold">{mov.balance}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">Nenhuma movimentação encontrada.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};