import { Link } from 'lucide-react';

export type InsightType = 'demand' | 'crossSell' | 'supplier';

export interface InsightAction {
  text: string;
  link: string;
  Icon: React.ElementType;
}

export interface InsightResult {
  status: 'success' | 'no_insight' | 'error';
  content?: {
    main: string;
    recommendation: string;
  };
  action?: InsightAction;
  errorMessage?: string;
}

const mockInsights: Record<InsightType, Omit<InsightResult, 'status'>> = {
  demand: {
    content: {
      main: 'Com base nas tendências de vendas históricas e sazonalidade, prevemos que a demanda por "Vela de Ignição Laser Iridium" aumentará em 15% no próximo mês.',
      recommendation: 'Aumentar o pedido de compra em 20 unidades para evitar ruptura de estoque.',
    },
    action: {
      text: 'Ver Produto no Estoque',
      link: '/estoque/prod_1',
      Icon: Link,
    },
  },
  crossSell: {
    content: {
      main: 'Clientes que compram "Pastilha de Freio Dianteira" frequentemente também compram "Filtro de Óleo do Motor".',
      recommendation: 'Oferecer um desconto de 5% na compra conjunta desses itens.',
    },
    action: {
      text: 'Analisar Produto',
      link: '/estoque/prod_2',
      Icon: Link,
    },
  },
  supplier: {
    content: {
      main: 'O fornecedor "Fornecedora Minas Parts" está atualmente com status Inativo.',
      recommendation: 'Buscar fornecedores alternativos para os produtos que eram fornecidos por eles para garantir a continuidade do estoque.',
    },
    action: {
      text: 'Ver Fornecedor no Mapa',
      link: '/mapa?selectedId=sup_2',
      Icon: Link,
    },
  },
};

export const generateInsight = (type: InsightType): Promise<InsightResult> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const random = Math.random();
      if (random < 0.7) { // 70% chance of success
        resolve({
          status: 'success',
          ...mockInsights[type],
        });
      } else if (random < 0.9) { // 20% chance of no insight
        resolve({
          status: 'no_insight',
        });
      } else { // 10% chance of error
        reject({
          status: 'error',
          errorMessage: 'Ocorreu um erro ao analisar os dados. Tente novamente.',
        });
      }
    }, 2000); // Simula o tempo de processamento da IA
  });
};