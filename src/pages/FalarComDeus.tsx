"use client";

import { useState } from "react";
import { FalarComDeusUI, Message } from "@/components/chat/FalarComDeusUI";
import { v4 as uuidv4 } from 'uuid';

const FalarComDeus = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: uuidv4(),
      text: "Olá! Sou 'Deus', seu consultor especialista em gestão de autopeças. Como posso ajudá-lo a otimizar seu negócio hoje?",
      sender: 'ai',
    }
  ]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: uuidv4(),
      text,
      sender: 'user',
    };
    setMessages(prev => [...prev, userMessage]);

    // Simula a resposta da IA
    setTimeout(() => {
      const aiResponse: Message = {
        id: uuidv4(),
        text: getSimulatedResponse(text),
        sender: 'ai',
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1500);
  };

  const getSimulatedResponse = (question: string): string => {
    const lowerCaseQuestion = question.toLowerCase();
    if (lowerCaseQuestion.includes("lucro") && lowerCaseQuestion.includes("10%")) {
      return "Excelente pergunta. Para simular um aumento de 10% nas vendas, vamos considerar alguns pontos:\n\n1.  **Receita Atual:** Supondo um faturamento mensal de R$ 45.000, um aumento de 10% resultaria em R$ 49.500.\n2.  **Custo de Mercadoria Vendida (CMV):** Se sua margem bruta é de 40%, seu CMV é de 60%. O novo CMV seria de R$ 29.700.\n3.  **Despesas Fixas:** Assumindo que suas despesas fixas (aluguel, salários) de R$ 8.000 não mudem.\n\n**Cálculo:**\n*   Lucro Bruto: R$ 49.500 - R$ 29.700 = R$ 19.800\n*   Lucro Líquido: R$ 19.800 - R$ 8.000 = **R$ 11.800**\n\nIsso representaria um aumento significativo no seu lucro líquido. Para alcançar isso, podemos focar em estratégias de marketing para clientes recorrentes.";
    }
    if (lowerCaseQuestion.includes("giro") && lowerCaseQuestion.includes("estoque")) {
        return "Para melhorar o giro de estoque, sugiro três estratégias principais:\n\n1.  **Análise da Curva ABC:** Identifique os produtos 'A' (maior faturamento) e garanta que nunca faltem. Para os produtos 'C' (menor saída), considere promoções ou compras sob demanda para evitar capital parado.\n2.  **Promoções de Combo:** Crie ofertas combinadas, como 'troca de óleo + filtro com 10% de desconto'. Isso aumenta o ticket médio e movimenta itens que talvez venderiam menos sozinhos.\n3.  **Negociação com Fornecedores:** Converse com seus fornecedores sobre a possibilidade de pedidos menores e mais frequentes. Isso reduz o risco de excesso de estoque e melhora o fluxo de caixa.";
    }
    if (lowerCaseQuestion.includes("oportunidades") || lowerCaseQuestion.includes("mercado")) {
        return "O mercado de autopeças está sempre evoluindo. Algumas oportunidades interessantes são:\n\n*   **Especialização:** Foque em um nicho específico, como veículos importados ou uma linha de performance. Isso pode atrair um público qualificado.\n*   **Serviços Agregados:** Além de vender peças, ofereça pequenos serviços de instalação ou diagnóstico em parceria com mecânicos locais. Isso agrega valor e fideliza clientes.\n*   **Presença Online:** Crie um catálogo online simples no WhatsApp Business ou Instagram para que as oficinas parceiras possam consultar seu estoque e fazer pedidos rapidamente.";
    }
    return "Entendido. Analisando os dados... Com base nas melhores práticas do setor, recomendo focar na otimização do seu capital de giro. Podemos começar revisando os prazos de pagamento com fornecedores e os prazos de recebimento dos clientes. Qual desses pontos você gostaria de explorar primeiro?";
  };

  return <FalarComDeusUI messages={messages} onSendMessage={handleSendMessage} />;
};

export default FalarComDeus;