import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, MessageCircle, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative pt-20 pb-8 px-4">
      {/* Top Border Gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-pink to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link to="/" className="inline-block mb-4">
              <span className="font-display text-2xl font-bold">
                <span className="text-neon-pink neon-text">DREAM</span>
                <span className="text-neon-cyan neon-text-cyan">STAR</span>
              </span>
            </Link>
            <p className="text-muted-foreground font-body mb-6">
              Your trusted partner for premium digital products at unbeatable prices. Serving 15,000+ happy customers since 2021.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Instagram, href: '#' },
                { icon: MessageCircle, href: '#' },
                { icon: Youtube, href: '#' },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-neon-pink/20 transition-colors group"
                >
                  <social.icon className="w-5 h-5 text-muted-foreground group-hover:text-neon-pink transition-colors" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="font-display font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {['Products', 'Categories', 'Special Offers', 'Updates'].map((link) => (
                <li key={link}>
                  <Link 
                    to={`/${link.toLowerCase().replace(' ', '-')}`}
                    className="text-muted-foreground font-body hover:text-neon-cyan transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-display font-bold text-lg mb-4">Support</h4>
            <ul className="space-y-3">
              {['Contact Us', 'Return & Refunds', 'Terms of Service', 'Privacy Policy'].map((link) => (
                <li key={link}>
                  <Link 
                    to={`/${link.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                    className="text-muted-foreground font-body hover:text-neon-cyan transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="font-display font-bold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-neon-cyan flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground font-body">support@dreamstarsolution.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-neon-cyan flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground font-body">WhatsApp Support Available</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-neon-cyan flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground font-body">India</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground font-body text-center md:text-left">
              © 2025 Dreamstar Solutions. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-body">Powered by</span>
              <span className="text-xs font-display text-neon-pink">Cosmofeed</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
