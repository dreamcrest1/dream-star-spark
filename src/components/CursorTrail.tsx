import { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  alpha: number;
  color: string;
  size: number;
}

const CursorTrail = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  const colors = [
    'hsl(320, 100%, 60%)', // neon pink
    'hsl(180, 100%, 50%)', // neon cyan
    'hsl(280, 100%, 65%)', // neon purple
  ];

  const addParticle = useCallback((x: number, y: number) => {
    const color = colors[Math.floor(Math.random() * colors.length)];
    particlesRef.current.push({
      x,
      y,
      alpha: 1,
      color,
      size: Math.random() * 4 + 2,
    });

    // Limit particles
    if (particlesRef.current.length > 50) {
      particlesRef.current.shift();
    }
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesRef.current = particlesRef.current.filter((particle) => {
      particle.alpha -= 0.02;
      particle.size *= 0.98;

      if (particle.alpha <= 0) return false;

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color.replace(')', `, ${particle.alpha})`).replace('hsl', 'hsla');
      ctx.shadowBlur = 15;
      ctx.shadowColor = particle.color;
      ctx.fill();

      return true;
    });

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      addParticle(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        mouseRef.current = { x: touch.clientX, y: touch.clientY };
        addParticle(touch.clientX, touch.clientY);
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
  }, [addParticle, animate]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[60]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default CursorTrail;
