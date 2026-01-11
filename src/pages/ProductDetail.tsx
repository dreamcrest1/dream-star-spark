import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Shield, Clock, Zap, Star, CheckCircle } from 'lucide-react';
import { products } from '@/data/products';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import InteractiveBackground from '@/components/InteractiveBackground';
import CursorTrail from '@/components/CursorTrail';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = products.find(p => p.id === Number(id));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen relative bg-background">
        <InteractiveBackground />
        <CursorTrail />
        <Navbar />
        <main className="relative z-10 pt-24 pb-16 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="font-display text-4xl font-bold text-foreground mb-4">Product Not Found</h1>
            <Link to="/products">
              <Button className="bg-gradient-neon">Back to Products</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const discount = product.salePrice 
    ? Math.round(((product.regularPrice - product.salePrice) / product.regularPrice) * 100) 
    : 0;

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const features = [
    { icon: Shield, text: '1 Year Warranty', color: 'neon-cyan' },
    { icon: Clock, text: 'Instant Delivery', color: 'neon-pink' },
    { icon: Zap, text: 'Premium Quality', color: 'neon-purple' },
    { icon: Star, text: '15K+ Happy Customers', color: 'neon-orange' },
  ];

  return (
    <div className="min-h-screen relative bg-background">
      <InteractiveBackground />
      <CursorTrail />
      <Navbar />
      
      <main className="relative z-10 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link 
              to="/products" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-neon-cyan transition-colors font-body"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Products
            </Link>
          </motion.div>

          {/* Product Details */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden glass-card border border-neon-pink/30">
                {discount > 0 && (
                  <div className="absolute top-4 left-4 z-10 px-4 py-2 bg-gradient-to-r from-neon-pink to-neon-purple rounded-full">
                    <span className="font-display font-bold text-white">{discount}% OFF</span>
                  </div>
                )}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
              </div>
              
              {/* Floating glow */}
              <motion.div
                className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-neon-pink/20 to-neon-cyan/20 blur-2xl -z-10"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <span className="inline-block px-3 py-1 bg-neon-cyan/20 text-neon-cyan rounded-full text-sm font-display mb-4">
                {product.category}
              </span>
              
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                {product.name}
              </h1>
              
              <p className="text-muted-foreground font-body text-lg leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-4 mb-8">
                <span className="font-display text-4xl font-bold text-neon-pink">
                  ₹{(product.salePrice ?? product.regularPrice).toLocaleString()}
                </span>
                {product.salePrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    ₹{product.regularPrice.toLocaleString()}
                  </span>
                )}
                {discount > 0 && (
                  <span className="text-lg font-display text-green-400">
                    Save ₹{(product.regularPrice - (product.salePrice ?? product.regularPrice)).toLocaleString()}
                  </span>
                )}
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.text}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className={`flex items-center gap-3 p-3 rounded-xl bg-card/50 border border-${feature.color}/30`}
                  >
                    <feature.icon className={`w-5 h-5 text-${feature.color}`} />
                    <span className="text-sm font-body text-foreground">{feature.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* Buy Button */}
              <motion.a
                href={product.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan rounded-xl font-display font-bold text-lg uppercase tracking-wider text-white shadow-lg shadow-neon-pink/30 hover:shadow-xl hover:shadow-neon-pink/40 transition-shadow"
              >
                {product.buttonText || 'Buy Now'}
                <ExternalLink className="w-5 h-5" />
              </motion.a>

              {/* Trust Badges */}
              <div className="mt-6 flex flex-wrap gap-2">
                {['Secure Payment', 'Trusted Seller', 'Money Back Guarantee'].map((badge) => (
                  <span key={badge} className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    {badge}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="font-display text-2xl font-bold text-foreground mb-8">
                Related <span className="text-neon-cyan">Products</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts.map((p, index) => (
                  <ProductCard key={p.id} product={p} index={index} />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default ProductDetail;
