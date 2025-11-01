import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MapPin, Phone, Mail, MoreVertical, Pencil, Trash2, History } from "lucide-react";
import { Customer } from "@/data/customers";

interface CustomerCardProps {
  customer: Customer;
  onEdit: (customer: Customer) => void;
  onDelete: (customerId: string) => void;
}

export const CustomerCard = ({ customer, onEdit, onDelete }: CustomerCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="space-y-1">
          <CardTitle>{customer.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{customer.cpfCnpj}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(customer)}><Pencil className="mr-2 h-4 w-4" /> Editar</DropdownMenuItem>
            <DropdownMenuItem className="text-red-500" onClick={() => onDelete(customer.id)}><Trash2 className="mr-2 h-4 w-4" /> Excluir</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground"><Mail className="h-4 w-4" /> <span>{customer.email}</span></div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground"><Phone className="h-4 w-4" /> <span>{customer.phone}</span></div>
        <div className="flex items-start gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4 mt-0.5 shrink-0" /> <span>{customer.address}</span></div>
      </CardContent>
      <CardFooter>
        <Link to={`/vendas/clientes/${customer.id}`} className="w-full">
          <Button variant="outline" className="w-full"><History className="mr-2 h-4 w-4" /> Ver Histórico</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};