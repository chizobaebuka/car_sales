import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const faqs = [
  {
    q: "How do I sell my car on NaijaDrive?",
    a: "Simple! Just click on the 'Sell Cars' button, create an account, and fill out our easy listing form with photos and specifications of your vehicle."
  },
  {
    q: "Are the sellers on this platform verified?",
    a: "Yes! Look for the 'Verified' badge on listings. We verify dealer identities and vehicle documentation for a safer marketplace experience."
  },
  {
    q: "How can I contact a seller?",
    a: "On each car detail page, you can click 'Show Contact Number' to see the seller's phone number or use the WhatsApp integration to send them a direct message."
  },
  {
    q: "Is NaijaDrive free to use?",
    a: "Browsing for cars is completely free. We offer competitive listing packages for sellers, including featured spots to help you sell faster."
  },
  {
    q: "What should I do before buying a car?",
    a: "We recommend meeting in public places, inspecting the car thoroughly, and never making payments before seeing the vehicle and verifying documents."
  }
];

export default function FAQPage() {
  return (
    <>
      <Navbar />
      <main className="section" style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem' }}>
        <h1 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center' }}>
          Frequently Asked Questions
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--grey-400)', marginBottom: '3rem' }}>
          Everything you need to know about buying and selling on Nigeria&apos;s leading car marketplace.
        </p>
        
        <div style={{ display: 'grid', gap: '2rem' }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ background: '#fff', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem', color: 'var(--navy)' }}>
                Q: {faq.q}
              </h3>
              <p style={{ color: 'var(--grey-500)', lineHeight: '1.6' }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
