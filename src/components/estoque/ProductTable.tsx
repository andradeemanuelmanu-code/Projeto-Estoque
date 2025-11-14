import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, History } from "lucide-react";
import { Product } from "@/data/products";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onViewHistory: (productId: string) => void;
}

export const ProductTable = ({ products, onEdit, onDelete, onViewHistory }: ProductTableProps) => {
  return (
    <div className="bg-card">
      <Table>
        <TableHeader className="hidden md:table-header-group">
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Marca</TableHead>
            <TableHead className="text-center">Estoque Atual</TableHead>
            <TableHead className="text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="block md:table-row-group">
          {products.map((product) => (
            <TableRow key={product.id} className="block md:table-row mb-4 md:mb-0 border md:border-0 rounded-lg shadow-md md:shadow-none">
              <TableCell data-label="Código:" className="block md:table-cell text-right md:text-left p-2 md:p-4 before:content-[attr(data-label)] before:float-left before:font-bold md:before:content-none font-medium">{product.code}</TableCell>
              <TableCell data-label="Descrição:" className="block md:table-cell text-right md:text-left p-2 md:p-4 before:content-[attr(data-label)] before:float-left before:font-bold md:before:content-none">{product.description}</TableCell>
              <TableCell data-label="Categoria:" className="block md:table-cell text-right md:text-left p-2 md:p-4 before:content-[attr(data-label)] before:float-left before:font-bold md:before:content-none">{product.category}</TableCell>
              <TableCell data-label="Marca:" className="block md:table-cell text-right md:text-left p-2 md:p-4 before:content-[attr(data-label)] before:float-left before:font-bold md:before:content-none">{product.brand}</TableCell>
              <TableCell data-label="Estoque:" className="block md:table-cell text-right md:text-center p-2 md:p-4 before:content-[attr(data-label)] before:float-left before:font-bold md:before:content-none">
                {product.stock <= product.minStock ? (
                  <Badge variant="destructive">{product.stock}</Badge>
                ) : (
                  product.stock
                )}
              </TableCell>
              <TableCell className="block md:table-cell text-right md:text-center p-2 md:p-4">
                <div className="flex items-center justify-end md:justify-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(product)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Editar Produto</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onViewHistory(product.id)}>
                        <History className="h-4 w-4" />
                        <span className="sr-only">Histórico</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Ver Histórico</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onDelete(product.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                        <span className="sr-only">Excluir</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Excluir Produto</p>
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