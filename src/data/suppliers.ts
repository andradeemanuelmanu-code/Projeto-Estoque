export type Supplier = {
  id: string;
  name: string;
  cnpj: string;
  phone: string;
  email: string;
  address: string;
  status: "Ativo" | "Inativo";
};

export const mockSuppliers: Supplier[] = [
  { id: 'sup_001', name: 'Distribuidora de Peças São Paulo', cnpj: '12.345.678/0001-99', phone: '(11) 98765-4321', email: 'contato@distribuidorasp.com', address: 'Rua das Peças, 123, São Paulo, SP', status: 'Ativo' },
  { id: 'sup_002', name: 'Autopeças Rio', cnpj: '98.765.432/0001-11', phone: '(21) 91234-5678', email: 'vendas@autopecasrio.com', address: 'Avenida Brasil, 456, Rio de Janeiro, RJ', status: 'Ativo' },
  { id: 'sup_003', name: 'Fornecedora Minas Parts', cnpj: '45.678.912/0001-33', phone: '(31) 99999-8888', email: 'compras@minasparts.com', address: 'Rua dos Motores, 789, Belo Horizonte, MG', status: 'Inativo' },
];