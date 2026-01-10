import { motion } from 'framer-motion';
import { ExternalLink, Sparkles } from 'lucide-react';
import { type Product } from '@/data/products';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const { name, image, regularPrice, salePrice, externalUrl } = product;
  const displayPrice = salePrice ?? regularPrice;
  const discount = salePrice ? Math.round(((regularPrice - salePrice) / regularPrice) * 100) : 0;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="group relative"
    >
      <motion.div
        whileHover={{ y: -8 }}
        className="relative glass-card rounded-2xl overflow-hidden border border-border/50 hover:border-neon-pink/50 transition-all duration-300"
      >
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 z-20 px-3 py-1 bg-gradient-to-r from-neon-pink to-neon-purple rounded-full">
            <span className="text-xs font-display font-bold text-white">{discount}% OFF</span>
          </div>
        )}

        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-deep-purple">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          
          {/* Glitch Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
          
          {/* Scanlines */}
          <div className="absolute inset-0 scanlines opacity-30" />

          {/* Quick Buy Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center"
          >
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-gradient-to-r from-neon-pink to-neon-purple rounded-xl font-display font-bold uppercase text-sm flex items-center gap-2 hover:scale-105 transition-transform"
            >
              Buy Now
              <ExternalLink className="w-4 h-4" />
            </a>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-display font-semibold text-sm md:text-base line-clamp-2 mb-3 group-hover:text-neon-cyan transition-colors">
            {name}
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-display font-bold text-lg text-neon-pink">
                ₹{displayPrice.toLocaleString()}
              </span>
              {salePrice && regularPrice > salePrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ₹{regularPrice.toLocaleString()}
                </span>
              )}
            </div>

            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              <Sparkles className="w-5 h-5 text-neon-cyan" />
            </motion.div>
          </div>
        </div>

        {/* Neon Border Glow */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          initial={{ opacity: 0 }}
          whileHover={{
            opacity: 1,
            boxShadow: '0 0 20px hsl(320 100% 60% / 0.3), inset 0 0 20px hsl(320 100% 60% / 0.1)',
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.div>
  );
};

export default ProductCard;
