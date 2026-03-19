'use client';
import { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { api } from '@/lib/api';

const steps = ['Basic Specs', 'Pricing & Location', 'Photos', 'Review'];

import { CarCondition, TransmissionType, FuelType, BodyType } from '@/types';

interface SellForm {
  make: string;
  model: string;
  year: string;
  transmission: TransmissionType;
  fuelType: FuelType;
  bodyType: BodyType;
  condition: CarCondition;
  engine: string;
  color: string;
  mileage: string;
  price: string;
  city: string;
  state: string;
  location: string;
  description: string;
  vin: string;
}

export default function SellPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<SellForm>({
    make: '', model: '', year: '',
    transmission: TransmissionType.AUTOMATIC,
    fuelType: FuelType.PETROL,
    bodyType: BodyType.SEDAN,
    condition: CarCondition.FOREIGN_USED,
    engine: '', color: '', mileage: '', price: '', city: '', state: '', location: '', description: '', vin: ''
  });
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      window.location.href = '/auth/login';
    } else {
      setAuthChecked(true);
    }
  }, []);

  const update = (key: keyof SellForm, value: string) => setForm({ ...form, [key]: value });

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 12) return;
    setImages([...images, ...files]);
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (i: number) => {
    URL.revokeObjectURL(previews[i]);
    setImages(images.filter((_, idx) => idx !== i));
    setPreviews(previews.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) { window.location.href = '/auth/login'; return; }
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) formData.append(k, v as string); });
      images.forEach((img) => formData.append('images', img));
      await api.cars.create(formData);
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!authChecked) return <div className="loading" style={{ height: '100vh' }}><div className="spinner" /></div>;

  if (success) return (
    <><Navbar />
      <div className="sell-page" style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
        <h1>Listing Published!</h1>
        <p style={{ color: 'var(--grey-400)', margin: '1rem 0 2rem' }}>Your car listing will be reviewed and approved within 24 hours.</p>
        <a href="/dashboard" className="btn btn-primary btn-lg">Go to Dashboard</a>
      </div><Footer /></>
  );

  const validateStep = () => {
    setError(null);
    if (step === 0) {
      if (!form.make || !form.model || !form.year) {
        setError('Please fill in all basic specifications (Make, Model, Year)');
        return false;
      }
    } else if (step === 1) {
      if (!form.price || !form.city || !form.state) {
        setError('Please provide price and location details');
        return false;
      }
    } else if (step === 2) {
      if (images.length === 0) {
        setError('Please upload at least one photo of the vehicle');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) setStep(step + 1);
  };

  return (
    <>
      <Navbar />
      <div className="sell-page">
        <div style={{ color: 'var(--green)', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem' }}>🚗 REVIEW & PUBLISH</div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1rem' }}>Sell Your Car</h1>

        {/* Steps */}
        <div className="sell-steps">
          {steps.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {i > 0 && <div className="sell-step-divider" />}
              <div className={`sell-step ${i === step ? 'active' : i < step ? 'completed' : ''}`}>
                <div className="sell-step-num">{i < step ? '✓' : i + 1}</div>
                {s}
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="error-message" style={{ marginBottom: '1.5rem', animation: 'shake 0.5s ease-in-out' }}>
            ⚠️ {error}
          </div>
        )}

        <div className="sell-card">
          {/* Step 1 - Basic Specs */}
          {step === 0 && (<>
            <h2>Basic Specs</h2>
            <p className="subtitle">Tell us about your vehicle</p>
            <div className="form-row">
              <div className="form-group"><label>Make</label><input className="form-input" value={form.make} onChange={(e) => update('make', e.target.value)} placeholder="Toyota" required /></div>
              <div className="form-group"><label>Model</label><input className="form-input" value={form.model} onChange={(e) => update('model', e.target.value)} placeholder="Camry" required /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Year</label><input className="form-input" type="number" value={form.year} onChange={(e) => update('year', e.target.value)} placeholder="2022" required /></div>
              <div className="form-group"><label>Mileage (km)</label><input className="form-input" type="number" value={form.mileage} onChange={(e) => update('mileage', e.target.value)} placeholder="12000" /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Transmission</label><select className="form-input" value={form.transmission} onChange={(e) => update('transmission', e.target.value)}><option value="automatic">Automatic</option><option value="manual">Manual</option><option value="cvt">CVT</option></select></div>
              <div className="form-group"><label>Fuel Type</label><select className="form-input" value={form.fuelType} onChange={(e) => update('fuelType', e.target.value)}><option value="petrol">Petrol</option><option value="diesel">Diesel</option><option value="electric">Electric</option><option value="hybrid">Hybrid</option></select></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Body Type</label><select className="form-input" value={form.bodyType} onChange={(e) => update('bodyType', e.target.value)}><option value="sedan">Sedan</option><option value="suv">SUV</option><option value="hatchback">Hatchback</option><option value="truck">Truck</option><option value="coupe">Coupe</option><option value="luxury">Luxury</option></select></div>
              <div className="form-group"><label>Condition</label><select className="form-input" value={form.condition} onChange={(e) => update('condition', e.target.value)}><option value="foreign_used">Foreign Used (Tokunbo)</option><option value="nigerian_used">Nigerian Used</option><option value="brand_new">Brand New</option></select></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Engine</label><input className="form-input" value={form.engine} onChange={(e) => update('engine', e.target.value)} placeholder="2.5L 4-Cyl" /></div>
              <div className="form-group"><label>Color</label><input className="form-input" value={form.color} onChange={(e) => update('color', e.target.value)} placeholder="Silver" /></div>
            </div>
          </>)}

          {/* Step 2 - Pricing */}
          {step === 1 && (<>
            <h2>Pricing & Location</h2>
            <p className="subtitle">Set your price and location</p>
            <div className="form-group"><label>Asking Price (₦)</label><input className="form-input" type="number" value={form.price} onChange={(e) => update('price', e.target.value)} placeholder="25000000" required /></div>
            <div className="form-row">
              <div className="form-group"><label>City</label><input className="form-input" value={form.city} onChange={(e) => update('city', e.target.value)} placeholder="Lagos" /></div>
              <div className="form-group"><label>State</label><select className="form-input" value={form.state} onChange={(e) => update('state', e.target.value)}><option value="">Select State</option><option value="Lagos">Lagos</option><option value="FCT">Abuja (FCT)</option><option value="Rivers">Rivers</option><option value="Oyo">Oyo</option><option value="Kano">Kano</option></select></div>
            </div>
            <div className="form-group"><label>Full Address</label><input className="form-input" value={form.location} onChange={(e) => update('location', e.target.value)} placeholder="Lekki Phase 1, Lagos" /></div>
            <div className="form-group"><label>VIN (optional)</label><input className="form-input" value={form.vin} onChange={(e) => update('vin', e.target.value)} placeholder="4T1B11HK5P1****" /></div>
            <div className="form-group"><label>Description</label><textarea className="form-input" rows={5} value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Describe your vehicle in detail..." style={{ resize: 'vertical' }} /></div>
          </>)}

          {/* Step 3 - Photos */}
          {step === 2 && (<>
            <h2>Photos</h2>
            <p className="subtitle">Add photos of your vehicle (max 12)</p>
            <input type="file" ref={fileRef} accept="image/*" multiple hidden onChange={handleImages} />
            <div className="image-upload-zone" onClick={() => fileRef.current?.click()}>
              <div style={{ fontSize: '3rem' }}>📷</div>
              <h4>Click to upload photos</h4>
              <p>JPEG, PNG, WebP • Max 5MB each</p>
            </div>
            {previews.length > 0 && (
              <div className="image-previews">
                {previews.map((p, i) => (
                  <div className="image-preview" key={i}>
                    {/* <img src={p} alt="" /> */}
                    <Image src={p} alt="" />
                    <button className="image-preview-remove" onClick={() => removeImage(i)}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </>)}

          {/* Step 4 - Review */}
          {step === 3 && (<>
            <h2>Review & Publish</h2>
            <p className="subtitle">Verify your details before publishing</p>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {[
                ['Vehicle', `${form.make} ${form.model} ${form.year}`],
                ['Price', `₦${Number(form.price).toLocaleString()}`],
                ['Location', `${form.city}, ${form.state}`],
                ['Condition', form.condition.replace('_', ' ')],
                ['Photos', `${images.length} uploaded`],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--grey-50)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ color: 'var(--grey-400)' }}>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </>)}

          {/* Navigation */}
          <div className="sell-actions">
            {step > 0 ? <button className="btn btn-secondary" onClick={() => setStep(step - 1)}>Back</button> : <div />}
            {step < 3 ? (
              <button className="btn btn-primary" onClick={handleNext}>Continue</button>
            ) : (
              <button className="btn btn-primary btn-lg" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Publishing...' : '🚀 Publish Listing'}
              </button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
