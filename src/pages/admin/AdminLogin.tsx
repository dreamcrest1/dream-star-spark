import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { loginAdmin, isAdmin } from '@/lib/adminAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import SEO from '@/components/SEO';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState('');

  if (isAdmin()) {
    navigate('/admin/dashboard', { replace: true });
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (loginAdmin(password)) {
      toast({ title: 'Welcome back, admin' });
      navigate('/admin/dashboard');
    } else {
      toast({ title: 'Invalid password', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <SEO
        title="Admin Login"
        description="Admin panel login for Dreamstar Solution."
        noindex
      />
      <Card className="w-full max-w-md p-8 glass-card border-neon-pink/30">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-pink to-neon-purple flex items-center justify-center">
            <Lock className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="font-display text-2xl font-bold text-center mb-2">Admin Panel</h1>
        <p className="text-center text-muted-foreground mb-6 text-sm">Enter your password to continue</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="pwd">Password</Label>
            <Input
              id="pwd"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              required
            />
          </div>
          <Button type="submit" className="w-full bg-gradient-to-r from-neon-pink to-neon-purple text-white">
            Sign In
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;
