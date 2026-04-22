import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Monitor, Tablet, Smartphone, RotateCw, ExternalLink } from 'lucide-react';

type Device = 'mobile' | 'tablet' | 'desktop';

const widths: Record<Device, number> = {
  mobile: 390,
  tablet: 768,
  desktop: 1200,
};

interface Props {
  /** Path to load inside the iframe, e.g. "/" or "/products" */
  path: string;
  /** Bump this number to force the iframe to refresh (e.g. after a save). */
  refreshKey?: number;
  className?: string;
}

const LivePreview = ({ path, refreshKey = 0, className = '' }: Props) => {
  const [device, setDevice] = useState<Device>('desktop');
  const [tick, setTick] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Auto-refresh when refreshKey changes
  useEffect(() => {
    setTick((n) => n + 1);
  }, [refreshKey]);

  const src = `${path}${path.includes('?') ? '&' : '?'}_preview=${tick}`;

  return (
    <div className={`flex flex-col h-full bg-card/30 border border-border rounded-lg overflow-hidden ${className}`}>
      <div className="flex items-center justify-between gap-2 p-2 border-b border-border bg-card/50">
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant={device === 'mobile' ? 'secondary' : 'ghost'}
            onClick={() => setDevice('mobile')}
            title="Mobile (390px)"
          >
            <Smartphone className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant={device === 'tablet' ? 'secondary' : 'ghost'}
            onClick={() => setDevice('tablet')}
            title="Tablet (768px)"
          >
            <Tablet className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant={device === 'desktop' ? 'secondary' : 'ghost'}
            onClick={() => setDevice('desktop')}
            title="Desktop (1200px)"
          >
            <Monitor className="w-4 h-4" />
          </Button>
        </div>
        <div className="text-xs text-muted-foreground truncate flex-1 text-center font-mono">
          {path}
        </div>
        <div className="flex items-center gap-1">
          <Button size="sm" variant="ghost" onClick={() => setTick((n) => n + 1)} title="Refresh">
            <RotateCw className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => window.open(path, '_blank')} title="Open in new tab">
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-background/50 flex items-start justify-center p-4">
        <div
          className="bg-background border border-border rounded-md shadow-lg transition-all"
          style={{ width: widths[device], maxWidth: '100%' }}
        >
          <iframe
            ref={iframeRef}
            key={tick}
            src={src}
            title="Live preview"
            className="w-full h-[800px] border-0 rounded-md"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
          />
        </div>
      </div>
    </div>
  );
};

export default LivePreview;
