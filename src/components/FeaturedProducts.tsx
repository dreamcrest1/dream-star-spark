import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { products } from '@/data/products';

// Get top 8 products with discounts
const featuredProducts = products
  .filter(p => p.salePrice !== null)
  .sort((a, b) => {
    const discountA = a.salePrice ? ((a.regularPrice - a.salePrice) / a.regularPrice) * 100 : 0;
    const discountB = b.salePrice ? ((b.regularPrice - b.salePrice) / b.regularPrice) * 100 : 0;
    return discountB - discountA;
  })
  .slice(0, 8);

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
            <ProductCard key={product.id} product={product} index={index} />
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
