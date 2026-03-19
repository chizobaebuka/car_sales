'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { api } from '@/lib/api';

import { RegisterPayload, UserRole } from '@/types';

export default function RegisterPage() {
  const [form, setForm] = useState<RegisterPayload>({ firstName: '', lastName: '', email: '', password: '', phone: '', role: UserRole.BUYER, businessName: '', location: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const update = (key: keyof RegisterPayload, value: string) => setForm({ ...form, [key]: value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.auth.register(form);
      window.location.href = `/auth/verify?email=${encodeURIComponent(form.email)}`;
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
        <div className="auth-card" style={{ maxWidth: '540px' }}>
          <h1>Create Account</h1>
          <p className="subtitle">Join NaijaDrive and start buying or selling cars</p>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input className="form-input" value={form.firstName} onChange={(e) => update('firstName', e.target.value)} placeholder="Emeka" required />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input className="form-input" value={form.lastName} onChange={(e) => update('lastName', e.target.value)} placeholder="Williams" required />
              </div>
            </div>
            <div className="form-group">
              <label>Email</label>
              <input className="form-input" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" required />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input className="form-input" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="08012345678" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input className="form-input" type="password" value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="Min 6 characters" required />
            </div>
            <div className="form-group">
              <label>I want to</label>
              <select className="form-input" value={form.role} onChange={(e) => update('role', e.target.value)}>
                <option value="buyer">Buy Cars</option>
                <option value="seller">Sell Cars</option>
                <option value="dealer">I&apos;m a Dealer</option>
              </select>
            </div>
            {(form.role === 'dealer') && (
              <div className="form-group">
                <label>Business Name</label>
                <input className="form-input" value={form.businessName} onChange={(e) => update('businessName', e.target.value)} placeholder="Your dealership name" />
              </div>
            )}
            <div className="form-group">
              <label>Location</label>
              <input className="form-input" value={form.location} onChange={(e) => update('location', e.target.value)} placeholder="Lagos, Nigeria" />
            </div>
            <button className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          <div className="auth-footer">
            Already have an account? <Link href="/auth/login">Sign In</Link>
          </div>
        </div>
      </div>
    </>
  );
}
