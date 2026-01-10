import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

// Sample featured products (to be replaced with CSV data later)
const featuredProducts = [
  {
    name: 'Runway ML (Unlimited Plan)',
    image: 'https://dreamstarsolution.com/wp-content/uploads/2025/04/Website-Poster-7-1-1-300x300.jpg',
    originalPrice: 8000,
    salePrice: 1600,
    discount: 80,
    buyLink: 'https://cosmofeed.com/vp/642a0b95713227002add768b',
  },
  {
    name: 'ChatGPT Plus Monthly',
    image: 'https://dreamstarsolution.com/wp-content/uploads/2025/04/Website-Poster-4-1-1-300x300.jpg',
    originalPrice: 2000,
    salePrice: 399,
    discount: 80,
    buyLink: 'https://cosmofeed.com/vp/642a0b95713227002add768b',
  },
  {
    name: 'Spotify Premium (12 Months)',
    image: 'https://dreamstarsolution.com/wp-content/uploads/2025/04/Website-Poster-5-1-1-300x300.jpg',
    originalPrice: 2000,
    salePrice: 850,
    discount: 58,
    buyLink: 'https://cosmofeed.com/vp/642a0b95713227002add768b',
  },
  {
    name: 'Amazon Prime Yearly',
    image: 'https://dreamstarsolution.com/wp-content/uploads/2025/04/Website-Poster-2-1-1-300x300.jpg',
    originalPrice: 1499,
    salePrice: 1150,
    discount: 23,
    buyLink: 'https://cosmofeed.com/vp/642a0b95713227002add768b',
  },
  {
    name: 'Loom Business+AI Yearly',
    image: 'https://dreamstarsolution.com/wp-content/uploads/2025/04/Website-Poster-6-1-1-300x300.jpg',
    originalPrice: 8000,
    salePrice: 3500,
    discount: 56,
    buyLink: 'https://cosmofeed.com/vp/642a0b95713227002add768b',
  },
  {
    name: 'Prime Video Yearly (5 Devices)',
    image: 'https://dreamstarsolution.com/wp-content/uploads/2025/04/Website-Poster-3-1-1-300x300.jpg',
    originalPrice: 1500,
    salePrice: 649,
    discount: 57,
    buyLink: 'https://cosmofeed.com/vp/642a0b95713227002add768b',
  },
  {
    name: 'Perplexity AI Pro Monthly',
    image: 'https://dreamstarsolution.com/wp-content/uploads/2025/04/4.jpg',
    originalPrice: 1800,
    salePrice: 499,
    discount: 72,
    buyLink: 'https://cosmofeed.com/vp/642a0b95713227002add768b',
  },
  {
    name: 'Netflix Premium (1 Month)',
    image: 'https://dreamstarsolution.com/wp-content/uploads/2025/04/7.jpg',
    originalPrice: 649,
    salePrice: 199,
    discount: 69,
    buyLink: 'https://cosmofeed.com/vp/642a0b95713227002add768b',
  },
];

const FeaturedProducts = () => {
  return (
    <section className="relative py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-sm font-display uppercase tracking-wider text-neon-pink mb-3"
            >
              Hot Deals
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-display font-bold"
            >
              Trending <span className="text-neon-cyan neon-text-cyan">Products</span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-neon-cyan font-display font-semibold uppercase text-sm hover:text-neon-pink transition-colors group mt-4 md:mt-0"
            >
              View All Products
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts.map((product, index) => (
            <ProductCard key={product.name} {...product} index={index} />
          ))}
        </div>

        {/* Load More */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link to="/products">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-xl font-display font-bold uppercase tracking-wider text-sm border-2 border-neon-pink text-neon-pink hover:bg-neon-pink/10 transition-colors"
            >
              Explore All 132 Products
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
