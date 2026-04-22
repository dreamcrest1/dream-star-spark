import { useState } from 'react';
import Preloader from '@/components/Preloader';
import InteractiveBackground from '@/components/InteractiveBackground';
import InteractiveElements from '@/components/InteractiveElements';
import CursorTrail from '@/components/CursorTrail';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Categories from '@/components/Categories';
import FeaturedProducts from '@/components/FeaturedProducts';
import BlogSection from '@/components/BlogSection';
import About from '@/components/About';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { useHomeLayout, type SectionId } from '@/lib/homeLayout';

const homeJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Dreamstar Solution',
  url: 'https://dreamstarsolution.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://dreamstarsolution.com/products?search={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

const SECTION_COMPONENTS: Record<SectionId, React.FC> = {
  hero: Hero,
  categories: Categories,
  featured: FeaturedProducts,
  blog: BlogSection,
  about: About,
};

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const layout = useHomeLayout();

  return (
    <>
      <SEO
        title="Dreamstar Solution – India's Most Trusted OTT & Digital Services Provider"
        description="Premium OTT subscriptions, streaming services, and group buy tools at affordable prices. Netflix, Prime Video, Disney+ Hotstar, and 200+ products. Trusted by 15,000+ customers since 2021."
        keywords="OTT services India, Netflix India, Prime Video, Disney Hotstar, streaming services, group buy tools, digital services, Dreamstar Solution, affordable OTT, premium subscriptions, Movie Box Pro, IPTV, VPN services"
        canonical="https://dreamstarsolution.com/"
        jsonLd={homeJsonLd}
      />
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}

      {!isLoading && (
        <div className="relative min-h-screen">
          <InteractiveBackground />
          <InteractiveElements />
          <CursorTrail />

          <div className="relative z-10">
            <Navbar />
            <main>
              {layout
                .filter((s) => s.enabled)
                .map(({ id }) => {
                  const Section = SECTION_COMPONENTS[id];
                  return Section ? <Section key={id} /> : null;
                })}
            </main>
            <Footer />
          </div>
        </div>
      )}
    </>
  );
};

export default Index;
