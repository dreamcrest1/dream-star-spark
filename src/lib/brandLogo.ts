// Maps product names to official brand domains so we can render brand logos
// when the product's primary image fails to load.

const BRAND_DOMAINS: Array<{ match: RegExp; domain: string }> = [
  // Indian OTT
  { match: /netflix/i, domain: 'netflix.com' },
  { match: /prime\s*video|amazon\s*prime/i, domain: 'primevideo.com' },
  { match: /hotstar|disney\+?\s*hotstar|jio\s*hotstar/i, domain: 'hotstar.com' },
  { match: /sony\s*liv|sonyliv/i, domain: 'sonyliv.com' },
  { match: /zee\s*5|zee5/i, domain: 'zee5.com' },
  { match: /alt\s*balaji|altbalaji/i, domain: 'altbalaji.com' },
  { match: /voot/i, domain: 'voot.com' },
  { match: /jio\s*cinema|jiocinema/i, domain: 'jiocinema.com' },
  { match: /eros\s*now/i, domain: 'erosnow.com' },
  { match: /shemaroo/i, domain: 'shemaroome.com' },
  { match: /sun\s*nxt/i, domain: 'sunnxt.com' },
  { match: /aha/i, domain: 'aha.video' },
  { match: /chaupal/i, domain: 'chaupal.tv' },
  { match: /hoichoi/i, domain: 'hoichoi.tv' },

  // International OTT
  { match: /hbo\s*max|max\b/i, domain: 'max.com' },
  { match: /apple\s*tv/i, domain: 'tv.apple.com' },
  { match: /youtube\s*premium|youtube\s*music/i, domain: 'youtube.com' },
  { match: /spotify/i, domain: 'spotify.com' },
  { match: /tidal/i, domain: 'tidal.com' },
  { match: /deezer/i, domain: 'deezer.com' },
  { match: /paramount/i, domain: 'paramountplus.com' },
  { match: /peacock/i, domain: 'peacocktv.com' },
  { match: /hulu/i, domain: 'hulu.com' },
  { match: /crunchyroll/i, domain: 'crunchyroll.com' },
  { match: /mubi/i, domain: 'mubi.com' },
  { match: /curiosity\s*stream/i, domain: 'curiositystream.com' },
  { match: /discovery\+?/i, domain: 'discoveryplus.com' },

  // AI Tools
  { match: /chatgpt|openai|gpt[\s-]?4/i, domain: 'openai.com' },
  { match: /claude|anthropic/i, domain: 'anthropic.com' },
  { match: /midjourney/i, domain: 'midjourney.com' },
  { match: /perplexity/i, domain: 'perplexity.ai' },
  { match: /jasper/i, domain: 'jasper.ai' },
  { match: /copy\.ai|copy\s*ai/i, domain: 'copy.ai' },
  { match: /writesonic/i, domain: 'writesonic.com' },
  { match: /wordhero/i, domain: 'wordhero.co' },
  { match: /bramework/i, domain: 'bramework.com' },
  { match: /creaitor/i, domain: 'creaitor.ai' },
  { match: /writecream/i, domain: 'writecream.com' },
  { match: /nichesss/i, domain: 'nichesss.com' },
  { match: /texta/i, domain: 'texta.ai' },
  { match: /supermachine/i, domain: 'supermachine.art' },
  { match: /leonardo/i, domain: 'leonardo.ai' },
  { match: /runway/i, domain: 'runwayml.com' },
  { match: /elevenlabs|eleven\s*labs/i, domain: 'elevenlabs.io' },
  { match: /synthesia/i, domain: 'synthesia.io' },
  { match: /pictory/i, domain: 'pictory.ai' },
  { match: /descript/i, domain: 'descript.com' },
  { match: /notion\s*ai|notion/i, domain: 'notion.so' },
  { match: /gemini|google\s*bard/i, domain: 'gemini.google.com' },

  // Writing tools
  { match: /grammarly/i, domain: 'grammarly.com' },
  { match: /quillbot/i, domain: 'quillbot.com' },
  { match: /wordtune/i, domain: 'wordtune.com' },
  { match: /linguix/i, domain: 'linguix.com' },
  { match: /prowritingaid/i, domain: 'prowritingaid.com' },
  { match: /hemingway/i, domain: 'hemingwayapp.com' },
  { match: /ref[\s-]?n[\s-]?write/i, domain: 'ref-n-write.com' },

  // SEO
  { match: /semrush/i, domain: 'semrush.com' },
  { match: /ahrefs/i, domain: 'ahrefs.com' },
  { match: /moz/i, domain: 'moz.com' },
  { match: /writerzen/i, domain: 'writerzen.net' },
  { match: /seobuddy|link\s*chest/i, domain: 'seobuddy.com' },
  { match: /surfer\s*seo/i, domain: 'surferseo.com' },
  { match: /ubersuggest/i, domain: 'neilpatel.com' },

  // Design / Cloud
  { match: /canva/i, domain: 'canva.com' },
  { match: /envato/i, domain: 'envato.com' },
  { match: /freepik/i, domain: 'freepik.com' },
  { match: /pngtree/i, domain: 'pngtree.com' },
  { match: /shutterstock/i, domain: 'shutterstock.com' },
  { match: /adobe|photoshop|illustrator|premiere|after\s*effects|creative\s*cloud/i, domain: 'adobe.com' },
  { match: /figma/i, domain: 'figma.com' },
  { match: /autodesk/i, domain: 'autodesk.com' },
  { match: /designrr/i, domain: 'designrr.io' },

  // Video
  { match: /offeo/i, domain: 'offeo.com' },
  { match: /invideo/i, domain: 'invideo.io' },
  { match: /capcut/i, domain: 'capcut.com' },
  { match: /filmora/i, domain: 'filmora.wondershare.com' },
  { match: /screen\s*to\s*video|screen2video/i, domain: 'screentovideo.com' },

  // Software / Utilities
  { match: /winrar/i, domain: 'win-rar.com' },
  { match: /microsoft\s*365|office\s*365|microsoft\s*office/i, domain: 'microsoft.com' },
  { match: /windows\s*11|windows\s*10/i, domain: 'microsoft.com' },
  { match: /malwarebytes/i, domain: 'malwarebytes.com' },
  { match: /norton/i, domain: 'norton.com' },
  { match: /mcafee/i, domain: 'mcafee.com' },
  { match: /kaspersky/i, domain: 'kaspersky.com' },
  { match: /nordvpn/i, domain: 'nordvpn.com' },
  { match: /expressvpn/i, domain: 'expressvpn.com' },
  { match: /surfshark/i, domain: 'surfshark.com' },

  // Lead gen / others
  { match: /useartemis|artemis/i, domain: 'useartemis.co' },
  { match: /leads\s*gorilla/i, domain: 'leadsgorilla.io' },
  { match: /apollo/i, domain: 'apollo.io' },
];

const FALLBACK = '/placeholder.svg';

/**
 * Returns the official brand logo URL for a product name, or a generic
 * placeholder if no brand is matched.
 *
 * Uses Google's S2 favicon service at high resolution which is
 * available for any domain and has excellent uptime.
 */
export function getBrandLogo(name: string | null | undefined): string {
  if (!name) return FALLBACK;
  for (const { match, domain } of BRAND_DOMAINS) {
    if (match.test(name)) {
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=256`;
    }
  }
  return FALLBACK;
}

export const PRODUCT_PLACEHOLDER = FALLBACK;
