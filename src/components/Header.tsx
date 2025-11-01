import { Link } from "react-router-dom";
import { Menu, Car, Bell, CircleUser } from "lucide-react";
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
import { useAppData } from "@/context/AppDataContext";
import { cn } from "@/lib/utils";

const navItems = [
    { to: "/", label: "Dashboard" },
    { to: "/estoque", label: "Estoque" },
    { to: "/vendas/pedidos", label: "Vendas" },
    { to: "/compras/pedidos", label: "Compras" },
    { to: "/relatorios", label: "Relatórios" },
    { to: "/mapa", label: "Mapa" },
];

export const Header = () => {
  const { notifications, markNotificationsAsRead } = useAppData();
  const hasUnreadNotifications = notifications.some(n => !n.read);

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col bg-card">
          <nav className="grid gap-2 text-lg font-medium">
            <Link to="/" className="flex items-center gap-2 text-lg font-semibold mb-4">
              <Car className="h-6 w-6 text-primary" />
              <span className="text-foreground">Autoparts</span>
            </Link>
            {navItems.map(item => (
                <Link key={item.label} to={item.to} className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground">
                    {item.label}
                </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      <div className="w-full flex-1" />

      <DropdownMenu onOpenChange={(open) => { if (open && hasUnreadNotifications) markNotificationsAsRead(); }}>
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
            notifications.slice(0, 5).map(notification => (
              <DropdownMenuItem key={notification.id} asChild className="cursor-pointer">
                <Link to={notification.linkTo || '#'} className="flex flex-col items-start p-2">
                  <p className={cn("text-sm whitespace-normal", !notification.read && "font-semibold")}>{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(notification.createdAt).toLocaleString('pt-BR')}
                  </p>
                </Link>
              </DropdownMenuItem>
            ))
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