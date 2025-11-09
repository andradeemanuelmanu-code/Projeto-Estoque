import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, PlusCircle } from "lucide-react";
import { Customer } from "@/data/customers";
import { Product } from "@/data/products";
import { showError } from "@/utils/toast";

const orderItemSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  quantity: z.coerce.number().int().min(1),
  unitPrice: z.coerce.number().min(0.01, "O preço deve ser maior que zero."),
});

const salesOrderSchema = z.object({
  customerId: z.string().min(1, "Selecione um cliente."),
  items: z.array(orderItemSchema).min(1, "O pedido deve ter pelo menos um item."),
});

type SalesOrderFormData = z.infer<typeof salesOrderSchema>;

interface SalesOrderFormProps {
  customers: Customer[];
  products: Product[];
  onSubmit: (data: SalesOrderFormData) => void;
  onCancel: () => void;
}

export const SalesOrderForm = ({ customers, products, onSubmit, onCancel }: SalesOrderFormProps) => {
  const form = useForm<SalesOrderFormData>({
    resolver: zodResolver(salesOrderSchema),
    defaultValues: { customerId: "", items: [] },
  });

  const { control, watch } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const [currentItem, setCurrentItem] = useState({ productId: "", quantity: "1", unitPrice: "" });

  const handleAddItem = () => {
    const product = products.find(p => p.id === currentItem.productId);
    const quantity = parseInt(currentItem.quantity, 10);
    const unitPrice = parseFloat(currentItem.unitPrice);

    if (!product || !quantity || quantity <= 0 || !unitPrice || unitPrice <= 0) {
      showError("Selecione um produto e informe quantidade e preço válidos.");
      return;
    }
    if (fields.some(field => field.productId === product.id)) {
      showError("Este produto já foi adicionado ao pedido.");
      return;
    }
    if (quantity > product.stock) {
      showError(`Estoque insuficiente para ${product.description}. Disponível: ${product.stock}`);
      return;
    }

    append({
      productId: product.id,
      productName: product.description,
      quantity: quantity,
      unitPrice: unitPrice,
    });
    setCurrentItem({ productId: "", quantity: "1", unitPrice: "" });
  };

  const orderItems = watch("items");
  const totalValue = orderItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Informações do Pedido</CardTitle></CardHeader>
          <CardContent>
            <FormField
              control={control}
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Selecione um cliente" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Itens do Pedido</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 mb-4">
              <FormItem className="flex-1">
                <FormLabel>Produto</FormLabel>
                <Select value={currentItem.productId} onValueChange={val => setCurrentItem(prev => ({ ...prev, productId: val }))}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Selecione um produto" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {products.map(p => <SelectItem key={p.id} value={p.id}>{p.description} (Estoque: {p.stock})</SelectItem>)}
                  </SelectContent>
                </Select>
              </FormItem>
              <FormItem>
                <FormLabel>Quantidade</FormLabel>
                <Input type="number" value={currentItem.quantity} onChange={e => setCurrentItem(prev => ({ ...prev, quantity: e.target.value }))} className="w-24" />
              </FormItem>
              <FormItem>
                <FormLabel>Preço Unit.</FormLabel>
                <Input type="number" placeholder="R$ 0,00" value={currentItem.unitPrice} onChange={e => setCurrentItem(prev => ({ ...prev, unitPrice: e.target.value }))} className="w-28" />
              </FormItem>
              <Button type="button" onClick={handleAddItem}><PlusCircle className="h-4 w-4 mr-2" /> Adicionar</Button>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead className="w-[100px]">Qtd.</TableHead>
                    <TableHead className="w-[120px] text-right">Preço Unit.</TableHead>
                    <TableHead className="w-[120px] text-right">Subtotal</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.length > 0 ? fields.map((field, index) => (
                    <TableRow key={field.id}>
                      <TableCell>{field.productName}</TableCell>
                      <TableCell>{field.quantity}</TableCell>
                      <TableCell className="text-right">{field.unitPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                      <TableCell className="text-right">{(field.quantity * field.unitPrice).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                      <TableCell>
                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )) : <TableRow><TableCell colSpan={5} className="text-center">Nenhum item adicionado.</TableCell></TableRow>}
                </TableBody>
              </Table>
            </div>
            <div className="text-right font-bold text-lg mt-4">
              Total do Pedido: {totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button type="submit">Salvar Pedido</Button>
        </div>
      </form>
    </Form>
  );
};