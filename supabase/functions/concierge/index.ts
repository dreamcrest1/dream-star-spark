// AI Concierge for Dreamstar Solution
// Streams cyberpunk-flavored responses grounded in the live product catalog.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface Msg {
  role: "user" | "assistant";
  content: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { messages } = (await req.json()) as { messages: Msg[] };
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Pull a compact catalog so the AI can recommend real products
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data: products } = await supabase
      .from("products")
      .select("id, name, category, regular_price, sale_price, external_url, description")
      .limit(200);

    const catalog =
      (products || [])
        .map(
          (p: any) =>
            `#${p.id} | ${p.name} | ${p.category} | ₹${p.sale_price ?? p.regular_price}${
              p.sale_price ? ` (was ₹${p.regular_price})` : ""
            } | ${p.external_url}`,
        )
        .join("\n") || "No products available.";

    const SYSTEM = `You are NOVA, the AI concierge for Dreamstar Solution — a cyberpunk-themed digital products marketplace.

VOICE: Confident, neon-edged, slightly playful. Short punchy sentences. Use occasional cyberpunk flourishes ("uplink secured", "data-stream", "stack of choices") but never sacrifice clarity. Drop subtle synthwave vibes.

JOB:
- Help visitors discover the right digital product (OTT, productivity tools, courses, etc.).
- Recommend SPECIFIC products from the catalog below by name and price. Always include a markdown link [Buy Now](external_url) when recommending.
- Compare options when asked.
- Answer questions about pricing, categories, and features.
- For checkout/payment/delivery questions, mention that purchases redirect to secure Cosmofeed payment links.
- For support beyond products, suggest WhatsApp chat (+91 99914 83279).

RULES:
- Only recommend products that exist in the catalog.
- Keep responses under 150 words unless the user asks for detail.
- Use markdown: bold product names, bullet lists for comparisons.
- Never invent prices, URLs, or products.
- If asked something off-topic, gently steer back to the store.

LIVE CATALOG:
${catalog}`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        stream: true,
        messages: [{ role: "system", content: SYSTEM }, ...messages],
      }),
    });

    if (!aiRes.ok) {
      if (aiRes.status === 429) {
        return new Response(
          JSON.stringify({ error: "Too many requests. Try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (aiRes.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Add credits in workspace settings." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const text = await aiRes.text();
      console.error("AI gateway error", aiRes.status, text);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(aiRes.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("concierge error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
