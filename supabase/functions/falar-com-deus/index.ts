// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL_NAME = "z-ai/glm-4.5-air";

const SCHEMA_DESCRIPTION = `
- products: id, code, description, category, brand, stock, min_stock, max_stock
- sales_orders: id, number, customer_name, date, total_value, status ('Pendente', 'Faturado', 'Cancelado'), items (jsonb)
- purchase_orders: id, number, supplier_name, date, total_value, status ('Pendente', 'Recebido', 'Cancelado'), items (jsonb)
- customers: id, name, cpf_cnpj, phone, email, address
- suppliers: id, name, cnpj, phone, email, address, status ('Ativo', 'Inativo')
`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!OPENROUTER_API_KEY) {
      throw new Error("A chave da API da OpenRouter (OPENROUTER_API_KEY) não foi configurada nos secrets do projeto.");
    }

    const { query } = await req.json();
    if (!query) {
      throw new Error("A consulta (query) não foi fornecida.");
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    const sqlGenPrompt = `
      Sua tarefa é gerar uma consulta SQL em PostgreSQL para responder à pergunta do usuário com base no esquema do banco de dados.
      Gere APENAS a consulta SQL, sem explicações ou formatação.
      IMPORTANTE: Para evitar resultados muito grandes, sempre adicione um 'LIMIT 20' ao final de suas consultas, a menos que o usuário peça explicitamente por todos os resultados ou uma contagem.
      Se a pergunta não puder ser respondida, retorne: "Não consigo responder a essa pergunta."
      Esquema: ${SCHEMA_DESCRIPTION}
      Pergunta: "${query}"
      SQL:
    `;

    const headers = {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": `https://${Deno.env.get("SUPABASE_PROJECT_ID")}.supabase.co`,
      "X-Title": "Autoparts ERP",
    };

    const sqlGenBody = {
      model: MODEL_NAME,
      messages: [{ role: "user", content: sqlGenPrompt }],
      max_tokens: 500,
    };

    const sqlResponse = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(sqlGenBody),
    });

    if (!sqlResponse.ok) {
      const errorBody = await sqlResponse.text();
      throw new Error(`Erro na API da OpenRouter ao gerar SQL: ${errorBody}`);
    }
    
    const sqlResult = await sqlResponse.json();
    let generatedSql = sqlResult.choices[0]?.message?.content?.trim();

    // Lógica de limpeza de SQL mais robusta
    if (generatedSql) {
        // Tenta encontrar um bloco de código SQL formatado em markdown
        const sqlBlockMatch = generatedSql.match(/```sql\n([\s\S]*?)\n```/);
        if (sqlBlockMatch && sqlBlockMatch[1]) {
            generatedSql = sqlBlockMatch[1].trim();
        } else {
            // Se não houver bloco de código, procura pela primeira ocorrência de SELECT (case-insensitive)
            const selectIndex = generatedSql.toLowerCase().indexOf('select');
            if (selectIndex !== -1) {
                generatedSql = generatedSql.substring(selectIndex);
            }
        }

        // Remove o ponto-e-vírgula final, se existir, para evitar erros de sintaxe na função RPC
        if (generatedSql.endsWith(';')) {
            generatedSql = generatedSql.slice(0, -1);
        }
    }

    if (!generatedSql || generatedSql.includes('Não consigo responder') || !generatedSql.toLowerCase().startsWith('select')) {
      return new Response(JSON.stringify({ reply: "Desculpe, não consegui formular uma consulta válida para essa pergunta." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: queryData, error: queryError } = await supabaseClient.rpc('execute_sql', { sql_query: generatedSql });

    if (queryError) {
      throw new Error(`Erro ao consultar o banco de dados: ${queryError.message}`);
    }

    let truncatedData = queryData;
    let truncationMessage = "";
    if (Array.isArray(queryData) && queryData.length > 20) {
        truncatedData = queryData.slice(0, 20);
        truncationMessage = "Nota: Os resultados foram limitados aos primeiros 20 registros. Informe ao usuário que os dados foram resumidos."
    }

    const summaryPrompt = `
      A pergunta do usuário foi: "${query}"
      Os resultados da consulta no banco de dados foram: ${JSON.stringify(truncatedData)}
      ${truncationMessage}
      Com base nesses resultados, formule uma resposta amigável e clara em português.
      Não mencione o SQL. Apenas apresente a resposta final.
      Se os resultados estiverem vazios ou nulos, diga que nenhum dado foi encontrado para a pergunta.
    `;

    const summaryBody = {
      model: MODEL_NAME,
      messages: [{ role: "user", content: summaryPrompt }],
      max_tokens: 1000,
    };

    const summaryResponse = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(summaryBody),
    });

    if (!summaryResponse.ok) {
      const errorBody = await summaryResponse.text();
      throw new Error(`Erro na API da OpenRouter ao resumir dados: ${errorBody}`);
    }

    const summaryResult = await summaryResponse.json();
    const finalReply = summaryResult.choices[0]?.message?.content?.trim();

    return new Response(JSON.stringify({ reply: finalReply || "Não foi possível processar a resposta." }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("--- [falar-com-deus] ERRO INESPERADO NA FUNÇÃO ---");
    console.error(error);
    return new Response(JSON.stringify({ reply: `Erro: ${error.message}` }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});