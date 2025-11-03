import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product } from "@/data/products";

const formSchema = z.object({
  code: z.string().min(1, "Código é obrigatório."),
  description: z.string().min(1, "Descrição é obrigatória."),
  category: z.string().min(1, "Categoria é obrigatória."),
  brand: z.string().min(1, "Marca é obrigatória."),
  costPrice: z.coerce.number().min(0, "Preço de custo deve ser positivo."),
  salePrice: z.coerce.number().min(0, "Preço de venda deve ser positivo."),
  minStock: z.coerce.number().int().min(0, "Estoque mínimo deve ser positivo."),
  maxStock: z.coerce.number().int().min(0, "Estoque máximo deve ser positivo."),
});

interface ProductFormProps {
  product: Product | null;
  onSubmit: (data: Omit<Product, 'id' | 'stock'>) => void;
  onCancel: () => void;
}

export const ProductForm = ({ product, onSubmit, onCancel }: ProductFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: product?.code || "",
      description: product?.description || "",
      category: product?.category || "",
      brand: product?.brand || "",
      costPrice: product?.costPrice || 0,
      salePrice: product?.salePrice || 0,
      minStock: product?.minStock || 0,
      maxStock: product?.maxStock || 0,
    },
  });

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values as Omit<Product, 'id' | 'stock'>);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
        <Tabs defaultValue="basic">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
            <TabsTrigger value="pricing">Preços e Estoque</TabsTrigger>
          </TabsList>
          <TabsContent value="basic" className="space-y-4 pt-4">
            <FormField control={form.control} name="code" render={({ field }) => (
              <FormItem>
                <FormLabel>Código</FormLabel>
                <FormControl><Input placeholder="Ex: NGK-BKR6E" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl><Input placeholder="Ex: Vela de Ignição" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="category" render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <FormControl><Input placeholder="Ex: Ignição" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="brand" render={({ field }) => (
              <FormItem>
                <FormLabel>Marca</FormLabel>
                <FormControl><Input placeholder="Ex: NGK" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </TabsContent>
          <TabsContent value="pricing" className="space-y-4 pt-4">
            <FormField control={form.control} name="costPrice" render={({ field }) => (
              <FormItem>
                <FormLabel>Preço de Custo</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="salePrice" render={({ field }) => (
              <FormItem>
                <FormLabel>Preço de Venda</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="minStock" render={({ field }) => (
              <FormItem>
                <FormLabel>Estoque Mínimo</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="maxStock" render={({ field }) => (
              <FormItem>
                <FormLabel>Estoque Máximo</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </TabsContent>
        </Tabs>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </Form>
  );
};