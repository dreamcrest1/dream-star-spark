import { supabase } from '@/integrations/supabase/client';

export type AiTask =
  | 'product_description'
  | 'product_seo'
  | 'blog_outline'
  | 'blog_seo'
  | 'rewrite_cyberpunk'
  | 'alt_text';

export async function aiAssist(
  task: AiTask,
  args: { context?: Record<string, unknown>; imageUrl?: string } = {},
): Promise<any> {
  const { data, error } = await supabase.functions.invoke('ai-assist', {
    body: { task, ...args },
  });
  if (error) throw new Error(error.message || 'AI request failed');
  if ((data as any)?.error) throw new Error((data as any).error);
  return (data as any)?.result;
}
