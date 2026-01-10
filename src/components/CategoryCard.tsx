import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface CategoryCardProps {
  name: string;
  productCount: number;
  icon: LucideIcon;
  color: 'pink' | 'cyan' | 'purple' | 'orange';
  href: string;
  index: number;
}

const colorClasses = {
  pink: {
    border: 'hover:border-neon-pink/70',
    text: 'text-neon-pink',
    glow: 'group-hover:shadow-[0_0_30px_hsl(320_100%_60%_/_0.3)]',
    bg: 'bg-neon-pink/10',
  },
  cyan: {
    border: 'hover:border-neon-cyan/70',
    text: 'text-neon-cyan',
    glow: 'group-hover:shadow-[0_0_30px_hsl(180_100%_50%_/_0.3)]',
    bg: 'bg-neon-cyan/10',
  },
  purple: {
    border: 'hover:border-neon-purple/70',
    text: 'text-neon-purple',
    glow: 'group-hover:shadow-[0_0_30px_hsl(280_100%_65%_/_0.3)]',
    bg: 'bg-neon-purple/10',
  },
  orange: {
    border: 'hover:border-neon-orange/70',
    text: 'text-neon-orange',
    glow: 'group-hover:shadow-[0_0_30px_hsl(25_100%_55%_/_0.3)]',
    bg: 'bg-neon-orange/10',
  },
};

const CategoryCard = ({ name, productCount, icon: Icon, color, href, index }: CategoryCardProps) => {
  const colors = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Link to={href}>
        <motion.div
          whileHover={{ y: -5 }}
          className={`group relative glass-card rounded-2xl p-6 border border-border/50 ${colors.border} ${colors.glow} transition-all duration-300 cursor-pointer overflow-hidden`}
        >
          {/* Background Glow */}
          <div className={`absolute inset-0 ${colors.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

          {/* Icon */}
          <div className={`relative z-10 w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center mb-4`}>
            <Icon className={`w-7 h-7 ${colors.text}`} />
          </div>

          {/* Content */}
          <h3 className="relative z-10 font-display font-bold text-lg mb-1">{name}</h3>
          <p className={`relative z-10 text-sm font-body ${colors.text}`}>
            {productCount} Products
          </p>

          {/* Hover Arrow */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileHover={{ opacity: 1, x: 0 }}
            className={`absolute bottom-6 right-6 ${colors.text}`}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.div>

          {/* Corner Accent */}
          <div className={`absolute top-0 right-0 w-20 h-20 ${colors.bg} rounded-bl-full opacity-50`} />
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;
