// AI assistant for admin panel: generates product/blog/SEO copy and image alt-text.
// Uses Lovable AI Gateway (free Gemini). No client secrets exposed.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type Task =
  | "product_description"
  | "product_seo"
  | "blog_outline"
  | "blog_seo"
  | "rewrite_cyberpunk"
  | "alt_text";

interface Body {
  task: Task;
  // Free-form context the caller wants to pass (name, category, current text, etc.)
  context?: Record<string, unknown>;
  // For alt_text: a public image URL (data: URLs also accepted)
  imageUrl?: string;
}

const SYSTEM: Record<Task, string> = {
  product_description:
    "You write punchy, conversion-focused e-commerce product descriptions for a cyberpunk-themed digital-products store called Dreamstar Solution. Tone: confident, slightly edgy, neon/synthwave vibes, but always clear and benefit-driven. 50-90 words. No emoji spam. End with a subtle CTA.",
  product_seo:
    "You generate concise SEO metadata for an e-commerce product page. Return ONLY a compact JSON object with keys: title (<=60 chars, includes main keyword + 'Dreamstar'), description (<=155 chars, benefit-led), keywords (comma-separated, 6-10 terms). No prose, no markdown, no code fences.",
  blog_outline:
    "You produce a structured blog outline for a cyberpunk-themed digital-services blog. Return Markdown with: a strong H1 title, 4-6 H2 sections, 2-4 bullet points under each. Tone: informative, slightly edgy, SEO-aware.",
  blog_seo:
    "You generate concise SEO metadata for a blog post. Return ONLY a compact JSON object with keys: title (<=60 chars, click-worthy), description (<=155 chars, intriguing). No prose, no markdown, no code fences.",
  rewrite_cyberpunk:
    "Rewrite the supplied text in a cyberpunk / synthwave brand voice for Dreamstar Solution: confident, neon-tinged, vivid verbs, short punchy sentences. Preserve meaning and any factual numbers/links. Return only the rewritten text — no commentary.",
  alt_text:
    "You write concise, descriptive image alt-text for accessibility and SEO. 8-16 words. Describe what is visible. No 'image of', no quotes, no trailing period unless it's a full sentence. Return ONLY the alt text.",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = (await req.json()) as Body;
    if (!body?.task || !SYSTEM[body.task]) {
      return new Response(JSON.stringify({ error: "Invalid task" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build user message
    let userContent: any;
    if (body.task === "alt_text") {
      if (!body.imageUrl) {
        return new Response(JSON.stringify({ error: "imageUrl required for alt_text" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      userContent = [
        { type: "text", text: "Generate alt text for this image." },
        { type: "image_url", image_url: { url: body.imageUrl } },
      ];
    } else {
      const ctx = body.context || {};
      userContent = `Context (JSON):\n${JSON.stringify(ctx, null, 2)}`;
    }

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM[body.task] },
          { role: "user", content: userContent },
        ],
      }),
    });

    if (!aiRes.ok) {
      if (aiRes.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit hit, please try again in a few seconds." }),
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

    const data = await aiRes.json();
    const content: string = data?.choices?.[0]?.message?.content ?? "";

    // For SEO tasks, try to parse JSON. If parse fails, return raw text under .text.
    if (body.task === "product_seo" || body.task === "blog_seo") {
      try {
        const cleaned = content.trim().replace(/^```json\s*|\s*```$/g, "");
        const parsed = JSON.parse(cleaned);
        return new Response(JSON.stringify({ result: parsed }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch {
        return new Response(JSON.stringify({ result: { raw: content } }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({ result: content.trim() }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("ai-assist error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
