export type Supplier = {
  id: string;
  name: string;
  cnpj: string;
  phone: string;
  email: string;
  address: string;
  status: "Ativo" | "Inativo";
  lat: number;
  lng: number;
};

export const mockSuppliers: Supplier[] = [];