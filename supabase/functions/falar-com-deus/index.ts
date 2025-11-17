// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

// Define the "tools" (our secure Supabase functions) that the AI can use.
const tools = [
  {
    type: "function",
    function: {
      name: "get_sales_summary_by_period",
      description: "Obtém um resumo das vendas (faturamento, contagem de pedidos, ticket médio) para um período de datas.",
      parameters: {
        type: "object",
        properties: {
          start_date: { type: "string", description: "Data de início no formato AAAA-MM-DD" },
          end_date: { type: "string", description: "Data de fim no formato AAAA-MM-DD" },
        },
        required: ["start_date", "end_date"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_top_selling_products",
      description: "Obtém uma lista dos produtos mais vendidos pela quantidade total.",
      parameters: {
        type: "object",
        properties: {
          limit_count: { type: "integer", description: "O número de produtos a retornar. Padrão é 5." },
        },
        required: ["limit_count"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_products_with_low_stock",
      description: "Encontra produtos cujo estoque atual está abaixo ou igual ao estoque mínimo definido.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "get_customer_order_summary",
      description: "Obtém um resumo dos pedidos (total gasto, contagem de pedidos) para um cliente específico pelo nome.",
      parameters: {
        type: "object",
        properties: {
          customer_name_param: { type: "string", description: "O nome do cliente para buscar." },
        },
        required: ["customer_name_param"],
      },
    },
  },
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY não configurada.");

    const { messages } = await req.json();
    if (!messages) throw new Error("Nenhuma mensagem fornecida.");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    const systemMessage = {
      role: "system",
      content: `Você é um assistente de negócios especialista em análise de dados para uma loja de autopeças. Seja conciso e amigável. A data de hoje é ${new Date().toISOString().split('T')[0]}. Use as ferramentas disponíveis para responder às perguntas do usuário. Se não encontrar dados, informe educadamente.`,
    };

    // 1. Primeira chamada para a OpenAI para ver se ela quer usar uma ferramenta
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [systemMessage, ...messages],
        tools: tools,
        tool_choice: "auto",
      }),
    });

    if (!openaiResponse.ok) throw new Error(`Erro na API OpenAI: ${await openaiResponse.text()}`);
    
    const data = await openaiResponse.json();
    const responseMessage = data.choices[0].message;

    // 2. Se a IA quiser chamar uma ferramenta, execute-a
    if (responseMessage.tool_calls) {
      const toolCalls = responseMessage.tool_calls;
      const toolOutputs = [];

      for (const toolCall of toolCalls) {
        const functionName = toolCall.function.name;
        const functionArgs = JSON.parse(toolCall.function.arguments);
        
        const { data: rpcData, error: rpcError } = await supabaseClient.rpc(functionName, functionArgs);

        if (rpcError) throw new Error(`Erro ao chamar a função '${functionName}': ${rpcError.message}`);
        
        toolOutputs.push({
          tool_call_id: toolCall.id,
          role: "tool",
          name: functionName,
          content: JSON.stringify(rpcData),
        });
      }

      // 3. Segunda chamada para a OpenAI com os resultados da ferramenta
      const secondResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [systemMessage, ...messages, responseMessage, ...toolOutputs],
        }),
      });

      if (!secondResponse.ok) throw new Error(`Erro na segunda chamada da API OpenAI: ${await secondResponse.text()}`);
      
      const secondData = await secondResponse.json();
      return new Response(JSON.stringify({ reply: secondData.choices[0].message.content }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Se não houver chamada de ferramenta, retorne a resposta direta da IA
    return new Response(JSON.stringify({ reply: responseMessage.content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("--- [falar-com-deus] ERRO ---", error);
    return new Response(JSON.stringify({ reply: `Ocorreu um erro: ${error.message}` }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});