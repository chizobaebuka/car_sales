"use client";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="about-page" style={{ paddingBottom: 0 }}>
        <section className="hero-section" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white', padding: '6rem 2rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem', background: 'linear-gradient(110deg, #38bdf8, #818cf8, #38bdf8)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'gradient 3s linear infinite' }}>
            About NaijaDrive
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#cbd5e1', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>
            Nigeria&apos;s most trusted digital automotive marketplace. We connect buyers and sellers with extreme transparency, maximum security, and world-class web technology.
          </p>
        </section>

        <section style={{ padding: '5rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
            <div style={{ background: 'white', padding: '2.5rem', borderRadius: '1rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)', transition: 'transform 0.3s ease', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🛡️</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>Trust & Safety</h3>
              <p style={{ color: '#64748b', lineHeight: 1.6 }}>Every vehicle on NaijaDrive goes through a rigorous verification process. We partner with top diagnostic centers to ensure you&apos;re getting exactly what you pay for, eliminating scams and hidden faults completely.</p>
            </div>
            
            <div style={{ background: 'white', padding: '2.5rem', borderRadius: '1rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)', transition: 'transform 0.3s ease', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>⚡</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>Fast & Intuitive</h3>
              <p style={{ color: '#64748b', lineHeight: 1.6 }}>Our platform is designed to be lightning-fast. With advanced AI filtering, HD imagery, and instant communication tools, finding your dream car takes minutes today, not weeks.</p>
            </div>

            <div style={{ background: 'white', padding: '2.5rem', borderRadius: '1rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)', transition: 'transform 0.3s ease', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🤝</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>Community Driven</h3>
              <p style={{ color: '#64748b', lineHeight: 1.6 }}>We are building a robust network of trusted dealers and enthusiastic buyers across Lagos, Abuja, Port Harcourt and beyond, directly revolutionizing the African auto trade flow.</p>
            </div>
          </div>
        </section>

        <section style={{ background: '#f8fafc', padding: '6rem 2rem', textAlign: 'center', borderTop: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem' }}>Join the Revolution</h2>
          <p style={{ fontSize: '1.25rem', color: '#64748b', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem auto', lineHeight: 1.6 }}>
            Whether you&apos;re looking for your first clean sedan or selling a fleet of luxury SUVs, NaijaDrive is your ultimate partner on the road.
          </p>
          <a href="/auth/register" className="btn btn-primary btn-lg" style={{ padding: '1.2rem 3rem', fontSize: '1.1rem', borderRadius: '0.75rem', fontWeight: 700, boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)' }}>Get Started Today</a>
        </section>
      </main>
      <Footer />
    </>
  );
}
