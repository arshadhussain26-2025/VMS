import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Building2, Database } from 'lucide-react';
import { toast } from 'sonner';

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onSignup: (email: string, password: string, name: string, role: string) => Promise<void>;
}

export function LoginForm({ onLogin, onSignup }: LoginFormProps) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('host');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignup) {
        if (!name) {
          toast.error('Please enter your name');
          return;
        }
        await onSignup(email, password, name, role);
        toast.success('Account created successfully!');
      } else {
        await onLogin(email, password);
        toast.success('Welcome back!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full p-6 shadow-lg">
            <Building2 className="h-16 w-16 text-white" />
          </div>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl border-0">
          <CardContent className="p-8">
            {!isSignup && (
              <div className="mb-6">
                <p className="text-sm text-gray-600 text-center mb-3">
                  Welcome! Please log in to continue.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs font-semibold text-blue-800 mb-1">Demo Credentials:</p>
                  <p className="text-xs text-blue-700">Email: <span className="font-mono">admin@demo.com</span></p>
                  <p className="text-xs text-blue-700">Password: <span className="font-mono">admin123</span></p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {isSignup && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Username</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              {isSignup && (
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-gray-700">Role</Label>
                  <Select
                    id="role"
                    value={role}
                    onValueChange={(value) => setRole(value)}
                    className="flex h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <SelectTrigger className="flex h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                      <SelectValue placeholder="Select a role">
                        {role}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="receptionist">Receptionist</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="host">Host</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                {loading ? 'Please wait...' : (isSignup ? 'Sign Up' : 'Log In')}
              </Button>

              {!isSignup && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      className="border-gray-400"
                    />
                    <label
                      htmlFor="remember"
                      className="text-sm text-gray-700 cursor-pointer"
                    >
                      Remember me
                    </label>
                  </div>
                </div>
              )}
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsSignup(!isSignup)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                {isSignup ? 'Already have an account? Log In' : 'Forgot Your Password?'}
              </button>
            </div>

            {!isSignup && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => setIsSignup(true)}
                  className="text-gray-600 hover:text-gray-700 text-sm"
                >
                  Need an account? Sign up
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-8">
          © 2025 Visitor Management System. All rights reserved.
        </p>
      </div>
    </div>
  );
}