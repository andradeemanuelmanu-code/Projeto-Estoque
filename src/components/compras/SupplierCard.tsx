import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MapPin, Phone, Mail, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Supplier } from "@/data/suppliers";
import { cn } from "@/lib/utils";

interface SupplierCardProps {
  supplier: Supplier;
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplierId: string) => void;
}

export const SupplierCard = ({ supplier, onEdit, onDelete }: SupplierCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="space-y-1">
          <CardTitle>{supplier.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{supplier.cnpj}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={supplier.status === 'Ativo' ? 'default' : 'destructive'} className={cn(supplier.status === 'Ativo' && 'bg-green-500')}>{supplier.status}</Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(supplier)}><Pencil className="mr-2 h-4 w-4" /> Editar</DropdownMenuItem>
              <DropdownMenuItem className="text-red-500" onClick={() => onDelete(supplier.id)}><Trash2 className="mr-2 h-4 w-4" /> Excluir</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4" /> <span>{supplier.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="h-4 w-4" /> <span>{supplier.phone}</span>
        </div>
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mt-0.5 shrink-0" /> <span>{supplier.address}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Link to={`/mapa?selectedId=${supplier.id}`} className="w-full">
          <Button variant="outline" className="w-full">
            <MapPin className="mr-2 h-4 w-4" /> Ver no Mapa
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};