import { supabase } from "@/integrations/supabase/client";
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
  action?: Omit<InsightAction, 'Icon'>;
  errorMessage?: string;
}

export const generateInsight = async (type: InsightType): Promise<Omit<InsightResult, 'action'> & { action?: InsightAction }> => {
  const { data, error } = await supabase.functions.invoke('generate-insight', {
    body: { insightType: type },
  });

  if (error) {
    console.error("Erro ao invocar a edge function:", error);
    throw {
      status: 'error',
      errorMessage: 'Falha na comunicação com o serviço de IA. Tente novamente.',
    };
  }

  const result = data as InsightResult;
  
  if (result.status === 'error') {
    throw result;
  }

  // Adiciona o ícone de volta ao objeto de ação para que o componente possa renderizá-lo
  const resultWithIcon = { ...result };
  if (resultWithIcon.action) {
    (resultWithIcon as any).action.Icon = Link;
  }

  return resultWithIcon as Omit<InsightResult, 'action'> & { action?: InsightAction };
};