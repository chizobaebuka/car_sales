'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CarCard from '@/components/CarCard';
import { api, getImageUrl } from '@/lib/api';
import { formatPrice, conditionLabel } from '@/lib/utils';

import { Car, CarImage } from '@/types';
import Image from 'next/image';

export default function CarDetailPage() {
  const params = useParams();
  const [car, setCar] = useState<Car | null>(null);
  const [similar, setSimilar] = useState<Car[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [contactForm, setContactForm] = useState({ buyerName: '', buyerEmail: '', buyerPhone: '', message: '' });
  const [messageSent, setMessageSent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPhone, setShowPhone] = useState(false);

  // Intercept id changes during rendering to avoid useEffect cascading renders
  const [prevId, setPrevId] = useState(params.id);
  if (params.id !== prevId) {
    setPrevId(params.id);
    setLoading(true);
    setCar(null);
    setSimilar([]);
    setShowPhone(false);
  }

  useEffect(() => {
    if (params.id) {
      Promise.all([
        api.cars.get(params.id as string),
        api.cars.similar(params.id as string).catch(() => []),
      ]).then(([carData, similarData]) => {
        setCar(carData);
        setSimilar(similarData || []);
      }).catch(() => { }).finally(() => setLoading(false));
    }
  }, [params.id]);

  const handleSendMessage = async () => {
    if (!car || !contactForm.buyerName || !contactForm.buyerEmail) return;
    try {
      await api.leads.create({ ...contactForm, carId: car.id, sellerId: car.userId });
      setMessageSent(true);
    } catch { }
  };

  if (loading) return (<><Navbar /><div className="loading" style={{ minHeight: '60vh' }}><div className="spinner" /></div><Footer /></>);
  if (!car) return (<><Navbar /><div style={{ textAlign: 'center', padding: '4rem' }}>Car not found</div><Footer /></>);

  const images = car.images || [];
  const currentImage = images[selectedImage] || images[0];

  return (
    <>
      <Navbar />
      <div className="car-detail">
        <div className="car-detail-grid">
          {/* Left - Gallery & Info */}
          <div>
            <div className="car-gallery">
              <Image className="car-gallery-main" src={getImageUrl(currentImage?.url)} alt={`${car.make} ${car.model}`} width={1200} height={420} priority />
              {images.length > 1 && (
                <div className="car-gallery-thumbs">
                  {images.map((img: CarImage, i: number) => (
                    <div key={img.id} className={`car-gallery-thumb ${i === selectedImage ? 'active' : ''}`} onClick={() => setSelectedImage(i)}>
                      <Image src={getImageUrl(img.url)} alt="" width={80} height={60} objectFit="cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <div className="car-detail-badges">
                {car.featured && <span className="badge badge-condition">Featured</span>}
                <span className="badge badge-condition">ID: ND-{car.id.slice(0, 5).toUpperCase()}</span>
              </div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{car.year} {car.make} {car.model}</h1>
              <p style={{ color: 'var(--grey-400)', marginTop: '0.3rem' }}>📍 {car.location || `${car.city}, ${car.state}`}</p>
              <div className="car-detail-badges">
                {car.verified && <span className="detail-badge">✓ Verified Seller</span>}
                <span className="detail-badge">🚗 {conditionLabel(car.condition)}</span>
              </div>
            </div>

            {/* Specs */}
            <div className="specs-card">
              <h3>Vehicle Specifications</h3>
              <div className="specs-grid">
                <div className="spec-item"><label>Mileage</label><span>🏁 {car.mileage?.toLocaleString() || 'N/A'} km</span></div>
                <div className="spec-item"><label>Engine</label><span>⚙️ {car.engine || 'N/A'}</span></div>
                <div className="spec-item"><label>Transmission</label><span>🔧 {car.transmission === 'automatic' ? 'Automatic' : car.transmission === 'manual' ? 'Manual' : 'CVT'}</span></div>
                <div className="spec-item"><label>Fuel Type</label><span>⛽ {car.fuelType?.charAt(0).toUpperCase() + car.fuelType?.slice(1)}</span></div>
                <div className="spec-item"><label>VIN</label><span>🔑 {car.vin || 'N/A'}</span></div>
                <div className="spec-item"><label>Exterior Color</label><span>🎨 {car.color || 'N/A'}</span></div>
              </div>
            </div>

            {/* Description */}
            <div className="description-card">
              <h3>Seller&apos;s Description</h3>
              <p>{car.description}</p>
            </div>

            {/* Safety Tips */}
            <div className="safety-tips">
              <h4>⚠️ Safety Tips for Buyers</h4>
              <ul>
                <li>Meet the seller in a safe, public place like a police station or shopping mall.</li>
                <li>Inspect the vehicle thoroughly and take it for a test drive before paying.</li>
                <li>Do not pay in advance. Only pay after you have seen the car and verified documents.</li>
              </ul>
            </div>

            {/* Similar */}
            {similar.length > 0 && (
              <div className="similar-section">
                <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>Similar Listings</h2>
                <div className="car-grid">
                  {similar.map((c) => <CarCard key={c.id} car={c} />)}
                </div>
              </div>
            )}
          </div>

          {/* Right - Price/Contact Card */}
          <div className="car-info-card">
            <div className="car-price-label">Asking Price</div>
            <div className="car-price">{formatPrice(car.price)}</div>

            {car.user && (
              <div className="seller-info">
                <div className="seller-avatar">{car.user.firstName?.[0]}{car.user.lastName?.[0]}</div>
                <div>
                  <div className="seller-name">
                    {car.user.firstName} {car.user.lastName}
                    {car.user.verified && <span className="verified-badge">✓</span>}
                  </div>
                  <div className="seller-since">Registered {new Date(car.user.createdAt).getFullYear()}</div>
                </div>
              </div>
            )}

            <div className="contact-buttons">
              <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={() => setShowPhone(true)}>
                {showPhone ? `📞 ${car.user?.phone || 'No phone number'}` : '📞 Show Contact Number'}
              </button>
              <button className="btn btn-whatsapp btn-lg" style={{ width: '100%' }}
                onClick={() => window.open(`https://wa.me/${car.user?.phone?.replace(/^0/, '234')}?text=Hi, I'm interested in your ${car.year} ${car.make} ${car.model} on NaijaDrive`, '_blank')}>
                💬 WhatsApp Message
              </button>
            </div>

            {/* Send Message Form */}
            {messageSent ? (
              <div style={{ background: '#DCFCE7', padding: '1rem', borderRadius: 'var(--radius-sm)', textAlign: 'center', color: '#15803D' }}>
                ✅ Message sent successfully!
              </div>
            ) : (
              <div style={{ borderTop: '1px solid var(--grey-100)', paddingTop: '1rem' }}>
                <h4 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>📧 Send Message</h4>
                <div className="form-group">
                  <input className="form-input" placeholder="Your Name" value={contactForm.buyerName} onChange={(e) => setContactForm({ ...contactForm, buyerName: e.target.value })} />
                </div>
                <div className="form-group">
                  <input className="form-input" placeholder="Your Email" value={contactForm.buyerEmail} onChange={(e) => setContactForm({ ...contactForm, buyerEmail: e.target.value })} />
                </div>
                <div className="form-group">
                  <input className="form-input" placeholder="Phone (optional)" value={contactForm.buyerPhone} onChange={(e) => setContactForm({ ...contactForm, buyerPhone: e.target.value })} />
                </div>
                <div className="form-group">
                  <textarea className="form-input" rows={3} placeholder="I'm interested in this vehicle..." value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} style={{ resize: 'vertical' }} />
                </div>
                <button className="btn btn-navy" style={{ width: '100%' }} onClick={handleSendMessage}>Send Message</button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
