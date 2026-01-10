import { useState } from 'react';
import Preloader from '@/components/Preloader';
import InteractiveBackground from '@/components/InteractiveBackground';
import CursorTrail from '@/components/CursorTrail';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Categories from '@/components/Categories';
import FeaturedProducts from '@/components/FeaturedProducts';
import About from '@/components/About';
import Footer from '@/components/Footer';
import Mascot from '@/components/Mascot';
import MusicToggle from '@/components/MusicToggle';
import WhatsAppButton from '@/components/WhatsAppButton';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      
      {!isLoading && (
        <div className="relative min-h-screen">
          <InteractiveBackground />
          <CursorTrail />

          <div className="relative z-10">
            <Navbar />
            <main>
              <Hero />
              <Categories />
              <FeaturedProducts />
              <About />
            </main>
            <Footer />
          </div>

          <Mascot />
          <MusicToggle />
          <WhatsAppButton />
        </div>
      )}
    </>
  );
};

export default Index;
