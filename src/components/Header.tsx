import { Link, NavLink, useLocation } from "react-router-dom";
import {
  Menu, Wrench, Bell, CircleUser, LayoutDashboard, Package, ShoppingCart,
  ClipboardList, Map, BarChart3, Settings, Users, Truck, Sparkles, Route
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAppData } from "@/context/AppDataContext";
import { cn } from "@/lib/utils";

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
  { to: "/otimizacao-rotas", label: "Otimização de Rotas", Icon: Route },
  { to: "/relatorios", label: "Relatórios", Icon: BarChart3 },
  { to: "/ia-insights", label: "IA Insights", Icon: Sparkles },
  { to: "/configuracoes", label: "Configurações", Icon: Settings },
];

const MobileNavLink = ({ to, children }: { to: string, children: React.ReactNode }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        "flex items-center gap-4 rounded-lg px-3 py-3 text-muted-foreground transition-all hover:text-primary",
        isActive && "bg-muted text-primary"
      )
    }
  >
    {children}
  </NavLink>
);

export const Header = () => {
  const { notifications, markNotificationsAsRead, markSingleNotificationAsRead } = useAppData();
  const hasUnreadNotifications = notifications.some(n => !n.read);
  const location = useLocation();

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-card px-4 lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col bg-card p-0">
          <div className="flex h-16 items-center border-b px-4">
            <Link to="/" className="flex items-center gap-3 font-semibold">
              <Wrench className="h-7 w-7 text-primary" />
              <span className="text-xl">Autoparts</span>
            </Link>
          </div>
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="grid gap-2 text-base font-medium">
              {navItems.map((item) =>
                item.subItems ? (
                  <Accordion key={item.label} type="single" collapsible defaultValue={item.subItems.some(p => location.pathname.startsWith(p.to)) ? item.label : ""}>
                    <AccordionItem value={item.label} className="border-b-0">
                      <AccordionTrigger className="py-3 hover:no-underline rounded-lg px-3 [&[data-state=open]]:bg-muted">
                        <div className={cn("flex items-center gap-4 text-muted-foreground", { "text-primary": item.subItems.some(p => location.pathname.startsWith(p.to)) })}>
                          <item.Icon className="h-5 w-5" />
                          {item.label}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-1">
                        <div className="flex flex-col gap-1 pl-8">
                          {item.subItems.map((subItem) => (
                            <MobileNavLink key={subItem.to} to={subItem.to}>
                              <subItem.Icon className="h-5 w-5" />
                              {subItem.label}
                            </MobileNavLink>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ) : (
                  item.to && (
                    <MobileNavLink key={item.to} to={item.to}>
                      <item.Icon className="h-5 w-5" />
                      {item.label}
                    </MobileNavLink>
                  )
                )
              )}
            </div>
          </nav>
        </SheetContent>
      </Sheet>

      <div className="w-full flex-1" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="h-8 w-8 relative">
            <Bell className={cn("h-4 w-4", hasUnreadNotifications && "text-red-500 animate-bell-shake")} />
            {hasUnreadNotifications && (
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-card" />
            )}
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[350px]">
          <DropdownMenuLabel>Notificações</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {notifications.length > 0 ? (
            <>
              {notifications.slice(0, 5).map(notification => (
                <DropdownMenuItem key={notification.id} asChild className="cursor-pointer" onClick={() => markSingleNotificationAsRead(notification.id)}>
                  <Link to={notification.linkTo || '#'} className="flex flex-col items-start p-2">
                    <p className={cn("text-sm whitespace-normal", !notification.read && "font-semibold")}>{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(notification.createdAt).toLocaleString('pt-BR')}
                    </p>
                  </Link>
                </DropdownMenuItem>
              ))}
              {hasUnreadNotifications && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} onClick={markNotificationsAsRead} className="justify-center text-sm">
                    Marcar todas como lidas
                  </DropdownMenuItem>
                </>
              )}
            </>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">Nenhuma notificação</div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <CircleUser className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link to="/configuracoes">Configurações</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>Suporte</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Sair</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};