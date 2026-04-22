import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { aiAssist, type AiTask } from '@/lib/aiAssist';

interface Props {
  task: AiTask;
  context?: Record<string, unknown>;
  imageUrl?: string;
  onResult: (result: any) => void;
  label?: string;
  size?: 'sm' | 'default' | 'lg' | 'icon';
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  className?: string;
  disabled?: boolean;
}

const AiAssistButton = ({
  task,
  context,
  imageUrl,
  onResult,
  label = 'AI Assist',
  size = 'sm',
  variant = 'outline',
  className,
  disabled,
}: Props) => {
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true);
    try {
      const result = await aiAssist(task, { context, imageUrl });
      onResult(result);
      toast({ title: 'AI generated', description: 'Result inserted into the field.' });
    } catch (e: any) {
      toast({ title: 'AI failed', description: e.message, variant: 'destructive' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button type="button" size={size} variant={variant} onClick={run} disabled={busy || disabled} className={className}>
      {busy ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
      {busy ? 'Thinking…' : label}
    </Button>
  );
};

export default AiAssistButton;
