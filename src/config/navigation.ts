import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  ClipboardList,
  Map,
  BarChart3,
  Settings,
  Users,
  Truck,
  Sparkles,
  Route,
  Bot,
} from "lucide-react";

export type NavItemType = {
  to?: string;
  label: string;
  Icon: React.ElementType;
  type: 'main' | 'footer';
  subItems?: {
    to: string;
    label: string;
    Icon: React.ElementType;
  }[];
};

export const navigationConfig: NavItemType[] = [
  { to: "/", label: "Dashboard", Icon: LayoutDashboard, type: 'main' },
  { to: "/estoque", label: "Estoque", Icon: Package, type: 'main' },
  {
    label: "Vendas",
    Icon: ShoppingCart,
    type: 'main',
    subItems: [
      { to: "/vendas/clientes", label: "Clientes", Icon: Users },
      { to: "/vendas/pedidos", label: "Pedidos de Venda", Icon: ClipboardList },
    ],
  },
  {
    label: "Compras",
    Icon: ClipboardList,
    type: 'main',
    subItems: [
      { to: "/compras/fornecedores", label: "Fornecedores", Icon: Users },
      { to: "/compras/pedidos", label: "Pedidos de Compra", Icon: Truck },
    ],
  },
  { to: "/mapa", label: "Mapa Interativo", Icon: Map, type: 'main' },
  { to: "/otimizacao-rotas", label: "Otimização de Rotas", Icon: Route, type: 'main' },
  { to: "/relatorios", label: "Relatórios", Icon: BarChart3, type: 'main' },
  { to: "/ia-insights", label: "IA Insights", Icon: Sparkles, type: 'main' },
  { to: "/falar-com-deus", label: "Falar com Deus", Icon: Bot, type: 'main' },
  { to: "/configuracoes", label: "Configurações", Icon: Settings, type: 'footer' },
];