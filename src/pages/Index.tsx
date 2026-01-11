import { useState, lazy, Suspense } from 'react';
import Preloader from '@/components/Preloader';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';

// Lazy load heavy/below-fold components
const Categories = lazy(() => import('@/components/Categories'));
const FeaturedProducts = lazy(() => import('@/components/FeaturedProducts'));
const BlogSection = lazy(() => import('@/components/BlogSection'));
const About = lazy(() => import('@/components/About'));

const SectionFallback = () => (
  <div className="h-64 flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      
      {!isLoading && (
        <div className="relative min-h-screen bg-background">
          <div className="relative z-10">
            <Navbar />
            <main>
              <Hero />
              <Suspense fallback={<SectionFallback />}>
                <Categories />
              </Suspense>
              <Suspense fallback={<SectionFallback />}>
                <FeaturedProducts />
              </Suspense>
              <Suspense fallback={<SectionFallback />}>
                <BlogSection />
              </Suspense>
              <Suspense fallback={<SectionFallback />}>
                <About />
              </Suspense>
            </main>
            <Footer />
          </div>
        </div>
      )}
    </>
  );
};

export default Index;
