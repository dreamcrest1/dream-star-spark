import { memo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Zap, Heart } from 'lucide-react';

const FloatingIcon = memo(({ 
  Icon, 
  initialX, 
  initialY, 
  delay 
}: { 
  Icon: typeof Sparkles; 
  initialX: number; 
  initialY: number; 
  delay: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className="fixed z-40 cursor-pointer"
      style={{ left: `${initialX}%`, top: `${initialY}%` }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: 0.6, 
        scale: 1,
        y: [0, -15, 0],
      }}
      transition={{
        opacity: { delay, duration: 0.5 },
        scale: { delay, duration: 0.5 },
        y: { delay: delay + 0.5, duration: 3 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut' },
      }}
      whileHover={{ scale: 1.5, opacity: 1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Icon 
        className={`w-6 h-6 transition-colors duration-300 ${
          isHovered ? 'text-primary' : 'text-muted-foreground/50'
        }`} 
      />
      
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 rounded-full"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              background: 'radial-gradient(circle, hsl(var(--primary) / 0.5) 0%, transparent 70%)',
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
});

FloatingIcon.displayName = 'FloatingIcon';

const InteractiveElements = memo(() => {
  const [clickEffects, setClickEffects] = useState<{ id: number; x: number; y: number }[]>([]);
  
  const handleClick = useCallback((e: React.MouseEvent) => {
    const id = Date.now();
    setClickEffects(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
    setTimeout(() => {
      setClickEffects(prev => prev.filter(effect => effect.id !== id));
    }, 1000);
  }, []);

  const icons = [
    { Icon: Sparkles, x: 5, y: 20 },
    { Icon: Star, x: 92, y: 15 },
    { Icon: Zap, x: 8, y: 70 },
    { Icon: Heart, x: 90, y: 65 },
    { Icon: Sparkles, x: 95, y: 40 },
  ];

  return (
    <>
      {/* Floating decorative icons */}
      <div className="hidden lg:block">
        {icons.map((icon, index) => (
          <FloatingIcon
            key={index}
            Icon={icon.Icon}
            initialX={icon.x}
            initialY={icon.y}
            delay={index * 0.2}
          />
        ))}
      </div>
      
      {/* Click ripple effects */}
      <div className="fixed inset-0 z-30 pointer-events-none">
        <AnimatePresence>
          {clickEffects.map(effect => (
            <motion.div
              key={effect.id}
              className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ 
                left: effect.x, 
                top: effect.y,
                background: 'radial-gradient(circle, hsl(var(--primary) / 0.6) 0%, transparent 70%)',
              }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          ))}
        </AnimatePresence>
      </div>
      
      {/* Global click listener for ripple */}
      <div 
        className="fixed inset-0 z-20" 
        onClick={handleClick}
        style={{ pointerEvents: 'auto' }}
      />
    </>
  );
});

InteractiveElements.displayName = 'InteractiveElements';

export default InteractiveElements;
