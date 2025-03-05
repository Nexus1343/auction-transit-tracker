
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const { signIn, isLoading } = useAuth();

  useEffect(() => {
    // Reset local loading state after 10 seconds as a fallback
    // in case the auth state gets stuck
    if (localLoading) {
      const timer = setTimeout(() => {
        console.log('Login timeout reached, resetting local loading state');
        setLocalLoading(false);
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [localLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalLoading(true);
    await signIn(email, password);
    // Don't reset localLoading here, let the auth state handle it
  };

  // Derive actual loading state, using both local and auth loading
  const buttonLoading = localLoading || isLoading;

  // Reset local loading state when auth loading state changes
  useEffect(() => {
    if (!isLoading && localLoading) {
      setLocalLoading(false);
    }
  }, [isLoading]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">AmeriCars</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to sign in to your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={buttonLoading}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={buttonLoading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={buttonLoading}>
              {buttonLoading ? 'Signing in...' : 'Sign in'}
            </Button>
            <div className="text-sm text-center text-gray-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
