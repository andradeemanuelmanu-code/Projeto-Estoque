import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  ClipboardList,
  Map,
  BarChart3,
  Settings,
  Car,
  Users,
  Truck,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const navItems = [
  { to: "/", label: "Dashboard", Icon: LayoutDashboard },
  { to: "/estoque", label: "Estoque", Icon: Package },
  {
    label: "Vendas",
    Icon: ShoppingCart,
    subItems: [
      { to: "/vendas/clientes", label: "Clientes", Icon: Users },
      { to: "/vendas/pedidos", label: "Pedidos de Venda", Icon: ClipboardList },
    ],
  },
  {
    label: "Compras",
    Icon: ClipboardList,
    subItems: [
      { to: "/compras/fornecedores", label: "Fornecedores", Icon: Users },
      { to: "/compras/pedidos", label: "Pedidos de Compra", Icon: Truck },
    ],
  },
  { to: "/mapa", label: "Mapa Interativo", Icon: Map },
  { to: "/relatorios", label: "Relatórios", Icon: BarChart3 },
  { to: "/ia-insights", label: "IA Insights", Icon: Sparkles },
  { to: "/configuracoes", label: "Configurações", Icon: Settings },
];

const NavItem = ({ to, label, Icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
        isActive && "bg-muted text-primary"
      )
    }
  >
    <Icon className="h-4 w-4" />
    {label}
  </NavLink>
);

export const Sidebar = () => {
  const location = useLocation();
  
  return (
    <div className="hidden border-r bg-card md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <NavLink to="/" className="flex items-center gap-2 font-semibold">
            <Car className="h-6 w-6 text-primary" />
            <span className="">Autoparts</span>
          </NavLink>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map((item) =>
              item.subItems ? (
                <Accordion key={item.label} type="single" collapsible defaultValue={item.subItems.some(p => location.pathname.startsWith(p.to)) ? item.label : ""}>
                  <AccordionItem value={item.label} className="border-b-0">
                    <AccordionTrigger className="py-2 hover:no-underline rounded-lg px-3 [&[data-state=open]]:bg-muted">
                      <div className={cn("flex items-center gap-3 text-muted-foreground", { "text-primary": item.subItems.some(p => location.pathname.startsWith(p.to)) })}>
                        <item.Icon className="h-4 w-4" />
                        {item.label}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-1">
                      <div className="flex flex-col gap-1 pl-7">
                        {item.subItems.map((subItem) => (
                          <NavItem key={subItem.label} {...subItem} />
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ) : (
                <NavItem key={item.label} {...item} />
              )
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};