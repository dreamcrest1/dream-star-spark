import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroBg from '@/assets/hero-bg.jpg';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-4 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-neon-cyan/30 mb-8"
        >
          <Zap className="w-4 h-4 text-neon-cyan" />
          <span className="text-sm font-body font-semibold text-neon-cyan uppercase tracking-wider">
            Instant Digital Delivery
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6"
        >
          <span className="block text-foreground">Premium Digital</span>
          <span className="block mt-2">
            <span className="text-neon-pink neon-text">Products</span>
            <span className="text-foreground"> at </span>
            <span className="text-neon-cyan neon-text-cyan">Unreal</span>
          </span>
          <span className="block text-foreground mt-2">Prices</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground font-body mb-10"
        >
          Access top-tier AI tools, OTT subscriptions, premium software & more.
          <span className="text-neon-pink"> Up to 80% OFF</span> on all digital products.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/products">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 bg-gradient-to-r from-neon-pink to-neon-purple rounded-xl font-display font-bold uppercase tracking-wider text-sm overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Explore Products
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-neon-purple to-neon-cyan"
                initial={{ x: '100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </Link>

          <Link to="/categories">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-xl font-display font-bold uppercase tracking-wider text-sm border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10 transition-colors"
            >
              View Categories
            </motion.button>
          </Link>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
        >
          {[
            { icon: Zap, title: 'Instant Delivery', desc: 'Get access immediately after purchase' },
            { icon: Shield, title: '100% Genuine', desc: 'Authentic products guaranteed' },
            { icon: Clock, title: '24/7 Support', desc: 'Always here to help you' },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
              className="glass-card rounded-xl p-6 border border-border/50 hover:border-neon-pink/50 transition-colors group"
            >
              <feature.icon className="w-10 h-10 text-neon-cyan mb-4 group-hover:text-neon-pink transition-colors" />
              <h3 className="font-display font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground font-body">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
