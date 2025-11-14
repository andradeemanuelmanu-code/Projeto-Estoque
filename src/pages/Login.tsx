import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/context/SessionContext';
import { Navigate } from 'react-router-dom';
import { Wrench } from 'lucide-react';

const Login = () => {
  const { session } = useSession();

  if (session) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center">
          <Wrench className="h-12 w-12 text-primary" />
          <h1 className="text-3xl font-bold mt-4">Autoparts</h1>
          <p className="text-muted-foreground">Acesse sua conta para gerenciar seu negócio</p>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={[]}
            theme="light"
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Endereço de e-mail',
                  password_label: 'Sua senha',
                  button_label: 'Entrar',
                  social_provider_text: 'Entrar com {{provider}}',
                  link_text: 'Já tem uma conta? Entre',
                },
                sign_up: {
                  email_label: 'Endereço de e-mail',
                  password_label: 'Crie uma senha',
                  button_label: 'Criar conta',
                  social_provider_text: 'Inscrever-se com {{provider}}',
                  link_text: 'Não tem uma conta? Inscreva-se',
                },
                forgotten_password: {
                  email_label: 'Endereço de e-mail',
                  button_label: 'Enviar instruções',
                  link_text: 'Esqueceu sua senha?',
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;