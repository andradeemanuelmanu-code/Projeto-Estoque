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
import { Supplier } from "@/data/suppliers";
import { Product } from "@/data/products";
import { showError } from "@/utils/toast";

const orderItemSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  quantity: z.coerce.number().int().min(1),
  unitPrice: z.coerce.number().min(0.01, "O preço deve ser maior que zero."),
});

const purchaseOrderSchema = z.object({
  supplierId: z.string().min(1, "Selecione um fornecedor."),
  items: z.array(orderItemSchema).min(1, "O pedido deve ter pelo menos um item."),
});

type PurchaseOrderFormData = z.infer<typeof purchaseOrderSchema>;

interface PurchaseOrderFormProps {
  suppliers: Supplier[];
  products: Product[];
  onSubmit: (data: PurchaseOrderFormData) => void;
  onCancel: () => void;
}

export const PurchaseOrderForm = ({ suppliers, products, onSubmit, onCancel }: PurchaseOrderFormProps) => {
  const form = useForm<PurchaseOrderFormData>({
    resolver: zodResolver(purchaseOrderSchema),
    defaultValues: { supplierId: "", items: [] },
  });

  const { control, watch } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const [currentItem, setCurrentItem] = useState({ productId: "", quantity: "1", unitPrice: "" });

  const handleAddItem = () => {
    const product = products.find(p => p.id === currentItem.productId);
    const quantity = parseInt(currentItem.quantity, 10);
    const unitPrice = parseFloat(currentItem.unitPrice);

    if (!product || !quantity || quantity <= 0 || !unitPrice || unitPrice <= 0) {
      showError("Selecione um produto e informe quantidade e custo válidos.");
      return;
    }
    if (fields.some(field => field.productId === product.id)) {
      showError("Este produto já foi adicionado ao pedido.");
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
              name="supplierId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fornecedor</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Selecione um fornecedor" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
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
                    {products.map(p => <SelectItem key={p.id} value={p.id}>{p.description}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FormItem>
              <FormItem>
                <FormLabel>Quantidade</FormLabel>
                <Input type="number" value={currentItem.quantity} onChange={e => setCurrentItem(prev => ({ ...prev, quantity: e.target.value }))} className="w-24" />
              </FormItem>
              <FormItem>
                <FormLabel>Custo Unit.</FormLabel>
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
                    <TableHead className="w-[120px] text-right">Custo Unit.</TableHead>
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