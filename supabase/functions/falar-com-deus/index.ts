// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
// CORREÇÃO FINAL: Usando a API v1 com o modelo mais recente 'gemini-1.5-pro-latest'.
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro-latest:generateContent?key=${GEMINI_API_KEY}`;

const SCHEMA_DESCRIPTION = `
- products: id, code, description, category, brand, stock, min_stock, max_stock
- sales_orders: id, number, customer_name, date, total_value, status ('Pendente', 'Faturado', 'Cancelado'), items (jsonb)
- purchase_orders: id, number, supplier_name, date, total_value, status ('Pendente', 'Recebido', 'Cancelado'), items (jsonb)
- customers: id, name, cpf_cnpj, phone, email, address
- suppliers: id, name, cnpj, phone, email, address, status ('Ativo', 'Inativo')
`;

serve(async (req) => {
  console.log("--- [falar-com-deus] Função iniciada ---");

  if (req.method === "OPTIONS") {
    console.log("Recebida requisição OPTIONS. Respondendo com OK.");
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!GEMINI_API_KEY) {
      console.error("ERRO: Chave da API do Gemini não encontrada.");
      throw new Error("A chave da API do Gemini (GEMINI_API_KEY) não foi configurada nos secrets do projeto.");
    }
    console.log("PASSO 1/5: Chave da API do Gemini encontrada.");

    const { query } = await req.json();
    if (!query) {
      console.error("ERRO: A consulta (query) não foi fornecida no corpo da requisição.");
      throw new Error("A consulta (query) não foi fornecida.");
    }
    console.log(`Consulta recebida: "${query}"`);

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    const sqlGenPrompt = `
      Sua tarefa é gerar uma consulta SQL em PostgreSQL para responder à pergunta do usuário com base no esquema do banco de dados.
      Gere APENAS a consulta SQL, sem explicações ou formatação.
      Se a pergunta não puder ser respondida, retorne: "Não consigo responder a essa pergunta."
      Esquema: ${SCHEMA_DESCRIPTION}
      Pergunta: "${query}"
      SQL:
    `;

    const geminiSqlRequest = { contents: [{ parts: [{ text: sqlGenPrompt }] }] };
    console.log("Enviando requisição para o Gemini para gerar SQL...");
    const sqlResponse = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geminiSqlRequest),
    });

    if (!sqlResponse.ok) {
      const errorBody = await sqlResponse.text();
      console.error("ERRO na API do Gemini (geração de SQL):", errorBody);
      throw new Error(`Erro na API do Gemini ao gerar SQL: ${errorBody}`);
    }
    
    const sqlResult = await sqlResponse.json();
    const generatedSql = sqlResult.candidates[0]?.content?.parts[0]?.text?.trim();
    console.log("PASSO 2/5: SQL gerado pelo Gemini:", generatedSql);

    if (!generatedSql || generatedSql.includes('Não consigo responder')) {
      console.log("Gemini não conseguiu gerar um SQL válido. Retornando resposta padrão.");
      return new Response(JSON.stringify({ reply: "Desculpe, não consegui formular uma resposta para essa pergunta com os dados disponíveis." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Executando SQL no banco de dados...");
    const { data: queryData, error: queryError } = await supabaseClient.rpc('execute_sql', { sql_query: generatedSql });

    if (queryError) {
      console.error("ERRO ao executar SQL no banco de dados:", queryError);
      throw new Error(`Erro ao consultar o banco de dados: ${queryError.message}`);
    }
    console.log("PASSO 3/5: Dados recebidos do banco:", JSON.stringify(queryData));

    const summaryPrompt = `
      A pergunta do usuário foi: "${query}"
      Os resultados da consulta no banco de dados foram: ${JSON.stringify(queryData)}
      Com base nesses resultados, formule uma resposta amigável e clara em português.
      Não mencione o SQL. Apenas apresente a resposta final.
      Se os resultados estiverem vazios ou nulos, diga que nenhum dado foi encontrado para a pergunta.
    `;

    const geminiSummaryRequest = { contents: [{ parts: [{ text: summaryPrompt }] }] };
    console.log("Enviando requisição para o Gemini para resumir os dados...");
    const summaryResponse = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geminiSummaryRequest),
    });

    if (!summaryResponse.ok) {
      const errorBody = await summaryResponse.text();
      console.error("ERRO na API do Gemini (resumo de dados):", errorBody);
      throw new Error(`Erro na API do Gemini ao resumir dados: ${errorBody}`);
    }

    const summaryResult = await summaryResponse.json();
    const finalReply = summaryResult.candidates[0]?.content?.parts[0]?.text?.trim();
    console.log("PASSO 4/5: Resposta final gerada pelo Gemini:", finalReply);

    console.log("PASSO 5/5: Enviando resposta final para o cliente.");
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