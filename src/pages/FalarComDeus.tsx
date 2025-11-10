import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Sparkles, Bot } from "lucide-react";
import { ChatMessage, Message } from "@/components/chat/ChatMessage";
import { useAppData } from "@/context/AppDataContext";
import { AppDataContextType } from "@/context/AppDataContext";

const getAIResponse = (message: string, context: AppDataContextType): string => {
  const lowerCaseMessage = message.toLowerCase();

  // Data analysis queries
  if (lowerCaseMessage.includes("peças") && lowerCaseMessage.includes("estoque")) {
    const totalStock = context.products.reduce((acc, p) => acc + p.stock, 0);
    return `Atualmente, você tem um total de ${totalStock.toLocaleString('pt-BR')} peças em estoque.`;
  }

  if (lowerCaseMessage.includes("faturamento") && (lowerCaseMessage.includes("mês") || lowerCaseMessage.includes("mensal"))) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyRevenue = context.salesOrders
      .filter(order => {
        const orderDate = new Date(order.date);
        return order.status === 'Faturado' && orderDate >= startOfMonth;
      })
      .reduce((acc, order) => acc + order.totalValue, 0);
    return `O faturamento deste mês até o momento é de ${monthlyRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}.`;
  }

  if (lowerCaseMessage.includes("baixo giro") || (lowerCaseMessage.includes("estoque baixo"))) {
    const lowStockProducts = context.products.filter(p => p.stock <= p.minStock);
    if (lowStockProducts.length === 0) {
      return "Ótima notícia! Nenhum produto está abaixo do estoque mínimo no momento.";
    }
    const productList = lowStockProducts.map(p => `- ${p.description} (Estoque: ${p.stock})`).join('\n');
    return `Encontrei ${lowStockProducts.length} produtos com estoque baixo:\n${productList}\n\nRecomendo criar pedidos de compra para reabastecer.`;
  }
  
  if (lowerCaseMessage.includes("lucro")) {
      return "Atualmente, consigo calcular o faturamento total, mas não tenho dados de custos detalhados por produto para calcular o lucro líquido com precisão. Para análises mais profundas como essa, recomendo integrar o sistema a uma base de dados mais robusta.";
  }

  // System help queries
  if (lowerCaseMessage.includes("otimização de rotas")) {
    return "O módulo 'Otimização de Rotas' permite que você selecione múltiplos clientes e gere a rota mais eficiente para visitá-los, economizando tempo e combustível. Ele usa sua localização atual como ponto de partida e retorno.";
  }
  
  if (lowerCaseMessage.includes("ia insights")) {
      return "A página 'IA Insights' oferece análises preditivas geradas por inteligência artificial, como previsão de demanda, oportunidades de venda cruzada e análise de risco de fornecedores, para ajudar na tomada de decisões estratégicas.";
  }

  // Default response for other questions
  return "Essa é uma pergunta interessante! No momento, meu conhecimento é focado em te ajudar com a gestão da sua loja, então não tenho a resposta para isso. Mas estou sempre aprendendo! Quer tentar outra pergunta sobre suas vendas ou estoque?";
};


const FalarComDeus = () => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: "Olá! Sou seu assistente de gestão. Como posso ajudar a analisar os dados da sua loja hoje?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const appData = useAppData();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (input.trim() === "" || isLoading) return;

    const userMessage: Message = { sender: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    setTimeout(() => {
      const aiResponseText = getAIResponse(userMessage.text, appData);
      const aiMessage: Message = { sender: 'ai', text: aiResponseText };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500); // Simulate typing delay
  };

  return (
    <div className="flex flex-col h-[calc(100vh-60px)] bg-slate-800 text-white">
      <header className="flex items-center justify-center p-4 border-b border-slate-700">
        <Sparkles className="h-6 w-6 text-yellow-400" />
        <h1 className="ml-2 text-xl font-semibold">Falar com Deus</h1>
      </header>
      
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))}
          {isLoading && (
            <div className="flex items-start gap-4 p-4 justify-start">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Bot className="h-6 w-6" />
              </div>
              <div className="max-w-md rounded-lg px-4 py-3 text-sm bg-muted text-foreground flex items-center">
                <span className="animate-pulse">Digitando...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-slate-700">
        <div className="relative">
          <Input
            type="text"
            placeholder="Digite sua pergunta..."
            className="bg-slate-700 border-slate-600 text-white pr-12"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={handleSendMessage}
            disabled={isLoading || input.trim() === ""}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FalarComDeus;