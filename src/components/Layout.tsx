import { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useSession } from "@/context/SessionContext";
import { useAppData } from "@/context/AppDataContext";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const Layout = () => {
  const { session, loading: authLoading } = useSession();
  const { loading: dataLoading } = useAppData();
  const navigate = useNavigate();
  const location = useLocation();

  const isMapPage = location.pathname.startsWith('/mapa') || location.pathname.startsWith('/otimizacao-rotas');

  useEffect(() => {
    if (!authLoading && !session) {
      navigate("/login", { replace: true });
    }
  }, [session, authLoading, navigate]);

  if (authLoading || dataLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return null; // or a loading spinner, but useEffect will redirect
  }

  return (
    <div className="grid h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col overflow-hidden">
        <Header />
        <main className={cn(
          "flex flex-1 flex-col bg-background",
          isMapPage 
            ? "overflow-hidden" 
            : "gap-4 p-4 lg:gap-6 lg:p-6 overflow-y-auto"
        )}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};