import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Product } from "@/types/Product";
import { ProductHistoryTable } from "./ProductHistoryTable";

type Movement = {
  date: Date;
  type: 'Entrada' | 'Saída';
  document: string;
  documentId: string;
  documentType: 'purchase' | 'sales';
  quantity: number;
  balance: number;
};

interface ProductHistoryModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  product: Product | null;
  movements: Movement[];
}

export const ProductHistoryModal = ({ isOpen, onOpenChange, product, movements }: ProductHistoryModalProps) => {
  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-3xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Histórico do Produto</DialogTitle>
          <DialogDescription>Movimentações de entrada e saída do estoque.</DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto pr-4">
          <Card className="mb-6">
            <CardHeader>
              <DialogTitle>{product.description}</DialogTitle>
              <DialogDescription>Código: {product.code}</DialogDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-3 gap-4">
              <div className="text-sm"><span className="font-semibold text-muted-foreground">Categoria:</span> {product.category}</div>
              <div className="text-sm"><span className="font-semibold text-muted-foreground">Marca:</span> {product.brand}</div>
              <div className="text-sm"><span className="font-semibold text-muted-foreground">Estoque Atual:</span> {product.stock}</div>
            </CardContent>
          </Card>
          <ProductHistoryTable movements={movements} />
        </div>
      </DialogContent>
    </Dialog>
  );
};