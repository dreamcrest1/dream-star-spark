import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Bot, Video, Briefcase, Users, Palette, Tv, Globe, Code, Pencil, Search, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import InteractiveBackground from '@/components/InteractiveBackground';
import WhatsAppButton from '@/components/WhatsAppButton';

const categories = [
  { 
    name: 'AI Tools', 
    description: 'ChatGPT, AI Writers, Image Generators & more',
    productCount: 32, 
    icon: Bot, 
    color: 'cyan',
    slug: 'ai-tools',
    gradient: 'from-cyan-500 to-blue-500'
  },
  { 
    name: 'Video Editing', 
    description: 'Professional video creation & editing tools',
    productCount: 18, 
    icon: Video, 
    color: 'pink',
    slug: 'video-editing',
    gradient: 'from-pink-500 to-rose-500'
  },
  { 
    name: 'Writing Tools', 
    description: 'Grammar checkers, paraphrasers & content tools',
    productCount: 15, 
    icon: Pencil, 
    color: 'purple',
    slug: 'writing-tools',
    gradient: 'from-purple-500 to-violet-500'
  },
  { 
    name: 'SEO Tools', 
    description: 'Keyword research, backlinks & SEO optimization',
    productCount: 12, 
    icon: Search, 
    color: 'orange',
    slug: 'seo',
    gradient: 'from-orange-500 to-amber-500'
  },
  { 
    name: 'Cloud Services', 
    description: 'Design assets, templates & cloud storage',
    productCount: 20, 
    icon: Palette, 
    color: 'pink',
    slug: 'digital-assets',
    gradient: 'from-fuchsia-500 to-pink-500'
  },
  { 
    name: 'Indian OTT', 
    description: 'Netflix, Prime Video, Hotstar & more',
    productCount: 24, 
    icon: Tv, 
    color: 'cyan',
    slug: 'indian-ott',
    gradient: 'from-teal-500 to-cyan-500'
  },
  { 
    name: 'International OTT', 
    description: 'HBO Max, Hulu, Paramount+ & more',
    productCount: 12, 
    icon: Globe, 
    color: 'purple',
    slug: 'international-ott',
    gradient: 'from-indigo-500 to-purple-500'
  },
  { 
    name: 'Software', 
    description: 'Adobe, Autodesk, Windows & productivity tools',
    productCount: 43, 
    icon: Code, 
    color: 'orange',
    slug: 'software',
    gradient: 'from-red-500 to-orange-500'
  },
  { 
    name: 'Lead Generation', 
    description: 'Find leads, manage clients & grow business',
    productCount: 6, 
    icon: Users, 
    color: 'cyan',
    slug: 'lead-gen',
    gradient: 'from-emerald-500 to-teal-500'
  },
];

const Categories = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen relative">
      <InteractiveBackground />
      <Navbar />
      
      <main className="relative z-10 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-neon-cyan/30 mb-6"
            >
              <Palette className="w-4 h-4 text-neon-cyan" />
              <span className="text-sm font-body font-semibold text-neon-cyan uppercase tracking-wider">
                Browse Categories
              </span>
            </motion.div>
            
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-4">
              Explore Our <span className="text-neon-pink neon-text">Categories</span>
            </h1>
            <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
              Find exactly what you need from our curated collection of premium digital products across various categories.
            </p>
          </motion.div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/products?category=${category.slug}`}>
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="group relative glass-card rounded-2xl p-6 border border-border/50 hover:border-neon-pink/50 transition-all duration-300 overflow-hidden h-full"
                  >
                    {/* Gradient Background on Hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                    
                    {/* Icon */}
                    <div className={`relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <category.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    {/* Content */}
                    <div className="relative z-10">
                      <h3 className="font-display text-xl font-bold mb-2 group-hover:text-neon-cyan transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground font-body mb-4">
                        {category.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-body text-neon-pink font-semibold">
                          {category.productCount}+ Products
                        </span>
                        <motion.div
                          className="flex items-center gap-1 text-neon-cyan text-sm font-body"
                          whileHover={{ x: 5 }}
                        >
                          Explore
                          <ArrowRight className="w-4 h-4" />
                        </motion.div>
                      </div>
                    </div>

                    {/* Glow Effect */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      initial={{ opacity: 0 }}
                      whileHover={{
                        opacity: 1,
                        boxShadow: '0 0 30px hsl(320 100% 60% / 0.2), inset 0 0 20px hsl(320 100% 60% / 0.05)',
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-16"
          >
            <Link to="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 bg-gradient-to-r from-neon-pink to-neon-purple rounded-xl font-display font-bold uppercase tracking-wider text-sm overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  View All Products
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Categories;
