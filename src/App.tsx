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
import Clientes from "./pages/Clientes";
import PedidosVenda from "./pages/PedidosVenda";
import Mapa from "./pages/Mapa";
import Relatorios from "./pages/Relatorios";
import Configuracoes from "./pages/Configuracoes";
import { Layout } from "./components/Layout";
import HistoricoCliente from "./pages/HistoricoCliente";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/estoque" element={<Estoque />} />
            <Route path="/compras/fornecedores" element={<Fornecedores />} />
            <Route path="/compras/pedidos" element={<PedidosCompra />} />
            <Route path="/vendas/clientes" element={<Clientes />} />
            <Route path="/vendas/clientes/:customerId" element={<HistoricoCliente />} />
            <Route path="/vendas/pedidos" element={<PedidosVenda />} />
            <Route path="/mapa" element={<Mapa />} />
            <Route path="/relatorios" element={<Relatorios />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;