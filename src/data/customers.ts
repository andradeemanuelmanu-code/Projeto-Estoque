export type Customer = {
  id: string;
  name: string;
  cpfCnpj: string;
  phone: string;
  email: string;
  address: string;
  lat: number;
  lng: number;
};

export const mockCustomers: Customer[] = [];