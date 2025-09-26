import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Mail, Lock, User, Chrome, Loader2 } from 'lucide-react';

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${BACKEND_URL}/api/users/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Signup failed');

      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => { window.location.href = '/login'; }, 1500);
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = `${BACKEND_URL}/api/auth/signin/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Get Started
          </h1>
          <p className="text-slate-400 mt-2">Create your account today</p>
        </div>

        <Card className="border border-slate-800 shadow-2xl bg-[#111] text-white">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-semibold text-center text-white">
              Sign Up
            </CardTitle>
            <CardDescription className="text-center text-slate-400">
              Fill in your details to create an account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive" className="bg-red-950/50 border-red-700 text-red-400">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-700 bg-green-900/30 text-green-400">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <Button
              type="button"
              variant="outline"
              className="w-full h-11 border-slate-700 bg-[#1a1a1a] hover:bg-slate-800 transition-all duration-200 text-slate-200"
              onClick={handleGoogleAuth}
              disabled={loading}
            >
              <Chrome className="w-4 h-4 mr-2" />
              Sign up with Google
            </Button>

            <div className="relative">
              <Separator className="bg-slate-700" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-[#111] px-2 text-sm text-slate-500">or</span>
              </div>
            </div>

            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-slate-300">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    className="pl-10 h-11 border-slate-700 bg-[#1a1a1a] text-white placeholder-slate-500 focus:border-yellow-500 focus:ring-yellow-500"
                    value={signupData.name}
                    onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-300">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10 h-11 border-slate-700 bg-[#1a1a1a] text-white placeholder-slate-500 focus:border-yellow-500 focus:ring-yellow-500"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-sm font-medium text-slate-300">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    className="pl-10 pr-10 h-11 border-slate-700 bg-[#1a1a1a] text-white placeholder-slate-500 focus:border-yellow-500 focus:ring-yellow-500"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    required
                    minLength={6}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-2 h-7 w-7 p-0 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-500" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-slate-500">Password must be at least 6 characters long</p>
              </div>

              <div className="flex items-center space-x-2">
                <input type="checkbox" id="terms" className="rounded border-slate-700 bg-[#1a1a1a]" required />
                <Label htmlFor="terms" className="text-sm text-slate-400">
                  I agree to the{' '}
                  <a href="/terms" className="text-yellow-400 hover:underline">Terms of Service</a>{' '}
                  and{' '}
                  <a href="/privacy" className="text-yellow-400 hover:underline">Privacy Policy</a>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold transition-all duration-200"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            <div className="text-center text-sm">
              <span className="text-slate-400">Already have an account? </span>
              <a
                href="/login"
                className="font-medium text-yellow-400 hover:text-yellow-300 hover:underline transition-colors"
              >
                Sign in
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;
