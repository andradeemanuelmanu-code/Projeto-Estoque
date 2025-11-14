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
    <div className="bg-card">
      <Table>
        <TableHeader className="hidden md:table-header-group">
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Documento</TableHead>
            <TableHead className="text-center">Quantidade</TableHead>
            <TableHead className="text-right">Saldo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="block md:table-row-group">
          {movements.length > 0 ? (
            movements.map((mov, index) => (
              <TableRow key={index} className="block md:table-row mb-4 md:mb-0 border md:border-0 rounded-lg shadow-md md:shadow-none">
                <TableCell data-label="Data:" className="block md:table-cell text-right md:text-left p-2 md:p-4 before:content-[attr(data-label)] before:float-left before:font-bold md:before:content-none">{mov.date.toLocaleDateString('pt-BR')}</TableCell>
                <TableCell data-label="Tipo:" className="block md:table-cell text-right md:text-left p-2 md:p-4 before:content-[attr(data-label)] before:float-left before:font-bold md:before:content-none">
                  <Badge variant={mov.type === 'Entrada' ? 'default' : 'secondary'} className={cn(mov.type === 'Entrada' ? 'bg-green-500' : 'bg-red-500', 'text-white')}>
                    {mov.type}
                  </Badge>
                </TableCell>
                <TableCell data-label="Documento:" className="block md:table-cell text-right md:text-left p-2 md:p-4 before:content-[attr(data-label)] before:float-left before:font-bold md:before:content-none">
                  <Link 
                    to={`/${mov.documentType === 'purchase' ? 'compras' : 'vendas'}/pedidos/${mov.documentId}`} 
                    className="text-primary hover:underline"
                  >
                    {mov.document}
                  </Link>
                </TableCell>
                <TableCell data-label="Quantidade:" className={cn("block md:table-cell text-right md:text-center p-2 md:p-4 before:content-[attr(data-label)] before:float-left before:font-bold md:before:content-none font-medium", mov.type === 'Entrada' ? 'text-green-600' : 'text-red-600')}>
                  {mov.quantity > 0 ? `+${mov.quantity}` : mov.quantity}
                </TableCell>
                <TableCell data-label="Saldo:" className="block md:table-cell text-right md:text-right p-2 md:p-4 before:content-[attr(data-label)] before:float-left before:font-bold md:before:content-none font-semibold">{mov.balance}</TableCell>
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