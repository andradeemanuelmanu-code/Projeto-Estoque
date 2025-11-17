import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { showSuccess, showError, showLoading, dismissToast } from "@/utils/toast";
import { useSession } from "@/context/SessionContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const Configuracoes = () => {
  const { setTheme, theme } = useTheme();
  const { session, profile, refetchProfile } = useSession();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [newOrderNotifications, setNewOrderNotifications] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState(() => {
    const saved = localStorage.getItem('user_settings_enableStockAlerts');
    return saved !== 'false';
  });

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
    }
  }, [profile]);

  const handleProfileSave = async () => {
    if (!session?.user) {
      showError("Você não está autenticado.");
      return;
    }

    setIsSaving(true);
    const toastId = showLoading("Salvando perfil...");

    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: firstName,
        last_name: lastName,
        updated_at: new Date().toISOString(),
      })
      .eq('id', session.user.id);

    dismissToast(toastId);
    if (error) {
      showError("Erro ao atualizar o perfil: " + error.message);
    } else {
      showSuccess("Perfil atualizado com sucesso!");
      await refetchProfile();
    }
    setIsSaving(false);
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
            <CardTitle>Meu Perfil</CardTitle>
            <CardDescription>Atualize suas informações pessoais.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">Nome</Label>
                <Input 
                  id="first-name" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Sobrenome</Label>
                <Input 
                  id="last-name" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleProfileSave} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar Alterações
              </Button>
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