import { motion } from 'framer-motion';
import { CheckCircle, Users, Package, HeadphonesIcon } from 'lucide-react';

const stats = [
  { icon: Users, value: '15,000+', label: 'Happy Customers' },
  { icon: Package, value: '200+', label: 'Products' },
  { icon: HeadphonesIcon, value: '24/7', label: 'Support' },
];

const features = [
  'Most Trusted Service Provider Since 2021',
  'Genuine Products with Warranty',
  'Instant Digital Delivery',
  'Responsive Customer Support',
];

const About = () => {
  return (
    <section className="relative py-20 px-4">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-neon-pink/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-neon-cyan/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-sm font-display uppercase tracking-wider text-neon-purple mb-3">
              About Us
            </p>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              <span className="text-neon-pink neon-text">Dreamcrest</span> Solutions
            </h2>
            <p className="text-muted-foreground font-body text-lg leading-relaxed mb-8">
              Dreamcrest Group is a leading provider of OTT services and group buy tools at discounted prices. 
              Founded in 2021, we've gained over 15,000+ customers and expanded our reach internationally. 
              We're committed to providing genuine digital products at unbeatable prices.
            </p>

            {/* Features List */}
            <ul className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <motion.li
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-neon-cyan flex-shrink-0" />
                  <span className="font-body">{feature}</span>
                </motion.li>
              ))}
            </ul>

            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-8 py-4 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-xl font-display font-bold uppercase tracking-wider text-sm"
            >
              Contact Us
            </motion.a>
          </motion.div>

          {/* Right Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ scale: 1.02 }}
                className="glass-card rounded-2xl p-6 border border-border/50 hover:border-neon-cyan/50 transition-all group"
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-xl bg-neon-cyan/10 flex items-center justify-center group-hover:bg-neon-cyan/20 transition-colors">
                    <stat.icon className="w-8 h-8 text-neon-cyan" />
                  </div>
                  <div>
                    <p className="text-3xl md:text-4xl font-display font-bold text-neon-pink neon-text">
                      {stat.value}
                    </p>
                    <p className="text-muted-foreground font-body">{stat.label}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Quality Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="glass-card rounded-2xl p-6 border border-neon-pink/30 text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-neon-pink/10 rounded-full mb-4">
                <span className="text-neon-pink font-display font-bold text-sm uppercase">
                  100% Quality Guaranteed
                </span>
              </div>
              <p className="text-sm text-muted-foreground font-body">
                Instant delivery • Genuine products • Best prices
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
