import { useEffect, useRef, useCallback } from 'react';

interface Star {
  x: number;
  y: number;
  z: number;
  px: number;
  py: number;
}

const InteractiveBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  const initStars = useCallback((width: number, height: number) => {
    const numStars = Math.min(200, Math.floor((width * height) / 8000));
    starsRef.current = [];

    for (let i = 0; i < numStars; i++) {
      starsRef.current.push({
        x: Math.random() * width - width / 2,
        y: Math.random() * height - height / 2,
        z: Math.random() * width,
        px: 0,
        py: 0,
      });
    }
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear with fade effect
    ctx.fillStyle = 'rgba(10, 5, 20, 0.1)';
    ctx.fillRect(0, 0, width, height);

    // Mouse influence
    const mouseInfluenceX = (mouseRef.current.x - centerX) * 0.0001;
    const mouseInfluenceY = (mouseRef.current.y - centerY) * 0.0001;

    starsRef.current.forEach((star) => {
      star.z -= 1.5;

      if (star.z <= 0) {
        star.x = Math.random() * width - centerX;
        star.y = Math.random() * height - centerY;
        star.z = width;
        star.px = 0;
        star.py = 0;
      }

      // Apply mouse influence
      star.x += mouseInfluenceX * star.z;
      star.y += mouseInfluenceY * star.z;

      const sx = (star.x / star.z) * width + centerX;
      const sy = (star.y / star.z) * height + centerY;

      if (star.px !== 0 && star.py !== 0) {
        const opacity = 1 - star.z / width;
        const size = (1 - star.z / width) * 2;

        // Draw line
        ctx.beginPath();
        ctx.moveTo(star.px, star.py);
        ctx.lineTo(sx, sy);

        // Alternate colors
        const colorIndex = Math.floor(star.z) % 3;
        if (colorIndex === 0) {
          ctx.strokeStyle = `rgba(255, 51, 153, ${opacity})`;
        } else if (colorIndex === 1) {
          ctx.strokeStyle = `rgba(0, 255, 255, ${opacity})`;
        } else {
          ctx.strokeStyle = `rgba(178, 102, 255, ${opacity})`;
        }

        ctx.lineWidth = size;
        ctx.stroke();

        // Draw point
        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fillStyle = ctx.strokeStyle;
        ctx.fill();
      }

      star.px = sx;
      star.py = sy;
    });

    // Draw grid lines at the bottom (horizon effect)
    const gridY = height * 0.7;
    const gridSpacing = 50;
    const perspective = 0.5;

    ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
    ctx.lineWidth = 1;

    // Horizontal lines with perspective
    for (let i = 0; i < 15; i++) {
      const y = gridY + i * gridSpacing * Math.pow(perspective, -i * 0.1);
      if (y > height) break;

      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Vertical lines with perspective
    for (let i = -10; i <= 10; i++) {
      const x1 = centerX + i * gridSpacing;
      const x2 = centerX + i * gridSpacing * 5;

      ctx.beginPath();
      ctx.moveTo(x1, gridY);
      ctx.lineTo(x2, height);
      ctx.stroke();
    }

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars(canvas.width, canvas.height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, initStars]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0"
      style={{ 
        background: 'linear-gradient(180deg, hsl(270 50% 6%) 0%, hsl(280 60% 12%) 50%, hsl(320 50% 15%) 100%)'
      }}
    />
  );
};

export default InteractiveBackground;
