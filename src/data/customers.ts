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

export const mockCustomers: Customer[] = [
  { id: 'cust_1', name: 'Oficina do Zé', cpfCnpj: '44.555.666/0001-77', phone: '(21) 98888-7777', email: 'oficina.ze@email.com', address: 'Rua da Mecânica, 123, Rio de Janeiro, RJ', lat: -22.906847, lng: -43.172897 },
  { id: 'cust_2', name: 'Auto Center Veloz', cpfCnpj: '55.666.777/0001-88', phone: '(41) 97777-6666', email: 'contato@acveloz.com.br', address: 'Av. das Torres, 2000, Curitiba, PR', lat: -25.4372, lng: -49.2731 },
  { id: 'cust_3', name: 'Carlos Silva', cpfCnpj: '123.456.789-00', phone: '(51) 96666-5555', email: 'carlos.silva@email.com', address: 'Rua dos Andradas, 1500, Porto Alegre, RS', lat: -30.0346, lng: -51.2265 },
  { id: 'cust_4', name: 'Mariana Costa', cpfCnpj: '987.654.321-11', phone: '(71) 95555-4444', email: 'mari.costa@email.com', address: 'Av. Oceânica, 500, Salvador, BA', lat: -13.0068, lng: -38.5124 },
  { id: 'cust_5', name: 'Frota de Veículos Ltda', cpfCnpj: '66.777.888/0001-99', phone: '(81) 94444-3333', email: 'frota@logistica.com', address: 'Rodovia BR-101, 300, Recife, PE', lat: -8.0476, lng: -34.8772 },
];