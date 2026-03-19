import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="navbar-brand">
            <div className="navbar-logo">🚗</div>
            <span className="navbar-title">NaijaDrive</span>
          </div>
          <p>Nigeria&apos;s most trusted car marketplace for buyers and sellers across the federation.</p>
        </div>
        <div>
          <h4>Popular Locations</h4>
          <ul>
            <li><Link href="/cars?state=Lagos">Cars in Lagos</Link></li>
            <li><Link href="/cars?state=FCT">Cars in Abuja</Link></li>
            <li><Link href="/cars?state=Rivers">Cars in Port Harcourt</Link></li>
            <li><Link href="/cars?state=Oyo">Cars in Ibadan</Link></li>
          </ul>
        </div>
        <div>
          <h4>Support</h4>
          <ul>
            <li><Link href="/sell">How to Sell</Link></li>
            <li><Link href="/about">Buyer Safety</Link></li>
            <li><Link href="/contact">Contact Us</Link></li>
            <li><Link href="/faq">FAQs</Link></li>
          </ul>
        </div>
        <div>
          <h4>Newsletter</h4>
          <p style={{ fontSize: '0.9rem', marginBottom: '0.8rem' }}>Get the latest car deals in your inbox.</p>
          <div className="footer-newsletter">
            <input type="email" placeholder="Email" />
            <button>Join</button>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2024 NaijaDrive Marketplace. All rights reserved.</span>
        <div className="footer-bottom-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
