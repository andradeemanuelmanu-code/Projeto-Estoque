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

export const mockSuppliers: Supplier[] = [
  { id: 'sup_1', name: 'Distribuidora Autopeças Brasil', cnpj: '11.222.333/0001-44', phone: '(11) 98765-4321', email: 'contato@autopeçasbrasil.com', address: 'Av. Industrial, 1000, São Paulo, SP', status: 'Ativo', lat: -23.550520, lng: -46.633308 },
  { id: 'sup_2', name: 'Fornecedora Minas Parts', cnpj: '22.333.444/0001-55', phone: '(31) 91234-5678', email: 'vendas@minasparts.com', address: 'Rua dos Fornecedores, 50, Belo Horizonte, MG', status: 'Inativo', lat: -19.916681, lng: -43.934493 },
  { id: 'sup_3', name: 'SP Peças Automotivas', cnpj: '33.444.555/0001-66', phone: '(19) 95678-1234', email: 'comercial@sppecas.com', address: 'Rod. Anhanguera, km 100, Campinas, SP', status: 'Ativo', lat: -22.906847, lng: -47.061630 },
];