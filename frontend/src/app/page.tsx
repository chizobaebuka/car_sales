'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CarCard from '@/components/CarCard';
import { api } from '@/lib/api';

import { Car } from '@/types';
import Image from 'next/image';

export default function HomePage() {
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);
  const [searchMake, setSearchMake] = useState('');
  const [searchModel, setSearchModel] = useState('');
  const [searchPrice, setSearchPrice] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      requestAnimationFrame(() => setIsLoggedIn(true));
    }
  }, []);

  useEffect(() => {
    api.cars.list({ featured: 'true', limit: '6' })
      .then((data) => setFeaturedCars(data.cars || []))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchMake) params.set('make', searchMake);
    if (searchModel) params.set('model', searchModel);
    if (searchPrice) params.set('maxPrice', searchPrice);
    if (searchLocation) params.set('state', searchLocation);
    window.location.href = `/cars?${params.toString()}`;
  };

  const categories = [
    { name: 'Sedans', img: '/images/sedan.png', type: 'sedan' },
    { name: 'SUVs', img: '/images/suv.png', type: 'suv' },
    { name: 'Luxury', img: '/images/luxury.png', type: 'luxury' },
    { name: 'Trucks', img: '/images/truck.png', type: 'truck' },
    { name: 'Hatchbacks', img: '/images/hatchback.png', type: 'hatchback' },
  ];

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">Verified Nigerian Sellers</div>
            <h1>Find Your Perfect<br />Drive in Nigeria</h1>
            <p>Browse thousands of verified cars from trusted dealers across Lagos, Abuja, Port Harcourt, and more.</p>
            {isLoggedIn && (
              <div className="hero-buttons">
                <Link href="/cars" className="btn btn-primary btn-lg">Find Your Next Car</Link>
                <Link href="/sell" className="btn btn-secondary btn-lg">Sell Your Car</Link>
              </div>
            )}
          </div>
          <div className="hero-image">
            <Image src="/images/hero-banner.png" alt="Premium car showroom" width={500} height={500} />
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="search-section">
        <div className="search-card">
          <div className="search-header">🔍 Advanced Search</div>
          <div className="search-grid">
            <div className="search-field">
              <label>Make</label>
              <select value={searchMake} onChange={(e) => setSearchMake(e.target.value)}>
                <option value="">Select Make</option>
                <option value="Toyota">Toyota</option>
                <option value="Honda">Honda</option>
                <option value="Mercedes-Benz">Mercedes-Benz</option>
                <option value="Lexus">Lexus</option>
                <option value="BMW">BMW</option>
                <option value="Kia">Kia</option>
                <option value="Jeep">Jeep</option>
              </select>
            </div>
            <div className="search-field">
              <label>Model</label>
              <input type="text" placeholder="e.g. Camry, Civic" value={searchModel} onChange={(e) => setSearchModel(e.target.value)} />
            </div>
            <div className="search-field">
              <label>Price Range</label>
              <select value={searchPrice} onChange={(e) => setSearchPrice(e.target.value)}>
                <option value="">₦1M - ₦50M+</option>
                <option value="10000000">Under ₦10M</option>
                <option value="20000000">Under ₦20M</option>
                <option value="30000000">Under ₦30M</option>
                <option value="50000000">Under ₦50M</option>
              </select>
            </div>
            <div className="search-field">
              <label>Location</label>
              <select value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)}>
                <option value="">All Nigeria</option>
                <option value="Lagos">Lagos</option>
                <option value="FCT">Abuja</option>
                <option value="Rivers">Port Harcourt</option>
                <option value="Oyo">Ibadan</option>
              </select>
            </div>
          </div>
          <div style={{ textAlign: 'right', marginTop: '1rem' }}>
            <button className="btn btn-primary" onClick={handleSearch}>Search Cars</button>
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Featured Verified Cars</h2>
            <p className="section-subtitle">Quality pre-owned and new vehicles</p>
          </div>
          <Link href="/cars" className="section-link">View all cars →</Link>
        </div>
        {loading ? (
          <div className="loading"><div className="spinner" /></div>
        ) : (
          <div className="car-grid">
            {featuredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Browse by Category</h2>
            <p className="section-subtitle">Find exactly what you need</p>
          </div>
        </div>
        <div className="categories-grid">
          {categories.map((cat) => (
            <Link href={`/cars?bodyType=${cat.type}`} key={cat.type}>
              <div className="category-card">
                <Image src={cat.img} alt={cat.name} width={500} height={500} />
                <h4>{cat.name}</h4>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2 className="section-title">How NaijaDrive Works for You</h2>
        <div className="steps-grid">
          <div className="step">
            <div className="step-icon blue">🔍</div>
            <h3>1. Browse & Filter</h3>
            <p>Search through thousands of verified listings by make, budget, and Nigerian location to find your match.</p>
          </div>
          <div className="step">
            <div className="step-icon green">✓</div>
            <h3>2. Verified Inspection</h3>
            <p>Every verified car on our platform undergoes a rigorous 150-point inspection by our certified mechanics.</p>
          </div>
          <div className="step">
            <div className="step-icon teal">🔒</div>
            <h3>3. Safe Transaction</h3>
            <p>Contact sellers directly via phone or WhatsApp. We handle the verification so you can buy with confidence.</p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
