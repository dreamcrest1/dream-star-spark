import { Helmet } from 'react-helmet-async';
import { useSiteSettings } from '@/hooks/useSiteSettings';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const SEO = ({
  title,
  description,
  keywords,
  canonical,
  image,
  type = 'website',
  noindex = false,
  jsonLd,
}: SEOProps) => {
  const { settings } = useSiteSettings();
  const seo = settings.seo || {};

  const siteName: string = seo.siteName || 'Dreamstar Solution';
  const siteUrl: string = seo.siteUrl || 'https://dreamstarsolution.com';
  const defaultImage: string = seo.ogImage || `${siteUrl}/og-image.jpg`;

  const finalTitle = title || seo.defaultTitle || siteName;
  const fullTitle = finalTitle.includes(siteName) ? finalTitle : `${finalTitle} | ${siteName}`;
  const finalDescription =
    description || seo.defaultDescription || 'Premium digital products at unreal prices.';
  const finalKeywords = keywords || seo.defaultKeywords;
  const finalImage = image || defaultImage;
  const url =
    canonical || (typeof window !== 'undefined' ? `${siteUrl}${window.location.pathname}` : siteUrl);

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={finalDescription} />
      {finalKeywords && <meta name="keywords" content={finalKeywords} />}
      <meta
        name="robots"
        content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'}
      />
      <link rel="canonical" href={url} />

      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_IN" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />

      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
};

export default SEO;
