'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: '#f8fafc', minHeight: '100vh', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', letterSpacing: '-0.025em' }}>Get in Touch</h1>
            <p style={{ fontSize: '1.25rem', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>We&apos;re here to help you drive safely. Reach out to our 24/7 support team and we&#39;ll get back to you instantly.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem' }}>

            {/* Contact Information */}
            <div style={{ background: 'white', padding: '3.5rem 2.5rem', borderRadius: '1.5rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)' }}>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '2.5rem', color: '#1e293b' }}>Contact Information</h3>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', marginBottom: '2rem' }}>
                <div style={{ fontSize: '1.5rem', background: '#e0e7ff', padding: '1rem', borderRadius: '1rem', color: '#4f46e5', boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)' }}>📍</div>
                <div>
                  <h4 style={{ fontWeight: 600, color: '#0f172a', marginBottom: '0.25rem', fontSize: '1.1rem' }}>Headquarters</h4>
                  <p style={{ color: '#64748b', lineHeight: 1.6 }}>12 Admiralty Way, Lekki Phase 1<br />Lagos, Nigeria</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', marginBottom: '2rem' }}>
                <div style={{ fontSize: '1.5rem', background: '#dcfce7', padding: '1rem', borderRadius: '1rem', color: '#16a34a', boxShadow: '0 4px 6px -1px rgba(22, 163, 74, 0.2)' }}>📞</div>
                <div>
                  <h4 style={{ fontWeight: 600, color: '#0f172a', marginBottom: '0.25rem', fontSize: '1.1rem' }}>Phone</h4>
                  <p style={{ color: '#64748b', lineHeight: 1.6 }}>+234 (0) 800 NAIJADRIVE<br />+234 (0) 901 234 5678</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
                <div style={{ fontSize: '1.5rem', background: '#fee2e2', padding: '1rem', borderRadius: '1rem', color: '#dc2626', boxShadow: '0 4px 6px -1px rgba(220, 38, 38, 0.2)' }}>✉️</div>
                <div>
                  <h4 style={{ fontWeight: 600, color: '#0f172a', marginBottom: '0.25rem', fontSize: '1.1rem' }}>Email</h4>
                  <p style={{ color: '#64748b', lineHeight: 1.6 }}>support@naijadrive.com<br />dealers@naijadrive.com</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div style={{ background: 'white', padding: '3.5rem 2.5rem', borderRadius: '1.5rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)' }}>
              <form onSubmit={(e) => { e.preventDefault(); alert("Thanks for reaching out! A support agent will respond soon."); }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#334155', fontSize: '0.95rem' }}>First Name</label>
                    <input type="text" placeholder="Emeka" required style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1', outline: 'none', transition: 'border 0.2s, box-shadow 0.2s', fontSize: '1rem' }} onFocus={(e) => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)' }} onBlur={(e) => { e.target.style.borderColor = '#cbd5e1'; e.target.style.boxShadow = 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#334155', fontSize: '0.95rem' }}>Last Name</label>
                    <input type="text" placeholder="Williams" required style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1', outline: 'none', transition: 'border 0.2s, box-shadow 0.2s', fontSize: '1rem' }} onFocus={(e) => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)' }} onBlur={(e) => { e.target.style.borderColor = '#cbd5e1'; e.target.style.boxShadow = 'none' }} />
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#334155', fontSize: '0.95rem' }}>Email Address</label>
                  <input type="email" placeholder="you@example.com" required style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1', outline: 'none', transition: 'border 0.2s, box-shadow 0.2s', fontSize: '1rem' }} onFocus={(e) => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)' }} onBlur={(e) => { e.target.style.borderColor = '#cbd5e1'; e.target.style.boxShadow = 'none' }} />
                </div>

                <div style={{ marginBottom: '2.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#334155', fontSize: '0.95rem' }}>Message</label>
                  <textarea rows={5} placeholder="How can we help you today?" required style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1', outline: 'none', resize: 'vertical', transition: 'border 0.2s, box-shadow 0.2s', fontSize: '1rem', fontFamily: 'inherit' }} onFocus={(e) => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)' }} onBlur={(e) => { e.target.style.borderColor = '#cbd5e1'; e.target.style.boxShadow = 'none' }}></textarea>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem', borderRadius: '0.75rem', background: '#0f172a', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 700, boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.3)', transition: 'transform 0.1s, background 0.2s' }} onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'} onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'} onMouseEnter={(e) => e.currentTarget.style.background = '#1e293b'} onMouseLeave={(e) => e.currentTarget.style.background = '#0f172a'}>Send Message</button>
              </form>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
