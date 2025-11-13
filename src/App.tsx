import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Estoque from "./pages/Estoque";
import Fornecedores from "./pages/Fornecedores";
import PedidosCompra from "./pages/PedidosCompra";
import NovoPedidoCompra from "./pages/NovoPedidoCompra";
import Clientes from "./pages/Clientes";
import PedidosVenda from "./pages/PedidosVenda";
import NovoPedidoVenda from "./pages/NovoPedidoVenda";
import Mapa from "./pages/Mapa";
import Relatorios from "./pages/Relatorios";
import IAInsights from "./pages/IAInsights";
import Configuracoes from "./pages/Configuracoes";
import { Layout } from "./components/Layout";
import HistoricoCliente from "./pages/HistoricoCliente";
import { AppDataProvider } from "./context/AppDataContext";
import DetalhesPedidoVenda from "./pages/DetalhesPedidoVenda";
import DetalhesPedidoCompra from "./pages/DetalhesPedidoCompra";
import HistoricoProduto from "./pages/HistoricoProduto";
import OtimizacaoRotas from "./pages/OtimizacaoRotas"; // Importando a nova página

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppDataProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/estoque" element={<Estoque />} />
              <Route path="/estoque/:productId" element={<HistoricoProduto />} />
              <Route path="/compras/fornecedores" element={<Fornecedores />} />
              <Route path="/compras/pedidos" element={<PedidosCompra />} />
              <Route path="/compras/pedidos/novo" element={<NovoPedidoCompra />} />
              <Route path="/compras/pedidos/:orderId" element={<DetalhesPedidoCompra />} />
              <Route path="/vendas/clientes" element={<Clientes />} />
              <Route path="/vendas/clientes/:customerId" element={<HistoricoCliente />} />
              <Route path="/vendas/pedidos" element={<PedidosVenda />} />
              <Route path="/vendas/pedidos/novo" element={<NovoPedidoVenda />} />
              <Route path="/vendas/pedidos/:orderId" element={<DetalhesPedidoVenda />} />
              <Route path="/mapa" element={<Mapa />} />
              <Route path="/otimizacao-rotas" element={<OtimizacaoRotas />} /> {/* Nova rota */}
              <Route path="/relatorios" element={<Relatorios />} />
              <Route path="/ia-insights" element={<IAInsights />} />
              <Route path="/configuracoes" element={<Configuracoes />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppDataProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;