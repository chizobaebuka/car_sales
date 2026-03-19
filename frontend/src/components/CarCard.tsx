'use client';
import Link from 'next/link';
import { formatPrice, conditionLabel } from '@/lib/utils';
import { getImageUrl } from '@/lib/api';

import { Car, CarImage } from '@/types';
import Image from 'next/image';

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  const primaryImage = car.images?.find((img: CarImage) => img.isPrimary) || car.images?.[0];

  return (
    <div className="car-card">
      <Link href={`/car/${car.id}`}>
        <div className="car-card-image">
          <Image src={getImageUrl(primaryImage?.url)} alt={`${car.year} ${car.make} ${car.model}`} width={500} height={500} />
          <div className="car-card-badges">
            <span className="badge badge-condition">{conditionLabel(car.condition)}</span>
            {car.verified && <span className="badge badge-verified">✓ Verified Dealer</span>}
          </div>
          <button className="car-card-fav" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>♡</button>
        </div>
        <div className="car-card-body">
          <div className="car-card-title-row">
            <span className="car-card-title">{car.make} {car.model} {car.year}</span>
            <span className="car-card-price">{formatPrice(car.price)}</span>
          </div>
          <div className="car-card-specs">
            {car.mileage && <span className="car-card-spec">🏁 {(car.mileage / 1000).toFixed(0)}k km</span>}
            <span className="car-card-spec">⚙️ {car.transmission === 'automatic' ? 'Automatic' : car.transmission === 'manual' ? 'Manual' : 'CVT'}</span>
            {car.city && <span className="car-card-spec">📍 {car.city}</span>}
          </div>
          <button className="car-card-btn">View Details</button>
        </div>
      </Link>
    </div>
  );
}
