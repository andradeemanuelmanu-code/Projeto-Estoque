import { useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { showSuccess } from "@/utils/toast";

const Configuracoes = () => {
  const { setTheme, theme } = useTheme();
  
  const [companyName, setCompanyName] = useState("Autoparts LTDA");
  const [cnpj, setCnpj] = useState("00.000.000/0001-00");

  const [newOrderNotifications, setNewOrderNotifications] = useState(true);

  const [lowStockAlerts, setLowStockAlerts] = useState(() => {
    const saved = localStorage.getItem('user_settings_enableStockAlerts');
    return saved !== 'false'; // Default to true if not set or is 'true'
  });

  const handleProfileSave = () => {
    showSuccess("Perfil da empresa atualizado com sucesso!");
  };

  const handleLowStockChange = (checked: boolean) => {
    setLowStockAlerts(checked);
    localStorage.setItem('user_settings_enableStockAlerts', String(checked));
    showSuccess(`Alertas de estoque baixo ${checked ? 'ativados' : 'desativados'}.`);
  };

  const handleNewOrderChange = (checked: boolean) => {
    setNewOrderNotifications(checked);
    showSuccess(`Notificações de novos pedidos ${checked ? 'ativadas' : 'desativadas'}.`);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl text-foreground">Configurações</h1>
      </div>
      <div className="grid gap-6 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Perfil da Empresa</CardTitle>
            <CardDescription>Atualize as informações da sua empresa.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Nome da Empresa</Label>
              <Input 
                id="company-name" 
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input 
                id="cnpj" 
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleProfileSave}>Salvar Alterações</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aparência</CardTitle>
            <CardDescription>Personalize a aparência do sistema.</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={theme} onValueChange={setTheme} className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="latte" id="latte" />
                <Label htmlFor="latte">Latte (Padrão)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light">Claro</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark">Escuro</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>Gerencie como você recebe notificações.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label htmlFor="low-stock">Alertas de estoque baixo</Label>
                <p className="text-sm text-muted-foreground">
                  Receba notificações quando o estoque de um produto atingir o mínimo.
                </p>
              </div>
              <Switch 
                id="low-stock" 
                checked={lowStockAlerts}
                onCheckedChange={handleLowStockChange}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label htmlFor="new-order">Notificações de novos pedidos</Label>
                <p className="text-sm text-muted-foreground">
                  Receba notificações para cada novo pedido de venda recebido.
                </p>
              </div>
              <Switch 
                id="new-order" 
                checked={newOrderNotifications}
                onCheckedChange={handleNewOrderChange}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Configuracoes;