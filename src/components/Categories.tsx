import { motion } from 'framer-motion';
import { Bot, Video, Briefcase, Users, Palette, Tv, Globe, Code } from 'lucide-react';
import CategoryCard from './CategoryCard';

const categories = [
  { name: 'AI Tools', productCount: 32, icon: Bot, color: 'cyan' as const, href: '/products?category=ai-tools' },
  { name: 'Video Editing', productCount: 18, icon: Video, color: 'pink' as const, href: '/products?category=video-editing' },
  { name: 'Office Essentials', productCount: 24, icon: Briefcase, color: 'purple' as const, href: '/products?category=office' },
  { name: 'Lead Generation', productCount: 6, icon: Users, color: 'orange' as const, href: '/products?category=lead-gen' },
  { name: 'Digital Assets', productCount: 15, icon: Palette, color: 'pink' as const, href: '/products?category=digital-assets' },
  { name: 'Indian OTT', productCount: 24, icon: Tv, color: 'cyan' as const, href: '/products?category=indian-ott' },
  { name: 'International OTT', productCount: 12, icon: Globe, color: 'purple' as const, href: '/products?category=international-ott' },
  { name: 'Software', productCount: 43, icon: Code, color: 'orange' as const, href: '/products?category=software' },
];

const Categories = () => {
  return (
    <section className="relative py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-display uppercase tracking-wider text-neon-cyan mb-3"
          >
            Browse By Category
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-display font-bold"
          >
            Explore Our <span className="text-neon-pink neon-text">Categories</span>
          </motion.h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <CategoryCard key={category.name} {...category} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
