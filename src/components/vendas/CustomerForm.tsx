import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Customer } from "@/data/customers";

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório."),
  cpfCnpj: z.string().min(1, "CPF/CNPJ é obrigatório."),
  email: z.string().email("Email inválido."),
  phone: z.string().min(1, "Telefone é obrigatório."),
  address: z.string().min(1, "Endereço é obrigatório."),
  lat: z.coerce.number(),
  lng: z.coerce.number(),
});

interface CustomerFormProps {
  customer: Omit<Customer, 'id'> | null;
  onSubmit: (data: Omit<Customer, 'id'>) => void;
  onCancel: () => void;
}

export const CustomerForm = ({ customer, onSubmit, onCancel }: CustomerFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: customer?.name || "",
      cpfCnpj: customer?.cpfCnpj || "",
      email: customer?.email || "",
      phone: customer?.phone || "",
      address: customer?.address || "",
      lat: customer?.lat || 0,
      lng: customer?.lng || 0,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem><FormLabel>Nome / Razão Social</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="cpfCnpj" render={({ field }) => (
          <FormItem><FormLabel>CPF / CNPJ</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="phone" render={({ field }) => (
          <FormItem><FormLabel>Telefone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="address" render={({ field }) => (
          <FormItem><FormLabel>Endereço</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="lat" render={({ field }) => (
            <FormItem><FormLabel>Latitude</FormLabel><FormControl><Input type="number" step="any" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="lng" render={({ field }) => (
            <FormItem><FormLabel>Longitude</FormLabel><FormControl><Input type="number" step="any" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </Form>
  );
};