'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { api } from '@/lib/api';

function VerifyContent() {
  const searchParams = useSearchParams();
  const email = searchParams?.get('email') || '';
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Missing email address');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const result = await api.auth.verifyOtp(email, otp);
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      
      if (result.user.role === 'buyer') {
        window.location.href = '/';
      } else {
        window.location.href = '/dashboard';
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card" style={{ maxWidth: '440px' }}>
      <h1>Verify account</h1>
      <p className="subtitle">We&apos;ve sent a 6-digit code to <strong>{email}</strong></p>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Verification Code</label>
          <input
            className="form-input"
            style={{ letterSpacing: '8px', textAlign: 'center', fontSize: '1.5rem', fontWeight: 700 }}
            maxLength={6}
            placeholder="000000"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            required
          />
        </div>
        <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
          {loading ? 'Verifying...' : 'Verify & Continue'}
        </button>
      </form>

      <div className="auth-footer">
        Didn&apos;t receive a code? <button className="link-btn" style={{ background: 'none', border: 'none', color: 'var(--blue)', cursor: 'pointer', padding: 0 }} onClick={() => alert('OTP resent! (Mock)')}>Resend</button>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <>
      <Navbar />
      <div className="auth-page">
        <Suspense fallback={<div>Loading...</div>}>
          <VerifyContent />
        </Suspense>
      </div>
    </>
  );
}
