import { Search, X } from 'lucide-react';
import Input from '../common/Input.jsx';
import Select from '../common/Select.jsx';
import Button from '../common/Button.jsx';
import { FUEL_TYPES, TRANSMISSIONS, SEAT_OPTIONS } from '../../constants/index.js';

const CITIES = [
  { value: 'Pune', label: 'Pune' },
  { value: 'Delhi', label: 'Delhi-NCR' },
  { value: 'Mumbai', label: 'Mumbai' },
  { value: 'Bangalore', label: 'Bangalore' },
  { value: 'Hyderabad', label: 'Hyderabad' },
  { value: 'Chennai', label: 'Chennai' },
  { value: 'Bellary', label: 'Bellary' },
];

const CarFilters = ({ filters, onChange, onReset }) => {
  const update = (key) => (e) => onChange({ [key]: e.target.value });

  return (
    <div className="space-y-5 rounded-2xl border border-gray-100 dark:border-gray-800/80 bg-white/70 dark:bg-luxury-deep/70 backdrop-blur-md p-6 shadow-sm">
      <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800/85">
        <h3 className="font-display text-base font-bold text-gray-900 dark:text-luxury-ivory">Filters</h3>
        <button type="button" onClick={onReset} className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-primary-600 transition-colors">
          <X className="h-3.5 w-3.5" /> Reset
        </button>
      </div>

      <Input
        placeholder="Search by name or brand"
        icon={Search}
        value={filters.q}
        onChange={update('q')}
      />

      <Select
        label="City"
        placeholder="Select City"
        options={CITIES}
        value={filters.location}
        onChange={update('location')}
      />

      <Select
        label="Fuel Type"
        placeholder="Any fuel type"
        options={FUEL_TYPES}
        value={filters.fuelType}
        onChange={update('fuelType')}
      />

      <Select
        label="Transmission"
        placeholder="Any transmission"
        options={TRANSMISSIONS}
        value={filters.transmission}
        onChange={update('transmission')}
      />

      <Select
        label="Minimum Seats"
        placeholder="Any"
        options={SEAT_OPTIONS}
        value={filters.seats}
        onChange={update('seats')}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input label="Min Price/day" type="number" min="0" value={filters.minPrice} onChange={update('minPrice')} />
        <Input label="Max Price/day" type="number" min="0" value={filters.maxPrice} onChange={update('maxPrice')} />
      </div>

      <Select
        label="Sort By"
        options={[
          { value: '-createdAt', label: 'Newest First' },
          { value: 'pricePerDay', label: 'Price: Low to High' },
          { value: '-pricePerDay', label: 'Price: High to Low' },
          { value: '-ratingAvg', label: 'Top Rated' },
        ]}
        value={filters.sort}
        onChange={update('sort')}
      />
    </div>
  );
};

export default CarFilters;
