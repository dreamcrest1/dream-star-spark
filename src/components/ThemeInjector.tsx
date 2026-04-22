import { useEffect } from 'react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

/**
 * Reads the `theme` setting and writes the colors as CSS variables on :root.
 * Mounted once at the top of the app.
 */
const ThemeInjector = () => {
  const { settings } = useSiteSettings();
  const theme = settings.theme || {};

  useEffect(() => {
    const root = document.documentElement;
    if (theme.neonPink) root.style.setProperty('--neon-pink', theme.neonPink);
    if (theme.neonCyan) root.style.setProperty('--neon-cyan', theme.neonCyan);
    if (theme.neonPurple) root.style.setProperty('--neon-purple', theme.neonPurple);
    if (theme.neonOrange) root.style.setProperty('--neon-orange', theme.neonOrange);
    if (theme.background) root.style.setProperty('--background', theme.background);
    // Sync primary/ring with neonPink so shadcn buttons follow theme
    if (theme.neonPink) {
      root.style.setProperty('--primary', theme.neonPink);
      root.style.setProperty('--ring', theme.neonPink);
    }
  }, [theme.neonPink, theme.neonCyan, theme.neonPurple, theme.neonOrange, theme.background]);

  return null;
};

export default ThemeInjector;
