// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { subDays, formatISO } from "https://esm.sh/date-fns@2.29.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// --- Lógica dos Insights ---

// 1. Insight de Previsão de Demanda
async function getDemandInsight(supabase) {
  const now = new Date();
  const sixtyDaysAgo = formatISO(subDays(now, 60));
  const thirtyDaysAgo = formatISO(subDays(now, 30));

  const { data: orders, error } = await supabase
    .from("sales_orders")
    .select("items, date")
    .eq("status", "Faturado")
    .gte("date", sixtyDaysAgo);

  if (error || !orders || orders.length === 0) {
    return { status: "no_insight" };
  }

  const productSales = new Map();

  for (const order of orders) {
    const orderDate = new Date(order.date);
    for (const item of order.items) {
      if (!productSales.has(item.productId)) {
        productSales.set(item.productId, { recent: 0, previous: 0, name: item.productName });
      }
      const sale = productSales.get(item.productId);
      if (orderDate >= new Date(thirtyDaysAgo)) {
        sale.recent += item.quantity;
      } else {
        sale.previous += item.quantity;
      }
    }
  }

  let bestCandidate = null;
  let maxIncrease = 0;

  for (const [productId, sales] of productSales.entries()) {
    if (sales.previous > 0 && sales.recent > sales.previous) {
      const increase = (sales.recent - sales.previous) / sales.previous;
      if (increase > maxIncrease) {
        maxIncrease = increase;
        bestCandidate = { productId, ...sales };
      }
    }
  }

  if (bestCandidate && maxIncrease > 0.2) { // Aumento de pelo menos 20%
    return {
      status: "success",
      content: {
        main: `As vendas do produto "${bestCandidate.name}" aumentaram em ${(maxIncrease * 100).toFixed(0)}% no último mês.`,
        recommendation: "Considere revisar o estoque mínimo para este item para evitar rupturas.",
      },
      action: {
        text: "Ver Produto no Estoque",
        link: `/estoque/${bestCandidate.productId}`,
      },
    };
  }

  return { status: "no_insight" };
}

// 2. Insight de Venda Cruzada
async function getCrossSellInsight(supabase) {
  const { data: orders, error } = await supabase
    .from("sales_orders")
    .select("items")
    .eq("status", "Faturado");

  if (error || !orders) return { status: "no_insight" };
  
  const validOrders = orders.filter(o => Array.isArray(o.items) && o.items.length > 1);
  if (validOrders.length < 2) return { status: "no_insight" };

  const pairCounts = new Map();
  for (const order of validOrders) {
    const productIds = order.items.map(item => item.productId).sort();
    for (let i = 0; i < productIds.length; i++) {
      for (let j = i + 1; j < productIds.length; j++) {
        const pairKey = `${productIds[i]}|${productIds[j]}`;
        pairCounts.set(pairKey, (pairCounts.get(pairKey) || 0) + 1);
      }
    }
  }

  if (pairCounts.size === 0) return { status: "no_insight" };

  const mostFrequentPair = [...pairCounts.entries()].reduce((a, b) => (b[1] > a[1] ? b : a));
  
  if (mostFrequentPair[1] < 2) return { status: "no_insight" };

  const [prodIdA, prodIdB] = mostFrequentPair[0].split('|');
  
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, description')
    .in('id', [prodIdA, prodIdB]);

  if (productsError || !products || products.length < 2) return { status: "no_insight" };

  const productA = products.find(p => p.id === prodIdA);
  const productB = products.find(p => p.id === prodIdB);

  return {
    status: "success",
    content: {
      main: `Identificamos que clientes que compram "${productA.description}" também costumam levar "${productB.description}".`,
      recommendation: "Crie uma promoção ou um kit com os dois produtos para aumentar o ticket médio.",
    },
    action: {
      text: "Analisar Produto A",
      link: `/estoque/${productA.id}`,
    },
  };
}

// 3. Insight de Risco de Fornecedor
async function getSupplierInsight(supabase) {
  const { data: supplier, error } = await supabase
    .from("suppliers")
    .select("id, name")
    .eq("status", "Inativo")
    .limit(1)
    .single();

  if (error || !supplier) {
    return { status: "no_insight" };
  }

  return {
    status: "success",
    content: {
      main: `O fornecedor "${supplier.name}" está com o status 'Inativo', o que pode impactar a disponibilidade dos produtos que ele fornece.`,
      recommendation: "Verifique os produtos associados a este fornecedor e procure alternativas.",
    },
    action: {
      text: "Ver Fornecedor no Mapa",
      link: `/mapa?selectedId=${supplier.id}`,
    },
  };
}

// --- Lógica Principal do Servidor ---
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { insightType } = await req.json();
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    let result;
    switch (insightType) {
      case "demand":
        result = await getDemandInsight(supabaseClient);
        break;
      case "crossSell":
        result = await getCrossSellInsight(supabaseClient);
        break;
      case "supplier":
        result = await getSupplierInsight(supabaseClient);
        break;
      default:
        throw new Error("Tipo de insight inválido");
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      status: 'error',
      errorMessage: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});