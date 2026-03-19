'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { api, getImageUrl } from '@/lib/api';
import { formatPrice, formatNumber } from '@/lib/utils';
import { User, DashboardStats, Car, Lead, CarImage } from '@/types';
import Image from 'next/image';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [listings, setListings] = useState<Car[]>([]);
  const [leads, setLeads] = useState<{ leads: Lead[], total: number }>({ leads: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inventory');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { window.location.href = '/auth/login'; return; }
    const userData = localStorage.getItem('user');
    let currentUser: User | null = null;
    if (userData) {
      try { currentUser = JSON.parse(userData); } catch { }
    }

    Promise.all([
      api.cars.dashboard().catch(() => null),
      api.cars.myListings({ limit: '20' }).catch(() => ({ cars: [], total: 0, page: 1, totalPages: 1 })),
      api.leads.my().catch(() => ({ leads: [], total: 0 })),
    ]).then(([s, l, ld]) => {
      setUser(currentUser);
      setStats(s);
      setListings(l?.cars || []);
      setLeads(ld || { leads: [], total: 0 });
    }).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this listing?')) return;
    try {
      await api.cars.delete(id);
      setListings(listings.filter((l) => l.id !== id));
    } catch { }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await api.cars.update(id, { status } as Partial<Car>);
      setListings(listings.map((l) => l.id === id ? { ...l, status } as Car : l));
    } catch { }
  };

  if (loading) return (<><Navbar /><div className="loading" style={{ minHeight: '60vh' }}><div className="spinner" /></div></>);

  return (
    <>
      <Navbar />
      <div className="dashboard">
        <div className="dashboard-header">
          <div>
            <h1>Dealer Dashboard</h1>
            <p>Welcome back, {user?.firstName}! {user?.businessName ? `(${user.businessName})` : ''}</p>
          </div>
          <Link href="/sell" className="btn btn-primary">+ Add Listing</Link>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">👁️</div>
            <div className="stat-label">Total Views</div>
            <div className="stat-value">{formatNumber(stats?.totalViews || 0)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon red">👥</div>
            <div className="stat-label">Total Leads</div>
            <div className="stat-value">{leads.total}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">📋</div>
            <div className="stat-label">Active Listings</div>
            <div className="stat-value">{stats?.activeListings || 0}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange">✅</div>
            <div className="stat-label">Cars Sold</div>
            <div className="stat-value">{stats?.soldListings || 0}</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <button className={`sort-btn ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>Inventory</button>
          <button className={`sort-btn ${activeTab === 'leads' ? 'active' : ''}`} onClick={() => setActiveTab('leads')}>Leads ({leads.total})</button>
        </div>

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div className="inventory-card">
            <div className="inventory-header">
              <h3>Inventory Management</h3>
              <div className="inventory-actions">
                <Link href="/sell" className="btn btn-sm btn-primary">+ Add</Link>
              </div>
            </div>
            {listings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--grey-400)' }}>
                <p style={{ marginBottom: '1rem' }}>No listings yet</p>
                <Link href="/sell" className="btn btn-primary">Create Your First Listing</Link>
              </div>
            ) : (
              <table className="inventory-table">
                <thead>
                  <tr>
                    <th>Vehicle Details</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Views</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((car) => {
                    const img = car.images?.find((i: CarImage) => i.isPrimary) || car.images?.[0];
                    return (
                      <tr key={car.id}>
                        <td>
                          <div className="inventory-car-info">
                            {/* <img className="inventory-car-thumb" src={getImageUrl(img?.url)} alt="" /> */}
                            <Image className="inventory-car-thumb" src={getImageUrl(img?.url)} alt="" />
                            <div>
                              <div className="inventory-car-name">{car.year} {car.make} {car.model}</div>
                              <div className="inventory-car-trim">{car.engine} • {car.mileage?.toLocaleString() || '0'}km</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ fontWeight: 600 }}>{formatPrice(car.price)}</td>
                        <td>
                          <select className={`status-badge status-${car.status}`} value={car.status} onChange={(e) => handleStatusChange(car.id, e.target.value)} style={{ border: 'none', cursor: 'pointer' }}>
                            <option value="active">Active</option>
                            <option value="pending">Pending</option>
                            <option value="sold">Sold</option>
                            <option value="draft">Draft</option>
                          </select>
                        </td>
                        <td>{car.views?.toLocaleString()}</td>
                        <td>
                          <Link href={`/car/${car.id}`} className="action-btn" title="View">👁️</Link>
                          <button className="action-btn delete" onClick={() => handleDelete(car.id)} title="Delete">🗑️</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Leads Tab */}
        {activeTab === 'leads' && (
          <div className="inventory-card">
            <div className="inventory-header">
              <h3>Customer Leads</h3>
            </div>
            {leads.leads.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--grey-400)' }}>No leads yet</div>
            ) : (
              <table className="inventory-table">
                <thead>
                  <tr><th>Buyer</th><th>Car</th><th>Message</th><th>Status</th><th>Date</th></tr>
                </thead>
                <tbody>
                  {leads.leads.map((lead: Lead) => (
                    <tr key={lead.id}>
                      <td>
                        <div><strong>{lead.buyerName}</strong></div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--grey-400)' }}>{lead.buyerEmail}</div>
                        {lead.buyerPhone && <div style={{ fontSize: '0.8rem', color: 'var(--grey-400)' }}>{lead.buyerPhone}</div>}
                      </td>
                      <td>{lead.car ? `${lead.car.year} ${lead.car.make} ${lead.car.model}` : 'N/A'}</td>
                      <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lead.message || '-'}</td>
                      <td><span className={`status-badge status-${lead.status === 'new' ? 'active' : lead.status === 'contacted' ? 'pending' : 'sold'}`}>{lead.status}</span></td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--grey-400)' }}>{new Date(lead.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
