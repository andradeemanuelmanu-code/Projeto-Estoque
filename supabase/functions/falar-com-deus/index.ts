// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// NOTE: The OPENAI_API_KEY secret must be set in the Supabase project settings.
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!OPENAI_API_KEY) {
      throw new Error("A chave da API da OpenAI (OPENAI_API_KEY) não foi configurada.");
    }

    // In Phase 2, we will receive the user's query and conversation history here.
    const { query } = await req.json();
    if (!query) {
      throw new Error("A consulta (query) não foi fornecida.");
    }

    // Placeholder response for Phase 1.
    // The full implementation with OpenAI Tool Calling will be done in Phase 2.
    const placeholderReply = `Fase 1 concluída. A função foi refatorada e está pronta para a integração com a OpenAI. A sua pergunta foi: "${query}"`;

    return new Response(JSON.stringify({ reply: placeholderReply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("--- [falar-com-deus] ERRO ---");
    console.error(error);
    return new Response(JSON.stringify({ reply: `Erro na preparação: ${error.message}` }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});