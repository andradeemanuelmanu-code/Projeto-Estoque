import { useState, useMemo } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X } from "lucide-react";
import { useAppData } from "@/context/AppDataContext";
import { Link } from 'react-router-dom';

export const GlobalStockAlert = () => {
  const { products } = useAppData();
  const [isVisible, setIsVisible] = useState(true);

  const lowStockProducts = useMemo(() => {
    return products.filter(p => p.stock <= p.minStock);
  }, [products]);

  if (lowStockProducts.length === 0 || !isVisible) {
    return null;
  }

  const productNames = lowStockProducts.map(p => p.description).slice(0, 2).join(', ');
  const remainingCount = lowStockProducts.length > 2 ? lowStockProducts.length - 2 : 0;

  return (
    <Alert variant="destructive" className="relative mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Alerta de Estoque Baixo!</AlertTitle>
        <AlertDescription>
            <p>
                {productNames}{remainingCount > 0 ? ` e mais ${remainingCount} produto(s)` : ''} estão com estoque baixo.
            </p>
            <Button asChild variant="link" className="p-0 h-auto mt-1 text-destructive hover:text-destructive/80">
                <Link to="/estoque">Verificar estoque agora.</Link>
            </Button>
        </AlertDescription>
        <button 
            onClick={() => setIsVisible(false)} 
            className="absolute top-2 right-2 p-1 rounded-md hover:bg-destructive/20"
        >
            <X className="h-4 w-4" />
            <span className="sr-only">Fechar alerta</span>
        </button>
    </Alert>
  );
};