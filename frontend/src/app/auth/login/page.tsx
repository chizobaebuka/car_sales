'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { api } from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await api.auth.login({ email, password });
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      
      if (result.user.role === 'buyer') {
        window.location.href = '/';
      } else {
        window.location.href = '/dashboard';
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="auth-page">
        <div className="auth-card">
          <h1>Welcome Back</h1>
          <p className="subtitle">Sign in to your NaijaDrive account</p>
          {error && (
            <div className="error-message">
              {error}
              {error.toLowerCase().includes('verify') && (
                <div style={{ marginTop: '0.5rem' }}>
                  <Link href={`/auth/verify?email=${encodeURIComponent(email)}`} style={{ color: 'white', textDecoration: 'underline' }}>
                    Click here to verify now
                  </Link>
                </div>
              )}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input className="form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input className="form-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required />
            </div>
            <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

          </form>
          <div className="auth-footer">
            Don&apos;t have an account? <Link href="/auth/register">Sign Up</Link>
          </div>
        </div>
      </div>
    </>
  );
}
