import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/products' },
  { name: 'Contact', href: '/contact' },
  { name: 'Terms', href: '/terms' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="glass-card rounded-2xl px-6 py-4 flex items-center justify-between border border-border/50">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="font-display text-xl md:text-2xl font-bold tracking-wider"
            >
              <span className="text-neon-pink neon-text">DREAM</span>
              <span className="text-neon-cyan neon-text-cyan">STAR</span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="relative font-body text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-neon-pink to-neon-cyan group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <motion.button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <Search className="w-5 h-5 text-muted-foreground hover:text-neon-cyan transition-colors" />
            </motion.button>

            {/* Cart */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 rounded-full hover:bg-muted transition-colors"
            >
              <ShoppingBag className="w-5 h-5 text-muted-foreground hover:text-neon-pink transition-colors" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-neon-pink text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                0
              </span>
            </motion.button>

            {/* Mobile Menu Toggle */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="md:hidden p-2 rounded-full hover:bg-muted transition-colors"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-neon-pink" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4"
            >
              <div className="glass-card rounded-xl p-2 flex items-center gap-4 border border-neon-cyan/30">
                <Search className="w-5 h-5 text-neon-cyan ml-2" />
                <input
                  type="text"
                  placeholder="Search for AI tools, OTT services, software..."
                  className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground font-body"
                  autoFocus
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 overflow-hidden"
            >
              <div className="glass-card rounded-xl p-6 space-y-4 border border-border/50">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={link.href}
                      onClick={() => setIsOpen(false)}
                      className="block font-display text-lg font-semibold uppercase tracking-wider text-foreground hover:text-neon-pink transition-colors py-2"
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
