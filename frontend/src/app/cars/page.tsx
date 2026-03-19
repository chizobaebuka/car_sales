'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CarCard from '@/components/CarCard';
import { api } from '@/lib/api';

import { Car } from '@/types';

function CarsContent() {
  const searchParams = useSearchParams();
  const [cars, setCars] = useState<Car[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('');

  // Initialize state directly from searchParams
  const [filters, setFilters] = useState<Record<string, string>>(() => {
    const params: Record<string, string> = {};
    if (searchParams) {
      searchParams.forEach((value, key) => { params[key] = value; });
    }
    return params;
  });

  // Intercept searchParams changes during rendering to avoid useEffect cascading renders
  const [prevSearchParams, setPrevSearchParams] = useState(searchParams);
  if (searchParams !== prevSearchParams) {
    setPrevSearchParams(searchParams);
    const params: Record<string, string> = {};
    if (searchParams) {
      searchParams.forEach((value, key) => { params[key] = value; });
    }
    setFilters(params);
  }

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      window.location.href = '/auth/login';
      return;
    }

    const params: Record<string, string> = { ...filters, page: String(page), limit: '12' };
    if (sort) params.sort = sort;

    api.cars.list(params)
      .then((data) => {
        setCars(data.cars || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [filters, page, sort]);

  const updateFilter = (key: string, value: string) => {
    setLoading(true);
    const newFilters = { ...filters };
    if (value) newFilters[key] = value;
    else delete newFilters[key];
    setFilters(newFilters);
    setPage(1);
  };

  const handleSetSort = (newSort: string) => {
    setLoading(true);
    setSort(newSort);
  };

  const handleSetPage = (newPage: number) => {
    setLoading(true);
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setLoading(true);
    setFilters({});
    setPage(1);
  };

  return (
    <>
      <Navbar />
      <div className="search-page">
        <div style={{ marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--grey-400)' }}>
          Home &gt; Search Results
        </div>
        <div className="search-layout">
          {/* Sidebar Filters */}
          <aside className="filter-sidebar">
            <div className="filter-header">
              <h3>Filters</h3>
              <button className="filter-reset" onClick={handleResetFilters}>Reset All</button>
            </div>

            <div className="filter-group">
              <div className="filter-group-header"><h4>Year</h4></div>
              <div className="filter-options">
                {['2024', '2023', '2022', '2021', '2020'].map((y) => (
                  <label className="filter-option" key={y}>
                    <input type="checkbox" checked={filters.minYear === y}
                      onChange={(e) => updateFilter('minYear', e.target.checked ? y : '')} />
                    {y}{y === '2024' ? ' - New' : '+'}
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <div className="filter-group-header"><h4>Price Range</h4></div>
              <div className="price-range">
                <input type="text" placeholder="₦2M" value={filters.minPrice || ''} onChange={(e) => updateFilter('minPrice', e.target.value)} />
                <span>-</span>
                <input type="text" placeholder="₦50M+" value={filters.maxPrice || ''} onChange={(e) => updateFilter('maxPrice', e.target.value)} />
              </div>
            </div>

            <div className="filter-group">
              <div className="filter-group-header"><h4>Body Type</h4></div>
              <select className="filter-select" value={filters.bodyType || ''} onChange={(e) => updateFilter('bodyType', e.target.value)}>
                <option value="">All Types</option>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="hatchback">Hatchback</option>
                <option value="truck">Truck</option>
                <option value="coupe">Coupe</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>

            <div className="filter-group">
              <div className="filter-group-header"><h4>Transmission</h4></div>
              <select className="filter-select" value={filters.transmission || ''} onChange={(e) => updateFilter('transmission', e.target.value)}>
                <option value="">All</option>
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
                <option value="cvt">CVT</option>
              </select>
            </div>

            <div className="filter-group">
              <div className="filter-group-header"><h4>Make</h4></div>
              <select className="filter-select" value={filters.make || ''} onChange={(e) => updateFilter('make', e.target.value)}>
                <option value="">All Makes</option>
                <option value="Toyota">Toyota</option>
                <option value="Honda">Honda</option>
                <option value="Mercedes-Benz">Mercedes-Benz</option>
                <option value="Lexus">Lexus</option>
                <option value="BMW">BMW</option>
                <option value="Kia">Kia</option>
                <option value="Jeep">Jeep</option>
              </select>
            </div>
          </aside>

          {/* Results */}
          <main>
            <div className="results-header">
              <div className="results-count">
                <h2>{total} Results Found</h2>
                <span>Available cars in Nigeria</span>
              </div>
              <div className="results-sort">
                <button className={`sort-btn ${sort === 'year_desc' ? 'active' : ''}`} onClick={() => handleSetSort('year_desc')}>Highest Year</button>
                <button className={`sort-btn ${sort === 'price_asc' ? 'active' : ''}`} onClick={() => handleSetSort('price_asc')}>Lowest Price</button>
                <button className={`sort-btn ${sort === 'price_desc' ? 'active' : ''}`} onClick={() => handleSetSort('price_desc')}>Highest Price</button>
              </div>
            </div>

            {loading ? (
              <div className="loading"><div className="spinner" /></div>
            ) : cars.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--grey-400)' }}>
                <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>No cars found matching your criteria</p>
                <button className="btn btn-primary" onClick={handleResetFilters}>Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="car-grid">
                  {cars.map((car) => <CarCard key={car.id} car={car} />)}
                </div>
                {totalPages > 1 && (
                  <div className="pagination">
                    <button className="page-btn" disabled={page === 1} onClick={() => handleSetPage(page - 1)}>‹</button>
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                      <button key={p} className={`page-btn ${page === p ? 'active' : ''}`} onClick={() => handleSetPage(p)}>{p}</button>
                    ))}
                    {totalPages > 5 && <span style={{ padding: '8px' }}>...</span>}
                    {totalPages > 5 && <button className="page-btn" onClick={() => handleSetPage(totalPages)}>{totalPages}</button>}
                    <button className="page-btn" disabled={page === totalPages} onClick={() => handleSetPage(page + 1)}>›</button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function CarsPage() {
  return (
    <Suspense fallback={<div className="loading" style={{ height: '100vh' }}><div className="spinner" /></div>}>
      <CarsContent />
    </Suspense>
  );
}
