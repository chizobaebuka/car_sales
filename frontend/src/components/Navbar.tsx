'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [user, setUser] = useState<{ firstName?: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try { 
        const parsedNode = JSON.parse(userData);
        requestAnimationFrame(() => setUser(parsedNode));
      } catch {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <nav className="navbar">
      <Link href="/" className="navbar-brand">
        <div className="navbar-logo">🚗</div>
        <span className="navbar-title">NaijaDrive</span>
      </Link>

      <ul className="navbar-links">
        {user ? (
          <>
            <li><Link href="/cars">Buy Cars</Link></li>
            <li><Link href="/sell">Sell Cars</Link></li>
            <li><Link href="/cars?featured=true">Verified</Link></li>
          </>
        ) : (
          <>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </>
        )}
      </ul>

      <div className="navbar-actions">
        <div className="navbar-search">
          <span>🔍</span>
          <input type="text" placeholder="Search Toyota, Honda, SUV..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                window.location.href = `/cars?search=${(e.target as HTMLInputElement).value}`;
              }
            }}
          />
        </div>

        {user ? (
          <>
            <Link href="/dashboard" className="navbar-icon" title="Dashboard">📊</Link>
            <button onClick={handleLogout} className="btn btn-sm btn-secondary" style={{ padding: '8px 12px', fontSize: '0.8rem' }}>Sign Out</button>
            <Link href="/dashboard" className="navbar-icon" style={{ background: 'var(--green)', color: 'white', fontWeight: 700 }}>
              {user.firstName?.[0] || 'U'}
            </Link>
          </>
        ) : (
          <>
            <Link href="/auth/login" className="btn btn-sm btn-secondary">Login</Link>
            <Link href="/auth/register" className="btn btn-sm btn-primary">Sign Up</Link>
          </>
        )}

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}
